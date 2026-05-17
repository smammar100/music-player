'use client';

import {
  LoopIcon,
  NextIcon,
  PauseIcon,
  PlayIcon,
  PrevIcon,
  ShuffleIcon,
} from './icons';
import type { LoopMode } from './types';

interface ControlsProps {
  isPlaying: boolean;
  shuffled: boolean;
  loopMode: LoopMode;
  onToggle: () => void;
  onNext: () => void;
  onPrev: () => void;
  onShuffle: () => void;
  onLoop: () => void;
}

export function Controls({
  isPlaying,
  shuffled,
  loopMode,
  onToggle,
  onNext,
  onPrev,
  onShuffle,
  onLoop,
}: ControlsProps) {
  return (
    <div className="controls">
      <button
        className={`ctrl ctrl-toggle ${shuffled ? 'is-active' : ''}`}
        onClick={onShuffle}
        aria-label="Shuffle"
        aria-pressed={shuffled}
      >
        <ShuffleIcon />
      </button>

      <button className="ctrl" onClick={onPrev} aria-label="Previous">
        <PrevIcon />
      </button>

      <button
        className="ctrl ctrl-play"
        onClick={onToggle}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button className="ctrl" onClick={onNext} aria-label="Next">
        <NextIcon />
      </button>

      <button
        className={`ctrl ctrl-toggle ctrl-loop ${loopMode !== 'off' ? 'is-active' : ''} ${loopMode === 'one' ? 'mode-one' : ''}`}
        onClick={onLoop}
        aria-label={`Loop: ${loopMode}`}
        aria-pressed={loopMode !== 'off'}
      >
        <LoopIcon />
        <span className="loop-one">1</span>
      </button>
    </div>
  );
}
