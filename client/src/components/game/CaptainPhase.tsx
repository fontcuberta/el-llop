import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { socket } from "../../socket";
import { RoleDecoration, VillageScene, WerewolfSilhouette } from "../illustrations";
import "../../styles/animations.css";
import type { GameState } from "shared";

interface CaptainPhaseProps {
  gameState: GameState;
}

export function CaptainPhase({ gameState }: CaptainPhaseProps) {
  const { t } = useTranslation();
  const me = gameState.players.find((p) => p.socketId === socket.id);
  const hasVoted = !!me?.votedForCaptain;

  const handleVote = (targetId: string) => {
    socket.emit("captain_vote", { targetId });
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 8,
          }}
        >
          <WerewolfSilhouette size={48} mirror />
          <div className="animate-glow-breathe">
            <RoleDecoration role="protector" size={72} />
          </div>
          <WerewolfSilhouette size={48} />
        </div>
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)" }}>
          {t("captain.title")}
        </h2>
        <p style={{ color: "var(--text-muted)" }}>{t("captain.prompt")}</p>
        <motion.div style={{ marginTop: 16, opacity: 0.5 }}>
          <VillageScene variant="night" size={100} />
        </motion.div>
      </motion.div>

      {!hasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gameState.players.map((p) => (
              <button
                key={p.id}
                onClick={() => handleVote(p.id)}
                style={{
                  padding: 16,
                  background: "var(--gradient-card)",
                  border: "1px solid var(--accent-gold)",
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

      {hasVoted && (
        <p style={{ textAlign: "center", color: "var(--text-muted)", marginTop: 48 }}>
          {t("captain.waiting")}
        </p>
      )}
    </div>
  );
}
