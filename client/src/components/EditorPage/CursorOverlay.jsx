import React, { useEffect, useState, useRef } from 'react';

// Collaborator colours are assigned by the server and span a wide range of
// lightness, so a fixed white label is unreadable on the pale ones. Pick
// whichever of ink/white actually contrasts with the swatch.
const INK = [0x17, 0x1a, 0x17];

function channel(c) {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

function luminance([r, g, b]) {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

function readableOn(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || '');
  if (!m) return '#ffffff';
  const rgb = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16));
  return contrast(rgb, [255, 255, 255]) >= contrast(rgb, INK) ? '#ffffff' : '#171a17';
}

// Monaco's character advance depends on its font, so measuring beats guessing:
// a hardcoded width drifts further right the longer the line, and only shows
// up when a second person is in the file.
let measureCanvas = null;
function charWidthOf(el) {
  const cs = window.getComputedStyle(el);
  const font = cs.font || `${cs.fontSize} ${cs.fontFamily}`;
  measureCanvas = measureCanvas || document.createElement('canvas');
  const ctx = measureCanvas.getContext('2d');
  ctx.font = font;
  const w = ctx.measureText('0').width;
  return w > 0 ? w : 7.22;
}

export default function CursorOverlay({ userCursors, userSelections, activeFileId, onlineUsers }) {
  const [cursorPositions, setCursorPositions] = useState({});
  const overlayRef = useRef(null);

  useEffect(() => {
    const updateCursorPositions = () => {
      const editor = document.querySelector('.monaco-editor .view-lines');
      if (!editor) return;

      const newPositions = {};
      const charWidth = charWidthOf(editor);

      Object.entries(userCursors).forEach(([socketId, cursor]) => {
        // CRITICAL: Only show cursors for the SAME file
        if (cursor.fileId !== activeFileId) return;

        const monacoContainer = document.querySelector('.monaco-editor');
        if (!monacoContainer) return;

        const lines = editor.querySelectorAll('.view-line');
        const lineElement = lines[cursor.line - 1];

        if (lineElement) {
          const lineRect = lineElement.getBoundingClientRect();
          const containerRect = monacoContainer.getBoundingClientRect();

          const leftOffset = (cursor.column - 1) * charWidth;

          newPositions[socketId] = {
            top: lineRect.top - containerRect.top,
            left: lineRect.left - containerRect.left + leftOffset,
            color: cursor.color,
            username: cursor.username
          };
        }
      });

      setCursorPositions(newPositions);
    };

    updateCursorPositions();

    const interval = setInterval(updateCursorPositions, 50);

    return () => clearInterval(interval);
  }, [userCursors, activeFileId]);

  return (
    <div ref={overlayRef} className="absolute inset-0 pointer-events-none z-50">
      {Object.entries(cursorPositions).map(([socketId, pos]) => (
        <div
          key={socketId}
          className="absolute pointer-events-none transition-all duration-75 ease-linear"
          style={{
            top: `${pos.top}px`,
            left: `${pos.left}px`,
          }}
        >
          {/* Cursor line */}
          <div
            className="w-0.5 h-5"
            style={{ backgroundColor: pos.color }}
          />

          {/* Username label */}
          <div
            className="absolute -top-6 left-0 font-mono text-[10px] px-1.5 py-0.5 rounded-[4px] whitespace-nowrap shadow-lg font-medium"
            style={{ backgroundColor: pos.color, color: readableOn(pos.color) }}
          >
            {pos.username}
          </div>
        </div>
      ))}
    </div>
  );
}
