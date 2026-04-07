# WebAI

WebAI is a browser-based real-time object detection demo built with TensorFlow.js, COCO-SSD, and Express. It can analyze live webcam input, uploaded images, or videos, then draw detections directly in the browser with optional tracking, ROI filtering, batch processing, and export support.

Originally developed as a university project and cleaned up for portfolio use.

## Highlights

- Live webcam detection with start/stop controls
- Image and video upload with drag-and-drop support
- Confidence threshold, class filters, and backend selection
- ROI gate and track-by-ID for zone-based monitoring
- Batch image processing with gallery and CSV export
- Screenshot capture, counts, legend, and explainable top-k view
- Responsive UI with keyboard shortcuts and accessibility labels

## Tech Stack

- Node.js + Express for static hosting
- TensorFlow.js 4.16.0
- COCO-SSD 2.2.2
- Vanilla JavaScript modules
- HTML and CSS frontend

## Quick Start

```bash
npm install
npm start
```

Then open http://localhost:3000.

## Requirements

- Node.js 18 or later
- A modern browser such as Chrome, Edge, or Firefox
- Webcam access if you want to test live detection

## How To Use

1. Start the app and wait for the model to load.
2. Choose a backend if you want to switch away from the default.
3. Start the webcam or upload an image/video.
4. Adjust the confidence threshold and class filters.
5. Optionally enable ROI or tracking.
6. Use screenshot, batch detection, or CSV export as needed.

## Project Structure

```text
server.js          Express server for the static app
public/index.html  Main interface
public/app.js      Application state and event wiring
public/detector.js Model loading and inference helpers
public/renderer.js Canvas drawing utilities
public/roi.js      ROI drag and resize logic
public/tracker.js  Track-by-ID logic
public/batch.js    Batch image processing and CSV export
public/ui.js       UI rendering helpers
public/styles.css  App styling
```

## Notes

- TensorFlow.js and COCO-SSD are loaded from CDN.
- WebGL usually gives the best performance if it is available.
- The app is served as static files; no build step is required for normal use.

## Interview Talking Points

- Explain how you handled model loading, warmup, and runtime fallback.
- Mention the tradeoff between webcam, upload, and batch workflows.
- Describe how ROI and tracking improve usability for retail-style monitoring.
- Point out the accessibility and keyboard support as polish.
