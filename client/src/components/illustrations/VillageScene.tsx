import { motion } from "framer-motion";

interface VillageSceneProps {
  variant?: "day" | "night" | "dusk";
  size?: number;
  compact?: boolean;
}

export function VillageScene({ variant = "night", size = 120, compact }: VillageSceneProps) {
  const isNight = variant === "night";
  const glowColor = isNight ? "#8b5cf6" : "#e9b44c";

  return (
    <motion.svg
      viewBox="0 0 200 120"
      style={{ width: size, height: (size * 120) / 200 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <defs>
        <linearGradient id="cottage-roof" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#4c1d95" />
          <stop offset="100%" stopColor="#1a0a2e" />
        </linearGradient>
        <linearGradient id="cottage-wall" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#2a1545" />
          <stop offset="100%" stopColor="#1f0f3a" />
        </linearGradient>
        <filter id="cottage-glow">
          <feGaussianBlur stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Cottage 1 */}
      <motion.g
        filter="url(#cottage-glow)"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <path fill="url(#cottage-wall)" d="M20 80 L20 100 L60 100 L60 80 L40 55 Z" />
        <path fill="url(#cottage-roof)" d="M15 58 L40 38 L65 58 L40 78 Z" />
        <rect x="35" y="85" width="10" height="15" fill="#c9b8e0" opacity="0.6" />
      </motion.g>
      {/* Cottage 2 */}
      <motion.g
        filter="url(#cottage-glow)"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <path fill="url(#cottage-wall)" d="M80 75 L80 100 L120 100 L120 75 L100 50 Z" />
        <path fill="url(#cottage-roof)" d="M75 52 L100 28 L125 52 L100 75 Z" />
        <rect x="95" y="82" width="10" height="18" fill="#c9b8e0" opacity="0.6" />
      </motion.g>
      {/* Cottage 3 */}
      <motion.g
        filter="url(#cottage-glow)"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <path fill="url(#cottage-wall)" d="M140 78 L140 100 L180 100 L180 78 L160 55 Z" />
        <path fill="url(#cottage-roof)" d="M135 56 L160 35 L185 56 L160 76 Z" />
        <rect x="155" y="88" width="10" height="12" fill="#c9b8e0" opacity="0.6" />
      </motion.g>
      {/* Tree */}
      <motion.g
        animate={{ rotate: [-1, 1, -1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 100px" }}
      >
        <path fill="#1a0a2e" d="M95 100 L105 100 L105 70 L95 70 Z" />
        <ellipse cx="100" cy="55" rx="25" ry="30" fill="#2a1545" />
        <ellipse cx="100" cy="55" rx="15" ry="18" fill="#3b1f6e" opacity="0.6" />
      </motion.g>
    </motion.svg>
  );
}
