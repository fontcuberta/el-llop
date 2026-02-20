import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { RoleIcon } from "../shared/RoleIcon";
import { RoleDecoration } from "../illustrations";
import type { Role } from "shared";

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

const PRESETS: Record<string, Role[]> = {
  classic8: [
    "wolf",
    "villager",
    "villager",
    "villager",
    "villager",
    "seer",
    "witch",
    "hunter",
  ],
  big12: [
    "wolf",
    "wolf",
    "villager",
    "villager",
    "villager",
    "villager",
    "villager",
    "seer",
    "witch",
    "hunter",
    "cupid",
    "protector",
  ],
};

interface RoleConfigProps {
  playerCount: number;
  currentDeck: Role[];
  onDeckChange: (deck: Role[]) => void;
  isHost: boolean;
}

export function RoleConfig({
  playerCount,
  currentDeck,
  onDeckChange,
  isHost,
}: RoleConfigProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  if (!isHost) return null;

  const applyPreset = (key: string) => {
    const preset = PRESETS[key];
    if (preset && preset.length === playerCount) {
      onDeckChange(preset);
    }
  };

  const addRole = (role: Role) => {
    if (currentDeck.length >= playerCount) return;
    onDeckChange([...currentDeck, role]);
  };

  const removeRole = (index: number) => {
    const next = [...currentDeck];
    next.splice(index, 1);
    onDeckChange(next);
  };

  return (
    <div
      style={{
        marginBottom: 24,
        background: "var(--bg-card)",
        borderRadius: 16,
        border: "1px solid rgba(255,255,255,0.1)",
        overflow: "hidden",
      }}
    >
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: "100%",
          padding: 16,
          background: "transparent",
          border: "none",
          color: "var(--text-primary)",
          fontSize: 16,
          cursor: "pointer",
          textAlign: "left",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {t("lobby.roleConfig")} ({currentDeck.length}/{playerCount})
        <span style={{ opacity: 0.7 }}>{expanded ? "−" : "+"}</span>
      </button>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          style={{ padding: "0 16px 16px", overflow: "hidden" }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
            <RoleDecoration role="wolf" size={36} />
            <RoleDecoration role="witch" size={36} />
            <RoleDecoration role="seer" size={36} />
            <RoleDecoration role="hunter" size={36} />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 12 }}>
            {t("lobby.presets")}
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            <button
              onClick={() => applyPreset("classic8")}
              disabled={playerCount !== 8}
              style={{
                padding: "8px 16px",
                background: "var(--gradient-card)",
                border: "1px solid var(--accent-moon)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: 14,
                cursor: playerCount === 8 ? "pointer" : "not-allowed",
                opacity: playerCount === 8 ? 1 : 0.5,
              }}
            >
              Classic 8
            </button>
            <button
              onClick={() => applyPreset("big12")}
              disabled={playerCount !== 12}
              style={{
                padding: "8px 16px",
                background: "var(--gradient-card)",
                border: "1px solid var(--accent-moon)",
                borderRadius: 8,
                color: "var(--text-primary)",
                fontSize: 14,
                cursor: playerCount === 12 ? "pointer" : "not-allowed",
                opacity: playerCount === 12 ? 1 : 0.5,
              }}
            >
              Big 12
            </button>
            <button
              onClick={() =>
                onDeckChange(
                  Array(playerCount)
                    .fill("villager")
                    .map((_, i) => (i === 0 ? "wolf" : "villager"))
                )
              }
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid var(--text-muted)",
                borderRadius: 8,
                color: "var(--text-muted)",
                fontSize: 14,
                cursor: "pointer",
              }}
            >
              {t("lobby.reset")}
            </button>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginBottom: 8 }}>
            {t("lobby.customRoles")}
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {ALL_ROLES.map((role) => (
              <motion.button
                key={role}
                onClick={() => addRole(role)}
                disabled={currentDeck.length >= playerCount}
                whileHover={{ scale: currentDeck.length >= playerCount ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: "6px 12px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: currentDeck.length >= playerCount ? "transparent" : "var(--bg-deep)",
                  border: "1px solid var(--accent-moon)",
                  borderRadius: 8,
                  color: "var(--text-primary)",
                  fontSize: 12,
                  cursor: currentDeck.length >= playerCount ? "not-allowed" : "pointer",
                  opacity: currentDeck.length >= playerCount ? 0.5 : 1,
                }}
              >
                <RoleIcon role={role} size={24} animate={false} />
                + {t(`roles.${role}`)}
              </motion.button>
            ))}
          </div>
          <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
            {currentDeck.map((role, i) => (
              <motion.span
                key={`${role}-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 10px",
                  background: "var(--bg-deep)",
                  borderRadius: 8,
                  fontSize: 12,
                  border: "1px solid rgba(201, 184, 224, 0.2)",
                }}
              >
                <RoleIcon role={role} size={28} animate={false} />
                {t(`roles.${role}`)}
                <button
                  onClick={() => removeRole(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--accent-blood)",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: 14,
                    lineHeight: 1,
                  }}
                >
                  ×
                </button>
              </motion.span>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
