import { motion } from "framer-motion";

interface MoonAndStarsProps {
  size?: number;
}

export function MoonAndStars({ size = 100 }: MoonAndStarsProps) {
  const stars = [
    { cx: 15, cy: 20, r: 1.5, delay: 0 },
    { cx: 85, cy: 25, r: 1, delay: 0.3 },
    { cx: 25, cy: 45, r: 1, delay: 0.6 },
    { cx: 75, cy: 40, r: 2, delay: 0.2 },
    { cx: 10, cy: 60, r: 1, delay: 0.4 },
    { cx: 90, cy: 55, r: 1.5, delay: 0.5 },
  ];

  return (
    <motion.svg
      viewBox="0 0 100 80"
      style={{ width: size, height: (size * 80) / 100 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {stars.map((s, i) => (
        <motion.circle
          key={i}
          cx={s.cx}
          cy={s.cy}
          r={s.r}
          fill="#c9b8e0"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: s.delay }}
        />
      ))}
      <motion.g
        animate={{ scale: [1, 1.02, 1], opacity: [0.95, 1, 0.95] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <circle cx="50" cy="40" r="18" fill="#e8e0f0" />
        <circle cx="55" cy="35" r="15" fill="#1a0a2e" opacity="0.9" />
        <circle cx="50" cy="40" r="18" fill="none" stroke="#8b5cf6" strokeWidth="1" opacity="0.5" />
      </motion.g>
    </motion.svg>
  );
}
