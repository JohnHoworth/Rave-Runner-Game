
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
  levels,
  currentTrack,
  onSelectTrack,
  onPlayerReady,
}: {
  levels: Level[];
  currentTrack: Level;
  onSelectTrack: (level: Level) => void;
  onPlayerReady: (player: YouTubePlayer) => void;
}) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(50);
  const localPlayerRef = useRef<YouTubePlayer | null>(null);
  const videoId = getYouTubeVideoId(currentTrack.youtubeUrl);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;
  
  useEffect(() => {
    if (localPlayerRef.current && videoId) {
        localPlayerRef.current.loadVideoById(videoId);
    }
  }, [videoId]);

  useEffect(() => {
    if (localPlayerRef.current) {
        localPlayerRef.current.setVolume(volume);
    }
  }, [volume]);
  
  const handlePlayPause = () => {
    if (!localPlayerRef.current) return;
    setIsPlaying(prev => {
        const shouldPlay = !prev;
        if(shouldPlay) {
            localPlayerRef.current?.playVideo();
        } else {
            localPlayerRef.current?.pauseVideo();
        }
        return shouldPlay;
    });
  }

  const handlePlayerReady = (event: { target: YouTubePlayer }) => {
    localPlayerRef.current = event.target;
    onPlayerReady(event.target);
    event.target.setVolume(volume);
    event.target.playVideo();
  };
  
  const onPlayerStateChange = (event: { data: number }) => {
     if (event.data === YouTube.PlayerState.PLAYING) {
        if (!isPlaying) setIsPlaying(true);
    } else if (event.data === YouTube.PlayerState.PAUSED || event.data === YouTube.PlayerState.ENDED) {
        if (isPlaying) setIsPlaying(false);
    }
  }

  const opts = {
    height: '0',
    width: '0',
    playerVars: {
      autoplay: 1,
      controls: 0,
    },
  };

  return (
    <aside className="w-80 bg-card/30 border-l border-border/50 p-6 flex flex-col gap-6 hidden lg:flex border-2 rounded-lg animate-glow-orange-border">
      {typeof window !== 'undefined' && <YouTube videoId={videoId || undefined} opts={opts} onReady={handlePlayerReady} onStateChange={onPlayerStateChange} className="hidden" />}
      
      {/* Now Playing Section */}
      <div className="shrink-0">
        <h2 className="text-lg font-semibold text-accent font-headline tracking-widest flex items-center justify-center gap-2 mb-4">
            <Music className="w-5 h-5" />
            NOW PLAYING
        </h2>
        
        <div className="flex gap-4 items-center">
            <div className="w-24 h-24 shrink-0 rounded-md overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.5)]">
              <Image
                src={videoId ? `https://img.youtube.com/vi/${videoId}/0.jpg` : "https://placehold.co/400x400.png"}
                width={100}
                height={100}
                alt={currentTrack?.name || "Album Art"}
                className="w-full h-full object-cover"
                data-ai-hint="techno album cover"
              />
            </div>
            <div className="min-w-0">
                <h3 className="text-lg font-bold text-primary truncate">{currentTrack?.name || 'Track Name'}</h3>
                <p className="text-sm text-muted-foreground truncate">{currentTrack?.artist || 'Artist Name'}</p>
            </div>
        </div>

        <div className="pt-4 space-y-4">
            <div className="flex justify-center items-center gap-4">
                <Button variant="ghost" size="icon" className="text-primary/70 hover:text-primary">
                    <SkipBack className="w-6 h-6"/>
                </Button>
                <Button 
                    onClick={handlePlayPause}
                    variant="outline" 
                    size="icon" 
                    className="w-16 h-16 rounded-full border-4 border-primary bg-primary/10 text-primary hover:bg-primary/20"
                >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                </Button>
                <Button variant="ghost" size="icon" className="text-primary/70 hover:text-primary">
                    <SkipForward className="w-6 h-6"/>
                </Button>
            </div>
            
            <div className="flex items-center gap-3 px-2">
                <VolumeIcon className="w-5 h-5 text-primary/70" />
                <Slider
                    value={[volume]}
                    onValueChange={(v) => setVolume(v[0])}
                    max={100}
                    step={1}
                />
            </div>
        </div>
      </div>
      
      <Separator />

      {/* Levels Section */}
      <ScrollArea className="flex-1 -mx-6">
        <div className="px-6 flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-accent font-headline tracking-widest text-center">LEVELS</h2>
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
      </ScrollArea>
    </aside>
  );
}

    