
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";

const TILE_SIZE = 24; 
const VIEWPORT_SIZE_REM = 40; 

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

  // Calculate the offset to center the player in the isometric view
  const mazeTx = (-player.y * TILE_SIZE * 0.5) - (player.x * TILE_SIZE * 0.5);
  const mazeTy = (player.y * TILE_SIZE * 0.25) - (player.x * TILE_SIZE * 0.25);

  return (
    <div
      className="bg-transparent border-4 border-secondary shadow-2xl rounded-lg overflow-hidden relative"
      style={{
        width: `${VIEWPORT_SIZE_REM}rem`,
        height: `${VIEWPORT_SIZE_REM}rem`,
        perspective: '1000px',
      }}
      data-ai-hint="maze puzzle"
    >
        <div className="absolute inset-0 flex items-center justify-center">
            <div
                className="absolute transition-transform duration-100 ease-linear"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `translate(${mazeTx}px, ${mazeTy}px) rotateX(60deg) rotateZ(45deg) scale(1.5)`,
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
                                width: `${TILE_SIZE}px`,
                                height: `${TILE_SIZE}px`,
                                top: `${y * TILE_SIZE}px`,
                                left: `${x * TILE_SIZE}px`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {cell === 1 ? (
                                <div className="absolute inset-0 bg-primary/80" style={{ transform: 'translateZ(8px)' }}>
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
                <div key={`item-${i}`} className="absolute p-1" style={{
                    top: `${item.y * TILE_SIZE}px`,
                    left: `${item.x * TILE_SIZE}px`,
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`,
                    transform: 'translateZ(12px) rotateZ(-45deg) rotateX(-60deg)'
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
                    transform: 'translateZ(16px) rotateZ(-45deg) rotateX(-60deg)'
                }}>
                    <GhostIcon className="w-full h-full" />
                </div>
                ))}
            </div>

             {/* Player Icon (always centered) */}
             <div className="absolute" style={{
                width: `${TILE_SIZE * 1.5}px`,
                height: `${TILE_SIZE * 1.5}px`,
                transform: 'translateZ(16px)', 
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
