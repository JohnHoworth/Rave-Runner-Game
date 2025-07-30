
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Disc3, DiscAlbum, FileText, Gamepad2, Pill } from "lucide-react";
import PlayerIcon from "../icons/PlayerIcon";
import PoliceSirenIcon from "../icons/PoliceSirenIcon";

export default function StartScreen({ onStart }: { onStart: () => void }) {
    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-black text-primary font-body overflow-hidden p-8">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500/50 to-transparent animate-spotlight-scan" style={{ animationDelay: '0s' }} />
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-red-500/50 to-transparent animate-spotlight-scan" style={{ animationDelay: '1.5s' }}/>
            </div>
            <div className="absolute inset-0 bg-grid-pattern opacity-10 animate-scanline" />
            <div className="absolute top-0 left-0 w-full h-1/2 animate-chase-lights" />

            <div className="relative z-10 text-center flex flex-col items-center gap-8 w-full max-w-4xl">
                <header className="flex items-center gap-4">
                    <Disc3 className="text-primary h-16 w-16 animate-spin-slow" />
                    <h1 className="text-6xl md:text-8xl font-bold tracking-tighter font-headline animate-emergency-title">
                        RaveRunner: The Acid Maze
                    </h1>
                </header>

                <div className="flex flex-col md:flex-row gap-8 items-stretch">
                    {/* Story */}
                    <Card className="bg-black/60 border-accent/50 w-full md:w-1/2 text-left backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-accent font-headline tracking-widest">THE MISSION</CardTitle>
                        </CardHeader>
                        <CardContent className="text-muted-foreground space-y-4">
                            <p>It's the dead of night. The pulse of a secret, underground rave calls to you. But the authorities are closing in.</p>
                            <p>Your goal is simple: navigate the neon-drenched maze of the city, collect rave flyers, and find the source of the music before the night is over. Avoid the relentless police patrols who want to shut down the party. Good luck, raver.</p>
                        </CardContent>
                    </Card>

                    {/* How to Play */}
                    <Card className="bg-black/60 border-primary/50 w-full md:w-1/2 text-left backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle className="text-primary font-headline tracking-widest flex items-center gap-2">
                                <Gamepad2 className="w-6 h-6" />
                                HOW TO PLAY
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                             <ul className="text-sm text-muted-foreground list-disc list-inside space-y-3">
                                <li>Use <kbd>Arrow Keys</kbd> to move your <PlayerIcon className="inline-block w-5 h-5 -translate-y-1" />.</li>
                                <li>Collect <FileText className="inline-block w-4 h-4 text-green-400" /> to find rave spots. Stand on glowing buildings to earn Rave XP, but watch your fuel!</li>
                                <li>Gather <Pill className="inline-block w-4 h-4 text-red-500" /> & <DiscAlbum className="inline-block w-4 h-4 text-yellow-300" /> for extra points and cash.</li>
                                <li>Press <kbd>SPACE</kbd> to drop an Evasion Pill to distract the police.</li>
                                <li>Avoid the police <PoliceSirenIcon className="inline-block w-5 h-5 -translate-y-1" /> at all costs!</li>
                                <li>Refuel at Fuel Stations to keep moving. Your fuel depletes as you move or gain XP.</li>
                            </ul>
                        </CardContent>
                    </Card>
                </div>

                <Button 
                    onClick={onStart} 
                    size="lg" 
                    className="mt-8 text-4xl px-12 py-8 bg-primary text-primary-foreground hover:bg-primary/90 animate-flicker font-headline tracking-widest transition-all duration-200 hover:scale-105 active:scale-100 hover:border-accent active:border-accent-foreground border-4 border-transparent"
                >
                    BEGIN
                </Button>
            </div>
        </div>
    );
}
