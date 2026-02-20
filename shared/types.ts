export type Phase =
  | "lobby"
  | "setup"
  | "captain"
  | "night"
  | "day"
  | "hunter"
  | "ended";

export type Role =
  | "wolf"
  | "villager"
  | "seer"
  | "witch"
  | "hunter"
  | "cupid"
  | "thief"
  | "protector"
  | "elder"
  | "idiot"
  | "littleGirl";

export type Winner = "wolves" | "villagers" | "lovers";

export interface Player {
  id: string;
  socketId: string;
  name: string;
  role: Role;
  roleKnown?: boolean;
  originalRole?: Role;
  alive: boolean;
  isCaptain: boolean;
  loverId?: string;
  protectedTonight?: boolean;
  isElder?: boolean;
  votedFor?: string;
  idiotRevealed?: boolean;
  canVote?: boolean;
  votedForCaptain?: string;
}

export const RECONNECT_STORAGE_KEY = "el-llop-reconnect";

export interface ReconnectData {
  roomCode: string;
  playerId: string;
  playerName: string;
}

export interface GameState {
  roomCode: string;
  phase: Phase;
  nightNumber: number;
  players: Player[];
  captainId?: string;
  wolfTarget?: string;
  wolfVictim?: string;
  wolfVotes?: Record<string, string>;
  witchHealUsed: boolean;
  witchHealTarget?: string;
  witchPoisonUsed: boolean;
  witchPoisonTarget?: string;
  seerTarget?: string;
  protectorTarget?: string;
  voteCounts?: Record<string, number>;
  deathsThisCycle: { playerId: string; role: Role; name: string }[];
  winner?: Winner;
  roleDeck: Role[];
  currentRoleTurn?: Role;
  seerReveal?: { targetId: string; role: Role; name: string };
  thiefChoices?: Role[];
  hunterPending?: string;
  cupidTargets?: string[];
  lastIdiotRevealed?: string;
  captainVotes?: Record<string, string>;
}

export type Locale = "es" | "en" | "ca";
