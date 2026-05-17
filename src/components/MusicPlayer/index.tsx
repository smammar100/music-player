'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { Controls } from './Controls';
import { Disc } from './Disc';
import { ProgressBar } from './ProgressBar';
import { ScalesMixer } from './ScalesMixer';
import { ThemeToggle } from './ThemeToggle';
import { TrackInfo } from './TrackInfo';
import type { Track } from './types';
import { useAudioPlayer } from './useAudioPlayer';
import { useKeyboardShortcuts } from './useKeyboardShortcuts';
import './tokens.css';

interface MusicPlayerProps {
  tracks: Track[];
}

export function MusicPlayer({ tracks }: MusicPlayerProps) {
  const player = useAudioPlayer(tracks);
  const [isZoomed, setIsZoomed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleZoomToggle = useCallback(() => {
    setIsZoomed((z) => !z);
  }, []);

  const handleClickOutside = useCallback((e: React.MouseEvent) => {
    if (!(e.target as HTMLElement).closest('.mask')) {
      setIsZoomed(false);
    }
  }, []);

  const seekForward = useCallback(() => {
    const audio = player.audioRef.current;
    if (audio) audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 5);
  }, [player.audioRef]);

  const seekBackward = useCallback(() => {
    const audio = player.audioRef.current;
    if (audio) audio.currentTime = Math.max(0, audio.currentTime - 5);
  }, [player.audioRef]);

  const shortcuts = useMemo(
    () => ({
      toggle: player.toggle,
      next: player.next,
      prev: player.prev,
      seekForward,
      seekBackward,
      toggleShuffle: player.toggleShuffle,
      cycleLoop: player.cycleLoop,
    }),
    [player.toggle, player.next, player.prev, seekForward, seekBackward, player.toggleShuffle, player.cycleLoop]
  );

  useKeyboardShortcuts(shortcuts);

  return (
    <>
      <ThemeToggle />
      <div
        ref={cardRef}
        className={`card ${player.state.isPlaying ? 'is-playing' : ''} ${isZoomed ? 'is-zoomed' : ''}`}
        onClick={handleClickOutside}
      >
        <audio ref={player.audioRef} preload="metadata" />

        <Disc
          track={player.currentTrack}
          isPlaying={player.state.isPlaying}
          isZoomed={isZoomed}
          direction={player.state.direction}
          onZoomToggle={handleZoomToggle}
        />

        <div className="info">
          <ScalesMixer isPlaying={player.state.isPlaying} getFrequencyData={player.getFrequencyData} />
          <TrackInfo
            track={player.currentTrack}
            direction={player.state.direction}
          />
          <ProgressBar
            currentTime={player.currentTime}
            duration={player.duration}
            onSeek={player.seek}
          />
          <Controls
            isPlaying={player.state.isPlaying}
            shuffled={player.state.shuffled}
            loopMode={player.state.loopMode}
            onToggle={player.toggle}
            onNext={player.next}
            onPrev={player.prev}
            onShuffle={player.toggleShuffle}
            onLoop={player.cycleLoop}
          />
        </div>
      </div>
    </>
  );
}
