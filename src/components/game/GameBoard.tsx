
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";
import { MAZE_HEIGHT, MAZE_WIDTH } from "@/lib/maze";

const TILE_SIZE = 8; // The size of a tile in rem
const VIEWPORT_SIZE = 40; // The visible area size in rem

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

  // Calculate the offset to center the player.
  const mazeTx = (VIEWPORT_SIZE / 2) - ((player.x - player.y) * TILE_SIZE / 2);
  const mazeTy = (VIEWPORT_SIZE / 2) - ((player.x + player.y) * TILE_SIZE / 4);
  
  return (
    <div
      className="bg-transparent border-4 border-secondary shadow-2xl rounded-lg overflow-hidden relative"
      style={{
        width: `${VIEWPORT_SIZE}rem`,
        height: `${VIEWPORT_SIZE}rem`,
        perspective: '1000px',
      }}
      data-ai-hint="maze puzzle"
    >
      <div
        className="absolute transition-transform duration-100 ease-linear"
        style={{
            width: `${MAZE_WIDTH * TILE_SIZE}rem`,
            height: `${MAZE_HEIGHT * TILE_SIZE}rem`,
            transform: `translate(${mazeTx}rem, ${mazeTy}rem) rotateX(60deg) rotateZ(45deg) scale(1.5)`,
            transformStyle: 'preserve-3d',
        }}
      >
        {/* Maze Floor and Walls */}
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
            {maze.map((row, y) =>
                row.map((cell, x) => (
                <div
                    key={`${x}-${y}`}
                    className="absolute"
                    style={{
                        width: `${TILE_SIZE}rem`,
                        height: `${TILE_SIZE}rem`,
                        top: `${y * TILE_SIZE}rem`,
                        left: `${x * TILE_SIZE}rem`,
                        transformStyle: 'preserve-3d',
                    }}
                >
                    {cell === 1 ? (
                        <div className="absolute inset-0 bg-primary/80" style={{ transform: 'translateZ(1rem)' }}>
                            <div className="absolute inset-0 bg-primary/40" style={{ transform: `translateZ(0) scaleY(0.5) rotateX(-90deg)`, transformOrigin: 'top' }} />
                        </div>
                    ) : (
                        <div className="absolute inset-0 bg-transparent" />
                    )}
                </div>
                ))
            )}
        </div>

        {/* Items */}
        {items.map((item, i) => (
          <div key={`item-${i}`} className="absolute w-8 h-8 p-1" style={{
              top: `${item.y * TILE_SIZE}rem`,
              left: `${item.x * TILE_SIZE}rem`,
              width: `${TILE_SIZE}rem`,
              height: `${TILE_SIZE}rem`,
              transform: 'translateZ(1.5rem) rotateZ(-45deg) rotateX(-60deg)'
          }}>
              <ItemIcon type={item.type} />
          </div>
        ))}

        {/* Enemies */}
        {enemies.map((enemy, i) => (
          <div key={`enemy-${i}`} className="absolute" style={{
              top: `${enemy.y * TILE_SIZE}rem`,
              left: `${enemy.x * TILE_SIZE}rem`,
              width: `${TILE_SIZE}rem`,
              height: `${TILE_SIZE}rem`,
              transition: 'all 0.4s linear',
              transform: 'translateZ(2rem) rotateZ(-45deg) rotateX(-60deg)'
          }}>
              <GhostIcon className="w-full h-full" />
          </div>
        ))}

        {/* Player Icon */}
         <div className="absolute" style={{
            top: `${player.y * TILE_SIZE}rem`,
            left: `${player.x * TILE_SIZE}rem`,
            width: `${TILE_SIZE}rem`,
            height: `${TILE_SIZE}rem`,
            transform: 'translateZ(2rem) rotateZ(-45deg) rotateX(-60deg)',
            transition: 'top 0.1s linear, left 0.1s linear',
        }}>
              <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
        </div>
      </div>
    </div>
  );
}
