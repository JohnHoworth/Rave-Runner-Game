
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 40;

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-cyan-200" />;
        case 'pills':
            return <Pill className="w-full h-full text-cyan-200 -rotate-45" />;
        case 'tunes':
            return <DiscAlbum className="w-full h-full text-cyan-200" />;
        case 'fuel_station':
            return <Zap className="w-full h-full text-cyan-200" />;
        case 'dropped_pill':
            return <FlashingPillIcon className="w-full h-full -rotate-45" />;
        default:
            return null;
    }
}

const boardWidth = MAZE_WIDTH * TILE_SIZE;
const boardHeight = MAZE_HEIGHT * TILE_SIZE;

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

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
                    translateX(${400 - player.x*TILE_SIZE}px)
                    translateY(${300 - player.y*TILE_SIZE}px)
                    scale(2)
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
                            backgroundColor: cell === 1 ? 'hsl(var(--primary))' : 'hsl(var(--background))',
                            boxShadow: cell === 1 ? '0 0 8px hsl(var(--primary) / 0.7)' : 'none',
                        }}
                    />
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
            <div key={`enemy-${i}`} className="absolute p-1" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${enemy.x * TILE_SIZE}px) translateY(${enemy.y * TILE_SIZE}px)`,
                zIndex: 20,
                transition: 'all 0.4s linear',
            }}>
                <GhostIcon className="w-full h-full" />
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
