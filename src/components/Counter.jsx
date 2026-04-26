import { useEffect, useState } from "react";

export default function Counter({ value, duration = 700 }) {
  const [n, setN] = useState(0);

  useEffect(() => {
    const to = Number(value) || 0;
    const start = Date.now();
    let raf;
    const tick = () => {
      const p = Math.min((Date.now() - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return <>{n}</>;
}
