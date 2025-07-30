import type { Position } from './types';
import { MAZE_WIDTH, MAZE_HEIGHT } from './maze';

/**
 * Finds the shortest path between two points on the maze using Breadth-First Search.
 * @param start The starting position.
 * @param end The ending position.
 * @param maze The maze grid.
 * @param flashingBuildings An optional array of positions that are considered walkable even if they are walls.
 * @returns An array of positions representing the path, or null if no path is found.
 */
export function findPath(
  start: Position,
  end: Position,
  maze: number[][],
  flashingBuildings: Position[] = []
): Position[] | null {
  const queue: { pos: Position; path: Position[] }[] = [{ pos: start, path: [start] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  const isFlashingBuilding = (pos: Position) => {
    return flashingBuildings.some(b => b.x === pos.x && b.y === pos.y);
  };

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;

    // Check if we've reached the end
    if (pos.x === end.x && pos.y === end.y) {
      return path;
    }

    // Explore neighbors
    const neighbors = [
      { x: pos.x, y: pos.y - 1 }, // Up
      { x: pos.x, y: pos.y + 1 }, // Down
      { x: pos.x - 1, y: pos.y }, // Left
      { x: pos.x + 1, y: pos.y }, // Right
    ];

    for (const neighbor of neighbors) {
      const key = `${neighbor.x},${neighbor.y}`;
      const isWalkable = maze[neighbor.y]?.[neighbor.x] === 0 || isFlashingBuilding(neighbor);

      // Check if the neighbor is valid, within bounds, is a path, and not visited
      if (
        neighbor.x >= 0 &&
        neighbor.x < MAZE_WIDTH &&
        neighbor.y >= 0 &&
        neighbor.y < MAZE_HEIGHT &&
        isWalkable &&
        !visited.has(key)
      ) {
        visited.add(key);
        const newPath = [...path, neighbor];
        queue.push({ pos: neighbor, path: newPath });
      }
    }
  }

  return null; // No path found
}

    