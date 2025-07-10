
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

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;

  // Center of player in rem units
  const playerCenterX = (player.x + 0.5) * TILE_SIZE;
  const playerCenterY = (player.y + 0.5) * TILE_SIZE;
  
  // Translation needed to center the player in the viewport
  const translateX = (VIEWPORT_SIZE / 2) - playerCenterX;
  const translateY = (VIEWPORT_SIZE / 2) - playerCenterY;

  return (
    <div
      className="bg-background border-4 border-secondary shadow-2xl rounded-lg p-2 overflow-hidden"
      style={{
        width: `${VIEWPORT_SIZE}rem`,
        height: `${VIEWPORT_SIZE}rem`,
        perspective: '1000px',
      }}
      data-ai-hint="maze puzzle"
    >
      <div
        className="relative transition-transform duration-300 ease-linear"
        style={{
            width: `${boardWidth}rem`,
            height: `${boardHeight}rem`,
            transformStyle: 'preserve-3d',
            transform: `
                translateX(${translateX}rem) 
                translateY(${translateY}rem) 
                rotateX(60deg) 
                rotateZ(-45deg)
                scale(0.6)
            `,
        }}
      >
        {/* Maze Floor */}
        <div className="absolute inset-0 bg-background" />

        {/* Maze Walls */}
        <div
            className="grid absolute inset-0"
            style={{
                gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
                gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
                transformStyle: 'preserve-3d',
            }}
        >
            {maze.map((row, y) =>
            row.map((cell, x) =>
                cell === 1 ? (
                <div
                    key={`${x}-${y}-wall`}
                    className="relative bg-primary/80"
                    style={{
                        gridColumn: x + 1,
                        gridRow: y + 1,
                        transformStyle: 'preserve-3d',
                        transform: 'translateZ(2rem) scaleY(1.5)',
                        height:'100%'
                    }}
                />
                ) : null
            )
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
        
        {/* Player */}
        <div className="absolute w-12 h-12" style={{ 
             top: `${player.y * TILE_SIZE}rem`,
             left: `${player.x * TILE_SIZE}rem`,
             transition: 'all 0.1s linear', 
             transform: 'translateZ(2rem)'
        }}>
            <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
        </div>
      </div>
    </div>
  );
}
