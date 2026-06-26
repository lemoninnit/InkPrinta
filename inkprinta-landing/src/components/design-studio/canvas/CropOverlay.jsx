import React, { useState, useEffect, useRef } from 'react';

export default function CropOverlay({ imageTools, zoom }) {
  const { croppingImage } = imageTools;

  if (!croppingImage) return null;

  const imgEl = croppingImage.getElement();
  const originalWidth = imgEl ? (imgEl.naturalWidth || imgEl.width) : 100;
  const originalHeight = imgEl ? (imgEl.naturalHeight || imgEl.height) : 100;

  // Calculate uncropped dimensions and position in screen pixels (zoomed)
  const scaleX = croppingImage.scaleX;
  const scaleY = croppingImage.scaleY;

  const uncroppedLeft = (croppingImage.left - (croppingImage.width / 2 + croppingImage.cropX) * scaleX) * zoom;
  const uncroppedTop = (croppingImage.top - (croppingImage.height / 2 + croppingImage.cropY) * scaleY) * zoom;
  const uncroppedWidth = originalWidth * scaleX * zoom;
  const uncroppedHeight = originalHeight * scaleY * zoom;

  // State for the crop box relative to uncroppedWidth/uncroppedHeight (in pixels)
  const [boxX, setBoxX] = useState(() => {
    if (uncroppedWidth <= 0) return 0;
    return (croppingImage.cropX / originalWidth) * uncroppedWidth;
  });
  const [boxY, setBoxY] = useState(() => {
    if (uncroppedHeight <= 0) return 0;
    return (croppingImage.cropY / originalHeight) * uncroppedHeight;
  });
  const [boxW, setBoxW] = useState(() => {
    if (uncroppedWidth <= 0) return 100;
    return (croppingImage.width / originalWidth) * uncroppedWidth;
  });
  const [boxH, setBoxH] = useState(() => {
    if (uncroppedHeight <= 0) return 100;
    return (croppingImage.height / originalHeight) * uncroppedHeight;
  });

  const bgCanvasRef = useRef(null);
  const fgCanvasRef = useRef(null);

  // Initialize crop box to current crop region when dimensions change
  useEffect(() => {
    if (uncroppedWidth <= 0 || uncroppedHeight <= 0) return;
    const initX = (croppingImage.cropX / originalWidth) * uncroppedWidth;
    const initY = (croppingImage.cropY / originalHeight) * uncroppedHeight;
    const initW = (croppingImage.width / originalWidth) * uncroppedWidth;
    const initH = (croppingImage.height / originalHeight) * uncroppedHeight;

    setBoxX(initX);
    setBoxY(initY);
    setBoxW(initW);
    setBoxH(initH);
  }, [croppingImage, uncroppedWidth, uncroppedHeight, originalWidth, originalHeight]);

  // Sync box position/dimensions back to the parent hook
  useEffect(() => {
    if (imageTools.cropBoxRef) {
      imageTools.cropBoxRef.current = { x: boxX, y: boxY, w: boxW, h: boxH };
    }
  }, [boxX, boxY, boxW, boxH, imageTools.cropBoxRef]);

  // Draw background image
  useEffect(() => {
    if (bgCanvasRef.current && imgEl && uncroppedWidth > 0 && uncroppedHeight > 0) {
      const ctx = bgCanvasRef.current.getContext('2d');
      bgCanvasRef.current.width = uncroppedWidth;
      bgCanvasRef.current.height = uncroppedHeight;
      ctx.clearRect(0, 0, uncroppedWidth, uncroppedHeight);
      ctx.drawImage(imgEl, 0, 0, uncroppedWidth, uncroppedHeight);
    }
  }, [imgEl, uncroppedWidth, uncroppedHeight]);

  // Draw foreground image
  useEffect(() => {
    if (fgCanvasRef.current && imgEl && uncroppedWidth > 0 && uncroppedHeight > 0) {
      const ctx = fgCanvasRef.current.getContext('2d');
      fgCanvasRef.current.width = uncroppedWidth;
      fgCanvasRef.current.height = uncroppedHeight;
      ctx.clearRect(0, 0, uncroppedWidth, uncroppedHeight);
      ctx.drawImage(imgEl, 0, 0, uncroppedWidth, uncroppedHeight);
    }
  }, [imgEl, uncroppedWidth, uncroppedHeight]);

  // Drag and resize tracking refs
  const dragInfo = useRef({
    activeHandle: null,
    startX: 0,
    startY: 0,
    startBoxX: 0,
    startBoxY: 0,
    startBoxW: 0,
    startBoxH: 0
  });

  const getTargetRatio = (ratioId) => {
    if (ratioId === 'original') return originalWidth / originalHeight;
    if (ratioId === '1:1') return 1.0;
    if (ratioId === '4:3') return 4 / 3;
    if (ratioId === '16:9') return 16 / 9;
    return null;
  };

  // Reactively resize the crop box when aspect ratio changes
  useEffect(() => {
    if (uncroppedWidth <= 0 || uncroppedHeight <= 0) return;
    const targetRatio = getTargetRatio(imageTools.aspectRatio);
    if (!targetRatio) return;

    let newW = boxW;
    let newH = boxW / targetRatio;

    if (newH > uncroppedHeight) {
      newH = uncroppedHeight;
      newW = uncroppedHeight * targetRatio;
    }
    if (newW > uncroppedWidth) {
      newW = uncroppedWidth;
      newH = newW / targetRatio;
    }

    const newX = Math.max(0, Math.min(uncroppedWidth - newW, boxX + (boxW - newW) / 2));
    const newY = Math.max(0, Math.min(uncroppedHeight - newH, boxY + (boxH - newH) / 2));

    setBoxX(newX);
    setBoxY(newY);
    setBoxW(newW);
    setBoxH(newH);
  }, [imageTools.aspectRatio, uncroppedWidth, uncroppedHeight]);

  const handlePointerDown = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();

    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);

    dragInfo.current = {
      activeHandle: handle,
      startX: clientX,
      startY: clientY,
      startBoxX: boxX,
      startBoxY: boxY,
      startBoxW: boxW,
      startBoxH: boxH,
      ratio: imageTools.aspectRatio,
      uncroppedWidth: uncroppedWidth,
      uncroppedHeight: uncroppedHeight
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handlePointerMove = (e) => {
    const { 
      activeHandle, 
      startX, 
      startY, 
      startBoxX, 
      startBoxY, 
      startBoxW, 
      startBoxH,
      ratio: dragRatio,
      uncroppedWidth: dragUWidth,
      uncroppedHeight: dragUHeight
    } = dragInfo.current;
    if (!activeHandle) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    const dx = clientX - startX;
    const dy = clientY - startY;

    let nextX = startBoxX;
    let nextY = startBoxY;
    let nextW = startBoxW;
    let nextH = startBoxH;

    const targetRatio = getTargetRatio(dragRatio);

    if (activeHandle === 'move') {
      nextX = Math.max(0, Math.min(dragUWidth - startBoxW, startBoxX + dx));
      nextY = Math.max(0, Math.min(dragUHeight - startBoxH, startBoxY + dy));
    } else {
      // Resize logic
      const isTop = activeHandle.includes('top');
      const isBottom = activeHandle.includes('bottom');
      const isLeft = activeHandle.includes('left');
      const isRight = activeHandle.includes('right');

      // 1. Calculate freeform coordinates
      if (isRight) {
        nextW = Math.max(20, Math.min(dragUWidth - startBoxX, startBoxW + dx));
      }
      if (isLeft) {
        const potentialW = startBoxW - dx;
        if (potentialW >= 20) {
          const maxShift = startBoxX + startBoxW - 20;
          nextX = Math.max(0, Math.min(maxShift, startBoxX + dx));
          nextW = startBoxX + startBoxW - nextX;
        }
      }
      if (isBottom) {
        nextH = Math.max(20, Math.min(dragUHeight - startBoxY, startBoxH + dy));
      }
      if (isTop) {
        const potentialH = startBoxH - dy;
        if (potentialH >= 20) {
          const maxShift = startBoxY + startBoxH - 20;
          nextY = Math.max(0, Math.min(maxShift, startBoxY + dy));
          nextH = startBoxY + startBoxH - nextY;
        }
      }

      // 2. Adjust if ratio is locked
      if (targetRatio) {
        if (activeHandle === 'top-left') {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const sign = dx + dy > 0 ? 1 : -1;
          const delta = dist * sign;
          
          nextW = startBoxW - delta;
          nextH = nextW / targetRatio;
          if (nextW < 20 || nextH < 20) {
            nextW = Math.max(20, startBoxW);
            nextH = nextW / targetRatio;
          }
          nextX = startBoxX + startBoxW - nextW;
          nextY = startBoxY + startBoxH - nextH;

          if (nextX < 0 || nextY < 0) {
            const limitX = nextX < 0 ? startBoxX + startBoxW : dragUWidth;
            const limitY = nextY < 0 ? startBoxY + startBoxH : dragUHeight;
            nextW = Math.min(limitX, limitY * targetRatio);
            nextH = nextW / targetRatio;
            nextX = startBoxX + startBoxW - nextW;
            nextY = startBoxY + startBoxH - nextH;
          }
        } else if (activeHandle === 'top-right') {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const sign = dx - dy > 0 ? 1 : -1;
          const delta = dist * sign;

          nextW = startBoxW + delta;
          nextH = nextW / targetRatio;
          if (nextW < 20 || nextH < 20) {
            nextW = Math.max(20, startBoxW);
            nextH = nextW / targetRatio;
          }
          nextY = startBoxY + startBoxH - nextH;

          if (nextX + nextW > dragUWidth || nextY < 0) {
            const limitX = dragUWidth - startBoxX;
            const limitY = startBoxY + startBoxH;
            nextW = Math.min(limitX, limitY * targetRatio);
            nextH = nextW / targetRatio;
            nextY = startBoxY + startBoxH - nextH;
          }
        } else if (activeHandle === 'bottom-left') {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const sign = -dx + dy > 0 ? 1 : -1;
          const delta = dist * sign;

          nextW = startBoxW + delta;
          nextH = nextW / targetRatio;
          if (nextW < 20 || nextH < 20) {
            nextW = Math.max(20, startBoxW);
            nextH = nextW / targetRatio;
          }
          nextX = startBoxX + startBoxW - nextW;

          if (nextX < 0 || nextY + nextH > dragUHeight) {
            const limitX = startBoxX + startBoxW;
            const limitY = dragUHeight - startBoxY;
            nextW = Math.min(limitX, limitY * targetRatio);
            nextH = nextW / targetRatio;
            nextX = startBoxX + startBoxW - nextW;
          }
        } else if (activeHandle === 'bottom-right') {
          const dist = Math.max(Math.abs(dx), Math.abs(dy));
          const sign = dx + dy > 0 ? 1 : -1;
          const delta = dist * sign;

          nextW = startBoxW + delta;
          nextH = nextW / targetRatio;
          if (nextW < 20 || nextH < 20) {
            nextW = Math.max(20, startBoxW);
            nextH = nextW / targetRatio;
          }

          if (nextX + nextW > dragUWidth || nextY + nextH > dragUHeight) {
            const limitX = dragUWidth - startBoxX;
            const limitY = dragUHeight - startBoxY;
            nextW = Math.min(limitX, limitY * targetRatio);
            nextH = nextW / targetRatio;
          }
        } else {
          if (isLeft || isRight) {
            nextH = nextW / targetRatio;
            if (nextY + nextH > dragUHeight) {
              nextH = dragUHeight - nextY;
              nextW = nextH * targetRatio;
              if (isLeft) nextX = startBoxX + startBoxW - nextW;
            }
          } else if (isTop || isBottom) {
            nextW = nextH * targetRatio;
            if (nextX + nextW > dragUWidth) {
              nextW = dragUWidth - nextX;
              nextH = nextW / targetRatio;
              if (isTop) nextY = startBoxY + startBoxH - nextH;
            }
          }
        }
      }
    }

    setBoxX(nextX);
    setBoxY(nextY);
    setBoxW(nextW);
    setBoxH(nextH);
  };

  const handlePointerUp = () => {
    dragInfo.current.activeHandle = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  };

  // Clean up global listeners if unmounted mid-drag
  useEffect(() => {
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-40 bg-transparent pointer-events-auto">
      {/* 1. Full Image Container with Dimmed background */}
      <div
        style={{
          position: 'absolute',
          left: `${uncroppedLeft}px`,
          top: `${uncroppedTop}px`,
          width: `${uncroppedWidth}px`,
          height: `${uncroppedHeight}px`,
        }}
        className="shadow-2xl border border-white/10"
      >
        {/* Dimmed Background canvas drawing */}
        <canvas
          ref={bgCanvasRef}
          className="absolute inset-0 w-full h-full opacity-30 select-none pointer-events-none"
        />

        {/* 2. Crop Window (hollow mask cutout) */}
        <div
          className="absolute inset-0 bg-slate-950/45 pointer-events-none"
          style={{
            clipPath: `polygon(
              0% 0%, 100% 0%, 100% 100%, 0% 100%, 
              0% 0%, 
              ${boxX}px ${boxY}px, 
              ${boxX}px ${boxY + boxH}px, 
              ${boxX + boxW}px ${boxY + boxH}px, 
              ${boxX + boxW}px ${boxY}px, 
              ${boxX}px ${boxY}px
            )`
          }}
        />

        {/* 3. Crop Area: Draggable & Resizable with Full Opacity Image inside */}
        <div
          style={{
            position: 'absolute',
            left: `${boxX}px`,
            top: `${boxY}px`,
            width: `${boxW}px`,
            height: `${boxH}px`,
          }}
          className="cursor-move group/cropbox"
          onPointerDown={(e) => handlePointerDown(e, 'move')}
        >
          {/* Unclipped bright image cutout */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none border-[1.5px] border-white/90 shadow-[0_0_0_1.5px_rgba(0,0,0,0.5)]">
            <canvas
              ref={fgCanvasRef}
              style={{
                position: 'absolute',
                left: `${-boxX}px`,
                top: `${-boxY}px`,
                width: `${uncroppedWidth}px`,
                height: `${uncroppedHeight}px`,
                maxWidth: 'none',
                maxHeight: 'none'
              }}
              className="select-none pointer-events-none"
            />

            {/* Rule-of-thirds grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-0 pointer-events-none">
              <div className="w-full h-[1px] bg-white/40 mt-[33.33%]" />
              <div className="w-full h-[1px] bg-white/40 mb-[33.33%]" />
            </div>
            <div className="absolute inset-0 flex justify-between p-0 pointer-events-none">
              <div className="h-full w-[1px] bg-white/40 ml-[33.33%]" />
              <div className="h-full w-[1px] bg-white/40 mr-[33.33%]" />
            </div>
          </div>

          {/* Resize Handles */}
          {/* Corners */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'top-left')}
            className="absolute -top-1.5 -left-1.5 w-4 h-4 cursor-nwse-resize z-50 flex items-start justify-start"
          >
            <div className="w-3.5 h-3.5 border-t-[3.5px] border-l-[3.5px] border-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'top-right')}
            className="absolute -top-1.5 -right-1.5 w-4 h-4 cursor-nesw-resize z-50 flex items-start justify-end"
          >
            <div className="w-3.5 h-3.5 border-t-[3.5px] border-r-[3.5px] border-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'bottom-left')}
            className="absolute -bottom-1.5 -left-1.5 w-4 h-4 cursor-nesw-resize z-50 flex items-end justify-start"
          >
            <div className="w-3.5 h-3.5 border-b-[3.5px] border-l-[3.5px] border-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'bottom-right')}
            className="absolute -bottom-1.5 -right-1.5 w-4 h-4 cursor-nwse-resize z-50 flex items-end justify-end"
          >
            <div className="w-3.5 h-3.5 border-b-[3.5px] border-r-[3.5px] border-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>

          {/* Edges */}
          <div
            onPointerDown={(e) => handlePointerDown(e, 'top')}
            className="absolute top-0 left-4 right-4 h-1.5 cursor-ns-resize z-40 flex justify-center"
          >
            <div className="w-8 h-[3.5px] bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'bottom')}
            className="absolute bottom-0 left-4 right-4 h-1.5 cursor-ns-resize z-40 flex justify-center"
          >
            <div className="w-8 h-[3.5px] bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'left')}
            className="absolute top-4 bottom-4 left-0 w-1.5 cursor-ew-resize z-40 flex items-center"
          >
            <div className="h-8 w-[3.5px] bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div
            onPointerDown={(e) => handlePointerDown(e, 'right')}
            className="absolute top-4 bottom-4 right-0 w-1.5 cursor-ew-resize z-40 flex items-center"
          >
            <div className="h-8 w-[3.5px] bg-white rounded-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />
          </div>
        </div>
      </div>
    </div>
  );
}
