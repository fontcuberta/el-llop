import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { socket } from "../../socket";
import type { GameState } from "shared";

interface HunterPhaseProps {
  gameState: GameState;
}

export function HunterPhase({ gameState }: HunterPhaseProps) {
  const { t } = useTranslation();
  const me = gameState.players.find((p) => p.socketId === socket.id);
  const isHunter = gameState.hunterPending && me?.id === gameState.hunterPending;
  const aliveOthers = gameState.players.filter(
    (p) => p.alive && p.socketId !== socket.id
  );

  const handleKill = (targetId: string) => {
    socket.emit("hunter_action", { targetId });
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-blood)" }}>
          {t("hunter.title")}
        </h2>
        <p style={{ color: "var(--text-muted)" }}>{t("hunter.prompt")}</p>
      </motion.div>

      {!isHunter && (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          {t("hunter.waiting")}
        </p>
      )}

      {isHunter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {aliveOthers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleKill(p.id)}
                style={{
                  padding: 16,
                  background: "var(--gradient-card)",
                  border: "1px solid var(--accent-blood)",
                  borderRadius: 12,
                  color: "var(--text-primary)",
                  fontSize: 16,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
