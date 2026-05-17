'use client';

import { MusicPlayer } from '@/components/MusicPlayer';

const tracks = [
  {
    title: 'Southern Roots Boogie',
    artist: 'Falconer',
    cover: '/covers/falconer.png',
    src: '/audio/falconer.mp3',
  },
  {
    title: 'Sax Party',
    artist: 'Ofer Koren',
    cover: '/covers/sax.png',
    src: '/audio/ofer-koren.mp3',
  },
  {
    title: 'Nonsense',
    artist: 'Raw',
    cover: '/covers/raw.png',
    src: '/audio/raw.mp3',
  },
];

export default function MusicPlayerPage() {
  return (
    <main className="min-h-screen grid place-items-center p-8 bg-[var(--black)] transition-colors duration-200">
      <MusicPlayer tracks={tracks} />
    </main>
  );
}
