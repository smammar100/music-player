const stroke = {
  viewBox: '0 0 24 24',
  width: 14,
  height: 14,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export function ShuffleIcon() {
  return (
    <svg {...stroke}>
      <path d="M16 3h5v5" />
      <path d="M21 3l-7 7" />
      <path d="M3 21l7-7" />
      <path d="M16 21h5v-5" />
      <path d="M21 21l-7-7" />
      <path d="M3 3l7 7" />
    </svg>
  );
}

export function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M19 5L8 12l11 7zM5 5h2v14H5z" />
    </svg>
  );
}

export function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
      <path d="M5 5l11 7L5 19zM17 5h2v14h-2z" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M7 5v14l11-7z" />
    </svg>
  );
}

export function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M6 5h3v14H6zM15 5h3v14h-3z" />
    </svg>
  );
}

export function LoopIcon() {
  return (
    <svg {...stroke}>
      <path d="M4 12V8a2 2 0 0 1 2-2h12" />
      <path d="M16 3l4 3l-4 3" />
      <path d="M20 12v4a2 2 0 0 1-2 2H6" />
      <path d="M8 21l-4-3l4-3" />
    </svg>
  );
}
