import React, { useCallback, useEffect, useRef, useState } from "react";
import { Button, CircularProgress, IconButton } from "@mui/material";
import { Brush, Check, Close, DeleteSweep, PanoramaFishEye, Undo } from "@mui/icons-material";

type Tool = "pen" | "circle";
type Point = { x: number; y: number };
type Shape =
  | { tool: "pen"; color: string; points: Point[] }
  | { tool: "circle"; color: string; start: Point; end: Point };

type Props = {
  imageUrl: string;
  fileName: string;
  onSave: (file: File) => void;
  onClose: () => void;
};

const COLORS = ["#ef4444", "#facc15", "#22c55e"];
const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.85;

const drawShape = (ctx: CanvasRenderingContext2D, shape: Shape, lineWidth: number) => {
  ctx.strokeStyle = shape.color;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  if (shape.tool === "pen") {
    shape.points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
    // a single tap still leaves a visible dot
    if (shape.points.length === 1) ctx.lineTo(shape.points[0].x + 0.1, shape.points[0].y);
  } else {
    const cx = (shape.start.x + shape.end.x) / 2;
    const cy = (shape.start.y + shape.end.y) / 2;
    const rx = Math.abs(shape.end.x - shape.start.x) / 2;
    const ry = Math.abs(shape.end.y - shape.start.y) / 2;
    ctx.ellipse(cx, cy, Math.max(rx, 1), Math.max(ry, 1), 0, 0, Math.PI * 2);
  }
  ctx.stroke();
};

// Full-screen editor to circle / draw over scratches and defects on a captured photo.
const PhotoMarkupEditor: React.FC<Props> = ({ imageUrl, fileName, onSave, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const drawingRef = useRef<Shape | null>(null);
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<Tool>("circle");
  const [color, setColor] = useState(COLORS[0]);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !img || !ctx) return;
    const lineWidth = Math.max(4, Math.round(canvas.width / 150));
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    shapes.forEach((s) => drawShape(ctx, s, lineWidth));
    if (drawingRef.current) drawShape(ctx, drawingRef.current, lineWidth);
  }, [shapes]);

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const scale = Math.min(1, MAX_DIMENSION / Math.max(img.width, img.height));
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      imageRef.current = img;
      setLoaded(true);
    };
    img.src = imageUrl;
  }, [imageUrl]);

  useEffect(() => {
    if (loaded) redraw();
  }, [loaded, redraw]);

  const toCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!loaded || saving) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const p = toCanvasPoint(e);
    drawingRef.current = tool === "pen" ? { tool, color, points: [p] } : { tool, color, start: p, end: p };
    redraw();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const shape = drawingRef.current;
    if (!shape) return;
    const p = toCanvasPoint(e);
    if (shape.tool === "pen") shape.points.push(p);
    else shape.end = p;
    redraw();
  };

  const handlePointerUp = () => {
    const shape = drawingRef.current;
    if (!shape) return;
    drawingRef.current = null;
    setShapes((prev) => [...prev, shape]);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (shapes.length === 0) {
      onClose();
      return;
    }
    setSaving(true);
    canvas.toBlob(
      (blob) => {
        setSaving(false);
        if (!blob) return;
        const name = fileName.replace(/\.[^.]+$/, "") || "photo";
        onSave(new File([blob], `${name}-marked.jpg`, { type: "image/jpeg" }));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  };

  return (
    <div className="fixed inset-0 z-[1300] flex flex-col bg-black text-white">
      <div className="flex items-center gap-2 px-3 py-2">
        <IconButton aria-label="Cancel marking" onClick={onClose} disabled={saving} sx={{ color: "white" }}>
          <Close />
        </IconButton>
        <span className="text-base font-semibold">Mark Defect</span>
        <div className="ml-auto flex items-center gap-1">
          <IconButton
            aria-label="Undo"
            onClick={() => setShapes((prev) => prev.slice(0, -1))}
            disabled={shapes.length === 0 || saving}
            sx={{ color: "white", "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" } }}
          >
            <Undo />
          </IconButton>
          <IconButton
            aria-label="Clear all marks"
            onClick={() => setShapes([])}
            disabled={shapes.length === 0 || saving}
            sx={{ color: "white", "&.Mui-disabled": { color: "rgba(255,255,255,0.3)" } }}
          >
            <DeleteSweep />
          </IconButton>
        </div>
      </div>

      <div className="relative flex flex-1 min-h-0 items-center justify-center p-2">
        {!loaded && <CircularProgress sx={{ color: "white", position: "absolute" }} />}
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="max-h-full max-w-full touch-none select-none"
          style={{ visibility: loaded ? "visible" : "hidden" }}
        />
      </div>

      <div className="flex flex-col gap-3 px-4 pb-[max(16px,env(safe-area-inset-bottom))] pt-2">
        <p className="text-center text-xs text-white/60">
          {tool === "circle" ? "Drag over the issue to circle it" : "Draw freely over the issue"}
        </p>
        <div className="flex items-center justify-between gap-3">
          <div className="flex rounded-full bg-white/10 p-1">
            {[
              { value: "circle" as Tool, label: "Circle", icon: <PanoramaFishEye fontSize="small" /> },
              { value: "pen" as Tool, label: "Pen", icon: <Brush fontSize="small" /> },
            ].map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setTool(t.value)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  tool === t.value ? "bg-white text-black" : "text-white"
                }`}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Colour ${c}`}
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform ${
                  color === c ? "scale-110 border-white" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <Button
          variant="contained"
          size="large"
          fullWidth
          startIcon={saving ? <CircularProgress size={18} color="inherit" /> : <Check />}
          onClick={handleSave}
          disabled={!loaded || saving}
        >
          {shapes.length === 0 ? "Done" : "Save Marks"}
        </Button>
      </div>
    </div>
  );
};

export default PhotoMarkupEditor;
