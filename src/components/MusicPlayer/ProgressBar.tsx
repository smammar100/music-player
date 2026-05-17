'use client';

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (pct: number) => void;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

export function ProgressBar({ currentTime, duration, onSeek }: ProgressBarProps) {
  const pct = duration ? (currentTime / duration) * 100 : 0;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    onSeek(ratio);
  };

  return (
    <>
      <div className="bar" onClick={handleClick}>
        <div className="bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <div className="time">
        <span className="current">{formatTime(currentTime)}</span>
        <span className="sep">/</span>
        <span className="total">{formatTime(duration)}</span>
      </div>
    </>
  );
}
