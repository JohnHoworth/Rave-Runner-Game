
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 40;
const WALL_HEIGHT = 40;

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-green-400" />;
        case 'pills':
            return <Pill className="w-full h-full text-pink-500 -rotate-45" />;
        case 'tunes':
            return <DiscAlbum className="w-full h-full text-yellow-400" />;
        case 'fuel_station':
            return <Zap className="w-full h-full text-cyan-400" />;
        case 'dropped_pill':
            return <FlashingPillIcon className="w-full h-full -rotate-45" />;
        default:
            return null;
    }
}

const FloorTile = () => (
    <div
        className="bg-background"
        style={{
            position: 'absolute',
            width: TILE_SIZE,
            height: TILE_SIZE,
        }}
    />
);

const WallPlane = ({ orientation, color }: { orientation: 'horizontal' | 'vertical', color: string }) => {
  const baseStyle: React.CSSProperties = {
    position: 'absolute',
    background: color,
    transformOrigin: 'bottom',
  };

  const style = orientation === 'horizontal'
    ? {
        ...baseStyle,
        width: TILE_SIZE,
        height: WALL_HEIGHT,
        transform: `rotateX(-90deg) translateY(-${TILE_SIZE}px)`,
      }
    : {
        ...baseStyle,
        width: WALL_HEIGHT,
        height: TILE_SIZE,
        transform: `rotateY(90deg) translateX(-${TILE_SIZE}px)`,
      };

  return <div style={style} />;
}


export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  const boardWidth = MAZE_WIDTH * TILE_SIZE;
  const boardHeight = MAZE_HEIGHT * TILE_SIZE;

  return (
    <div
      className="overflow-hidden rounded-lg bg-background"
      style={{
        width: `800px`,
        height: `600px`,
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
                    perspective(1200px)
                    translateX(${400 - player.x*TILE_SIZE}px)
                    translateY(${200 - player.y*TILE_SIZE}px)
                    rotateX(60deg)
                    rotateZ(-45deg)
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
                            transform: `translateX(${x * TILE_SIZE}px) translateY(${y * TILE_SIZE}px)`,
                            transformStyle: 'preserve-3d',
                        }}
                    >
                        {cell === 0 && <FloorTile />}
                         {cell === 1 && (
                          <>
                           {/* Horizontal Wall (top) */}
                            {y > 0 && maze[y - 1][x] === 0 && <WallPlane orientation="horizontal" color="hsl(var(--primary) / 0.7)" />}
                            {/* Vertical Wall (left) */}
                            {x > 0 && maze[y][x - 1] === 0 && <WallPlane orientation="vertical" color="hsl(var(--primary))" />}
                          </>
                        )}
                    </div>
                  )
                )
            )}
            
            {items.map((item, i) => (
            <div key={`item-${i}`} className="absolute" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${item.x * TILE_SIZE}px) translateY(${item.y * TILE_SIZE}px) translateZ(1px)`,
                zIndex: 10,
            }}>
                <ItemIcon type={item.type} />
            </div>
            ))}

            {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="absolute" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${enemy.x * TILE_SIZE}px) translateY(${enemy.y * TILE_SIZE}px) translateZ(1px)`,
                zIndex: 20,
                transition: 'all 0.4s linear',
            }}>
                <GhostIcon className="w-full h-full" />
            </div>
            ))}

            <div className="absolute" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${player.x * TILE_SIZE}px) translateY(${player.y * TILE_SIZE}px) rotateX(-90deg) translateZ(20px)`,
                transformOrigin: 'center bottom',
                zIndex: 30,
            }}>
                <PlayerIcon className="w-full h-full" />
            </div>
        </div>
    </div>
  );
}
