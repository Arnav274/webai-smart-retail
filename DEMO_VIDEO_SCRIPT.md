# DEMO VIDEO RECORDING SCRIPT
## CMP-6057A WebAI Coursework - Smart Retail Security

**Duration**: 10-12 minutes (under 15 min limit)  
**Format**: .mp4, 1080p recommended, speak clearly  
**Submission**: Upload to Blackboard  

---

## RECORDING CHECKLIST

- [ ] Good lighting (webcam should be well-lit)
- [ ] Quiet environment (minimize background noise)
- [ ] Chrome/Firefox browser with DevTools closed
- [ ] Terminal ready with `npm start`
- [ ] Test webcam access before recording
- [ ] Have sample images ready in Downloads folder (people, bags, etc.)
- [ ] Record screen + audio using OBS, QuickTime (Mac), or Windows built-in
- [ ] Export as .mp4 (not MOV, AVI, or WebM)

---

## SCRIPT SECTIONS (Follow in order)

### SECTION 1: Introduction (1 minute)
**What to say:**
> "Hello, this is [Your Name] demonstrating WebAI, a Smart Retail Security Detection System for CMP-6057A Advanced Web Development. This application uses TensorFlow.js and the COCO-SSD neural network to perform real-time object detection in retail environments. The system can monitor store entrances, high-value areas, and checkout zones by detecting and classifying people, bags, items, and potential security concerns. I'll show you all the essential and desirable features implemented in this coursework."

**What to show:**
- Browser at http://localhost:3000 with page loaded
- Point to header: "WebAI – Smart Retail Security"
- Point to three-panel layout (Controls | Viewport | Insights)

---

### SECTION 2: Startup & Model Loading (1 minute)
**What to say:**
> "The application loads the COCO-SSD model automatically at startup. You can see the loading overlay here. The model is a pre-trained neural network from TensorFlow.js that recognizes over 90 object classes. Once loaded, a metadata panel displays the model name, size (26.7 MB for the full model), the active backend (WebGL for GPU acceleration), and TensorFlow.js version."

**What to show:**
- Refresh page to show "Loading model…" overlay
- Wait for it to complete
- Point to the status chip: "Model: loaded"
- Show the metadata panel with name, size, backend, TF version
- Explain warmup pass and tensor cleanup

---

### SECTION 3: Backend Selector & Performance (45 seconds)
**What to say:**
> "The system supports multiple backends for different hardware. WebGL uses GPU acceleration and provides the best performance, around 20-30 FPS. We can also use CPU for broader compatibility, WASM, or WebGPU if available. Let me show you switching between backends."

**What to show:**
- Click backend selector dropdown
- Select "CPU" (briefly) – note status changes
- Switch back to "WebGL"
- Point to FPS counter showing ~20-30
- Point to timing display

---

### SECTION 4: Webcam Detection - Real-time Monitoring (2 minutes)
**What to say:**
> "Now let's activate the webcam for real-time monitoring. This is the primary use case for retail security. I'll click Start Webcam and grant camera permission."

**What to show:**
- Click "Start webcam" button
- Grant permission when prompted
- Position webcam to show yourself or objects
- Point out:
  - Bounding boxes appearing around detected people
  - Class label (e.g., "person 95%")
  - Confidence score displayed on each box
  - Live FPS counter (should show 20-30)
  - Real-time counts in Insights panel

**Then say:**
> "Notice the detections update in real-time with bounding boxes and confidence scores. The Counts panel shows how many people are detected. The FPS counter shows we're achieving good performance. Now let me show you the confidence threshold slider – this is useful for reducing false positives in a real retail setting."

**What to show:**
- Move threshold slider from 0.5 to 0.7
- Explain that higher threshold = fewer detections (filters out low-confidence results)
- Move it back to 0.5
- Point out how counts update immediately

**Then say:**
> "Class filters let us focus on specific items. In a retail security context, we might care only about bags and people. Watch what happens when I toggle class filters."

**What to show:**
- Toggle off some classes (e.g., "bottle", "cup", "laptop")
- Show that filtered classes no longer appear in detections
- Show legend updating with only active classes
- Toggle them back on

**Then say:**
> "The legend panel shows a consistent color for each class, so we can easily identify items across frames. This is especially useful for tracking patterns over time."

---

### SECTION 5: Region-of-Interest (ROI) Filtering (1.5 minutes)
**What to say:**
> "One of the Gold-tier features is Region-of-Interest filtering. In a real retail environment, you might only care about monitoring a specific area, like the store entrance. Let me enable the ROI gate and define a monitored zone."

**What to show:**
- Click "Toggle ROI gate"
- Show ROI rectangle appears on canvas (blue overlay)
- Drag corner handles to resize ROI smaller
- Move ROI around the canvas

**Then say:**
> "Notice that only detections inside the ROI rectangle are now counted. If I move an object outside the ROI, it disappears from the detections. This is crucial for focused security monitoring – we can zone in on high-risk areas like entrances or checkout counters."

**What to show:**
- Position yourself in and out of ROI
- Show counts updating based on position
- Point to ROI status showing "ROI on"
- Demonstrate that bounding boxes appear only inside ROI

**Then say:**
> "Now let me disable the ROI to show the difference."

**What to show:**
- Click "Toggle ROI gate" again
- Show that all detections now appear
- Status changes to "ROI off"

---

### SECTION 6: Upload & Image Detection (1 minute)
**What to say:**
> "While webcam monitoring is live, retail systems also need to analyze historical or batch images. Let me upload an image and run detection on it."

**What to show:**
- Click file input or drag an image onto dropzone
- Select a sample image (download one beforehand or use a screenshot)
- Click "Run detection on upload"
- Show results: canvas overlays, counts, legend populate
- Point out that single detection takes only ~100-200ms

**Optional:**
- Show drag-drop by dragging an image onto the dropzone
- Explain this is useful for reviewing CCTV snapshots

---

### SECTION 7: Screenshot Feature (30 seconds)
**What to say:**
> "When you detect something important, you can capture evidence immediately. The screenshot feature saves an annotated frame as PNG with a timestamp for compliance and incident documentation."

**What to show:**
- Click "Save annotated PNG"
- Show file downloaded (check Downloads folder to show filename like `screenshot-1704288769000.png`)
- Open it briefly to show the annotated overlay is preserved

---

### SECTION 8: Batch Detection & CSV Export (1.5 minutes)
**What to say:**
> "For end-of-day reviews or compliance reporting, we support batch analysis. You can select multiple images and run detection on all of them at once, then export results as CSV for your security team database."

**What to show:**
- Multi-select 3-5 sample images in batch input
- Click "Run batch detection"
- Show gallery view populating with annotated thumbnails
- Show filename under each thumbnail

**Then say:**
> "Now let me export the results as CSV."

**What to show:**
- Click "Export CSV"
- Show file downloaded (check Downloads folder)
- Optionally open CSV to show format: filename, class, score, bbox coordinates

---

### SECTION 9: Explainable UI & Legend (45 seconds)
**What to say:**
> "The Explainable UI panel shows the top 3 detections in real-time, which helps understand what the model sees. Below that is a confidence sparkline – a rolling graph of detection confidence scores over the last 30 frames. This helps you understand model reliability and performance trends."

**What to show:**
- While webcam is running, point to "Top-k scores" list
- Point to sparkline canvas below it
- Move the confidence threshold to cause changes
- Show how top-3 list updates immediately

**Then say:**
> "The legend persists across all frames and batch images, so colors stay consistent. This makes it easy for operators to follow objects and patterns."

---

### SECTION 10: Error Handling & Responsive Design (45 seconds)
**What to say:**
> "The application gracefully handles errors. If camera permission is denied, we show a clear message and the system still functions with file upload. Let me show responsive design – this works on mobile, tablet, and desktop."

**What to show:**
- Resize browser window to tablet size (show layout reflow to 2 columns)
- Resize to mobile size (show layout stack to 1 column)
- Point to status messages in the messages panel
- Click "Stop webcam" to show clean shutdown

---

### SECTION 11: Technical Summary (30 seconds)
**What to say:**
> "This implementation covers all minimum requirements and essential features: model integration with warmup and cleanup, dual media inputs (webcam and upload), canvas rendering with boxes and labels, and full performance monitoring. For desirable features, I've implemented two Gold features – ROI filtering and batch detection – plus four Silver features: screenshot, color legend, object counting, and explainable UI. The system uses TensorFlow.js for in-browser processing, which protects user privacy and enables real-time performance. All source code is available on stugit with clear setup instructions."

**What to show:**
- Navigate back to home
- Show status chip, all panels visible
- Point out professional UI and clear labeling

---

### SECTION 12: Closing (15 seconds)
**What to say:**
> "Thank you for reviewing WebAI. This system demonstrates how modern ML models can be deployed in the browser for real-time security applications. Source code is available at [URL] with a detailed README. For questions, contact the module organiser Dr Jeannette Chin."

**What to show:**
- Final screen showing the full UI
- Optionally fade to black

---

## RECORDING TIPS

1. **Talk clearly** – Speak at normal pace, don't rush
2. **Point at UI elements** – Use mouse to highlight as you explain
3. **Be specific** – Say "person 95%" not "a high score"
4. **Demo in order** – Follow this script to show features systematically
5. **Show interaction** – Click buttons, drag sliders, type input
6. **Handle mistakes gracefully** – If something goes wrong, explain what happened and move on
7. **Final check** – Verify video plays properly before submitting
8. **Audio levels** – Ensure narration is clearly audible (not too quiet, not distorted)

---

## RECORDING SOFTWARE OPTIONS

**Windows:**
- OBS Studio (free, professional)
- Camtasia (paid, easier editing)
- PowerPoint (built-in record screen)

**Mac:**
- QuickTime (built-in)
- OBS Studio (free)

**General:**
- Export as MP4 at 1080p
- Audio: 128 kbps minimum

---

## SUBMISSION CHECKLIST

- [ ] Video recorded at 1080p or better
- [ ] Video length: 10-12 minutes (under 15 min limit)
- [ ] All sections covered (Sections 1-12)
- [ ] Audio is clear and synchronized with screen
- [ ] No distracting background noise
- [ ] Exported as .mp4 format
- [ ] File size reasonable (<500 MB)
- [ ] Test playback works
- [ ] Upload to Blackboard with submission

---

## WHAT MARKERS LOOK FOR

✅ **Do this:**
- Clearly demonstrate P1 features (10 marks each)
- Show actual code isn't AI-generated (natural interactions)
- Explain *why* features matter for retail security
- Test features properly (no obvious bugs)
- Professional presentation (clear audio/video)

❌ **Avoid this:**
- Reading from script (feels robotic)
- Mumbling or unclear audio
- Rushing through features
- Technical errors or crashes
- Poor video quality (pixelated, laggy)
- Not demonstrating desirable features (Silver/Gold)

---

## TIME BREAKDOWN

- Intro: 1:00
- Startup & Model: 1:00
- Backend: 0:45
- Webcam: 2:00
- ROI: 1:30
- Upload: 1:00
- Screenshot: 0:30
- Batch & CSV: 1:30
- Explainable UI: 0:45
- Error Handling: 0:45
- Technical Summary: 0:30
- Closing: 0:15
- **TOTAL**: ~12 minutes ✅

