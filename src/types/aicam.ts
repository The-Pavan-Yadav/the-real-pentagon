export type CameraStatus =
  | 'idle'
  | 'requesting'
  | 'streaming'
  | 'paused'
  | 'stopped'
  | 'denied'
  | 'error'
  | 'no-device';

export type DetectionModelStatus =
  | 'unloaded'
  | 'loading'
  | 'ready'
  | 'error'
  | 'fallback';

export type BoardDetectionStatus =
  | 'detected'
  | 'searching'
  | 'uncertain'
  | 'unavailable';

export interface NormalizedRect {
  x: number; // 0 to 1
  y: number; // 0 to 1
  width: number; // 0 to 1
  height: number; // 0 to 1
}

export interface DetectedPerson {
  id: string; // e.g. "person-1"
  index: number;
  label: string; // e.g. "Student 1"
  confidence: number;
  bbox: [number, number, number, number]; // [x, y, width, height] in pixel coordinates
  normalized: NormalizedRect;
  isTeacher?: boolean;
  assignedStudentName?: string;
  assignedStudentId?: string;
  detectionSource?: 'coco-ssd' | 'fallback';
}

export interface BoardDetectionResult {
  detected: boolean;
  status: BoardDetectionStatus;
  type: 'whiteboard' | 'blackboard' | 'unknown';
  confidence: number;
  boundingBox: NormalizedRect;
  pixelBox?: { x: number; y: number; width: number; height: number };
  aspectRatio: number;
  contrastScore: number;
  visibleAreaPct: number;
  lastUpdated: number;
}

export interface TeacherDesignation {
  teacherName: string;
  subject?: string;
  detectionMode: 'zone' | 'nearest-board' | 'manual';
  zone: 'left-podium' | 'right-podium' | 'front-center';
  isDetected: boolean;
  designatedPersonId?: string;
}

export interface StudentRosterEntry {
  id: string;
  name: string;
  rollNo?: string;
  grade?: string;
}
