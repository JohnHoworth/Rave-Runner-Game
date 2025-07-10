
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";

const TILE_SIZE = 24; 
const VIEWPORT_SIZE_REM = 40; 
const WALL_HEIGHT = 8;

// Helper functions to convert grid coordinates to isometric screen coordinates
const toIsometricX = (x: number, y: number) => (x - y) * (TILE_SIZE / 2);
const toIsometricY = (x: number, y: number) => (x + y) * (TILE_SIZE / 4);

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

  // Calculate the offset to center the player in the isometric view.
  const mazeTx = -toIsometricX(player.x, player.y);
  const mazeTy = -toIsometricY(player.x, player.y);

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
                    transform: `rotateX(60deg) rotateZ(45deg) translateX(${mazeTx}px) translateY(${mazeTy}px)`,
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
                                top: `${toIsometricY(x, y)}px`,
                                left: `${toIsometricX(x, y)}px`,
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            {cell === 1 ? (
                                <div className="absolute inset-0 bg-primary/40" style={{ transform: `translateZ(${WALL_HEIGHT/2}px)` }}>
                                    <div className="absolute inset-0 bg-primary/60" style={{ transform: `translateZ(-${WALL_HEIGHT/2}px) scaleY(0.5) rotateX(90deg)`, transformOrigin: 'bottom' }} />
                                    <div className="absolute inset-0 bg-primary/80" style={{ transform: `translateZ(-${WALL_HEIGHT/2}px) scaleX(0.5) rotateY(-90deg)`, transformOrigin: 'right' }} />
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-background/50" />
                            )}
                        </div>
                        ))
                    )}
                </div>

                 {/* Items */}
                {items.map((item, i) => (
                <div key={`item-${i}`} className="absolute p-1" style={{
                    top: `${toIsometricY(item.x, item.y)}px`,
                    left: `${toIsometricX(item.x, item.y)}px`,
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`,
                    transform: `translateZ(${WALL_HEIGHT + 2}px) rotateZ(-45deg) rotateX(-60deg)`
                }}>
                    <ItemIcon type={item.type} />
                </div>
                ))}

                {/* Enemies */}
                {enemies.map((enemy, i) => (
                <div key={`enemy-${i}`} className="absolute" style={{
                    top: `${toIsometricY(enemy.x, enemy.y)}px`,
                    left: `${toIsometricX(enemy.x, enemy.y)}px`,
                    width: `${TILE_SIZE}px`,
                    height: `${TILE_SIZE}px`,
                    transition: 'all 0.4s linear',
                    transform: `translateZ(${WALL_HEIGHT + 4}px) rotateZ(-45deg) rotateX(-60deg)`
                }}>
                    <GhostIcon className="w-full h-full" />
                </div>
                ))}

                 {/* Player Icon */}
                 <div className="absolute" style={{
                    top: `${toIsometricY(player.x, player.y)}px`,
                    left: `${toIsometricX(player.x, player.y)}px`,
                    width: `${TILE_SIZE * 1.5}px`,
                    height: `${TILE_SIZE * 1.5}px`,
                    transform: `translateZ(${WALL_HEIGHT + 4}px) rotateZ(-45deg) rotateX(-60deg)`,
                }}>
                    <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
                </div>
            </div>
        </div>
    </div>
  );
}
