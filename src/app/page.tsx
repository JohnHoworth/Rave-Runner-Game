"use client";

import { useState, useEffect, useCallback } from "react";
import GameBoard from '@/components/game/GameBoard';
import GameUI from '@/components/game/GameUI';
import Header from '@/components/layout/Header';
import type { GameState, Level, Item } from "@/lib/types";
import { generateMaze, findEmptySpots, MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";

const INITIAL_LEVELS: Level[] = [
    { name: "Your Love", artist: "Frankie Knuckles", theme: "Chicago Warehouse" },
    { name: "Strings of Life", artist: "Rhythim is Rhythim", theme: "Detroit Underground" },
    { name: "Pacific State", artist: "808 State", theme: "UK Open Field Rave" },
    { name: "Can You Feel It?", artist: "Mr. Fingers", theme: "European Warehouse" },
    { name: "Energy Flash", artist: "Joey Beltram", theme: "Bass-Heavy Techno Bunker" },
    { name: "Acid Tracks", artist: "Phuture", theme: "Chicago Acid House" },
    { name: "Music Sounds Better With You", artist: "Stardust", theme: "French House Rooftop" },
];

const createInitialState = (): GameState => {
  const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const emptySpots = findEmptySpots(maze, 20); // Find 20 empty spots for player, enemies, items

  const playerPos = emptySpots.pop()!;
  const enemyPositions = [emptySpots.pop()!, emptySpots.pop()!, emptySpots.pop()!];
  
  const items: Item[] = [
    ...Array(5).fill(0).map(() => ({ type: 'flyer' as const, ...emptySpots.pop()! })),
    ...Array(5).fill(0).map(() => ({ type: 'glowstick' as const, ...emptySpots.pop()! })),
    ...Array(3).fill(0).map(() => ({ type: 'vinyl' as const, ...emptySpots.pop()! })),
  ].filter(item => item.x !== undefined);


  return {
    score: 0,
    raveBucks: 0,
    collectibles: { flyers: 0, glowsticks: 0, vinyls: 0 },
    level: 1,
    player: playerPos,
    enemies: enemyPositions,
    items: items,
    maze: maze,
  };
}


export default function Home() {
  const [gameState, setGameState] = useState<GameState>(createInitialState());
  const [levels] = useState<Level[]>(INITIAL_LEVELS);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      const newPlayerPos = { x: prev.player.x + dx, y: prev.player.y + dy };
      
      // Check wall collision
      if (prev.maze[newPlayerPos.y]?.[newPlayerPos.x] === 1) {
        return prev;
      }
      
      // Check boundaries
      if (newPlayerPos.x < 0 || newPlayerPos.x >= MAZE_WIDTH || newPlayerPos.y < 0 || newPlayerPos.y >= MAZE_HEIGHT) {
        return prev;
      }

      const newState = { ...prev, player: newPlayerPos };

      // Check item collision
      const itemIndex = newState.items.findIndex(item => item.x === newPlayerPos.x && item.y === newPlayerPos.y);
      if (itemIndex > -1) {
        const collectedItem = newState.items.splice(itemIndex, 1)[0];
        newState.collectibles = {...newState.collectibles};
        
        if (collectedItem.type === 'flyer') {
          newState.score += 10;
          newState.collectibles.flyers++;
        }
        if (collectedItem.type === 'glowstick') {
          newState.score += 20;
          newState.collectibles.glowsticks++;
        }
        if (collectedItem.type === 'vinyl') {
          newState.score += 50;
          newState.raveBucks += 5;
          newState.collectibles.vinyls++;
        }
      }
      
      return newState;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      if (e.key === 'ArrowUp') movePlayer(0, -1);
      if (e.key === 'ArrowDown') movePlayer(0, 1);
      if (e.key === 'ArrowLeft') movePlayer(-1, 0);
      if (e.key === 'ArrowRight') movePlayer(1, 0);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  return (
    <div className="flex flex-col h-screen bg-background font-body text-foreground overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden">
        <GameUI gameState={gameState} levels={levels} />
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-black/50">
          <GameBoard gameState={gameState} />
        </div>
      </main>
    </div>
  );
}
