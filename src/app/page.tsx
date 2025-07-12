
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from '@/components/game/GameBoard';
import GameUI from '@/components/game/GameUI';
import Header from '@/components/layout/Header';
import type { GameState, Level, Item, CollectibleType, Position, PlayerDirection } from "@/lib/types";
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
    player: { ...playerPos, direction: 'down' },
    enemies: enemyPositions,
    items: items,
    maze: maze,
  };
}


export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levels] = useState<Level[]>(INITIAL_LEVELS);
  const [isBusted, setIsBusted] = useState(false);
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasInteractedRef = useRef(false);

  const playMoveSound = () => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    oscillator.frequency.setValueAtTime(440, audioContextRef.current.currentTime);
    oscillator.type = 'sine';

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.05);
  };
  
  const playBustedSound = () => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    gainNode.gain.setValueAtTime(0.2, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.5);
    
    oscillator.frequency.setValueAtTime(220, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, audioContextRef.current.currentTime + 0.5);
    oscillator.type = 'sawtooth';

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.5);
  };

  const playCollectSound = () => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);

    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.2);
    
    oscillator.frequency.setValueAtTime(880, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1760, audioContextRef.current.currentTime + 0.2);
    oscillator.type = 'triangle';

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.2);
  };


  const resetGame = useCallback(() => {
    if (isBusted) return; // Prevent multiple resets

    playBustedSound();
    setIsBusted(true);
    toast({
      title: "You Got Busted!",
      description: "The party busters caught you. Try again!",
      variant: "destructive",
    });

    setTimeout(() => {
        setGameState(createInitialState());
        setIsBusted(false);
    }, 2000);
  }, [isBusted, toast]);

  const movePlayer = useCallback((dx: number, dy: number, direction: PlayerDirection) => {
    if (isBusted) return;
    setGameState(prev => {
      if (!prev) return null;
  
      const newPlayerPos = { x: prev.player.x + dx, y: prev.player.y + dy };
  
      // Wall collision check
      if (
        newPlayerPos.y < 0 || newPlayerPos.y >= MAZE_HEIGHT ||
        newPlayerPos.x < 0 || newPlayerPos.x >= MAZE_WIDTH ||
        prev.maze[newPlayerPos.y]?.[newPlayerPos.x] === 1
      ) {
        // Just update direction if moving against a wall
        return { ...prev, player: { ...prev.player, direction } };
      }

      playMoveSound();
      
      let newState = { ...prev, player: { ...newPlayerPos, direction } };
      
      // Check for collision with enemies
      for (const enemy of newState.enemies) {
        if (enemy.x === newPlayerPos.x && enemy.y === newPlayerPos.y) {
          setTimeout(resetGame, 0);
          return { ...newState };
        }
      }
  
      // Item collection
      const itemIndex = newState.items.findIndex(item => item.x === newPlayerPos.x && item.y === newPlayerPos.y);
      if (itemIndex > -1) {
        playCollectSound();
        const collectedItem = newState.items[itemIndex];
        
        const newItems = [...newState.items];
        newItems.splice(itemIndex, 1);
        
        const newCollectibles = { ...newState.collectibles };
        let newScore = newState.score;
        let newRaveBucks = newState.raveBucks;
  
        if (collectedItem.type === 'flyer') {
          newScore += 10;
          newCollectibles.flyers++;
        }
        if (collectedItem.type === 'glowstick') {
          newScore += 20;
          newCollectibles.glowsticks++;
        }
        if (collectedItem.type === 'vinyl') {
          newScore += 50;
          newRaveBucks += 5;
          newCollectibles.vinyls++;
        }
        
        newState = {
            ...newState,
            items: newItems,
            collectibles: newCollectibles,
            score: newScore,
            raveBucks: newRaveBucks,
        };
      }
  
      return newState;
    });
  }, [resetGame, isBusted]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        if (typeof window !== 'undefined' && !audioContextRef.current) {
          try {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          } catch (e) {
            console.error("Web Audio API is not supported in this browser");
          }
        }
      }

      if (e.key === 'ArrowUp') movePlayer(0, -1, 'up');
      if (e.key === 'ArrowDown') movePlayer(0, 1, 'down');
      if (e.key === 'ArrowLeft') movePlayer(-1, 0, 'left');
      if (e.key === 'ArrowRight') movePlayer(1, 0, 'right');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer]);

  useEffect(() => {
    if (isBusted) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        if (!prev) return null;

        const newState = { ...prev };
        const { player, maze } = newState;

        const newEnemies = newState.enemies.map(enemy => {
          const path = findPath(enemy, player, maze);
          if (path && path.length > 1) {
            return path[1];
          }
          return enemy; 
        });

        for (const enemy of newEnemies) {
          if (enemy.x === player.x && enemy.y === player.y) {
             setTimeout(resetGame, 0);
             return { ...newState, enemies: newEnemies };
          }
        }
        
        return { ...newState, enemies: newEnemies };
      });

    }, 400); 

    return () => clearInterval(gameLoop);
  }, [resetGame, isBusted]);

  useEffect(() => {
    setGameState(createInitialState());
  }, []);

  if (!gameState) {
    return (
      <div className="flex flex-col h-screen bg-background font-body text-foreground overflow-hidden items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="text-xl mt-4 text-accent">Loading Game...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background font-body text-foreground overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden relative">
        <GameUI gameState={gameState} levels={levels} />
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-black/50">
          <GameBoard gameState={gameState} />
        </div>
        {isBusted && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                <h1 className="text-9xl font-extrabold text-destructive animate-pulse tracking-widest font-headline">
                    BUSTED
                </h1>
            </div>
        )}
      </main>
    </div>
  );
}
