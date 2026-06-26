import { useEffect } from 'react';

export function useKeyboardShortcuts({
  fabricRef,
  handleUndo,
  handleRedo,
  handleDelete,
  handleCopy,
  handlePaste
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
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricRef, handleUndo, handleRedo, handleDelete, handleCopy, handlePaste]);
}
