'use client';

import { useEffect, useRef } from 'react';

interface Particle { x: number; y: number; vx: number; vy: number; size: number; opacity: number; hue: number; }

export function Particles({ count = 50, className = '' }: { count?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animationId: number;
    let particles: Particle[] = [];

    const resize = () => { if (canvas) { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; } };
    resize();
    window.addEventListener('resize', resize);

    const init = () => {
      particles = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * (canvas?.width || 0), y: Math.random() * (canvas?.height || 0),
          vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
          size: Math.random() * 2 + 0.5, opacity: Math.random() * 0.5 + 0.2,
          hue: Math.random() > 0.5 ? 199 : 280,
        });
      }
    };
    init();

    const animate = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 89%, 60%, ${p.opacity})`; ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `hsla(199, 89%, 60%, ${(1 - dist / 120) * 0.15})`; ctx.lineWidth = 0.5; ctx.stroke();
          }
        }
      }
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => { cancelAnimationFrame(animationId); window.removeEventListener('resize', resize); };
  }, [count]);

  return <canvas ref={canvasRef} className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} aria-hidden="true" />;
}
