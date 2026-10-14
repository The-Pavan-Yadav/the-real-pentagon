import React, { useState } from 'react';
import { DetectedPerson } from '../services/personDetection';

interface StudentAssociationModalProps {
  person: DetectedPerson;
  currentAssociation?: { name: string; roll?: string };
  onSave: (personId: string, association: { name: string; roll?: string } | null) => void;
  onClose: () => void;
}

const ROSTER_PRESETS = [
  { name: 'Aarav Sharma', roll: 'SCH-101' },
  { name: 'Priya Patel', roll: 'SCH-102' },
  { name: 'Rahul Verma', roll: 'SCH-103' },
  { name: 'Ananya Iyer', roll: 'SCH-104' },
  { name: 'Karan Mehta', roll: 'SCH-105' },
  { name: 'Rohan Das', roll: 'SCH-106' },
  { name: 'Sneha Kulkarni', roll: 'SCH-107' },
];

export const StudentAssociationModal: React.FC<StudentAssociationModalProps> = ({
  person,
  currentAssociation,
  onSave,
  onClose,
}) => {
  const [name, setName] = useState(currentAssociation?.name || '');
  const [roll, setRoll] = useState(currentAssociation?.roll || '');
  const [error, setError] = useState('');

  const handleSelectPreset = (p: { name: string; roll: string }) => {
    setName(p.name);
    setRoll(p.roll);
    setError('');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setError('Please enter or select a student name.');
      return;
    }
    onSave(person.id, { name: trimmed, roll: roll.trim() || undefined });
    onClose();
  };

  const handleRemove = () => {
    onSave(person.id, null);
    onClose();
  };

  return (
    <div
      className="board-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="assoc-modal-title"
    >
      <div className="assoc-modal-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span style={{ fontSize: '0.72rem', color: '#22d3ee', letterSpacing: '0.1em', fontWeight: 700, textTransform: 'uppercase' }}>
              Authorized Staff Override
            </span>
            <h3 id="assoc-modal-title" style={{ margin: 0, fontSize: '1.15rem', color: '#ffffff' }}>
              Associate Student Record
            </h3>
          </div>
          <button type="button" className="aicam-btn-ghost" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ background: 'rgba(3, 10, 22, 0.6)', padding: '10px 14px', borderRadius: '8px', border: '1px solid rgba(34, 211, 238, 0.2)', marginBottom: '16px' }}>
          <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Target Detection:</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, color: '#38bdf8' }}>
            {person.anonymousLabel} (ID: {person.id})
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>
              Quick Select from Class Roster:
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {ROSTER_PRESETS.map((p) => (
                <button
                  key={p.roll}
                  type="button"
                  className={`aicam-chip ${name === p.name ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(p)}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="student-name-input" style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
              Student Full Name *
            </label>
            <input
              id="student-name-input"
              type="text"
              className="aicam-input"
              placeholder="e.g. Aarav Sharma"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
            {error && <div className="aicam-error-text">{error}</div>}
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label htmlFor="student-roll-input" style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
              Student ID / Roll No (Optional)
            </label>
            <input
              id="student-roll-input"
              type="text"
              className="aicam-input"
              placeholder="e.g. SCH-104"
              value={roll}
              onChange={(e) => setRoll(e.target.value)}
            />
          </div>

          <div style={{ background: 'rgba(59, 130, 246, 0.08)', border: '1px solid rgba(59, 130, 246, 0.25)', borderRadius: '6px', padding: '10px', fontSize: '0.74rem', color: '#94a3b8', marginBottom: '18px' }}>
            🔒 <strong>Zero Facial Recognition Guarantee:</strong> Identification is strictly a manual association performed by authorized classroom staff for session recordkeeping. No biometric templates or facial features are scanned or stored.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
            {currentAssociation && (
              <button
                type="button"
                className="aicam-btn-ghost"
                onClick={handleRemove}
                style={{ color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
              >
                Clear Mapping
              </button>
            )}
            <div style={{ display: 'flex', gap: '8px', marginLeft: 'auto' }}>
              <button type="button" className="aicam-btn-ghost" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn-cam-action start">
                Save Association
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
