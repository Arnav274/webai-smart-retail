WebAI Stress Test Protocol

Open http://localhost:3000 in Chrome or Edge (recommended)
Open DevTools (F12) → Console tab

═══════════════════════════════════════════════════════════════════

TEST 1: MODEL INITIALIZATION (Critical)
1. Page loads → Loading overlay should appear
2. Console: Should see TensorFlow.js initialization logs
3. Wait 5-10 seconds
4. Status chip updates to "Model: loaded (webgl)"
5. Loading overlay disappears
6. Metadata panel shows: Name: COCO-SSD, Size: ~X MB, Backend: webgl
7. All buttons enabled

✅ PASS CRITERIA: No console errors, model loads, metadata visible
❌ FAIL IF: Console errors, "Model: failed to load", buttons stay disabled

═══════════════════════════════════════════════════════════════════

TEST 2: WEBCAM (High Priority)
1. Click "Start webcam"
2. Browser shows permission prompt → click "Allow"
3. Video stream appears in canvas
4. Within 1-2 seconds, boxes should start appearing
5. Check FPS counter: should be 15-30 on WebGL
6. Check timing: should be 30-60ms on WebGL
7. Adjust threshold slider → detections filter immediately
8. Click class filter pills → only those classes show
9. Let run for 30 seconds → verify FPS stays stable
10. Click "Stop webcam" → stream stops, canvas clears

✅ PASS CRITERIA: Smooth detection, FPS >15, no lag, filters work
❌ FAIL IF: FPS <5, detection freezes, console errors, memory leak warnings

═══════════════════════════════════════════════════════════════════

TEST 3: UPLOAD MODE (High Priority)
1. Prepare test image (any photo with people/objects)
2. Click file picker → choose image
3. Click "Run detection on upload"
4. Detection completes in <2 seconds
5. Boxes appear on image with labels
6. Counts panel updates
7. Legend shows colors
8. Try drag-drop: drag image to dropzone → auto-runs
9. Try video file (short MP4) → detection runs on first frame

✅ PASS CRITERIA: Detection fast (<2s), boxes accurate, no errors
❌ FAIL IF: Takes >5s, no boxes appear, console errors

═══════════════════════════════════════════════════════════════════

TEST 4: BACKEND SWITCHING (Medium Priority)
1. Select "CPU" from backend dropdown
2. Wait 1-2s → metadata updates to "Backend: cpu"
3. Run webcam or upload → slower but works (FPS ~5-10)
4. Switch back to "WebGL"
5. Verify FPS improves back to 15-30

✅ PASS CRITERIA: Backend switches without crash, performance changes visible
❌ FAIL IF: Crash, error message, no performance change

═══════════════════════════════════════════════════════════════════

TEST 5: ROI GATE (Gold Feature - Critical for marks)
1. Start webcam or upload an image
2. Click "Toggle ROI"
3. Blue rectangle appears with corner handles
4. Drag a corner → rectangle resizes smoothly
5. Drag center → rectangle moves
6. Position ROI to exclude some detections
7. Verify: only boxes inside ROI are drawn
8. Verify: counts only include inside-ROI objects
9. Try to resize below ~24px → enforces minimum size
10. Try to drag outside canvas → clamps to bounds
11. Toggle ROI off → rectangle disappears, all detections show

✅ PASS CRITERIA: Smooth drag, filtering works, no glitches
❌ FAIL IF: Drag doesn't work, filtering broken, console errors

═══════════════════════════════════════════════════════════════════

TEST 6: BATCH PROCESSING (Gold Feature - Critical for marks)
1. Prepare 5-10 test images (people, objects)
2. Click batch file input
3. Multi-select all images (Ctrl+click or Shift+click)
4. Click "Run batch detection"
5. Gallery populates with thumbnails
6. Each thumbnail shows:
   - Original image scaled down
   - Bounding boxes overlaid
   - Labels with confidence
   - Filename at bottom
7. Verify colors match live detection colors
8. Click "Export CSV"
9. Open CSV file → verify format:
   filename,class,score,x,y,width,height
   image1.jpg,person,0.950,100,50,80,200
   ...
10. Check all rows populated correctly

✅ PASS CRITERIA: All images processed, gallery shows overlays, CSV valid
❌ FAIL IF: Gallery empty, CSV missing data, console errors

═══════════════════════════════════════════════════════════════════

TEST 7: SCREENSHOT (Silver Feature)
1. Start webcam or upload image
2. Wait for detections to appear
3. Click "Save annotated PNG"
4. File downloads: screenshot-{timestamp}.png
5. Open file → verify:
   - Image shows canvas content
   - Boxes visible
   - Labels readable
   - No corruption

✅ PASS CRITERIA: PNG downloads, opens correctly, shows overlays
❌ FAIL IF: Download fails, file corrupt, no overlays in image

═══════════════════════════════════════════════════════════════════

TEST 8: LEGEND & COUNTS (Silver Features)
1. Run detection (webcam or upload)
2. Legend panel: shows colored squares + class names
3. Verify colors match boxes on canvas
4. Run detection again → same classes have same colors (consistency)
5. Counts panel: shows "person: 3, backpack: 1, etc."
6. Verify counts match visible boxes
7. Enable ROI → counts update to only inside-ROI

✅ PASS CRITERIA: Legend consistent, counts accurate, ROI filters counts
❌ FAIL IF: Colors change per frame, counts wrong, legend empty

═══════════════════════════════════════════════════════════════════

TEST 9: EXPLAINABLE UI (Silver Feature)
1. Run detection (webcam or upload)
2. Explainable UI panel shows:
   - Top-3 list (e.g., "person 95%", "backpack 87%", "bottle 72%")
   - Sparkline graph below
3. Webcam: let run 30 seconds → sparkline draws rolling line
4. Verify sparkline updates per frame
5. Stop webcam → sparkline freezes at last state
6. Upload new image → top-3 updates, sparkline continues

✅ PASS CRITERIA: Top-3 shows correct classes, sparkline draws smoothly
❌ FAIL IF: List empty, sparkline broken, no updates

═══════════════════════════════════════════════════════════════════

TEST 10: RESPONSIVE LAYOUT (P1 Essential)
1. Resize browser window to 1200px wide (desktop)
   → Layout: 3 columns side-by-side
2. Resize to 900px wide (tablet)
   → Layout: 1 column stacked
3. Resize to 500px wide (mobile)
   → Layout: 1 column, controls readable, buttons not cut off
4. Test on phone if available:
   → Everything readable
   → Buttons large enough to tap
   → Canvas scales to screen width

✅ PASS CRITERIA: Layout adapts smoothly, no cut-off content
❌ FAIL IF: Layout breaks, horizontal scroll appears, text unreadable

═══════════════════════════════════════════════════════════════════

TEST 11: ERROR HANDLING
1. Camera permission denied test:
   - Start webcam → deny permission
   - Message shows "Camera permission denied or unavailable"
   - App doesn't crash
   - Upload mode still works
2. Backend switch failure (simulated):
   - Try selecting "webgpu" if not supported
   - Error message appears if fails
   - App recovers, fallback to current backend
3. No detections:
   - Upload image with no objects (blank wall)
   - Counts show "No detections yet"
   - Explain shows "No detections"
   - No console errors

✅ PASS CRITERIA: Graceful error messages, no crash, app recovers
❌ FAIL IF: Crash, uncaught errors, app freezes

═══════════════════════════════════════════════════════════════════

TEST 12: PERFORMANCE & MEMORY (Critical)
1. Open DevTools → Performance tab
2. Start webcam, let run for 60 seconds
3. Stop webcam
4. Check Console → no memory leak warnings
5. Check Performance tab → no red spikes, stable frame rate
6. DevTools → Memory tab → take heap snapshot
7. Restart webcam, run 60 seconds, stop
8. Take another heap snapshot
9. Compare: memory should not grow significantly

✅ PASS CRITERIA: No leaks, FPS stable, memory usage flat
❌ FAIL IF: Memory grows >50MB, FPS drops over time, leak warnings

═══════════════════════════════════════════════════════════════════

TEST 13: RAPID INPUT STRESS
1. Rapidly adjust threshold slider (move 10 times in 2 seconds)
   → Should not crash, latest value applies
2. Rapidly toggle class filters (click 5 pills fast)
   → Should not crash, filters apply
3. Toggle ROI on/off 5 times quickly
   → Should not crash, overlay toggles correctly
4. Start/stop webcam 3 times in 10 seconds
   → Should not crash, stream starts/stops cleanly

✅ PASS CRITERIA: App handles rapid input, no crash
❌ FAIL IF: Crash, freeze, uncaught errors

═══════════════════════════════════════════════════════════════════

TEST 14: CROSS-BROWSER (Optional but Recommended)
Test on at least 2 browsers:
- Chrome/Edge (Chromium) ✅ Primary
- Firefox ✅ Secondary
- Safari (if Mac available)

All features should work identically.

✅ PASS CRITERIA: Works on 2+ browsers
❌ FAIL IF: Breaks on Firefox or Safari

═══════════════════════════════════════════════════════════════════

FINAL CHECKLIST

[ ] Model loads without errors
[ ] Webcam detection smooth (FPS >15)
[ ] Upload detection fast (<2s)
[ ] Backend switching works
[ ] ROI draggable and filters correctly
[ ] Batch gallery shows overlays, CSV exports
[ ] Screenshot saves PNG correctly
[ ] Legend colors consistent
[ ] Counts accurate and respect ROI
[ ] Explainable UI shows top-3 and sparkline
[ ] Responsive layout works on desktop/tablet/mobile
[ ] Error handling graceful (no crashes)
[ ] No memory leaks (60s test passes)
[ ] Rapid input doesn't crash
[ ] Works on 2+ browsers

IF ALL CHECKED: ✅ READY TO RECORD DEMO VIDEO
IF ANY FAIL: Debug and retest before recording

═══════════════════════════════════════════════════════════════════
