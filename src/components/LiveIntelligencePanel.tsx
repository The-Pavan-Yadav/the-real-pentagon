import React, { useState } from 'react';
import {
  CameraStatus,
  DetectedPerson,
  BoardDetectionResult,
  TeacherDesignation,
  StudentRosterEntry,
  DetectionModelStatus,
} from '../types/aicam';
import { ClassroomSetup } from '../types';

interface LiveIntelligencePanelProps {
  isOpen: boolean;
  onToggle: () => void;
  cameraStatus: CameraStatus;
  setup: ClassroomSetup | null;
  people: DetectedPerson[];
  totalPeopleCount: number;
  studentCount: number;
  teacherFound: boolean;
  teacherPerson: DetectedPerson | null;
  teacherSetup: TeacherDesignation;
  onUpdateTeacherSetup: (updated: TeacherDesignation) => void;
  boardResult: BoardDetectionResult | null;
  roster: StudentRosterEntry[];
  rosterAssociations: Record<string, { id: string; name: string }>;
  onAssociateStudent: (personId: string, student: StudentRosterEntry | null) => void;
  onOpenEditSetup: () => void;
  onCaptureBoardSnapshot: () => void;
  luminanceInfo: { luminance: number; isLowLight: boolean; status: 'optimal' | 'moderate' | 'low-light' };
  modelStatus: DetectionModelStatus;
  facultyList: { id: string; name: string; subject: string; department: string }[];
  fps: number;
}

export const LiveIntelligencePanel: React.FC<LiveIntelligencePanelProps> = ({
  isOpen,
  onToggle,
  cameraStatus,
  setup,
  people,
  totalPeopleCount,
  studentCount,
  teacherFound,
  teacherPerson,
  teacherSetup,
  onUpdateTeacherSetup,
  boardResult,
  roster,
  rosterAssociations,
  onAssociateStudent,
  onOpenEditSetup,
  onCaptureBoardSnapshot,
  luminanceInfo,
  modelStatus,
  facultyList,
  fps,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'teacher' | 'roster'>('overview');
  const [selectedStudentForLink, setSelectedStudentForLink] = useState<{ [personId: string]: string }>({});

  const isCameraActive = cameraStatus === 'streaming';
  const isCameraPaused = cameraStatus === 'paused';

  return (
    <aside
      className={`aicam-intel-panel ${isOpen ? 'open' : 'collapsed'}`}
      aria-label="Live Classroom Intelligence Telemetry"
    >
      {/* Panel Top Bar */}
      <div className="intel-panel-header">
        <div className="intel-header-title">
          <div className="intel-pulse-indicator active" />
          <span>LIVE INTELLIGENCE</span>
          <span className="intel-version-pill">Local CV</span>
        </div>

        <div className="intel-header-controls">
          <button
            type="button"
            className="intel-collapse-btn"
            onClick={onToggle}
            title={isOpen ? 'Collapse intelligence panel' : 'Expand intelligence panel'}
            aria-label={isOpen ? 'Collapse panel' : 'Expand panel'}
          >
            {isOpen ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="intel-panel-content">
          {/* Active Classroom Ribbon */}
          <div className="intel-classroom-card">
            <div className="intel-card-row">
              <span className="intel-card-label">Target Classroom</span>
              <button
                type="button"
                className="intel-link-btn"
                onClick={onOpenEditSetup}
                title="Change class, section or room"
              >
                Edit Setup
              </button>
            </div>
            {setup ? (
              <div className="intel-classroom-data">
                <div className="intel-cr-main">
                  <strong>{setup.className}</strong>
                  <span className="intel-dot">•</span>
                  <span>Section {setup.section}</span>
                </div>
                <div className="intel-cr-sub">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  </svg>
                  <span>{setup.roomNumber}</span>
                </div>
              </div>
            ) : (
              <span className="intel-empty-note">Classroom setup pending</span>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="intel-tabs-row">
            <button
              type="button"
              className={`intel-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button
              type="button"
              className={`intel-tab ${activeTab === 'teacher' ? 'active' : ''}`}
              onClick={() => setActiveTab('teacher')}
            >
              Teacher
              {teacherFound && <span className="tab-bubble-success" />}
            </button>
            <button
              type="button"
              className={`intel-tab ${activeTab === 'roster' ? 'active' : ''}`}
              onClick={() => setActiveTab('roster')}
            >
              Students ({studentCount})
            </button>
          </div>

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="intel-tab-pane">
              {/* PRIMARY STATUS STATUS GRIDS - Clearly distinguishes DETECTED, UNAVAILABLE, and UNCERTAIN */}
              <div className="intel-metrics-stack">
                {/* 1. Camera Status Card */}
                <div className="intel-metric-box">
                  <div className="metric-box-header">
                    <span className="metric-title">Camera Feed Status</span>
                    <span
                      className={`intel-status-tag ${
                        cameraStatus === 'streaming'
                          ? 'detected'
                          : cameraStatus === 'paused'
                          ? 'uncertain'
                          : cameraStatus === 'denied' || cameraStatus === 'error'
                          ? 'error'
                          : 'unavailable'
                      }`}
                    >
                      {cameraStatus === 'streaming' && 'DETECTED // LIVE'}
                      {cameraStatus === 'paused' && 'UNCERTAIN // PAUSED'}
                      {cameraStatus === 'idle' && 'UNAVAILABLE // OFF'}
                      {cameraStatus === 'stopped' && 'UNAVAILABLE // STOPPED'}
                      {cameraStatus === 'requesting' && 'UNCERTAIN // PERMISSION'}
                      {cameraStatus === 'denied' && 'UNAVAILABLE // DENIED'}
                      {cameraStatus === 'error' && 'UNAVAILABLE // ERROR'}
                      {cameraStatus === 'no-device' && 'UNAVAILABLE // NO CAM'}
                    </span>
                  </div>
                  <div className="metric-detail">
                    {cameraStatus === 'streaming' && (
                      <span className="metric-subtext">
                        Active Optical Stream • {fps > 0 ? `${fps} FPS` : '60 FPS'} • 1080p Stage
                      </span>
                    )}
                    {cameraStatus === 'paused' && (
                      <span className="metric-subtext">Stream paused by faculty. Click Resume.</span>
                    )}
                    {(cameraStatus === 'idle' || cameraStatus === 'stopped') && (
                      <span className="metric-subtext">Camera sensor is dormant. Click "Start Camera".</span>
                    )}
                    {cameraStatus === 'denied' && (
                      <span className="metric-subtext alert">Permission blocked in browser settings.</span>
                    )}
                  </div>
                </div>

                {/* 2. Anonymous Student & People Count */}
                <div className="intel-metric-box">
                  <div className="metric-box-header">
                    <span className="metric-title">Anonymous People Count</span>
                    <span
                      className={`intel-status-tag ${
                        !isCameraActive
                          ? 'unavailable'
                          : totalPeopleCount > 0
                          ? 'detected'
                          : 'uncertain'
                      }`}
                    >
                      {!isCameraActive
                        ? 'UNAVAILABLE'
                        : totalPeopleCount > 0
                        ? 'DETECTED'
                        : 'UNCERTAIN // EMPTY'}
                    </span>
                  </div>
                  <div className="intel-stat-large">
                    <span className="stat-number">{isCameraActive ? totalPeopleCount : '—'}</span>
                    <div className="stat-breakdown">
                      <span className="stat-chip student">
                        {isCameraActive ? studentCount : '—'} Students (Anon)
                      </span>
                      <span className="stat-chip faculty">
                        {isCameraActive ? (teacherFound ? '1 Faculty' : '0 Faculty') : '—'}
                      </span>
                    </div>
                  </div>
                  <span className="metric-subtext">
                    Strict privacy: People are labeled anonymously without facial biometric identification.
                  </span>
                </div>

                {/* 3. Teacher Presence Status */}
                <div className="intel-metric-box">
                  <div className="metric-box-header">
                    <span className="metric-title">Teacher Presence</span>
                    <span
                      className={`intel-status-tag ${
                        !isCameraActive
                          ? 'unavailable'
                          : teacherFound
                          ? 'detected'
                          : 'uncertain'
                      }`}
                    >
                      {!isCameraActive
                        ? 'UNAVAILABLE'
                        : teacherFound
                        ? 'DETECTED'
                        : 'UNCERTAIN // NOT IN VIEW'}
                    </span>
                  </div>
                  <div className="metric-highlight-row">
                    <div className="teacher-avatar-badge">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <div>
                      <div className="teacher-name-line">
                        <strong>{teacherSetup.teacherName}</strong>
                      </div>
                      <div className="teacher-zone-line">
                        {isCameraActive ? (
                          teacherFound ? (
                            <span className="teacher-in-zone">
                              ✓ Present in {teacherSetup.zone.replace('-', ' ')}
                            </span>
                          ) : (
                            <span className="teacher-awaiting">
                              Awaiting arrival at presentation podium
                            </span>
                          )
                        ) : (
                          <span className="teacher-awaiting">Camera inactive</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Classroom Board Status */}
                <div className="intel-metric-box">
                  <div className="metric-box-header">
                    <span className="metric-title">Classroom Board</span>
                    <span
                      className={`intel-status-tag ${
                        !isCameraActive
                          ? 'unavailable'
                          : boardResult?.status === 'detected'
                          ? 'detected'
                          : boardResult?.status === 'uncertain'
                          ? 'uncertain'
                          : 'searching'
                      }`}
                    >
                      {!isCameraActive
                        ? 'UNAVAILABLE'
                        : boardResult?.status === 'detected'
                        ? 'DETECTED'
                        : boardResult?.status === 'uncertain'
                        ? 'UNCERTAIN'
                        : 'SEARCHING'}
                    </span>
                  </div>

                  <div className="board-summary-strip">
                    <div className="board-summary-detail">
                      <span className="board-type">
                        {boardResult?.type === 'whiteboard'
                          ? 'Whiteboard'
                          : boardResult?.type === 'blackboard'
                          ? 'Blackboard'
                          : 'Classroom Board'}
                      </span>
                      <span className="board-pct">
                        {boardResult ? `${boardResult.visibleAreaPct}% visible in viewport` : '0%'}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="board-action-btn"
                      onClick={onCaptureBoardSnapshot}
                      title="Open Board Content Extraction Suite"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <span>Capture & Extract</span>
                    </button>
                  </div>
                </div>

                {/* 5. Environmental Lighting Sensor */}
                <div className="intel-metric-box">
                  <div className="metric-box-header">
                    <span className="metric-title">Ambient Room Lighting</span>
                    <span
                      className={`intel-status-tag ${
                        !isCameraActive
                          ? 'unavailable'
                          : luminanceInfo.isLowLight
                          ? 'uncertain'
                          : 'detected'
                      }`}
                    >
                      {!isCameraActive
                        ? 'UNAVAILABLE'
                        : luminanceInfo.isLowLight
                        ? 'UNCERTAIN // LOW LIGHT'
                        : 'DETECTED // OPTIMAL'}
                    </span>
                  </div>
                  <div className="luminance-meter-wrap">
                    <div className="luminance-bar">
                      <div
                        className={`luminance-fill ${luminanceInfo.isLowLight ? 'low' : 'good'}`}
                        style={{ width: `${Math.min(100, (luminanceInfo.luminance / 200) * 100)}%` }}
                      />
                    </div>
                    <span className="luminance-val">{luminanceInfo.luminance} Lux Index</span>
                  </div>
                  {luminanceInfo.isLowLight && (
                    <span className="metric-subtext alert">
                      Classroom lighting is dim. Turn on room lights for optimal optical accuracy.
                    </span>
                  )}
                </div>
              </div>

              {/* Local CV Architecture Notice */}
              <div className="intel-privacy-notice">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>
                  <strong>Local Edge Vision:</strong> Processed entirely in-browser with TensorFlow.js. Video streams are never recorded or transmitted off-device.
                </span>
              </div>
            </div>
          )}

          {/* TAB 2: TEACHER CONFIGURATION */}
          {activeTab === 'teacher' && (
            <div className="intel-tab-pane">
              <div className="intel-section-title">
                <span>Authorized Teacher Designation</span>
              </div>
              <p className="intel-section-desc">
                Designate the faculty member conducting this classroom session. The system verifies presenter presence based on spatial teaching zones rather than appearance.
              </p>

              {/* Faculty Selector */}
              <div className="intel-form-group">
                <label className="intel-form-label">Selected Faculty</label>
                <select
                  className="intel-select"
                  value={teacherSetup.teacherName}
                  onChange={(e) =>
                    onUpdateTeacherSetup({ ...teacherSetup, teacherName: e.target.value })
                  }
                >
                  {facultyList.map((f) => (
                    <option key={f.id} value={f.name}>
                      {f.name} — {f.subject}
                    </option>
                  ))}
                </select>
              </div>

              {/* Presenter Detection Mode */}
              <div className="intel-form-group">
                <label className="intel-form-label">Presenter Verification Mode</label>
                <div className="intel-radio-group">
                  <label className="intel-radio-label">
                    <input
                      type="radio"
                      name="detectionMode"
                      checked={teacherSetup.detectionMode === 'zone'}
                      onChange={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, detectionMode: 'zone' })
                      }
                    />
                    <span>Podium / Stage Zone</span>
                  </label>

                  <label className="intel-radio-label">
                    <input
                      type="radio"
                      name="detectionMode"
                      checked={teacherSetup.detectionMode === 'nearest-board'}
                      onChange={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, detectionMode: 'nearest-board' })
                      }
                    />
                    <span>Nearest Person to Classroom Board</span>
                  </label>

                  <label className="intel-radio-label">
                    <input
                      type="radio"
                      name="detectionMode"
                      checked={teacherSetup.detectionMode === 'manual'}
                      onChange={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, detectionMode: 'manual' })
                      }
                    />
                    <span>Manual Faculty Pin</span>
                  </label>
                </div>
              </div>

              {/* Stage Zone Selector (when in zone mode) */}
              {teacherSetup.detectionMode === 'zone' && (
                <div className="intel-form-group">
                  <label className="intel-form-label">Teacher Podium Zone in Room</label>
                  <div className="intel-zone-chips">
                    <button
                      type="button"
                      className={`zone-chip ${teacherSetup.zone === 'left-podium' ? 'active' : ''}`}
                      onClick={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, zone: 'left-podium' })
                      }
                    >
                      Left Podium (0-38% X)
                    </button>
                    <button
                      type="button"
                      className={`zone-chip ${teacherSetup.zone === 'front-center' ? 'active' : ''}`}
                      onClick={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, zone: 'front-center' })
                      }
                    >
                      Center Board (35-65% X)
                    </button>
                    <button
                      type="button"
                      className={`zone-chip ${teacherSetup.zone === 'right-podium' ? 'active' : ''}`}
                      onClick={() =>
                        onUpdateTeacherSetup({ ...teacherSetup, zone: 'right-podium' })
                      }
                    >
                      Right Podium (62-100% X)
                    </button>
                  </div>
                </div>
              )}

              {/* Status readout */}
              <div className="teacher-designation-card">
                <div className="td-header">
                  <span>Current Presence Status</span>
                  <span className={`status-pill ${teacherFound ? 'present' : 'searching'}`}>
                    {teacherFound ? 'Present' : 'Not Detected in Zone'}
                  </span>
                </div>
                <div className="td-body">
                  <span>Faculty: <strong>{teacherSetup.teacherName}</strong></span>
                  <span>Zone: <strong>{teacherSetup.zone.replace('-', ' ')}</strong></span>
                  {teacherPerson && (
                    <span>Confidence: <strong>{teacherPerson.confidence}%</strong></span>
                  )}
                </div>
              </div>

              <div className="intel-privacy-notice" style={{ marginTop: '14px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="16" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12.01" y2="8" />
                </svg>
                <span>
                  Ethical guardrail: No facial recognition algorithms are executed. Teacher detection is derived strictly from explicit session authorization and spatial instruction zone presence.
                </span>
              </div>
            </div>
          )}

          {/* TAB 3: STUDENTS & ROSTER ASSOCIATION */}
          {activeTab === 'roster' && (
            <div className="intel-tab-pane">
              <div className="intel-section-title">
                <span>Anonymous Student Detections</span>
              </div>
              <p className="intel-section-desc">
                By default, all detected learners receive anonymous identifiers (Student 1, Student 2) to protect privacy. Authorized staff can associate a detection with an enrolled student record below.
              </p>

              {people.filter((p) => !p.isTeacher).length === 0 ? (
                <div className="intel-empty-list">
                  {isCameraActive
                    ? 'No students currently detected in view.'
                    : 'Start camera to initiate classroom student detection.'}
                </div>
              ) : (
                <div className="roster-associations-list">
                  {people
                    .filter((p) => !p.isTeacher)
                    .map((student) => {
                      const linked = rosterAssociations[student.id];

                      return (
                        <div key={student.id} className="student-assoc-card">
                          <div className="sa-card-header">
                            <div className="sa-label">
                              <span className="sa-anon-tag">{student.label}</span>
                              <span className="sa-conf">{student.confidence}% Conf</span>
                            </div>
                            {linked && (
                              <button
                                type="button"
                                className="sa-unlink-btn"
                                onClick={() => onAssociateStudent(student.id, null)}
                                title="Remove student record association"
                              >
                                Unlink
                              </button>
                            )}
                          </div>

                          {linked ? (
                            <div className="sa-linked-info">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                              <span>
                                Associated: <strong>{linked.name}</strong>
                              </span>
                            </div>
                          ) : (
                            <div className="sa-link-controls">
                              <select
                                className="sa-student-select"
                                value={selectedStudentForLink[student.id] || ''}
                                onChange={(e) =>
                                  setSelectedStudentForLink((prev) => ({
                                    ...prev,
                                    [student.id]: e.target.value,
                                  }))
                                }
                              >
                                <option value="">Link to enrolled student...</option>
                                {roster.map((r) => (
                                  <option key={r.id} value={r.id}>
                                    {r.name} ({r.rollNo})
                                  </option>
                                ))}
                              </select>

                              <button
                                type="button"
                                className="sa-link-btn"
                                disabled={!selectedStudentForLink[student.id]}
                                onClick={() => {
                                  const selectedId = selectedStudentForLink[student.id];
                                  const rMatch = roster.find((r) => r.id === selectedId);
                                  if (rMatch) {
                                    onAssociateStudent(student.id, rMatch);
                                  }
                                }}
                              >
                                Link
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </div>
              )}

              <div className="intel-privacy-notice" style={{ marginTop: '16px' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>
                  Association is manual and confidential for authorized educators. No biometrics or face embeddings are stored or evaluated.
                </span>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
