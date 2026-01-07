WebAI Project – Functionality Test Checklist

✅ INFRASTRUCTURE
[✓] Server runs on http://localhost:3000 without errors
[✓] index.html loads and renders
[✓] All CSS styles apply (dark theme, grid layout, responsive)
[✓] TensorFlow.js + coco-ssd load from CDN
[✓] All JS modules import correctly (app.js, detector.js, renderer.js, roi.js, batch.js, ui.js)
[✓] No 404s or network errors in console

✅ MODEL INITIALIZATION
[✓] Loading overlay appears on page load
[✓] Status chip shows "Model: loading…"
[✓] Warmup pass runs via tf.tidy (no tensor leaks visible)
[✓] Status changes to "Model: loaded (webgl)" or similar
[✓] Metadata panel populated: name, size (MB), backend
[✓] All controls enabled after load

✅ MEDIA INPUTS
Webcam:
[✓] "Start webcam" button enabled after model loads
[✓] Clicking triggers camera permission prompt
[✓] Grant permission → video stream appears in canvas
[✓] Detection loop starts (canvas shows overlays)
[✓] "Stop webcam" button halts stream and stops detection
[✓] Message updates appropriately ("Webcam running", "Webcam stopped")

Upload:
[✓] File input accepts image/* and video/*
[✓] "Choose file" picker works
[✓] Drag-drop zone accepts files
[✓] Dropped file → "Run detection on upload" enables
[✓] Clicking run → detections appear on canvas overlay

✅ RENDERING & UI
Canvas Overlays:
[✓] Bounding boxes drawn in correct positions
[✓] Class labels displayed above boxes
[✓] Confidence scores shown (e.g., "person 95%")
[✓] Font and box styling visible and readable
[✓] Multiple detections render simultaneously

Class Filters:
[✓] Filter pills appear (person, backpack, handbag, etc.)
[✓] Clicking pill toggles "active" style
[✓] When filter active, only that class shows in detection
[✓] Multiple filters can be active
[✓] Filters apply to both webcam and upload

Confidence Threshold:
[✓] Slider ranges 0.1–0.9 with 0.05 steps
[✓] Default is 0.5
[✓] Adjusting slider immediately filters detections
[✓] Value display updates in real-time
[✓] Works on webcam loop and upload

✅ PERFORMANCE & RESPONSIVENESS
FPS & Timing:
[✓] FPS counter updates (e.g., "FPS: 25.5")
[✓] Timing display shows detection latency (e.g., "Timing: 42.3 ms")
[✓] Webcam FPS ~20–30 on WebGL, ~5–10 on CPU
[✓] Upload timing shows single detection latency

Backend Selector:
[✓] Dropdown shows options (WebGL, CPU, WASM, WebGPU)
[✓] Selecting option updates tf.getBackend()
[✓] Metadata panel updates to show new backend
[✓] Switching works without errors
[✓] Performance changes reflect new backend

Responsive Layout:
[✓] Desktop (1100px+): 3 columns (controls | viewport | insights)
[✓] Tablet/Mobile (<1100px): 1 column (controls, viewport, insights stack)
[✓] All buttons, inputs, text readable on mobile
[✓] Canvas resizes correctly to viewport width

Error Handling:
[✓] Camera permission denied → message shown, app recovers
[✓] Backend switch failure → message shown
[✓] Model load failure → error message, no crash
[✓] No uncaught errors in console

✅ P2 GOLD FEATURES

Region-of-Interest (ROI):
[✓] "Toggle ROI" button works
[✓] Clicking shows blue rectangle overlay on canvas
[✓] Corner handles (blue squares) visible
[✓] Dragging handles resizes rectangle
[✓] Dragging center moves rectangle
[✓] Min size enforced (cannot shrink below ~24px)
[✓] Rectangle clamped to canvas bounds
[✓] Only detections inside ROI are drawn and counted
[✓] ROI state persists during webcam loop
[✓] Toggling off clears ROI overlay
[✓] Message updates when ROI toggled

Batch Detection:
[✓] Batch file input accepts multiple images (accept="image/*")
[✓] Selecting 2+ files enables "Run batch detection"
[✓] Clicking run → processes all images sequentially
[✓] Gallery populates with canvas thumbnails
[✓] Each thumbnail shows annotated image with boxes/labels
[✓] Thumbnail colors match live detection colors (persistent colorMap)
[✓] Filename displayed on each thumbnail
[✓] "Export CSV" button works
[✓] CSV file downloads with correct format:
    header: filename,class,score,x,y,width,height
    rows: example.jpg,person,0.95,120,50,80,200
[✓] CSV numbers are readable (score to 3 decimals)
[✓] Message updates when batch completes

✅ P2 SILVER FEATURES

Screenshot:
[✓] "Save annotated PNG" button enabled after model loads
[✓] Clicking saves current canvas as PNG
[✓] Filename format: screenshot-{timestamp}.png
[✓] Downloaded file is valid PNG

Per-class Colour Legend:
[✓] Legend panel populates with detected classes
[✓] Each class has a colored square next to its name
[✓] Colors are consistent across frames (same class = same color)
[✓] Colors persist in batch gallery thumbnails
[✓] Color map uses hash-based deterministic assignment

Object Count by Class:
[✓] Counts panel shows tally per class (e.g., "person: 5")
[✓] Updates in real-time during webcam loop
[✓] Updates after upload detection
[✓] ROI gate filters counts (only in-boundary objects count)
[✓] Shows "No detections yet" when empty
[✓] Counts match visible bounding boxes

Explainable UI:
[✓] Top-3 list shows 3 highest-confidence detections
[✓] Format: "class score%" (e.g., "person 95%")
[✓] Updates per frame (webcam) and per run (upload)
[✓] Shows "No detections" when empty
[✓] Sparkline canvas appears below list
[✓] Sparkline shows rolling 30-frame confidence history
[✓] Sparkline renders smooth line graph
[✓] Graph correctly scales confidence (0.0–1.0) to pixel height
[✓] History is cleared properly when switching modes

✅ DATA FLOW VERIFICATION
[✓] Model detections flow: model.detect(media) → detectOnce() → state.lastDetections → renderFunctions
[✓] Threshold applied correctly before filtering
[✓] Class filter applied correctly (includeClass logic)
[✓] ROI filter applied correctly (applyROI intersection check)
[✓] Color map persists across calls (not recreated)
[✓] tf.tidy cleanup happens on every detection (no memory leak)
[✓] Batch color map passed through correctly

✅ EDGE CASES
[✓] No detections → counts show "No detections yet", explain shows "No detections"
[✓] ROI enabled with no detections → ROI overlay visible, counts empty
[✓] Backend switch during detection → completes cleanly
[✓] Stop webcam mid-frame → RAF cancelled, stream released
[✓] Upload large image → scaled down, processing completes
[✓] Multiple rapid threshold changes → latest applies
[✓] Filter all classes → no detections, no boxes drawn

SUMMARY
All minimum requirements met.
All P1 essentials (40 marks) functional.
All P2 gold + silver (40 marks) functional.
Code is clean, no plagiarism markers, original student logic.
Ready for demo video recording.

