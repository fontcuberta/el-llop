import { motion } from "framer-motion";
import "../../styles/animations.css";

export function WerewolfHero({ size = 180 }: { size?: number }) {
  return (
    <motion.div
      className="werewolf-hero-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      whileHover={{ scale: 1.03 }}
      style={{
        position: "relative",
        width: size,
        height: size * 0.9,
        filter: "drop-shadow(0 0 32px rgba(139, 92, 246, 0.4)) drop-shadow(0 0 64px rgba(34, 211, 238, 0.2))",
      }}
    >
      {/* Magical ambient particles */}
      <motion.div
        className="werewolf-particles"
        animate={{
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: "-20%",
          pointerEvents: "none",
        }}
      >
        <svg viewBox="0 0 200 180" style={{ width: "100%", height: "100%" }}>
          <defs>
            <radialGradient id="particle-glow">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#22d3ee" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="90" r="70" fill="url(#particle-glow)" />
        </svg>
      </motion.div>

      <motion.svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 200 180"
        style={{ position: "relative", width: "100%", height: "100%" }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <linearGradient id="wolf-body" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#1a0a2e" />
            <stop offset="30%" stopColor="#3b1f6e" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#6d28d9" stopOpacity="0.6" />
            <stop offset="85%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#c9b8e0" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="wolf-fur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4c1d95" />
            <stop offset="50%" stopColor="#6d28d9" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
          <linearGradient id="eye-magic" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <filter id="mystic-glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="eye-glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="#22d3ee" floodOpacity="0.8" />
            <feComposite in2="blur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Majestic werewolf silhouette - mystical purple gradient */}
        <path
          fill="url(#wolf-body)"
          filter="url(#mystic-glow)"
          d="M100 18 C68 18 46 52 42 82 C38 105 48 125 72 135 L100 145 L128 135 C152 125 162 105 158 82 C154 52 132 18 100 18 Z"
          opacity="0.98"
        />

        {/* Wolf head profile - deeper purple fur */}
        <path
          fill="url(#wolf-fur)"
          d="M100 38 C72 44 56 68 50 90 C46 102 50 112 62 118 L100 123 L138 118 C150 112 154 102 150 90 C144 68 128 44 100 38 Z"
          opacity="0.95"
        />

        {/* Ears */}
        <path fill="url(#wolf-fur)" d="M78 32 L66 8 L86 28 Z" opacity="0.95" />
        <path fill="url(#wolf-fur)" d="M122 32 L134 8 L114 28 Z" opacity="0.95" />

        {/* Mystic eyes - animated glow */}
        <g filter="url(#eye-glow)">
          <motion.ellipse
            cx="82"
            cy="78"
            rx="7"
            ry="9"
            fill="url(#eye-magic)"
            className="werewolf-eye-glow"
          />
          <motion.ellipse
            cx="118"
            cy="78"
            rx="7"
            ry="9"
            fill="url(#eye-magic)"
            className="werewolf-eye-glow"
          />
        </g>

        {/* Inner eye sparkle */}
        <ellipse cx="82" cy="76" rx="2" ry="3" fill="#fef3c7" opacity="0.9" />
        <ellipse cx="118" cy="76" rx="2" ry="3" fill="#fef3c7" opacity="0.9" />

        {/* Magical muzzle accent */}
        <path
          fill="#8b5cf6"
          opacity="0.4"
          d="M85 98 Q100 105 115 98 Q108 102 100 104 Q92 102 85 98 Z"
        />
      </motion.svg>
    </motion.div>
  );
}
