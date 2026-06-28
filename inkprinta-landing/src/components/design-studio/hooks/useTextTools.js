import { useState, useEffect } from 'react';
import { Textbox } from 'fabric';
import { hexToHsl, hsvToHsl, hslToHex } from '../utils/calculations.js';
import { styleTextboxControls, initializeImageObject } from '../utils/helpers.js';

export function useTextTools(fabricRef, saveStateToHistory) {
  const [textInput, setTextInput] = useState('Your Text');
  const [fontFamily, setFontFamily] = useState('sans-serif');
  const [fontSize, setFontSize] = useState(36);
  const [textColor, setTextColor] = useState('#0f172a');
  const [fontWeight, setFontWeight] = useState('normal');
  const [fontStyle, setFontStyle] = useState('normal');
  const [underline, setUnderline] = useState(false);
  const [linethrough, setLinethrough] = useState(false);
  const [textAlign, setTextAlign] = useState('center');
  const [opacity, setOpacity] = useState(1.0);
  const [opacityInput, setOpacityInput] = useState('100');
  const [isLocked, setIsLocked] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [activeObject, setActiveObjectState] = useState(null);
  const [coords, setCoordsState] = useState(null);

  const [hueValue, setHueValue] = useState(180);
  const [hexInputValue, setHexInputValue] = useState('0F172A');
  const [showColorPopover, setShowColorPopover] = useState(false);
  const [showOpacityPopover, setShowOpacityPopover] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showBottomFontDropdown, setShowBottomFontDropdown] = useState(false);

  const setActiveObject = (obj) => setActiveObjectState(obj);
  const setCoords = (value) => setCoordsState(value);

  useEffect(() => {
    const cleanHex = textColor.replace(/^#/, '');
    setHexInputValue(cleanHex.toUpperCase());
    try {
      setHueValue(hexToHsl(cleanHex).h);
    } catch {
      /* ignore invalid hex */
    }
  }, [textColor]);

  useEffect(() => {
    setOpacityInput(String(Math.round(opacity * 100)));
  }, [opacity]);

  const syncTextFromObject = (activeObj) => {
    setFontFamily(activeObj.fontFamily || 'sans-serif');
    setFontSize(activeObj.fontSize || 36);
    setTextColor(activeObj.fill || '#0f172a');
    setFontWeight(activeObj.fontWeight || 'normal');
    setFontStyle(activeObj.fontStyle || 'normal');
    setUnderline(activeObj.underline || false);
    setLinethrough(activeObj.linethrough || false);
    setTextAlign(activeObj.textAlign || 'center');
    setOpacity(activeObj.opacity !== undefined ? activeObj.opacity : 1.0);
  };

  const updateActiveObjectProp = (key, value) => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    activeObj.set(key, value);
    activeObj.setCoords();
    fabricRef.current.renderAll();
    setCoords(activeObj.getBoundingRect(true));
    saveStateToHistory?.();
  };

  const handleFontSizeChange = (newSize) => {
    const size = Math.max(8, Math.min(200, newSize));
    setFontSize(size);
    updateActiveObjectProp('fontSize', size);
  };

  const handleFontFamilyChange = (family) => {
    setFontFamily(family);
    updateActiveObjectProp('fontFamily', family);
  };

  const handleTextColorChange = (color) => {
    setTextColor(color);
    updateActiveObjectProp('fill', color);
  };

  const handleBoldToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    const newWeight = activeObj.fontWeight === 'bold' ? 'normal' : 'bold';
    setFontWeight(newWeight);
    updateActiveObjectProp('fontWeight', newWeight);
  };

  const handleItalicToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    const newStyle = activeObj.fontStyle === 'italic' ? 'normal' : 'italic';
    setFontStyle(newStyle);
    updateActiveObjectProp('fontStyle', newStyle);
  };

  const handleUnderlineToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    const newVal = !activeObj.underline;
    setUnderline(newVal);
    updateActiveObjectProp('underline', newVal);
  };

  const handleLinethroughToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    const newVal = !activeObj.linethrough;
    setLinethrough(newVal);
    updateActiveObjectProp('linethrough', newVal);
  };

  const handleCaseToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj || !activeObj.text) return;
    const txt = activeObj.text;
    const newTxt = txt === txt.toUpperCase() ? txt.toLowerCase() : txt.toUpperCase();
    updateActiveObjectProp('text', newTxt);
  };

  const handleAlignToggle = (alignment) => {
    setTextAlign(alignment);
    updateActiveObjectProp('textAlign', alignment);
  };

  const handleListToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj || !activeObj.text) return;
    const lines = activeObj.text.split('\n');
    const isBullet = lines.every((line) => line.startsWith('• '));
    const newText = lines
      .map((line) => (isBullet ? line.replace(/^• /, '') : `• ${line}`))
      .join('\n');
    updateActiveObjectProp('text', newText);
  };

  const handleOpacityChange = (val) => {
    const op = Math.max(0, Math.min(1, val));
    setOpacity(op);
    updateActiveObjectProp('opacity', op);
  };

  const handleToggleLock = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    const newLocked = !isLocked;
    setIsLocked(newLocked);
    activeObj.set({
      lockMovementX: newLocked,
      lockMovementY: newLocked,
      lockScalingX: newLocked,
      lockScalingY: newLocked,
      lockRotation: newLocked
    });
    fabricRef.current.renderAll();
    setCoords(activeObj.getBoundingRect(true));
    saveStateToHistory?.();
  };

  const handleDuplicate = async () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    try {
      const cloned = await activeObj.clone(['rx', 'ry', 'isPaintStroke', 'erasable']);
      cloned.set({
        left: activeObj.left + 24,
        top: activeObj.top + 24
      });
      if (cloned.type && cloned.type.toLowerCase() === 'image') {
        initializeImageObject(cloned);
      } else {
        styleTextboxControls(cloned);
      }
      fabricRef.current.add(cloned);
      fabricRef.current.setActiveObject(cloned);
      fabricRef.current.renderAll();
      setActiveObject(cloned);
      setCoords(cloned.getBoundingRect(true));
      saveStateToHistory();
    } catch (err) {
      console.error('Cloning failed:', err);
    }
  };

  const handleDelete = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (activeObj && !activeObj.lockMovementX) {
      fabricRef.current.remove(activeObj);
      fabricRef.current.discardActiveObject();
      fabricRef.current.renderAll();
      setActiveObject(null);
      setCoords(null);
    }
  };

  const handleAddText = (onComplete) => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    const centerX = canvas.getWidth() / 2;
    const centerY = canvas.getHeight() / 2;

    const textObj = new Textbox(textInput, {
      left: centerX,
      top: centerY,
      fontFamily,
      fontSize,
      fill: textColor,
      originX: 'center',
      originY: 'center',
      textAlign: 'center',
      padding: 10
    });

    styleTextboxControls(textObj);
    fabricRef.current.add(textObj);
    fabricRef.current.setActiveObject(textObj);
    fabricRef.current.renderAll();

    setTextInput('Your Text');
    onComplete?.();
  };

  const handleColorSquareMouseDown = (e, onColorChange) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const update = (clientX, clientY) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newV = Math.round((1 - y) * 100);
      const hsl = hsvToHsl(hueValue, newS, newV);
      const hex = hslToHex(hsl.h, hsl.s, hsl.l);
      onColorChange(hex);
    };

    update(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent) => update(moveEvent.clientX, moveEvent.clientY);
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return {
    textInput,
    setTextInput,
    fontFamily,
    setFontFamily,
    fontSize,
    setFontSize,
    textColor,
    setTextColor,
    fontWeight,
    fontStyle,
    underline,
    linethrough,
    textAlign,
    opacity,
    opacityInput,
    setOpacityInput,
    isLocked,
    setIsLocked,
    isRotating,
    setIsRotating,
    rotationAngle,
    setRotationAngle,
    activeObject,
    setActiveObject,
    coords,
    setCoords,
    hueValue,
    setHueValue,
    hexInputValue,
    setHexInputValue,
    showColorPopover,
    setShowColorPopover,
    showOpacityPopover,
    setShowOpacityPopover,
    showFontDropdown,
    setShowFontDropdown,
    showBottomFontDropdown,
    setShowBottomFontDropdown,
    syncTextFromObject,
    handleFontSizeChange,
    handleFontFamilyChange,
    handleTextColorChange,
    handleBoldToggle,
    handleItalicToggle,
    handleUnderlineToggle,
    handleLinethroughToggle,
    handleCaseToggle,
    handleAlignToggle,
    handleListToggle,
    handleOpacityChange,
    handleToggleLock,
    handleDuplicate,
    handleDelete,
    handleAddText,
    handleColorSquareMouseDown
  };
}
