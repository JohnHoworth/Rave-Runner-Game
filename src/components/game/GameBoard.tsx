"use client";

import PlayerIcon from "@/components/icons/PlayerIcon";
import GhostIcon from "@/components/icons/GhostIcon";
import { GameState, Item } from "@/lib/types";
import { DiscAlbum, FileText, Sparkles } from "lucide-react";
import { MAZE_HEIGHT, MAZE_WIDTH } from "@/lib/maze";

const TILE_SIZE = 2; // in rem

const ItemIcon = ({ type }: { type: Item['type'] }) => {
    switch (type) {
        case 'flyer':
            return <FileText className="w-full h-full text-primary/80 animate-pulse" />;
        case 'glowstick':
            return <Sparkles className="w-full h-full text-accent animate-pulse" />;
        case 'vinyl':
            return <DiscAlbum className="w-full h-full text-primary animate-pulse" />;
        default:
            return null;
    }
}

export default function GameBoard({ gameState }: { gameState: GameState }) {
  const { maze, player, enemies, items } = gameState;

  return (
    <div
      className="bg-black/50 border-4 border-primary shadow-[0_0_20px_theme(colors.primary)] rounded-lg p-2 scanlines"
      data-ai-hint="maze arcade"
    >
      <div
        className="grid relative"
        style={{
          gridTemplateColumns: `repeat(${MAZE_WIDTH}, 1fr)`,
          gridTemplateRows: `repeat(${MAZE_HEIGHT}, 1fr)`,
          width: `${MAZE_WIDTH * TILE_SIZE}rem`,
          height: `${MAZE_HEIGHT * TILE_SIZE}rem`,
        }}
      >
        {maze.map((row, y) =>
          row.map((cell, x) =>
            cell === 1 ? (
              <div
                key={`${x}-${y}`}
                className="bg-primary/70 w-full h-full rounded-sm"
                style={{ gridColumn: x + 1, gridRow: y + 1 }}
              />
            ) : null
          )
        )}
        
        {items.map((item, i) => (
             <div key={`item-${i}`} className="p-1" style={{ gridColumn: item.x + 1, gridRow: item.y + 1 }}>
                <ItemIcon type={item.type} />
            </div>
        ))}

        {enemies.map((enemy, i) => (
            <div key={`enemy-${i}`} className="p-0.5" style={{ gridColumn: enemy.x + 1, gridRow: enemy.y + 1, transition: 'all 0.2s linear' }}>
                <GhostIcon className="w-full h-full text-destructive drop-shadow-[0_0_5px_theme(colors.destructive)]" />
            </div>
        ))}
        
        <div className="p-0.5" style={{ gridColumn: player.x + 1, gridRow: player.y + 1, transition: 'all 0.1s linear' }}>
            <PlayerIcon className="w-full h-full text-accent drop-shadow-[0_0_5px_theme(colors.accent)]" />
        </div>
      </div>
    </div>
  );
}
