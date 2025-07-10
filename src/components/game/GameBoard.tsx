"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";
import { MAZE_HEIGHT, MAZE_WIDTH } from "@/lib/maze";

const TILE_SIZE_REM = 4; // The size of a tile in rem

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

  // This calculation ensures the player is always in the center of the viewport.
  // We get the viewport dimensions and calculate the required translation
  // to move the maze container, so the player character appears stationary.
  const TILE_SIZE_PX = TILE_SIZE_REM * 16; // Assuming 1rem = 16px for calculation
  const VIEWPORT_SIZE_PX = 40 * 16;
  
  const translateX = VIEWPORT_SIZE_PX / 2 - (player.x + 0.5) * TILE_SIZE_PX;
  const translateY = VIEWPORT_SIZE_PX / 2 - (player.y + 0.5) * TILE_SIZE_PX;


  return (
    <div
      className="bg-black/50 border-4 border-primary shadow-[0_0_20px_hsl(var(--primary))] rounded-lg p-2 scanlines overflow-hidden"
      style={{
        width: '40rem',
        height: '40rem',
        perspective: '1000px',
      }}
      data-ai-hint="maze arcade"
    >
      <div 
        className="relative transition-transform duration-100 ease-linear"
        style={{
          width: `${MAZE_WIDTH * TILE_SIZE_REM}rem`,
          height: `${MAZE_HEIGHT * TILE_SIZE_REM}rem`,
          transform: `translateY(${translateY}px) translateX(${translateX}px) rotateX(60deg) rotateZ(-45deg) scale(1.2)`,
          transformStyle: 'preserve-3d',
        }}
      >
        <div
            className="grid absolute inset-0"
            style={{
                gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
                gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
            }}
        >
            {maze.map((row, y) =>
              row.map((cell, x) =>
                cell === 1 ? (
                  <div
                    key={`${x}-${y}`}
                    className="bg-secondary/50 border-t-2 border-primary/50"
                    style={{ 
                        gridColumn: x + 1, 
                        gridRow: y + 1,
                        transform: 'translateZ(-1rem)',
                        boxShadow: '0 1rem 0 hsl(var(--secondary))',
                    }}
                  />
                ) : null
              )
            )}
            
            {items.map((item, i) => (
                 <div key={`item-${i}`} className="p-2" style={{ gridColumn: item.x + 1, gridRow: item.y + 1 }}>
                    <ItemIcon type={item.type} />
                </div>
            ))}

            {enemies.map((enemy, i) => (
                <div key={`enemy-${i}`} className="p-1" style={{ gridColumn: enemy.x + 1, gridRow: enemy.y + 1, transition: 'all 0.2s linear' }}>
                    <GhostIcon className="w-full h-full" />
                </div>
            ))}
            
            <div className="p-1" style={{ gridColumn: player.x + 1, gridRow: player.y + 1, transition: 'all 0.1s linear' }}>
                <PlayerIcon className="w-full h-full text-accent drop-shadow-[0_0_8px_hsl(var(--accent))] -rotate-45" />
            </div>
        </div>
      </div>
    </div>
  );
}
