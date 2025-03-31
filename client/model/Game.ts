export interface Ship {
  x: number;
  y: number;
  type: ShipType;
  rotated: boolean
}

export enum Ships {
  BATTLESHIP = 4,
  CRUISERS = 3,
  DESTROYER = 2,
  SUBMARINE = 1
}

export type ShipType = keyof typeof Ships