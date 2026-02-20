import { motion } from "framer-motion";

interface MagicalSparklesProps {
  count?: number;
  color?: string;
  size?: number;
}

const SPARKLE_COLORS = ["#22d3ee", "#8b5cf6", "#e9b44c", "#f472b6"];

export function MagicalSparkles({ count = 12, color, size = 200 }: MagicalSparklesProps) {
  const items = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * 100 - 50,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    scale: 0.5 + Math.random() * 1,
    color: color ?? SPARKLE_COLORS[i % SPARKLE_COLORS.length],
  }));

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {items.map((s) => (
        <motion.div
          key={s.id}
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            width: 6,
            height: 6,
            marginLeft: -3,
            marginTop: -3,
            borderRadius: "50%",
            background: s.color,
            boxShadow: `0 0 12px ${s.color}`,
          }}
          animate={{
            x: [s.x, s.x + (Math.random() - 0.5) * 30, s.x],
            y: [s.y, s.y - 20 - Math.random() * 30, s.y],
            opacity: [0.3, 1, 0.3],
            scale: [s.scale * 0.5, s.scale, s.scale * 0.5],
          }}
          transition={{
            duration: s.duration,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
