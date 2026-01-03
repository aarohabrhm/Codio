import { useEffect, useRef, useState } from "react";

export function useResizer(initialWidth, minWidth = 180, maxWidth = 500) {
  const [width, setWidth] = useState(initialWidth);
  const isResizing = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing.current) return;
      const newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - 48));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [minWidth, maxWidth]);

  const startResize = () => {
    isResizing.current = true;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
  };

  return { width, startResize };
}
