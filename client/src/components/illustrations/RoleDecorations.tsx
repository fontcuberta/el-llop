import { motion } from "framer-motion";

type RoleKey = "wolf" | "witch" | "seer" | "hunter" | "cupid" | "protector" | "villager";

interface RoleDecorationsProps {
  role: RoleKey;
  size?: number;
}

const ROLE_SVG: Record<RoleKey, React.ReactNode> = {
  wolf: (
    <g>
      <path fill="#4c1d95" d="M32 20 Q50 8 68 20 Q60 35 50 32 Q40 35 32 20 Z" opacity="0.9" />
      <path fill="#6d28d9" d="M38 18 L34 8 L44 16 Z" />
      <path fill="#6d28d9" d="M62 18 L66 8 L56 16 Z" />
      <ellipse cx="44" cy="24" rx="4" ry="5" fill="#22d3ee" className="werewolf-eye-glow" />
      <ellipse cx="56" cy="24" rx="4" ry="5" fill="#22d3ee" className="werewolf-eye-glow" />
    </g>
  ),
  witch: (
    <g>
      <ellipse cx="50" cy="45" rx="18" ry="8" fill="#4c1d95" opacity="0.8" />
      <path fill="#6d28d9" d="M35 50 L30 28 L50 20 L70 28 L65 50 Z" />
      <circle cx="50" cy="35" r="6" fill="#22d3ee" opacity="0.9" />
    </g>
  ),
  seer: (
    <g>
      <circle cx="50" cy="45" r="22" fill="none" stroke="#8b5cf6" strokeWidth="2" opacity="0.8" />
      <circle cx="50" cy="45" r="14" fill="#4c1d95" opacity="0.5" />
      <circle cx="50" cy="42" r="4" fill="#22d3ee" className="werewolf-eye-glow" />
    </g>
  ),
  hunter: (
    <g>
      <path fill="#8b5cf6" d="M30 55 L45 20 L50 25 L35 55 Z" />
      <path fill="#e9b44c" d="M50 25 L70 35 L55 50 L48 45 Z" />
      <circle cx="48" cy="30" r="3" fill="#22d3ee" />
    </g>
  ),
  cupid: (
    <g>
      <path fill="#f472b6" d="M35 40 Q50 25 65 40 Q50 55 35 40 Z" />
      <path fill="#f472b6" d="M42 38 Q50 35 58 38" opacity="0.8" />
    </g>
  ),
  protector: (
    <g>
      <path fill="#8b5cf6" d="M25 45 L50 15 L75 45 L50 55 Z" opacity="0.9" />
      <path fill="#22d3ee" d="M35 40 L50 25 L65 40 L50 48 Z" opacity="0.6" />
    </g>
  ),
  villager: (
    <g>
      <ellipse cx="50" cy="35" rx="12" ry="14" fill="#c9b8e0" opacity="0.8" />
      <path fill="#4c1d95" d="M35 55 L40 38 L60 38 L65 55 Z" opacity="0.8" />
    </g>
  ),
};

export function RoleDecoration({ role, size = 64 }: RoleDecorationsProps) {
  return (
    <motion.svg
      viewBox="0 0 100 70"
      style={{ width: size, height: (size * 70) / 100 }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.08 }}
      transition={{ duration: 0.4 }}
    >
      <motion.g
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        {ROLE_SVG[role]}
      </motion.g>
    </motion.svg>
  );
}
