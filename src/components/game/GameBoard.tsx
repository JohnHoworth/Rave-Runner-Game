
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { cn } from "@/lib/utils";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 40; 
const TILE_HEIGHT = 42; // Increased height for rooftop geometry
const FLOOR_HEIGHT = 35;

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
    const topPanelStyle: React.CSSProperties = {
        backgroundImage: 'linear-gradient(45deg, hsl(var(--primary) / 0.5), hsl(var(--background) / 0.8) 50%, hsl(var(--primary) / 0.5))',
        backgroundSize: '100% 200%',
    };

    return (
        <div className="w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            <div 
                className={cn(
                    "w-full h-full shadow-inner border-t-cyan-700 border-l-cyan-700 border-b-blue-900/50 border-r-blue-900/50 border-2 absolute animate-flow-water",
                    isPlayerOnTile && "bg-orange-900/50 border-orange-500",
                    (isDroppedPillOnTile || isEnemyOnTile) && "animate-glow-blue-border"
                )}
                style={{ ...topPanelStyle, transform: `translateZ(${FLOOR_HEIGHT}px)` }}
            >
            </div>
             {/* Front Face */}
             <div className="absolute w-full bg-blue-900" style={{ 
                height: `${FLOOR_HEIGHT}px`,
                transform: `rotateX(-90deg)`,
                transformOrigin: 'top' 
            }}></div>
             {/* Left Face */}
            <div className="absolute h-full bg-blue-950" style={{ 
                width: `${FLOOR_HEIGHT}px`,
                transform: `rotateY(90deg)`,
                transformOrigin: 'right' 
            }}></div>
        </div>
    )
}

const WallTile = () => {
    const sidePanelStyle: React.CSSProperties = {
        backgroundColor: '#2d2222', // Dark brick/concrete color
        backgroundImage: `
            repeating-radial-gradient(circle at 50% 50%, #facc1555 0, #facc1555 1px, transparent 1px, transparent 10px),
            linear-gradient(to right, #3d3232 1px, transparent 1px),
            linear-gradient(to bottom, #3d3232 1px, transparent 1px)
        `,
        backgroundSize: '10px 12px, 10px 10px, 10px 10px'
    };

    const topPanelStyle: React.CSSProperties = {
        backgroundColor: '#1a1111',
        backgroundImage: `linear-gradient(#2a2121, #1a1111)`
    }
    
    const insetHeight = 4;
    const extrusionHeight = TILE_HEIGHT - insetHeight;
    const insetWidth = 4;

    return (
        <div className="w-full h-full relative" style={{ transformStyle: 'preserve-3d' }}>
            {/* Main Wall Faces */}
            <div className="absolute w-full" style={{ ...sidePanelStyle, height: `${extrusionHeight}px`, transform: `rotateX(-90deg)`, transformOrigin: 'top' }}></div>
            <div className="absolute h-full" style={{ ...sidePanelStyle, width: `${extrusionHeight}px`, transform: `rotateY(90deg)`, transformOrigin: 'right' }}></div>

            {/* Inset Top Surface */}
            <div className="absolute w-full h-full" style={{ ...topPanelStyle, transform: `translateZ(${extrusionHeight}px)` }}></div>

            {/* Inset Walls */}
            <div className="absolute bg-[#110a0a]" style={{ width: `${TILE_SIZE}px`, height: `${insetHeight}px`, transform: `translateY(${TILE_SIZE - insetWidth}px) translateZ(${extrusionHeight}px) rotateX(-90deg)`, transformOrigin: 'top' }}></div>
            <div className="absolute bg-[#110a0a]" style={{ width: `${TILE_SIZE}px`, height: `${insetHeight}px`, transform: `translateY(0px) translateZ(${extrusionHeight}px) rotateX(-90deg)`, transformOrigin: 'top' }}></div>
            <div className="absolute bg-[#0f0909]" style={{ height: `${TILE_SIZE}px`, width: `${insetHeight}px`, transform: `translateX(${insetWidth}px) translateZ(${extrusionHeight}px) rotateY(90deg)`, transformOrigin: 'right' }}></div>
            <div className="absolute bg-[#0f0909]" style={{ height: `${TILE_SIZE}px`, width: `${insetHeight}px`, transform: `translateX(0px) translateZ(${extrusionHeight}px) rotateY(90deg)`, transformOrigin: 'right' }}></div>


            {/* Central Extrusion */}
            <div className="absolute" style={{ transform: `translateX(${insetWidth}px) translateY(${insetWidth}px) translateZ(${extrusionHeight}px)`, width: `${TILE_SIZE - insetWidth*2}px`, height: `${TILE_SIZE - insetWidth*2}px`, transformStyle: 'preserve-3d' }}>
                 {/* Top */}
                <div className="absolute w-full h-full bg-[#3a3131]" style={{ transform: `translateZ(${insetHeight}px)` }}></div>
                {/* Sides */}
                <div className="absolute w-full bg-[#2a2121]" style={{ height: `${insetHeight}px`, transform: 'rotateX(-90deg)', transformOrigin: 'top'}}></div>
                <div className="absolute h-full bg-[#1a1111]" style={{ width: `${insetHeight}px`, transform: 'rotateY(90deg)', transformOrigin: 'right'}}></div>
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
  const translateX = centerX - (player.x * TILE_SIZE + TILE_SIZE / 2);
  const translateY = centerY - (player.y * TILE_SIZE + TILE_SIZE / 2);

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
                transform: `rotateX(55deg) rotateZ(-45deg) translate(${translateX}px, ${translateY}px) scale(${scale}) translateZ(20px)`,
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
                            transformStyle: 'preserve-3d'
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

            {/* Enemies */}
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

            {/* Player Icon */}
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

    

    
