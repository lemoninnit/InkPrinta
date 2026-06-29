import { useEffect, useRef } from 'react';
import { Canvas, Group } from 'fabric';
import { EraserBrush } from '@erase2d/fabric';
import { SNAP_THRESHOLD } from '../utils/constants.js';
import { styleTextboxControls, drawSnapGuides, initializeImageObject } from '../utils/helpers.js';
import { getDraftFromIndexedDB } from '../utils/db.js';

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
  showPaintPanel,
  step
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

    let isDisposed = false;

    const canvas = new Canvas(canvasRef.current, {
      width: currentProduct.printWidth * zoom,
      height: currentProduct.printHeight * zoom,
      backgroundColor: 'transparent',
      enableRetinaScaling: true,
      imageSmoothingEnabled: true
    });

    canvas.printWidth = currentProduct.printWidth;
    canvas.printHeight = currentProduct.printHeight;
    canvas.setZoom(zoom);
    canvas.calcOffset();
    fabricRef.current = canvas;

    const loadSavedDraft = async () => {
      let savedDraft = await getDraftFromIndexedDB();
      if (isDisposed) return;
      if (!savedDraft) {
        savedDraft = localStorage.getItem('inkprinta_design_draft');
      }

      if (savedDraft) {
        isHandlingHistoryRef.current = true;
        try {
          const parsed = JSON.parse(savedDraft);
          
          let objects = [];
          let draftWidth = currentProduct.printWidth;
          let draftHeight = currentProduct.printHeight;
          
          if (parsed && Array.isArray(parsed.objects)) {
            objects = parsed.objects;
            if (parsed.printWidth && parsed.printHeight) {
              draftWidth = parsed.printWidth;
              draftHeight = parsed.printHeight;
            }
          } else if (parsed && Array.isArray(parsed)) {
            objects = parsed;
          } else if (parsed && parsed.objects) {
            objects = parsed.objects;
          }
          
          // Scale and re-center objects if the draft dimensions differ from the current product's dimensions
          if (draftWidth !== currentProduct.printWidth || draftHeight !== currentProduct.printHeight) {
            const oldWidth = draftWidth;
            const oldHeight = draftHeight;
            const newWidth = currentProduct.printWidth;
            const newHeight = currentProduct.printHeight;

            const scaleX = newWidth / oldWidth;
            const scaleY = newHeight / oldHeight;
            const scale = Math.min(scaleX, scaleY); // Uniform scale to preserve aspect ratio

            const oldCenterX = oldWidth / 2;
            const oldCenterY = oldHeight / 2;
            const newCenterX = newWidth / 2;
            const newCenterY = newHeight / 2;

            objects.forEach((obj) => {
              const dx = (obj.left || 0) - oldCenterX;
              const dy = (obj.top || 0) - oldCenterY;
              obj.left = newCenterX + dx * scale;
              obj.top = newCenterY + dy * scale;
              
              obj.scaleX = (obj.scaleX || 1) * scale;
              obj.scaleY = (obj.scaleY || 1) * scale;
            });
          }
          
          const fabricJson = {
            objects: objects
          };

          const loadPromise = canvas.loadFromJSON(fabricJson);
          const afterLoad = () => {
            if (isDisposed) return;
            canvas.forEachObject((obj) => {
              if (obj.type === 'textbox') {
                styleTextboxControls(obj);
              } else if (obj.type === 'image') {
                initializeImageObject(obj);
              }
              if (showPaintPanelRef.current) {
                obj.selectable = false;
                obj.evented = false;
              } else {
                if (obj.isPaintStroke) {
                  obj.selectable = true;
                  obj.evented = true;
                } else {
                  const isObjLocked = obj.lockMovementX || false;
                  obj.selectable = !isObjLocked;
                  obj.evented = true;
                }
              }
            });
            canvas.renderAll();
            isHandlingHistoryRef.current = false;
            saveStateToHistory();
          };

          if (loadPromise && typeof loadPromise.then === 'function') {
            loadPromise.then(afterLoad);
          } else {
            afterLoad();
          }
        } catch (err) {
          if (isDisposed) return;
          console.error('Failed to load design draft:', err);
          isHandlingHistoryRef.current = false;
          saveStateToHistory();
        }
      } else {
        if (isDisposed) return;
        saveStateToHistory();
      }
    };

    loadSavedDraft();

    canvas._editingGroup = null;

    canvas.selectGroupChild = (group, child) => {
      if (canvas._editingGroup) {
        canvas.commitGroupEditing();
      }

      canvas.remove(group);
      const items = group.removeAll();
      canvas.add(...items);

      canvas._editingGroup = {
        group: group,
        originalObjects: items,
        activeChild: child
      };

      items.forEach(item => {
        item.selectable = true;
        item.evented = true;
      });

      canvas.getObjects().forEach(o => {
        if (o.type === 'group') {
          o._selectedChild = null;
        }
      });

      canvas.setActiveObject(child);
      canvas.requestRenderAll();
    };

    canvas.commitGroupEditing = () => {
      if (!canvas._editingGroup) return;
      const { originalObjects } = canvas._editingGroup;
      canvas._editingGroup = null;

      const currentObjects = canvas.getObjects();
      const objectsToGroup = originalObjects.filter(obj => currentObjects.includes(obj));

      if (objectsToGroup.length > 1) {
        objectsToGroup.forEach(obj => canvas.remove(obj));

        const group = new Group(objectsToGroup, {
          subTargetCheck: true,
          interactive: false
        });

        canvas.add(group);
        canvas.setActiveObject(group);
        canvas.requestRenderAll();
        
        saveStateToHistory();
      }
    };

    const updateSelection = () => {
      const activeObj = canvas.getActiveObject();
      
      if (canvas._editingGroup) {
        const { originalObjects } = canvas._editingGroup;
        if (!activeObj || !originalObjects.includes(activeObj)) {
          canvas.commitGroupEditing();
        }
      }

      const currentActive = canvas.getActiveObject();
      if (currentActive) {
        setActiveObject(currentActive);
        setCoords(currentActive.getBoundingRect(true));
        setIsLocked(currentActive.lockMovementX || false);
        if (currentActive.type === 'textbox') {
          syncTextFromObject(currentActive);
        } else if (currentActive.type === 'image') {
          syncImageFromObject(currentActive);
        } else if (currentActive.type === 'group') {
          if (!currentActive._selectedChild) {
            const firstImg = currentActive.getObjects ? currentActive.getObjects().find(o => o.type === 'image') : null;
            if (firstImg) {
              currentActive._selectedChild = firstImg;
            }
          }
          if (currentActive._selectedChild) {
            syncImageFromObject(currentActive._selectedChild);
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

      if (e.target && e.target.type === 'group') {
        const group = e.target;
        const clickedChild = e.subTargets && e.subTargets[0];
        if (clickedChild) {
          if (canvas._lastSelectedGroup === group) {
            canvas.selectGroupChild(group, clickedChild);
          } else {
            canvas._lastSelectedGroup = group;
          }
        }
      } else {
        canvas._lastSelectedGroup = null;
      }
    };

    const handleObjectMoving = async (e) => {
      const activeObj = e.target || canvas.getActiveObject();
      if (!activeObj) return;

      // Handle Alt + Drag copy-paste
      if (e.e && e.e.altKey && !hasDuplicatedOnAltDragRef.current && dragStartPosRef.current) {
        hasDuplicatedOnAltDragRef.current = true;
        try {
          const cloned = await activeObj.clone(['rx', 'ry', 'isPaintStroke', 'erasable']);
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
      if (canvas._editingGroup) {
        canvas.commitGroupEditing();
      }
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
      const vpt = canvas.viewportTransform || [1, 0, 0, 1, 0, 0];
      const toScreenPt = (pt) => ({
        x: vpt[0] * pt.x + vpt[4],
        y: vpt[3] * pt.y + vpt[5]
      });

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

            const screenCoords = coords.map(toScreenPt);

            ctx.beginPath();
            ctx.moveTo(screenCoords[0].x, screenCoords[0].y);
            ctx.lineTo(screenCoords[1].x, screenCoords[1].y);
            ctx.lineTo(screenCoords[2].x, screenCoords[2].y);
            ctx.lineTo(screenCoords[3].x, screenCoords[3].y);
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
              screenCoords.forEach((pt) => {
                ctx.beginPath();
                ctx.rect(pt.x - handleSize, pt.y - handleSize, handleSize * 2, handleSize * 2);
                ctx.fill();
                ctx.stroke();
              });

              const midpoints = [
                { x: (screenCoords[0].x + screenCoords[1].x) / 2, y: (screenCoords[0].y + screenCoords[1].y) / 2 },
                { x: (screenCoords[1].x + screenCoords[2].x) / 2, y: (screenCoords[1].y + screenCoords[2].y) / 2 },
                { x: (screenCoords[2].x + screenCoords[3].x) / 2, y: (screenCoords[2].y + screenCoords[3].y) / 2 },
                { x: (screenCoords[3].x + screenCoords[0].x) / 2, y: (screenCoords[3].y + screenCoords[0].y) / 2 }
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

      // Draw overall group boundary box while editing a child inside a group
      if (canvas._editingGroup) {
        const { originalObjects } = canvas._editingGroup;
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        originalObjects.forEach(obj => {
          if (!canvas.getObjects().includes(obj)) return;
          const coords = getCanvasCoords(obj);
          if (coords) {
            coords.forEach(pt => {
              if (pt.x < minX) minX = pt.x;
              if (pt.y < minY) minY = pt.y;
              if (pt.x > maxX) maxX = pt.x;
              if (pt.y > maxY) maxY = pt.y;
            });
          }
        });

        if (minX !== Infinity) {
          const screenTL = toScreenPt({ x: minX, y: minY });
          const screenBR = toScreenPt({ x: maxX, y: maxY });

          ctx.save();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          // Draw rect with padding
          ctx.strokeRect(screenTL.x - 4, screenTL.y - 4, (screenBR.x - screenTL.x) + 8, (screenBR.y - screenTL.y) + 8);
          ctx.restore();
        }
      }
    };

    const handleObjectAdded = (e) => {
      const obj = e.target;
      if (obj) {
        if (obj.isPaintStroke || obj.type === 'path') {
          obj.erasable = true;
        } else {
          obj.erasable = false;
        }
      }
      if (obj && obj.type === 'image') {
        initializeImageObject(obj);
      }
      if (obj && (obj.type === 'path' || obj.isPaintStroke)) {
        return;
      }
      if (!isHandlingHistoryRef.current) {
        const isInteractiveObject = obj && (obj.type === 'image' || obj.type === 'textbox');
        saveStateToHistory(isInteractiveObject);
      }
    };

    const handleObjectRemoved = () => {
      if (canvas.isBatchDeleting) return;
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
    canvas.on('erasing:end', () => {
      if (!isHandlingHistoryRef.current) {
        saveStateToHistory(true);
      }
    });
    canvas.on('path:created', (e) => {
      if (e.path) {
        if (canvas.freeDrawingBrush instanceof EraserBrush) {
          e.path.isPaintStroke = false;
          e.path.erasable = false;
          if (!isHandlingHistoryRef.current) {
            saveStateToHistory(true);
          }
          return;
        }
        e.path.isPaintStroke = true;
        e.path.erasable = true;
        if (showPaintPanelRef.current) {
          e.path.selectable = false;
          e.path.evented = false;
        }
        if (!isHandlingHistoryRef.current) {
          saveStateToHistory(true);
        }
      }
    });

      return () => {
        isDisposed = true;
        try {
          canvas.dispose();
        } catch (err) {
          console.warn('Canvas disposal ignored:', err);
        }
        fabricRef.current = null;
      };
  }, [step, currentProduct]);

  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.printWidth = currentProduct.printWidth;
    canvas.printHeight = currentProduct.printHeight;
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
