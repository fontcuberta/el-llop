import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import type { GameState } from "shared";

interface EndedPhaseProps {
  gameState: GameState;
}

const ROLE_KEYS: Record<string, string> = {
  wolf: "roles.wolf",
  villager: "roles.villager",
  seer: "roles.seer",
  witch: "roles.witch",
  hunter: "roles.hunter",
  cupid: "roles.cupid",
  thief: "roles.thief",
  protector: "roles.protector",
  elder: "roles.elder",
  idiot: "roles.idiot",
  littleGirl: "roles.littleGirl",
};

export function EndedPhase({ gameState }: EndedPhaseProps) {
  const { t } = useTranslation();
  const winnerKey =
    gameState.winner === "wolves"
      ? "ended.wolvesWin"
      : gameState.winner === "villagers"
        ? "ended.villagersWin"
        : "ended.loversWin";

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            color:
              gameState.winner === "wolves"
                ? "var(--accent-blood)"
                : gameState.winner === "lovers"
                  ? "var(--accent-moon)"
                  : "var(--accent-gold)",
          }}
        >
          {t(winnerKey)}
        </h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        style={{
          padding: 24,
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid var(--accent-moon)",
        }}
      >
        <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>{t("ended.roles")}</p>
        {gameState.players.map((p) => (
          <div
            key={p.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ color: p.alive ? "var(--text-primary)" : "var(--text-muted)" }}>
              {p.name}
              {!p.alive && " †"}
            </span>
            <span style={{ color: "var(--accent-moon)" }}>
              {t(ROLE_KEYS[p.role] ?? p.role)}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}
