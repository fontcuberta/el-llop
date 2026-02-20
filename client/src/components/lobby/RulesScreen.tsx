import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
  VillageScene,
  WolfPack,
  MoonAndStars,
  SunRays,
  RoleDecoration,
  WerewolfSilhouette,
} from "../illustrations";
import { RoleIcon } from "../shared/RoleIcon";
import type { Role } from "shared";
import "../../styles/animations.css";

const ALL_ROLES: Role[] = [
  "wolf",
  "villager",
  "seer",
  "witch",
  "hunter",
  "cupid",
  "thief",
  "protector",
  "elder",
  "idiot",
  "littleGirl",
];

const ROLE_DECORATION_MAP: Partial<Record<Role, "wolf" | "witch" | "seer" | "hunter" | "cupid" | "protector" | "villager">> = {
  wolf: "wolf",
  villager: "villager",
  seer: "seer",
  witch: "witch",
  hunter: "hunter",
  cupid: "cupid",
  protector: "protector",
};

interface RulesScreenProps {
  onClose: () => void;
}

export function RulesScreen({ onClose }: RulesScreenProps) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "var(--bg-deep)",
        overflowY: "auto",
        paddingBottom: 48,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: "linear-gradient(180deg, var(--bg-deep) 0%, transparent 100%)",
          padding: "24px 24px 16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "1.75rem",
            margin: 0,
            background: "linear-gradient(135deg, var(--accent-gold), var(--accent-moon))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {t("rules.title")}
        </h1>
        <button
          onClick={onClose}
          style={{
            padding: "10px 20px",
            background: "var(--gradient-card)",
            border: "1px solid var(--accent-moon)",
            borderRadius: 12,
            color: "var(--text-primary)",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          {t("common.close")}
        </button>
      </div>

      <div style={{ maxWidth: 420, margin: "0 auto", padding: "0 24px" }}>
        {/* Overview */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          style={{
            marginBottom: 40,
            padding: 24,
            background: "var(--gradient-card)",
            borderRadius: 16,
            border: "1px solid var(--accent-moon)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <WerewolfSilhouette size={56} mirror />
            <VillageScene variant="night" size={120} />
            <WerewolfSilhouette size={56} />
          </div>
          <p
            style={{
              color: "var(--text-primary)",
              fontSize: 16,
              lineHeight: 1.6,
              margin: 0,
              textAlign: "center",
            }}
          >
            {t("rules.overview")}
          </p>
        </motion.section>

        {/* Game Phases */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ marginBottom: 40 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--accent-gold)",
              fontSize: "1.25rem",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {t("rules.phases")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Captain */}
            <PhaseCard
              icon={<RoleDecoration role="protector" size={56} />}
              title={t("captain.title")}
              description={t("rules.phase.captain")}
              accent="var(--accent-gold)"
            />
            {/* Night */}
            <PhaseCard
              icon={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WolfPack count={2} size={50} mirror />
                  <MoonAndStars size={70} />
                  <WolfPack count={2} size={50} />
                </div>
              }
              title={t("night.title")}
              description={t("rules.phase.night")}
              accent="var(--accent-moon)"
            />
            {/* Day */}
            <PhaseCard
              icon={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WerewolfSilhouette size={44} mirror />
                  <SunRays size={64} />
                  <WerewolfSilhouette size={44} />
                </div>
              }
              title={t("day.title")}
              description={t("rules.phase.day")}
              accent="var(--accent-gold)"
            />
            {/* Hunter */}
            <PhaseCard
              icon={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <WolfPack count={1} size={44} mirror />
                  <RoleDecoration role="hunter" size={56} />
                  <WolfPack count={1} size={44} />
                </div>
              }
              title={t("hunter.title")}
              description={t("rules.phase.hunter")}
              accent="var(--accent-blood)"
            />
          </div>
        </motion.section>

        {/* Roles */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ marginBottom: 40 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--accent-moon)",
              fontSize: "1.25rem",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {t("rules.roles")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {ALL_ROLES.map((role, i) => {
              const decoKey = ROLE_DECORATION_MAP[role];
              return (
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.03 }}
                  style={{
                    padding: 16,
                    background: "var(--bg-card)",
                    borderRadius: 12,
                    border: "1px solid rgba(201, 184, 224, 0.2)",
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                  }}
                >
                  <div style={{ flexShrink: 0 }}>
                    {decoKey ? (
                      <RoleDecoration role={decoKey} size={48} />
                    ) : (
                      <RoleIcon role={role} size={48} animate={false} />
                    )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: 16,
                        color: role === "wolf" ? "var(--accent-blood)" : "var(--text-primary)",
                      }}
                    >
                      {t(`roles.${role}`)}
                    </h3>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 14,
                        lineHeight: 1.5,
                        color: "var(--text-muted)",
                      }}
                    >
                      {t(`rules.role.${role}`)}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Win Conditions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--accent-gold)",
              fontSize: "1.25rem",
              marginBottom: 20,
              textAlign: "center",
            }}
          >
            {t("rules.winConditions")}
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <WinCard
              icon={<WolfPack count={3} size={80} />}
              title={t("ended.wolvesWin")}
              description={t("rules.win.wolves")}
              color="var(--accent-blood)"
            />
            <WinCard
              icon={<VillageScene variant="day" size={100} />}
              title={t("ended.villagersWin")}
              description={t("rules.win.villagers")}
              color="var(--accent-gold)"
            />
            <WinCard
              icon={
                <div style={{ display: "flex", gap: 8 }}>
                  <WerewolfSilhouette size={56} />
                  <RoleDecoration role="cupid" size={48} />
                  <WerewolfSilhouette size={56} mirror />
                </div>
              }
              title={t("ended.loversWin")}
              description={t("rules.win.lovers")}
              color="var(--accent-moon)"
            />
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}

function PhaseCard({
  icon,
  title,
  description,
  accent,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  accent: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      style={{
        padding: 20,
        background: "var(--gradient-card)",
        borderRadius: 14,
        border: `1px solid ${accent}`,
        boxShadow: `0 0 20px ${accent}20`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: "0 0 8px", fontSize: 18, color: accent }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--text-muted)" }}>
        {description}
      </p>
    </motion.div>
  );
}

function WinCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      style={{
        padding: 20,
        background: "var(--bg-card)",
        borderRadius: 14,
        border: `1px solid ${color}`,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>{icon}</div>
      <h3 style={{ margin: "0 0 8px", fontSize: 16, color, textAlign: "center" }}>{title}</h3>
      <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5, color: "var(--text-muted)", textAlign: "center" }}>
        {description}
      </p>
    </motion.div>
  );
}
