/**
 * Track-by-ID: Simple centroid + IoU matching across frames
 * Assigns persistent IDs to objects as they move through the scene
 */

export class ObjectTracker {
  constructor(maxTrackAge = 30, iouThreshold = 0.2, centroidThreshold = 150) {
    this.tracks = new Map(); // { trackId: { class, bbox, centroid, lastSeen, age, trajectory } }
    this.nextTrackId = 1;
    this.maxTrackAge = maxTrackAge; // Frames before removing track
    this.iouThreshold = iouThreshold; // Lowered from 0.3 to 0.2 for small objects
    this.centroidThreshold = centroidThreshold; // Increased from 100 to 150 pixels for larger search radius
  }

  /**
   * Update tracks with new detections
   * @param detections - Array of { class, score, bbox }
   * @returns Array of { class, score, bbox, trackId }
   */
  update(detections) {
    const matched = new Set();
    const trackIds = new Map(); // { detectionIdx: trackId }
    
    // Match existing tracks to current detections
    for (const [trackId, track] of this.tracks.entries()) {
      let bestMatch = -1;
      let bestScore = 0;

      for (let i = 0; i < detections.length; i++) {
        if (matched.has(i)) continue;

        const det = detections[i];
        
        // Same class required
        if (det.class !== track.class) continue;

        // Calculate IoU and centroid distance
        const iou = this.calculateIoU(track.bbox, det.bbox);
        const centroid = this.getBboxCentroid(det.bbox);
        const dist = this.euclideanDistance(track.centroid, centroid);
        
        // Adaptive thresholds: small objects need more lenient matching
        const bboxArea = (track.bbox[2] - track.bbox[0]) * (track.bbox[3] - track.bbox[1]);
        const adaptiveCentroidThreshold = bboxArea < 5000 ? 200 : this.centroidThreshold; // Small: 200px, others: 150px
        const adaptiveIouThreshold = bboxArea < 5000 ? 0.15 : this.iouThreshold; // Small objects: 0.15, others: 0.3
        
        // Skip if centroid distance exceeds adaptive threshold
        if (dist > adaptiveCentroidThreshold) continue;

        // Scoring: prefer high IoU and low distance
        const score = (iou > adaptiveIouThreshold ? iou : 0) - (dist / 500);

        if (score > bestScore) {
          bestScore = score;
          bestMatch = i;
        }
      }

      // Assign best match if found
      if (bestMatch >= 0) {
        const det = detections[bestMatch];
        track.bbox = det.bbox;
        track.centroid = this.getBboxCentroid(det.bbox);
        track.lastSeen = 0;
        track.age++;
        track.trajectory.push([...track.centroid]); // Store for drawing lines
        if (track.trajectory.length > 20) track.trajectory.shift(); // Keep last 20 points
        
        matched.add(bestMatch);
        trackIds.set(bestMatch, trackId);
      } else {
        // No match found, increment age
        track.lastSeen++;
      }
    }

    // Remove old tracks
    for (const [trackId, track] of this.tracks.entries()) {
      if (track.lastSeen > this.maxTrackAge) {
        this.tracks.delete(trackId);
      }
    }

    // Create new tracks for unmatched detections
    for (let i = 0; i < detections.length; i++) {
      if (!matched.has(i)) {
        const det = detections[i];
        this.tracks.set(this.nextTrackId, {
          class: det.class,
          bbox: det.bbox,
          centroid: this.getBboxCentroid(det.bbox),
          lastSeen: 0,
          age: 1,
          trajectory: [this.getBboxCentroid(det.bbox)]
        });
        trackIds.set(i, this.nextTrackId);
        this.nextTrackId++;
      }
    }

    // Return detections with track IDs
    return detections.map((det, idx) => ({
      ...det,
      trackId: trackIds.get(idx) || null
    }));
  }

  /**
   * Get centroid of bounding box [x1, y1, x2, y2]
   */
  getBboxCentroid(bbox) {
    const [x1, y1, x2, y2] = bbox;
    return [(x1 + x2) / 2, (y1 + y2) / 2];
  }

  /**
   * Calculate Intersection over Union (IoU) between two bboxes
   */
  calculateIoU(bbox1, bbox2) {
    const [x1_a, y1_a, x2_a, y2_a] = bbox1;
    const [x1_b, y1_b, x2_b, y2_b] = bbox2;

    const xA = Math.max(x1_a, x1_b);
    const yA = Math.max(y1_a, y1_b);
    const xB = Math.min(x2_a, x2_b);
    const yB = Math.min(y2_a, y2_b);

    const interArea = Math.max(0, xB - xA) * Math.max(0, yB - yA);
    const boxAArea = (x2_a - x1_a) * (y2_a - y1_a);
    const boxBArea = (x2_b - x1_b) * (y2_b - y1_b);
    const unionArea = boxAArea + boxBArea - interArea;

    return unionArea === 0 ? 0 : interArea / unionArea;
  }

  /**
   * Euclidean distance between two points
   */
  euclideanDistance(p1, p2) {
    const dx = p1[0] - p2[0];
    const dy = p1[1] - p2[1];
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Get active tracks
   */
  getTracks() {
    return Array.from(this.tracks.entries()).map(([id, track]) => ({
      trackId: id,
      ...track
    }));
  }

  /**
   * Clear all tracks
   */
  reset() {
    this.tracks.clear();
    this.nextTrackId = 1;
  }

  /**
   * Get count of active tracks
   */
  getActiveTrackCount() {
    return this.tracks.size;
  }
}

export function createTracker() {
  return new ObjectTracker();
}
