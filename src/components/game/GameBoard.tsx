
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";
import { MAZE_HEIGHT, MAZE_WIDTH } from "@/lib/maze";

const TILE_SIZE = 4; // The size of a tile in rem (64px)
const VIEWPORT_SIZE = 40; // in rem

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-primary/80 animate-pulse" />;
        case 'glowstick':
            return <Sparkles className="w-full h-full text-accent animate-pulse" />;
        case 'vinyl':
            return <DiscAlbum className="w-full h-full text-primary animate-pulse" />;
        default:
            return null;
    }
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const mazeOffsetX = (VIEWPORT_SIZE / 2) - ((player.x + 0.5) * TILE_SIZE);
  const mazeOffsetY = (VIEWPORT_SIZE / 2) - ((player.y + 0.5) * TILE_SIZE);
  
  return (
    <div
      className="bg-background border-4 border-secondary shadow-2xl rounded-lg overflow-hidden relative"
      style={{
        width: `${VIEWPORT_SIZE}rem`,
        height: `${VIEWPORT_SIZE}rem`,
      }}
      data-ai-hint="maze puzzle"
    >
      <div
        className="absolute transition-all duration-100 ease-linear"
        style={{
          width: `${MAZE_WIDTH * TILE_SIZE}rem`,
          height: `${MAZE_HEIGHT * TILE_SIZE}rem`,
          transform: `scale(1.5)`,
          top: `${mazeOffsetY}rem`,
          left: `${mazeOffsetX}rem`,
        }}
      >
        {/* Maze Floor and Walls */}
        <div
          className="grid absolute inset-0"
          style={{
            gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
            gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
          }}
        >
          {maze.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`relative ${cell === 1 ? 'bg-primary/80' : 'bg-transparent'}`}
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                  transform: cell === 1 ? 'translateZ(1rem)' : 'none',
                }}
              />
            ))
          )}
        </div>

        {/* Items */}
        {items.map((item, i) => (
          <div key={`item-${i}`} className="absolute w-8 h-8 p-1" style={{ 
              top: `${item.y * TILE_SIZE}rem`,
              left: `${item.x * TILE_SIZE}rem`,
              transform: 'translateZ(1.5rem)' 
          }}>
              <ItemIcon type={item.type} />
          </div>
        ))}

        {/* Enemies */}
        {enemies.map((enemy, i) => (
          <div key={`enemy-${i}`} className="absolute w-12 h-12" style={{ 
              top: `${enemy.y * TILE_SIZE}rem`,
              left: `${enemy.x * TILE_SIZE}rem`,
              transition: 'all 0.4s linear', 
              transform: 'translateZ(2rem)' 
          }}>
              <GhostIcon className="w-full h-full" />
          </div>
        ))}
      </div>

       {/* Player is rendered separately and stays in the center of the viewport */}
      <div className="absolute" style={{
        top: '50%',
        left: '50%',
        width: '3rem', // 48px
        height: '3rem', // 48px
        transform: 'translate(-50%, -50%) translateZ(2rem) scale(1.5)', 
        transformStyle: 'preserve-3d',
      }}>
          <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
      </div>
    </div>
  );
}
