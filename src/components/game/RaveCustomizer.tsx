"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { customizeRaveLevels, CustomizeRaveLevelsInput, CustomizeRaveLevelsOutput } from "@/ai/flows/customize-rave-levels";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "../ui/scroll-area";

type Inputs = {
  playerStyle: string;
};

const baseLevels = [
    "Your Love - Frankie Knuckles",
    "Strings of Life - Rhythim is Rhythim",
    "Pacific State - 808 State",
    "Can You Feel It? - Mr. Fingers",
    "Energy Flash - Joey Beltram",
    "Acid Tracks - Phuture",
    "Music Sounds Better With You - Stardust",
];


export default function RaveCustomizer({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<CustomizeRaveLevelsOutput | null>(null);
  const { toast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    setResult(null);

    const input: CustomizeRaveLevelsInput = {
      playerStyle: data.playerStyle,
      baseLevels: baseLevels,
    };

    try {
      const response = await customizeRaveLevels(input);
      setResult(response);
    } catch (error) {
      console.error("Error customizing rave levels:", error);
      toast({
        title: "Error",
        description: "Failed to customize rave levels. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-2xl w-full flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-accent text-2xl font-headline">AI Rave Customizer</SheetTitle>
          <SheetDescription>
            Describe your rave style, and our AI DJ will craft a unique set of levels just for you.
          </SheetDescription>
        </SheetHeader>
        <div className="py-6 flex-1 flex flex-col gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="playerStyle" className="text-primary">Your Rave Style</Label>
              <Textarea
                id="playerStyle"
                placeholder="e.g., 'I love deep, atmospheric techno, minimalist neon visuals, and challenging, fast-paced gameplay.'"
                {...register("playerStyle", { required: "Please describe your style." })}
                className="min-h-[100px] bg-background"
              />
              {errors.playerStyle && <p className="text-sm text-destructive">{errors.playerStyle.message}</p>}
            </div>
            <Button type="submit" disabled={isLoading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate My Rave
            </Button>
          </form>

          {result && (
            <div className="mt-6 space-y-4 flex-1 flex flex-col min-h-0">
              <h3 className="text-xl font-bold text-primary font-headline">Your Custom Rave Lineup:</h3>
              <ScrollArea className="flex-1 pr-6 -mr-6">
                <div className="space-y-4">
                  {result.customizedLevels.map((level, index) => (
                    <Card key={index} className="bg-card/80 border-primary/20">
                      <CardHeader>
                        <CardTitle className="text-accent">{level.levelName}</CardTitle>
                        <p className="text-sm text-muted-foreground">{level.description}</p>
                      </CardHeader>
                      <CardContent className="space-y-2 text-sm">
                        <div><strong className="text-primary">Music:</strong> {level.music}</div>
                        <div><strong className="text-primary">Visuals:</strong> {level.visuals}</div>
                        <div><strong className="text-primary">Gameplay:</strong> {level.gameplay}</div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
