import { useState, useCallback } from "react";

export function usePanels() {
  const [showChat, setShowChat] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);
  const [showBottomPanel, setShowBottomPanel] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(260);

  const toggleChat = useCallback(() => {
    setShowChat((prev) => !prev);
  }, []);

  const toggleLeftPanel = useCallback(() => {
    setShowLeftPanel((prev) => !prev);
  }, []);

  const toggleBottomPanel = useCallback(() => {
    setShowBottomPanel((prev) => !prev);
  }, []);

  const handleLeftPanelResize = useCallback((delta) => {
    setLeftPanelWidth((prev) => Math.max(180, Math.min(500, prev + delta)));
  }, []);

  return {
    showChat,
    showLeftPanel,
    showBottomPanel,
    leftPanelWidth,
    toggleChat,
    toggleLeftPanel,
    toggleBottomPanel,
    handleLeftPanelResize,
  };
}
