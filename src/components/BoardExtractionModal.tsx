import React, { useState } from 'react';
import { BoardCaptureData } from '../services/boardDetection';

interface BoardExtractionModalProps {
  captureData: BoardCaptureData;
  onClose: () => void;
}

export const BoardExtractionModal: React.FC<BoardExtractionModalProps> = ({
  captureData,
  onClose,
}) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'contrast' | 'invert'>('normal');

  const filterStyle: React.CSSProperties = {
    filter:
      filterMode === 'contrast'
        ? 'contrast(180%) brightness(110%)'
        : filterMode === 'invert'
        ? 'invert(100%) contrast(150%)'
        : 'none',
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.download = `pentagon-board-${Date.now()}.jpg`;
    link.href = captureData.dataUrl;
    link.click();
  };

  return (
    <div
      className="board-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="board-extract-title"
    >
      <div className="board-modal-card">
        {/* Header */}
        <div className="board-modal-header">
          <h3 id="board-extract-title">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2">
              <rect x="2" y="3" width="20" height="14" rx="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
            <span>Classroom Board Optical Extraction</span>
          </h3>
          <button
            type="button"
            className="aicam-btn-ghost"
            onClick={onClose}
            aria-label="Close board preview"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="board-modal-body">
          {/* Controls Bar for filters */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: '#94a3b8' }}>
              <span>View Enhancement:</span>
              <button
                type="button"
                className={`aicam-btn-ghost ${filterMode === 'normal' ? 'active' : ''}`}
                onClick={() => setFilterMode('normal')}
              >
                Original
              </button>
              <button
                type="button"
                className={`aicam-btn-ghost ${filterMode === 'contrast' ? 'active' : ''}`}
                onClick={() => setFilterMode('contrast')}
              >
                High Contrast
              </button>
              <button
                type="button"
                className={`aicam-btn-ghost ${filterMode === 'invert' ? 'active' : ''}`}
                onClick={() => setFilterMode('invert')}
              >
                Invert B&W
              </button>
            </div>

            <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontFamily: 'monospace' }}>
              {captureData.boardType === 'whiteboard' ? 'WHITEBOARD' : 'CHALKBOARD'} // {captureData.width}x{captureData.height}px // {Math.round(captureData.confidence * 100)}% CONF
            </div>
          </div>

          {/* Captured Image Preview */}
          <div className="board-crop-preview-wrap">
            <img
              src={captureData.dataUrl}
              alt="Classroom board optical capture"
              className="board-crop-preview"
              style={filterStyle}
            />
          </div>

          {/* Policy & Status Notice */}
          <div className="board-notice-box">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge-status detected">OPTICAL EXTRACTION STAGED</span>
              <strong style={{ fontSize: '0.82rem' }}>Zero Fabricated Content Guarantee</strong>
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem' }}>
              The high-resolution board boundary has been isolated and optically framed on-device. In compliance with academic integrity standards, written content will not be hallucinated, guessed, or approximated. OCR transcription and handwritten formula extraction pipeline will activate in the next phase upon model selection.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="board-modal-footer">
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Captured: {new Date(captureData.timestamp).toLocaleTimeString()}
          </span>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="aicam-btn-ghost"
              onClick={handleDownload}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>Download Crop</span>
            </button>
            <button
              type="button"
              className="btn-cam-action start"
              onClick={onClose}
              style={{ padding: '6px 16px', fontSize: '0.82rem' }}
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
