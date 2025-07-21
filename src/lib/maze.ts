import type { Position } from './types';

export const MAZE_WIDTH = 25;
export const MAZE_HEIGHT = 17;

/**
 * Generates a random maze using a recursive backtracking algorithm.
 * 1 represents a wall, 0 represents a path.
 * @param width The width of the maze.
 * @param height The height of the maze.
 * @returns A 2D array representing the maze.
 */
export function generateMaze(width: number, height: number): number[][] {
  const maze: number[][] = Array.from({ length: height }, () => Array(width).fill(1));

  function carve(x: number, y: number) {
    // N, E, S, W
    const directions = [
      { x: 0, y: -2, wallY: -1, wallX: 0 },
      { x: 2, y: 0, wallY: 0, wallX: 1 },
      { x: 0, y: 2, wallY: 1, wallX: 0 },
      { x: -2, y: 0, wallY: 0, wallX: -1 },
    ];
    // Randomize directions
    directions.sort(() => Math.random() - 0.5);

    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      // Check if the new cell is within bounds and is a wall
      if (newY > 0 && newY < height - 1 && newX > 0 && newX < width - 1 && maze[newY][newX] === 1) {
        // Carve path to the new cell
        maze[y + dir.wallY][x + dir.wallX] = 0;
        maze[newY][newX] = 0;
        carve(newX, newY);
      }
    }
  }

  // Start carving from a random odd-numbered cell
  const startX = 1;
  const startY = 1;
  maze[startY][startX] = 0;
  carve(startX, startY);

  return maze;
}

/**
 * Finds all random empty spots (paths) in the maze.
 * @param maze The maze to search in.
 * @returns An array of positions.
 */
export function findEmptySpots(maze: number[][]): Position[] {
    const emptySpots: Position[] = [];
    for(let y = 0; y < maze.length; y++) {
        for(let x = 0; x < maze[0].length; x++) {
            if(maze[y][x] === 0) {
                emptySpots.push({ x, y });
            }
        }
    }

    // shuffle the array
    for (let i = emptySpots.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [emptySpots[i], emptySpots[j]] = [emptySpots[j], emptySpots[i]];
    }
    
    return emptySpots;
}

/**
 * Finds all wall spots (buildings) in the maze.
 * @param maze The maze to search in.
 * @returns An array of positions.
 */
export function findWallSpots(maze: number[][]): Position[] {
    const wallSpots: Position[] = [];
    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[0].length; x++) {
            if (maze[y][x] === 1) {
                wallSpots.push({ x, y });
            }
        }
    }
    return wallSpots;
}
