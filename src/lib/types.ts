
export type CollectibleType = 'flyer' | 'pills' | 'tunes' | 'fuel_station' | 'dropped_pill';

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
  bustedCount: number;
  collectibles: {
    flyers: number;
    pills: number;
    tunes: number;
  };
  level: number;
  player: PlayerState;
  enemies: Enemy[];
  items: Item[];
  maze: number[][];
  time: number;
  fuel: number;
  maxFuel: number;
};

export type Level = {
  name: string;
  artist: string;
  theme: string;
  youtubeUrl: string;
};

export type TrackState = {
    currentTime: number;
    duration: number;
};
