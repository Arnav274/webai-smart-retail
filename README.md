# WebAI - Smart Retail Security Detection System

Real-time object detection for retail environments using TensorFlow.js and COCO-SSD.

This browser-based app analyzes live webcam feeds or uploaded media to detect people, bags, and items. Built for CMP-6057A Advanced Web Development.

## Setup

Prerequisites:
- Node.js 18 or later
- Modern browser (Chrome or Firefox recommended)
- Webcam optional but useful for testing

```bash
npm install
npm start
```

Then navigate to http://localhost:3000

If `npm start` fails, verify Node.js 18+ is installed and network allows CDN for TensorFlow.js and COCO‑SSD.
## Build

The application is already built. Source files are in /public:
- index.html: main page
- app.js: entry point
- detector.js, tracker.js, roi.js, batch.js, ui.js, renderer.js: feature modules
- styles.css: styling

To minify or bundle for production:
```bash
# Option 1: Use esbuild for bundling
npm install --save-dev esbuild
npx esbuild public/app.js --bundle --outfile=public/app.bundle.js

# Option 2: Serve as-is (current setup)
npm start
```

Current setup serves files as-is without bundling. Suitable for development and coursework submission.
## What's Included

The application meets all minimum requirements for the assignment:
- Client-side JavaScript handles COCO-SSD model integration and detection logic
- Webcam streaming and static image/video upload support
- Bounding boxes with class labels and confidence percentages
- Node Express server serves index.html from the public folder
- Error handling for camera permissions and model loading
 - Accessibility labels and keyboard shortcuts for core actions

## Implementation Details

### P1 Essential Features (40 marks)

**Model Integration (10 marks)**
- COCO-SSD loads at startup with visual loading indicator
- Warmup pass pre-allocates tensors for consistent performance  
- Memory management using tf.tidy() prevents tensor leaks
- Metadata panel displays model version, size, backend, and TensorFlow.js version

**Media Inputs (10 marks)**
- Webcam mode with start/stop controls and permission handling
- File upload supports images and videos via file picker or drag-and-drop
- Real-time adjustment of threshold and filters during detection

**Rendering & UI (10 marks)**
- Canvas overlay displays bounding boxes with class labels and confidence scores
- Toggle filters for 8 retail-relevant classes: person, backpack, handbag, suitcase, bottle, cup, laptop, cell phone
- Confidence threshold slider adjustable from 0.1 to 0.9

**Performance & Responsiveness (10 marks)**
- Live FPS counter and per-frame timing display
- Backend selector: CPU, WebGL, WASM, WebGPU
- Responsive layout adapts to mobile, tablet, and desktop screens
 - Optional keyboard shortcuts to reduce interaction latency

### Marking Mapping (Examiner-Friendly)

**P1 Essential (40%)**
- Model Integration: Loading overlay, warmup, safe tensor lifecycle, metadata panel
- Media Inputs: Webcam start/stop; image/video upload + drag & drop
- Rendering & UI: Canvas overlay, labels + confidences, class filters, threshold slider
- Performance: FPS + timing, backend selector, responsive layout

**P2 Desirable (40% – 7 features)**
- Gold (30%): ROI gate; Track‑by‑ID; Batch detection with gallery + CSV
- Silver (20%): Screenshot; Per‑class color legend; Object counts; Explainable UI (top‑k + confidence history)

Note: Accessibility & shortcuts are added polish showing professionalism (module LO), not counted as distinct P2 features.

### P2 Desirable Features (40 marks - 7 features selected)

**Gold Features (30 marks):**

1. **ROI Gate (10 marks)** - Region of Interest detection
   - Drag rectangle to define detection zone
   - Resize using corner handles, move by center drag
   - Only objects with 5% bbox overlap are counted
   - Use case: Monitor specific store zones (entrance, checkout, displays)

2. **Batch Detection (10 marks)** - Process multiple images
   - Select multiple images for automated processing
   - Gallery view shows annotated thumbnails
   - Export results to CSV with filename, class, confidence, bbox coordinates
   - Useful for analyzing recorded footage or batch inventory checks

3. **Track-by-ID (10 marks)** - Persistent object tracking across frames
   - Algorithm: Combined IoU (Intersection over Union) + centroid distance matching
   - Adaptive thresholds for small objects (phones) vs large objects (people)
   - Track IDs survive up to 30 frames without detection
   - Labels display as "person #5 85%" when tracking enabled
   - Use cases: Unique customer counting, movement pattern analysis, theft detection

**Silver Features (20 marks):**

4. **Screenshot (5 marks)** - Save annotated frames as PNG with timestamp
5. **Color Legend (5 marks)** - Consistent per-class colors with visible legend
6. **Object Counts (5 marks)** - Real-time tally of detected objects by class
7. **Explainable UI (5 marks)** - Top 3 detections list + confidence graph over last 30 frames

---

## Application Context: Retail Security

This implementation focuses on 8 COCO-SSD classes relevant to retail security:

**Person Detection:**
- Customer counting for occupancy limits
- After-hours unauthorized access detection
- Staff presence verification in restricted areas

**Bag Detection** (backpack, handbag, suitcase):
- Entrance bag-check policy enforcement  
- Loss prevention flagging for concealment risks
- Unattended bag security alerts

## Accessibility & Shortcuts

- Accessible labels on inputs/buttons; messages announced with `aria-live="polite"`
- Keyboard shortcuts: W (start/stop webcam), T (toggle tracking), R (toggle ROI), S (screenshot), +/- (adjust threshold)
- Benefits: Faster demo flow, clearer UX for assessors, aligns with professionalism LO

## Troubleshooting

- TensorFlow.js failed to load: Check internet connectivity and that browser allows CDN scripts. See console errors.
- Camera permission denied: Allow camera in browser site settings; refresh and retry.
- Camera in use: Close other apps (Teams/Zoom/Meet) then try again.
- Backend switch fails: Falls back to CPU automatically; performance may be lower.
- Batch detection slow: Reduce image count or resolution; WebGL backend recommended.

## Tested Environments

- Chrome 120+ (WebGL, CPU)
- Firefox 120+ (WebGL, CPU)
- Edge 120+ (WebGL, CPU)

Performance varies by GPU/driver; WebGL recommended. If WebGL is unavailable, CPU/WASM remain functional.

**High-Value Items** (laptop, cell phone):
- Checkout verification (ensure items scanned match cart contents)
- Display area monitoring for theft prevention
- Returns counter item tracking

**Consumables** (bottle, cup):
- Spill hazard detection
- Pre-checkout consumption monitoring
- Inventory shrinkage tracking

### ROI Gate Applications:
- **Entrance**: Count unique customers, screen bags
- **Checkout**: Verify items, flag high-value electronics
- **Display Areas**: Alert when multiple people near jewelry/electronics
- **Exit**: Cross-reference detections with transaction data

## Usage Guide
- Spill hazard detection
- Inventory gap identification
- Pre-checkout consumption monitoring

### ROI Gate for Zone Monitoring
- **Entrance**: Count customers, detect bags for screening
- **Checkout**: Verify cart items, flag high-value electronics
- **High-Value Displays**: Alert on multiple people near jewelry/electronics
- **Exit**: Cross-reference detected items with receipts

---

## Usage

**Webcam Mode:**
1. Click "Start webcam" and grant permissions
2. Detection runs automatically
3. Adjust confidence threshold slider to filter low-confidence detections
4. Toggle class filters to show/hide specific objects
5. Enable ROI gate for zone-specific monitoring
6. Enable tracking for persistent object IDs

**Upload Mode:**
1. Select file or drag media onto dropzone
2. Click "Run detection on upload"
3. View annotated results

**Batch Processing:**
1. Select multiple images using batch file input
2. Click "Run batch detection"
3. Review annotated thumbnails in gallery
4. Click "Export CSV" to download results

**Advanced Features:**
- ROI: Click "Toggle ROI gate", drag corners to resize, drag center to move
- Tracking: Click "Toggle Tracking" to assign persistent IDs to moving objects
- Screenshot: Click "Save annotated PNG" to download current frame

## Project Structure

```
server.js          - Express server serving static files from /public
public/
  index.html       - Main interface layout
  app.js           - Application state and event handlers
  detector.js      - TensorFlow.js model loading and detection
  renderer.js      - Canvas drawing utilities
  roi.js           - Region of Interest drag/resize logic
  tracker.js       - Object tracking algorithm (IoU + centroid)
  batch.js         - Multi-image processing and CSV export
  ui.js            - UI updates (counts, legend, filters)
  styles.css       - Dark theme styling
```

Dependencies loaded from CDN:
- TensorFlow.js 4.16.0
- COCO-SSD 2.2.2

COCO-SSD model details:
- Size: 26.7 MB (full model) or 5.4 MB (lite variant)
- Classes: 90 object categories
- Architecture: Single Shot Detector

## Performance Notes

Expected performance on modern hardware:
- **WebGL backend**: 25-30 FPS (recommended)
- **CPU backend**: 5-10 FPS
- **Detection latency**: 50-150ms per frame
- **Memory usage**: 100-200 MB with GPU acceleration

Optimization techniques:
- Warmup pass pre-allocates tensors for consistent frame times
- tf.tidy() ensures automatic tensor cleanup
- Canvas operations use hardware acceleration where available

## Troubleshooting

**Camera not working:**
- Check browser permissions in settings
- Try incognito/private browsing mode
- Ensure no other apps are using the camera

**Model fails to load:**
- Verify internet connection (model loads from CDN)
- Check browser console for errors
- Try clearing browser cache

**Slow performance:**
- Switch to WebGL backend in controls
- Increase confidence threshold to reduce detections
- Close other resource-intensive browser tabs

**No detections appearing:**
- Lower confidence threshold (default 0.5)
- Check that class filters aren't all disabled
- Ensure adequate lighting for webcam
- Verify media is loaded correctly for uploads

**ROI not working:**
- Ensure ROI is toggled on (check ROI status panel)
- Resize ROI to cover area where objects appear
- Check that at least 5% of object bbox overlaps ROI

**Batch CSV empty:**
- Run batch detection before exporting
- Verify threshold allows some detections through
- Check that uploaded images contain detectable objects

## Submission Checklist

- [x] Source code pushed to CMP stugit repository
- [ ] userguide.docx submitted to Blackboard (single A4 page with git URL)
- [ ] Demo video recorded (.mp4, under 15 minutes) and submitted to Blackboard

## Module Information

**Module**: CMP-6057A Advanced Web Development  
**Assignment**: WebAI Implementation  
**Student ID**: 100464305  
**Due Date**: 12 January 2026 at 15:00  
**Repository**: https://stugit.cmp.uea.ac.uk/rqc23shu/webai.git
