"use client";
import * as React from "react";
import { useRef, useEffect, useCallback } from "react";
import { cn } from "../lib/cn";
import { usePrefersReducedMotion } from "./hooks";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  glow: boolean;
}

interface DigitalNetworkProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  primaryColor?: string;
  accentColor?: string;
}

export function DigitalNetwork({
  className,
  particleCount = 90,
  connectionDistance = 160,
  primaryColor = "59,130,246",
  accentColor = "139,92,246",
}: DigitalNetworkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const onMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reduced) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let particles: Particle[] = [];
    let animId = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const count = Math.min(
        particleCount,
        Math.floor((canvas.width * canvas.height) / 12000),
      );
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          size: Math.random() * 2 + 0.5,
          opacity: Math.random() * 0.6 + 0.2,
          glow: Math.random() > 0.85,
        });
      }
    };

    const drawGrid = () => {
      const s = 60;
      ctx.strokeStyle = `rgba(${primaryColor}, 0.03)`;
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += s) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += s) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    };

    const drawVignette = () => {
      const g = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.2,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8,
      );
      g.addColorStop(0, "transparent");
      g.addColorStop(1, "rgba(0,0,0,0.4)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGrid();
      const mouse = mouseRef.current;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]!;
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          const force = (100 - mdist) / 100;
          p.x += (mdx / mdist) * force * 2;
          p.y += (mdy / mdist) * force * 2;
        }

        const pColor = p.glow ? accentColor : primaryColor;

        if (p.glow) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 20);
          g.addColorStop(0, `rgba(${pColor}, 0.15)`);
          g.addColorStop(1, `rgba(${pColor}, 0)`);
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 20, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${pColor}, ${p.opacity})`;
        ctx.fill();

        if (p.glow) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 2.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${pColor}, 0.1)`;
          ctx.fill();
        }

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]!;
          const dx2 = p.x - p2.x;
          const dy2 = p.y - p2.y;
          const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

          if (dist2 < connectionDistance) {
            const alpha = (1 - dist2 / connectionDistance) * 0.25;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${primaryColor}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      drawVignette();
      animId = requestAnimationFrame(animate);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMouseMove);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [reduced, particleCount, connectionDistance, primaryColor, accentColor, onMouseMove]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={cn("absolute inset-0 -z-10", className)}
    />
  );
}
