import { createRoom, joinRoom as doJoinRoom, getRoom, getRoomBySocket, startGame, applyNightAction, applyHunterAction, submitVote, submitCaptainVote, allHaveVoted, executeLynch, isHost, } from "./rooms.js";
import { filterGameStateForPlayer } from "./game/filterState.js";
async function broadcastGameState(io, roomCode) {
    const state = getRoom(roomCode);
    if (!state)
        return;
    const sockets = await io.in(roomCode).fetchSockets();
    for (const s of sockets) {
        const filtered = filterGameStateForPlayer(state, s.id);
        s.emit("game_state", filtered);
    }
}
export function registerSocketHandlers(io) {
    io.on("connection", (socket) => {
        socket.on("create_room", (playerName) => {
            const { code, hostId } = createRoom(socket.id, playerName);
            socket.join(code);
            socket.emit("room_created", { roomCode: code, playerId: hostId });
            io.to(code).emit("lobby_update", getRoom(code));
        });
        socket.on("join_room", (payload) => {
            const { roomCode, playerName } = payload;
            const result = doJoinRoom(roomCode, socket.id, playerName);
            if (!result.success) {
                socket.emit("join_error", { error: result.error });
                return;
            }
            const code = roomCode.toUpperCase();
            socket.join(code);
            socket.emit("room_joined", { roomCode: code, playerId: result.playerId });
            io.to(code).emit("lobby_update", getRoom(code));
        });
        socket.on("request_lobby_state", (payload) => {
            const state = getRoom(payload.roomCode);
            if (state && state.phase === "lobby") {
                socket.emit("lobby_update", state);
            }
        });
        socket.on("configure_roles", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room || room.phase !== "lobby")
                return;
            if (!isHost(room, socket.id))
                return;
            const count = room.players.length;
            if (payload.roleDeck && payload.roleDeck.length === count) {
                room.roleDeck = payload.roleDeck;
                io.to(room.roomCode).emit("lobby_update", room);
            }
        });
        socket.on("start_game", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room) {
                socket.emit("game_error", { error: "Not in a room" });
                return;
            }
            if (!isHost(room, socket.id)) {
                socket.emit("game_error", { error: "Only host can start" });
                return;
            }
            const result = startGame(room.roomCode);
            if (!result.success) {
                socket.emit("game_error", { error: result.error });
                return;
            }
            broadcastGameState(io, room.roomCode);
        });
        socket.on("night_action", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room)
                return;
            const result = applyNightAction(room.roomCode, socket.id, payload);
            if (!result.success) {
                socket.emit("game_error", { error: result.error });
                return;
            }
            broadcastGameState(io, room.roomCode);
        });
        socket.on("captain_vote", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room)
                return;
            const result = submitCaptainVote(room.roomCode, socket.id, payload.targetId);
            if (!result.success) {
                socket.emit("game_error", { error: result.error });
                return;
            }
            broadcastGameState(io, room.roomCode);
        });
        socket.on("hunter_action", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room)
                return;
            const result = applyHunterAction(room.roomCode, socket.id, payload.targetId);
            if (!result.success) {
                socket.emit("game_error", { error: result.error });
                return;
            }
            broadcastGameState(io, room.roomCode);
        });
        socket.on("vote", (payload) => {
            const room = getRoomBySocket(socket.id);
            if (!room)
                return;
            const result = submitVote(room.roomCode, socket.id, payload.targetId);
            if (!result.success) {
                socket.emit("game_error", { error: result.error });
                return;
            }
            const state = getRoom(room.roomCode);
            if (state && allHaveVoted(state)) {
                executeLynch(room.roomCode);
            }
            broadcastGameState(io, room.roomCode);
        });
        socket.on("reconnect_player", (payload) => {
            const room = getRoom(payload.roomCode);
            if (!room)
                return;
            const player = room.players.find((p) => p.id === payload.playerId);
            if (!player)
                return;
            player.socketId = socket.id;
            socket.join(room.roomCode);
            broadcastGameState(io, room.roomCode);
        });
        socket.on("request_game_state", () => {
            const room = getRoomBySocket(socket.id);
            if (room) {
                const filtered = filterGameStateForPlayer(room, socket.id);
                socket.emit("game_state", filtered);
            }
        });
        socket.on("disconnect", () => {
            const room = getRoomBySocket(socket.id);
            if (room && room.phase === "lobby") {
                room.players = room.players.filter((p) => p.socketId !== socket.id);
                if (room.players.length === 0) {
                    // Room empty - could cleanup
                }
                else {
                    io.to(room.roomCode).emit("lobby_update", room);
                }
            }
        });
    });
}
