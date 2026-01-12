import { loadModel, warmupModel, detectOnce, setBackend, getMeta } from './detector.js';
import { drawDetections, clearCanvas, resizeCanvas } from './renderer.js';
import { toggleROI, roiEnabled, applyROI, drawROIOverlay } from './roi.js';
import { runBatch } from './batch.js';
import { renderClassFilters, renderLegend, renderCounts, setMessage } from './ui.js';
import { createTracker } from './tracker.js';

const videoEl = document.getElementById('webcam');
const canvasEl = document.getElementById('overlay');
const loadingEl = document.getElementById('loading');
const statusChip = document.getElementById('model-status');
const modelMetaEl = document.getElementById('model-meta');
const messagesEl = document.getElementById('messages');
const fpsEl = document.getElementById('fps');
const timingEl = document.getElementById('timing');
const legendEl = document.getElementById('legend');
const countsEl = document.getElementById('counts');
const explainEl = document.getElementById('explain');
const roiStatusEl = document.getElementById('roi-status');
const trackingStatusEl = document.getElementById('tracking-status');
const batchGalleryEl = document.getElementById('batch-gallery');
const explainListEl = document.createElement('ul');
explainListEl.className = 'mini-list';
const explainHistoryEl = document.createElement('div');
explainHistoryEl.className = 'meta-box';
explainEl.appendChild(explainListEl);
explainEl.appendChild(explainHistoryEl);

const backendSelect = document.getElementById('backend-select');
const thresholdRange = document.getElementById('threshold');
const thresholdValue = document.getElementById('threshold-value');
const startWebcamBtn = document.getElementById('start-webcam');
const stopWebcamBtn = document.getElementById('stop-webcam');
const fileInput = document.getElementById('file-input');
const dropzone = document.getElementById('dropzone');
const runUploadBtn = document.getElementById('run-upload');
const screenshotBtn = document.getElementById('screenshot');
const toggleRoiBtn = document.getElementById('toggle-roi');
const toggleTrackingBtn = document.getElementById('toggle-tracking');
const batchInput = document.getElementById('batch-input');
const runBatchBtn = document.getElementById('run-batch');
const exportCsvBtn = document.getElementById('export-csv');

const state = {
  model: null,
  running: false,
  webcamStream: null,
  lastDetections: [],
  classFilter: new Set(),
  threshold: 0.5,
  rafId: null,
  colorMap: new Map(),
  batchResults: [],
  history: [],
  tracker: null,
  trackingEnabled: false
};

async function init() {
  setMessage(messagesEl, 'Loading TensorFlow backend…');
  updateStatus('Model: loading…');
  
  // Wait for TensorFlow.js and COCO-SSD to be available
  let attempts = 0;
  while ((!window.tf || !window.cocoSsd) && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    attempts++;
  }
  
  if (!window.tf) {
    console.error('TensorFlow.js failed to load from CDN');
    setMessage(messagesEl, 'TensorFlow.js failed to load. Check internet connection.');
    updateStatus('Model: failed to load');
    return;
  }
  
  if (!window.cocoSsd) {
    console.error('COCO-SSD failed to load from CDN');
    setMessage(messagesEl, 'COCO-SSD failed to load. Check internet connection.');
    updateStatus('Model: failed to load');
    return;
  }
  
  try {
    // Try WebGL first for best performance, fall back to CPU if fails
    const backend = await setBackend('webgl');
    updateStatus(`Model: loading… (${backend})`);
    state.model = await loadModel(msg => updateStatus(msg));
    await warmupModel(state.model);
    state.tracker = createTracker(); // Initialize object tracker
    updateMeta();
    loadingEl.style.display = 'none';
    enableControls();
    setMessage(
      messagesEl,
      'Ready. Steps: (1) pick backend if needed; (2) start webcam or upload media; (3) set confidence/filter; (4) optional ROI gate; (5) optional object tracking; (6) screenshot or batch as needed.'
    );
    renderLegend(legendEl, state.colorMap);
    renderClassFilters(document.getElementById('class-filters'), state.classFilter);
  } catch (err) {
    console.error(err);
    setMessage(messagesEl, 'Failed to load model. Check console.');
    updateStatus('Model: failed to load');
  }
}

function updateStatus(text) {
  statusChip.textContent = text;
}

function updateMeta() {
  const meta = getMeta();
  modelMetaEl.innerHTML = `Name: ${meta.name}<br />Size: ${meta.size}<br />Backend: ${meta.backend}<br />TF.js: ${meta.tfVersion}`;
}

function enableControls() {
  startWebcamBtn.disabled = false;
  runUploadBtn.disabled = false;
  screenshotBtn.disabled = false;
  runBatchBtn.disabled = false;
  exportCsvBtn.disabled = false;
}

backendSelect.addEventListener('change', async e => {
  try {
    const backend = await setBackend(e.target.value);
    updateMeta();
    setMessage(messagesEl, `Backend set to ${backend}.`);
    updateStatus(`Model: loaded (${backend})`);
  } catch (err) {
    console.error(err);
    setMessage(messagesEl, 'Backend switch failed. Check console.');
  }
});

thresholdRange.addEventListener('input', e => {
  state.threshold = Number(e.target.value);
  thresholdValue.textContent = e.target.value;
});

startWebcamBtn.addEventListener('click', async () => {
  if (state.running) return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    videoEl.srcObject = stream;
    state.webcamStream = stream;
    await videoEl.play();
    
    // Wait for video to actually have data before starting detection
    await new Promise(resolve => {
      const onCanPlay = () => {
        videoEl.removeEventListener('canplay', onCanPlay);
        resolve();
      };
      videoEl.addEventListener('canplay', onCanPlay);
      // Fallback timeout in case event doesn't fire
      setTimeout(resolve, 500);
    });
    
    resizeCanvas(videoEl, canvasEl);
    startWebcamBtn.disabled = true;
    stopWebcamBtn.disabled = false;
    runUploadBtn.disabled = true;
    fileInput.disabled = true;
    dropzone.classList.add('disabled');
    state.running = true;
    loopWebcam();
    setMessage(messagesEl, 'Webcam running. Use Stop to halt or adjust threshold/filters/ROI while running.');
  } catch (err) {
    console.error(err);
    setMessage(messagesEl, 'Camera permission denied or unavailable.');
  }
});

stopWebcamBtn.addEventListener('click', () => {
  stopWebcam();
  setMessage(messagesEl, 'Webcam stopped. You can upload media or restart webcam.');
});

fileInput.addEventListener('change', () => {
  runUploadBtn.disabled = fileInput.files.length === 0;
});

runUploadBtn.addEventListener('click', async () => {
  if (!fileInput.files.length) return;
  const file = fileInput.files[0];
  const url = URL.createObjectURL(file);
  const media = await loadMediaElement(url, file.type);
  await runSingleDetection(media);
  URL.revokeObjectURL(url);
});

['dragenter', 'dragover'].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.add('active');
  });
});
['dragleave', 'drop'].forEach(evt => {
  dropzone.addEventListener(evt, e => {
    e.preventDefault();
    dropzone.classList.remove('active');
  });
});
dropzone.addEventListener('drop', async e => {
  const file = e.dataTransfer.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const media = await loadMediaElement(url, file.type);
  await runSingleDetection(media);
  URL.revokeObjectURL(url);
});

screenshotBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = `screenshot-${Date.now()}.png`;
  link.href = canvasEl.toDataURL('image/png');
  link.click();
});

toggleRoiBtn.addEventListener('click', () => {
  const enabled = toggleROI(canvasEl);
  roiStatusEl.textContent = enabled ? 'ROI on' : 'ROI off';
  setMessage(
    messagesEl,
    enabled
      ? 'ROI on. Drag handles to resize or move. Only detections inside count.'
      : 'ROI off. All detections count.'
  );
});

toggleTrackingBtn.addEventListener('click', () => {
  state.trackingEnabled = !state.trackingEnabled;
  trackingStatusEl.textContent = state.trackingEnabled ? 'Tracking on' : 'Tracking off';
  if (state.trackingEnabled && state.tracker) {
    state.tracker.reset();
    setMessage(messagesEl, 'Tracking on. Objects will receive persistent IDs across frames.');
  } else {
    setMessage(messagesEl, 'Tracking off. Detection mode only.');
  }
});

batchInput.addEventListener('change', () => {
  runBatchBtn.disabled = batchInput.files.length === 0;
});

runBatchBtn.addEventListener('click', async () => {
  if (!batchInput.files.length || !state.model) return;
  
  // Disable buttons during batch processing
  runBatchBtn.disabled = true;
  exportCsvBtn.disabled = true;
  batchGalleryEl.innerHTML = '<p>Processing batch...</p>';
  setMessage(messagesEl, 'Processing batch detection...');
  
  try {
    const { results, gallery } = await runBatch(
      batchInput.files,
      state.model,
      state.threshold,
      state.classFilter,
      applyROI,
      state.colorMap
    );
    state.batchResults = results;
    batchGalleryEl.innerHTML = '';
    gallery.forEach(node => batchGalleryEl.appendChild(node));
    
    // Enable export button after batch completes
    exportCsvBtn.disabled = false;
    runBatchBtn.disabled = false;
    setMessage(messagesEl, `Batch complete: ${results.length} detections across ${gallery.length} images. Review overlays below; export CSV for summary.`);
  } catch (err) {
    console.error('Batch detection error:', err);
    batchGalleryEl.innerHTML = `<p style="color: red;">Error: ${err.message}</p>`;
    setMessage(messagesEl, `Batch detection failed: ${err.message}`);
    runBatchBtn.disabled = false;
  }
});

exportCsvBtn.addEventListener('click', () => {
  if (!state.batchResults.length) return;
  const header = 'filename,class,score,x,y,width,height\n';
  const rows = state.batchResults
    .map(r => `${r.file},${r.class},${r.score.toFixed(3)},${r.bbox[0]},${r.bbox[1]},${r.bbox[2]},${r.bbox[3]}`)
    .join('\n');
  const blob = new Blob([header + rows], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `webai-results-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

async function loadMediaElement(src, type) {
  return new Promise((resolve, reject) => {
    const isVideo = type.startsWith('video');
    const el = document.createElement(isVideo ? 'video' : 'img');
    el.src = src;
    el.onload = () => resolve(el);
    el.onloadeddata = () => resolve(el);
    el.onerror = reject;
    if (isVideo) el.muted = true;
  });
}

async function runSingleDetection(media) {
  clearCanvas(canvasEl);
  resizeCanvas(media, canvasEl);
  try {
    const start = performance.now();
    let detections = await detectOnce(state.model, media, state.threshold, state.classFilter, applyROI);
    
    // Apply tracking if enabled
    if (state.trackingEnabled && state.tracker) {
      detections = state.tracker.update(detections);
    }
    
    state.lastDetections = detections;
    const elapsed = performance.now() - start;
    timingEl.textContent = `Timing: ${elapsed.toFixed(1)} ms`;
    
    // Draw the media to the canvas first
    const ctx = canvasEl.getContext('2d');
    ctx.drawImage(media, 0, 0, canvasEl.width, canvasEl.height);
    
    drawDetections(canvasEl, detections, state.colorMap, state.trackingEnabled);
    drawROIOverlay(canvasEl);
    renderCounts(countsEl, detections);
    renderLegend(legendEl, state.colorMap);
    renderExplain(detections);
  } catch (err) {
    console.error(err);
    setMessage(messagesEl, 'Detection failed. Check console for details.');
  }
}

async function loopWebcam() {
  if (!state.running || !state.model) return;
  
  // Ensure canvas is visible and properly sized
  if (canvasEl.width === 0 || canvasEl.height === 0) {
    resizeCanvas(videoEl, canvasEl);
  }
  
  try {
    const start = performance.now();
    let detections = await detectOnce(state.model, videoEl, state.threshold, state.classFilter, applyROI);
    
    // Apply tracking if enabled
    if (state.trackingEnabled && state.tracker) {
      detections = state.tracker.update(detections);
    }
    
    state.lastDetections = detections;
    
    // Draw frame: clear canvas completely, draw video, draw detections, draw ROI
    clearCanvas(canvasEl);
    const ctx = canvasEl.getContext('2d');
    
    // Draw video frame onto canvas
    if (videoEl.videoWidth > 0 && videoEl.videoHeight > 0) {
      ctx.drawImage(videoEl, 0, 0, canvasEl.width, canvasEl.height);
    }
    
    drawDetections(canvasEl, detections, state.colorMap, state.trackingEnabled);
    drawROIOverlay(canvasEl);
    
    renderCounts(countsEl, detections);
    renderLegend(legendEl, state.colorMap);
    const elapsed = performance.now() - start;
    timingEl.textContent = `Timing: ${elapsed.toFixed(1)} ms`;
    const fps = elapsed ? (1000 / elapsed).toFixed(1) : '–';
    fpsEl.textContent = `FPS: ${fps}`;
    renderExplain(detections);
    renderExplain(detections);
  } catch (err) {
    console.error(err);
    setMessage(messagesEl, 'Webcam detection error. Stopping stream.');
    stopWebcam();
    return;
  }
  state.rafId = requestAnimationFrame(loopWebcam);
}

function renderExplain(detections) {
  explainListEl.innerHTML = '';
  if (!detections.length) {
    explainListEl.innerHTML = '<li>No detections</li>';
  } else {
    const top3 = detections
      .slice(0, 3)
      .map(det => `${det.class} ${(det.score * 100).toFixed(1)}%`);
    top3.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      explainListEl.appendChild(li);
    });
  }

  const maxScore = detections[0]?.score || 0;
  state.history.push(maxScore);
  if (state.history.length > 30) state.history.shift();

  const width = 200;
  const height = 60;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#1f2530';
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#3fa9f5';
  ctx.beginPath();
  state.history.forEach((v, i) => {
    const x = (i / Math.max(1, state.history.length - 1)) * (width - 10) + 5;
    const y = height - 5 - v * (height - 10);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();
  explainHistoryEl.innerHTML = '';
  explainHistoryEl.appendChild(canvas);
}

function stopWebcam() {
  state.running = false;
  cancelAnimationFrame(state.rafId);
  if (state.webcamStream) {
    state.webcamStream.getTracks().forEach(t => t.stop());
    state.webcamStream = null;
  }
  videoEl.srcObject = null;
  clearCanvas(canvasEl);  // Clear the canvas when stopping
  fpsEl.textContent = 'FPS: –';  // Reset FPS display
  timingEl.textContent = 'Timing: – ms';  // Reset timing display
  startWebcamBtn.disabled = false;
  stopWebcamBtn.disabled = true;
  runUploadBtn.disabled = false;
  fileInput.disabled = false;
  dropzone.classList.remove('disabled');
}

// Wait for CDN scripts (TensorFlow.js and COCO-SSD) to load before initializing
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  // DOMContentLoaded already fired
  init();
}
