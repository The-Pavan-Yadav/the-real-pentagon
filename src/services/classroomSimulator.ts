/**
 * Classroom Video Stream Simulator
 * Generates a real-time, canvas-backed video stream simulating an active classroom
 * (with whiteboard, teacher at the podium, and seated students).
 * Enables seamless testing and operation when physical webcam permissions are
 * restricted, denied, or unavailable in sandboxed browser environments.
 */

export interface SimulatorController {
  stream: MediaStream;
  stop: () => void;
  setTeacherPresent: (present: boolean) => void;
  setStudentCount: (count: number) => void;
}

export function startClassroomSimulation(): SimulatorController {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 360;
  const ctx = canvas.getContext('2d');

  let isRunning = true;
  let animId: number | null = null;
  let frame = 0;
  let teacherPresent = true;
  let studentCount = 3;

  const renderFrame = () => {
    if (!isRunning || !ctx) return;
    frame++;

    const w = canvas.width;
    const h = canvas.height;

    // 1. Classroom Background Wall
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, w, h);

    // Floor gradient
    const floorGrad = ctx.createLinearGradient(0, h * 0.65, 0, h);
    floorGrad.addColorStop(0, '#1e293b');
    floorGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = floorGrad;
    ctx.fillRect(0, h * 0.65, w, h * 0.35);

    // Subtle wall perspective lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65);
    ctx.lineTo(w, h * 0.65);
    ctx.stroke();

    // 2. Classroom Whiteboard (Large high-contrast rectangular surface in upper center)
    const boardX = w * 0.18;
    const boardY = h * 0.12;
    const boardW = w * 0.64;
    const boardH = h * 0.44;

    // Board aluminum frame shadow & border
    ctx.fillStyle = '#475569';
    ctx.fillRect(boardX - 4, boardY - 4, boardW + 8, boardH + 8);

    // Whiteboard surface: High luminance, low saturation (detected by ClassroomBoardDetector)
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(boardX, boardY, boardW, boardH);

    // Marker pen tray at the bottom of the board
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(boardX - 8, boardY + boardH + 2, boardW + 16, 4);

    // Whiteboard written content (authentic classroom math & physics)
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 13px sans-serif';
    ctx.fillText('THE PENTAGON ACADEMY // CLASS 10-A', boardX + 16, boardY + 24);

    ctx.font = '11px sans-serif';
    ctx.fillStyle = '#1e3a8a';
    ctx.fillText('Topic: Electromagnetic Induction & Flux', boardX + 16, boardY + 44);

    ctx.fillStyle = '#0f172a';
    ctx.font = '12px monospace';
    ctx.fillText('Φ = B · A = B A cos(θ)', boardX + 16, boardY + 68);
    ctx.fillText('ε = - dΦ / dt  (Faraday-Lenz Law)', boardX + 16, boardY + 88);

    // Whiteboard Circuit Diagram
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.strokeRect(boardX + boardW - 130, boardY + 20, 110, 65);
    ctx.fillStyle = '#2563eb';
    ctx.font = '9px sans-serif';
    ctx.fillText('AC GENERATOR', boardX + boardW - 120, boardY + 56);

    // Teacher Podium on the Left
    const podiumX = w * 0.08;
    const podiumY = h * 0.58;
    ctx.fillStyle = '#334155';
    ctx.fillRect(podiumX, podiumY, 60, h * 0.35);

    // 3. Teacher Figure (Rendered if teacherPresent is true)
    if (teacherPresent) {
      const tx = w * 0.15;
      const ty = h * 0.38;
      // Slight animated breathing / gesture
      const bobY = Math.sin(frame * 0.04) * 2;
      const armAngle = Math.sin(frame * 0.05) * 0.15;

      // Teacher Head
      ctx.fillStyle = '#d4a373';
      ctx.beginPath();
      ctx.arc(tx, ty + bobY, 18, 0, Math.PI * 2);
      ctx.fill();

      // Teacher Hair
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(tx, ty + bobY - 4, 18, Math.PI * 0.8, Math.PI * 2.2);
      ctx.fill();

      // Teacher Torso / Formal Blazer
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.moveTo(tx - 24, ty + 18 + bobY);
      ctx.lineTo(tx + 24, ty + 18 + bobY);
      ctx.lineTo(tx + 28, ty + 105 + bobY);
      ctx.lineTo(tx - 28, ty + 105 + bobY);
      ctx.closePath();
      ctx.fill();

      // Shirt collar & tie
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(tx - 8, ty + 18 + bobY);
      ctx.lineTo(tx + 8, ty + 18 + bobY);
      ctx.lineTo(tx, ty + 34 + bobY);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#dc2626';
      ctx.fillRect(tx - 3, ty + 28 + bobY, 6, 26);

      // Teacher Pointing Arm (gesturing towards the board)
      ctx.strokeStyle = '#1e3a8a';
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(tx + 18, ty + 26 + bobY);
      ctx.lineTo(tx + 55 + armAngle * 20, ty + 10 + armAngle * 10);
      ctx.stroke();

      // Hand
      ctx.fillStyle = '#d4a373';
      ctx.beginPath();
      ctx.arc(tx + 58 + armAngle * 20, ty + 8 + armAngle * 10, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Students at Classroom Desks
    // We position 3 students across the foreground / midground
    const studentPositions = [
      { x: w * 0.38, y: h * 0.62, color: '#0284c7', skin: '#e0ac69', hair: '#1c1917' },
      { x: w * 0.58, y: h * 0.60, color: '#059669', skin: '#c68642', hair: '#292524' },
      { x: w * 0.78, y: h * 0.64, color: '#7c3aed', skin: '#f1c27d', hair: '#0f172a' },
    ];

    const countToDraw = Math.min(studentCount, studentPositions.length);

    for (let i = 0; i < countToDraw; i++) {
      const s = studentPositions[i];
      const sBob = Math.sin(frame * 0.05 + i * 1.5) * 1.5;

      // Student Head
      ctx.fillStyle = s.skin;
      ctx.beginPath();
      ctx.arc(s.x, s.y - 42 + sBob, 17, 0, Math.PI * 2);
      ctx.fill();

      // Student Hair
      ctx.fillStyle = s.hair;
      ctx.beginPath();
      ctx.arc(s.x, s.y - 46 + sBob, 17, Math.PI * 0.75, Math.PI * 2.25);
      ctx.fill();

      // Student Torso / Uniform Hoodie
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.moveTo(s.x - 22, s.y - 24 + sBob);
      ctx.lineTo(s.x + 22, s.y - 24 + sBob);
      ctx.lineTo(s.x + 26, s.y + 40);
      ctx.lineTo(s.x - 26, s.y + 40);
      ctx.closePath();
      ctx.fill();

      // Desk in front of student
      ctx.fillStyle = '#78350f';
      ctx.fillRect(s.x - 34, s.y + 16, 68, 14);

      // Notebook on desk
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(s.x - 14, s.y + 12, 28, 16);
      ctx.fillStyle = '#2563eb';
      ctx.fillRect(s.x - 12, s.y + 14, 24, 2);
    }

    // Top Right Watermark Badge: Classroom Simulator Stream
    ctx.fillStyle = 'rgba(3, 10, 22, 0.7)';
    ctx.fillRect(w - 190, 8, 182, 24);
    ctx.fillStyle = '#22d3ee';
    ctx.font = 'bold 10px monospace';
    ctx.fillText('SIMULATED CLASSROOM STREAM', w - 182, 24);

    animId = requestAnimationFrame(renderFrame);
  };

  animId = requestAnimationFrame(renderFrame);

  // Capture stream from canvas
  let stream: MediaStream;
  if ((canvas as any).captureStream) {
    stream = (canvas as any).captureStream(30);
  } else if ((canvas as any).mozCaptureStream) {
    stream = (canvas as any).mozCaptureStream(30);
  } else {
    // Fallback if captureStream is unavailable
    const dummyVideo = document.createElement('canvas');
    dummyVideo.width = 1;
    dummyVideo.height = 1;
    stream = (dummyVideo as any).captureStream ? (dummyVideo as any).captureStream(1) : new MediaStream();
  }

  return {
    stream,
    stop: () => {
      isRunning = false;
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
      try {
        stream.getTracks().forEach((t) => t.stop());
      } catch {}
    },
    setTeacherPresent: (val: boolean) => {
      teacherPresent = val;
    },
    setStudentCount: (val: number) => {
      studentCount = val;
    },
  };
}
