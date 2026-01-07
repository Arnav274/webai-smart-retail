export function resizeCanvas(mediaEl, canvasEl) {
  const width = mediaEl.videoWidth || mediaEl.naturalWidth || canvasEl.clientWidth;
  const height = mediaEl.videoHeight || mediaEl.naturalHeight || canvasEl.clientHeight;
  canvasEl.width = width;
  canvasEl.height = height;
}

export function clearCanvas(canvasEl) {
  const ctx = canvasEl.getContext('2d');
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset any transforms
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
  ctx.restore();
}

export function drawDetections(canvasEl, detections, colorMap, trackingEnabled = false) {
  const ctx = canvasEl.getContext('2d');
  ctx.setTransform(1, 0, 0, 1, 0, 0);  // Reset transform
  ctx.globalAlpha = 1;  // Reset alpha
  ctx.lineWidth = 2;
  ctx.font = '14px Segoe UI';
  
  if (detections.length > 0) {
    console.log(`Drawing ${detections.length} detections:`, detections.map(d => ({ class: d.class, bbox: d.bbox, score: d.score, trackId: d.trackId })));
  }
  
  detections.forEach(det => {
    const [x, y, w, h] = det.bbox;
    console.log(`  Drawing: class=${det.class}, x=${x}, y=${y}, w=${w}, h=${h}, trackId=${det.trackId}, canvasSize=${canvasEl.width}x${canvasEl.height}`);
    
    // Sanity check - if bbox is weird, skip it
    if (isNaN(x) || isNaN(y) || isNaN(w) || isNaN(h) || w < 1 || h < 1 || w > canvasEl.width * 2 || h > canvasEl.height * 2) {
      console.warn(`Skipping invalid bbox:`, det.bbox);
      return;
    }
    
    const color = getColor(det.class, colorMap);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.strokeRect(x, y, w, h);
    
    // Build label with track ID if enabled
    let label = `${det.class} ${(det.score * 100).toFixed(1)}%`;
    if (trackingEnabled && det.trackId) {
      label = `${det.class} #${det.trackId} ${(det.score * 100).toFixed(1)}%`;
    }
    
    const padding = 4;
    const textWidth = ctx.measureText(label).width;
    ctx.fillRect(x, y - 18, textWidth + padding * 2, 18);
    ctx.fillStyle = '#0f1115';
    ctx.fillText(label, x + padding, y - 4);
  });
}

export function getColor(cls, colorMap) {
  if (colorMap.has(cls)) return colorMap.get(cls);
  const hue = hashString(cls) % 360;
  const color = `hsl(${hue}, 80%, 55%)`;
  colorMap.set(cls, color);
  return color;
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
