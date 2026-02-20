import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { registerSocketHandlers } from "./socketHandlers.js";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: { origin: "*" },
});

registerSocketHandlers(io);

app.use(express.static(path.join(__dirname, "../public")));

const PORT = process.env.PORT || 3010;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
