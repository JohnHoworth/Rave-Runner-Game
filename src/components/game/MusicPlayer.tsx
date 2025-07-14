
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import type { Level } from "@/lib/types";
import YouTube from 'react-youtube';
import { useState, useEffect, useRef } from "react";
import type { YouTubePlayer } from "react-youtube";
import { cn } from "@/lib/utils";
import { ScrollArea } from "../ui/scroll-area";

const getYouTubeVideoId = (url: string): string | null => {
    if (!url) return null;
    try {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    } catch (e) {
      console.error("Invalid YouTube URL:", url);
      return null;
    }
}

export default function MusicPlayer({
  level,
  levels,
  currentTrack,
  onSelectTrack,
  isPlaying,
  volume,
  onPlayPause,
  onVolumeChange,
}: {
  level?: Level;
  levels: Level[];
  currentTrack: Level;
  onSelectTrack: (level: Level) => void;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number[]) => void;
}) {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  const [videoId, setVideoId] = useState<string | null>(null);
  const playerRef = useRef<YouTubePlayer | null>(null);

  useEffect(() => {
      setVideoId(level ? getYouTubeVideoId(level.youtubeUrl) : null);
  }, [level]);

  useEffect(() => {
    if (playerRef.current && videoId) {
        if (isPlaying) {
            playerRef.current.loadVideoById(videoId);
            playerRef.current.playVideo();
        }
    }
  }, [videoId, isPlaying]);

  useEffect(() => {
    if (playerRef.current) {
        playerRef.current.setVolume(volume);
    }
  }, [volume]);
  
  useEffect(() => {
    if (!playerRef.current) return;
    if (isPlaying) {
        playerRef.current.playVideo();
    } else {
        playerRef.current.pauseVideo();
    }
  }, [isPlaying]);

  const onPlayerReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target;
    event.target.setVolume(volume);
    if (isPlaying && videoId) {
      event.target.loadVideoById(videoId);
      event.target.playVideo();
    }
  };
  
  const onPlayerStateChange = (event: { target: YouTubePlayer, data: number }) => {
    if (event.data === YouTube.PlayerState.PLAYING && !isPlaying) {
        onPlayPause(); // Sync state if video plays externally
    } else if (event.data === YouTube.PlayerState.PAUSED && isPlaying) {
        onPlayPause(); // Sync state if video pauses externally
    }
  }

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 0,
      controls: 0,
    },
  };

  return (
    <aside className="w-80 bg-card/30 border-l border-border/50 p-6 flex flex-col gap-6 hidden lg:flex">
      {typeof window !== 'undefined' && <YouTube videoId={videoId || undefined} opts={opts} onReady={onPlayerReady} onStateChange={onPlayerStateChange} className="hidden" />}
      <div className="space-y-4 text-center">
        <h2 className="text-lg font-semibold text-accent font-headline tracking-widest flex items-center justify-center gap-2">
            <Music className="w-5 h-5" />
            NOW PLAYING
        </h2>
        
        <div className="aspect-square w-full rounded-lg overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.5)] mt-4">
          <Image
            src={videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "https://placehold.co/400x400.png"}
            width={400}
            height={400}
            alt={level?.name || "Album Art"}
            className="w-full h-full object-cover"
            data-ai-hint="techno album cover"
          />
        </div>
        
        <div className="mt-4">
            <h3 className="text-2xl font-bold text-primary truncate">{level?.name || 'Track Name'}</h3>
            <p className="text-md text-muted-foreground">{level?.artist || 'Artist Name'}</p>
        </div>

        <div className="pt-4 space-y-6">
            <div className="flex justify-center items-center gap-6">
                <Button variant="ghost" size="icon" className="text-primary/70 hover:text-primary">
                    <SkipBack className="w-8 h-8"/>
                </Button>
                <Button 
                    onClick={onPlayPause}
                    variant="outline" 
                    size="icon" 
                    className="w-20 h-20 rounded-full border-4 border-primary bg-primary/10 text-primary hover:bg-primary/20"
                >
                    {isPlaying ? <Pause className="w-10 h-10" /> : <Play className="w-10 h-10" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-primary/70 hover:text-primary">
                    <SkipForward className="w-8 h-8"/>
                </Button>
            </div>
            
            <div className="flex items-center gap-4 px-4">
                <VolumeIcon className="w-6 h-6 text-primary/70" />
                <Slider
                    value={[volume]}
                    onValueChange={onVolumeChange}
                    max={100}
                    step={1}
                />
            </div>
        </div>
      </div>
      
      <Separator />

      <ScrollArea className="flex-1 -mx-6">
        <div className="px-6 flex flex-col gap-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-accent font-headline tracking-widest">LEVELS</h2>
            <ul className="space-y-2">
              {levels.map((level, index) => (
                <li 
                  key={index} 
                  onClick={() => onSelectTrack(level)}
                  className={cn(
                    'p-3 rounded-md transition-all duration-150 ease-in-out border-2 cursor-pointer hover:scale-95 active:scale-110',
                    currentTrack.name === level.name 
                      ? 'bg-green-500/20 border-green-500 animate-glow-green-border' 
                      : 'border-primary/20 hover:border-red-500 hover:animate-glow-red-border'
                  )}
                >
                  <p className="font-bold text-primary">{`LVL ${index + 1}: ${level.name}`}</p>
                  <p className="text-sm text-muted-foreground">{level.artist}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
