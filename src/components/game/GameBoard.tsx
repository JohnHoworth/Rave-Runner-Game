
"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Pill, Zap } from "lucide-react";
import { MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import FlashingPillIcon from "../icons/FlashingPillIcon";

const TILE_SIZE = 40;
const WALL_HEIGHT = 20;

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

const WallSegment = ({ color, style }: { color: string, style: React.CSSProperties }) => {
  return (
    <div className="absolute" style={{...style, transformStyle: 'preserve-3d'}}>
        <div className="absolute w-full h-full animate-pulse-glow-secondary" style={{ background: color, transform: `translateZ(-2.5px)` }} />
    </div>
  )
}

const boardWidth = MAZE_WIDTH * TILE_SIZE;
const boardHeight = MAZE_HEIGHT * TILE_SIZE;

const floorGridStyle: React.CSSProperties = {
  width: boardWidth,
  height: boardHeight,
  backgroundImage: `
    linear-gradient(hsl(var(--primary) / 0.2) 1px, transparent 1px),
    linear-gradient(90deg, hsl(var(--primary) / 0.2) 1px, transparent 1px)
  `,
  backgroundSize: `${TILE_SIZE}px ${TILE_SIZE}px`,
  position: 'absolute',
  transform: `translate(-50%, -50%)`,
  left: '50%',
  top: '50%',
}

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
                    perspective(1200px)
                    translateX(${400 - player.x*TILE_SIZE}px)
                    translateY(${300 - player.y*TILE_SIZE}px)
                    rotateX(60deg)
                    rotateZ(-45deg)
                    translateZ(200px)
                `,
            }}
        >
            <div style={floorGridStyle} />

            {maze.map((row, y) =>
                row.map((cell, x) => {
                    if (cell === 1) {
                        return (
                          <div key={`${x}-${y}`} className="absolute" style={{
                              width: `${TILE_SIZE}px`,
                              height: `${TILE_SIZE}px`,
                              transform: `translateX(${x * TILE_SIZE}px) translateY(${y * TILE_SIZE}px)`,
                              transformStyle: 'preserve-3d',
                          }}>
                              {/* Horizontal Wall */}
                              {y > 0 && maze[y-1][x] === 0 && 
                                <WallSegment color="hsl(var(--primary) / 0.5)" style={{width: TILE_SIZE, height: WALL_HEIGHT, transform: `translateY(-${TILE_SIZE/2}px)`}} />
                              }
                              {y < MAZE_HEIGHT - 1 && maze[y+1][x] === 0 && 
                                <WallSegment color="hsl(var(--primary) / 0.5)" style={{width: TILE_SIZE, height: WALL_HEIGHT, transform: `translateY(${TILE_SIZE/2}px)`}} />
                              }
                              {/* Vertical Wall */}
                              {x > 0 && maze[y][x-1] === 0 && 
                                <WallSegment color="hsl(var(--primary) / 0.5)" style={{width: WALL_HEIGHT, height: TILE_SIZE, transform: `translateX(-${TILE_SIZE/2}px) rotateY(90deg)`}} />
                              }
                              {x < MAZE_WIDTH - 1 && maze[y][x+1] === 0 && 
                                <WallSegment color="hsl(var(--primary) / 0.5)" style={{width: WALL_HEIGHT, height: TILE_SIZE, transform: `translateX(${TILE_SIZE/2}px) rotateY(90deg)`}} />
                              }
                          </div>
                        )
                    }
                    return null;
                })
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
                transform: `translateX(${enemy.x * TILE_SIZE}px) translateY(${enemy.y * TILE_SIZE}px) translateZ(${WALL_HEIGHT/2}px)`,
                zIndex: 20,
                transition: 'all 0.4s linear',
            }}>
                <GhostIcon className="w-full h-full" />
            </div>
            ))}

            <div className="absolute" style={{
                width: `${TILE_SIZE}px`,
                height: `${TILE_SIZE}px`,
                transform: `translateX(${player.x * TILE_SIZE}px) translateY(${player.y * TILE_SIZE}px) rotateX(-90deg) translateZ(${WALL_HEIGHT-5}px)`,
                transformOrigin: 'center bottom',
                zIndex: 30,
            }}>
                <PlayerIcon className="w-full h-full" />
            </div>
        </div>
    </div>
  );
}
