
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { cn } from "@/lib/utils";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 20;

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
    const floorStyle: React.CSSProperties = {
        backgroundColor: 'hsl(215, 30%, 25%)',
        backgroundImage: `
            linear-gradient(hsl(215, 30%, 35%) 1px, transparent 1px),
            linear-gradient(90deg, hsl(215, 30%, 35%) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
    };
    return <div className="w-full h-full" style={floorStyle} />;
}

const WallTile = () => {
    const wallStyle: React.CSSProperties = {
        backgroundColor: 'hsl(215, 15%, 50%)',
        border: '1px solid hsl(215, 15%, 60%)',
    };
    return <div className="w-full h-full" style={wallStyle} />;
};

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;
  
  const scale = 2.0;
  const containerWidth = 48 * 16; 
  const containerHeight = 48 * 16; 

  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  const translateX = centerX - (player.x * TILE_SIZE * scale + (TILE_SIZE * scale) / 2);
  const translateY = centerY - (player.y * TILE_SIZE * scale + (TILE_SIZE * scale) / 2);

  return (
    <div
      className="overflow-hidden rounded-lg"
      style={{
        width: `${containerWidth}px`,
        height: `${containerHeight}px`,
        background: 'hsl(215, 28%, 17%)' 
      }}
      data-ai-hint="maze puzzle"
    >
        <div
            className="relative transition-transform duration-200 ease-linear"
            style={{
                width: boardWidth,
                height: boardHeight,
                transform: `translate(${translateX}px, ${translateY}px) scale(${scale})`,
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
            }}>
                <PlayerIcon className="w-full h-full drop-shadow-[0_0_8px_hsl(var(--accent))]" />
            </div>
        </div>
    </div>
  );
}
