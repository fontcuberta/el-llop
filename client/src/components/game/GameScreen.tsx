import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useSpeech } from "../../hooks/useSpeech";
import { AudioManager } from "../../audio/AudioManager";
import { socket } from "../../socket";
import { CaptainPhase } from "./CaptainPhase";
import { NightPhase } from "./NightPhase";
import { DayPhase } from "./DayPhase";
import { HunterPhase } from "./HunterPhase";
import { EndedPhase } from "./EndedPhase";
import type { GameState } from "shared";

interface GameScreenProps {
  gameState: GameState;
  onGameState: (state: GameState) => void;
}

const ROLE_KEYS: Record<string, string> = {
  wolf: "roles.wolf",
  villager: "roles.villager",
  seer: "roles.seer",
  witch: "roles.witch",
  hunter: "roles.hunter",
  cupid: "roles.cupid",
  thief: "roles.thief",
  protector: "roles.protector",
  elder: "roles.elder",
  idiot: "roles.idiot",
  littleGirl: "roles.littleGirl",
};

export function GameScreen({ gameState, onGameState }: GameScreenProps) {
  const { t } = useTranslation();
  const { speak } = useSpeech();

  useEffect(() => {
    const handler = (state: GameState) => onGameState(state);
    socket.on("game_state", handler);
    socket.emit("request_game_state");
    return () => {
      socket.off("game_state", handler);
    };
  }, [onGameState]);

  const prevPhaseRef = useRef<string>(gameState.phase);

  useEffect(() => {
    const phase = gameState.phase;
    if (phase !== prevPhaseRef.current) {
      prevPhaseRef.current = phase;
      if (phase === "night") {
        AudioManager.fadeOutMusic(1000);
        setTimeout(() => {
          AudioManager.playMusic("night", true);
          AudioManager.playSfx("nightFall");
        }, 500);
      } else if (phase === "day") {
        AudioManager.fadeOutMusic(1000);
        setTimeout(() => {
          AudioManager.playMusic("day", true);
          AudioManager.playSfx("dayBreak");
        }, 500);
      } else if (phase === "ended") {
        AudioManager.fadeOutMusic(800);
        AudioManager.playSfx("death");
      }
    }
  }, [gameState.phase]);

  useEffect(() => {
    if (gameState.phase === "day" && gameState.deathsThisCycle?.length) {
      speak("tts.sunRises");
      gameState.deathsThisCycle.forEach((d, i) => {
        setTimeout(
          () =>
            speak("tts.wasKilled", {
              name: d.name,
              role: t(ROLE_KEYS[d.role] ?? d.role),
            }),
          (i + 1) * 800
        );
      });
    }
  }, [gameState.phase, gameState.nightNumber]);

  if (gameState.phase === "captain") {
    return <CaptainPhase gameState={gameState} />;
  }
  if (gameState.phase === "night") {
    return <NightPhase gameState={gameState} />;
  }
  if (gameState.phase === "hunter") {
    return <HunterPhase gameState={gameState} />;
  }
  if (gameState.phase === "day") {
    return <DayPhase gameState={gameState} />;
  }
  if (gameState.phase === "ended") {
    return <EndedPhase gameState={gameState} />;
  }

  return null;
}
