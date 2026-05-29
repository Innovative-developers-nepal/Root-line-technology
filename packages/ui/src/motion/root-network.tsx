"use client";
import * as React from "react";
import { useRef, useEffect } from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface Point {
  x: number;
  y: number;
}

interface EnergyParticle {
  pathIdx: number;
  progress: number;
  speed: number;
  size: number;
  phase: number;
}

const ROOT_DEFS: Point[][] = [
  [{ x: 0.5, y: 1.05 }, { x: 0.48, y: 0.85 }, { x: 0.42, y: 0.68 }, { x: 0.34, y: 0.52 }, { x: 0.27, y: 0.36 }, { x: 0.2, y: 0.2 }],
  [{ x: 0.5, y: 1.05 }, { x: 0.52, y: 0.85 }, { x: 0.58, y: 0.68 }, { x: 0.66, y: 0.52 }, { x: 0.73, y: 0.36 }, { x: 0.8, y: 0.2 }],
  [{ x: 0.5, y: 1.05 }, { x: 0.5, y: 0.82 }, { x: 0.5, y: 0.64 }, { x: 0.5, y: 0.46 }, { x: 0.5, y: 0.28 }, { x: 0.5, y: 0.12 }],
  [{ x: 0.5, y: 0.82 }, { x: 0.4, y: 0.72 }, { x: 0.3, y: 0.56 }, { x: 0.2, y: 0.4 }, { x: 0.12, y: 0.24 }],
  [{ x: 0.5, y: 0.82 }, { x: 0.6, y: 0.72 }, { x: 0.7, y: 0.56 }, { x: 0.8, y: 0.4 }, { x: 0.88, y: 0.24 }],
  [{ x: 0.5, y: 0.62 }, { x: 0.38, y: 0.52 }, { x: 0.25, y: 0.36 }, { x: 0.15, y: 0.2 }],
  [{ x: 0.5, y: 0.62 }, { x: 0.62, y: 0.52 }, { x: 0.75, y: 0.36 }, { x: 0.85, y: 0.2 }],
  [{ x: 0.5, y: 0.45 }, { x: 0.42, y: 0.38 }, { x: 0.32, y: 0.28 }, { x: 0.24, y: 0.18 }],
  [{ x: 0.5, y: 0.45 }, { x: 0.58, y: 0.38 }, { x: 0.68, y: 0.28 }, { x: 0.76, y: 0.18 }],
];

function catmullRom(points: Point[], samples: number): Point[] {
  const result: Point[] = [];
  const n = points.length;
  if (n < 2) return result;

  for (let i = 0; i < samples; i++) {
    const t = i / (samples - 1);
    const segCount = n - 1;
    const segT = t * segCount;
    const seg = Math.min(Math.floor(segT), segCount - 1);
    const localT = segT - seg;
    const p0 = points[Math.max(0, seg - 1)]!;
    const p1 = points[seg]!;
    const p2 = points[Math.min(n - 1, seg + 1)]!;
    const p3 = points[Math.min(n - 1, seg + 2)]!;

    const t2 = localT * localT;
    const t3 = t2 * localT;

    const x = 0.5 * (
      (2 * p1.x) +
      (-p0.x + p2.x) * localT +
      (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 +
      (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3
    );
    const y = 0.5 * (
      (2 * p1.y) +
      (-p0.y + p2.y) * localT +
      (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 +
      (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3
    );

    result.push({ x, y });
  }

  return result;
}

interface RootNetworkProps {
  className?: string;
}

export function RootNetwork({ className }: RootNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const pathsRef = useRef<{ smooth: Point[]; prev: Point[]; phase: number }[]>([]);
  const particlesRef = useRef<EnergyParticle[]>([]);

  useEffect(() => {
    if (reduced) return;

    const onMouse = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouse);
    return () => window.removeEventListener("mousemove", onMouse);
  }, [reduced]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);

      const w = window.innerWidth;
      const h = window.innerHeight;

      pathsRef.current = ROOT_DEFS.map((def) => {
        const points = def.map((p) => ({ x: p.x * w, y: p.y * h }));
        return {
          smooth: catmullRom(points, 80),
          prev: points,
          phase: Math.random() * Math.PI * 2,
        };
      });

      const allParticles: EnergyParticle[] = [];
      pathsRef.current.forEach((_, idx) => {
        const count = idx < 3 ? 4 : 3;
        for (let i = 0; i < count; i++) {
          allParticles.push({
            pathIdx: idx,
            progress: i / count,
            speed: 0.001 + Math.random() * 0.0015,
            size: 1.2 + Math.random() * 1.2,
            phase: Math.random() * Math.PI * 2,
          });
        }
      });
      particlesRef.current = allParticles;
    };

    const getPathPoint = (path: Point[], progress: number): Point => {
      const idx = Math.max(0, Math.min(path.length - 1, Math.round(progress * (path.length - 1))));
      return path[idx]!;
    };

    const drawRoot = (path: Point[], baseAlpha: number, color: string) => {
      if (path.length < 2) return;
      const p0 = path[0]!;

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i]!.x, path[i]!.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.globalAlpha = baseAlpha * 0.5;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(p0.x, p0.y);
      for (let i = 1; i < path.length; i++) {
        ctx.lineTo(path[i]!.x, path[i]!.y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 3;
      ctx.globalAlpha = baseAlpha * 0.15;
      ctx.stroke();

      ctx.globalAlpha = 1;
    };

    const drawParticle = (p: EnergyParticle, path: Point[], color: string, accentColor: string, mouse: { x: number; y: number }) => {
      const pos = getPathPoint(path, p.progress);

      const dx = pos.x - mouse.x;
      const dy = pos.y - mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const attract = dist < 120 ? (1 - dist / 120) * 8 : 0;

      const pulse = 0.6 + 0.4 * Math.sin(time * 0.003 * p.speed * 5 + p.phase);

      ctx.beginPath();
      ctx.arc(pos.x + (pos.x - mouse.x) / dist * attract * 0.3, pos.y + (pos.y - mouse.y) / dist * attract * 0.3, p.size * pulse, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.35 * pulse;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pos.x + (pos.x - mouse.x) / dist * attract * 0.3, pos.y + (pos.y - mouse.y) / dist * attract * 0.3, p.size * 3 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = accentColor;
      ctx.globalAlpha = 0.08 * pulse;
      ctx.fill();

      ctx.globalAlpha = 1;
    };

    const animate = () => {
      time++;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      const drift = Math.sin(time * 0.001) * 2;

      pathsRef.current.forEach((pathData, idx) => {
        const baseAlpha = idx < 3 ? 0.12 : 0.08;
        const isPrimary = idx < 3;
        const color = isPrimary
          ? `hsl(var(--color-primary) / ${baseAlpha * 2})`
          : `hsl(var(--color-accent) / ${baseAlpha * 2})`;

        const driftedPath = pathData.smooth.map((p) => ({
          x: p.x + drift * (p.y / h) + Math.sin(time * 0.002 + pathData.phase + p.y * 0.02) * 3,
          y: p.y,
        }));

        drawRoot(driftedPath, baseAlpha, color);

        const withinY = mouse.y < h * 0.95 && mouse.y > h * 0.05;
        const withinX = mouse.x > 0 && mouse.x < w;
        const activeWithin = withinY && withinX;
        const speedMul = activeWithin ? 3 : 1;

        const prefix = idx === 0 || idx === 2 || idx === 3 || idx === 5
          ? "hsl(var(--color-primary) / 0.5)"
          : "hsl(var(--color-accent) / 0.4)";
        const glow = "hsl(var(--color-primary) / 0.2)";

        particlesRef.current
          .filter((p) => p.pathIdx === idx)
          .forEach((p) => {
            p.progress += p.speed * speedMul;
            if (p.progress > 1) p.progress = 0;
            drawParticle(p, driftedPath, prefix, glow, mouse);
          });
      });

      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("pointer-events-none absolute inset-0", className)}
    />
  );
}
