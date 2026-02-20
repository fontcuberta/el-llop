import { motion } from "framer-motion";
import { ROLE_ICONS } from "../../assets/roles";

interface RoleIconProps {
  role: string;
  size?: number;
  animate?: boolean;
  className?: string;
}

export function RoleIcon({ role, size = 48, animate = true }: RoleIconProps) {
  const src = ROLE_ICONS[role];
  if (!src) return null;

  const icon = (
    <img
      src={src}
      alt={role}
      width={size}
      height={size}
      style={{
        objectFit: "contain",
        filter: "drop-shadow(0 0 8px rgba(201, 184, 224, 0.3))",
      }}
    />
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        style={{ display: "inline-flex" }}
      >
        {icon}
      </motion.div>
    );
  }

  return <span style={{ display: "inline-flex" }}>{icon}</span>;
}
