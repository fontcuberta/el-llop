export function filterGameStateForPlayer(state, socketId) {
    const me = state.players.find((p) => p.socketId === socketId);
    if (!me)
        return state;
    const filtered = {
        ...state,
        players: state.players.map((p) => ({ ...p })),
    };
    if (state.phase === "lobby" || state.phase === "captain")
        return filtered;
    const isWolf = me.role === "wolf";
    const isDead = !me.alive;
    const isSeer = me.role === "seer";
    const isLittleGirl = me.role === "littleGirl";
    if (isSeer && state.seerTarget) {
        const target = state.players.find((p) => p.id === state.seerTarget);
        if (target) {
            filtered.seerReveal = {
                targetId: target.id,
                role: target.role,
                name: target.name,
            };
        }
    }
    for (const p of filtered.players) {
        let canSeeRole = p.socketId === socketId ||
            isDead ||
            (isWolf && p.role === "wolf");
        if (isLittleGirl && state.currentRoleTurn === "wolf" && p.role === "wolf") {
            canSeeRole = true;
        }
        p.roleKnown = canSeeRole;
        if (!canSeeRole) {
            p.role = "villager";
        }
    }
    return filtered;
}
