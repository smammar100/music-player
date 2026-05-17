'use client';

import { useAnimationFrame, useMotionValue, useTransform } from 'motion/react';
import { useCallback, useRef } from 'react';
import type { Direction } from './types';

const SPIN_MAX = 0.4375;
const BURST_DURATION = 620;

export function useDiscSpin(isPlaying: boolean, isZoomed: boolean) {
  const rotation = useMotionValue(0);
  const burstOffset = useMotionValue(0);
  const velRef = useRef(0);
  const burstRef = useRef<{
    from: number;
    start: number;
    active: boolean;
    pending: boolean;
  }>({
    from: 0,
    start: 0,
    active: false,
    pending: false,
  });

  const transform = useTransform(() => {
    const r = rotation.get();
    const b = burstOffset.get();
    return `scale(1.01) rotate(${r + b}deg)`;
  });

  useAnimationFrame((time) => {
    if (isPlaying) {
      velRef.current += (SPIN_MAX - velRef.current) * 0.2;
    } else {
      velRef.current *= 0.96;
      if (velRef.current < 0.001) velRef.current = 0;
    }

    if (isZoomed) {
      const current = rotation.get();
      const target = Math.round(current / 360) * 360;
      const next = current + (target - current) * 0.08;
      if (Math.abs(target - next) < 0.1) {
        rotation.set(target);
      } else {
        rotation.set(next);
      }
    } else {
      rotation.set(rotation.get() + velRef.current);
    }

    const burst = burstRef.current;
    // Capture the burst start from the same clock the frame loop uses
    if (burst.pending) {
      burst.start = time;
      burst.pending = false;
      burst.active = true;
    }
    if (burst.active) {
      const t = (time - burst.start) / BURST_DURATION;
      if (t >= 1) {
        burst.active = false;
        burstOffset.set(0);
      } else {
        const eased = 1 - Math.pow(1 - t, 3);
        burstOffset.set(burst.from * (1 - eased));
      }
    }
  });

  const triggerBurst = useCallback((dir: Direction) => {
    if (!dir) return;
    burstRef.current.from = dir === 'prev' ? 360 : -360;
    burstRef.current.pending = true;
  }, []);

  return { transform, triggerBurst };
}
