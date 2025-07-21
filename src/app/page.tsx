
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import GameBoard from '@/components/game/GameBoard';
import GameUI from '@/components/game/GameUI';
import MusicPlayer from "@/components/game/MusicPlayer";
import Header from '@/components/layout/Header';
import type { GameState, Level, Item, CollectibleType, Position, PlayerDirection, HighScore } from "@/lib/types";
import { generateMaze, MAZE_WIDTH, MAZE_HEIGHT, findEmptySpots } from "@/lib/maze";
import { Loader2 } from "lucide-react";
import { findPath } from "@/lib/pathfinding";
import type { YouTubePlayer } from "react-youtube";
import GameOverScreen from "@/components/game/GameOverScreen";

const INITIAL_LEVELS: Level[] = [
    { name: "Your Love", artist: "Frankie Knuckles", theme: "Chicago Warehouse", youtubeUrl: "https://www.youtube.com/watch?v=OG4NHr77hfU" },
    { name: "Strings of Life", artist: "Rhythim is Rhythim", theme: "Detroit Underground", youtubeUrl: "https://www.youtube.com/watch?v=JIK9UjS3800" },
    { name: "Pacific State", artist: "808 State", theme: "UK Open Field Rave", youtubeUrl: "https://www.youtube.com/watch?v=GIyNtdQW9t0" },
    { name: "Can You Feel It?", artist: "Mr. Fingers", theme: "European Warehouse", youtubeUrl: "https://www.youtube.com/watch?v=DPjth5oEM3M" },
    { name: "Energy Flash", artist: "Joey Beltram", theme: "Bass-Heavy Techno Bunker", youtubeUrl: "https://www.youtube.com/watch?v=nQbOMdoqsL4" },
    { name: "Acid Tracks", artist: "Phuture", theme: "Chicago Acid House", youtubeUrl: "https://www.youtube.com/watch?v=5pEuZaCknvs" },
    { name: "Music Sounds Better With You", artist: "Stardust", theme: "French House Rooftop", youtubeUrl: "https://www.youtube.com/watch?v=HVD1XXBGdDU" },
];

const MAX_FUEL = 100;
const PILL_EFFECT_DURATION = 10;
const HIGH_SCORE_KEY = 'raveRunnerHighScores';

const createInitialState = (): GameState => {
  const maze = generateMaze(MAZE_WIDTH, MAZE_HEIGHT);
  const emptySpots = findEmptySpots(maze); 

  const playerPos = emptySpots.pop();
  if (!playerPos) throw new Error("Could not find an empty spot for the player.");

  const enemyPositions = [emptySpots.pop(), emptySpots.pop(), emptySpots.pop()]
    .filter((p): p is Position => !!p);
  
  const items: Item[] = [];
  const itemTypes: CollectibleType[] = [
    ...Array(5).fill('flyer'),
    ...Array(5).fill('pills'),
    ...Array(3).fill('tunes'),
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
    collectibles: { flyers: 0, pills: 0, tunes: 0 },
    level: 1,
    player: { ...playerPos, direction: 'down' },
    enemies: enemyPositions,
    items: items,
    maze: maze,
    time: 0,
    fuel: MAX_FUEL,
    maxFuel: MAX_FUEL,
    pillEffectActive: false,
    pillEffectTimer: 0,
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
  const [currentTrack, setCurrentTrack] = useState<Level>(INITIAL_LEVELS[0]);
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);


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

    gainNode.gain.setValueAtTime(0.02, audioContextRef.current.currentTime);
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

  const playDropPillSound = useCallback(() => {
    if (!audioContextRef.current) return;
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContextRef.current.currentTime + 0.3);
    
    oscillator.frequency.setValueAtTime(660, audioContextRef.current.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(220, audioContextRef.current.currentTime + 0.3);
    oscillator.type = 'sine';

    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + 0.3);
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
          collectibles: prevState.collectibles,
          time: 0,
        };
      });
      setIsBusted(false);
      isResettingRef.current = false;
    }, 2000);
  }, [playBustedSound, stopAllSirens]);

  const restartGame = useCallback(() => {
    setGameState(createInitialState());
    setIsGameOver(false);
  }, []);

  const movePlayer = useCallback((dx: number, dy: number, direction: PlayerDirection) => {
    if (isBusted || isGameOver) return;

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
        } else if (collectedItem.type === 'tunes') {
          newItems.splice(itemIndex, 1);
          playCollectSound();
          newScore += 50;
          newRaveBucks += 5;
          newCollectibles.tunes++;
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
  }, [isBusted, isGameOver, playMoveSound, playCollectSound, playRefuelSound]);

  const dropPill = useCallback(() => {
    if (isBusted || isGameOver) return;
    setGameState(prev => {
      if (!prev || prev.collectibles.pills <= 0) {
        return prev;
      }
      
      playDropPillSound();
      
      const newItems = [...prev.items, { type: 'dropped_pill', x: prev.player.x, y: prev.player.y }];
      const newCollectibles = { ...prev.collectibles, pills: prev.collectibles.pills - 1 };

      return { 
        ...prev, 
        items: newItems, 
        collectibles: newCollectibles,
        pillEffectActive: true,
        pillEffectTimer: PILL_EFFECT_DURATION,
      };
    });
  }, [isBusted, isGameOver, playDropPillSound]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isGameOver) return;
      e.preventDefault();

      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        initAudio();
      }

      if (e.key === 'ArrowUp') movePlayer(0, -1, 'up');
      if (e.key === 'ArrowDown') movePlayer(0, 1, 'down');
      if (e.key === 'ArrowLeft') movePlayer(-1, 0, 'left');
      if (e.key === 'ArrowRight') movePlayer(1, 0, 'right');
      if (e.key === ' ' || e.key === 'Spacebar') dropPill();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [movePlayer, dropPill]);

  useEffect(() => {
    if (isBusted || isGameOver) return;

    const gameLoop = setInterval(() => {
      setGameState(prev => {
        if (!prev || prev.pillEffectActive) return prev;

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
  }, [isBusted, isGameOver]);
  
  // Centralized collision detection hook
  useEffect(() => {
    if (!gameState || isBusted || gameState.pillEffectActive || isGameOver) return;

    const { player, enemies } = gameState;
    for (const enemy of enemies) {
      if (enemy.x === player.x && enemy.y === player.y) {
        resetGame();
        return; 
      }
    }
  }, [gameState, isBusted, resetGame, isGameOver]);

  useEffect(() => {
    if (isBusted || isGameOver || !gameState || !audioContextRef.current) {
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
        siren.gainNode.gain.linearRampToValueAtTime(0.015, audioCtx.currentTime + 0.3);
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
  }, [gameState, isBusted, stopAllSirens, isGameOver]);


  useEffect(() => {
    if (isBusted || isGameOver || !playerRef.current) return;

    const timer = setInterval(() => {
      const player = playerRef.current;
      if (player && typeof player.getDuration === 'function' && typeof player.getCurrentTime === 'function') {
        const duration = player.getDuration();
        const currentTime = player.getCurrentTime();

        if (duration > 0) {
          setGameState(prev => {
            if (!prev) return null;
            const remainingTime = Math.max(0, Math.floor(duration - currentTime));
            
            if (remainingTime <= 0) {
              setIsGameOver(true);
            }

            if (prev.time !== remainingTime) {
              return { ...prev, time: remainingTime };
            }
            return prev;
          });
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isBusted, isGameOver, playerRef, playerRef.current]);

  useEffect(() => {
    if (!gameState?.pillEffectActive) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (!prev || !prev.pillEffectActive) return prev;

        const newTime = prev.pillEffectTimer - 1;
        if (newTime <= 0) {
          return {
            ...prev,
            pillEffectActive: false,
            pillEffectTimer: 0,
            items: prev.items.filter(item => item.type !== 'dropped_pill')
          };
        }
        return { ...prev, pillEffectTimer: newTime };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState?.pillEffectActive]);

  useEffect(() => {
    try {
        const savedScores = localStorage.getItem(HIGH_SCORE_KEY);
        if (savedScores) {
            setHighScores(JSON.parse(savedScores));
        }
    } catch (e) {
        console.error("Could not load high scores from localStorage", e);
    }
    setGameState(createInitialState());
  }, []);

  const handleAddHighScore = useCallback((name: string) => {
    if (!gameState) return;
    const newScore: HighScore = { name, score: gameState.score };
    const newHighScores = [...highScores, newScore]
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    try {
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify(newHighScores));
      setHighScores(newHighScores);
    } catch (e) {
      console.error("Could not save high scores to localStorage", e);
    }
  }, [gameState, highScores]);

  useEffect(() => {
    if (gameState?.level && levels[gameState.level - 1]) {
        setCurrentTrack(levels[gameState.level - 1]);
    }
  }, [gameState?.level, levels]);

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
  
  if (isGameOver) {
    return (
      <GameOverScreen
        score={gameState.score}
        highScores={highScores}
        onAddHighScore={handleAddHighScore}
        onRestart={restartGame}
      />
    );
  }


  return (
    <div className="flex flex-col h-screen bg-transparent font-body text-foreground overflow-hidden">
      <Header />
      <main className="flex flex-1 overflow-hidden relative">
        <GameUI 
            gameState={gameState} 
            lastCollected={lastCollected} 
            isBustedAnimating={isBustedAnimating}
        />
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <GameBoard gameState={gameState} />
        </div>
        <MusicPlayer
          levels={levels}
          currentTrack={currentTrack}
          onSelectTrack={setCurrentTrack}
          onPlayerReady={(player) => { playerRef.current = player; }}
        />
        {isBusted && (
            <div className="absolute inset-0 bg-black/70 flex items-end justify-center z-50 pb-20">
                <div className="p-8 rounded-lg border-4 animate-police-lights">
                    <h1 className="text-7xl font-extrabold tracking-widest font-headline animate-arrested">
                        ARRESTED!
                    </h1>
                </div>
            </div>
        )}
      </main>
    </div>
  );
}
