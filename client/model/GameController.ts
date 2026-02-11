import type { Ship } from "./Ship";

export class GameController {
  public ships: Ship[] = []
  public gridSize = 10

  constructor({ gridSize }: { gridSize?: number } = {}) {
    if (gridSize) {
      this.gridSize = gridSize
    }
  }

  public rotateShip() {

  }
}
