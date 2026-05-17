# Music Player

A Nothing OS–inspired audio player built for the **Significa Design Front-End Challenge**.

The challenge asked for an audio player that can play/pause, skip next/previous,
with optional volume, shuffle, and loop. This implementation adds a real-time
audio-reactive visualizer and a spinning vinyl disc, with the UI polish and
attention to detail the brief calls for.

## Features

- Play / pause, next / previous
- Shuffle (Fisher–Yates, current track pinned first)
- Loop modes: off → all → one
- Click-to-seek progress bar
- Keyboard shortcuts (space, arrows, `S`, `L`)
- Audio-reactive dot-grid visualizer driven by live frequency analysis
- Spinning disc with momentum, zoom-to-focus, and a directional spin burst on skip
- Beat-synced transition blip whose pitch tracks the outgoing track's bass energy
- Light / dark theme toggle

## Tech stack

| Tool | Why it's here |
|------|---------------|
| **Next.js 16** (App Router) | App shell, routing, font loading via `next/font`. |
| **React 19** | Component model; `useReducer` drives playback state. |
| **TypeScript** | Typed track/state contracts across hooks and components. |
| **motion** (`motion/react`) | Cover and track-text crossfades via `AnimatePresence`; the disc's per-frame rotation via `useMotionValue` / `useAnimationFrame`. |
| **Web Audio API** | Real-time FFT for the visualizer and the synthesized transition blip — no audio assets needed for the sound effect. |
| **Tailwind CSS 4** | Only the page-level layout shell. The player itself is styled with scoped CSS + design tokens. |

## How it fits together

The widget is one composition root (`MusicPlayer`) that wires a state hook to
presentational components. State flows down; intent flows up through callbacks.

```
MusicPlayer (index.tsx)
├─ useAudioPlayer ........ playback state machine (useReducer) over a single <audio> el
│  ├─ useAudioAnalyser ... AudioContext → AnalyserNode; exposes live frequency data
│  └─ useTransitionSound . one-shot oscillator blip on track change
├─ useKeyboardShortcuts .. global key bindings → player actions
├─ Disc .................. cover art + vinyl
│  └─ useDiscSpin ........ rotation/momentum + skip "burst" via useAnimationFrame
├─ ScalesMixer ........... 10×10 SVG dot grid, amplitude pumped by frequency bands
├─ TrackInfo ............. title/artist with directional slide crossfade
├─ ProgressBar ........... seek + time readout
└─ Controls .............. transport buttons (icons in icons.tsx)
```

### State

`useAudioPlayer` is the single source of truth. A `useReducer` holds the play
order, current index, shuffle/loop modes, and play state; the raw `<audio>`
element is the source of truth for time, which is mirrored into React via its
`timeupdate` / `loadedmetadata` events. Components never touch the audio element
directly — they call `next`, `prev`, `seek`, etc.

### Audio analysis

`useAudioAnalyser` lazily builds an `AudioContext` → `AnalyserNode` graph on the
first `play` (a user gesture, as browsers require). It exposes:

- `getFrequencyData()` — the live 128-bin byte spectrum, read every frame by
  `ScalesMixer`. Each of the 10 columns maps to a log-weighted band; energy
  scales the wave's amplitude, so the pattern always forms but louder audio
  pumps it harder.
- `getBandEnergy(start, end)` — averaged band energy. On track change,
  `useAudioPlayer` samples the bass band and feeds it to `useTransitionSound`,
  so the blip's pitch reflects the music it's leaving.

### Animation

Two systems, deliberately separated:

- **Per-frame** (disc rotation): `useDiscSpin` writes a `motion` value every
  `useAnimationFrame` tick — no React re-renders in the hot path.
- **Discrete transitions** (cover / text swaps): `motion`'s `AnimatePresence`.
  Timing constants live in `transitions.ts` so the disc and text stay in sync.

## Running locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000> — `/` redirects to `/music-player`.

Place your own assets in `public/audio` and `public/covers`, then edit the
`tracks` array in `src/app/music-player/page.tsx`.

## Keyboard shortcuts

| Key | Action |
|-----|--------|
| Space | Play / pause |
| → / ← | Seek ±5s |
| Shift + → / ← | Next / previous track |
| `S` | Toggle shuffle |
| `L` | Cycle loop mode |
