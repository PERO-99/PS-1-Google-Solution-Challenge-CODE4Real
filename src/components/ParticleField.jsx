import { useEffect, useRef } from "react";

export default function ParticleField() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let W, H;

    const particles = [];
    const COLORS = ["#48c3ff", "#1fe6a8", "#a78bfa", "#ff567d", "#ffbc57"];

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function spawn() {
      return {
        x: Math.random() * W,
        y: H + 10,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(Math.random() * 0.8 + 0.3),
        r: Math.random() * 1.5 + 0.3,
        alpha: 0,
        maxAlpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        life: 0,
        maxLife: Math.random() * 300 + 200,
      };
    }

    for (let i = 0; i < 60; i++) {
      const p = spawn();
      p.y = Math.random() * H;
      p.life = Math.random() * p.maxLife;
      particles.push(p);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      if (particles.length < 80) particles.push(spawn());

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        const progress = p.life / p.maxLife;
        if (progress < 0.1) p.alpha = (progress / 0.1) * p.maxAlpha;
        else if (progress > 0.8) p.alpha = ((1 - progress) / 0.2) * p.maxAlpha;
        else p.alpha = p.maxAlpha;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;

        if (p.life >= p.maxLife) particles.splice(i, 1);
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.6,
      }}
    />
  );
}
