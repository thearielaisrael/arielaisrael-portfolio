"use client";

import { useEffect, useRef } from "react";

type Props = {
  opacityClass?: string;
  showParticles?: boolean;
};

export default function BackgroundFX({ opacityClass = "opacity-12", showParticles = true }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const dprRef = useRef<number>(1);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!showParticles || reduceMotion) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d", { alpha: true });

    if (!canvas || !ctx) {
      return;
    }

    const setSize = () => {
      const dpr = window.devicePixelRatio || 1;

      dprRef.current = dpr;

      const { offsetWidth, offsetHeight } = canvas;

      canvas.width = Math.max(1, Math.round(offsetWidth * dpr));
      canvas.height = Math.max(1, Math.round(offsetHeight * dpr));

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    setSize();

    window.addEventListener("resize", setSize);

    const getWidth = () => canvas.offsetWidth;
    const getHeight = () => canvas.offsetHeight;

    const particleCount = Math.max(24, Math.floor((getWidth() * getHeight()) / 12000));

    const getThemeVariable = (name: string, fallback: string) => {
      return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
    };

    let dotColor = getThemeVariable("--color-secondary", "#14777d");
    let lineColor = getThemeVariable("--color-accent", "#c42b70");

    const updateThemeColors = () => {
      dotColor = getThemeVariable("--color-secondary", "#14777d");
      lineColor = getThemeVariable("--color-accent", "#c42b70");
    };

    const themeObserver = new MutationObserver(updateThemeColors);

    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * getWidth(),
      y: Math.random() * getHeight(),
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
      radius: Math.random() * 1.5 + 0.5,
    }));

    const maximumConnectionDistance = 120;

    const tick = () => {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dprRef.current, dprRef.current);

      ctx.globalAlpha = 0.06;
      ctx.strokeStyle = lineColor;

      for (let firstIndex = 0; firstIndex < particles.length; firstIndex += 1) {
        for (let secondIndex = firstIndex + 1; secondIndex < particles.length; secondIndex += 1) {
          const firstParticle = particles[firstIndex];
          const secondParticle = particles[secondIndex];

          const horizontalDistance = firstParticle.x - secondParticle.x;
          const verticalDistance = firstParticle.y - secondParticle.y;

          const squaredDistance =
            horizontalDistance * horizontalDistance + verticalDistance * verticalDistance;

          if (squaredDistance < maximumConnectionDistance * maximumConnectionDistance) {
            ctx.beginPath();
            ctx.moveTo(firstParticle.x, firstParticle.y);
            ctx.lineTo(secondParticle.x, secondParticle.y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 0.25;
      ctx.fillStyle = dotColor;

      for (const particle of particles) {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > getWidth()) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > getHeight()) {
          particle.vy *= -1;
        }

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
      }

      themeObserver.disconnect();
      window.removeEventListener("resize", setSize);
    };
  }, [showParticles]);

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 isolate -z-10">
      <div className={`fx-gradient fx-blur fx-blend-screen absolute inset-0 ${opacityClass}`} />

      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  );
}
