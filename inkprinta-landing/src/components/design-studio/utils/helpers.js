export { hsvToHsl, hslToHsv, hslToHex, hexToHsl } from './calculations.js';
export { PREMIUM_FONTS, PRODUCTS, COLOR_SWATCHES, ZOOM_MIN, ZOOM_MAX, SNAP_THRESHOLD } from './constants.js';

export const styleTextboxControls = (textObj) => {
  textObj.transparentCorners = false;
  textObj.cornerColor = '#ffffff';
  textObj.cornerStrokeColor = '#06b6d4';
  textObj.cornerSize = 8;
  textObj.cornerStyle = 'circle';
  textObj.borderColor = '#06b6d4';
  textObj.borderScaleFactor = 1.5;
  textObj.padding = 10;

  const drawPillControl = (ctx, left, top, _styleOverride, _fabricObject, control) => {
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
    ['ml', 'mr', 'mt', 'mb'].forEach((name) => {
      if (textObj.controls[name]) {
        const ctrl = textObj.controls[name];
        ctrl.name = name;
        ctrl.draw = (ctx, left, top, styleOverride, fabricObject) => {
          drawPillControl(ctx, left, top, styleOverride, fabricObject, ctrl);
        };
      }
    });

    if (textObj.controls.mtr) {
      const mtr = textObj.controls.mtr;
      mtr.y = 0.5;
      mtr.offsetY = 40;
      mtr.draw = (ctx, left, top) => {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.5;
        ctx.moveTo(left, top - 6);
        ctx.lineTo(left, top - 40);
        ctx.stroke();

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

export const drawSnapGuides = (ctx, currentProduct, currentZoom, showVertical, showHorizontal) => {
  ctx.save();
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([6, 4]);

  if (showVertical) {
    const x = (currentProduct.printWidth / 2) * currentZoom;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, currentProduct.printHeight * currentZoom);
    ctx.stroke();
  }

  if (showHorizontal) {
    const y = (currentProduct.printHeight / 2) * currentZoom;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(currentProduct.printWidth * currentZoom, y);
    ctx.stroke();
  }

  ctx.restore();
};

export const initializeImageObject = (imgObj) => {
  styleTextboxControls(imgObj);
  
  if (!imgObj._originalRender) {
    imgObj._originalRender = imgObj._render;
  }
  
  imgObj._render = function(ctx) {
    const rx = this.rx || 0;
    const ry = this.ry || 0;
    const w = this.width;
    const h = this.height;
    const x = -w / 2;
    const y = -h / 2;

    ctx.save();
    if (rx > 0 || ry > 0) {
      ctx.beginPath();
      ctx.moveTo(x + rx, y);
      ctx.lineTo(x + w - rx, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + ry);
      ctx.lineTo(x + w, y + h - ry);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
      ctx.lineTo(x + rx, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - ry);
      ctx.lineTo(x, y + ry);
      ctx.quadraticCurveTo(x, y, x + rx, y);
      ctx.closePath();
      ctx.clip();
    }
    
    // Draw the image content without rectangular stroke
    const tempStroke = this.stroke;
    this.stroke = null;
    this._originalRender(ctx);
    this.stroke = tempStroke;
    
    ctx.restore();

    // Draw the rounded stroke on top (unclipped)
    if (this.stroke && this.strokeWidth > 0) {
      ctx.save();
      ctx.strokeStyle = this.stroke;
      ctx.lineWidth = this.strokeWidth;
      if (this.strokeDashArray) {
        ctx.setLineDash(this.strokeDashArray);
      }
      
      ctx.beginPath();
      ctx.moveTo(x + rx, y);
      ctx.lineTo(x + w - rx, y);
      ctx.quadraticCurveTo(x + w, y, x + w, y + ry);
      ctx.lineTo(x + w, y + h - ry);
      ctx.quadraticCurveTo(x + w, y + h, x + w - rx, y + h);
      ctx.lineTo(x + rx, y + h);
      ctx.quadraticCurveTo(x, y + h, x, y + h - ry);
      ctx.lineTo(x, y + ry);
      ctx.quadraticCurveTo(x, y, x + rx, y);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    }
  };
};
