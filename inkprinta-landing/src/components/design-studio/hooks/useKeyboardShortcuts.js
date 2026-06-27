import { useEffect } from 'react';

export function useKeyboardShortcuts({
  fabricRef,
  handleUndo,
  handleRedo,
  handleDelete,
  handleCopy,
  handlePaste,
  handleBringToFront,
  handleBringForward,
  handleSendBackward,
  handleSendToBack,
  handleToggleLayers,
  handleGroup
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isTyping = activeEl && (
        activeEl.tagName === 'INPUT' ||
        activeEl.tagName === 'TEXTAREA' ||
        activeEl.isContentEditable
      );

      const isFabricEditing = fabricRef.current && fabricRef.current.getActiveObject()?.isEditing;

      if (isTyping && !isFabricEditing) return;

      const key = e.key.toLowerCase();

      // Undo: Ctrl + Z
      if ((e.ctrlKey || e.metaKey) && key === 'z') {
        e.preventDefault();
        handleUndo();
      }

      // Redo: Ctrl + Y or Ctrl + Shift + Z
      if ((e.ctrlKey || e.metaKey) && (key === 'y' || (e.shiftKey && key === 'z'))) {
        e.preventDefault();
        handleRedo();
      }

      // Copy: Ctrl + C
      if ((e.ctrlKey || e.metaKey) && key === 'c') {
        e.preventDefault();
        handleCopy();
      }

      // Paste: Ctrl + V
      if ((e.ctrlKey || e.metaKey) && key === 'v') {
        e.preventDefault();
        handlePaste();
      }

      // Delete/Backspace
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping && !isFabricEditing) {
        e.preventDefault();
        handleDelete();
      }

      // Bring to Front: Ctrl + Alt + ] (Wait, US keyboard ']' key)
      if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === ']') {
        e.preventDefault();
        handleBringToFront?.();
      }
      // Bring Forward: Ctrl + ]
      else if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === ']') {
        e.preventDefault();
        handleBringForward?.();
      }
      // Send to Back: Ctrl + Alt + [
      else if ((e.ctrlKey || e.metaKey) && e.altKey && e.key === '[') {
        e.preventDefault();
        handleSendToBack?.();
      }
      // Send Backward: Ctrl + [
      else if ((e.ctrlKey || e.metaKey) && !e.altKey && e.key === '[') {
        e.preventDefault();
        handleSendBackward?.();
      }
      // Show Layers: Alt + 1
      else if (e.altKey && key === '1') {
        e.preventDefault();
        handleToggleLayers?.();
      }
      // Group/Ungroup: Ctrl + G
      else if ((e.ctrlKey || e.metaKey) && key === 'g') {
        e.preventDefault();
        handleGroup?.();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    fabricRef,
    handleUndo,
    handleRedo,
    handleDelete,
    handleCopy,
    handlePaste,
    handleBringToFront,
    handleBringForward,
    handleSendBackward,
    handleSendToBack,
    handleToggleLayers,
    handleGroup
  ]);
}
