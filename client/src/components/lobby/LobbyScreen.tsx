import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useSpeech } from "../../hooks/useSpeech";
import { socket } from "../../socket";
import { RoleConfig } from "./RoleConfig";
import { setLocale } from "../../i18n";
import { VillageScene, WerewolfSilhouette } from "../illustrations";
import type { GameState, Role } from "shared";
import type { Locale } from "shared";

interface LobbyScreenProps {
  roomCode: string;
  gameState: GameState | null;
  onBack: () => void;
  onGameState: (state: GameState | null) => void;
}

const DEFAULT_DECK: Role[] = ["wolf", "villager", "seer", "witch"];

const LOCALES: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "ca", label: "Català" },
];

export function LobbyScreen({ roomCode, gameState, onBack, onGameState }: LobbyScreenProps) {
  const { t } = useTranslation();
  const { speak } = useSpeech();
  const [roleDeck, setRoleDeck] = useState<Role[]>(DEFAULT_DECK);
  const playerCount = gameState?.players?.length ?? 0;
  const isHost = gameState && gameState.players?.[0]?.socketId === socket.id;

  useEffect(() => {
    if (gameState?.roleDeck?.length === playerCount && playerCount > 0) {
      setRoleDeck(gameState.roleDeck as Role[]);
    } else if (playerCount > 0 && roleDeck.length !== playerCount) {
      const base: Role[] = ["wolf", "seer", "witch", "hunter"];
      while (base.length < playerCount) base.push("villager");
      setRoleDeck(base.slice(0, playerCount) as Role[]);
    }
  }, [playerCount, gameState?.roleDeck]);

  useEffect(() => {
    const onLobbyUpdate = (state: GameState) => onGameState(state);
    socket.on("lobby_update", onLobbyUpdate);
    socket.emit("request_lobby_state", { roomCode });
    return () => {
      socket.off("lobby_update", onLobbyUpdate);
    };
  }, [roomCode, onGameState]);

  const handleDeckChange = (deck: Role[]) => {
    setRoleDeck(deck);
    if (deck.length === playerCount) {
      socket.emit("configure_roles", { roleDeck: deck });
    }
  };

  const handleBack = () => {
    try {
      localStorage.removeItem("el-llop-reconnect");
    } catch {
      // ignore
    }
    onBack();
  };

  const handleStart = () => {
    speak("tts.welcome");
    if (roleDeck.length === playerCount) {
      socket.emit("configure_roles", { roleDeck });
    }
    socket.emit("start_game", {}); // Will be wired when game logic exists
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: "center", marginBottom: 32 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            marginBottom: 12,
          }}
        >
          <WerewolfSilhouette size={52} mirror />
          <WerewolfSilhouette size={64} />
          <WerewolfSilhouette size={52} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            margin: 0,
            background: "linear-gradient(135deg, var(--accent-gold), var(--accent-moon))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("common.appName")}
        </h1>
        <motion.div style={{ marginTop: 16, opacity: 0.6 }}>
          <VillageScene variant="night" size={130} />
        </motion.div>
      </motion.div>

      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 16 }}>
        {LOCALES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLocale(value)}
            style={{
              padding: "6px 12px",
              border: "1px solid var(--accent-moon)",
              borderRadius: 8,
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 13,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: 24,
          background: "var(--gradient-card)",
          borderRadius: 16,
          border: "1px solid var(--accent-moon)",
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        <p style={{ color: "var(--text-muted)", margin: 0, fontSize: 14 }}>{t("lobby.roomCode")}</p>
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "2rem",
            letterSpacing: 8,
            margin: "8px 0 0",
            color: "var(--accent-gold)",
          }}
        >
          {roomCode}
        </p>
      </div>

      <div
        style={{
          padding: 24,
          background: "var(--bg-card)",
          borderRadius: 16,
          border: "1px solid rgba(255,255,255,0.1)",
          marginBottom: 24,
        }}
      >
        <p style={{ color: "var(--text-muted)", margin: "0 0 12px", fontSize: 14 }}>
          {t("lobby.players")} ({gameState?.players?.length ?? 0}/18)
        </p>
        {gameState?.players?.length ? (
          <ul style={{ listStyle: "none", padding: 0, margin: 0, textAlign: "left" }}>
            {gameState.players.map((p) => (
              <li
                key={p.id}
                style={{
                  padding: "8px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                {p.name}
                {p.socketId === gameState.players?.[0]?.socketId && (
                  <span style={{ color: "var(--accent-gold)", marginLeft: 8 }}>(host)</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "var(--text-muted)", margin: 0 }}>Waiting for players...</p>
        )}
      </div>

      <RoleConfig
        playerCount={playerCount || 4}
        currentDeck={roleDeck}
        onDeckChange={handleDeckChange}
        isHost={!!isHost}
      />

      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={handleBack}
          style={{
            padding: 16,
            background: "transparent",
            border: "1px solid var(--text-muted)",
            borderRadius: 12,
            color: "var(--text-primary)",
            cursor: "pointer",
            flex: 1,
          }}
        >
          Back
        </button>
        {gameState &&
        gameState.players?.[0]?.socketId === socket.id &&
        (gameState.players?.length ?? 0) >= 4 &&
        roleDeck.length === playerCount ? (
          <button
            onClick={handleStart}
            style={{
              padding: 16,
              background: "linear-gradient(135deg, var(--accent-gold), #c9a227)",
              border: "none",
              borderRadius: 12,
              color: "var(--bg-deep)",
              fontSize: 16,
              fontWeight: 600,
              cursor: "pointer",
              flex: 2,
            }}
          >
            {t("lobby.startGame")}
          </button>
        ) : gameState && gameState.players?.[0]?.socketId === socket.id ? (
          <div
            style={{
              flex: 2,
              padding: 16,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            {t("lobby.needMorePlayers")}
          </div>
        ) : (
          <div
            style={{
              flex: 2,
              padding: 16,
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 14,
            }}
          >
            {t("lobby.waitingForHost")}
          </div>
        )}
      </div>
    </div>
  );
}
