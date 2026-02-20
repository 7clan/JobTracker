import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hue: number;
  cooldown: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;
};

const PARTICLE_COUNT = 70;
const MAX_SPEED = 0.9;
const LINE_DISTANCE = 140;

function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function createParticles(width: number, height: number): Particle[] {
  return Array.from({ length: PARTICLE_COUNT }, () => ({
    x: random(0, width),
    y: random(0, height),
    vx: random(-MAX_SPEED, MAX_SPEED),
    vy: random(-MAX_SPEED, MAX_SPEED),
    radius: random(2, 4),
    hue: random(185, 220),
    cooldown: 0,
  }));
}

function spawnExplosion(sparks: Spark[], x: number, y: number, hue: number) {
  const count = 16;
  for (let i = 0; i < count; i += 1) {
    const angle = (Math.PI * 2 * i) / count;
    const speed = random(1.1, 2.6);
    sparks.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: random(16, 24),
      maxLife: 24,
      size: random(1.4, 2.4),
      hue,
    });
  }
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId = 0;

    const particles = createParticles(width, height);
    const sparks: Spark[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const updateParticles = () => {
      const lineDistanceSquared = LINE_DISTANCE * LINE_DISTANCE;

      for (let i = 0; i < particles.length; i += 1) {
        const p1 = particles[i];

        p1.x += p1.vx;
        p1.y += p1.vy;

        if (p1.x < p1.radius || p1.x > width - p1.radius) {
          p1.vx *= -1;
          p1.x = Math.min(Math.max(p1.x, p1.radius), width - p1.radius);
        }

        if (p1.y < p1.radius || p1.y > height - p1.radius) {
          p1.vy *= -1;
          p1.y = Math.min(Math.max(p1.y, p1.radius), height - p1.radius);
        }

        if (p1.cooldown > 0) {
          p1.cooldown -= 1;
        }

        context.beginPath();
        context.fillStyle = `hsla(${p1.hue}, 88%, 72%, 0.9)`;
        context.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
        context.fill();

        for (let j = i + 1; j < particles.length; j += 1) {
          const p2 = particles[j];
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          const distSquared = dx * dx + dy * dy;

          if (distSquared < lineDistanceSquared) {
            const alpha = 1 - distSquared / lineDistanceSquared;
            context.beginPath();
            context.strokeStyle = `hsla(200, 95%, 78%, ${alpha * 0.6})`;
            context.lineWidth = 1;
            context.moveTo(p1.x, p1.y);
            context.lineTo(p2.x, p2.y);
            context.stroke();
          }

          const minDistance = p1.radius + p2.radius;
          if (distSquared <= minDistance * minDistance) {
            const dist = Math.sqrt(distSquared) || 0.001;
            const nx = dx / dist;
            const ny = dy / dist;

            const overlap = minDistance - dist;
            p1.x -= nx * (overlap * 0.5);
            p1.y -= ny * (overlap * 0.5);
            p2.x += nx * (overlap * 0.5);
            p2.y += ny * (overlap * 0.5);

            const tempVx = p1.vx;
            const tempVy = p1.vy;
            p1.vx = p2.vx;
            p1.vy = p2.vy;
            p2.vx = tempVx;
            p2.vy = tempVy;

            if (p1.cooldown === 0 && p2.cooldown === 0) {
              spawnExplosion(sparks, p1.x + dx * 0.5, p1.y + dy * 0.5, (p1.hue + p2.hue) * 0.5);
              p1.cooldown = 8;
              p2.cooldown = 8;
            }
          }
        }
      }
    };

    const updateSparks = () => {
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const spark = sparks[i];
        spark.x += spark.vx;
        spark.y += spark.vy;
        spark.vx *= 0.97;
        spark.vy *= 0.97;
        spark.life -= 1;

        if (spark.life <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        const alpha = spark.life / spark.maxLife;
        context.beginPath();
        context.fillStyle = `hsla(${spark.hue}, 95%, 68%, ${alpha})`;
        context.arc(spark.x, spark.y, spark.size * alpha, 0, Math.PI * 2);
        context.fill();
      }
    };

    const animate = () => {
      context.clearRect(0, 0, width, height);
      updateParticles();
      updateSparks();
      animationId = window.requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
