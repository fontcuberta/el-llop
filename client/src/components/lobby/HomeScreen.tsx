import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { RECONNECT_STORAGE_KEY, type ReconnectData } from "shared";
import { motion } from "framer-motion";
import { socket } from "../../socket";
import { setLocale } from "../../i18n";
import type { Locale } from "shared";
import { WerewolfHero } from "../shared/WerewolfHero";
import { WerewolfSilhouette } from "../shared/WerewolfSilhouette";

interface HomeScreenProps {
  onCreatedRoom: (roomCode: string) => void;
  onJoinedRoom: (roomCode: string) => void;
}

const LOCALES: { value: Locale; label: string }[] = [
  { value: "es", label: "Español" },
  { value: "en", label: "English" },
  { value: "ca", label: "Català" },
];

export function HomeScreen({ onCreatedRoom, onJoinedRoom }: HomeScreenProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<"choose" | "create" | "join">("choose");
  const [name, setName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const onCreated = ({ roomCode, playerId }: { roomCode: string; playerId?: string }) => {
      if (playerId && name) {
        const data: ReconnectData = { roomCode, playerId, playerName: name };
        localStorage.setItem(RECONNECT_STORAGE_KEY, JSON.stringify(data));
      }
      onCreatedRoom(roomCode);
    };
    const onJoined = ({ roomCode, playerId }: { roomCode: string; playerId?: string }) => {
      if (playerId && name) {
        const data: ReconnectData = { roomCode, playerId, playerName: name };
        localStorage.setItem(RECONNECT_STORAGE_KEY, JSON.stringify(data));
      }
      onJoinedRoom(roomCode);
    };
    const onJoinError = ({ error }: { error: string }) => setError(error);
    socket.on("room_created", onCreated);
    socket.on("room_joined", onJoined);
    socket.on("join_error", onJoinError);
    return () => {
      socket.off("room_created", onCreated);
      socket.off("room_joined", onJoined);
      socket.off("join_error", onJoinError);
    };
  }, [onCreatedRoom, onJoinedRoom]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) return;
    socket.emit("create_room", name.trim());
  };

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name.trim() || !roomCode.trim()) return;
    socket.emit("join_room", { roomCode: roomCode.trim().toUpperCase(), playerName: name.trim() });
  };

  return (
    <div style={{ padding: 24, maxWidth: 400, margin: "0 auto", minHeight: "100vh" }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{ textAlign: "center", marginBottom: 24 }}
      >
        {/* Magical werewolf pack */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: 4,
            marginBottom: 12,
            minHeight: 162,
          }}
        >
          <WerewolfSilhouette size={56} mirror delay={0.1} />
          <WerewolfSilhouette size={72} mirror delay={0.05} />
          <WerewolfHero size={200} />
          <WerewolfSilhouette size={72} delay={0.15} />
          <WerewolfSilhouette size={56} delay={0.2} />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2.5rem",
            margin: 0,
            background: "linear-gradient(135deg, var(--accent-gold), var(--accent-moon))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t("common.appName")}
        </h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          style={{ color: "var(--text-muted)", marginTop: 8 }}
        >
          Werewolves
        </motion.p>
      </motion.div>

      {/* Language selector */}
      <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
        {LOCALES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setLocale(value)}
            style={{
              padding: "8px 16px",
              border: "1px solid var(--accent-moon)",
              borderRadius: 8,
              background: "transparent",
              color: "var(--text-primary)",
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "choose" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <motion.button
            onClick={() => setMode("create")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(233, 69, 96, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: 20,
              background: "var(--gradient-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {t("lobby.createRoom")}
          </motion.button>
          <motion.button
            onClick={() => setMode("join")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02, boxShadow: "0 8px 30px rgba(233, 180, 76, 0.2)" }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: 20,
              background: "var(--gradient-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 18,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
            }}
          >
            {t("lobby.joinRoom")}
          </motion.button>
        </motion.div>
      )}

      {mode === "create" && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleCreate}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input
            type="text"
            placeholder={t("lobby.yourName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={20}
            style={{
              padding: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 16,
            }}
          />
          {error && <p style={{ color: "var(--accent-blood)", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => { setMode("choose"); setError(""); }}
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
            <button
              type="submit"
              disabled={!name.trim()}
              style={{
                padding: 16,
                background: "linear-gradient(135deg, var(--accent-gold), #c9a227)",
                border: "none",
                borderRadius: 12,
                color: "var(--bg-deep)",
                fontSize: 16,
                fontWeight: 600,
                cursor: name.trim() ? "pointer" : "not-allowed",
                flex: 2,
              }}
            >
              {t("lobby.createRoom")}
            </button>
          </div>
        </motion.form>
      )}

      {mode === "join" && (
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onSubmit={handleJoin}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <input
            type="text"
            placeholder={t("lobby.roomCode")}
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
            maxLength={5}
            style={{
              padding: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          />
          <input
            type="text"
            placeholder={t("lobby.yourName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={20}
            style={{
              padding: 16,
              background: "var(--bg-card)",
              border: "1px solid var(--accent-moon)",
              borderRadius: 12,
              color: "var(--text-primary)",
              fontSize: 16,
            }}
          />
          {error && <p style={{ color: "var(--accent-blood)", margin: 0 }}>{error}</p>}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              onClick={() => { setMode("choose"); setError(""); }}
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
            <button
              type="submit"
              disabled={!name.trim() || !roomCode.trim()}
              style={{
                padding: 16,
                background: "linear-gradient(135deg, var(--accent-gold), #c9a227)",
                border: "none",
                borderRadius: 12,
                color: "var(--bg-deep)",
                fontSize: 16,
                fontWeight: 600,
                cursor: name.trim() && roomCode.trim() ? "pointer" : "not-allowed",
                flex: 2,
              }}
            >
              {t("lobby.joinRoom")}
            </button>
          </div>
        </motion.form>
      )}
    </div>
  );
}
