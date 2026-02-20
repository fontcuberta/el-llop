import type { GameState, Player, Role, Winner } from "shared";

const ALL_ROLES: Role[] = [
  "wolf", "villager", "seer", "witch", "hunter", "cupid", "thief",
  "protector", "elder", "idiot", "littleGirl",
];

const PRESET_CLASSIC_8: Role[] = ["wolf", "villager", "villager", "villager", "villager", "seer", "witch", "hunter"];
const PRESET_BIG_12: Role[] = [
  "wolf", "wolf", "villager", "villager", "villager", "villager", "villager",
  "seer", "witch", "hunter", "cupid", "protector",
];

export function createInitialGameState(
  roomCode: string,
  players: Player[],
  roleDeck: Role[] = []
): GameState {
  const count = players.length;
  let roles: Role[];

  if (roleDeck.length === count) {
    roles = [...roleDeck];
  } else {
    roles = [];
    roles.push("wolf");
    if (count >= 6) roles.push("wolf");
    roles.push("seer");
    roles.push("witch");
    roles.push("hunter");
    roles.push("cupid");
    if (count >= 8) roles.push("thief");
    roles.push("protector");
    if (count >= 9) roles.push("elder");
    if (count >= 10) roles.push("idiot");
    if (count >= 11) roles.push("littleGirl");
    while (roles.length < count) roles.push("villager");
  }

  const shuffled = shuffle(roles);
  const assigned = players.map((p, i) => ({
    ...p,
    role: shuffled[i] ?? "villager",
    originalRole: shuffled[i] ?? "villager",
    alive: true,
    isCaptain: false,
    canVote: true,
  }));

  const hasThief = assigned.some((p) => p.role === "thief");
  let thiefChoices: Role[] | undefined;
  let currentRoleTurn: Role | undefined = "wolf";

  if (hasThief) {
    const pool: Role[] = ["wolf", "seer", "witch", "hunter", "villager"];
    const shuffled = shuffle(pool);
    thiefChoices = [shuffled[0], shuffled[1] === shuffled[0] ? "villager" : shuffled[1]];
    currentRoleTurn = "thief";
  } else {
    const hasCupid = assigned.some((p) => p.role === "cupid");
    if (hasCupid) currentRoleTurn = "cupid";
  }

  return {
    roomCode,
    phase: "captain",
    nightNumber: 1,
    players: assigned,
    witchHealUsed: false,
    witchPoisonUsed: false,
    deathsThisCycle: [],
    roleDeck: roles,
    currentRoleTurn,
    thiefChoices,
  };
}

export function getAlivePlayers(state: GameState): Player[] {
  return state.players.filter((p) => p.alive);
}

export function getWolves(state: GameState): Player[] {
  return state.players.filter((p) => p.alive && p.role === "wolf");
}

export function getVillagers(state: GameState): Player[] {
  return state.players.filter((p) => p.alive && p.role !== "wolf");
}

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function checkWin(state: GameState): Winner | null {
  const alive = getAlivePlayers(state);
  const wolves = alive.filter((p) => p.role === "wolf");
  const villagers = alive.filter((p) => p.role !== "wolf");

  if (wolves.length === 0) return "villagers";
  if (wolves.length >= villagers.length) return "wolves";

  const lovers = alive.filter(
    (p) => p.loverId && alive.some((a) => a.id === p.loverId)
  );
  if (alive.length === 2 && lovers.length === 2) {
    const [a, b] = lovers;
    if ((a.role === "wolf") !== (b.role === "wolf")) return "lovers";
  }

  return null;
}
