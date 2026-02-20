import type { GameState, Player, Role } from "shared";
import { createInitialGameState } from "./game/GameState.js";
import {
  resolveAndGoToDay,
  finishDayAndGoToNight,
  getNextRoleTurn,
  getFirstNightRole,
} from "./game/stateMachine.js";
import { checkWin } from "./game/GameState.js";

const rooms = new Map<string, GameState>();

const ROOM_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const ROOM_CODE_LEN = 5;

export function generateRoomCode(): string {
  let code = "";
  for (let i = 0; i < ROOM_CODE_LEN; i++) {
    code += ROOM_CODE_CHARS[Math.floor(Math.random() * ROOM_CODE_CHARS.length)];
  }
  return code;
}

export function createRoom(hostSocketId: string, hostName: string): { code: string; hostId: string } {
  const code = generateRoomCode();
  const host: Player = {
    id: crypto.randomUUID(),
    socketId: hostSocketId,
    name: hostName,
    role: "villager",
    alive: true,
    isCaptain: false,
  };

  const state: GameState = {
    roomCode: code,
    phase: "lobby",
    nightNumber: 0,
    players: [host],
    witchHealUsed: false,
    witchPoisonUsed: false,
    deathsThisCycle: [],
    roleDeck: ["wolf", "villager", "seer", "witch"],
  };

  rooms.set(code, state);
  return { code, hostId: host.id };
}

export function startGame(roomCode: string): { success: boolean; error?: string } {
  const state = rooms.get(roomCode);
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "lobby") return { success: false, error: "Game already started" };
  if (state.players.length < 4) return { success: false, error: "Need at least 4 players" };

  const roleDeck =
    state.roleDeck.length === state.players.length
      ? (state.roleDeck as Role[])
      : [];
  const newState = createInitialGameState(roomCode, state.players, roleDeck);
  rooms.set(roomCode, newState);
  return { success: true };
}

export function applyNightAction(
  roomCode: string,
  socketId: string,
  payload: {
    targetId?: string;
    heal?: boolean;
    poisonTargetId?: string;
    thiefRole?: Role;
    cupidTarget1?: string;
    cupidTarget2?: string;
    protectorTargetId?: string;
  }
): { success: boolean; error?: string } {
  const state = rooms.get(roomCode);
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "night") return { success: false, error: "Not night phase" };

  const player = state.players.find((p) => p.socketId === socketId);
  if (!player || !player.alive) return { success: false, error: "Invalid player" };

  const advanceAndMaybeResolve = () => {
    const next = getNextRoleTurn(state);
    state.currentRoleTurn = next ?? undefined;
    if (!next) {
      const dayState = resolveAndGoToDay(state);
      rooms.set(roomCode, dayState);
    }
  };

  if (state.currentRoleTurn === "wolf" && player.role === "wolf") {
    if (payload.targetId && state.players.some((p) => p.id === payload.targetId && p.alive)) {
      state.wolfVotes = state.wolfVotes ?? {};
      state.wolfVotes[socketId] = payload.targetId;
      const wolves = state.players.filter((p) => p.alive && p.role === "wolf");
      const voted = Object.keys(state.wolfVotes).length;
      if (voted >= wolves.length) {
        const counts: Record<string, number> = {};
        for (const t of Object.values(state.wolfVotes)) {
          counts[t] = (counts[t] ?? 0) + 1;
        }
        let max = 0;
        let pick = payload.targetId;
        for (const [id, n] of Object.entries(counts)) {
          if (n > max) {
            max = n;
            pick = id;
          }
        }
        state.wolfTarget = pick;
        state.wolfVictim = pick;
        state.wolfVotes = undefined;
        advanceAndMaybeResolve();
      }
      return { success: true };
    }
  }

  if (state.currentRoleTurn === "seer" && player.role === "seer") {
    if (payload.targetId) {
      state.seerTarget = payload.targetId;
      advanceAndMaybeResolve();
      return { success: true };
    }
  }

  if (state.currentRoleTurn === "witch" && player.role === "witch") {
    if (payload.heal && state.wolfVictim && !state.witchHealUsed) {
      state.witchHealTarget = state.wolfVictim;
    }
    if (payload.poisonTargetId && !state.witchPoisonUsed) {
      state.witchPoisonTarget = payload.poisonTargetId;
    }
    advanceAndMaybeResolve();
    return { success: true };
  }

  if (state.currentRoleTurn === "thief" && player.role === "thief" && state.thiefChoices) {
    if (payload.thiefRole && state.thiefChoices.includes(payload.thiefRole)) {
      player.role = payload.thiefRole;
      player.originalRole = payload.thiefRole;
      state.thiefChoices = undefined;
      advanceAndMaybeResolve();
      return { success: true };
    }
  }

  if (state.currentRoleTurn === "cupid" && player.role === "cupid") {
    if (payload.cupidTarget1 && payload.cupidTarget2 && payload.cupidTarget1 !== payload.cupidTarget2) {
      const p1 = state.players.find((p) => p.id === payload.cupidTarget1);
      const p2 = state.players.find((p) => p.id === payload.cupidTarget2);
      if (p1 && p2) {
        p1.loverId = p2.id;
        p2.loverId = p1.id;
        state.cupidTargets = undefined;
        advanceAndMaybeResolve();
        return { success: true };
      }
    }
  }

  if (state.currentRoleTurn === "protector" && player.role === "protector") {
    if (
      payload.protectorTargetId &&
      state.players.some((p) => p.id === payload.protectorTargetId && p.alive)
    ) {
      state.protectorTarget = payload.protectorTargetId;
      advanceAndMaybeResolve();
      return { success: true };
    }
  }

  return { success: false, error: "Invalid action" };
}

export function applyHunterAction(
  roomCode: string,
  socketId: string,
  targetId: string
): { success: boolean; error?: string } {
  const state = rooms.get(roomCode);
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "hunter") return { success: false, error: "Not hunter phase" };
  if (!state.hunterPending) return { success: false, error: "No hunter pending" };

  const hunter = state.players.find((p) => p.id === state.hunterPending);
  if (!hunter || hunter.socketId !== socketId) return { success: false, error: "Not the hunter" };

  const target = state.players.find((p) => p.id === targetId && p.alive);
  if (!target) return { success: false, error: "Invalid target" };

  target.alive = false;
  state.deathsThisCycle.push({
    playerId: target.id,
    role: target.role,
    name: target.name,
  });

  if (target.loverId) {
    const lover = state.players.find((x) => x.id === target.loverId);
    if (lover?.alive) {
      lover.alive = false;
      state.deathsThisCycle.push({
        playerId: lover.id,
        role: lover.role,
        name: lover.name,
      });
    }
  }

  state.hunterPending = undefined;
  const winner = checkWin(state);
  if (winner) {
    state.phase = "ended";
    state.winner = winner;
  } else {
    state.phase = "day";
  }
  state.deathsThisCycle = state.deathsThisCycle ?? [];
  return { success: true };
}

export function advanceToDay(roomCode: string): GameState | null {
  const state = rooms.get(roomCode);
  if (!state || state.phase !== "night") return null;
  const next = resolveAndGoToDay(state);
  rooms.set(roomCode, next);
  return next;
}

export function submitCaptainVote(
  roomCode: string,
  socketId: string,
  targetId: string
): { success: boolean; error?: string } {
  const state = rooms.get(roomCode);
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "captain") return { success: false, error: "Not captain phase" };

  const voter = state.players.find((p) => p.socketId === socketId);
  if (!voter) return { success: false, error: "Invalid voter" };

  const target = state.players.find((p) => p.id === targetId);
  if (!target) return { success: false, error: "Invalid target" };

  state.captainVotes = state.captainVotes ?? {};
  state.captainVotes[socketId] = targetId;
  voter.votedForCaptain = targetId;

  const voted = Object.keys(state.captainVotes).length;
  if (voted >= state.players.length) {
    const counts: Record<string, number> = {};
    for (const tid of Object.values(state.captainVotes)) {
      counts[tid] = (counts[tid] ?? 0) + 1;
    }
    let max = 0;
    let captainId: string | null = null;
    for (const [id, n] of Object.entries(counts)) {
      if (n > max) {
        max = n;
        captainId = id;
      }
    }
    if (captainId) {
      const captain = state.players.find((p) => p.id === captainId);
      if (captain) {
        captain.isCaptain = true;
        state.captainId = captainId;
      }
    }
    state.phase = "night";
    state.currentRoleTurn = state.currentRoleTurn ?? "wolf";
    state.captainVotes = undefined;
  }
  return { success: true };
}

export function submitVote(
  roomCode: string,
  socketId: string,
  targetId: string
): { success: boolean; error?: string } {
  const state = rooms.get(roomCode);
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "day") return { success: false, error: "Not day phase" };

  const voter = state.players.find((p) => p.socketId === socketId);
  if (!voter || !voter.alive) return { success: false, error: "Invalid voter" };

  const target = state.players.find((p) => p.id === targetId && p.alive);
  if (!target) return { success: false, error: "Invalid target" };

  state.voteCounts = state.voteCounts ?? {};
  state.voteCounts[targetId] = (state.voteCounts[targetId] ?? 0) + 1;
  voter.votedFor = targetId;
  return { success: true };
}

export function executeLynch(roomCode: string): GameState | null {
  const state = rooms.get(roomCode);
  if (!state || state.phase !== "day") return null;

  const alive = state.players.filter((p) => p.alive && p.canVote !== false);
  const voted = alive.filter((p) => p.votedFor);
  if (voted.length < alive.length) return null;

  const counts = state.voteCounts ?? {};
  const captain = state.players.find((p) => p.isCaptain && p.alive);
  if (captain?.votedFor) {
    counts[captain.votedFor] = (counts[captain.votedFor] ?? 0) + 1;
  }
  let maxVotes = 0;
  let executeId: string | null = null;
  let tieIds: string[] = [];
  for (const [id, n] of Object.entries(counts)) {
    if (n > maxVotes) {
      maxVotes = n;
      executeId = id;
      tieIds = [id];
    } else if (n === maxVotes) {
      tieIds.push(id);
    }
  }
  if (tieIds.length > 1 && captain?.votedFor && tieIds.includes(captain.votedFor)) {
    executeId = captain.votedFor;
  }

  if (executeId) {
    const executed = state.players.find((p) => p.id === executeId);
    if (executed) {
      if (executed.role === "idiot" && !executed.idiotRevealed) {
        executed.idiotRevealed = true;
        executed.canVote = false;
        state.lastIdiotRevealed = executed.name;
        state.deathsThisCycle = [];
        const next = finishDayAndGoToNight(state);
        rooms.set(roomCode, next);
        return next;
      }

      executed.alive = false;
      state.deathsThisCycle.push({
        playerId: executed.id,
        role: executed.role,
        name: executed.name,
      });

      if (executed.role === "hunter") {
        state.phase = "hunter";
        state.hunterPending = executed.id;
        rooms.set(roomCode, state);
        return state;
      }
    }
  }

  const next = finishDayAndGoToNight(state);
  rooms.set(roomCode, next);
  return next;
}

export function allHaveVoted(state: GameState): boolean {
  const canVote = state.players.filter((p) => p.alive && p.canVote !== false);
  return canVote.every((p) => p.votedFor);
}

export function joinRoom(
  code: string,
  socketId: string,
  playerName: string
): { success: boolean; playerId?: string; error?: string } {
  const state = rooms.get(code.toUpperCase());
  if (!state) return { success: false, error: "Room not found" };
  if (state.phase !== "lobby") return { success: false, error: "Game already started" };
  if (state.players.some((p) => p.name === playerName))
    return { success: false, error: "Name taken" };
  if (state.players.length >= 18) return { success: false, error: "Room full" };

  const player: Player = {
    id: crypto.randomUUID(),
    socketId,
    name: playerName,
    role: "villager",
    alive: true,
    isCaptain: false,
  };

  state.players.push(player);
  return { success: true, playerId: player.id };
}

export function getRoom(code: string): GameState | undefined {
  return rooms.get(code.toUpperCase());
}

export function getRoomBySocket(socketId: string): GameState | undefined {
  for (const room of rooms.values()) {
    if (room.players.some((p) => p.socketId === socketId)) return room;
  }
  return undefined;
}

export function getPlayer(room: GameState, socketId: string): Player | undefined {
  return room.players.find((p) => p.socketId === socketId);
}

export function isHost(room: GameState, socketId: string): boolean {
  return room.players[0]?.socketId === socketId;
}
