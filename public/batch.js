import { detectOnce } from './detector.js';
import { getColor } from './renderer.js';

export async function runBatch(fileList, model, threshold, classFilter, roiFilter, colorMap) {
  const results = [];
  const gallery = [];
  console.log(`Batch: Processing ${fileList.length} files...`);

  for (const file of fileList) {
    console.log(`Processing: ${file.name}`);
    const url = URL.createObjectURL(file);
    const img = await loadImage(url);
    const detections = await detectOnce(model, img, threshold, classFilter, roiFilter);
    console.log(`  Found ${detections.length} detections in ${file.name}`);
    detections.forEach(det => results.push({ file: file.name, class: det.class, score: det.score, bbox: det.bbox }));

    const thumb = renderThumbnail(img, detections, file.name, colorMap);
    gallery.push(thumb);

    URL.revokeObjectURL(url);
  }
  
  console.log(`Batch complete: ${results.length} total detections across ${fileList.length} images`);
  return { results, gallery };
}

function renderThumbnail(img, detections, filename, colorMap) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const maxW = 240;
  const scale = img.width > maxW ? maxW / img.width : 1;
  const w = Math.round(img.width * scale);
  const h = Math.round(img.height * scale);
  canvas.width = w;
  canvas.height = h + 30;

  ctx.drawImage(img, 0, 0, w, h);
  ctx.lineWidth = 2;
  ctx.font = '12px Segoe UI';

  detections.forEach(det => {
    const [x, y, bw, bh] = det.bbox.map((v, idx) => (idx % 2 === 0 ? v * scale : v * scale));
    const color = getColor(det.class, colorMap);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.strokeRect(x, y, bw, bh);
    const label = `${det.class} ${(det.score * 100).toFixed(1)}%`;
    const pad = 3;
    const tw = ctx.measureText(label).width;
    ctx.fillRect(x, y - 16, tw + pad * 2, 16);
    ctx.fillStyle = '#0f1115';
    ctx.fillText(label, x + pad, y - 4);
  });

  ctx.fillStyle = '#e8ecf2';
  ctx.fillRect(0, h, w, 30);
  ctx.fillStyle = '#0f1115';
  ctx.font = '12px Segoe UI';
  ctx.fillText(filename, 8, h + 20);

  return canvas;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
