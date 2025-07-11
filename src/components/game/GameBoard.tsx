
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item, PlayerDirection } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";

const TILE_SIZE = 32; 
const VIEWPORT_SIZE_REM = 48;
const WALL_HEIGHT = TILE_SIZE * 0.75;

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

const getCameraRotation = (direction: PlayerDirection) => {
    switch (direction) {
        case 'up': return 45;
        case 'down': return 225;
        case 'left': return 135;
        case 'right': return -45;
        default: return 225;
    }
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const mazeTx = -toIsometricX(player.x, player.y);
  const mazeTy = -toIsometricY(player.x, player.y);
  const cameraRotation = getCameraRotation(player.direction);

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
                className="absolute transition-transform duration-300 ease-in-out"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `scale(2.5) rotateX(55deg) rotateZ(${cameraRotation}deg) translateX(${mazeTx}px) translateY(${mazeTy}px)`,
                }}
            >
                {/* Maze Floor */}
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
                            {cell === 0 && (
                                <div className="absolute inset-0 bg-primary/10 shadow-[inset_0_0_10px_hsl(var(--primary)/0.5)]" />
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
                    transform: `translateZ(5px) rotateZ(-${cameraRotation}deg) rotateX(-55deg)`
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
                    transform: `translateZ(10px) rotateZ(-${cameraRotation}deg) rotateX(-55deg)`
                }}>
                    <GhostIcon className="w-full h-full" />
                </div>
                ))}

                 {/* Player Icon */}
                 <div className="absolute" style={{
                    top: `${toIsometricY(player.x, player.y)}px`,
                    left: `${toIsometricX(player.x, player.y)}px`,
                    width: `${TILE_SIZE * 1.2}px`,
                    height: `${TILE_SIZE * 1.2}px`,
                    transform: `translateZ(10px) rotateZ(-${cameraRotation}deg) rotateX(-55deg)`,
                }}>
                    <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
                </div>
            </div>
        </div>
    </div>
  );
}
