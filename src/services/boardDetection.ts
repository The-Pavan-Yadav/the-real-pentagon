/**
 * Dedicated Classroom Board Detection Module
 * Analyzes video frames locally on an offscreen canvas to detect classroom
 * whiteboards and blackboards based on geometric aspect ratio, color uniformity,
 * luminance signature, and boundary contrast.
 */

export interface BoardBox {
  x: number; // 0 to 1 (normalized)
  y: number;
  width: number;
  height: number;
  pixelX: number;
  pixelY: number;
  pixelWidth: number;
  pixelHeight: number;
}

export interface BoardDetectionResult {
  detected: boolean;
  type: 'whiteboard' | 'blackboard' | 'none';
  confidence: number; // 0 to 1
  box: BoardBox | null;
  label: string;
  averageLuminance: number; // 0 to 255
  message: string;
}

export interface BoardCaptureData {
  dataUrl: string;
  width: number;
  height: number;
  timestamp: number;
  boardType: 'whiteboard' | 'blackboard';
  confidence: number;
}

export class ClassroomBoardDetector {
  private offscreenCanvas: HTMLCanvasElement;
  private offscreenCtx: CanvasRenderingContext2D | null;
  private lastResult: BoardDetectionResult = {
    detected: false,
    type: 'none',
    confidence: 0,
    box: null,
    label: 'No Board Detected',
    averageLuminance: 0,
    message: 'Searching for classroom board surface...',
  };

  // Smoothing over frames to prevent bounding box jitter
  private smoothedBox: BoardBox | null = null;
  private consecutiveDetections = 0;

  constructor() {
    this.offscreenCanvas = document.createElement('canvas');
    // Process at 160x90 for fast, lightweight 30fps detection without GPU/CPU lag
    this.offscreenCanvas.width = 160;
    this.offscreenCanvas.height = 90;
    this.offscreenCtx = this.offscreenCanvas.getContext('2d', { willReadFrequently: true });
  }

  /**
   * Detects whiteboard or blackboard on the current video frame.
   */
  public detect(video: HTMLVideoElement): BoardDetectionResult {
    if (!this.offscreenCtx || !video || video.readyState < 2) {
      return this.lastResult;
    }

    const sw = this.offscreenCanvas.width;
    const sh = this.offscreenCanvas.height;

    // Draw video frame to downscaled offscreen canvas
    this.offscreenCtx.drawImage(video, 0, 0, sw, sh);
    let imgData: ImageData;
    try {
      imgData = this.offscreenCtx.getImageData(0, 0, sw, sh);
    } catch {
      return this.lastResult;
    }

    const data = imgData.data;
    let totalLuminance = 0;

    // Matrix of classified cells (0: background, 1: whiteboard candidate, 2: blackboard candidate)
    // We downscale into a coarse grid of 16x9 blocks (each 10x10 pixels) for shape stability
    const gridCols = 16;
    const gridRows = 9;
    const blockW = sw / gridCols;
    const blockH = sh / gridRows;

    const cellScores: { wb: number; bb: number; lum: number }[][] = [];

    for (let gy = 0; gy < gridRows; gy++) {
      cellScores[gy] = [];
      for (let gx = 0; gx < gridCols; gx++) {
        let wbCount = 0;
        let bbCount = 0;
        let blockLum = 0;
        let pixelCount = 0;

        for (let py = Math.floor(gy * blockH); py < Math.floor((gy + 1) * blockH); py++) {
          for (let px = Math.floor(gx * blockW); px < Math.floor((gx + 1) * blockW); px++) {
            const idx = (py * sw + px) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            // Perceived luminance
            const lum = 0.299 * r + 0.587 * g + 0.114 * b;
            blockLum += lum;
            totalLuminance += lum;
            pixelCount++;

            // Color saturation
            const maxC = Math.max(r, g, b);
            const minC = Math.min(r, g, b);
            const sat = maxC === 0 ? 0 : (maxC - minC) / maxC;

            // Whiteboard criteria: high luminance (> 165) and low saturation (< 0.28)
            if (lum > 160 && sat < 0.28) {
              wbCount++;
            }
            // Chalkboard criteria: dark matte green (lum between 30 and 95, green dominant: g > r + 6 && g > b)
            // Or dark slate (lum between 25 and 75, sat < 0.25)
            else if ((lum >= 28 && lum <= 95 && g > r + 5 && g > b) || (lum >= 25 && lum <= 80 && sat < 0.2)) {
              bbCount++;
            }
          }
        }

        cellScores[gy][gx] = {
          wb: wbCount / pixelCount,
          bb: bbCount / pixelCount,
          lum: blockLum / pixelCount,
        };
      }
    }

    const avgSceneLuminance = totalLuminance / (sw * sh);

    // Find contiguous candidate bounding box for whiteboard or chalkboard
    const wbBox = this.findLargestBoardCluster(cellScores, 'wb', gridCols, gridRows);
    const bbBox = this.findLargestBoardCluster(cellScores, 'bb', gridCols, gridRows);

    let bestCandidate: {
      type: 'whiteboard' | 'blackboard';
      box: BoardBox;
      confidence: number;
    } | null = null;

    if (wbBox && wbBox.confidence >= 0.52) {
      bestCandidate = {
        type: 'whiteboard',
        box: wbBox.box,
        confidence: wbBox.confidence,
      };
    } else if (bbBox && bbBox.confidence >= 0.52) {
      bestCandidate = {
        type: 'blackboard',
        box: bbBox.box,
        confidence: bbBox.confidence,
      };
    }

    if (bestCandidate) {
      this.consecutiveDetections++;
      // Smooth box transitions
      if (!this.smoothedBox) {
        this.smoothedBox = { ...bestCandidate.box };
      } else {
        const alpha = 0.25; // smoothing factor
        this.smoothedBox = {
          x: this.smoothedBox.x * (1 - alpha) + bestCandidate.box.x * alpha,
          y: this.smoothedBox.y * (1 - alpha) + bestCandidate.box.y * alpha,
          width: this.smoothedBox.width * (1 - alpha) + bestCandidate.box.width * alpha,
          height: this.smoothedBox.height * (1 - alpha) + bestCandidate.box.height * alpha,
          pixelX: Math.round(this.smoothedBox.x * (video.videoWidth || 640)),
          pixelY: Math.round(this.smoothedBox.y * (video.videoHeight || 480)),
          pixelWidth: Math.round(this.smoothedBox.width * (video.videoWidth || 640)),
          pixelHeight: Math.round(this.smoothedBox.height * (video.videoHeight || 480)),
        };
      }

      const boardName = bestCandidate.type === 'whiteboard' ? 'Classroom Whiteboard' : 'Classroom Chalkboard';
      const confPct = Math.round(bestCandidate.confidence * 100);

      this.lastResult = {
        detected: true,
        type: bestCandidate.type,
        confidence: bestCandidate.confidence,
        box: this.smoothedBox,
        label: `${boardName} (${confPct}%)`,
        averageLuminance: Math.round(avgSceneLuminance),
        message: `${boardName} surface identified in active classroom framing.`,
      };
    } else {
      if (this.consecutiveDetections > 0) {
        this.consecutiveDetections--;
      }
      if (this.consecutiveDetections === 0) {
        this.smoothedBox = null;
        this.lastResult = {
          detected: false,
          type: 'none',
          confidence: 0,
          box: null,
          label: 'No Board In View',
          averageLuminance: Math.round(avgSceneLuminance),
          message: 'No continuous whiteboard or chalkboard detected in frame.',
        };
      }
    }

    return this.lastResult;
  }

  /**
   * Identifies contiguous rectangular cluster of board cells
   */
  private findLargestBoardCluster(
    cells: { wb: number; bb: number; lum: number }[][],
    type: 'wb' | 'bb',
    cols: number,
    rows: number
  ): { box: BoardBox; confidence: number } | null {
    const threshold = type === 'wb' ? 0.45 : 0.4;
    const binary: boolean[][] = [];

    let totalMatching = 0;
    for (let y = 0; y < rows; y++) {
      binary[y] = [];
      for (let x = 0; x < cols; x++) {
        const val = type === 'wb' ? cells[y][x].wb : cells[y][x].bb;
        const matches = val >= threshold;
        binary[y][x] = matches;
        if (matches) totalMatching++;
      }
    }

    // Must occupy at least 3 grid blocks to be considered a board
    if (totalMatching < 3) return null;

    // Find bounding rectangle of matching cells
    let minX = cols;
    let maxX = -1;
    let minY = rows;
    let maxY = -1;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        if (binary[y][x]) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX < minX || maxY < minY) return null;

    const blockWidthSpan = maxX - minX + 1;
    const blockHeightSpan = maxY - minY + 1;

    // Boards are typically wider than they are tall or at least square (aspect ratio >= 1.0)
    const aspect = blockWidthSpan / blockHeightSpan;
    if (aspect < 0.8) return null;

    // Density of board cells within the bounding box
    let interiorHits = 0;
    const totalBoxCells = blockWidthSpan * blockHeightSpan;
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        if (binary[y][x]) interiorHits++;
      }
    }

    const density = interiorHits / totalBoxCells;
    if (density < 0.4) return null;

    // Normalized coordinates
    const normX = Math.max(0, minX / cols);
    const normY = Math.max(0, minY / rows);
    const normW = Math.min(1 - normX, blockWidthSpan / cols);
    const normH = Math.min(1 - normY, blockHeightSpan / rows);

    // Confidence derived from density, size, and aspect ratio
    const sizeRatio = (normW * normH); // fractional area of viewport
    let confidence = 0.5 + density * 0.3 + (aspect >= 1.2 ? 0.15 : 0.05);
    if (sizeRatio > 0.05 && sizeRatio < 0.75) {
      confidence += 0.05;
    }
    confidence = Math.min(0.96, Math.max(0.5, confidence));

    return {
      box: {
        x: normX,
        y: normY,
        width: normW,
        height: normH,
        pixelX: 0,
        pixelY: 0,
        pixelWidth: 0,
        pixelHeight: 0,
      },
      confidence,
    };
  }

  /**
   * Extracts a high-resolution crop of the detected board region from the live video stream.
   * Useful for the future-ready OCR / content extraction component.
   */
  public captureBoardCrop(
    video: HTMLVideoElement,
    box: BoardBox,
    type: 'whiteboard' | 'blackboard',
    confidence: number
  ): BoardCaptureData | null {
    if (!video || !video.videoWidth || !video.videoHeight) return null;

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    const sx = Math.max(0, Math.floor(box.x * vw));
    const sy = Math.max(0, Math.floor(box.y * vh));
    const sw = Math.min(vw - sx, Math.floor(box.width * vw));
    const sh = Math.min(vh - sy, Math.floor(box.height * vh));

    if (sw <= 10 || sh <= 10) return null;

    const canvas = document.createElement('canvas');
    canvas.width = sw;
    canvas.height = sh;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.drawImage(video, sx, sy, sw, sh, 0, 0, sw, sh);

    return {
      dataUrl: canvas.toDataURL('image/jpeg', 0.92),
      width: sw,
      height: sh,
      timestamp: Date.now(),
      boardType: type,
      confidence,
    };
  }
}
