
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { cn } from "@/lib/utils";

const TILE_SIZE = 32; 

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-green-400 animate-pulse" style={{filter: 'drop-shadow(0 0 5px #39FF14)'}} />;
        case 'pills':
            return <Pill className="w-full h-full text-accent animate-pulse -rotate-45" style={{filter: 'drop-shadow(0 0 5px hsl(var(--accent)))'}} />;
        case 'tunes':
            return <DiscAlbum className="w-full h-full text-yellow-300 animate-pulse" style={{filter: 'drop-shadow(0 0 5px #DFFF00)'}} />;
        case 'fuel_station':
            return <Zap className="w-full h-full text-blue-400 animate-flash-blue-bolt" />;
        default:
            return null;
    }
}

const FloorTile = () => {
    return (
        <div className={cn(
            "w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 to-slate-800",
            "border-t border-slate-600 border-l border-l-slate-600",
            "border-b border-b-slate-900 border-r border-r-slate-900",
            "shadow-inner shadow-black/50"
        )}>
        </div>
    )
}

const WallTile = () => {
    return (
        <div className="w-full h-full bg-[#0a0a14]">
        </div>
    )
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;

  // Center the board and zoom in slightly
  const scale = 1.5;
  const translateX = `calc(50% - ${(player.x * TILE_SIZE + TILE_SIZE / 2) * scale}px)`;
  const translateY = `calc(50% - ${(player.y * TILE_SIZE + TILE_SIZE / 2) * scale}px)`;
  
  const enemyPositions = new Set(enemies.map(e => `${e.x},${e.y}`));

  return (
    <div
      className="bg-black border-4 border-secondary shadow-2xl rounded-lg overflow-hidden relative"
      style={{
        width: '48rem',
        height: '48rem',
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="absolute transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transform: `translate(${translateX}, ${translateY}) scale(${scale})`,
            }}
        >
            {/* Maze Floor and Walls */}
            {maze.map((row, y) =>
                row.map((cell, x) => (
                <div
                    key={`${x}-${y}`}
                    className="absolute"
                    style={{
                        width: `${TILE_SIZE}px`,
                        height: `${TILE_SIZE}px`,
                        top: `${y * TILE_SIZE}px`,
                        left: `${x * TILE_SIZE}px`,
                    }}
                >
                    {cell === 0 ? <FloorTile /> : <WallTile />}
                </div>
                ))
            )}

            {/* Items */}
            {items.map((item, i) => (
            <div key={`item-${i}`} className="absolute p-1 z-10" style={{
                top: `${item.y * TILE_SIZE}px`,
                left: `${item.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
            }}>
                <ItemIcon type={item.type} />
            </div>
            ))}

            {/* Enemies */}
            {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="absolute z-20" style={{
                top: `${enemy.y * TILE_SIZE}px`,
                left: `${enemy.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transition: 'all 0.4s linear',
            }}>
                <GhostIcon className="w-full h-full" />
            </div>
            ))}

            {/* Player Icon */}
            <div className="absolute z-30" style={{
                top: `${player.y * TILE_SIZE}px`,
                left: `${player.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
