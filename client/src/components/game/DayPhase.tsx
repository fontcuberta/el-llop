import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { socket } from "../../socket";
import type { GameState } from "shared";

interface DayPhaseProps {
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

export function DayPhase({ gameState }: DayPhaseProps) {
  const { t } = useTranslation();
  const me = gameState.players.find((p) => p.socketId === socket.id);
  const aliveOthers = gameState.players.filter(
    (p) => p.alive && p.socketId !== socket.id
  );
  const voted = me?.votedFor;

  const handleVote = (targetId: string) => {
    socket.emit("vote", { targetId });
  };

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-gold)" }}>
          {t("day.title")}
        </h2>
        <p style={{ color: "var(--text-muted)" }}>Day {gameState.nightNumber}</p>
      </motion.div>

      {(gameState.deathsThisCycle?.length > 0 || gameState.lastIdiotRevealed) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: 20,
            background: "var(--bg-card)",
            borderRadius: 12,
            marginBottom: 24,
            border: "1px solid var(--accent-blood)",
          }}
        >
          <p style={{ color: "var(--accent-blood)", marginBottom: 8 }}>
            {t("day.deaths")}
          </p>
          {gameState.deathsThisCycle?.map((d) => (
            <p key={d.playerId} style={{ margin: "4px 0", color: "var(--text-primary)" }}>
              {d.name} — {t(ROLE_KEYS[d.role] ?? d.role)}
            </p>
          ))}
          {gameState.lastIdiotRevealed && (
            <p style={{ margin: "4px 0", color: "var(--accent-moon)" }}>
              {gameState.lastIdiotRevealed} — {t("day.idiotSurvived")}
            </p>
          )}
        </motion.div>
      )}

      {!me?.alive && (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          {t("day.dead")}
        </p>
      )}

      {me?.alive && me?.canVote === false && (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          {t("day.idiotRevealed")}
        </p>
      )}

      {me?.alive && me?.canVote !== false && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16 }}>{t("day.votePrompt")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {aliveOthers.map((p) => (
              <button
                key={p.id}
                onClick={() => !voted && handleVote(p.id)}
                disabled={!!voted}
                style={{
                  padding: 16,
                  background: voted === p.id ? "var(--accent-blood)" : "var(--gradient-card)",
                  border:
                    voted === p.id
                      ? "1px solid var(--accent-blood)"
                      : "1px solid var(--accent-moon)",
                  borderRadius: 12,
                  color: "var(--text-primary)",
                  fontSize: 16,
                  cursor: voted ? "default" : "pointer",
                  textAlign: "left",
                  opacity: voted && voted !== p.id ? 0.6 : 1,
                }}
              >
                {p.name}
                {voted === p.id && ` ✓`}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
