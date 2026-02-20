/**
 * Sound asset slots - add MP3/OGG files to client/public/sounds/
 *
 * Music (loop, ambient):
 * - music-night.mp3 - mystical night forest, tension
 * - music-day.mp3   - calmer day variant
 *
 * SFX:
 * - sfx-night-fall.mp3   - low rumble, wind
 * - sfx-day-break.mp3    - birds, dawn chord
 * - sfx-wolf-howls.mp3   - wolf howl
 * - sfx-death.mp3        - somber tone
 * - sfx-vote.mp3         - drum beat
 * - sfx-witch-potion.mp3 - bubbling, magical
 * - sfx-seer-chime.mp3   - crystal / chime
 */

export const SOUND_PATHS = {
  music: {
    night: "/sounds/music-night.mp3",
    day: "/sounds/music-day.mp3",
  },
  sfx: {
    nightFall: "/sounds/sfx-night-fall.mp3",
    dayBreak: "/sounds/sfx-day-break.mp3",
    wolfHowl: "/sounds/sfx-wolf-howls.mp3",
    death: "/sounds/sfx-death.mp3",
    vote: "/sounds/sfx-vote.mp3",
    witchPotion: "/sounds/sfx-witch-potion.mp3",
    seerChime: "/sounds/sfx-seer-chime.mp3",
  },
} as const;
