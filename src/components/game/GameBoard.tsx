
"use client";

import * as React from "react";
import PlayerIcon from "@/components/icons/PlayerIcon";
import PoliceSirenIcon from "@/components/icons/PoliceSirenIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import FlashingPillIcon from "../icons/FlashingPillIcon";
import { cn } from "@/lib/utils";

const TILE_SIZE = 40;

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-green-400" style={{filter: 'drop-shadow(0 0 5px #39FF14)'}} />;
        case 'pills':
            return <Pill className="w-full h-full text-red-500 -rotate-45" style={{filter: 'drop-shadow(0 0 3px #ff0000)'}} />;
        case 'tunes':
            return <DiscAlbum className="w-full h-full text-yellow-300" style={{filter: 'drop-shadow(0 0 5px #DFFF00)'}} />;
        case 'fuel_station':
            return <Zap className="w-full h-full text-blue-400 animate-flash-blue-glow" />;
        case 'dropped_pill':
            return <FlashingPillIcon className="w-full h-full -rotate-45" />;
        default:
            return null;
    }
}

const Building = ({ x, y, isFlashing }: { x: number, y: number, isFlashing: boolean }) => {
    const style = React.useMemo(() => {
        const seed = (x * 13 + y * 29) % 100;
        
        const roofColors = ['#4a4a4a', '#5a5a5a', '#6a6a6a', '#7a7a7a'];
        const buildingColors = ['#a9a9a9', '#bdc3c7', '#95a5a6'];

        const roofColor = roofColors[seed % roofColors.length];
        const buildingColor = buildingColors[seed % buildingColors.length];
        
        const styleType = seed % 3;

        return {
            width: TILE_SIZE,
            height: TILE_SIZE,
            backgroundColor: buildingColor,
            border: `1px solid ${roofColor}`,
            position: 'relative' as const,
            boxSizing: 'border-box' as const,
            styleType,
            roofColor,
        };
    }, [x, y]);

    return (
        <div 
            className={cn(isFlashing && 'animate-flash-green-glow-building')}
            style={{
                width: style.width,
                height: style.height,
                backgroundColor: style.backgroundColor,
                border: style.border,
                position: style.position,
                boxSizing: style.boxSizing,
            }}
        >
            {style.styleType === 0 && ( 
                 <div style={{ width: '80%', height: '80%', backgroundColor: style.roofColor, margin: '10%' }} />
            )}
            {style.styleType === 1 && ( 
                <>
                    <div style={{ width: '100%', height: '50%', backgroundColor: style.roofColor, position: 'absolute', top: 0 }} />
                    <div style={{ width: '100%', height: '50%', backgroundColor: `rgba(0,0,0,0.1)`, position: 'absolute', bottom: 0 }} />
                </>
            )}
            {style.styleType === 2 && ( 
                 <div style={{
                    width: '20%',
                    height: '20%',
                    backgroundColor: '#333',
                    position: 'absolute',
                    top: '20%',
                    left: '40%',
                    boxShadow: '0 0 2px black',
                }} />
            )}
        </div>
    );
};


const boardWidth = MAZE_WIDTH * TILE_SIZE;
const boardHeight = MAZE_HEIGHT * TILE_SIZE;

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items, flashingBuildings } = gameState;

  const droppedPillPositions = new Set(
    items
      .filter((item) => item.type === 'dropped_pill')
      .map((item) => `${item.x},${item.y}`)
  );

  const flashingBuildingPositions = new Set(
    flashingBuildings.map((pos) => `${pos.x},${pos.y}`)
  );

  return (
    <div
      className="overflow-hidden rounded-lg bg-gray-800"
      style={{
        width: `800px`,
        height: `600px`,
      }}
      data-ai-hint="top down city view"
    >
        <div
            className="relative transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transform: `
                    translateX(${400 - player.x*TILE_SIZE}px)
                    translateY(${300 - player.y*TILE_SIZE}px)
                    scale(1.5)
                `,
            }}
        >
            {maze.map((row, y) =>
                row.map((cell, x) => (
                    <div
                        key={`${x}-${y}`}
                        className="absolute"
                        style={{
                            width: TILE_SIZE,
                            height: TILE_SIZE,
                            left: x * TILE_SIZE,
                            top: y * TILE_SIZE,
                        }}
                    >
                        {cell === 1 ? (
                            <Building x={x} y={y} isFlashing={flashingBuildingPositions.has(`${x},${y}`)} />
                        ) : (
                            <div className={cn("w-full h-full", 
                                droppedPillPositions.has(`${x},${y}`) && "animate-flash-blue-glow-bg"
                            )} 
                            style={{ 
                                backgroundColor: '#3d3d3d',
                                backgroundImage: `
                                    radial-gradient(circle at 1px 1px, rgba(255,255,255,0.05) 1px, transparent 0)
                                `,
                                backgroundSize: '5px 5px'
                            }}/>
                        )}
                    </div>
                ))
            )}
            
            {items.map((item, i) => (
            <div key={`item-${i}`} className="absolute p-1" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${item.x * TILE_SIZE}px) translateY(${item.y * TILE_SIZE}px)`,
                zIndex: 10,
            }}>
                <ItemIcon type={item.type} />
            </div>
            ))}

            {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="absolute" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${enemy.x * TILE_SIZE}px) translateY(${enemy.y * TILE_SIZE}px)`,
                zIndex: 20,
                transition: 'all 0.4s linear',
            }}>
                <PoliceSirenIcon className="w-full h-full" />
            </div>
            ))}

            <div className="absolute p-1" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${player.x * TILE_SIZE}px) translateY(${player.y * TILE_SIZE}px)`,
                zIndex: 30,
            }}>
                <PlayerIcon className="w-full h-full" />
            </div>
        </div>
    </div>
  );
}
