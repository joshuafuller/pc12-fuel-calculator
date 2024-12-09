import React, { useEffect, useRef } from 'react';

interface Ripple {
  x: number;
  y: number;
  radius: number;
  life: number;
  color: string;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  color: string;
}

interface ParticlesProps {
  active?: boolean;
  color?: string;
  className?: string;
  intensity?: number;
  speed?: number;
  size?: number;
  ripplePoint?: { x: number; y: number };
}

export function Particles({ 
  active = false, 
  color = '#60A5FA', 
  className = '',
  intensity = 1,
  speed = 1,
  size = 1,
  ripplePoint
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const ripplesRef = useRef<Ripple[]>([]);
  const frameRef = useRef<number>();
  const timeRef = useRef(0);
  const lastRipplePointRef = useRef<{ x: number; y: number } | undefined>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    const createParticle = () => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * 0.2 * speed,
        vy: (Math.random() - 0.5) * 0.2 * speed,
        size: (Math.random() * 1.5 + 0.5) * size,
        alpha: 0,
        targetAlpha: Math.random() * 0.3 + 0.1,
        color
      };
    };

    const createRipple = (x: number, y: number) => ({
      x,
      y,
      radius: 0,
      life: 1,
      color
    });

    // Initialize particles
    const particleCount = Math.floor(30 * intensity);
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle());
    }

    const animate = (timestamp: number) => {
      if (!canvas || !ctx) return;
      
      const deltaTime = timestamp - timeRef.current;
      timeRef.current = timestamp;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle ripple
      if (ripplePoint && ripplePoint !== lastRipplePointRef.current) {
        ripplesRef.current.push(createRipple(ripplePoint.x, ripplePoint.y));
        lastRipplePointRef.current = ripplePoint;
      }

      // Update and draw ripples
      ripplesRef.current = ripplesRef.current
        .filter(r => r.life > 0)
        .map(r => {
          r.radius += deltaTime * 0.15; // Slower expansion
          r.life *= 0.97; // Slower fade

          // Main ripple
          ctx.strokeStyle = `${r.color}${Math.floor(r.life * 255).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 4;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
          ctx.stroke();

          // Secondary ripple
          ctx.strokeStyle = `${r.color}${Math.floor(r.life * 127).toString(16).padStart(2, '0')}`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(r.x, r.y, r.radius * 1.1, 0, Math.PI * 2);
          ctx.stroke();

          // Inner glow
          const gradient = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.radius);
          gradient.addColorStop(0, `${r.color}${Math.floor(r.life * 40).toString(16).padStart(2, '0')}`);
          gradient.addColorStop(1, `${r.color}00`);
          ctx.fillStyle = gradient;
          ctx.fill();

          return r;
        });

      if (active) {
        // Update and draw particles
        particlesRef.current.forEach(p => {
          // Random direction changes
          if (Math.random() < 0.02) {
            p.vx = (Math.random() - 0.5) * 0.2 * speed;
            p.vy = (Math.random() - 0.5) * 0.2 * speed;
          }

          p.x += p.vx;
          p.y += p.vy;

          // Wrap around edges with padding
          const padding = p.size * 2;
          if (p.x < -padding) p.x = canvas.width + padding;
          if (p.x > canvas.width + padding) p.x = -padding;
          if (p.y < -padding) p.y = canvas.height + padding;
          if (p.y > canvas.height + padding) p.y = -padding;

          // Smooth alpha transition
          p.alpha += (p.targetAlpha - p.alpha) * 0.1;
          
          // Randomly change target alpha for shimmer effect
          if (Math.random() < 0.02) {
            p.targetAlpha = Math.random() * 0.3 + 0.1;
          }

          ctx.shadowBlur = 8;
          ctx.shadowColor = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `${p.color}${Math.floor(p.alpha * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          ctx.shadowBlur = 0;
        });
      }

      frameRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    frameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [active, color, intensity, speed, size, ripplePoint]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
}