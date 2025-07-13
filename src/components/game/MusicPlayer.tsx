
"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause, SkipBack, SkipForward, Volume1, Volume2, VolumeX } from "lucide-react";
import type { Level } from "@/lib/types";

export default function MusicPlayer({
  level,
  isPlaying,
  volume,
  onPlayPause,
  onVolumeChange,
}: {
  level?: Level;
  isPlaying: boolean;
  volume: number;
  onPlayPause: () => void;
  onVolumeChange: (value: number[]) => void;
}) {
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  return (
    <aside className="w-80 bg-card/30 border-l border-border/50 p-6 flex-col gap-6 hidden lg:flex">
      <div className="space-y-4 text-center flex-1 flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-accent font-headline tracking-widest flex items-center justify-center gap-2">
            <Music className="w-5 h-5" />
            NOW PLAYING
        </h2>
        
        <div className="aspect-square w-full rounded-lg overflow-hidden border-2 border-primary/50 shadow-[0_0_15px_hsl(var(--primary)/0.5)] mt-4">
          <Image
            src="https://placehold.co/400x400.png"
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
            
            <Separator />
            
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
    </aside>
  );
}

    