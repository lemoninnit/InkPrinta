import { useEffect } from 'react';

export function useKeyboardShortcuts({ fabricRef, handleUndo, handleRedo, handleDelete }) {
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

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }

      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping && !isFabricEditing) {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [fabricRef, handleUndo, handleRedo, handleDelete]);
}
