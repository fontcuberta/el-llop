import { io } from "socket.io-client";
import { RECONNECT_STORAGE_KEY } from "shared";

const origin =
  typeof window !== "undefined"
    ? window.location.origin
    : "http://localhost:5173";

export const socket = io(origin, {
  path: "/socket.io",
  transports: ["websocket", "polling"],
});

if (typeof window !== "undefined") {
  socket.on("connect", () => {
    try {
      const raw = localStorage.getItem(RECONNECT_STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      if (data.roomCode && data.playerId) {
        socket.emit("reconnect_player", { roomCode: data.roomCode, playerId: data.playerId });
      }
    } catch {
      // ignore
    }
  });
}
