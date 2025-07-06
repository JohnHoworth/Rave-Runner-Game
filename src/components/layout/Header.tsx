import { Disc3 } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/50 shrink-0 bg-card/50 z-10">
      <div className="flex items-center gap-3">
        <Disc3 className="text-primary h-8 w-8 animate-spin-slow" />
        <h1 className="text-2xl font-bold tracking-tighter text-primary font-headline">
          RaveRunner<span className="text-accent">: The Acid Maze</span>
        </h1>
      </div>
    </header>
  );
}
