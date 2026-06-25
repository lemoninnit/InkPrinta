import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Canvas, Textbox } from 'fabric';

const PREMIUM_FONTS = [
  { value: 'sans-serif', label: 'Canva Sans', style: { fontFamily: 'sans-serif' } },
  { value: 'Inter, sans-serif', label: 'Inter (Sans)', style: { fontFamily: 'Inter, sans-serif' } },
  { value: 'Montserrat, sans-serif', label: 'Montserrat (Bold)', style: { fontFamily: 'Montserrat, sans-serif' } },
  { value: 'Oswald, sans-serif', label: 'Oswald (Condensed)', style: { fontFamily: 'Oswald, sans-serif' } },
  { value: 'Georgia, serif', label: 'Georgia Serif', style: { fontFamily: 'Georgia, serif' } },
  { value: 'Playfair Display, serif', label: 'Playfair (Classic)', style: { fontFamily: 'Playfair Display, serif' } },
  { value: 'Lora, serif', label: 'Lora (Elegant)', style: { fontFamily: 'Lora, serif' } },
  { value: 'Cinzel, serif', label: 'Cinzel (Luxury)', style: { fontFamily: 'Cinzel, serif' } },
  { value: 'Courier New, monospace', label: 'Courier Monospace', style: { fontFamily: 'Courier New, monospace' } },
  { value: 'Fira Code, monospace', label: 'Fira Code (Mono)', style: { fontFamily: 'Fira Code, monospace' } },
  { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet Retro', style: { fontFamily: 'Trebuchet MS, sans-serif' } },
  { value: 'Great Vibes, cursive', label: 'Great Vibes (Script)', style: { fontFamily: 'Great Vibes, cursive' } }
];

export default function DesignStudio() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Product');
  const [showProductPanel, setShowProductPanel] = useState(false);
  const [showTextPanel, setShowTextPanel] = useState(false);
  
  // Text studio states
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
  const [activeObject, setActiveObject] = useState(null);
  const [coords, setCoords] = useState(null);

  const [zoom, setZoom] = useState(1.0);

  // Custom Color Picker & Snapping Alignment States/Refs
  const [hueValue, setHueValue] = useState(180);
  const [hexInputValue, setHexInputValue] = useState('0F172A');
  const [showColorPopover, setShowColorPopover] = useState(false);
  const [showOpacityPopover, setShowOpacityPopover] = useState(false);
  const [showFontDropdown, setShowFontDropdown] = useState(false);
  const [showBottomFontDropdown, setShowBottomFontDropdown] = useState(false);
  const showVerticalGuideRef = useRef(false);
  const showHorizontalGuideRef = useRef(false);

  const currentFontObj = PREMIUM_FONTS.find(f => f.value === fontFamily) || PREMIUM_FONTS[0];

  const handleColorSquareMouseDown = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const update = (clientX, clientY) => {
      const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
      const newS = Math.round(x * 100);
      const newV = Math.round((1 - y) * 100);
      const hsl = hsvToHsl(hueValue, newS, newV);
      const hex = hslToHex(hsl.h, hsl.s, hsl.l);
      handleTextColorChange(hex);
    };

    update(e.clientX, e.clientY);

    const handleMouseMove = (moveEvent) => {
      update(moveEvent.clientX, moveEvent.clientY);
    };
    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Helper: HSV to HSL
  const hsvToHsl = (h, s, v) => {
    s /= 100;
    v /= 100;
    let l = v * (1 - s / 2);
    let sL = (l === 0 || l === 1) ? 0 : (v - l) / Math.min(l, 1 - l);
    return {
      h: h,
      s: Math.round(sL * 100),
      l: Math.round(l * 100)
    };
  };

  // Helper: HSL to HSV
  const hslToHsv = (h, s, l) => {
    s /= 100;
    l /= 100;
    let v = l + s * Math.min(l, 1 - l);
    let sV = v === 0 ? 0 : 2 * (1 - l / v);
    return {
      h: h,
      s: Math.round(sV * 100),
      v: Math.round(v * 100)
    };
  };

  // Helper: HSL to HEX
  const hslToHex = (h, s, l) => {
    l /= 100;
    const a = (s * Math.min(l, 1 - l)) / 100;
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  // Helper: HEX to HSL
  const hexToHsl = (hex) => {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    let r = parseInt(hex.substring(0, 2), 16) / 255;
    let g = parseInt(hex.substring(2, 4), 16) / 255;
    let b = parseInt(hex.substring(4, 6), 16) / 255;

    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      let d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // Sync state values on color changes
  useEffect(() => {
    const cleanHex = textColor.replace(/^#/, '');
    setHexInputValue(cleanHex.toUpperCase());
    try {
      const hsl = hexToHsl(cleanHex);
      setHueValue(hsl.h);
    } catch (e) {}
  }, [textColor]);

  // Sync state values on opacity changes
  useEffect(() => {
    setOpacityInput(String(Math.round(opacity * 100)));
  }, [opacity]);

  const products = [
    {
      id: 'tshirt',
      label: 'Basic T-Shirt',
      price: '₱990.00',
      printWidth: 400,
      printHeight: 500
    },
    {
      id: 'hoodie',
      label: 'Premium Hoodie',
      price: '₱1,490.00',
      printWidth: 400,
      printHeight: 400
    },
    {
      id: 'tote',
      label: 'Canvas Tote Bag',
      price: '₱490.00',
      printWidth: 350,
      printHeight: 400
    }
  ];

  const [currentProduct, setCurrentProduct] = useState(products[0]);

  const tabs = [
    {
      id: 'Product',
      label: 'Product',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v1.8a3 3 0 006 0v-1.8m-6 0H4.5L3 8.25l3 1.5V20.25h12V9.75l3-1.5L19.5 4.5H15" />
        </svg>
      )
    },
    {
      id: 'Image',
      label: 'Image',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      )
    },
    {
      id: 'Stamp',
      label: 'Stamp',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499c.172-.468.83-.468 1.002 0l3.001 8.163c.046.126.166.21.3.217l8.7.632c.504.037.707.658.343 1.011l-6.3 6.14a.428.428 0 00-.123.379l1.487 8.665c.086.502-.44.886-.889.65l-7.781-4.09a.434.434 0 00-.404 0l-7.781 4.09c-.449.236-.975-.148-.889-.65l1.487-8.665a.428.428 0 00-.123-.379l-6.3-6.14c-.364-.353-.161-.974.343-1.011l8.7-.632a.229 2.229 0 00.3-.217l3.001-8.163z" />
        </svg>
      )
    },
    {
      id: 'Text',
      label: 'Text',
      icon: (
        <span className="font-serif font-extrabold text-[22px] leading-none select-none">A</span>
      )
    },
    {
      id: 'Paint',
      label: 'Paint',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122l9.37-9.37a2.25 2.25 0 113.182 3.182l-9.37 9.37a4.5 4.5 0 01-2.25 1.22l-3.136.627a1.125 1.125 0 01-1.327-1.327l.627-3.136a4.5 4.5 0 011.22-2.25z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5L17.5 9.5" />
        </svg>
      )
    }
  ];

  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const viewportRef = useRef(null);
  
  const undoStackRef = useRef([]);
  const redoStackRef = useRef([]);
  const isHandlingHistoryRef = useRef(false);

  const saveStateToHistory = () => {
    if (!fabricRef.current || isHandlingHistoryRef.current) return;
    const json = fabricRef.current.toJSON();
    undoStackRef.current.push(JSON.stringify(json));
    if (undoStackRef.current.length > 50) {
      undoStackRef.current.shift();
    }
    redoStackRef.current = [];
  };

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleWheel = (e) => {
      if (e.ctrlKey) {
        e.preventDefault();
        
        const delta = -e.deltaY;
        
        setZoom((prevZoom) => {
          // Logarithmic zoom increments (8% per notch) feel natural and consistent
          const zoomFactor = prevZoom * 0.08;
          let newZoom = delta > 0 ? prevZoom + zoomFactor : prevZoom - zoomFactor;
          newZoom = Math.max(0.5, Math.min(3.0, newZoom));

          if (newZoom !== prevZoom) {
            const rect = viewport.getBoundingClientRect();
            // Mouse pointer coordinates relative to the viewport container
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Calculate coordinates in original scale (1.0 zoom) content space
            const contentX = (viewport.scrollLeft + mouseX) / prevZoom;
            const contentY = (viewport.scrollTop + mouseY) / prevZoom;
            
            // Adjust scroll positions instantly to keep the point under the mouse pointer
            requestAnimationFrame(() => {
              viewport.scrollLeft = contentX * newZoom - mouseX;
              viewport.scrollTop = contentY * newZoom - mouseY;
            });
          }
          return newZoom;
        });
      }
    };

    viewport.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      viewport.removeEventListener('wheel', handleWheel);
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize Fabric Canvas with currentProduct print sizes and high-quality retina rendering
    const canvas = new Canvas(canvasRef.current, {
      width: currentProduct.printWidth,
      height: currentProduct.printHeight,
      backgroundColor: 'transparent',
      enableRetinaScaling: true,
      imageSmoothingEnabled: true
    });

    fabricRef.current = canvas;
    saveStateToHistory(); // Save initial state

    const updateSelection = () => {
      const activeObj = canvas.getActiveObject();
      if (activeObj) {
        setActiveObject(activeObj);
        setCoords(activeObj.getBoundingRect(true));
        setIsLocked(activeObj.lockMovementX || false);
        if (activeObj.type === 'textbox') {
          setFontFamily(activeObj.fontFamily || 'sans-serif');
          setFontSize(activeObj.fontSize || 36);
          setTextColor(activeObj.fill || '#0f172a');
          setFontWeight(activeObj.fontWeight || 'normal');
          setFontStyle(activeObj.fontStyle || 'normal');
          setUnderline(activeObj.underline || false);
          setLinethrough(activeObj.linethrough || false);
          setTextAlign(activeObj.textAlign || 'center');
          setOpacity(activeObj.opacity !== undefined ? activeObj.opacity : 1.0);
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
        if (angle > 180) {
          angle -= 360;
        } else if (angle < -180) {
          angle += 360;
        }
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

    const handleObjectMoving = (e) => {
      const activeObj = e.target || canvas.getActiveObject();
      if (!activeObj) return;

      const centerX = currentProduct.printWidth / 2;
      const centerY = currentProduct.printHeight / 2;
      const threshold = 8;

      const objCenter = activeObj.getCenterPoint();
      let newCenterX = objCenter.x;
      let newCenterY = objCenter.y;
      
      let snapX = false;
      let snapY = false;

      if (Math.abs(objCenter.x - centerX) < threshold) {
        newCenterX = centerX;
        snapX = true;
      }
      if (Math.abs(objCenter.y - centerY) < threshold) {
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

    canvas.on('selection:created', updateSelection);
    canvas.on('selection:updated', updateSelection);
    canvas.on('selection:cleared', () => {
      updateSelection();
      setIsRotating(false);
      setIsLocked(false);
      showVerticalGuideRef.current = false;
      showHorizontalGuideRef.current = false;
      canvas.renderAll();
    });
    canvas.on('object:moving', handleObjectMoving);
    canvas.on('object:scaling', updateSelection);
    canvas.on('object:rotating', handleObjectRotating);
    canvas.on('before:transform', handleTransformBefore);
    canvas.on('object:modified', handleObjectModified);

    canvas.on('after:render', () => {
      const ctx = canvas.getContext();
      if (!ctx) return;

      ctx.save();
      const currentZoom = canvas.getZoom();
      
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 4]);

      // Vertical center guide (X-axis)
      if (showVerticalGuideRef.current) {
        const x = (currentProduct.printWidth / 2) * currentZoom;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, currentProduct.printHeight * currentZoom);
        ctx.stroke();
      }

      // Horizontal center guide (Y-axis)
      if (showHorizontalGuideRef.current) {
        const y = (currentProduct.printHeight / 2) * currentZoom;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(currentProduct.printWidth * currentZoom, y);
        ctx.stroke();
      }

      ctx.restore();
    });
    
    // History State Event Listeners
    canvas.on('object:added', () => {
      if (!isHandlingHistoryRef.current) {
        saveStateToHistory();
      }
    });
    canvas.on('object:removed', () => {
      if (!isHandlingHistoryRef.current) {
        saveStateToHistory();
      }
    });

    // Cleanup on unmount
    return () => {
      canvas.off('selection:created', updateSelection);
      canvas.off('selection:updated', updateSelection);
      canvas.off('selection:cleared');
      canvas.off('object:moving');
      canvas.off('object:scaling');
      canvas.off('object:rotating');
      canvas.off('before:transform');
      canvas.off('object:modified');
      canvas.off('after:render');
      if (fabricRef.current) {
        fabricRef.current.dispose();
      }
    };
  }, []);

  // Update Fabric canvas dimensions and zoom level dynamically
  useEffect(() => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    canvas.setZoom(zoom);
    canvas.setDimensions({
      width: currentProduct.printWidth * zoom,
      height: currentProduct.printHeight * zoom
    });
    canvas.renderAll();

    // If there is an active object, update coordinates to match zoomed canvas coordinates
    const activeObj = canvas.getActiveObject();
    if (activeObj) {
      setCoords(activeObj.getBoundingRect(true));
    }
  }, [currentProduct, zoom]);

  const handleTabClick = (tabId) => {
    if (tabId === 'Product') {
      setShowProductPanel(!showProductPanel);
      setShowTextPanel(false);
    } else if (tabId === 'Text') {
      setShowTextPanel(!showTextPanel);
      setShowProductPanel(false);
    } else {
      setActiveTab(tabId);
      setShowProductPanel(false);
      setShowTextPanel(false);
    }
  };

  const styleTextboxControls = (textObj) => {
    // Style corners as white circles with cyan border
    textObj.transparentCorners = false;
    textObj.cornerColor = '#ffffff';
    textObj.cornerStrokeColor = '#06b6d4';
    textObj.cornerSize = 8;
    textObj.cornerStyle = 'circle';
    textObj.borderColor = '#06b6d4';
    textObj.borderScaleFactor = 1.5;
    textObj.padding = 10;

    const drawPillControl = (ctx, left, top, styleOverride, fabricObject, control) => {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 1.5;
      
      const isVertical = control.name === 'ml' || control.name === 'mr';
      const width = isVertical ? 6 : 14;
      const height = isVertical ? 14 : 6;
      const radius = 3;
      const x = left - width / 2;
      const y = top - height / 2;
      
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
      
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    if (textObj.controls) {
      // Style middle side controls as pills
      ['ml', 'mr', 'mt', 'mb'].forEach((name) => {
        if (textObj.controls[name]) {
          const ctrl = textObj.controls[name];
          ctrl.name = name;
          ctrl.draw = (ctx, left, top, styleOverride, fabricObject) => {
            drawPillControl(ctx, left, top, styleOverride, fabricObject, ctrl);
          };
        }
      });

      // Move rotation control (mtr) to the bottom and style it as a clean circle with a connector line
      if (textObj.controls.mtr) {
        const mtr = textObj.controls.mtr;
        mtr.y = 0.5;
        mtr.offsetY = 40;
        mtr.draw = (ctx, left, top, styleOverride, fabricObject) => {
          ctx.save();
          // Draw connector stem line
          ctx.beginPath();
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.moveTo(left, top - 6);
          ctx.lineTo(left, top - 40);
          ctx.stroke();

          // Draw rotation circle
          ctx.beginPath();
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 1.5;
          ctx.arc(left, top, 6, 0, 2 * Math.PI);
          ctx.fill();
          ctx.stroke();
          ctx.restore();
        };
      }
    }
  };

  const handleAddText = () => {
    if (!fabricRef.current) return;

    const textObj = new Textbox(textInput, {
      left: fabricRef.current.width / 2,
      top: fabricRef.current.height / 2,
      fontFamily: fontFamily,
      fontSize: fontSize,
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

    // Reset panel status
    setShowTextPanel(false);
    setTextInput('Your Text');
  };

  const updateActiveObjectProp = (key, value) => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    activeObj.set(key, value);
    activeObj.setCoords();
    fabricRef.current.renderAll();
    
    // Update local state coordinates so React positions the toolbar correctly
    setCoords(activeObj.getBoundingRect(true));
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
    const isBold = activeObj.fontWeight === 'bold';
    const newWeight = isBold ? 'normal' : 'bold';
    setFontWeight(newWeight);
    updateActiveObjectProp('fontWeight', newWeight);
  };

  const handleItalicToggle = () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;
    const isItalic = activeObj.fontStyle === 'italic';
    const newStyle = isItalic ? 'normal' : 'italic';
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
    const isBullet = lines.every(line => line.startsWith('• '));
    const newText = lines.map(line => {
      if (isBullet) {
        return line.replace(/^• /, '');
      } else {
        return `• ${line}`;
      }
    }).join('\n');
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
  };

  const handleDuplicate = async () => {
    if (!fabricRef.current) return;
    const activeObj = fabricRef.current.getActiveObject();
    if (!activeObj) return;

    try {
      const cloned = await activeObj.clone();
      cloned.set({
        left: activeObj.left + 24,
        top: activeObj.top + 24
      });
      
      styleTextboxControls(cloned);
      
      fabricRef.current.add(cloned);
      fabricRef.current.setActiveObject(cloned);
      fabricRef.current.renderAll();
      
      setActiveObject(cloned);
      setCoords(cloned.getBoundingRect(true));
    } catch (err) {
      console.error("Cloning failed:", err);
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

  const handleUndo = () => {
    if (!fabricRef.current || undoStackRef.current.length <= 1) return;

    isHandlingHistoryRef.current = true;
    
    // Pop current state and move to redo stack
    const currentState = undoStackRef.current.pop();
    redoStackRef.current.push(currentState);
    
    // Peek at previous state
    const prevStateJson = undoStackRef.current[undoStackRef.current.length - 1];
    
    const parsed = JSON.parse(prevStateJson);
    const loadPromise = fabricRef.current.loadFromJSON(parsed);
    
    const afterLoad = () => {
      fabricRef.current.forEachObject((obj) => {
        if (obj.type === 'textbox') {
          styleTextboxControls(obj);
        }
      });
      fabricRef.current.renderAll();
      isHandlingHistoryRef.current = false;
      
      // Update Selection
      const activeObj = fabricRef.current.getActiveObject();
      setActiveObject(activeObj || null);
      setCoords(activeObj ? activeObj.getBoundingRect(true) : null);
    };

    if (loadPromise && typeof loadPromise.then === 'function') {
      loadPromise.then(afterLoad);
    } else {
      afterLoad();
    }
  };

  const handleRedo = () => {
    if (!fabricRef.current || redoStackRef.current.length === 0) return;

    isHandlingHistoryRef.current = true;
    const nextStateJson = redoStackRef.current.pop();
    undoStackRef.current.push(nextStateJson);

    const parsed = JSON.parse(nextStateJson);
    const loadPromise = fabricRef.current.loadFromJSON(parsed);
    
    const afterLoad = () => {
      fabricRef.current.forEachObject((obj) => {
        if (obj.type === 'textbox') {
          styleTextboxControls(obj);
        }
      });
      fabricRef.current.renderAll();
      isHandlingHistoryRef.current = false;
      
      // Update Selection
      const activeObj = fabricRef.current.getActiveObject();
      setActiveObject(activeObj || null);
      setCoords(activeObj ? activeObj.getBoundingRect(true) : null);
    };

    if (loadPromise && typeof loadPromise.then === 'function') {
      loadPromise.then(afterLoad);
    } else {
      afterLoad();
    }
  };

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

      // Ctrl + Z: Undo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        handleUndo();
      }
      
      // Ctrl + Y: Redo
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }

      // Delete or Backspace: Delete active object (only if not editing/typing)
      if ((e.key === 'Delete' || e.key === 'Backspace') && !isTyping && !isFabricEditing) {
        e.preventDefault();
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-cyan-100 relative overflow-hidden">
      {/* 1. Top Header Bar */}
      <header className="w-full h-16 bg-white/90 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-6 z-10 shadow-sm">
        {/* Left: Back Button */}
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-cyan-600 bg-slate-50 hover:bg-cyan-50 border border-slate-100 hover:border-cyan-100 rounded-full px-4 py-2 transition-all duration-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Home
        </button>

        {/* Center: Breadcrumbs Capsule */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-full px-5 py-2 text-[10px] font-black uppercase tracking-widest text-slate-400 shadow-inner">
          <span className="text-cyan-600 font-black">1. Design</span>
          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
          </svg>
          <span>2. Preview</span>
          <svg className="w-3 h-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5-7.5" />
          </svg>
          <span>3. Order</span>
        </div>

        {/* Right: Studio branding badge */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-full px-3.5 py-1.5 shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-wider">Studio Live</span>
        </div>
      </header>

      {/* 2. Main Content Area */}
      <main 
        ref={viewportRef}
        className="flex-1 w-full relative overflow-auto z-0 flex flex-col items-center justify-start p-6 scrollbar-thin select-none"
        style={{
          backgroundColor: '#f8fafc',
          backgroundImage: 'radial-gradient(#e2e8f0 1.5px, transparent 1.5px)',
          backgroundSize: '24px 24px'
        }}
      >
        {/* Sticky Top Header Controls (does not zoom, floats at top of scroll view) */}
        <div className="sticky top-0 w-full max-w-[1168px] flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 z-20 bg-white/70 backdrop-blur-xl py-3 px-5 rounded-3xl border border-white/50 shadow-[0_8px_32px_rgba(31,38,135,0.04)] flex-shrink-0">
          {/* Left Area (Yellow highlight area): Show Canva formatting controls when text is selected */}
          <div className="flex-1 flex items-center justify-start overflow-visible py-1 min-h-[40px]">
            {activeObject && activeObject.type === 'textbox' ? (
              <div className="flex items-center gap-1.5 md:gap-2.5">
                {/* Font Family Dropdown */}
                <div className="relative group/tooltip">
                  <button 
                    onClick={() => {
                      setShowFontDropdown(!showFontDropdown);
                      setShowColorPopover(false);
                      setShowOpacityPopover(false);
                    }}
                    className="px-3.5 py-2 bg-white/40 border border-white/60 rounded-xl text-xs font-bold text-slate-700 focus:outline-none cursor-pointer min-w-[150px] shadow-sm hover:border-white hover:bg-white/60 transition-all flex items-center justify-between gap-2 h-9"
                  >
                    <span style={{ fontFamily: fontFamily }}>{currentFontObj.label}</span>
                    <svg className="w-3 h-3 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Font Family
                  </span>

                  {showFontDropdown && (
                    <>
                      {/* Click-away backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowFontDropdown(false)} />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-11 left-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl py-2 shadow-xl z-50 flex flex-col min-w-[200px] max-h-[300px] overflow-y-auto scrollbar-thin">
                        {PREMIUM_FONTS.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => {
                              handleFontFamilyChange(font.value);
                              setShowFontDropdown(false);
                            }}
                            style={font.style}
                            className={`px-4 py-2.5 text-left text-xs font-bold transition-colors ${
                              fontFamily === font.value 
                                ? 'bg-cyan-500/10 text-cyan-600' 
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <div className="h-5 w-[1px] bg-slate-200/50" />

                {/* Font Size Adjusters */}
                <div className="flex items-center bg-white/40 border border-white/60 rounded-xl overflow-hidden h-9 shadow-sm focus-within:border-white focus-within:bg-white/60 transition-all">
                  <div className="relative group/tooltip h-full flex items-center">
                    <button
                      onClick={() => handleFontSizeChange(fontSize - 1)}
                      className="px-2.5 h-full hover:bg-white/50 text-slate-500 hover:text-slate-800 font-extrabold text-sm transition-colors border-r border-white/40"
                      type="button"
                    >
                      -
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-[9px] text-white font-extrabold rounded shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                      Decrease Font Size
                    </span>
                  </div>

                  <div className="relative group/tooltip h-full flex items-center">
                    <input 
                      type="number"
                      value={fontSize}
                      onChange={(e) => handleFontSizeChange(parseInt(e.target.value) || 12)}
                      className="w-10 text-center bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-[9px] text-white font-extrabold rounded shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                      Font Size
                    </span>
                  </div>

                  <div className="relative group/tooltip h-full flex items-center">
                    <button
                      onClick={() => handleFontSizeChange(fontSize + 1)}
                      className="px-2.5 h-full hover:bg-white/50 text-slate-500 hover:text-slate-800 font-extrabold text-sm transition-colors border-l border-white/40"
                      type="button"
                    >
                      +
                    </button>
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-0.5 bg-slate-800 text-[9px] text-white font-extrabold rounded shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                      Increase Font Size
                    </span>
                  </div>
                </div>

                <div className="h-5 w-[1px] bg-slate-200/50" />

                {/* Font Color Button with Underline & Custom Color Popover */}
                <div className="relative group/tooltip">
                  <button 
                    onClick={() => {
                      setShowColorPopover(!showColorPopover);
                      setShowOpacityPopover(false);
                    }}
                    className="flex flex-col items-center justify-center w-9 h-9 rounded-xl border border-white/60 bg-white/40 hover:bg-white/60 active:scale-95 transition-all cursor-pointer relative shadow-sm"
                  >
                    <span className="text-sm font-extrabold text-slate-800 leading-none">A</span>
                    <div 
                      style={{ backgroundColor: textColor }}
                      className="w-4 h-1 rounded-full mt-0.5" 
                    />
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Text Color
                  </span>
                  
                  {showColorPopover && (
                    <>
                      {/* Click-away backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowColorPopover(false)} />
                      
                      {/* Premium Custom Color Popover with 2D saturation/brightness square canvas */}
                      <div className="absolute top-11 left-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[240px]">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-1.5">
                          <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Text Color</span>
                          <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full uppercase">#{hexInputValue}</span>
                        </div>
                        
                        {/* Saturation/Lightness Canvas */}
                        <div 
                          onMouseDown={handleColorSquareMouseDown}
                          className="relative w-full h-28 rounded-xl cursor-crosshair overflow-hidden border border-slate-200 select-none"
                          style={{
                            backgroundColor: `hsl(${hueValue}, 100%, 50%)`
                          }}
                        >
                          {/* White horizontal gradient */}
                          <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                          {/* Black vertical gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                          
                          {/* Selection indicator handle */}
                          <div 
                            className="absolute w-3.5 h-3.5 -ml-1.75 -mt-1.75 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] pointer-events-none"
                            style={{ 
                              left: `${hslToHsv(hexToHsl(textColor).h, hexToHsl(textColor).s, hexToHsl(textColor).l).s}%`, 
                              top: `${100 - hslToHsv(hexToHsl(textColor).h, hexToHsl(textColor).s, hexToHsl(textColor).l).v}%` 
                            }}
                          />
                        </div>

                        {/* Swatches */}
                        <div className="flex items-center gap-1.5 flex-wrap max-w-[220px]">
                          {[
                            { hex: '#0f172a', name: 'Charcoal' },
                            { hex: '#ef4444', name: 'Coral' },
                            { hex: '#f59e0b', name: 'Gold' },
                            { hex: '#10b981', name: 'Emerald' },
                            { hex: '#0284c7', name: 'Ocean' },
                            { hex: '#6366f1', name: 'Indigo' },
                            { hex: '#ec4899', name: 'Hot Pink' },
                          ].map((color) => {
                            const isSelected = textColor === color.hex;
                            return (
                              <button
                                key={color.hex}
                                onClick={() => {
                                  handleTextColorChange(color.hex);
                                  try {
                                    setHueValue(hexToHsl(color.hex).h);
                                  } catch (err) {}
                                }}
                                style={{ backgroundColor: color.hex }}
                                className={`w-6 h-6 rounded-full transition-transform active:scale-90 border flex items-center justify-center ${
                                  isSelected 
                                    ? 'scale-110 shadow-sm border-cyan-400 border-2' 
                                    : 'border-slate-200/50 hover:scale-105'
                                }`}
                                title={color.name}
                              />
                            );
                          })}
                        </div>

                        {/* Hue Slider */}
                        <div className="flex flex-col gap-1 mt-1">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Adjust Hue</span>
                          <input 
                            type="range" 
                            min="0" 
                            max="360" 
                            value={hueValue}
                            onChange={(e) => {
                              const hue = parseInt(e.target.value);
                              setHueValue(hue);
                              const currentHsl = hexToHsl(textColor);
                              const hex = hslToHex(hue, currentHsl.s, currentHsl.l);
                              handleTextColorChange(hex);
                            }}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer border border-slate-100 shadow-sm"
                            style={{
                              background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                            }}
                          />
                        </div>

                        {/* Hex Input only */}
                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 h-8">
                          <span className="text-slate-400 text-[10px] font-bold">HEX</span>
                          <input 
                            type="text" 
                            value={hexInputValue} 
                            onChange={(e) => {
                              const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                              setHexInputValue(val);
                              if (val.length === 3 || val.length === 6) {
                                handleTextColorChange(`#${val}`);
                                try {
                                  setHueValue(hexToHsl(`#${val}`).h);
                                } catch(e){}
                              }
                            }}
                            className="bg-transparent text-[11px] font-extrabold text-slate-800 focus:outline-none w-full uppercase"
                            placeholder="000000"
                            maxLength={6}
                          />
                          <div 
                            style={{ backgroundColor: textColor }} 
                            className="w-4 h-4 rounded-full border border-slate-200/50 shadow-sm flex-shrink-0" 
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Bold Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleBoldToggle}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-extrabold text-xs transition-all shadow-sm border ${
                      fontWeight === 'bold' 
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    B
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Bold
                  </span>
                </div>

                {/* Italic Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleItalicToggle}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-serif italic text-xs font-bold transition-all shadow-sm border ${
                      fontStyle === 'italic' 
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    I
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Italic
                  </span>
                </div>

                {/* Underline Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleUnderlineToggle}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center underline text-xs font-bold transition-all shadow-sm border ${
                      underline 
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    U
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Underline
                  </span>
                </div>

                {/* Linethrough Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleLinethroughToggle}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center line-through text-xs font-bold transition-all shadow-sm border ${
                      linethrough 
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    S
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Strikethrough
                  </span>
                </div>

                {/* Case Toggle Button (aA) */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleCaseToggle}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
                  >
                    aA
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Toggle Case
                  </span>
                </div>

                <div className="h-5 w-[1px] bg-slate-200/50" />

                {/* Alignment Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={() => {
                      const next = textAlign === 'center' ? 'left' : textAlign === 'left' ? 'right' : 'center';
                      handleAlignToggle(next);
                    }}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
                  >
                    {textAlign === 'center' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                      </svg>
                    ) : textAlign === 'left' ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h12m-12 5.25h16.5" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M7.5 12h12.75m-16.5 5.25h16.5" />
                      </svg>
                    )}
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Alignment: {textAlign}
                  </span>
                </div>

                {/* Bullet List Button */}
                <div className="relative group/tooltip">
                  <button
                    onClick={handleListToggle}
                    className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/40 border border-white/60 hover:bg-white/60 text-slate-700 transition-all shadow-sm"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    List Bullet
                  </span>
                </div>

                {/* Transparency / Opacity Button with popover */}
                <div className="relative group/tooltip">
                  <button 
                    onClick={() => {
                      setShowOpacityPopover(!showOpacityPopover);
                      setShowColorPopover(false);
                    }}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-sm border ${
                      showOpacityPopover 
                        ? 'bg-cyan-500/10 text-cyan-600 border-cyan-500/30' 
                        : 'bg-white/40 border-white/60 hover:bg-white/60 text-slate-700'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                    </svg>
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Transparency
                  </span>

                  {showOpacityPopover && (
                    <>
                      {/* Click-away backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowOpacityPopover(false)} />
                      
                      {/* Premium Transparency Popover */}
                      <div className="absolute top-11 right-0 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl p-4 shadow-xl z-50 flex flex-col gap-3 min-w-[220px]">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-slate-700 font-sans">Transparency</span>
                          <div className="bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center w-12 h-7 focus-within:border-cyan-500 transition-colors">
                            <input 
                              type="text"
                              value={opacityInput}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9]/g, '');
                                setOpacityInput(raw);
                                if (raw !== '') {
                                  const num = Math.min(100, parseInt(raw) || 0);
                                  handleOpacityChange(num / 100);
                                }
                              }}
                              onBlur={() => {
                                if (opacityInput === '') {
                                  setOpacityInput('0');
                                  handleOpacityChange(0);
                                } else {
                                  const num = Math.min(100, parseInt(opacityInput) || 0);
                                  setOpacityInput(String(num));
                                }
                              }}
                              className="w-full text-center bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none"
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <input 
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={opacity}
                            onChange={(e) => handleOpacityChange(parseFloat(e.target.value))}
                            className="w-full accent-cyan-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer border border-slate-200/40"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Professional Controls Group */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Undo / Redo Control Pill */}
            <div className="flex items-center gap-1.5 bg-white/40 border border-white/60 rounded-full px-2.5 py-1 shadow-sm h-9">
              <div className="relative group/tooltip">
                <button
                  onClick={handleUndo}
                  disabled={undoStackRef.current.length <= 1}
                  className="w-7 h-7 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  type="button"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                  Undo (Ctrl+Z)
                </span>
              </div>

              <div className="relative group/tooltip">
                <button
                  onClick={handleRedo}
                  disabled={redoStackRef.current.length === 0}
                  className="w-7 h-7 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                  type="button"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
                  </svg>
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                  Redo (Ctrl+Y)
                </span>
              </div>
            </div>

            {/* Professional Zoom Control Pill */}
            <div className="flex items-center gap-3 bg-white/40 border border-white/60 rounded-full px-4 py-1.5 shadow-sm">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 select-none">Zoom</span>
              <div className="flex items-center gap-2">
                <div className="relative group/tooltip">
                  <button 
                    onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                    className="w-6 h-6 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-white/40"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                    </svg>
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Zoom Out
                  </span>
                </div>

                <span className="text-xs font-extrabold text-slate-700 min-w-[36px] text-center select-none">
                  {Math.round(zoom * 100)}%
                </span>

                <div className="relative group/tooltip">
                  <button 
                    onClick={() => setZoom(Math.min(3.0, zoom + 0.1))}
                    className="w-6 h-6 rounded-full hover:bg-white/60 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors border border-white/40"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                    Zoom In
                  </span>
                </div>
              </div>
              <div className="h-3 w-[1px] bg-slate-200/50 mx-0.5" />
              <div className="relative group/tooltip">
                <button 
                  onClick={() => setZoom(1.0)}
                  className="text-[10px] font-extrabold text-cyan-600 uppercase tracking-wider hover:text-cyan-700 transition-colors"
                >
                  Reset
                </button>
                <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2.5 px-2.5 py-1 bg-slate-800 text-[10px] text-white font-extrabold rounded-lg shadow-md opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 whitespace-nowrap uppercase tracking-wider z-50">
                  Reset Zoom
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Zoomable Wrapper containing the Print Area Paper */}
        <div className="flex-1 flex items-center justify-center py-12 flex-shrink-0 my-auto">
          <div className="relative flex items-center justify-center flex-shrink-0">
            {/* Fabric.js Canvas Wrapper sized dynamically according to selected product and zoom */}
            <div 
              style={{ 
                width: `${currentProduct.printWidth * zoom}px`, 
                height: `${currentProduct.printHeight * zoom}px`,
                backgroundColor: '#ffffff'
              }}
              className="relative z-10 border border-dashed border-cyan-400/50 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.06)] flex items-center justify-center bg-white"
            >
              {/* Canvas layout element */}
              <div 
                style={{ 
                  width: `${currentProduct.printWidth * zoom}px`, 
                  height: `${currentProduct.printHeight * zoom}px` 
                }}
                className="relative overflow-hidden rounded-xl"
              >
                <canvas ref={canvasRef} />
              </div>

              {/* Floating Quick Action Toolbar (Lock, Duplicate, Delete) - hidden during rotation */}
              {activeObject && coords && !isRotating && (
                <div 
                  style={{
                    position: 'absolute',
                    top: `${coords.top * zoom - 64}px`,
                    left: `${(coords.left + coords.width / 2) * zoom}px`,
                    transform: 'translateX(-50%)',
                  }}
                  className="z-30 flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-slate-200 text-slate-700 rounded-full px-2.5 py-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] whitespace-nowrap select-none"
                >
                  {/* Lock / Unlock Button */}
                  <button
                    onClick={handleToggleLock}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                      isLocked 
                        ? 'bg-cyan-50 border border-cyan-200 text-cyan-600 font-extrabold' 
                        : 'hover:bg-slate-100 text-slate-500 hover:text-slate-800'
                    }`}
                    title={isLocked ? "Unlock Object" : "Lock Object"}
                    type="button"
                  >
                    {isLocked ? (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                    )}
                  </button>

                  <div className="w-[1px] h-3 bg-slate-200/80" />

                  {/* Copy / Duplicate Button */}
                  <button
                    onClick={handleDuplicate}
                    disabled={isLocked}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-slate-100 text-slate-500 hover:text-slate-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Duplicate"
                    type="button"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 4H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2v-2" />
                      <rect x="9" y="4" width="11" height="11" rx="2" ry="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.5h5m-2.5-2.5v5" />
                    </svg>
                  </button>

                  <div className="w-[1px] h-3 bg-slate-200/80" />

                  {/* Delete Button */}
                  <button
                    onClick={handleDelete}
                    disabled={isLocked}
                    className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-red-50 text-red-500 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    title="Delete"
                    type="button"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                  </button>
                </div>
              )}

              {/* Floating Rotation Angle Tooltip - matches theme, non-black */}
              {isRotating && rotationAngle !== null && coords && (
                <div 
                  style={{
                    position: 'absolute',
                    top: `${(coords.top + coords.height) * zoom + 24}px`,
                    left: `${(coords.left + coords.width / 2) * zoom}px`,
                    transform: 'translateX(-50%)',
                  }}
                  className="z-30 px-2 py-1 bg-cyan-600 text-white text-[11px] font-extrabold rounded shadow-md pointer-events-none select-none border border-cyan-500"
                >
                  {rotationAngle}°
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* 3. Bottom Toolbar & 4. Pinned Next Button */}
      <footer className="w-full bg-white/90 backdrop-blur-xl border-t border-slate-100 px-8 py-3.5 flex items-center justify-between relative shadow-[0_-8px_30px_rgba(0,0,0,0.02)] z-40">
        {/* Equal-width toolbar buttons row */}
        <div className="flex-1 flex justify-center items-center gap-6 md:gap-12">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            const isProduct = tab.id === 'Product';
            const isText = tab.id === 'Text';
            const isHighlighted = isActive || (isProduct && showProductPanel) || (isText && showTextPanel);
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1.5 py-2 px-6 rounded-2xl transition-all duration-300 relative ${
                  isHighlighted
                    ? 'bg-slate-100/90 text-cyan-600 scale-105 font-bold shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]' 
                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 hover:scale-102'
                }`}
              >
                <div className={`transition-transform duration-300 ${isHighlighted ? 'translate-y-[-1px]' : ''}`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-widest select-none transition-colors ${isHighlighted ? 'text-slate-800' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
                {isHighlighted && (
                  <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-cyan-500" />
                )}
              </button>
            );
          })}
        </div>

        {/* Pinned Preview / Next Button */}
        <div className="flex-none pl-4">
          <button className="px-8 py-3.5 bg-gradient-to-r from-slate-900 to-slate-800 hover:from-cyan-600 hover:to-cyan-500 text-white rounded-full text-xs font-black shadow-md hover:shadow-cyan-100/50 hover:-translate-y-0.5 transition-all duration-300 uppercase tracking-widest active:translate-y-0 active:scale-95 cursor-pointer">
            Preview Design
          </button>
        </div>
      </footer>

      {/* Garment Catalog Slide-Up Panel */}
      <AnimatePresence>
        {showProductPanel && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowProductPanel(false)}
              className="absolute inset-0 bg-slate-900/10 z-20"
            />
            {/* Slide-up Panel (floating pop-up design positioned above the footer) */}
            <motion.div
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "120%", opacity: 0 }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="absolute bottom-20 left-4 right-4 bg-white border border-slate-200/80 rounded-2xl z-30 p-6 shadow-[0_15px_50px_rgba(0,0,0,0.1)] flex flex-col gap-4 max-w-lg mx-auto"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <div className="flex flex-col">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Garment Catalog</h4>
                  <p className="text-[10px] text-slate-400 font-medium">Select a premium custom print size ratio</p>
                </div>
                <button 
                  onClick={() => setShowProductPanel(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
              
              {/* Vertical clean select list (no icons) */}
              <div className="flex flex-col gap-2">
                {products.map((prod) => {
                  const isSelected = currentProduct.id === prod.id;
                  return (
                    <button
                      key={prod.id}
                      onClick={() => {
                        setCurrentProduct(prod);
                        setShowProductPanel(false);
                      }}
                      className={`w-full flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        isSelected 
                          ? 'border-cyan-500 bg-cyan-50/20 shadow-sm' 
                          : 'border-slate-100 bg-slate-50/30 hover:bg-slate-50 hover:border-slate-200'
                      }`}
                    >
                      <div className="text-left">
                        <p className="text-xs font-extrabold text-slate-800">{prod.label}</p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">Ratio: {prod.printWidth} x {prod.printHeight} px</p>
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-cyan-600' : 'text-slate-500'}`}>
                        {prod.price}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Text Settings Slide-Up Panel */}
      <AnimatePresence>
        {showTextPanel && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTextPanel(false)}
              className="absolute inset-0 bg-slate-950/20 backdrop-blur-sm z-20"
            />
            {/* Glassmorphic Slide-up Panel */}
            <motion.div
              initial={{ y: "120%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "120%", opacity: 0 }}
              transition={{ type: "tween", ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
              className="absolute bottom-20 left-4 right-4 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl z-30 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06)] flex flex-col gap-5 max-w-lg mx-auto"
            >
              {/* Panel Header */}
              <div className="flex items-center justify-between border-b border-white/40 pb-3">
                <div className="flex flex-col">
                  <h4 className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Add Custom Text</h4>
                  <p className="text-[10px] text-slate-400 font-semibold">Customize your typography and style</p>
                </div>
                <button 
                  onClick={() => setShowTextPanel(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
              
              {/* Text Input Field */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Your Message</label>
                <input 
                  type="text"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  className="w-full px-4 py-3 bg-white/40 border border-white/60 focus:border-cyan-500 focus:bg-white/80 rounded-2xl text-sm font-semibold text-slate-800 focus:outline-none transition-all shadow-sm focus:shadow-md"
                  placeholder="Enter text..."
                />
              </div>

              {/* Grid for Font family & Font size */}
              <div className="grid grid-cols-2 gap-4">
                {/* Font Family Dropdown */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Font Style</label>
                  <button 
                    onClick={() => setShowBottomFontDropdown(!showBottomFontDropdown)}
                    type="button"
                    className="w-full px-4 py-3 bg-white/40 border border-white/60 rounded-2xl text-xs font-bold text-slate-700 focus:outline-none transition-all cursor-pointer shadow-sm hover:border-slate-300 flex items-center justify-between gap-2 h-11"
                  >
                    <span style={{ fontFamily: fontFamily }}>{currentFontObj.label}</span>
                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                  </button>

                  {showBottomFontDropdown && (
                    <>
                      {/* Click-away backdrop */}
                      <div className="fixed inset-0 z-40" onClick={() => setShowBottomFontDropdown(false)} />
                      
                      {/* Dropdown Menu */}
                      <div className="absolute top-12 left-0 w-full bg-white border border-slate-200/80 rounded-2xl py-2 shadow-xl z-50 flex flex-col max-h-[200px] overflow-y-auto scrollbar-thin">
                        {PREMIUM_FONTS.map((font) => (
                          <button
                            key={font.value}
                            onClick={() => {
                              setFontFamily(font.value);
                              setShowBottomFontDropdown(false);
                            }}
                            type="button"
                            style={font.style}
                            className={`px-4 py-2.5 text-left text-xs font-bold transition-colors ${
                              fontFamily === font.value 
                                ? 'bg-cyan-500/10 text-cyan-600' 
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {font.label}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Font Size Input + Adjusters */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Font Size</label>
                  <div className="flex items-center border border-white/60 rounded-2xl overflow-hidden bg-white/40 h-11 shadow-sm focus-within:border-cyan-500 focus-within:bg-white/80 focus-within:shadow-md transition-all">
                    <button
                      onClick={() => setFontSize(Math.max(12, fontSize - 1))}
                      className="px-3.5 h-full hover:bg-white/50 text-slate-600 font-extrabold transition-colors border-r border-white/40"
                      type="button"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      value={fontSize}
                      onChange={(e) => setFontSize(Math.max(1, parseInt(e.target.value) || 12))}
                      className="w-full text-center bg-transparent text-sm font-extrabold text-slate-800 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      onClick={() => setFontSize(fontSize + 1)}
                      className="px-3.5 h-full hover:bg-white/50 text-slate-600 font-extrabold transition-colors border-l border-white/40"
                      type="button"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Color Selection & Hue Picker Row */}
              <div className="flex flex-col gap-3.5 border-t border-slate-100/50 pt-3.5">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Text Color</label>
                  <span className="text-[10px] font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-full uppercase">#{hexInputValue}</span>
                </div>

                {/* Saturation/Lightness Canvas */}
                <div 
                  onMouseDown={handleColorSquareMouseDown}
                  className="relative w-full h-28 rounded-xl cursor-crosshair overflow-hidden border border-slate-200 select-none"
                  style={{
                    backgroundColor: `hsl(${hueValue}, 100%, 50%)`
                  }}
                >
                  {/* White horizontal gradient */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white to-transparent" />
                  {/* Black vertical gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  
                  {/* Selection indicator handle */}
                  <div 
                    className="absolute w-3.5 h-3.5 -ml-1.75 -mt-1.75 rounded-full border-2 border-white shadow-[0_1px_4px_rgba(0,0,0,0.4)] pointer-events-none"
                    style={{ 
                      left: `${hslToHsv(hexToHsl(textColor).h, hexToHsl(textColor).s, hexToHsl(textColor).l).s}%`, 
                      top: `${100 - hslToHsv(hexToHsl(textColor).h, hexToHsl(textColor).s, hexToHsl(textColor).l).v}%` 
                    }}
                  />
                </div>
                
                {/* Standard Swatches */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { hex: '#0f172a', name: 'Charcoal' },
                    { hex: '#ef4444', name: 'Coral' },
                    { hex: '#f59e0b', name: 'Gold' },
                    { hex: '#10b981', name: 'Emerald' },
                    { hex: '#0284c7', name: 'Ocean' },
                    { hex: '#6366f1', name: 'Indigo' },
                    { hex: '#ec4899', name: 'Hot Pink' },
                  ].map((color) => {
                    const isSelected = textColor === color.hex;
                    return (
                      <button
                        key={color.hex}
                        onClick={() => {
                          setTextColor(color.hex);
                          try {
                            setHueValue(hexToHsl(color.hex).h);
                          } catch (err) {}
                        }}
                        style={{ backgroundColor: color.hex }}
                        className={`w-7 h-7 rounded-full transition-all border flex items-center justify-center relative ${
                          isSelected 
                            ? 'scale-110 shadow-sm border-cyan-400 border-2' 
                            : 'border-slate-200/50 hover:scale-105'
                        }`}
                        title={color.name}
                      >
                        {isSelected && (
                          <div className={`w-1.5 h-1.5 rounded-full ${color.hex === '#ffffff' ? 'bg-slate-950' : 'bg-white'}`} />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hue Slider (Canva style rainbow track) */}
                <div className="flex flex-col gap-1.5 mt-1">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider font-sans">Adjust Hue</span>
                  <div className="relative flex items-center h-4">
                    <input 
                      type="range" 
                      min="0" 
                      max="360" 
                      value={hueValue}
                      onChange={(e) => {
                        const hue = parseInt(e.target.value);
                        setHueValue(hue);
                        const currentHsl = hexToHsl(textColor);
                        const hex = hslToHex(hue, currentHsl.s, currentHsl.l);
                        setTextColor(hex);
                      }}
                      className="w-full h-2 rounded-full appearance-none cursor-pointer border border-slate-100 shadow-sm"
                      style={{
                        background: 'linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)'
                      }}
                    />
                  </div>
                </div>

                {/* HEX Input Only (Editable, no RGB/HSL) */}
                <div className="flex items-center gap-3.5 bg-white/40 border border-white/60 focus-within:border-cyan-500 focus-within:bg-white/80 rounded-2xl px-4 py-2.5 h-11 transition-all shadow-sm focus-within:shadow-md">
                  <span className="text-slate-400 text-xs font-bold">HEX</span>
                  <input 
                    type="text" 
                    value={hexInputValue} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9A-Fa-f]/g, '');
                      setHexInputValue(val);
                      if (val.length === 3 || val.length === 6) {
                        setTextColor(`#${val}`);
                        try {
                          setHueValue(hexToHsl(`#${val}`).h);
                        } catch(err){}
                      }
                    }}
                    className="bg-transparent text-xs font-extrabold text-slate-800 focus:outline-none w-full uppercase"
                    placeholder="000000"
                    maxLength={6}
                  />
                  <div 
                    style={{ backgroundColor: textColor }} 
                    className="w-5 h-5 rounded-full border border-slate-200/50 shadow-sm flex-shrink-0" 
                  />
                </div>
              </div>

              {/* Add Text CTA Button */}
              <button
                onClick={handleAddText}
                className="w-full py-4 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white rounded-2xl text-xs font-extrabold uppercase tracking-wider shadow-[0_4px_20px_rgba(6,182,212,0.15)] hover:shadow-[0_4px_25px_rgba(6,182,212,0.25)] transition-all active:scale-98 mt-2"
              >
                Add Text to Canvas
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
