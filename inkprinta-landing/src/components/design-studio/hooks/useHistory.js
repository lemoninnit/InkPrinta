import { useRef, useState } from 'react';
import { styleTextboxControls, initializeImageObject } from '../utils/helpers.js';

export function useHistory(fabricRef) {
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isHandlingHistoryRef = useRef(false);
  const [, setHistoryTrigger] = useState(0);

  const triggerRender = () => {
    setHistoryTrigger((prev) => prev + 1);
  };

  const [saveStatus, setSaveStatus] = useState('saved');
  const saveTimeoutRef = useRef(null);

  const forceSaveToLocalStorage = () => {
    if (!fabricRef.current) return;
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    const json = fabricRef.current.toJSON(['rx', 'ry', 'isPaintStroke', 'erasable']);
    const jsonStr = JSON.stringify(json);
    try {
      localStorage.setItem('inkprinta_design_draft', jsonStr);
      setSaveStatus('saved');
    } catch (err) {
      console.error('Failed to force-save design draft to localStorage:', err);
    }
  };

  const saveStateToHistory = (force = false) => {
    if (!fabricRef.current || isHandlingHistoryRef.current) return;
    const json = fabricRef.current.toJSON(['rx', 'ry', 'isPaintStroke', 'erasable']);
    const jsonStr = JSON.stringify(json);
    if (undoStackRef.current.length > 0 && undoStackRef.current[undoStackRef.current.length - 1] === jsonStr) {
      return;
    }
    undoStackRef.current.push(jsonStr);
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
    triggerRender();

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }

    if (force) {
      setSaveStatus('saved');
      try {
        localStorage.setItem('inkprinta_design_draft', jsonStr);
      } catch (err) {
        console.error('Failed to force-save design draft to localStorage:', err);
      }
    } else {
      setSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(() => {
        try {
          localStorage.setItem('inkprinta_design_draft', jsonStr);
          setSaveStatus('saved');
        } catch (err) {
          console.error('Failed to auto-save design draft to localStorage:', err);
          setSaveStatus('saved');
        }
      }, 500);
    }
  };

  const restoreFromJson = (stateJson, onComplete) => {
    if (!fabricRef.current) return;

    isHandlingHistoryRef.current = true;
    const parsed = JSON.parse(stateJson);
    const loadPromise = fabricRef.current.loadFromJSON(parsed);

    const afterLoad = () => {
      fabricRef.current.forEachObject((obj) => {
        if (obj.type === 'textbox') {
          styleTextboxControls(obj);
        } else if (obj.type === 'image') {
          initializeImageObject(obj);
        }
      });
      fabricRef.current.renderAll();
      isHandlingHistoryRef.current = false;
      onComplete?.();
    };

    if (loadPromise && typeof loadPromise.then === 'function') {
      loadPromise.then(afterLoad);
    } else {
      afterLoad();
    }
  };

  const handleUndo = (onComplete) => {
    if (!fabricRef.current || undoStackRef.current.length <= 1) return;

    const currentState = undoStackRef.current.pop();
    redoStackRef.current.push(currentState);
    const prevStateJson = undoStackRef.current[undoStackRef.current.length - 1];
    restoreFromJson(prevStateJson, () => {
      onComplete?.();
      triggerRender();
    });
  };

  const handleRedo = (onComplete) => {
    if (!fabricRef.current || redoStackRef.current.length === 0) return;

    const nextStateJson = redoStackRef.current.pop();
    undoStackRef.current.push(nextStateJson);
    restoreFromJson(nextStateJson, () => {
      onComplete?.();
      triggerRender();
    });
  };
  return {
    undoStackRef,
    redoStackRef,
    isHandlingHistoryRef,
    saveStateToHistory,
    forceSaveToLocalStorage,
    saveStatus,
    handleUndo,
    handleRedo
  };
}
