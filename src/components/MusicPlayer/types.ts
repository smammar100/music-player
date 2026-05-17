export interface Track {
  title: string;
  artist: string;
  cover: string;
  src: string;
}

export type LoopMode = 'off' | 'all' | 'one';
export type Direction = 'next' | 'prev' | null;
