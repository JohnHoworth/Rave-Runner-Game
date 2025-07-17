
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
const FLOOR_HEIGHT = 4;

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

const FloorTile = () => {
    const topPanelStyle: React.CSSProperties = {
        backgroundColor: 'hsl(220, 10%, 12%)',
        backgroundImage: `
            linear-gradient(hsl(220, 10%, 18%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(220, 10%, 18%) 1px, transparent 1px)
        `,
        backgroundSize: '100% 100%, 100% 100%',
        backgroundPosition: 'center center',
    };
    const sidePanelStyle: React.CSSProperties = {
        backgroundColor: 'hsl(220, 10%, 8%)'
    };
    const frontPanelStyle: React.CSSProperties = {
        backgroundColor: 'hsl(220, 10%, 10%)'
    };

    return (
        <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            <div className="w-full h-full absolute" style={{ ...topPanelStyle, transform: `translateZ(${FLOOR_HEIGHT}px)` }}></div>
            <div className="absolute w-full" style={{ ...frontPanelStyle, height: `${FLOOR_HEIGHT}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top' }}></div>
            <div className="absolute h-full" style={{ ...sidePanelStyle, width: `${FLOOR_HEIGHT}px`, transform: 'rotateY(90deg)', transformOrigin: 'right' }}></div>
        </div>
    )
}

const WallTile = () => {
    const topPanelStyle: React.CSSProperties = {
        backgroundColor: 'hsl(220, 15%, 25%)',
        backgroundImage: 'linear-gradient(hsla(0, 0%, 100%, 0.05), hsla(0, 0%, 0%, 0.1))'
    };
    const sidePanelStyle: React.CSSProperties = {
        backgroundImage: `
            /* Main metallic texture */
            linear-gradient(to right, hsl(220, 15%, 15%), hsl(220, 15%, 22%)),
            /* Cyan glow */
            linear-gradient(to right, transparent, transparent 10%, cyan 12%, cyan 14%, transparent 16%, transparent 84%, cyan 86%, cyan 88%, transparent 90%, transparent),
            /* Orange lights */
            repeating-linear-gradient(to top, transparent, transparent 4px, hsl(30, 100%, 50%) 5px, hsl(30, 100%, 50%) 7px, transparent 8px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: 'center, center, 5% center, 95% center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
    };
    const frontPanelStyle: React.CSSProperties = {
        backgroundImage: `
            /* Main metallic texture */
            linear-gradient(to right, hsl(220, 15%, 22%), hsl(220, 15%, 28%)),
            /* Cyan glow */
            linear-gradient(to right, transparent, transparent 10%, cyan 12%, cyan 14%, transparent 16%, transparent 84%, cyan 86%, cyan 88%, transparent 90%, transparent),
            /* Orange lights */
            repeating-linear-gradient(to top, transparent, transparent 4px, hsl(30, 100%, 50%) 5px, hsl(30, 100%, 50%) 7px, transparent 8px)
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%',
        backgroundPosition: 'center, center, 5% center, 95% center',
        backgroundRepeat: 'no-repeat, no-repeat, no-repeat'
    };

    return (
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Top Surface */}
            <div className="absolute w-full h-full" style={{ ...topPanelStyle, transform: `translateZ(${TILE_HEIGHT}px)` }}></div>
            {/* Front Face */}
            <div className="absolute w-full" style={{ ...frontPanelStyle, height: `${TILE_HEIGHT}px`, transform: `rotateX(-90deg)`, transformOrigin: 'top' }}></div>
            {/* Left Face */}
            <div className="absolute h-full" style={{ ...sidePanelStyle, width: `${TILE_HEIGHT}px`, transform: `rotateY(90deg)`, transformOrigin: 'right' }}></div>
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

  const translateX = centerX - (player.x * TILE_SIZE + TILE_SIZE / 2);
  const translateY = centerY - (player.y * TILE_SIZE + TILE_SIZE / 2);

  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        perspective: '1200px',
        background: 'hsl(220, 15%, 10%)' 
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="relative transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transformStyle: 'preserve-3d',
                transform: `rotateX(55deg) rotateZ(-45deg) translate(${translateX}px, ${translateY}px) scale(${scale}) translateZ(20px)`,
            }}
        >
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
                            transformStyle: 'preserve-3d'
                        }}
                    >
                        {cell === 0 ? <FloorTile /> : <WallTile />}
                    </div>
                  )
                )
            )}
            
            {items.map((item, i) => (
            <div key={`item-${i}`} className="absolute" style={{
                top: `${item.y * TILE_SIZE}px`,
                left: `${item.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 10,
                transform: `translateZ(${FLOOR_HEIGHT}px)`
            }}>
                <ItemIcon type={item.type} />
            </div>
            ))}

            {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="absolute" style={{
                top: `${enemy.y * TILE_SIZE}px`,
                left: `${enemy.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 20,
                transform: `translateZ(${FLOOR_HEIGHT}px)`,
                transition: 'all 0.4s linear',
            }}>
                <GhostIcon className="w-full h-full" />
            </div>
            ))}

            <div className="absolute" style={{
                top: `${player.y * TILE_SIZE}px`,
                left: `${player.x * TILE_SIZE}px`,
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                zIndex: 30,
                transform: `translateZ(${FLOOR_HEIGHT}px)`
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
