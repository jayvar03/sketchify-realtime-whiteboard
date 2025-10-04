export const drawLine = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  if (shift) {
    const dx = Math.abs(x - from[0]);
    const dy = Math.abs(y - from[1]);

    if (dx > dy) {
      y = from[1];
    } else {
      x = from[0];
    }
  }

  ctx.beginPath();
  ctx.moveTo(from[0], from[1]); // Properly start the path
  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.closePath();
};

export const drawCircle = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean
) => {
  const radiusX = Math.abs(x - from[0]);
  const radiusY = shift ? radiusX : Math.abs(y - from[1]);

  const centerX = from[0] + (x > from[0] ? radiusX : -radiusX);
  const centerY = from[1] + (y > from[1] ? radiusY : -radiusY);

  ctx.beginPath();
  ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  return {
    cX: centerX,
    cY: centerY,
    radiusX,
    radiusY,
  };
};

export const drawRect = (
  ctx: CanvasRenderingContext2D,
  from: [number, number],
  x: number,
  y: number,
  shift?: boolean,
  fill?: boolean
) => {
  let width = x - from[0];
  let height = y - from[1];

  if (shift) {
    const side = Math.max(Math.abs(width), Math.abs(height));
    width = width > 0 ? side : -side;
    height = height > 0 ? side : -side;
  }

  ctx.beginPath();
  ctx.rect(from[0], from[1], width, height);
  ctx.stroke();
  if (fill) ctx.fill();
  ctx.closePath();

  return { width, height };
};
