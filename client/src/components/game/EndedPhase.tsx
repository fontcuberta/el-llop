import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { RoleIcon } from "../shared/RoleIcon";
import { VillageScene, WolfPack, WerewolfSilhouette } from "../illustrations";
import "../../styles/animations.css";
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

  const wolvesWin = gameState.winner === "wolves";
  const loversWin = gameState.winner === "lovers";

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            marginBottom: 16,
          }}
        >
          <WerewolfSilhouette size={60} mirror />
          {wolvesWin ? (
            <WolfPack count={3} size={110} />
          ) : loversWin ? (
            <div style={{ display: "flex", gap: 8 }}>
              <WerewolfSilhouette size={56} />
              <WerewolfSilhouette size={56} mirror />
            </div>
          ) : (
            <VillageScene variant="day" size={100} />
          )}
          <WerewolfSilhouette size={60} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            color:
              wolvesWin
                ? "var(--accent-blood)"
                : loversWin
                  ? "var(--accent-moon)"
                  : "var(--accent-gold)",
          }}
        >
          {t(winnerKey)}
        </h1>
        <motion.div style={{ marginTop: 12, opacity: 0.6 }}>
          <VillageScene variant={wolvesWin ? "night" : "day"} size={120} />
        </motion.div>
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
        {gameState.players.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + i * 0.05 }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <span style={{ color: p.alive ? "var(--text-primary)" : "var(--text-muted)", display: "flex", alignItems: "center", gap: 12 }}>
              <RoleIcon role={p.role} size={36} animate={false} />
              {p.name}
              {!p.alive && " †"}
            </span>
            <span style={{ color: "var(--accent-moon)" }}>
              {t(ROLE_KEYS[p.role] ?? p.role)}
            </span>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
