# WebAI Coursework – Final Strategy (Preserve this plan)

## Goal
Achieve 100/100 by fully meeting P1 (40), completing exactly 40 marks in P2 via 2 Gold + 4 Silver, and delivering a professional P3 demo.

## Theme
Smart Retail Security System
- ROI: focus on store entrance, ignore sidewalk.
- Counts: customers vs. staff, displayed clearly.
- Batch: process stored snapshots from CCTV.
- Legend: color-code classes (e.g., person/customer blue, staff green, bag red, etc.).

## P1 Essential (40 marks) – must be solid
1) Model Integration (10): load COCO-SSD at startup with loading state; warmup dummy tensor; dispose tensors every loop; metadata panel (model name, version, size, backend).
2) Media Inputs (10): webcam with start/stop; file upload + drag/drop for images (and short videos if time); rerun detection on demand.
3) Rendering & UI (10): canvas overlay with boxes/labels/confidences; class filter checkboxes; confidence threshold slider.
4) Performance & Responsiveness (10): FPS counter + timing; backend selector (CPU/WebGL; WebGPU if available); responsive layout for mobile/tablet/desktop.

## P2 Desirable (40 marks) – chosen set
Silver (5 each):
- Screenshot button: save annotated frame as PNG with timestamp.
- Per-class color legend with consistent colors across frames.
- Basic object count by class, useful for retail (customers, staff, bags).
- Explainable UI: top-k scores per detection and a small confidence/history chart.

Gold (10 each):
- ROI detection gate: draggable rectangle/polygon; only detect/count inside ROI; visible overlay.
- Batch image detection: multi-upload gallery, run detection over all, show results grid, export CSV (filename, class, confidence, bbox coords).

## P3 Demonstration (20 marks)
- Record <15 min MP4: intro (context + stack), P1 demo, P2 demo, brief code/architecture, performance notes, wrap-up.
- Clear narration aligned to retail theme; mention any limitations.

## Architecture / Stack
- Frontend: HTML/CSS/JS (ES6). TensorFlow.js (@tensorflow/tfjs) + @tensorflow-models/coco-ssd. Canvas API. MediaDevices & File APIs.
- Optional helpers: simple color map utility; ROI overlay (Fabric.js/Konva.js acceptable but pure canvas also fine); Chart.js for explainable mini-chart.
- Backend: Node.js + Express serving static /public. No server ML.
- File layout:
  - server.js (express static server)
  - public/
    - index.html
    - styles.css
    - app.js (wiring/UI state)
    - detector.js (model load/warmup/run/dispose)
    - renderer.js (canvas draw, colors, legend, screenshot)
    - roi.js (ROI draw + gate logic)
    - batch.js (multi-upload, gallery, CSV export)
    - ui.js (controls: filters, threshold, backend select, FPS, counts)

## Implementation Order (low risk → high value)
1) Scaffold: Express server + /public with basic layout; include TF.js + coco-ssd; set up UI shells.
2) Model load + warmup + metadata panel + disposal discipline.
3) Media inputs: webcam start/stop; image upload/drag-drop; manual rerun trigger.
4) Canvas overlay + labels/conf + class filter + threshold slider.
5) Performance: FPS counter; backend selector; responsive CSS.
6) Silver set: colors/legend; counts; screenshot; explainable UI (top-k list + mini chart).
7) Gold ROI: draggable ROI; mask detections to ROI; visual overlay.
8) Gold Batch: multi-image upload; run detection sequentially; gallery view; CSV export.
9) Polish: error handling (camera denied, model load fail); UX copy matching theme; minor animations.
10) Demo prep: script and rehearse; record <15 min; ensure stable FPS and clean UI.

## Quality/Scoring Notes
- Dispose tensors every detection cycle; avoid leaks.
- Debounce sliders/filters; use requestAnimationFrame for webcam loop.
- Show clear loading and error states.
- Keep UI instructions visible (camera permissions, how to use ROI, batch steps).
- Test on Chrome + one other browser; test mobile layout.

## Deliverables
- Blackboard: MP4 demo (<15 min).
- Stugit repo: full source + README (setup/run) + userguide.docx (1 page, lists desirable features implemented and how to use them).

Keep this file as the single source of truth for the plan.
