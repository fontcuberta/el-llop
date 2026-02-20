# El llop – Werewolves

A multi-device Werewolves (Loups-Garous) game with text-to-speech narration, i18n (ES/EN/CA), and a dark mystical aesthetic.

## Run locally

```bash
npm install
npm run dev
```

- **Client**: http://localhost:5173 (or next available port if in use)
- **Server**: http://localhost:3010

The client proxies `/socket.io` to the server. Add sound files to `client/public/sounds/` (see `client/public/sounds/README.md`).

## How to play

1. **Create** or **Join** a game using the room code.
2. Host **Configure roles** (presets: Classic 8, Big 12, or custom add/remove).
3. Host **Start** once 4–18 players are in the lobby.
4. **Captain phase**: Elect the captain (vote counts double, breaks ties).
5. **Night** (in order): Thief (night 1), Cupid (night 1), Wolves, Seer, Witch, Protector. Each role acts when prompted.
6. **Day**: Deaths announced. Discuss and vote to lynch.
7. **Hunter phase**: If Hunter dies, they shoot one player before leaving.
8. Game ends when Wolves, Villagers, or Lovers win.

## Roles

- **Wolf** – Kills one villager each night (all wolves vote)
- **Villager** – Votes during the day
- **Seer** – Investigates one player’s role each night
- **Witch** – One heal, one poison per game
- **Hunter** – On death, kills one player
- **Cupid** – Night 1: choose two lovers (they win together if last two)
- **Thief** – Night 1: swap for one of two random roles
- **Protector** – Protect one player each night
- **Elder** – Survives first wolf attack
- **Idiot** – When lynched, revealed but not killed (cannot vote after)
- **Little Girl** – During wolf phase, sees wolf identities

## Features

- Multi-device (one phone per player, same room)
- Text-to-speech for all phases (Spanish, English, Catalan)
- TTS fallback: large text + “Read aloud” when unavailable
- Dark-only mystical UI with floating orbs and animations
- Role presets and custom configuration
- Reconnection (stores room + player in localStorage)
- Volume/mute toggle

## Tech stack

- **Backend**: Node.js, Express, Socket.io
- **Frontend**: React, TypeScript, Vite, Framer Motion
- **i18n**: react-i18next (ES/EN/CA)
