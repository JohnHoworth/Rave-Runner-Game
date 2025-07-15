
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { cn } from "@/lib/utils";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 40; 
const TILE_HEIGHT = 20;

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-green-500 animate-pulse" style={{filter: 'drop-shadow(0 0 5px #39FF14)'}} />;
        case 'pills':
            return <Pill className="w-full h-full text-pink-500 animate-pulse -rotate-45" style={{filter: 'drop-shadow(0 0 5px #f472b6)'}} />;
        case 'tunes':
            return <DiscAlbum className="w-full h-full text-yellow-400 animate-pulse" style={{filter: 'drop-shadow(0 0 5px #facc15)'}} />;
        case 'fuel_station':
            return <Zap className="w-full h-full text-cyan-400 animate-flash-blue-bolt" />;
        case 'dropped_pill':
            return <FlashingPillIcon className="w-full h-full -rotate-45" />;
        default:
            return null;
    }
}

const FloorTile = ({ isPlayerOnTile, isDroppedPillOnTile, isEnemyOnTile }: { isPlayerOnTile: boolean, isDroppedPillOnTile: boolean, isEnemyOnTile: boolean }) => {
    return (
        <div className={cn(
            "w-full h-full bg-slate-800",
            "border-t-slate-600 border-l-slate-600 border-r-slate-900 border-b-slate-900 border-2 shadow-inner",
            isPlayerOnTile && "bg-orange-900/50 border-orange-500",
            (isDroppedPillOnTile || isEnemyOnTile) && "animate-glow-blue-border"
        )}>
        </div>
    )
}

const WallTile = () => {
    return (
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Top face */}
            <div className="absolute w-full h-full bg-slate-600 border border-slate-500" 
                 style={{ transform: `translateZ(${TILE_HEIGHT}px)` }}>
            </div>
            {/* Front face */}
            <div className="absolute w-full h-full bg-slate-700 border-b border-slate-800" 
                 style={{ 
                    height: `${TILE_HEIGHT}px`,
                    transform: `rotateX(-90deg) translateY(${TILE_HEIGHT}px)`,
                    transformOrigin: 'top center' 
                }}>
            </div>
             {/* Side face */}
            <div className="absolute w-full h-full bg-slate-800 border-r border-slate-900" 
                 style={{ 
                    width: `${TILE_HEIGHT}px`,
                    transform: `rotateY(90deg) translateX(-${TILE_HEIGHT}px)`,
                    transformOrigin: 'top right' 
                }}>
            </div>
        </div>
    )
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;
  
  const scale = 1.4;
  const containerWidth = 48 * 16; 
  const containerHeight = 48 * 16; 

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Center the view on the player's tile
  const translateX = centerX - (player.x * TILE_SIZE + TILE_SIZE / 2) * scale;
  const translateY = centerY - (player.y * TILE_SIZE + TILE_SIZE / 2) * scale;

  return (
    <div
      className="overflow-hidden rounded-lg bg-slate-900/50"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        perspective: '1200px',
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="relative transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transformStyle: 'preserve-3d',
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
            }}
        >
            {/* Maze Floor and Walls */}
            {maze.map((row, y) =>
                row.map((cell, x) => {
                  const isDroppedPillOnTile = items.some(item => item.x === x && item.y === y && item.type === 'dropped_pill');
                  const isEnemyOnTile = enemies.some(enemy => enemy.x === x && enemy.y === y);
                  return (
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
                        {cell === 0 ? <FloorTile 
                            isPlayerOnTile={player.x === x && player.y === y} 
                            isDroppedPillOnTile={isDroppedPillOnTile}
                            isEnemyOnTile={isEnemyOnTile}
                             /> : <WallTile />}
                    </div>
                  )
                })
            )}
            
            {/* Items */}
            {items.map((item, i) => (
            <div key={`item-${i}`} className={cn("absolute", item.type !== 'dropped_pill' && "p-1.5")} style={{
                top: `${item.y * TILE_SIZE}px`,
                left: `${item.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 10,
                transform: `translateZ(5px)`
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
                zIndex: 20,
                transform: `translateZ(${TILE_HEIGHT}px)`
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
                transform: `translateZ(${TILE_HEIGHT}px)`
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
