import { useEffect } from "react";
import { AudioManager } from "../audio/AudioManager";

export function useAudio() {
  useEffect(() => {
    AudioManager.init();
  }, []);

  return {
    playMusic: AudioManager.playMusic.bind(AudioManager),
    playSfx: AudioManager.playSfx.bind(AudioManager),
    setMuted: AudioManager.setMuted.bind(AudioManager),
    isMuted: AudioManager.isMuted.bind(AudioManager),
    fadeOutMusic: AudioManager.fadeOutMusic.bind(AudioManager),
  };
}
