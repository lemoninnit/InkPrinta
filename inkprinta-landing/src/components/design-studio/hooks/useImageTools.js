import { useState, useEffect, useRef } from 'react';

export function useImageTools(fabricRef, saveStateToHistory) {
  const [strokeColor, setStrokeColor] = useState('#000000');
  const [strokeWidth, setStrokeWidth] = useState(0);
  const [strokeType, setStrokeType] = useState('none');
  const [cornerRadius, setCornerRadius] = useState(0);
  const [opacity, setOpacity] = useState(1.0);
  const [flipX, setFlipX] = useState(false);
  const [flipY, setFlipY] = useState(false);
  const [aspectRatio, setAspectRatio] = useState('free');

  // Popover open states
  const [showStrokePopover, setShowStrokePopover] = useState(false);
  const [showCornerPopover, setShowCornerPopover] = useState(false);
  const [showCropPopover, setShowCropPopover] = useState(false);
  const [showOpacityPopover, setShowOpacityPopover] = useState(false);

  const [isSliding, setIsSliding] = useState(false);

  // Canva-style crop states
  const [isCropping, setIsCropping] = useState(false);
  const [croppingImage, setCroppingImage] = useState(null);
  const [originalOpacity, setOriginalOpacity] = useState(1);
  const cropBoxRef = useRef({ x: 0, y: 0, w: 0, h: 0 });

  const resetPopovers = () => {
    setShowStrokePopover(false);
    setShowCornerPopover(false);
    setShowCropPopover(false);
    setShowOpacityPopover(false);
  };

  // Temporarily hide borders and handles while dragging range sliders
  useEffect(() => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    if (isSliding) {
      activeObj.set({
        hasBorders: false,
        hasControls: false
      });
    } else {
      activeObj.set({
        hasBorders: true,
        hasControls: true
      });
    }
    fabricRef.current.renderAll();
  }, [isSliding, fabricRef]);

  const syncImageFromObject = (activeObj) => {
    if (!activeObj) return;
    setStrokeColor(activeObj.stroke || '#000000');
    setStrokeWidth(activeObj.strokeWidth || 0);
    setCornerRadius(activeObj.rx || 0);
    setOpacity(activeObj.opacity !== undefined ? activeObj.opacity : 1.0);
    setFlipX(activeObj.flipX || false);
    setFlipY(activeObj.flipY || false);

    if (!activeObj.stroke || activeObj.strokeWidth === 0) {
      setStrokeType('none');
    } else if (activeObj.strokeDashArray) {
      if (activeObj.strokeDashArray[0] >= 8) {
        setStrokeType('dashed-large');
      } else {
        setStrokeType('dashed-small');
      }
    } else {
      setStrokeType('solid');
    }
  };

  const updateActiveImageProp = (properties) => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    activeObj.set(properties);
    activeObj.setCoords();
    fabricRef.current.renderAll();
    saveStateToHistory?.();
  };

  const handleStrokeWidthChange = (width) => {
    setStrokeWidth(width);
    const type = strokeType === 'none' && width > 0 ? 'solid' : strokeType;
    if (type === 'none') {
      updateActiveImageProp({ strokeWidth: 0, stroke: null });
    } else {
      let dashArray = null;
      if (type === 'dashed-large') dashArray = [12, 8];
      if (type === 'dashed-small') dashArray = [4, 4];
      updateActiveImageProp({
        strokeWidth: width,
        stroke: strokeColor,
        strokeDashArray: dashArray
      });
    }
  };

  const handleStrokeTypeChange = (type) => {
    setStrokeType(type);
    if (type === 'none') {
      updateActiveImageProp({ strokeWidth: 0, stroke: null });
    } else {
      const width = strokeWidth === 0 ? 2 : strokeWidth;
      setStrokeWidth(width);
      let dashArray = null;
      if (type === 'dashed-large') dashArray = [12, 8];
      if (type === 'dashed-small') dashArray = [4, 4];
      updateActiveImageProp({
        strokeWidth: width,
        stroke: strokeColor,
        strokeDashArray: dashArray
      });
    }
  };

  const handleStrokeColorChange = (color) => {
    setStrokeColor(color);
    if (strokeType !== 'none') {
      updateActiveImageProp({ stroke: color });
    }
  };

  const handleCornerRadiusChange = (radius) => {
    setCornerRadius(radius);
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    activeObj.set({ rx: radius, ry: radius });

    activeObj.setCoords();
    fabricRef.current.renderAll();
    saveStateToHistory?.();
  };

  const handleOpacityChange = (val) => {
    const op = Math.max(0, Math.min(1, val));
    setOpacity(op);
    updateActiveImageProp({ opacity: op });
  };

  const handleFlipX = () => {
    const nextFlip = !flipX;
    setFlipX(nextFlip);
    updateActiveImageProp({ flipX: nextFlip });
  };

  const handleFlipY = () => {
    const nextFlip = !flipY;
    setFlipY(nextFlip);
    updateActiveImageProp({ flipY: nextFlip });
  };

  const startCropping = (activeObj) => {
    if (!activeObj || activeObj.type !== 'image') return;
    setCroppingImage(activeObj);
    setOriginalOpacity(activeObj.opacity !== undefined ? activeObj.opacity : 1);
    setIsCropping(true);
    resetPopovers();
    setAspectRatio('free');

    activeObj.set({
      opacity: 0.25,
      selectable: false,
      evented: false
    });
    
    if (fabricRef.current) {
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
    }
  };

  const applyCrop = (zoom) => {
    if (!croppingImage || !fabricRef.current) return;

    const imgEl = croppingImage.getElement();
    if (!imgEl) return;
    const originalWidth = imgEl.naturalWidth || imgEl.width;
    const originalHeight = imgEl.naturalHeight || imgEl.height;

    const scaleX = croppingImage.scaleX;
    const scaleY = croppingImage.scaleY;

    const uncroppedWidth = originalWidth * scaleX * zoom;
    const uncroppedHeight = originalHeight * scaleY * zoom;

    const { x, y, w, h } = cropBoxRef.current;

    // Map screen box pixels back to image natural pixels
    const newCropX = (x / uncroppedWidth) * originalWidth;
    const newCropY = (y / uncroppedHeight) * originalHeight;
    const newWidth = (w / uncroppedWidth) * originalWidth;
    const newHeight = (h / uncroppedHeight) * originalHeight;

    const finalCropX = Math.max(0, Math.min(originalWidth, newCropX));
    const finalCropY = Math.max(0, Math.min(originalHeight, newCropY));
    const finalWidth = Math.max(20, Math.min(originalWidth, newWidth));
    const finalHeight = Math.max(20, Math.min(originalHeight, newHeight));

    const leftUncropped = croppingImage.left - (croppingImage.width / 2 + croppingImage.cropX) * scaleX;
    const topUncropped = croppingImage.top - (croppingImage.height / 2 + croppingImage.cropY) * scaleY;

    croppingImage.set({
      cropX: finalCropX,
      cropY: finalCropY,
      width: finalWidth,
      height: finalHeight,
      left: leftUncropped + (finalWidth / 2 + finalCropX) * scaleX,
      top: topUncropped + (finalHeight / 2 + finalCropY) * scaleY,
      opacity: originalOpacity,
      selectable: true,
      evented: true
    });

    croppingImage.setCoords();
    fabricRef.current.setActiveObject(croppingImage);
    fabricRef.current.renderAll();

    setIsCropping(false);
    setCroppingImage(null);
    saveStateToHistory?.();
  };

  const cancelCrop = () => {
    if (!croppingImage || !fabricRef.current) return;

    croppingImage.set({
      opacity: originalOpacity,
      selectable: true,
      evented: true
    });

    fabricRef.current.setActiveObject(croppingImage);
    fabricRef.current.renderAll();

    setIsCropping(false);
    setCroppingImage(null);
  };

  return {
    strokeColor,
    strokeWidth,
    strokeType,
    cornerRadius,
    opacity,
    flipX,
    flipY,
    aspectRatio,
    setAspectRatio,
    showStrokePopover,
    setShowStrokePopover,
    showCornerPopover,
    setShowCornerPopover,
    showCropPopover,
    setShowCropPopover,
    showOpacityPopover,
    setShowOpacityPopover,
    isSliding,
    setIsSliding,
    isCropping,
    croppingImage,
    cropBoxRef,
    resetPopovers,
    syncImageFromObject,
    handleStrokeWidthChange,
    handleStrokeTypeChange,
    handleStrokeColorChange,
    handleCornerRadiusChange,
    handleOpacityChange,
    handleFlipX,
    handleFlipY,
    startCropping,
    applyCrop,
    cancelCrop
  };
}
