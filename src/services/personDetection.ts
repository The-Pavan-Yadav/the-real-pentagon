/**
 * Browser-Compatible On-Device Person Detection Service
 * Powered by TensorFlow.js and COCO-SSD.
 * Enforces anonymous student labels (Student 1, Student 2, etc.) and
 * manual staff association without facial recognition or biometric profiling.
 */

import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

export interface DetectedPerson {
  id: string;
  numericId: number;
  anonymousLabel: string;
  role: 'student' | 'teacher';
  score: number;
  bbox: [number, number, number, number]; // [x, y, width, height]
  normalizedBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  associatedName?: string;
  associatedRoll?: string;
  isDesignatedTeacher?: boolean;
}

export type ModelStatus = 'idle' | 'loading' | 'ready' | 'error';

export interface PersonTrackerOptions {
  designatedTeacherId?: string | null;
  designatedTeacherName?: string | null;
  manualStudentAssociations?: Record<string, { name: string; roll?: string }>;
}

export class PersonDetectionService {
  private model: cocoSsd.ObjectDetection | null = null;
  private status: ModelStatus = 'idle';
  private errorMessage: string | null = null;
  private isDetecting = false;
  private lastDetections: DetectedPerson[] = [];
  private trackedHistory: Map<number, { x: number; y: number; lastSeen: number }> = new Map();
  private nextId = 1;

  public getStatus(): ModelStatus {
    return this.status;
  }

  public getErrorMessage(): string | null {
    return this.errorMessage;
  }

  /**
   * Loads the TensorFlow.js COCO-SSD person detection model
   */
  public async loadModel(): Promise<boolean> {
    if (this.model && this.status === 'ready') {
      return true;
    }

    this.status = 'loading';
    this.errorMessage = null;

    try {
      // Ensure backend is ready (prefer WebGL, fallback to CPU)
      await tf.ready();
      try {
        await tf.setBackend('webgl');
      } catch {
        console.warn('WebGL backend unavailable, falling back to CPU');
        await tf.setBackend('cpu');
      }

      // Load lightweight model for real-time edge processing
      this.model = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      this.status = 'ready';
      return true;
    } catch (err: any) {
      console.error('Failed to load COCO-SSD model:', err);
      this.status = 'error';
      this.errorMessage = err?.message || 'Failed to initialize vision model. Check your internet connection.';
      return false;
    }
  }

  /**
   * Runs detection on a live video frame
   */
  public async detectPeople(
    video: HTMLVideoElement,
    options: PersonTrackerOptions = {}
  ): Promise<DetectedPerson[]> {
    if (!this.model || this.status !== 'ready' || !video || video.readyState < 2) {
      return this.lastDetections;
    }

    if (this.isDetecting) {
      return this.lastDetections;
    }

    this.isDetecting = true;

    try {
      const predictions = await this.model.detect(video, 10, 0.35);

      // Filter only for person class
      const personPredictions = predictions.filter(
        (p) => p.class === 'person' && p.score >= 0.35
      );

      const vw = video.videoWidth || 640;
      const vh = video.videoHeight || 480;

      const now = Date.now();

      // Stable tracking assignment: match closest previous person
      const assignedDetections: DetectedPerson[] = [];
      const usedIds = new Set<number>();

      for (const pred of personPredictions) {
        const [px, py, pw, ph] = pred.bbox;
        const cx = px + pw / 2;
        const cy = py + ph / 2;

        let bestMatchedId: number | null = null;
        let minDistance = 140; // pixel distance threshold

        for (const [tid, prevPos] of this.trackedHistory.entries()) {
          if (usedIds.has(tid)) continue;
          if (now - prevPos.lastSeen > 2500) continue; // expire after 2.5s

          const dist = Math.hypot(cx - prevPos.x, cy - prevPos.y);
          if (dist < minDistance) {
            minDistance = dist;
            bestMatchedId = tid;
          }
        }

        const numericId = bestMatchedId !== null ? bestMatchedId : this.nextId++;
        usedIds.add(numericId);
        this.trackedHistory.set(numericId, { x: cx, y: cy, lastSeen: now });

        const personKey = `p-${numericId}`;
        const isTeacher =
          options.designatedTeacherId === personKey ||
          (options.designatedTeacherId === 'podium' && numericId === 1 && !!options.designatedTeacherName);

        const manualAssoc = options.manualStudentAssociations?.[personKey];

        let anonymousLabel = `Student ${numericId}`;
        if (isTeacher) {
          anonymousLabel = options.designatedTeacherName
            ? `Teacher: ${options.designatedTeacherName}`
            : 'Designated Teacher';
        } else if (manualAssoc?.name) {
          anonymousLabel = `Student ${numericId} (${manualAssoc.name})`;
        }

        assignedDetections.push({
          id: personKey,
          numericId,
          anonymousLabel,
          role: isTeacher ? 'teacher' : 'student',
          score: pred.score,
          bbox: [px, py, pw, ph],
          normalizedBox: {
            x: Math.max(0, px / vw),
            y: Math.max(0, py / vh),
            width: Math.min(1, pw / vw),
            height: Math.min(1, ph / vh),
          },
          associatedName: manualAssoc?.name,
          associatedRoll: manualAssoc?.roll,
          isDesignatedTeacher: isTeacher,
        });
      }

      // Cleanup stale IDs
      for (const [tid, info] of this.trackedHistory.entries()) {
        if (now - info.lastSeen > 3500) {
          this.trackedHistory.delete(tid);
        }
      }

      this.lastDetections = assignedDetections;
      return assignedDetections;
    } catch (err) {
      console.warn('Error during person detection frame:', err);
      return this.lastDetections;
    } finally {
      this.isDetecting = false;
    }
  }

  /**
   * Resets tracking indices
   */
  public resetTracking(): void {
    this.trackedHistory.clear();
    this.nextId = 1;
    this.lastDetections = [];
  }
}
