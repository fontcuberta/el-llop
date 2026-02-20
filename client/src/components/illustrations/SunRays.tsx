import { motion } from "framer-motion";

interface SunRaysProps {
  size?: number;
}

export function SunRays({ size = 100 }: SunRaysProps) {
  const rays = 12;
  return (
    <motion.svg
      viewBox="0 0 100 100"
      style={{ width: size, height: size }}
      animate={{ rotate: [0, 360] }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    >
      <defs>
        <radialGradient id="sun-core">
          <stop offset="0%" stopColor="#fef3c7" />
          <stop offset="50%" stopColor="#e9b44c" />
          <stop offset="100%" stopColor="#c9a227" stopOpacity="0.8" />
        </radialGradient>
      </defs>
      {Array.from({ length: rays }, (_, i) => {
        const angle = (i * 360) / rays;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + Math.cos(rad) * 25;
        const y1 = 50 + Math.sin(rad) * 25;
        const x2 = 50 + Math.cos(rad) * 45;
        const y2 = 50 + Math.sin(rad) * 45;
        return (
          <motion.line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#e9b44c"
            strokeWidth="2"
            strokeLinecap="round"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
          />
        );
      })}
      <motion.circle
        cx="50"
        cy="50"
        r="22"
        fill="url(#sun-core)"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.svg>
  );
}
