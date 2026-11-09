import { useEffect, useRef, useState } from "react";

const reducedMotion = () =>
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

// Counts smoothly from the previous value (0 on first show) to `value`.
function AnimatedNumber({ value, decimals = 0, prefix = "", suffix = "", duration = 750 }) {
  const [shown, setShown] = useState(() => (reducedMotion() ? value : 0));
  const from = useRef(shown);

  useEffect(() => {
    let raf;
    if (reducedMotion()) {
      raf = requestAnimationFrame(() => setShown(value));
      return () => cancelAnimationFrame(raf);
    }
    const a = from.current;
    let start = null;
    const step = (now) => {
      // the first frame's timestamp marks the start, so progress never dips below 0
      if (start === null) start = now;
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = 1 - Math.pow(1 - p, 3);
      const v = a + (value - a) * eased;
      from.current = v;
      setShown(v);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  const text = shown.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
}

export default AnimatedNumber;
