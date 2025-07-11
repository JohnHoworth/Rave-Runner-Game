
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item, PlayerDirection } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";

const TILE_SIZE = 32; 
const VIEWPORT_SIZE_REM = 48;

// Adjusted isometric conversion functions
const toIsometricX = (x: number, y: number) => (x - y) * (TILE_SIZE / Math.sqrt(2));
const toIsometricY = (x: number, y: number) => (x + y) * (TILE_SIZE / (2 * Math.sqrt(2)));


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

// Static camera rotation, does not change
const STATIC_CAMERA_ROTATION = 45;

const FloorTile = () => {
    return (
        <svg viewBox="-1 -1 34 18" className="w-full h-full overflow-visible">
            <defs>
                <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="0%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0.3}} />
                    <stop offset="100%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 0}} />
                </radialGradient>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="1.5" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <path
                d="M 16 0 L 32 8 L 16 16 L 0 8 Z"
                fill="url(#grad1)"
            />
            <path
                d="M 16 0 L 32 8 L 16 16 L 0 8 Z"
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="0.5"
                filter="url(#glow)"
            />
        </svg>
    )
}


export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  // Camera follows the player by translating the maze container
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
                className="absolute transition-transform duration-300 ease-in-out"
                style={{
                    transformStyle: 'preserve-3d',
                    // Static camera rotation + dynamic translation to follow player
                    transform: `scale(2.5) rotateX(55deg) rotateZ(${STATIC_CAMERA_ROTATION}deg) translateX(${mazeTx}px) translateY(${mazeTy}px)`,
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
                            {cell === 0 && <FloorTile />}
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
                    // Counter-rotate to keep items upright
                    transform: `translateZ(5px) rotateZ(-${STATIC_CAMERA_ROTATION}deg) rotateX(-55deg)`
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
                     // Counter-rotate to keep enemies upright
                    transform: `translateZ(10px) rotateZ(-${STATIC_CAMERA_ROTATION}deg) rotateX(-55deg)`
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
                     // Counter-rotate to keep player upright
                    transform: `translateZ(10px) rotateZ(-${STATIC_CAMERA_ROTATION}deg) rotateX(-55deg)`,
                }}>
                    <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
                </div>
            </div>
        </div>
    </div>
  );
}
