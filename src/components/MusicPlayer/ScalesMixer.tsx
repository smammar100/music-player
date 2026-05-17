'use client';

import { useAnimationFrame } from 'motion/react';
import { useId, useRef } from 'react';

interface ScalesMixerProps {
  isPlaying: boolean;
  getFrequencyData?: () => Uint8Array | null;
}

// Log-weighted frequency band ranges for 128-bin FFT (fftSize=256, ~172Hz/bin)
const BAND_RANGES: [number, number][] = [
  [0, 1], [1, 3], [3, 6], [6, 10], [10, 16],
  [16, 24], [24, 36], [36, 52], [52, 74], [74, 100],
];

const COLS = 10;
const ROWS = 10;

// GSAP-equivalent sine easings
const sineOut = (x: number) => Math.sin((x * Math.PI) / 2);
const sineIn = (x: number) => 1 - Math.cos((x * Math.PI) / 2);
const sineInOut = (x: number) => -(Math.cos(Math.PI * x) - 1) / 2;

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

// Part A: column group y bob — 0 -> 11, dur 1.5s, sine.inOut, stagger amount 3, yoyo
const PART_A_DUR = 1.5;
const PART_A_TO = 11;
const PART_A_STEP = 3 / (COLS - 1);

// Part B: circle wave — scale 0.133 -> 0.8, dur 1s, sine out / yoyo sine in
const PART_B_DUR = 1;
const SCALE_FROM = 0.133;
const SCALE_TO = 0.8;

function partAColumnY(time: number, col: number): number {
  const local = time - col * PART_A_STEP;
  const period = PART_A_DUR * 2;
  const cyc = ((local % period) + period) % period;
  if (cyc < PART_A_DUR) {
    return PART_A_TO * sineInOut(cyc / PART_A_DUR);
  }
  return PART_A_TO * sineInOut(1 - (cyc - PART_A_DUR) / PART_A_DUR);
}

// Returns [translateY, scale] for the circle at column `col`, row `row`
function partBCircle(time: number, col: number, row: number): [number, number] {
  const frac = row / ROWS;
  const yFrom = lerp(77, -77, frac);
  const yTo = lerp(col, -col, frac);

  const local = time - col / COLS;
  const period = PART_B_DUR * 2;
  const cyc = ((local % period) + period) % period;

  let e: number;
  if (cyc < PART_B_DUR) {
    e = sineOut(cyc / PART_B_DUR); // forward
  } else {
    e = sineIn(1 - (cyc - PART_B_DUR) / PART_B_DUR); // yoyo back
  }

  return [lerp(yFrom, yTo, e), lerp(SCALE_FROM, SCALE_TO, e)];
}

export function ScalesMixer({ isPlaying, getFrequencyData }: ScalesMixerProps) {
  const maskId = useId().replace(/:/g, '_');
  const colRefs = useRef<(SVGGElement | null)[]>([]);
  const circleRefs = useRef<(SVGCircleElement | null)[][]>(
    Array.from({ length: COLS }, () => [])
  );
  // tl.play(50): start the timeline 50s in so it opens mid-animation
  const tRef = useRef(50);

  useAnimationFrame((_, delta) => {
    if (isPlaying) {
      tRef.current += delta / 1000;
    }
    const time = tRef.current;
    const freqData = getFrequencyData?.();

    for (let c = 0; c < COLS; c++) {
      let energy = 1.0;
      if (freqData) {
        const [binStart, binEnd] = BAND_RANGES[c];
        let sum = 0;
        for (let b = binStart; b < binEnd; b++) sum += freqData[b] ?? 0;
        energy = Math.sqrt(sum / (binEnd - binStart) / 255);
      }

      // Energy modulates amplitude but the sssscales wave keeps flowing,
      // so the pattern always forms — louder audio just pumps it harder.
      const bobGain = freqData ? 0.4 + energy : 1;
      const scaleGain = freqData ? 0.5 + energy : 1;

      const colEl = colRefs.current[c];
      if (colEl) {
        const ay = partAColumnY(time, c) * bobGain;
        colEl.style.transform = `translate(${c * 10}px, ${ay}px)`;
      }

      for (let r = 0; r < ROWS; r++) {
        const circle = circleRefs.current[c][r];
        if (!circle) continue;
        const [ty, s] = partBCircle(time, c, r);
        circle.style.transform = `translateY(${ty}px) scale(${s * scaleGain})`;
      }
    }
  });

  return (
    <svg className="scales" viewBox="0 0 98 108" aria-hidden="true">
      <mask id={maskId}>
        <rect width="10" height="10" fill="#fff" />
      </mask>
      {Array.from({ length: COLS }, (_, c) => (
        <g
          key={c}
          ref={(el) => {
            colRefs.current[c] = el;
          }}
          style={{ transform: `translate(${c * 10}px, 0px)` }}
        >
          {Array.from({ length: ROWS }, (_, r) => (
            <g
              key={r}
              mask={`url(#${maskId})`}
              transform={`translate(0 ${r * 10})`}
            >
              <circle
                ref={(el) => {
                  circleRefs.current[c][r] = el;
                }}
                cx="5"
                cy="5"
                r="5"
                style={{
                  transformBox: 'fill-box',
                  transformOrigin: 'center',
                }}
              />
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}
