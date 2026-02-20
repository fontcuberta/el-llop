import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "./hooks/useAudio";
import { AudioManager } from "./audio/AudioManager";
import { HomeScreen } from "./components/lobby/HomeScreen";
import { LobbyScreen } from "./components/lobby/LobbyScreen";
import { GameScreen } from "./components/game/GameScreen";
import { MagicalSparkles } from "./components/illustrations";
import { socket } from "./socket";
import type { GameState } from "shared";

type Screen = "home" | "lobby" | "game";

export default function App() {
  useAudio();
  const [screen, setScreen] = useState<Screen>("home");
  const [roomCode, setRoomCode] = useState<string>("");
  const [gameState, setGameState] = useState<GameState | null>(null);

  useEffect(() => {
    const onGameState = (state: GameState) => {
      setGameState(state);
      if (state.phase === "lobby" || state.phase === "setup") {
        setScreen("lobby");
        setRoomCode(state.roomCode);
      } else {
        setScreen("game");
      }
    };
    socket.on("game_state", onGameState);
    return () => {
      socket.off("game_state", onGameState);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--gradient-night)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient bubbles / orbs - mystical village atmosphere */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          zIndex: 0,
        }}
      >
        <div
          className="float"
          style={{
            position: "absolute",
            width: 180,
            height: 180,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.25) 0%, transparent 70%)",
            top: "10%",
            left: "5%",
            animationDuration: "6s",
          }}
        />
        <div
          className="float"
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--glow-moon) 0%, transparent 70%)",
            top: "15%",
            left: "8%",
            animationDuration: "5s",
            animationDelay: "0.5s",
          }}
        />
        <div
          className="float glow-pulse"
          style={{
            position: "absolute",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background: "radial-gradient(circle, var(--glow-wolf) 0%, transparent 70%)",
            top: "50%",
            right: "8%",
            animationDelay: "1.5s",
            animationDuration: "6s",
          }}
        />
        <div
          className="float sparkle-twinkle"
          style={{
            position: "absolute",
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(34,211,238,0.35) 0%, transparent 70%)",
            top: "30%",
            right: "22%",
            animationDelay: "0.5s",
            animationDuration: "4s",
          }}
        />
        <div
          className="float"
          style={{
            position: "absolute",
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(233,180,76,0.2) 0%, transparent 70%)",
            bottom: "20%",
            left: "15%",
            animationDelay: "2s",
            animationDuration: "5.5s",
          }}
        />
        <div
          className="float glow-pulse"
          style={{
            position: "absolute",
            width: 70,
            height: 70,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(244,114,182,0.2) 0%, transparent 70%)",
            bottom: "35%",
            right: "18%",
            animationDelay: "1s",
            animationDuration: "4.5s",
          }}
        />
        <div style={{ position: "absolute", inset: 0 }}>
          <MagicalSparkles count={18} />
        </div>
      </div>

      {/* Mute toggle */}
      <button
        onClick={() => AudioManager.setMuted(!AudioManager.isMuted())}
        style={{
          position: "fixed",
          top: 16,
          right: 16,
          zIndex: 100,
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: "var(--bg-card)",
          border: "1px solid var(--accent-moon)",
          color: "var(--text-primary)",
          cursor: "pointer",
          fontSize: 18,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.9,
        }}
        title={AudioManager.isMuted() ? "Unmute" : "Mute"}
      >
        {AudioManager.isMuted() ? "🔇" : "🔊"}
      </button>

      <div style={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {screen === "home" && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <HomeScreen
                onCreatedRoom={(code) => {
                  setRoomCode(code);
                  setScreen("lobby");
                }}
                onJoinedRoom={(code) => {
                  setRoomCode(code);
                  setScreen("lobby");
                }}
              />
            </motion.div>
          )}

          {screen === "lobby" && (
            <motion.div
              key="lobby"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <LobbyScreen
                roomCode={roomCode}
                gameState={gameState}
                onBack={() => {
                  setScreen("home");
                  setRoomCode("");
                  setGameState(null);
                  try {
                    localStorage.removeItem("el-llop-reconnect");
                  } catch {
                    // ignore
                  }
                }}
                onGameState={setGameState}
              />
            </motion.div>
          )}

          {screen === "game" && gameState && (
            <motion.div
              key="game"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <GameScreen gameState={gameState} onGameState={setGameState} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
