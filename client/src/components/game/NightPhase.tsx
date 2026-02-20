import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSpeech } from "../../hooks/useSpeech";
import { socket } from "../../socket";
import type { GameState } from "shared";

interface NightPhaseProps {
  gameState: GameState;
}

export function NightPhase({ gameState }: NightPhaseProps) {
  const { t } = useTranslation();
  const { speak, isAvailable } = useSpeech();

  const me = gameState.players.find((p) => p.socketId === socket.id);
  const isMyTurn =
    me &&
    me.alive &&
    gameState.currentRoleTurn === me.role;

  const [cupidSelection, setCupidSelection] = useState<string[]>([]);

  useEffect(() => {
    if (!gameState.currentRoleTurn || !me?.alive) return;
    const keys: Record<string, string> = {
      wolf: "tts.wolvesWake",
      seer: "tts.seerWake",
      witch: "tts.witchWake",
      thief: "tts.thiefWake",
      cupid: "tts.cupidWake",
      protector: "tts.protectorWake",
    };
    const k = keys[gameState.currentRoleTurn];
    if (me.role === gameState.currentRoleTurn && k) {
      speak(k);
    }
  }, [gameState.currentRoleTurn, me?.role, me?.alive]);

  const aliveOthers = gameState.players.filter(
    (p) => p.alive && p.socketId !== socket.id
  );

  const handleWolfTarget = (targetId: string) => {
    socket.emit("night_action", { targetId });
  };

  const handleSeerTarget = (targetId: string) => {
    socket.emit("night_action", { targetId });
  };

  const handleWitchAction = (opts: { heal?: boolean; poisonTargetId?: string }) => {
    socket.emit("night_action", opts);
  };

  const handleThiefChoice = (role: string) => {
    socket.emit("night_action", { thiefRole: role });
  };

  const handleCupidSelect = (targetId: string) => {
    if (cupidSelection.includes(targetId)) {
      setCupidSelection(cupidSelection.filter((x) => x !== targetId));
    } else if (cupidSelection.length < 2) {
      setCupidSelection([...cupidSelection, targetId]);
    }
  };

  const handleCupidConfirm = () => {
    if (cupidSelection.length === 2) {
      socket.emit("night_action", {
        cupidTarget1: cupidSelection[0],
        cupidTarget2: cupidSelection[1],
      });
    }
  };

  const handleProtectorTarget = (targetId: string) => {
    socket.emit("night_action", { protectorTargetId: targetId });
  };

  const allPlayers = gameState.players.filter((p) => p.alive);

  return (
    <div style={{ padding: 24, minHeight: "100vh", paddingTop: 48 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <h2 style={{ fontFamily: "var(--font-heading)", color: "var(--accent-moon)" }}>
          {t("night.title")}
        </h2>
        <p style={{ color: "var(--text-muted)" }}>Night {gameState.nightNumber}</p>
      </motion.div>

      {!me?.alive && (
        <p style={{ textAlign: "center", color: "var(--text-muted)" }}>
          {t("night.dead")}
        </p>
      )}

      {me?.alive && !isMyTurn && me.role !== "littleGirl" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", marginTop: 48 }}
        >
          <p
            style={{
              fontSize: isAvailable ? 28 : 36,
              color: "var(--text-muted)",
              margin: 0,
              lineHeight: 1.4,
              maxWidth: 360,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            {t("night.closeEyes")}
          </p>
          {!isAvailable && (
            <p style={{ color: "var(--accent-moon)", fontSize: 14, marginTop: 12, marginBottom: 0 }}>
              {t("common.ttsUnavailable")}
            </p>
          )}
          <button
            onClick={() => speak("tts.everyoneCloseEyes")}
            style={{
              marginTop: 16,
              padding: "12px 24px",
              background: "var(--gradient-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            {t("common.readAloud")}
          </button>
        </motion.div>
      )}

      {me?.alive && me.role === "littleGirl" && gameState.currentRoleTurn === "wolf" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ maxWidth: 400, margin: "0 auto", padding: 24, background: "var(--bg-card)", borderRadius: 12 }}
        >
          <p style={{ color: "var(--accent-moon)", marginBottom: 12 }}>{t("night.littleGirlPeek")}</p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {gameState.players
              .filter((p) => p.alive && p.role === "wolf")
              .map((p) => (
                <li key={p.id} style={{ padding: "8px 0", color: "var(--accent-blood)" }}>
                  {p.name}
                </li>
              ))}
          </ul>
        </motion.div>
      )}

      {me?.alive && isMyTurn && me.role === "thief" && gameState.thiefChoices && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-moon)" }}>{t("night.thiefPrompt")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gameState.thiefChoices.map((role) => (
              <button
                key={role}
                onClick={() => handleThiefChoice(role)}
                style={{
                  padding: 16,
                  background: "var(--gradient-card)",
                  border: "1px solid var(--accent-moon)",
                  borderRadius: 12,
                  color: "var(--text-primary)",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t(`roles.${role}`)}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {me?.alive && isMyTurn && me.role === "cupid" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-moon)" }}>{t("night.cupidPrompt")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allPlayers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleCupidSelect(p.id)}
                style={{
                  padding: 16,
                  background: cupidSelection.includes(p.id) ? "var(--accent-blood)" : "var(--gradient-card)",
                  border: `1px solid ${cupidSelection.includes(p.id) ? "var(--accent-blood)" : "var(--accent-moon)"}`,
                  borderRadius: 12,
                  color: "var(--text-primary)",
                  fontSize: 16,
                  cursor: "pointer",
                  textAlign: "left",
                }}
              >
                {p.name} {cupidSelection.includes(p.id) && "♥"}
              </button>
            ))}
            {cupidSelection.length === 2 && (
              <button
                onClick={handleCupidConfirm}
                style={{
                  padding: 16,
                  background: "linear-gradient(135deg, var(--accent-gold), #c9a227)",
                  border: "none",
                  borderRadius: 12,
                  color: "var(--bg-deep)",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                {t("night.cupidConfirm")}
              </button>
            )}
          </div>
        </motion.div>
      )}

      {me?.alive && isMyTurn && me.role === "protector" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-moon)" }}>{t("night.protectorPrompt")}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {allPlayers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleProtectorTarget(p.id)}
                style={{
                  padding: 16,
                  background: "var(--gradient-card)",
                  border: "1px solid var(--accent-moon)",
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

      {me?.alive && isMyTurn && me.role === "wolf" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-blood)" }}>
            {t("night.wolfPrompt")}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {aliveOthers.map((p) => (
              <button
                key={p.id}
                onClick={() => handleWolfTarget(p.id)}
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

      {me?.alive && isMyTurn && me.role === "seer" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-moon)" }}>
            {t("night.seerPrompt")}
          </p>
          {gameState.seerReveal ? (
            <p style={{ padding: 24, background: "var(--bg-card)", borderRadius: 12 }}>
              {gameState.seerReveal.name} → {t(`roles.${gameState.seerReveal.role}`)}
            </p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {aliveOthers.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSeerTarget(p.id)}
                  style={{
                    padding: 16,
                    background: "var(--gradient-card)",
                    border: "1px solid var(--accent-moon)",
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
          )}
        </motion.div>
      )}

      {me?.alive && isMyTurn && me.role === "witch" && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ maxWidth: 400, margin: "0 auto" }}
        >
          <p style={{ marginBottom: 16, color: "var(--accent-moon)" }}>
            {t("night.witchPrompt")}
          </p>
          {gameState.wolfVictim && (
            <p style={{ marginBottom: 12, color: "var(--text-muted)" }}>
              {t("night.wolfVictim")}:{" "}
              {gameState.players.find((p) => p.id === gameState.wolfVictim)?.name}
            </p>
          )}
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {gameState.wolfVictim && !gameState.witchHealUsed && (
              <button
                onClick={() => handleWitchAction({ heal: true })}
                style={{
                  padding: 16,
                  background: "var(--gradient-card)",
                  border: "1px solid #4ade80",
                  borderRadius: 12,
                  color: "#4ade80",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                {t("night.witchHeal")}
              </button>
            )}
            {!gameState.witchPoisonUsed && (
              <>
                <p style={{ color: "var(--text-muted)", fontSize: 14 }}>
                  {t("night.witchPoisonPrompt")}
                </p>
                {aliveOthers.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleWitchAction({ poisonTargetId: p.id })}
                    style={{
                      padding: 16,
                      background: "var(--gradient-card)",
                      border: "1px solid var(--accent-blood)",
                      borderRadius: 12,
                      color: "var(--accent-blood)",
                      fontSize: 16,
                      cursor: "pointer",
                      textAlign: "left",
                    }}
                  >
                    {p.name}
                  </button>
                ))}
              </>
            )}
            <button
              onClick={() => handleWitchAction({})}
              style={{
                padding: 16,
                background: "transparent",
                border: "1px solid var(--text-muted)",
                borderRadius: 12,
                color: "var(--text-primary)",
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              {t("night.witchSkip")}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
