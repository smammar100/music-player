'use client';

import { AnimatePresence, motion } from 'motion/react';
import { EASE, ENTER_DELAY } from './transitions';
import type { Direction, Track } from './types';

const SLIDE_PX = 14;

interface TrackInfoProps {
  track: Track;
  direction: Direction;
}

// Text slides in from the side it's heading toward and exits the opposite way,
// so next/prev reads as forward/backward motion.
function slide(direction: Direction) {
  const enterX = direction === 'next' ? SLIDE_PX : -SLIDE_PX;
  const exitX = direction === 'next' ? -SLIDE_PX : SLIDE_PX;
  return {
    initial: direction ? { opacity: 0, x: enterX } : false,
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.32, ease: EASE, delay: direction ? ENTER_DELAY : 0 },
    },
    exit: {
      opacity: 0,
      x: exitX,
      transition: { duration: 0.28, ease: EASE },
    },
  };
}

export function TrackInfo({ track, direction }: TrackInfoProps) {
  const variants = slide(direction);

  return (
    <div className="track-info">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.p key={`artist-${track.artist}`} className="artist" {...variants}>
          {track.artist}
        </motion.p>
      </AnimatePresence>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.h2 key={`title-${track.title}`} className="track" {...variants}>
          {track.title}
        </motion.h2>
      </AnimatePresence>
    </div>
  );
}
