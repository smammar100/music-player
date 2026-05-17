'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { EASE, ENTER_DELAY } from './transitions';
import type { Direction, Track } from './types';
import { useDiscSpin } from './useDiscSpin';

interface DiscProps {
  track: Track;
  isPlaying: boolean;
  isZoomed: boolean;
  direction: Direction;
  onZoomToggle: () => void;
}

export function Disc({ track, isPlaying, isZoomed, direction, onZoomToggle }: DiscProps) {
  const { transform, triggerBurst } = useDiscSpin(isPlaying, isZoomed);
  const prevTrackSrc = useRef(track.src);

  useEffect(() => {
    if (track.src !== prevTrackSrc.current) {
      prevTrackSrc.current = track.src;
      if (direction) triggerBurst(direction);
    }
  }, [track.src, direction, triggerBurst]);

  return (
    <div
      className={`mask ${isZoomed ? 'is-zoomed' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onZoomToggle();
      }}
    >
      <motion.div className="spin" style={{ transform }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.img
            key={track.cover}
            src={track.cover}
            alt={`${track.title} — ${track.artist}`}
            className="cover"
            initial={direction ? { opacity: 0, scale: 1.08 } : false}
            animate={{
              opacity: 1,
              scale: 1,
              transition: {
                duration: 0.38,
                ease: [...EASE],
                delay: direction ? ENTER_DELAY : 0,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.32, ease: [...EASE] },
            }}
          />
        </AnimatePresence>
      </motion.div>
      <div className="hole">
        <div className="hole-inner" />
      </div>
    </div>
  );
}
