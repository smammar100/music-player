'use client';

import { useCallback, useEffect, useRef } from 'react';

type AudioCtor = typeof AudioContext;

const FFT_SIZE = 256;

export function useAudioAnalyser(audioRef: React.RefObject<HTMLAudioElement | null>) {
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Uint8Array<ArrayBuffer>>(new Uint8Array(FFT_SIZE / 2));
  const connectedRef = useRef(false);

  const connect = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || connectedRef.current) return;
    try {
      const Ctor: AudioCtor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: AudioCtor }).webkitAudioContext;
      if (!Ctor) return;
      const ctx = new Ctor();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.8;
      const source = ctx.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(ctx.destination);
      ctxRef.current = ctx;
      analyserRef.current = analyser;
      dataRef.current = new Uint8Array(analyser.frequencyBinCount);
      connectedRef.current = true;
      if (ctx.state === 'suspended') ctx.resume().catch(() => {});
    } catch {
      // Web Audio unavailable or already connected
    }
  }, [audioRef]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.addEventListener('play', connect, { once: true });
    return () => audio.removeEventListener('play', connect);
  }, [audioRef, connect]);

  useEffect(() => {
    return () => {
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
    };
  }, []);

  const getFrequencyData = useCallback((): Uint8Array | null => {
    const analyser = analyserRef.current;
    if (!analyser) return null;
    if (ctxRef.current?.state === 'suspended') ctxRef.current.resume().catch(() => {});
    analyser.getByteFrequencyData(dataRef.current);
    return dataRef.current;
  }, []);

  const getBandEnergy = useCallback((startBin: number, endBin: number): number => {
    if (!analyserRef.current) return 0;
    const data = dataRef.current;
    const count = endBin - startBin;
    if (count <= 0) return 0;
    let sum = 0;
    for (let i = startBin; i < endBin && i < data.length; i++) {
      sum += data[i];
    }
    return sum / count / 255;
  }, []);

  return { getFrequencyData, getBandEnergy };
}
