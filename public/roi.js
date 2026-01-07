let enabled = false;
let roiRect = null;
let dragMode = null; // 'move' or 'resize'
let dragAnchor = null;

// Require a small overlap fraction so touching the ROI is enough, but avoid pure edge noise
const HANDLE = 10;  // Smaller, professional-looking handles
const MIN_OVERLAP_FRACTION = 0.05; // 5% overlap: detects when part of the body touches the ROI

export function toggleROI(canvasEl) {
  enabled = !enabled;
  if (enabled) {
    const w = canvasEl.width || canvasEl.clientWidth || 640;
    const h = canvasEl.height || canvasEl.clientHeight || 360;
    roiRect = { x: w * 0.3, y: h * 0.3, w: w * 0.4, h: h * 0.4 };
    attachListeners(canvasEl);
    drawROIOverlay(canvasEl);
  } else {
    detachListeners(canvasEl);
    roiRect = null;
    clearOverlay(canvasEl);
  }
  return enabled;
}

export function applyROI(bbox) {
  if (!enabled || !roiRect) return true;
  const [x, y, w, h] = bbox;
  // Enforce a minimum overlap (fraction of bbox area inside ROI)
  const interW = Math.max(0, Math.min(x + w, roiRect.x + roiRect.w) - Math.max(x, roiRect.x));
  const interH = Math.max(0, Math.min(y + h, roiRect.y + roiRect.h) - Math.max(y, roiRect.y));
  const interArea = interW * interH;
  const bboxArea = w * h || 1; // guard against zero area
  const overlapFraction = interArea / bboxArea;

  return overlapFraction >= MIN_OVERLAP_FRACTION;
}

export function roiEnabled() {
  return enabled;
}

export function drawROIOverlay(canvasEl) {
  if (!enabled || !roiRect) return;
  const ctx = canvasEl.getContext('2d');
  ctx.save();
  // Draw dashed border
  ctx.strokeStyle = 'rgba(63,169,245,0.8)';
  ctx.lineWidth = 2;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(roiRect.x, roiRect.y, roiRect.w, roiRect.h);
  ctx.setLineDash([]);
  // Draw subtle fill
  ctx.fillStyle = 'rgba(63,169,245,0.05)';
  ctx.fillRect(roiRect.x, roiRect.y, roiRect.w, roiRect.h);
  // Draw circular handles
  const handles = corners(roiRect);
  handles.forEach(([hx, hy]) => {
    ctx.fillStyle = 'rgba(63,169,245,0.9)';
    ctx.beginPath();
    ctx.arc(hx, hy, HANDLE / 2, 0, Math.PI * 2);
    ctx.fill();
    // White outline for contrast
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  });
  ctx.restore();
}

function clearOverlay(canvasEl) {
  const ctx = canvasEl.getContext('2d');
  ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
}

function attachListeners(canvasEl) {
  canvasEl.addEventListener('pointerdown', onPointerDown);
  canvasEl.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
}

function detachListeners(canvasEl) {
  canvasEl.removeEventListener('pointerdown', onPointerDown);
  canvasEl.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
}

function onPointerDown(e) {
  if (!enabled || !roiRect) return;
  const { x, y, canvasEl } = pointerToCanvas(e);
  const target = canvasEl;
  const handle = hitHandle(x, y, roiRect);
  if (handle) {
    const l = roiRect.x;
    const t = roiRect.y;
    dragMode = 'resize';
    dragAnchor = {
      corner: handle.corner,
      startX: x,
      startY: y,
      startRect: { ...roiRect },
      canvasEl
    };
  } else if (pointInRect(x, y, roiRect)) {
    dragMode = 'move';
    dragAnchor = { dx: x - roiRect.x, dy: y - roiRect.y, canvasEl };
  }
  if (dragMode) {
    target.setPointerCapture(e.pointerId);
    e.preventDefault();
  }
}

function onPointerMove(e) {
  if (!enabled || !roiRect || !dragMode) return;
  const { x, y, canvasEl } = pointerToCanvas(e);
  if (dragMode === 'move') {
    const nx = clamp(x - dragAnchor.dx, 0, canvasEl.width - roiRect.w);
    const ny = clamp(y - dragAnchor.dy, 0, canvasEl.height - roiRect.h);
    roiRect.x = nx;
    roiRect.y = ny;
  } else if (dragMode === 'resize') {
    const minSize = 24;
    const { startRect, startX, startY, corner } = dragAnchor;
    const dx = x - startX;
    const dy = y - startY;
    const l0 = startRect.x;
    const t0 = startRect.y;
    const r0 = startRect.x + startRect.w;
    const b0 = startRect.y + startRect.h;
    let l = l0;
    let t = t0;
    let r = r0;
    let b = b0;

    if (corner === 'tl') {
      l = clamp(l0 + dx, 0, r0 - minSize);
      t = clamp(t0 + dy, 0, b0 - minSize);
    }
    if (corner === 'tr') {
      r = clamp(r0 + dx, l0 + minSize, canvasEl.width);
      t = clamp(t0 + dy, 0, b0 - minSize);
    }
    if (corner === 'bl') {
      l = clamp(l0 + dx, 0, r0 - minSize);
      b = clamp(b0 + dy, t0 + minSize, canvasEl.height);
    }
    if (corner === 'br') {
      r = clamp(r0 + dx, l0 + minSize, canvasEl.width);
      b = clamp(b0 + dy, t0 + minSize, canvasEl.height);
    }

    roiRect = {
      x: l,
      y: t,
      w: r - l,
      h: b - t
    };
  }
  drawROIOverlay(canvasEl);
}

function onPointerUp(e) {
  if (!dragMode) return;
  const target = e.target;
  if (target?.releasePointerCapture) {
    try { target.releasePointerCapture(e.pointerId); } catch (_) {}
  }
  dragMode = null;
  dragAnchor = null;
}

function hitHandle(x, y, rect) {
  const handles = corners(rect);
  const names = ['tl', 'tr', 'bl', 'br'];
  for (let i = 0; i < handles.length; i++) {
    const [hx, hy] = handles[i];
    if (Math.abs(x - hx) <= HANDLE && Math.abs(y - hy) <= HANDLE) {
      return { corner: names[i] };
    }
  }
  return null;
}

function corners(rect) {
  return [
    [rect.x, rect.y],
    [rect.x + rect.w, rect.y],
    [rect.x, rect.y + rect.h],
    [rect.x + rect.w, rect.y + rect.h]
  ];
}

function pointInRect(x, y, rect) {
  return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
}

function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

function pointerToCanvas(e) {
  const canvasEl = e.currentTarget;
  const rect = canvasEl.getBoundingClientRect();
  const scaleX = canvasEl.width / rect.width;
  const scaleY = canvasEl.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
    canvasEl
  };
}
