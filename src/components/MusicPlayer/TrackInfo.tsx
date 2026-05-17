'use client';

import { AnimatePresence, motion } from 'motion/react';
import type { Direction, Track } from './types';

const SLIDE_EASING = [0.22, 1, 0.36, 1] as const;
const SLIDE_PX = 14;

interface TrackInfoProps {
  track: Track;
  direction: Direction;
}

export function TrackInfo({ track, direction }: TrackInfoProps) {
  const exitX = direction === 'next' ? -SLIDE_PX : SLIDE_PX;
  const enterX = direction === 'next' ? SLIDE_PX : -SLIDE_PX;

  return (
    <div className="track-info">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p
          key={`artist-${track.artist}`}
          className="artist"
          initial={direction ? { opacity: 0, x: enterX } : false}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.32,
              ease: [...SLIDE_EASING],
              delay: direction ? 0.31 : 0,
            },
          }}
          exit={{
            opacity: 0,
            x: exitX,
            transition: { duration: 0.28, ease: [...SLIDE_EASING] },
          }}
        >
          {track.artist}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.h2
          key={`title-${track.title}`}
          className="track"
          initial={direction ? { opacity: 0, x: enterX } : false}
          animate={{
            opacity: 1,
            x: 0,
            transition: {
              duration: 0.32,
              ease: [...SLIDE_EASING],
              delay: direction ? 0.31 : 0,
            },
          }}
          exit={{
            opacity: 0,
            x: exitX,
            transition: { duration: 0.28, ease: [...SLIDE_EASING] },
          }}
        >
          {track.title}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
