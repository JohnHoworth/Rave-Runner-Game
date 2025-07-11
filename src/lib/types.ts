export type CollectibleType = 'flyer' | 'glowstick' | 'vinyl';

export type Position = {
  x: number;
  y: number;
};

export type PlayerDirection = 'up' | 'down' | 'left' | 'right';

export type PlayerState = Position & {
    direction: PlayerDirection;
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
  player: PlayerState;
  enemies: Enemy[];
  items: Item[];
  maze: number[][];
};

export type Level = {
  name: string;
  artist: string;
  theme: string;
};
