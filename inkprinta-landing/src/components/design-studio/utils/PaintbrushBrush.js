import { Path } from 'fabric';

export class PaintbrushBrush {
  constructor(canvas) {
    this.canvas = canvas;
    this.points = [];
    this.color = '#000000';
    this.width = 15;
    this.opacity = 1.0;
    this.lastSmoothSpeed = 0;
  }

  onMouseDown(pointer, options) {
    this.points = [
      {
        x: pointer.x,
        y: pointer.y,
        time: Date.now(),
        width: this.width * 0.2 // start thin
      }
    ];
    this.lastSmoothSpeed = 0.5;
    this.canvas.clearContext(this.canvas.contextTop);
  }

  onMouseMove(pointer, options) {
    if (this.points.length === 0) return;
    const lastPoint = this.points[this.points.length - 1];

    const dist = Math.hypot(pointer.x - lastPoint.x, pointer.y - lastPoint.y);
    if (dist < 1.5) return; // avoid duplicate points

    const now = Date.now();
    const timeDiff = Math.max(1, now - lastPoint.time);
    const speed = dist / timeDiff; // pixels per ms

    // Exponential smoothing for speed
    const alpha = 0.2;
    this.lastSmoothSpeed = alpha * speed + (1 - alpha) * this.lastSmoothSpeed;

    // Map speed to width (faster = thinner, slower = thicker)
    const minRatio = 0.15; // 15% of selected width
    const maxRatio = 1.0;  // 100% of selected width
    const speedFactor = 1.8;
    const targetWidth = this.width * (minRatio + (maxRatio - minRatio) * Math.exp(-this.lastSmoothSpeed * speedFactor));

    // Smooth width change
    const smoothWidth = 0.15 * targetWidth + 0.85 * lastPoint.width;

    this.points.push({
      x: pointer.x,
      y: pointer.y,
      time: now,
      width: smoothWidth
    });

    this.drawPreview();
  }

  onMouseUp(options) {
    const ctx = this.canvas.contextTop;
    if (ctx) {
      this.canvas.clearContext(ctx);
    }

    if (this.points.length < 3) {
      this.points = [];
      return;
    }

    // 1. Chaikin coordinate and width smoothing (2 iterations) for organic stroke curves
    let smoothed = this.smoothPoints(this.points, 2);

    // 2. Taper start and end points to zero width (pointed tips)
    const taperLength = Math.min(25, Math.floor(smoothed.length / 3));
    for (let i = 0; i < taperLength; i++) {
      const ratio = i / taperLength;
      smoothed[i].width *= ratio;
      smoothed[smoothed.length - 1 - i].width *= ratio;
    }

    // 3. Calculate outline boundary points (left and right edges)
    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < smoothed.length; i++) {
      const p = smoothed[i];
      let dx, dy;
      if (i === 0) {
        dx = smoothed[1].x - p.x;
        dy = smoothed[1].y - p.y;
      } else if (i === smoothed.length - 1) {
        dx = p.x - smoothed[i - 1].x;
        dy = p.y - smoothed[i - 1].y;
      } else {
        dx = smoothed[i + 1].x - smoothed[i - 1].x;
        dy = smoothed[i + 1].y - smoothed[i - 1].y;
      }

      const len = Math.hypot(dx, dy) || 0.001;
      const nx = -dy / len;
      const ny = dx / len;

      leftPoints.push({ x: p.x + nx * p.width / 2, y: p.y + ny * p.width / 2 });
      rightPoints.push({ x: p.x - nx * p.width / 2, y: p.y - ny * p.width / 2 });
    }

    // 4. Construct SVG closed path
    let pathD = `M ${leftPoints[0].x} ${leftPoints[0].y}`;
    for (let i = 1; i < leftPoints.length; i++) {
      pathD += ` L ${leftPoints[i].x} ${leftPoints[i].y}`;
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      pathD += ` L ${rightPoints[i].x} ${rightPoints[i].y}`;
    }
    pathD += ' Z';

    // Helper conversion from hex to rgba
    const hexToRgba = (hex, opacity) => {
      if (!hex) return `rgba(0, 0, 0, ${opacity})`;
      const cleanHex = hex.replace(/^#/, '');
      let r = 0, g = 0, b = 0;
      if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
      } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    const finalColor = hexToRgba(this.color, this.opacity);

    // 5. Create final Fabric Path object
    const pathObj = new Path(pathD, {
      fill: finalColor,
      stroke: null,
      selectable: false,
      evented: false,
      objectCaching: false
    });

    pathObj.isPaintStroke = true;

    // 6. Add path to canvas and fire path:created event for history/undo support
    this.canvas.add(pathObj);
    this.canvas.fire('path:created', { path: pathObj });
    this.canvas.renderAll();

    this.points = [];
  }

  // Chaikin's corner-cutting algorithm for curve smoothing
  smoothPoints(points, iterations = 2) {
    if (points.length < 3) return points;
    let current = [...points];
    for (let iter = 0; iter < iterations; iter++) {
      const next = [];
      next.push({ ...current[0] });
      for (let i = 1; i < current.length - 1; i++) {
        const p0 = current[i - 1];
        const p1 = current[i];
        const p2 = current[i + 1];

        next.push({
          x: p0.x * 0.25 + p1.x * 0.75,
          y: p0.y * 0.25 + p1.y * 0.75,
          width: p0.width * 0.25 + p1.width * 0.75
        });
        next.push({
          x: p1.x * 0.75 + p2.x * 0.25,
          y: p1.y * 0.75 + p2.y * 0.25,
          width: p1.width * 0.75 + p2.width * 0.25
        });
      }
      next.push({ ...current[current.length - 1] });
      current = next;
    }
    return current;
  }

  drawPreview() {
    const ctx = this.canvas.contextTop;
    if (!ctx || this.points.length < 2) return;

    this.canvas.clearContext(ctx);

    ctx.save();
    // Apply viewport zoom and pan transform so preview matches canvas coordinate scaling
    const v = this.canvas.viewportTransform;
    ctx.transform(v[0], v[1], v[2], v[3], v[4], v[5]);

    // Apply temporary start and end tapering for real-time visual feedback
    const previewPoints = this.points.map((p, idx) => {
      let w = p.width;
      const startK = Math.min(10, Math.floor(this.points.length / 2));
      if (idx < startK) {
        w *= (idx / startK);
      }
      const endK = Math.min(12, Math.floor(this.points.length / 2));
      if (idx > this.points.length - 1 - endK) {
        w *= ((this.points.length - 1 - idx) / endK);
      }
      return { ...p, width: w };
    });

    const leftPoints = [];
    const rightPoints = [];

    for (let i = 0; i < previewPoints.length; i++) {
      const p = previewPoints[i];
      let dx, dy;
      if (i === 0) {
        dx = previewPoints[1].x - p.x;
        dy = previewPoints[1].y - p.y;
      } else if (i === previewPoints.length - 1) {
        dx = p.x - previewPoints[i - 1].x;
        dy = p.y - previewPoints[i - 1].y;
      } else {
        dx = previewPoints[i + 1].x - previewPoints[i - 1].x;
        dy = previewPoints[i + 1].y - previewPoints[i - 1].y;
      }

      const len = Math.hypot(dx, dy) || 0.001;
      const nx = -dy / len;
      const ny = dx / len;

      leftPoints.push({ x: p.x + nx * p.width / 2, y: p.y + ny * p.width / 2 });
      rightPoints.push({ x: p.x - nx * p.width / 2, y: p.y - ny * p.width / 2 });
    }

    // Draw outline
    ctx.beginPath();
    ctx.moveTo(leftPoints[0].x, leftPoints[0].y);
    for (let i = 1; i < leftPoints.length; i++) {
      ctx.lineTo(leftPoints[i].x, leftPoints[i].y);
    }
    for (let i = rightPoints.length - 1; i >= 0; i--) {
      ctx.lineTo(rightPoints[i].x, rightPoints[i].y);
    }
    ctx.closePath();

    // Helper conversion from hex to rgba
    const hexToRgba = (hex, opacity) => {
      if (!hex) return `rgba(0, 0, 0, ${opacity})`;
      const cleanHex = hex.replace(/^#/, '');
      let r = 0, g = 0, b = 0;
      if (cleanHex.length === 3) {
        r = parseInt(cleanHex[0] + cleanHex[0], 16);
        g = parseInt(cleanHex[1] + cleanHex[1], 16);
        b = parseInt(cleanHex[2] + cleanHex[2], 16);
      } else if (cleanHex.length === 6) {
        r = parseInt(cleanHex.substring(0, 2), 16);
        g = parseInt(cleanHex.substring(2, 4), 16);
        b = parseInt(cleanHex.substring(4, 6), 16);
      }
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    };

    ctx.fillStyle = hexToRgba(this.color, this.opacity);
    ctx.fill();
    ctx.restore();
  }
}
