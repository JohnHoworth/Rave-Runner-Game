"use client";

import { useState, useEffect, useCallback } from "react";
import GameBoard from '@/components/game/GameBoard';
import GameUI from '@/components/game/GameUI';
import Header from '@/components/layout/Header';
import type { GameState, Level, Item, CollectibleType, Position } from "@/lib/types";
import { generateMaze, findEmptySpots, MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { findPath } from "@/lib/pathfinding";

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
  const emptySpots = findEmptySpots(maze, 20); 

  const playerPos = emptySpots.pop();
  if (!playerPos) throw new Error("Could not find an empty spot for the player.");

  const enemyPositions = [emptySpots.pop(), emptySpots.pop(), emptySpots.pop()]
    .filter((p): p is Position => !!p);
  
  const items: Item[] = [];
  const itemTypes: CollectibleType[] = [
    ...Array(5).fill('flyer'),
    ...Array(5).fill('glowstick'),
    ...Array(3).fill('vinyl')
  ];

  itemTypes.forEach(type => {
    const pos = emptySpots.pop();
    if (pos) {
      items.push({ type, ...pos });
    }
  });

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
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levels] = useState<Level[]>(INITIAL_LEVELS);
  const { toast } = useToast();

  useEffect(() => {
    setGameState(createInitialState());
  }, []);

  const movePlayer = useCallback((dx: number, dy: number) => {
    setGameState(prev => {
      if (!prev) return null;

      const newPlayerPos = { x: prev.player.x + dx, y: prev.player.y + dy };
      
      if (prev.maze[newPlayerPos.y]?.[newPlayerPos.x] === 1) {
        return prev;
      }
      
      if (newPlayerPos.x < 0 || newPlayerPos.x >= MAZE_WIDTH || newPlayerPos.y < 0 || newPlayerPos.y >= MAZE_HEIGHT) {
        return prev;
      }

      const newState = { ...prev, player: newPlayerPos };

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

  // Game loop for enemy movement
  useEffect(() => {
    if (!gameState) return;

    const gameLoop = setInterval(() => {
      const { enemies, player, maze } = gameState;

      const newEnemies = enemies.map(enemy => {
        const path = findPath(enemy, player, maze);
        if (path && path.length > 1) {
          return path[1];
        }
        return enemy;
      });

      let playerCaught = false;
      for (const enemy of newEnemies) {
        if (enemy.x === player.x && enemy.y === player.y) {
          playerCaught = true;
          break;
        }
      }

      if (playerCaught) {
        toast({
          title: "You Got Busted!",
          description: "The party busters caught you. Try again!",
          variant: "destructive",
        });
        setGameState(createInitialState());
      } else {
        setGameState(prev => {
            if (!prev) return null;
            return { ...prev, enemies: newEnemies };
        });
      }
    }, 400);

    return () => clearInterval(gameLoop);
  }, [gameState, toast]);


  if (!gameState) {
    return (
      <div className="flex flex-col h-screen bg-background font-body text-foreground overflow-hidden items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl mt-4 text-accent">Loading the Rave...</p>
      </div>
    );
  }

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
