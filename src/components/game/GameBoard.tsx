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

  // Calculate the required translation to keep the player centered
  const boardWidth = MAZE_WIDTH * TILE_SIZE_REM;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE_REM;
  
  // The center of the viewport in rem.
  const viewportCenterRemX = 20; 
  const viewportCenterRemY = 20; 

  // Player position in rem.
  const playerRemX = player.x * TILE_SIZE_REM + TILE_SIZE_REM / 2;
  const playerRemY = player.y * TILE_SIZE_REM + TILE_SIZE_REM / 2;

  // Translation needed to move the player's position to the viewport center.
  const translateX = viewportCenterRemX - playerRemX;
  const translateY = viewportCenterRemY - playerRemY;

  return (
    <div
      className="bg-black/50 border-4 border-primary shadow-[0_0_20px_hsl(var(--primary))] rounded-lg p-2 scanlines overflow-hidden flex items-center justify-center"
      style={{
        width: '40rem',
        height: '40rem',
        perspective: '1000px',
      }}
      data-ai-hint="maze arcade"
    >
      <div 
        className="relative transition-transform duration-300 ease-linear"
        style={{
          width: `${boardWidth}rem`,
          height: `${boardHeight}rem`,
          transform: `rotateX(60deg) rotateZ(-45deg) scale(0.6) translateX(${translateX}rem) translateY(${translateY}rem)`,
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
                <div key={`enemy-${i}`} className="p-1" style={{ gridColumn: enemy.x + 1, gridRow: enemy.y + 1, transition: 'all 0.4s linear' }}>
                    <GhostIcon className="w-full h-full" />
                </div>
            ))}
            
            <div className="p-1" style={{ gridColumn: player.x + 1, gridRow: player.y + 1, transition: 'all 0.1s linear' }}>
                <PlayerIcon className="w-full h-full text-accent drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
      </div>
    </div>
  );
}
