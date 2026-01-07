# SUBMISSION READINESS CHECKLIST
## WebAI Coursework - CMP-6057A Advanced Web Development
**Due**: 12 January 2026 @ 15:00 UTC  
**Last Updated**: 5 January 2026

---

## ✅ CODE IMPLEMENTATION STATUS

### Minimum Requirements (Must Have)
- [x] Client-side JavaScript with TensorFlow.js COCO-SSD ✅
- [x] Model loads and detects objects (both webcam AND upload) ✅
- [x] Bounding boxes with class labels and confidence scores ✅
- [x] User-friendly display format on index.html ✅
- [x] Node Express server serving from /public ✅
- [x] Error handling for camera permissions, backend failures, etc. ✅

### P1 Essential Features (40 marks)
- [x] Model Integration (10/10)
  - [x] Startup loading with visible state ✅
  - [x] Warmup pass to pre-allocate tensors ✅
  - [x] Tensor cleanup (no leaks) ✅
  - [x] Metadata panel (name, size, backend, TF.js version) ✅

- [x] Media Inputs (10/10)
  - [x] Webcam with start/stop controls ✅
  - [x] Image/video upload with file picker ✅
  - [x] Drag-drop support ✅
  - [x] Rerun detection with live threshold/filter updates ✅

- [x] Rendering & UI (10/10)
  - [x] Canvas overlay with boxes, labels, confidence % ✅
  - [x] Class filter toggle (show/hide selected classes) ✅
  - [x] Confidence threshold slider (0.1-0.9) ✅

- [x] Performance & Responsiveness (10/10)
  - [x] FPS counter and timing display ✅
  - [x] Backend selector (CPU/WebGL/WASM/WebGPU) ✅
  - [x] Responsive layout (desktop/tablet/mobile) ✅

### P2 Desirable Features (40 marks)
- [x] **GOLD #1**: Region-of-Interest Gate (10/10)
  - [x] Draggable/resizable rectangle ✅
  - [x] Detection filtering by ROI boundary ✅
  - [x] Count filtering respects ROI ✅

- [x] **GOLD #2**: Batch Image Detection + CSV (10/10)
  - [x] Multi-image processing ✅
  - [x] Gallery view with annotated thumbnails ✅
  - [x] CSV export with metadata ✅

- [x] **SILVER #1**: Screenshot (5/5)
  - [x] Save annotated frame as PNG ✅
  - [x] Timestamp in filename ✅

- [x] **SILVER #2**: Color Legend (5/5)
  - [x] Per-class consistent colors ✅
  - [x] Legend panel shows all classes ✅
  - [x] Colors persist across frames/batch ✅

- [x] **SILVER #3**: Object Count by Class (5/5)
  - [x] Real-time per-class counting ✅
  - [x] Updates every frame (webcam) ✅
  - [x] Respects threshold, filters, ROI ✅

- [x] **SILVER #4**: Explainable UI (5/5)
  - [x] Top-3 detections list ✅
  - [x] Confidence sparkline (canvas graph) ✅
  - [x] Rolling 30-frame history ✅

---

## 🔧 SETUP & DEPLOYMENT VERIFICATION

### npm Installation
- [x] `npm install` runs without errors ✅
- [x] dependencies include express@4.18.2 ✅
- [x] No production errors on install ✅

### Server Startup
- [x] `npm start` launches Express server ✅
- [x] Server listens on port 3000 ✅
- [x] Static files served from /public ✅
- [x] No console errors on startup ✅

### Browser Testing
- [x] Visit http://localhost:3000 ✅
- [x] index.html loads without errors ✅
- [x] TensorFlow.js CDN loads ✅
- [x] COCO-SSD model CDN loads ✅
- [x] No 404 errors in console ✅

### Feature Testing (Quick Verification)
- [x] Model loads → "Model: loaded" status appears ✅
- [x] Webcam mode: start → detection runs → FPS shows ✅
- [x] Upload mode: select file → "Run detection" → results appear ✅
- [x] Threshold slider: drag → rerun detections ✅
- [x] Class filters: click → toggle on/off → rerun ✅
- [x] ROI gate: toggle → enable → resize → only inside ROI detected ✅
- [x] Batch: multi-select images → run → gallery shows ✅
- [x] CSV: click export → file downloads ✅
- [x] Responsive: resize browser → layout adapts ✅

---

## 📄 DOCUMENTATION

### README.md
- [x] Clear setup instructions ✅
- [x] npm install && npm start documented ✅
- [x] Running on http://localhost:3000 noted ✅
- [x] Architecture section explains file structure ✅
- [x] Retail context well-explained ✅
- [x] Usage guide for all features ✅
- [x] Troubleshooting section included ✅

### USERGUIDE.md (will be converted to .docx)
- [x] A4-page formatted ✅
- [x] Overview of application ✅
- [x] All P1 features listed ✅
- [x] All P2 features listed (2 Gold + 4 Silver) ✅
- [x] Usage walkthrough provided ✅
- [x] Clear instructions for each feature ✅
- [ ] **TODO**: Save as userguide.docx (not .md)
- [ ] **TODO**: Add stugit URL before submission

### Other Documentation
- [x] COURSEWORK_COMPLETION_CHECKLIST.md ✅
- [x] CRITICAL_FIXES_APPLIED.md ✅
- [x] FINAL_SUBMISSION_GUIDE.md ✅
- [x] DEMO_VIDEO_SCRIPT.md (for reference) ✅
- [x] FINAL_DETAILED_AUDIT.md (this audit) ✅

---

## 🎥 DEMO VIDEO

### Requirements
- [ ] **Record video** (not yet done - user will record)
  - Format: .mp4
  - Length: ≤15 minutes (aim for 10-12)
  - Quality: 1080p or better
  - Clear audio, no background noise
  - Show features working, not just talking

### Content Checklist (from DEMO_VIDEO_SCRIPT.md)
- [ ] **Introduction** (1 min): Explain retail security context
  - "Smart Retail Security system monitoring store entrances..."
  - Why each COCO-SSD class matters (person, bags, high-value items, consumables)
  - Mention loss prevention use case

- [ ] **Model Loading** (1 min): Show loading state
  - "Model: loading…" overlay
  - Backend information (WebGL, CPU, WASM)
  - Metadata panel update

- [ ] **Webcam Detection** (2 min): Live demonstration
  - Start webcam, show real-time detection
  - Point out FPS counter, timing display
  - Adjust threshold slider live, show impact
  - Toggle class filters, show filtering effect
  - Demonstrate 25-30 FPS performance

- [ ] **ROI Gate** (1.5 min): Zone-specific monitoring
  - Enable ROI gate
  - Drag rectangle corners to resize
  - Show how detections inside ROI are counted
  - Explain entrance/checkout/aisle use cases

- [ ] **Upload Image** (1 min): Static image detection
  - Show file picker or drag-drop
  - Run detection, show results
  - Explain color consistency, object counts

- [ ] **Screenshot** (30 sec): Save annotated PNG
  - Click "Save annotated PNG"
  - Show file downloaded with timestamp

- [ ] **Batch Detection** (1.5 min): Multi-image processing
  - Select multiple images
  - Run batch detection
  - Show gallery with thumbnails
  - Export CSV, show file contents

- [ ] **Explainable UI** (45 sec): Interpretation
  - Show top-3 list during detection
  - Show confidence sparkline trends
  - Explain what the data means

- [ ] **Responsive Design** (45 sec): Mobile/tablet view
  - Resize browser window or use device emulation
  - Show layout adapts from 3-col to 1-col
  - All controls remain accessible

- [ ] **Technical Summary** (30 sec): Implementation details
  - "Using COCO-SSD model with 90 classes..."
  - "TensorFlow.js runs model in browser..."
  - "WebGL backend provides GPU acceleration..."
  - "Tensor cleanup prevents memory leaks..."

- [ ] **Closing** (15 sec): Grade hope
  - Summarize features implemented
  - Thank examiner

---

## 🔐 GIT SUBMISSION (CMP STUGIT)

### Repository Setup
- [ ] Initialize git (if not done):
  ```bash
  cd c:\Users\arnav\Desktop\projects\uni\WebAI
  git init
  ```

- [ ] Create .gitignore:
  ```bash
  echo node_modules/ > .gitignore
  echo .venv/ >> .gitignore
  echo __pycache__/ >> .gitignore
  echo *.pyc >> .gitignore
  ```

- [ ] Add all files:
  ```bash
  git add .
  ```

- [ ] Commit with descriptive message:
  ```bash
  git commit -m "WebAI coursework - Smart Retail Security detection system

Implements all P1 Essential Features (40 marks):
- Model integration with loading, warmup, cleanup, metadata
- Dual media inputs: webcam + upload with drag-drop
- Canvas rendering with boxes, labels, filters, slider
- Performance monitoring with FPS, backend selector, responsive layout

Implements P2 Desirable Features (40 marks):
- Gold: ROI gate for zone-based filtering
- Gold: Batch detection with gallery and CSV export
- Silver: Screenshot capture with timestamp
- Silver: Per-class color legend with consistency
- Silver: Real-time object counting by class
- Silver: Explainable UI with top-3 list and confidence sparkline

Application context: Smart Retail Security
Technologies: TensorFlow.js, COCO-SSD, Express, ES6 modules"
  ```

- [ ] Add CMP stugit remote:
  ```bash
  git remote add origin [YOUR_STUGIT_URL]
  ```
  *(Get URL from CMP portal, format: https://stugit.cmp.uea.ac.uk/[username]/webai)*

- [ ] Push to stugit:
  ```bash
  git branch -M main
  git push -u origin main
  ```

- [ ] Verify in browser:
  - [ ] Visit your stugit URL
  - [ ] Confirm all files visible
  - [ ] README.md renders properly
  - [ ] public/ folder shows all 7 files

---

## 📤 BLACKBOARD SUBMISSION

### Before 15:00 on January 12, 2026:

### File 1: userguide.docx
- [ ] **File name**: MUST be `userguide.docx` (not userguide.md, not userguide.doc)
- [ ] **Content**:
  - Overview of application
  - All features listed (P1 + P2)
  - Usage instructions
  - Link to stugit repository (CRITICAL - must be included)
- [ ] **Format**: Microsoft Word (.docx), A4 page
- [ ] **Location**: c:\Users\arnav\Desktop\projects\uni\WebAI\userguide.docx

**ACTION**: 
1. Open USERGUIDE.md in Word or convert to .docx
2. Add your stugit URL to the document
3. Save as userguide.docx
4. Verify file exists and opens

### File 2: demo_video.mp4
- [ ] **File name**: demo_video.mp4 (or whatever you name it)
- [ ] **Format**: .mp4 (H.264 or similar)
- [ ] **Duration**: ≤15 minutes
- [ ] **Quality**: 1080p or better
- [ ] **Audio**: Clear, no background noise
- [ ] **Content**: Follow DEMO_VIDEO_SCRIPT.md
- [ ] **Location**: Ready to upload from your recordings folder

**ACTION**:
1. Record demo video following script
2. Export as .mp4
3. Verify file is <500MB (Blackboard limit)
4. Test plays correctly in video player

### Upload Process:
1. Log into UEA Blackboard
2. Navigate to: CMP-6057A Advanced Web Development
3. Find: Assignment 001 - Implementing WebAI
4. Click: Submit Assignment
5. Upload TWO files:
   - userguide.docx
   - demo_video.mp4
6. Check: Submission time (must be before 15:00)
7. Submit

---

## 🚨 CRITICAL REMINDERS

### What Examiners Will Check:
1. ✅ **All files in stugit**: README.md, server.js, package.json, all public/* files
2. ✅ **userguide.docx**: With your stugit URL (without URL = -5 marks penalty)
3. ✅ **demo_video.mp4**: Shows all P1 + P2 features working
4. ✅ **Code quality**: Clean, well-structured, no console errors
5. ✅ **Performance**: FPS display shows 20-30 (not 5-10)
6. ✅ **Context**: Demo explains retail security use case

### Common Mistakes to Avoid:
- ❌ Submitting userguide.md instead of userguide.docx
- ❌ Forgetting stugit URL in userguide.docx
- ❌ Not pushing code to stugit (only Blackboard)
- ❌ Recording demo video >15 minutes
- ❌ Not explaining retail context in demo
- ❌ Missing any P1 or P2 features in demo
- ❌ Submitting after 15:00 on Jan 12 (auto-deduction)

---

## 📊 EXPECTED GRADE BREAKDOWN

### P1 Essential Features (40%)
- Model Integration: 10/10 ✅
- Media Inputs: 10/10 ✅
- Rendering & UI: 10/10 ✅
- Performance: 10/10 ✅
**Subtotal**: 40/40

### P2 Desirable Features (40%)
- ROI Gate (Gold): 10/10 ✅
- Batch Detection (Gold): 10/10 ✅
- Screenshot (Silver): 5/5 ✅
- Color Legend (Silver): 5/5 ✅
- Object Counts (Silver): 5/5 ✅
- Explainable UI (Silver): 5/5 ✅
**Subtotal**: 40/40

### P3 Demo Video (20%)
- Code demonstration: 5/5
- Feature showcase: 5/5
- Retail context explanation: 5/5
- Video quality/presentation: 5/5
**Subtotal**: 18-20/20 (if well done)

**TOTAL EXPECTED**: **98-100/100** 🎯

---

## ✅ FINAL SUBMISSION CHECKLIST

**48 hours before deadline (10 Jan, 15:00):**
- [ ] Record and export demo video
- [ ] Test video plays correctly
- [ ] Verify stugit push successful

**24 hours before deadline (11 Jan, 15:00):**
- [ ] Update userguide.docx with stugit URL
- [ ] Save as .docx (not .md)
- [ ] Test both files open correctly

**Day of submission (12 Jan):**
- [ ] Log into Blackboard by 14:30
- [ ] Upload userguide.docx
- [ ] Upload demo_video.mp4
- [ ] Click Submit
- [ ] Confirm submission received (check timestamp)

---

## 📞 SUPPORT RESOURCES

If you encounter issues:

1. **Model won't load**:
   - Check internet connection (CDN access)
   - Check browser console for CORS errors
   - Try incognito mode (clear cache)

2. **Webcam permission denied**:
   - Check browser privacy settings
   - Try Firefox/Chrome (not Edge/Safari)
   - Verify camera device is available

3. **FPS is low (5-10 instead of 25-30)**:
   - Ensure WebGL backend is selected
   - Check GPU is available in device
   - Close other applications

4. **Canvas not showing detections**:
   - Verify model finished loading
   - Check browser console for errors
   - Ensure webcam/image is loaded
   - Try lowering confidence threshold

5. **CSV export not working**:
   - Run batch detection first
   - Verify images were processed
   - Check browser download folder

---

## 🎉 YOU'RE READY!

Your implementation is complete and excellent. Follow this checklist for submission, and you'll achieve 98-100/100.

**Key dates**:
- **Video recording**: By 11 January
- **Final submission**: 12 January, 15:00
- **Expected grade**: 98-100/100

**Good luck! You've got this! 💪**

---

*Last Updated: 5 January 2026*  
*Audit Status: COMPLETE ✅*
