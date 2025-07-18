
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 20;
const TILE_HEIGHT = 20; // Extrusion height for walls
const FLOOR_HEIGHT = 20; // Extrusion height for floor

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
        background: `
            linear-gradient(hsl(215, 30%, 35%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(215, 30%, 35%) 1px, transparent 1px),
            hsl(215, 30%, 25%)
        `,
        backgroundSize: '20px 20px',
    };

    const sidePanelStyle: React.CSSProperties = {
        backgroundColor: 'hsl(215, 30%, 20%)',
    };

    return (
        <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {/* Top Face */}
            <div className="absolute w-full h-full" style={{
                ...topPanelStyle,
                transform: `rotateX(90deg) translateZ(${FLOOR_HEIGHT / 2}px)`,
                transformOrigin: 'center'
            }} />
             {/* Bottom Face */}
             <div className="absolute w-full h-full" style={{
                ...sidePanelStyle,
                transform: `rotateX(-90deg) translateZ(${FLOOR_HEIGHT / 2}px)`,
                transformOrigin: 'center'
            }} />
            {/* Front Face */}
            <div className="absolute w-full h-full" style={{
                height: `${FLOOR_HEIGHT}px`,
                ...sidePanelStyle,
                transform: `translateZ(${FLOOR_HEIGHT / 2}px) rotateX(0deg)`,
                transformOrigin: 'top'
            }}/>
             {/* Back Face */}
             <div className="absolute w-full h-full" style={{
                height: `${FLOOR_HEIGHT}px`,
                ...sidePanelStyle,
                transform: `translateZ(-${FLOOR_HEIGHT / 2}px) rotateX(0deg)`,
                transformOrigin: 'top'
            }}/>
            {/* Left Face */}
            <div className="absolute w-full h-full" style={{
                width: `${FLOOR_HEIGHT}px`,
                ...sidePanelStyle,
                transform: `translateX(-${FLOOR_HEIGHT/2}px) rotateY(90deg)`,
                transformOrigin: 'right'
            }} />
             {/* Right Face */}
             <div className="absolute w-full h-full" style={{
                width: `${FLOOR_HEIGHT}px`,
                ...sidePanelStyle,
                transform: `translateX(${TILE_SIZE - FLOOR_HEIGHT/2}px) rotateY(-90deg)`,
                transformOrigin: 'left'
            }} />
        </div>
    );
};

const WallTile = () => {
  const commonFaceStyle: React.CSSProperties = {
    position: 'absolute',
    width: `${TILE_SIZE}px`,
    height: `${TILE_SIZE}px`,
    background: 'hsl(220, 25%, 20%)',
    border: '1px solid hsl(220, 25%, 30%)',
  };

  return (
    <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        {/* Top Face */}
        <div style={{ ...commonFaceStyle, background: 'hsl(220, 25%, 25%)', transform: `translateZ(${TILE_HEIGHT}px)` }} />
        {/* Bottom Face - Not visible but good for solidity */}
        <div style={{ ...commonFaceStyle, transform: `translateZ(0px)` }} />
        {/* Front Face */}
        <div style={{ ...commonFaceStyle, height: `${TILE_HEIGHT}px`, transform: `rotateX(-90deg) translateZ(${TILE_SIZE - TILE_HEIGHT}px)`, transformOrigin: 'bottom' }} />
        {/* Back Face */}
        <div style={{ ...commonFaceStyle, height: `${TILE_HEIGHT}px`, transform: `rotateX(90deg) translateZ(-${TILE_HEIGHT}px)`, transformOrigin: 'top' }} />
        {/* Left Face */}
        <div style={{ ...commonFaceStyle, width: `${TILE_HEIGHT}px`, transform: `rotateY(90deg) translateZ(${TILE_SIZE - TILE_HEIGHT}px)`, transformOrigin: 'right' }} />
        {/* Right Face */}
        <div style={{ ...commonFaceStyle, width: `${TILE_HEIGHT}px`, transform: `rotateY(-90deg) translateZ(${TILE_HEIGHT}px)`, transformOrigin: 'left' }} />
    </div>
  );
};


export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;

  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        width: `${48 * 16}px`,
        height: `${48 * 16}px`,
        background: 'hsl(215, 28%, 17%)',
        perspective: '1000px',
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="relative transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transformStyle: 'preserve-3d',
                transform: `
                    translateX(${24*16 - player.x*TILE_SIZE - TILE_SIZE/2}px)
                    translateY(${24*16 - player.y*TILE_SIZE - TILE_SIZE/2}px)
                    rotateX(60deg)
                    rotateZ(45deg)
                    translateZ(-100px)
                `,
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
                            transformStyle: 'preserve-3d',
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
                transform: `translateZ(${FLOOR_HEIGHT}px)`,
                zIndex: 10,
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
                transform: `translateZ(${FLOOR_HEIGHT}px)`,
                zIndex: 20,
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
                transform: `translateZ(${FLOOR_HEIGHT}px)`,
                zIndex: 30,
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
