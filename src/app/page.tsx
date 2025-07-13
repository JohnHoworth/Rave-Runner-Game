
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from '@/components/game/GameBoard';
import GameUI from '@/components/game/GameUI';
import Header from '@/components/layout/Header';
import type { GameState, Level, Item, CollectibleType, Position, PlayerDirection } from "@/lib/types";
import { generateMaze, findEmptySpots, MAZE_WIDTH, MAZE_HEIGHT } from "@/lib/maze";
import { Loader2 } from "lucide-react";
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

const MAX_FUEL = 100;

const createInitialState = (): GameState => {
  const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const emptySpots = findEmptySpots(maze, 25); 

  const playerPos = emptySpots.pop();
  if (!playerPos) throw new Error("Could not find an empty spot for the player.");

  const enemyPositions = [emptySpots.pop(), emptySpots.pop(), emptySpots.pop()]
    .filter((p): p is Position => !!p);
  
  const items: Item[] = [];
  const itemTypes: CollectibleType[] = [
    ...Array(5).fill('flyer'),
    ...Array(5).fill('pills'),
    ...Array(3).fill('vinyl'),
    ...Array(2).fill('fuel_station')
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
    bustedCount: 0,
    collectibles: { flyers: 0, pills: 0, vinyls: 0 },
    level: 1,
    player: { ...playerPos, direction: 'down' },
    enemies: enemyPositions,
    items: items,
    maze: maze,
    time: 0,
    fuel: MAX_FUEL,
    maxFuel: MAX_FUEL,
  };
}

const SIREN_PROXIMITY_THRESHOLD = 2;
type SirenAudio = {
    gainNode: GainNode;
    osc1: OscillatorNode;
    osc2: OscillatorNode;
    lfo: OscillatorNode;
    isPlaying: boolean;
};

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [levels] = useState<Level[]>(INITIAL_LEVELS);
  const [isBusted, setIsBusted] = useState(false);
  const [isBustedAnimating, setIsBustedAnimating] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const hasInteractedRef = useRef(false);
  const [lastCollected, setLastCollected] = useState<CollectibleType | null>(null);
  const sirenAudioNode = useRef<SirenAudio | null>(null);
  const isResettingRef = useRef(false);

  const initAudio = () => {
    if (typeof window !== 'undefined' && !audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        return true;
      } catch (e) {
        console.error("Web Audio API is not supported in this browser");
        return false;
      }
    }
    return !!audioContextRef.current;
  }

  const playMoveSound = useCallback(() => {
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
  }, []);
  
  const playBustedSound = useCallback(() => {
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
  }, []);

  const playCollectSound = useCallback(() => {
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
  }, []);

   const playRefuelSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const audioCtx = audioContextRef.current;
    const gainNode = audioCtx.createGain();
    gainNode.connect(audioCtx.destination);
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.5);

    const oscillator = audioCtx.createOscillator();
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(100, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.5);
    oscillator.connect(gainNode);
    
    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.5);
  }, []);
  
  const stopAllSirens = useCallback(() => {
    const siren = sirenAudioNode.current;
    if (siren && siren.isPlaying && audioContextRef.current) {
        siren.gainNode.gain.cancelScheduledValues(audioContextRef.current!.currentTime);
        siren.gainNode.gain.setValueAtTime(siren.gainNode.gain.value, audioContextRef.current!.currentTime)
        siren.gainNode.gain.linearRampToValueAtTime(0, audioContextRef.current!.currentTime + 0.1);
        setTimeout(() => {
            siren.osc1.stop();
            siren.osc2.stop();
            siren.lfo.stop();
        }, 100);
        sirenAudioNode.current = null;
    }
  }, []);

  const resetGame = useCallback(() => {
    if (isResettingRef.current) return;
    isResettingRef.current = true;

    setIsBusted(true);
    playBustedSound();
    stopAllSirens();
    
    setIsBustedAnimating(true);
    setTimeout(() => setIsBustedAnimating(false), 2100);

    setTimeout(() => {
      setGameState(prevState => {
        if (!prevState) return null;
        const newBustedCount = prevState.bustedCount + 1;
        const newLevelState = createInitialState();
        return {
          ...newLevelState,
          bustedCount: newBustedCount,
          score: prevState.score,
          raveBucks: prevState.raveBucks,
          time: prevState.time,
        };
      });
      setIsBusted(false);
      isResettingRef.current = false;
    }, 2000);
  }, [playBustedSound, stopAllSirens]);

  const movePlayer = useCallback((dx: number, dy: number, direction: PlayerDirection) => {
    if (isBusted) return;

    setGameState(prev => {
      if (!prev) return null;
      if (prev.fuel <= 0) return prev;
  
      const newPlayerPos = { x: prev.player.x + dx, y: prev.player.y + dy };
  
      if (
        newPlayerPos.y < 0 || newPlayerPos.y >= MAZE_HEIGHT ||
        newPlayerPos.x < 0 || newPlayerPos.x >= MAZE_WIDTH ||
        prev.maze[newPlayerPos.y]?.[newPlayerPos.x] === 1
      ) {
        return { ...prev, player: { ...prev.player, direction } };
      }

      playMoveSound();
      
      let newState = { ...prev, player: { ...newPlayerPos, direction }, fuel: prev.fuel - 1 };
      
      const itemIndex = newState.items.findIndex(item => item.x === newPlayerPos.x && item.y === newPlayerPos.y);
      if (itemIndex > -1) {
        const collectedItem = newState.items[itemIndex];
        let newItems = [...newState.items];
        
        let newCollectibles = { ...newState.collectibles };
        let newScore = newState.score;
        let newRaveBucks = newState.raveBucks;
        let newFuel = newState.fuel;

        setLastCollected(collectedItem.type);
        setTimeout(() => setLastCollected(null), 1500);
  
        if (collectedItem.type === 'flyer') {
          newItems.splice(itemIndex, 1);
          playCollectSound();
          newScore += 10;
          newCollectibles.flyers++;
        } else if (collectedItem.type === 'pills') {
          newItems.splice(itemIndex, 1);
          playCollectSound();
          newScore += 20;
          newCollectibles.pills++;
        } else if (collectedItem.type === 'vinyl') {
          newItems.splice(itemIndex, 1);
          playCollectSound();
          newScore += 50;
          newRaveBucks += 5;
          newCollectibles.vinyls++;
        } else if (collectedItem.type === 'fuel_station') {
            playRefuelSound();
            newFuel = newState.maxFuel;
        }
        
        newState = {
            ...newState,
            items: newItems,
            collectibles: newCollectibles,
            score: newScore,
            raveBucks: newRaveBucks,
            fuel: newFuel,
        };
      }
      return newState;
    });
  }, [isBusted, playMoveSound, playCollectSound, playRefuelSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();

      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        initAudio();
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
        if (!prev) return prev;

        const newState = { ...prev };
        const { player, maze } = newState;

        const newEnemies = newState.enemies.map(enemy => {
          const path = findPath(enemy, player, maze);
          if (path && path.length > 1) {
            return path[1];
          }
          return enemy; 
        });
        
        newState.enemies = newEnemies;

        return newState;
      });

    }, 400); 

    return () => clearInterval(gameLoop);
  }, [isBusted]);
  
  // Centralized collision detection hook
  useEffect(() => {
    if (!gameState || isBusted) return;

    const { player, enemies } = gameState;
    for (const enemy of enemies) {
      if (enemy.x === player.x && enemy.y === player.y) {
        resetGame();
        return; 
      }
    }
  }, [gameState, isBusted, resetGame]);

  useEffect(() => {
    if (isBusted || !gameState || !audioContextRef.current) {
        if (sirenAudioNode.current) {
            stopAllSirens();
        }
        return;
    }
    const { player, enemies } = gameState;
    const audioCtx = audioContextRef.current;

    const closestEnemy = enemies.reduce((closest, enemy) => {
        const distance = Math.abs(player.x - enemy.x) + Math.abs(player.y - enemy.y);
        if (distance < closest.distance) {
            return { enemy, distance };
        }
        return closest;
    }, { enemy: null as Position | null, distance: Infinity });

    const { distance } = closestEnemy;
    let siren = sirenAudioNode.current;

    if (distance <= SIREN_PROXIMITY_THRESHOLD) {
        if (!siren) {
            const gainNode = audioCtx.createGain();
            gainNode.gain.setValueAtTime(0, audioCtx.currentTime);

            const osc1 = audioCtx.createOscillator();
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(780, audioCtx.currentTime);
            osc1.connect(gainNode);

            const osc2 = audioCtx.createOscillator();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(660, audioCtx.currentTime);
            osc2.connect(gainNode);

            const lfo = audioCtx.createOscillator();
            lfo.type = 'square';
            lfo.frequency.setValueAtTime(2, audioCtx.currentTime);

            const lfoGain = audioCtx.createGain();
            lfoGain.gain.setValueAtTime(60, audioCtx.currentTime);

            lfo.connect(lfoGain);
            lfoGain.connect(osc1.frequency);
            lfoGain.connect(osc2.frequency);

            gainNode.connect(audioCtx.destination);

            osc1.start();
            osc2.start();
            lfo.start();

            siren = { gainNode, osc1, osc2, lfo, isPlaying: true };
            sirenAudioNode.current = siren;
        }
        siren.gainNode.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.3);
    } else if (siren) {
        siren.gainNode.gain.linearRampToValueAtTime(0, audioCtx.currentTime + 0.3);
        setTimeout(() => {
            if (sirenAudioNode.current) {
                sirenAudioNode.current.osc1.stop();
                sirenAudioNode.current.osc2.stop();
                sirenAudioNode.current.lfo.stop();
                sirenAudioNode.current = null;
            }
        }, 300);
    }
  }, [gameState, isBusted, stopAllSirens]);


  useEffect(() => {
    if (isBusted) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev) return null;
        return { ...prev, time: prev.time + 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBusted]);

  useEffect(() => {
    setGameState(createInitialState());
  }, []);

  useEffect(() => {
    return () => {
      stopAllSirens();
      if(audioContextRef.current && audioContextRef.current.state !== 'closed') {
          audioContextRef.current.close();
      }
    }
  }, [stopAllSirens]);

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
        <GameUI gameState={gameState} levels={levels} lastCollected={lastCollected} isBustedAnimating={isBustedAnimating} />
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-black/50">
          <GameBoard gameState={gameState} />
        </div>
        {isBusted && (
            <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="p-8 rounded-lg animate-flash">
                    <h1 className="text-9xl font-extrabold text-destructive tracking-widest font-headline animate-glow-red">
                        BUSTED
                    </h1>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
