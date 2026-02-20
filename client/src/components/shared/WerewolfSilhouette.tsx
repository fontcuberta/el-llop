import { motion } from "framer-motion";

interface WerewolfSilhouetteProps {
  size?: number;
  mirror?: boolean;
  delay?: number;
}

export function WerewolfSilhouette({ size = 80, mirror = false, delay = 0 }: WerewolfSilhouetteProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: mirror ? 20 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.5 + delay }}
      style={{
        width: size,
        height: size * 1.1,
        transform: mirror ? "scaleX(-1)" : undefined,
        filter: "drop-shadow(0 0 16px rgba(139, 92, 246, 0.5)) drop-shadow(0 0 24px rgba(34, 211, 238, 0.3))",
      }}
    >
      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 110"
        style={{ width: "100%", height: "100%" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3.5 + delay, repeat: Infinity, ease: "easeInOut", delay: delay * 0.5 }}
      >
        <defs>
          <linearGradient id={`silhouette-body-${mirror}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1a0a2e" />
            <stop offset="40%" stopColor="#4c1d95" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id={`silhouette-eye-${mirror}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
          <filter id={`silhouette-glow-${mirror}`}>
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          fill={`url(#silhouette-body-${mirror})`}
          filter={`url(#silhouette-glow-${mirror})`}
          d="M50 8 C32 8 18 28 14 48 C10 62 18 74 34 82 L50 88 L66 82 C82 74 90 62 86 48 C82 28 68 8 50 8 Z"
          opacity="0.95"
        />
        <path
          fill="#4c1d95"
          d="M50 24 C36 28 26 44 22 58 C20 66 24 74 36 80 L50 84 L64 80 C76 74 80 66 78 58 C74 44 64 28 50 24 Z"
          opacity="0.9"
        />
        <path fill="#4c1d95" d="M38 20 L30 4 L44 18 Z" opacity="0.9" />
        <path fill="#4c1d95" d="M62 20 L70 4 L56 18 Z" opacity="0.9" />
        <ellipse
          cx="36"
          cy="50"
          rx="4"
          ry="5"
          fill={`url(#silhouette-eye-${mirror})`}
          className="werewolf-eye-glow"
        />
        <ellipse
          cx="64"
          cy="50"
          rx="4"
          ry="5"
          fill={`url(#silhouette-eye-${mirror})`}
          className="werewolf-eye-glow"
        />
      </motion.svg>
    </motion.div>
  );
}
