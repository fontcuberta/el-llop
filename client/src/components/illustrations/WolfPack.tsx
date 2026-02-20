import { motion } from "framer-motion";

interface WolfPackProps {
  count?: number;
  size?: number;
  mirror?: boolean;
}

function MiniWolf({ x, y, delay, mirror }: { x: number; y: number; delay: number; mirror?: boolean }) {
  return (
    <motion.g
      transform={`translate(${x}, ${y}) scale(${mirror ? -1 : 1}, 1)`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6 }}
    >
      <motion.g
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
      >
        <path
          fill="#4c1d95"
          d="M0 12 C-4 12 -6 8 -6 4 C-6 0 -4 -2 0 -2 C4 -2 6 0 6 4 C6 8 4 12 0 12 Z"
          opacity="0.9"
        />
        <path fill="#6d28d9" d="M-3 -2 L-5 -6 L-1 -4 Z" opacity="0.9" />
        <path fill="#6d28d9" d="M3 -2 L5 -6 L1 -4 Z" opacity="0.9" />
        <ellipse cx="-2" cy="2" rx="1.5" ry="2" fill="#22d3ee" className="werewolf-eye-glow" />
        <ellipse cx="2" cy="2" rx="1.5" ry="2" fill="#22d3ee" className="werewolf-eye-glow" />
      </motion.g>
    </motion.g>
  );
}

export function WolfPack({ count = 3, size = 80, mirror }: WolfPackProps) {
  const wolves = [
    { x: 20, y: 50, delay: 0, mirror: false },
    { x: 50, y: 55, delay: 0.2, mirror: true },
    { x: 80, y: 48, delay: 0.4, mirror: false },
  ];

  return (
    <motion.svg
      viewBox="0 0 100 80"
      style={{
        width: size,
        height: (size * 80) / 100,
        transform: mirror ? "scaleX(-1)" : undefined,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {wolves.slice(0, count).map((w, i) => (
        <MiniWolf key={i} {...w} />
      ))}
    </motion.svg>
  );
}
