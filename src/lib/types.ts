export type CollectibleType = 'flyer' | 'glowstick' | 'vinyl';

export type Position = {
  x: number;
  y: number;
};

export type Enemy = Position;

export type Item = Position & {
  type: CollectibleType;
};

export type GameState = {
  score: number;
  raveBucks: number;
  collectibles: {
    flyers: number;
    glowsticks: number;
    vinyls: number;
  };
  level: number;
  player: Position;
  enemies: Enemy[];
  items: Item[];
  maze: number[][];
};

export type Level = {
  name: string;
  artist: string;
  theme: string;
};
