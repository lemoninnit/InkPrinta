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
  syncImageFromObject,
  showPaintPanel
}) {
  const showVerticalGuideRef = useRef(false);
  const showHorizontalGuideRef = useRef(false);
  const dragStartPosRef = useRef(null);
  const hasDuplicatedOnAltDragRef = useRef(false);
  const showPaintPanelRef = useRef(showPaintPanel);

  useEffect(() => {
    showPaintPanelRef.current = showPaintPanel;
  }, [showPaintPanel]);

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
        } else if (activeObj.type === 'group') {
          if (!activeObj._selectedChild) {
            const firstImg = activeObj.getObjects ? activeObj.getObjects().find(o => o.type === 'image') : null;
            if (firstImg) {
              activeObj._selectedChild = firstImg;
            }
          }
          if (activeObj._selectedChild) {
            syncImageFromObject(activeObj._selectedChild);
          }
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
          const cloned = await activeObj.clone(['rx', 'ry', 'isPaintStroke']);
          cloned.set({
            left: dragStartPosRef.current.left,
            top: dragStartPosRef.current.top
          });
          if (cloned.type === 'image') {
            initializeImageObject(cloned);
          } else {
            styleTextboxControls(cloned);
          }
          isHandlingHistoryRef.current = true;
          canvas.add(cloned);
          isHandlingHistoryRef.current = false;
          canvas.renderAll();
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

    const getCanvasCoords = (obj) => {
      const coords = obj.getCoords ? obj.getCoords() : null;
      if (Array.isArray(coords) && coords.length === 4) {
        return coords;
      }
      if (coords && coords.tl) {
        return [coords.tl, coords.tr, coords.br, coords.bl];
      }
      if (typeof obj.calcTransformMatrix === 'function') {
        const width = obj.width || 0;
        const height = obj.height || 0;
        const matrix = obj.calcTransformMatrix();
        const transform = (x, y) => {
          const px = matrix[0] * x + matrix[2] * y + matrix[4];
          const py = matrix[1] * x + matrix[3] * y + matrix[5];
          return { x: px, y: py };
        };
        return [
          transform(-width / 2, -height / 2),
          transform(width / 2, -height / 2),
          transform(width / 2, height / 2),
          transform(-width / 2, height / 2)
        ];
      }
      return null;
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

      const activeObj = canvas.getActiveObject();
      if (activeObj && activeObj.type === 'group') {
        const group = activeObj;
        const children = group.getObjects ? group.getObjects() : (group._objects || []);
        const selectedChild = group._selectedChild;

        if (selectedChild) {
          ctx.save();
          children.forEach((child) => {
            const isSelected = child === selectedChild;
            const coords = getCanvasCoords(child);
            if (!coords) return;

            ctx.beginPath();
            ctx.moveTo(coords[0].x, coords[0].y);
            ctx.lineTo(coords[1].x, coords[1].y);
            ctx.lineTo(coords[2].x, coords[2].y);
            ctx.lineTo(coords[3].x, coords[3].y);
            ctx.closePath();

            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = isSelected ? 2 : 1.5;
            if (!isSelected) {
              ctx.setLineDash([4, 4]);
            } else {
              ctx.setLineDash([]);
            }
            ctx.stroke();

            if (isSelected) {
              ctx.fillStyle = '#ffffff';
              ctx.strokeStyle = '#06b6d4';
              ctx.lineWidth = 1.5;
              ctx.setLineDash([]);

              const handleSize = 5;
              coords.forEach((pt) => {
                ctx.beginPath();
                ctx.rect(pt.x - handleSize, pt.y - handleSize, handleSize * 2, handleSize * 2);
                ctx.fill();
                ctx.stroke();
              });

              const midpoints = [
                { x: (coords[0].x + coords[1].x) / 2, y: (coords[0].y + coords[1].y) / 2 },
                { x: (coords[1].x + coords[2].x) / 2, y: (coords[1].y + coords[2].y) / 2 },
                { x: (coords[2].x + coords[3].x) / 2, y: (coords[2].y + coords[3].y) / 2 },
                { x: (coords[3].x + coords[0].x) / 2, y: (coords[3].y + coords[0].y) / 2 }
              ];

              midpoints.forEach((pt, i) => {
                ctx.beginPath();
                if (i % 2 === 0) {
                  ctx.rect(pt.x - 8, pt.y - 3, 16, 6);
                } else {
                  ctx.rect(pt.x - 3, pt.y - 8, 6, 16);
                }
                ctx.fill();
                ctx.stroke();
              });
            }
          });
          ctx.restore();
        }
      }
    };

    const handleObjectAdded = (e) => {
      const obj = e.target;
      if (obj && obj.type === 'image') {
        initializeImageObject(obj);
      }
      if (obj && (obj.type === 'path' || obj.isPaintStroke)) {
        return;
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
    canvas.on('path:created', (e) => {
      if (e.path) {
        e.path.isPaintStroke = true;
        if (showPaintPanelRef.current) {
          e.path.selectable = false;
          e.path.evented = false;
        }
        if (!isHandlingHistoryRef.current) {
          saveStateToHistory();
        }
      }
    });

    return () => {
      canvas.dispose();
      fabricRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.setDimensions({
      width: currentProduct.printWidth * zoom,
      height: currentProduct.printHeight * zoom
    });
    canvas.setZoom(zoom);
    canvas.calcOffset();
    canvas.renderAll();

    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      setCoords(activeObj.getBoundingRect(true));
    }
  }, [currentProduct, zoom]);
}
