let modelInstance = null;

export async function setBackend(name) {
  try {
    if (tf.getBackend() !== name) {
      await tf.setBackend(name);
    }
    await tf.ready();
    return tf.getBackend();
  } catch (err) {
    console.warn(`Backend ${name} failed, falling back to CPU:`, err);
    await tf.setBackend('cpu');
    await tf.ready();
    return tf.getBackend();
  }
}

export async function loadModel(onStatus) {
  onStatus?.('Model: loading…');
  try {
    await tf.ready();
    console.log('TensorFlow ready, loading COCO-SSD...');
    if (!window.cocoSsd) {
      throw new Error('cocoSsd library not loaded. Check CDN script tags.');
    }
    modelInstance = await window.cocoSsd.load();
    console.log('COCO-SSD model loaded successfully');
    onStatus?.('Model: loaded');
    return modelInstance;
  } catch (err) {
    console.error('Model load failed:', err);
    throw err;
  }
}

export async function warmupModel(model) {
  if (!model) return;
  // Create a dummy canvas for warmup
  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 300;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, 300, 300);
  // Warmup pass to pre-allocate tensors
  // COCO-SSD internally manages tensor disposal, so we don't wrap in tf.tidy
  await model.detect(canvas);
  // Force cleanup after warmup
  if (tf.engine().state.numTensors > 0) {
    tf.engine().startScope();
    tf.engine().endScope();
  }
}

export async function detectOnce(model, mediaEl, threshold, classFilter, roiFilter) {
  if (!model || !mediaEl) return [];
  try {
    // COCO-SSD model.detect() returns plain JavaScript objects (not tensors)
    // and handles its own internal tensor cleanup, so we don't need tf.tidy here
    const preds = await model.detect(mediaEl);
    const filtered = preds.filter(p => p.score >= threshold && includeClass(p.class, classFilter));
    if (roiFilter && typeof roiFilter === 'function') {
      return filtered.filter(det => roiFilter(det.bbox));
    }
    return filtered;
  } catch (err) {
    console.error('Detection error:', err);
    return [];
  }
}

function includeClass(cls, filterSet) {
  if (!filterSet || filterSet.size === 0) return true;
  return filterSet.has(cls);
}

export function getMeta() {
  let sizeMb = 'Loading...';
  try {
    // COCO-SSD doesn't expose model size directly, use reasonable estimates
    // Full model (default): ~26.7 MB, Lite model: ~5.4 MB
    // Check if model configuration suggests lite variant
    const isLite = modelInstance?.modelUrl?.includes('lite') || 
                   modelInstance?.base?.includes('lite') ||
                   false;
    sizeMb = isLite ? '5.4 MB (lite)' : '26.7 MB (full)';
  } catch (e) {
    // Fallback to full model estimate (default for cocoSsd.load())
    sizeMb = '26.7 MB (full)';
  }
  return {
    name: 'COCO-SSD v2.2',
    size: sizeMb,
    backend: tf.getBackend(),
    tfVersion: tf.version.tfjs
  };
}
