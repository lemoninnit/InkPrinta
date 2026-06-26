import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';
import { SNAP_THRESHOLD } from '../utils/constants.js';
import { styleTextboxControls, drawSnapGuides, initializeImageObject } from '../utils/helpers.js';

export function useCanvas({
  canvasRef,
  fabricRef,
  currentProduct,
  zoom,
  saveStateToHistory,
  isHandlingHistoryRef,
  setActiveObject,
  setCoords,
  setIsLocked,
  setIsRotating,
  setRotationAngle,
  syncTextFromObject,
  syncImageFromObject
}) {
  const showVerticalGuideRef = useRef(false);
  const showHorizontalGuideRef = useRef(false);
  const dragStartPosRef = useRef(null);
  const hasDuplicatedOnAltDragRef = useRef(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new Canvas(canvasRef.current, {
      width: currentProduct.printWidth,
      height: currentProduct.printHeight,
      backgroundColor: 'transparent',
      enableRetinaScaling: true,
      imageSmoothingEnabled: true
    });

    fabricRef.current = canvas;
    saveStateToHistory();

    const updateSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        setActiveObject(activeObj);
        setCoords(activeObj.getBoundingRect(true));
        setIsLocked(activeObj.lockMovementX || false);
        if (activeObj.type === 'textbox') {
          syncTextFromObject(activeObj);
        } else if (activeObj.type === 'image') {
          syncImageFromObject(activeObj);
        }
      } else {
        setActiveObject(null);
        setCoords(null);
        setIsLocked(false);
        setIsRotating(false);
      }
    };

    const handleObjectRotating = (e) => {
      const activeObj = e.target || canvas.getActiveObject();
      if (activeObj) {
        setIsRotating(true);
        activeObj.set({
          borderColor: 'transparent',
          cornerColor: 'transparent',
          cornerStrokeColor: 'transparent',
          isRotatingTemp: true
        });
        canvas.renderAll();

        let angle = Math.round(activeObj.angle) % 360;
        if (angle > 180) angle -= 360;
        else if (angle < -180) angle += 360;
        setRotationAngle(angle);
        setCoords(activeObj.getBoundingRect(true));
      }
    };

    const handleTransformBefore = (e) => {
      if (e.transform && e.transform.action === 'rotate') {
        setIsRotating(true);
        const activeObj = canvas.getActiveObject();
        if (activeObj) {
          activeObj.set({
            borderColor: 'transparent',
            cornerColor: 'transparent',
            cornerStrokeColor: 'transparent',
            isRotatingTemp: true
          });
          canvas.renderAll();
        }
      }
    };

    const handleMouseDown = (e) => {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        dragStartPosRef.current = { left: activeObj.left, top: activeObj.top };
      } else {
        dragStartPosRef.current = null;
      }
      hasDuplicatedOnAltDragRef.current = false;
    };

    const handleObjectMoving = async (e) => {
      const activeObj = e.target || canvas.getActiveObject();
      if (!activeObj) return;

      // Handle Alt + Drag copy-paste
      if (e.e && e.e.altKey && !hasDuplicatedOnAltDragRef.current && dragStartPosRef.current) {
        hasDuplicatedOnAltDragRef.current = true;
        try {
          const cloned = await activeObj.clone(['rx', 'ry']);
          cloned.set({
            left: dragStartPosRef.current.left,
            top: dragStartPosRef.current.top
          });
          if (cloned.type === 'image') {
            initializeImageObject(cloned);
          } else {
            styleTextboxControls(cloned);
          }
          canvas.add(cloned);
          canvas.renderAll();
          saveStateToHistory();
        } catch (err) {
          console.error('Alt-drag cloning failed:', err);
        }
      }

      const centerX = currentProduct.printWidth / 2;
      const centerY = currentProduct.printHeight / 2;

      const objCenter = activeObj.getCenterPoint();
      let newCenterX = objCenter.x;
      let newCenterY = objCenter.y;

      let snapX = false;
      let snapY = false;

      if (Math.abs(objCenter.x - centerX) < SNAP_THRESHOLD) {
        newCenterX = centerX;
        snapX = true;
      }
      if (Math.abs(objCenter.y - centerY) < SNAP_THRESHOLD) {
        newCenterY = centerY;
        snapY = true;
      }

      if (snapX || snapY) {
        activeObj.setPositionByOrigin({ x: newCenterX, y: newCenterY }, 'center', 'center');
        activeObj.setCoords();
      }

      showVerticalGuideRef.current = snapX;
      showHorizontalGuideRef.current = snapY;

      canvas.renderAll();
      setCoords(activeObj.getBoundingRect(true));
    };

    const handleObjectModified = () => {
      setIsRotating(false);
      showVerticalGuideRef.current = false;
      showHorizontalGuideRef.current = false;
      canvas.renderAll();

      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        activeObj.set({
          borderColor: '#06b6d4',
          cornerColor: '#ffffff',
          cornerStrokeColor: '#06b6d4',
          isRotatingTemp: false
        });
        canvas.renderAll();
        setCoords(activeObj.getBoundingRect(true));
      }
      saveStateToHistory();
    };

    const handleSelectionCleared = () => {
      updateSelection();
      setIsRotating(false);
      setIsLocked(false);
      showVerticalGuideRef.current = false;
      showHorizontalGuideRef.current = false;
      canvas.renderAll();
    };

    const handleAfterRender = () => {
      const ctx = canvas.getContext();
      if (!ctx) return;
      drawSnapGuides(
        ctx,
        currentProduct,
        canvas.getZoom(),
        showVerticalGuideRef.current,
        showHorizontalGuideRef.current
      );
    };

    const handleObjectAdded = (e) => {
      const obj = e.target;
      if (obj && obj.type === 'image') {
        initializeImageObject(obj);
      }
      if (!isHandlingHistoryRef.current) saveStateToHistory();
    };

    const handleObjectRemoved = () => {
      if (!isHandlingHistoryRef.current) saveStateToHistory();
    };

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', handleSelectionCleared);
    canvas.on('mouse:down', handleMouseDown);
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:scaling', updateSelection);
    canvas.on('object:rotating', handleObjectRotating);
    canvas.on('before:transform', handleTransformBefore);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('after:render', handleAfterRender);
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:removed', handleObjectRemoved);

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: currentProduct.printWidth * zoom,
      height: currentProduct.printHeight * zoom
    });
    canvas.renderAll();

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      setCoords(activeObj.getBoundingRect(true));
    }
  }, [currentProduct, zoom]);
}
