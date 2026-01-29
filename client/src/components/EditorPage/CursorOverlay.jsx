import React, { useEffect, useState, useRef } from 'react';

export default function CursorOverlay({ userCursors, userSelections, activeFileId, onlineUsers }) {
  const [cursorPositions, setCursorPositions] = useState({});
  const overlayRef = useRef(null);

  useEffect(() => {
    const updateCursorPositions = () => {
      const editor = document.querySelector('.monaco-editor .view-lines');
      if (!editor) return;

      const newPositions = {};

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
          
          const charWidth = 7.22;
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
            className="w-0.5 h-5 animate-pulse"
            style={{ backgroundColor: pos.color }}
          />
          
          {/* Username label */}
          <div
            className="absolute -top-6 left-0 text-[10px] text-white px-2 py-0.5 rounded whitespace-nowrap shadow-lg font-medium"
            style={{ backgroundColor: pos.color }}
          >
            {pos.username}
          </div>
        </div>
      ))}
    </div>
  );
}