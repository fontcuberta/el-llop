import { getAlivePlayers, checkWin } from "./GameState.js";
import { resolveNight } from "./resolution.js";
const NIGHT_ORDER = ["wolf", "seer", "witch", "protector"];
const NIGHT_1_PREFIX = ["thief", "cupid"];
export function getNextRoleTurn(state) {
    const prefix = state.nightNumber === 1 ? NIGHT_1_PREFIX : [];
    const order = [...prefix, ...NIGHT_ORDER];
    const currentIdx = order.indexOf(state.currentRoleTurn ?? "wolf");
    for (let i = currentIdx + 1; i < order.length; i++) {
        const role = order[i];
        const hasAlive = getAlivePlayers(state).some((p) => p.role === role);
        if (hasAlive)
            return role;
    }
    return null;
}
export function getFirstNightRole(state) {
    const prefix = state.nightNumber === 1 ? NIGHT_1_PREFIX : [];
    const order = [...prefix, ...NIGHT_ORDER];
    for (const role of order) {
        const hasAlive = getAlivePlayers(state).some((p) => p.role === role);
        if (hasAlive)
            return role;
    }
    return null;
}
export function advanceNightPhase(state) {
    const next = getNextRoleTurn(state);
    if (next) {
        return { currentRoleTurn: next };
    }
    return { currentRoleTurn: undefined };
}
export function resolveAndGoToDay(state) {
    const resolved = resolveNight(state);
    const hunterDeath = resolved.deathsThisCycle.find((d) => d.role === "hunter");
    if (hunterDeath) {
        resolved.phase = "hunter";
        resolved.hunterPending = hunterDeath.playerId;
        return resolved;
    }
    resolved.phase = "day";
    resolved.deathsThisCycle = resolved.deathsThisCycle ?? [];
    return resolved;
}
export function finishDayAndGoToNight(state) {
    const nextNight = state.nightNumber + 1;
    const winner = checkWin(state);
    if (winner) {
        return {
            ...state,
            phase: "ended",
            winner,
            nightNumber: nextNight,
            deathsThisCycle: [],
            voteCounts: undefined,
        };
    }
    for (const p of state.players) {
        p.votedFor = undefined;
    }
    return {
        ...state,
        phase: "night",
        nightNumber: nextNight,
        deathsThisCycle: [],
        voteCounts: undefined,
        lastIdiotRevealed: undefined,
        wolfTarget: undefined,
        wolfVictim: undefined,
        wolfVotes: undefined,
        witchHealTarget: undefined,
        witchPoisonTarget: undefined,
        protectorTarget: undefined,
        currentRoleTurn: getFirstNightRole({ ...state, nightNumber: nextNight }) ?? undefined,
    };
}
