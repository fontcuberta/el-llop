import { Howl } from "howler";

export type MusicTrack = "night" | "day";

export type SfxId =
  | "nightFall"
  | "dayBreak"
  | "wolfHowl"
  | "death"
  | "vote"
  | "witchPotion"
  | "seerChime";

const MUSIC_PATHS: Record<MusicTrack, string> = {
  night: "/sounds/music-night.mp3",
  day: "/sounds/music-day.mp3",
};

const SFX_PATHS: Record<SfxId, string> = {
  nightFall: "/sounds/sfx-night-fall.mp3",
  dayBreak: "/sounds/sfx-day-break.mp3",
  wolfHowl: "/sounds/sfx-wolf-howls.mp3",
  death: "/sounds/sfx-death.mp3",
  vote: "/sounds/sfx-vote.mp3",
  witchPotion: "/sounds/sfx-witch-potion.mp3",
  seerChime: "/sounds/sfx-seer-chime.mp3",
};

class AudioManagerClass {
  private music: Partial<Record<MusicTrack, Howl>> = {};
  private sfx: Partial<Record<SfxId, Howl>> = {};
  private musicVolume = 0.4;
  private sfxVolume = 0.7;
  private muted = false;
  private initialized = false;

  init() {
    if (this.initialized) return;
    this.initialized = true;
  }

  playMusic(track: MusicTrack, fadeIn = true) {
    this.stopAllMusic();
    if (this.muted) return;
    if (!this.music[track]) {
      try {
        this.music[track] = new Howl({
          src: [MUSIC_PATHS[track]],
          loop: true,
          volume: fadeIn ? 0 : this.musicVolume,
          onloaderror: () => delete this.music[track],
        });
      } catch {
        return;
      }
    }
    const snd = this.music[track];
    if (snd) {
      snd.volume(fadeIn ? 0 : this.musicVolume);
      snd.play();
      if (fadeIn) snd.fade(0, this.musicVolume, 2000);
    }
  }

  stopAllMusic() {
    Object.values(this.music).forEach((snd) => snd?.stop());
  }

  fadeOutMusic(duration = 1500) {
    Object.values(this.music).forEach((snd) => {
      if (snd?.playing()) {
        snd.fade(this.musicVolume, 0, duration);
        setTimeout(() => snd.stop(), duration);
      }
    });
  }

  playSfx(id: SfxId) {
    if (this.muted) return;
    if (!this.sfx[id]) {
      try {
        this.sfx[id] = new Howl({
          src: [SFX_PATHS[id]],
          volume: this.sfxVolume,
          onloaderror: () => delete this.sfx[id],
        });
      } catch {
        return;
      }
    }
    this.sfx[id]?.play();
  }

  setVolume(music: number, sfx: number) {
    this.musicVolume = Math.max(0, Math.min(1, music));
    this.sfxVolume = Math.max(0, Math.min(1, sfx));
  }

  setMuted(muted: boolean) {
    this.muted = muted;
    if (muted) this.stopAllMusic();
  }

  isMuted() {
    return this.muted;
  }
}

export const AudioManager = new AudioManagerClass();
