import type { GameState } from "shared";

export function resolveNight(state: GameState): GameState {
  const next = { ...state };
  next.deathsThisCycle = [];

  for (const p of next.players) {
    p.protectedTonight = false;
  }
  if (next.protectorTarget) {
    const prot = next.players.find((p) => p.id === next.protectorTarget);
    if (prot) prot.protectedTonight = true;
  }

  const wolfTarget = next.wolfTarget ?? next.wolfVictim;
  const witchHealTarget = next.witchHealTarget;
  const witchPoison = next.witchPoisonTarget;

  const toKill: string[] = [];

  if (wolfTarget) {
    const victim = next.players.find((p) => p.id === wolfTarget);
    if (victim) {
      const healed = witchHealTarget === wolfTarget && !next.witchHealUsed;
      const protected_ = victim.protectedTonight;
      if (!healed && !protected_) {
        if (victim.role === "elder" && !victim.isElder) {
          victim.isElder = true;
        } else {
          toKill.push(wolfTarget);
        }
      } else if (witchHealTarget === wolfTarget) {
        next.witchHealUsed = true;
      }
    }
  }

  if (witchPoison) {
    toKill.push(witchPoison);
    next.witchPoisonUsed = true;
  }

  const killed = [...new Set(toKill)];

  for (const id of killed) {
    const p = next.players.find((x) => x.id === id);
    if (p) {
      p.alive = false;
      next.deathsThisCycle.push({
        playerId: id,
        role: p.role,
        name: p.name,
      });

      if (p.loverId) {
        const lover = next.players.find((x) => x.id === p.loverId);
        if (lover?.alive) {
          lover.alive = false;
          next.deathsThisCycle.push({
            playerId: lover.id,
            role: lover.role,
            name: lover.name,
          });
        }
      }
    }
  }

  next.wolfTarget = undefined;
  next.wolfVictim = undefined;
  next.witchHealTarget = undefined;
  next.witchPoisonTarget = undefined;
  next.protectorTarget = undefined;

  return next;
}
