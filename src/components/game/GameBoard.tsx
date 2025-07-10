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

  // Calculate the required translation to center the player
  // We want to move the player's position to the center of the viewport.
  const playerCenterX = (player.x + 0.5) * TILE_SIZE;
  const playerCenterY = (player.y + 0.5) * TILE_SIZE;
  
  // The camera's focal point should be the player.
  // We translate the board so the player is at the origin (0,0) of the board's coordinate system,
  // which will then be centered by the viewport.
  const translateX = (boardWidth / 2) - playerCenterX;
  const translateY = (boardHeight / 2) - playerCenterY;

  return (
    <div
      className="bg-black/50 border-4 border-primary shadow-[0_0_20px_hsl(var(--primary))] rounded-lg p-2 scanlines overflow-hidden"
      style={{
        width: `${VIEWPORT_SIZE}rem`,
        height: `${VIEWPORT_SIZE}rem`,
        perspective: '1000px',
      }}
      data-ai-hint="maze arcade"
    >
      <div
        className="relative transition-transform duration-300 ease-linear"
        style={{
            width: `${boardWidth}rem`,
            height: `${boardHeight}rem`,
            transformStyle: 'preserve-3d',
            transform: `
              translateX(calc(${VIEWPORT_SIZE / 2}rem - ${boardWidth / 2}rem)) 
              translateY(calc(${VIEWPORT_SIZE / 2}rem - ${boardHeight / 2}rem)) 
              rotateX(60deg) 
              rotateZ(-45deg) 
              scale(0.9)
              translateX(${translateX}rem) 
              translateY(${translateY}rem)
            `,
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
                <div key={`item-${i}`} className="p-2" style={{ gridColumn: item.x + 1, gridRow: item.y + 1, transform: 'translateZ(0.5rem)' }}>
                    <ItemIcon type={item.type} />
                </div>
            ))}

            {enemies.map((enemy, i) => (
                <div key={`enemy-${i}`} className="p-1" style={{ gridColumn: enemy.x + 1, gridRow: enemy.y + 1, transition: 'all 0.4s linear', transform: 'translateZ(1rem)' }}>
                    <GhostIcon className="w-full h-full" />
                </div>
            ))}

            <div className="p-1" style={{ gridColumn: player.x + 1, gridRow: player.y + 1, transition: 'all 0.1s linear', transform: 'translateZ(1rem)' }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
      </div>
    </div>
  );
}
