import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Eraser, Undo, Redo } from 'lucide-react';
import { DrawStep } from '../services/lessonService';

interface Props {
  width: number;
  height: number;
  drawSteps: DrawStep[];
  isTeaching: boolean;
  currentStep: number;
}

const Whiteboard: React.FC<Props> = ({ width, height, drawSteps, isTeaching, currentStep }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [currentDrawing, setCurrentDrawing] = useState<number>(0);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) return;

    canvas.width = width;
    canvas.height = height;
    context.fillStyle = '#FFFFFF';
    context.fillRect(0, 0, width, height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.font = '24px Arial';
    
    setCtx(context);
    saveToHistory(context.getImageData(0, 0, width, height));
  }, [width, height]);

  const saveToHistory = (imageData: ImageData) => {
    setHistory(prev => [...prev.slice(0, historyIndex + 1), imageData]);
    setHistoryIndex(prev => prev + 1);
  };

  const undo = () => {
    if (!ctx || historyIndex <= 0) return;
    
    const newIndex = historyIndex - 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  const redo = () => {
    if (!ctx || historyIndex >= history.length - 1) return;
    
    const newIndex = historyIndex + 1;
    ctx.putImageData(history[newIndex], 0, 0);
    setHistoryIndex(newIndex);
  };

  useEffect(() => {
    if (!ctx || !isTeaching || !drawSteps.length) return;
    clearCanvas();
    setCurrentDrawing(0);
  }, [currentStep, isTeaching]);

  useEffect(() => {
    if (!ctx || !isTeaching || currentDrawing >= drawSteps.length) return;

    const step = drawSteps[currentDrawing];
    const startTime = Date.now();
    let animationFrame: number;

    const animate = () => {
      if (!ctx) return;
      
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / step.duration, 1);

      // Clear and redraw background
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, width, height);

      // Redraw previous steps
      drawSteps.slice(0, currentDrawing).forEach(prevStep => {
        drawStep(ctx, prevStep, 1);
      });

      // Draw current step with animation
      drawStep(ctx, step, progress);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        saveToHistory(ctx.getImageData(0, 0, width, height));
        setTimeout(() => {
          setCurrentDrawing(prev => prev + 1);
        }, step.delay || 0);
      }
    };

    const timeout = setTimeout(() => {
      animationFrame = requestAnimationFrame(animate);
    }, step.delay || 0);

    return () => {
      cancelAnimationFrame(animationFrame);
      clearTimeout(timeout);
    };
  }, [currentDrawing, drawSteps, ctx, isTeaching, width, height]);

  const drawStep = (ctx: CanvasRenderingContext2D, step: DrawStep, progress: number) => {
    ctx.strokeStyle = step.color;
    ctx.fillStyle = step.color;
    ctx.lineWidth = step.thickness || 2;

    switch (step.type) {
      case 'text':
        const textLength = Math.floor((step.text?.length || 0) * progress);
        const partialText = step.text?.substring(0, textLength) || '';
        ctx.fillText(partialText, step.x, step.y);
        break;

      case 'line':
        if (step.points && step.points.length > 1) {
          ctx.beginPath();
          ctx.moveTo(step.points[0].x, step.points[0].y);
          for (let i = 1; i < step.points.length * progress; i++) {
            ctx.lineTo(step.points[i].x, step.points[i].y);
          }
          ctx.stroke();
        }
        break;

      case 'circle':
        ctx.beginPath();
        ctx.arc(step.x, step.y, (step.width || 50) * progress, 0, Math.PI * 2);
        ctx.stroke();
        break;

      case 'rect':
        ctx.strokeRect(
          step.x,
          step.y,
          (step.width || 100) * progress,
          (step.height || 100) * progress
        );
        break;

      case 'arrow':
        if (step.points && step.points.length > 1) {
          const start = step.points[0];
          const end = step.points[1];
          const angle = Math.atan2(end.y - start.y, end.x - start.x);
          
          ctx.beginPath();
          ctx.moveTo(start.x, start.y);
          ctx.lineTo(
            start.x + (end.x - start.x) * progress,
            start.y + (end.y - start.y) * progress
          );
          
          if (progress === 1) {
            const arrowLength = 20;
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle - Math.PI / 6),
              end.y - arrowLength * Math.sin(angle - Math.PI / 6)
            );
            ctx.moveTo(end.x, end.y);
            ctx.lineTo(
              end.x - arrowLength * Math.cos(angle + Math.PI / 6),
              end.y - arrowLength * Math.sin(angle + Math.PI / 6)
            );
          }
          ctx.stroke();
        }
        break;

      case 'highlight':
        const alpha = ctx.globalAlpha;
        ctx.globalAlpha = 0.3;
        ctx.fillRect(
          step.x,
          step.y,
          (step.width || 100) * progress,
          step.height || 30
        );
        ctx.globalAlpha = alpha;
        break;
    }
  };

  const clearCanvas = () => {
    if (!ctx) return;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, width, height);
    saveToHistory(ctx.getImageData(0, 0, width, height));
  };

  return (
    <div className="relative bg-white rounded-lg shadow-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
      <div className="absolute top-4 right-4 flex gap-2">
        <motion.button
          onClick={undo}
          disabled={historyIndex <= 0}
          className="p-2 bg-indigo-500 text-white rounded-lg shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Undo className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={redo}
          disabled={historyIndex >= history.length - 1}
          className="p-2 bg-indigo-500 text-white rounded-lg shadow-lg disabled:opacity-50"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Redo className="w-5 h-5" />
        </motion.button>
        <motion.button
          onClick={clearCanvas}
          className="p-2 bg-indigo-500 text-white rounded-lg shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Eraser className="w-5 h-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Whiteboard;