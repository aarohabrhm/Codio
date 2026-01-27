// components/EditorPage/CursorOverlay.jsx
import React, { useEffect, useState } from 'react';

export default function CursorOverlay({ userCursors, activeFileId, onlineUsers }) {
  const [cursors, setCursors] = useState([]);

  useEffect(() => {
    // Filter cursors for current file
    const currentFileCursors = Object.entries(userCursors)
      .filter(([userId, cursor]) => cursor.fileId === activeFileId)
      .map(([userId, cursor]) => {
        const user = onlineUsers.find(u => u.userId === userId);
        return {
          userId,
          username: user?.username || 'Anonymous',
          color: cursor.color,
          line: cursor.line,
          column: cursor.column
        };
      });

    setCursors(currentFileCursors);
  }, [userCursors, activeFileId, onlineUsers]);

  return (
    <>
      {cursors.map((cursor) => (
        <div
          key={cursor.userId}
          className="absolute pointer-events-none z-50"
          style={{
            // Position will be calculated by CodeMirror/Monaco
            // This is a placeholder for the cursor rendering logic
          }}
        >
          {/* Cursor line */}
          <div
            className="absolute w-0.5 h-5 animate-pulse"
            style={{ backgroundColor: cursor.color }}
          />
          
          {/* Username label */}
          <div
            className="absolute -top-6 left-0 px-2 py-0.5 rounded text-xs font-medium text-white whitespace-nowrap shadow-lg"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.username}
          </div>
        </div>
      ))}
    </>
  );
}