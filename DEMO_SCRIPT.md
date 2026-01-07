WebAI Demo Script (<15 min)

INTRO (1 min)
"Hi, I'm demonstrating WebAI, a smart retail security system built with TensorFlow.js. This application detects objects in real time using the COCO-SSD model. I've implemented all P1 essentials plus 2 gold and 4 silver desirable features. Let me walk you through them."

P1 ESSENTIALS (8 min)

MODEL INTEGRATION (1.5 min)
[Show browser with loading screen]
"First, the model integration. On startup, you see the loading overlay. Behind the scenes, the COCO-SSD model is downloaded, a warmup pass pre-allocates tensors using tf.tidy, and all detections are wrapped in tf.tidy to avoid memory leaks."
[Refresh page, show loading state]
"Once loaded, the status shows 'Model: loaded' and the metadata panel displays the model name, size in MB, and the current backend—in this case, WebGL, which runs on GPU and is about 3–5 times faster than CPU."

MEDIA INPUTS (1.5 min)
[Click Start Webcam, show permission prompt, grant permission]
"Next, media inputs. I can start the webcam. You see the camera permission prompt; I'll grant it. The video stream appears on canvas and detection begins immediately."
[Show detection running, bounding boxes appearing]
"I can also upload media. Let me stop the webcam and upload a test image."
[Click Stop Webcam, then choose image file or drag-drop]
"I can drag and drop or choose from file picker. I'll click 'Run detection on upload' to trigger detection on the static image."
[Show image with overlays]

RENDERING & UI (2 min)
[Show canvas with overlays]
"The rendering shows bounding boxes, class labels, and confidence scores. Let me demonstrate the filters."
[Show class filter pills; click some to toggle]
"I'm toggling filters here—clicking 'person' to hide persons. Notice the overlay updates, hiding those detections but keeping others."
[Adjust threshold slider]
"I can adjust the confidence threshold. As I lower it, weaker detections appear. As I raise it, only confident detections show. This lets me tune the sensitivity on the fly."

PERFORMANCE & RESPONSIVENESS (2 min)
[Show FPS counter and timing]
"The FPS counter and timing display show frame rate and detection latency. On WebGL, I'm getting about 20–30 FPS. Let me switch backends to demonstrate."
[Open backend selector dropdown, choose CPU]
"Switching to CPU… the FPS drops to around 5–10, which is why WebGL is recommended for real-time use. I can also choose WASM or WebGPU if available."
[Show responsive layout: resize window or toggle mobile view in dev tools]
"The layout is responsive—it adapts from a 3-column desktop view to a single column on mobile. Labels and inputs scale nicely."

P2 DESIRABLE FEATURES (6 min)

GOLD: ROI GATE (1.5 min)
[Click Toggle ROI]
"Now for the gold features. First, Region of Interest. I'll click 'Toggle ROI' to enable it. A rectangle appears."
[Drag handles or move rectangle]
"I can drag the handles at the corners to resize it, or drag the center to move it. The blue overlay shows the active ROI. Notice: only detections inside this rectangle are counted and labeled. If I drag it to exclude some objects, they disappear from the count. This is perfect for entrance monitoring in retail—I zone the entry and ignore the rest of the store."

GOLD: BATCH DETECTION (1.5 min)
[Multi-select test images from batch input]
"Second gold feature: batch detection. I'll select multiple images from the file input."
[Click Run Batch]
"I click 'Run batch detection'. The system processes each image sequentially."
[Show gallery of annotated thumbnails]
"The gallery shows annotated thumbnails with bounding boxes and labels, all using the same color map for consistency. I can export results as CSV."
[Click Export CSV]
"The CSV exports filename, class, confidence, and bounding box coordinates—useful for logging and analysis."

SILVER FEATURES (3 min)
[Show screenshot feature]
"Silver feature 1: Screenshot. I can save the current annotated frame as PNG with a timestamp."
[Click Save annotated PNG, show file download]

[Show legend panel]
"Silver feature 2: Per-class colour legend. Each class gets a consistent color. The legend displays all classes detected, and the same color carries across frames and batch images for easy tracking."

[Show counts panel]
"Silver feature 3: Object count by class. The counts panel shows 'person: 5, backpack: 2' etc. in real time. Useful for retail analytics—how many customers, how many bags."

[Show explainable UI panel]
"Silver feature 4: Explainable UI. The top-3 detections list shows the three most confident objects per frame. Below, a sparkline graph shows the rolling confidence history over the last ~30 frames. This helps me understand detection quality and trends."

SUMMARY & CLEANUP (1 min)
"All detections use tf.tidy to wrap tensor operations, and a warmup pass pre-allocates memory on startup. This avoids memory leaks, which is critical for sustained real-time use.

I've implemented all P1 essentials (model integration, media inputs, rendering, performance) and 2 gold + 4 silver desirable features, totaling 80 marks before the video. The app is responsive, handles errors gracefully, and provides clear user feedback. Thank you."

---

FILMING TIPS
• Record at 1080p or 1440p; save as MP4.
• Use a screen recorder (OBS, Camtasia, ScreenFlow) or browser dev tools.
• Speak clearly; narrate each feature transition.
• Total time: aim for 12–14 minutes to stay well under 15 min limit.
• Test webcam/upload/ROI/batch before recording to ensure smooth demo.
• Show error states if time (e.g., "Camera denied" message).
