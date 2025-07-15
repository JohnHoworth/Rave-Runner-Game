
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { cn } from "@/lib/utils";
import FlashingPillIcon from "../icons/FlashingPillIcon";

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
        case 'dropped_pill':
            return <FlashingPillIcon className="w-full h-full -rotate-45" />;
        default:
            return null;
    }
}

const FloorTile = ({ isPlayerOnTile }: { isPlayerOnTile: boolean }) => {
    return (
        <div className={cn(
            "w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-700 to-slate-800",
            "border-t border-slate-600 border-l border-l-slate-600",
            "border-b border-b-slate-900 border-r border-r-slate-900",
            "shadow-inner shadow-black/50",
            isPlayerOnTile && "animate-glow-orange-border"
        )}>
        </div>
    )
}

const WallTile = () => {
    return (
        <div className="w-full h-full bg-slate-900/50">
        </div>
    )
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;
  
  const scale = 1.5;
  const containerWidth = 48 * 16;
  const containerHeight = 48 * 16;

  const translateX = containerWidth / 2 - (player.x * TILE_SIZE + TILE_SIZE / 2) * scale;
  const translateY = containerHeight / 2 - (player.y * TILE_SIZE + TILE_SIZE / 2) * scale;

  return (
    <div
      className="border-4 border-secondary shadow-2xl rounded-lg overflow-hidden"
      style={{
        width: '48rem',
        height: '48rem',
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="relative transition-transform duration-300 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
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
                    {cell === 0 ? <FloorTile isPlayerOnTile={player.x === x && player.y === y} /> : <WallTile />}
                </div>
                ))
            )}
            
            {/* Items */}
            {items.map((item, i) => (
            <div key={`item-${i}`} className={cn("absolute", item.type !== 'dropped_pill' && "p-1")} style={{
                top: `${item.y * TILE_SIZE}px`,
                left: `${item.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 10,
            }}>
                <ItemIcon type={item.type} />
            </div>
            ))}

            {/* Enemies */}
            {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="absolute" style={{
                top: `${enemy.y * TILE_SIZE}px`,
                left: `${enemy.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transition: 'all 0.4s linear',
                zIndex: 20,
            }}>
                <GhostIcon className="w-full h-full" />
            </div>
            ))}

            {/* Player Icon */}
            <div className="absolute" style={{
                top: `${player.y * TILE_SIZE}px`,
                left: `${player.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 30,
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
