export enum Ships {
  SUBMARINE = 1,
  DESTROYER = 2,
  CRUISERS = 3,
  BATTLESHIP = 4
}

export interface ShipCoordinates {
  x: [number, number],
  y: [number, number]
}

type ShipProps = Pick<Ship, 'type' | 'rotated' | 'x' | 'y'>

export class Ship {
  public x: number;
  public y: number;
  public size: number;
  public type: keyof typeof Ships;
  public rotated: boolean;
  public coordinates!: ShipCoordinates;

  constructor(props: ShipProps) {
    this.rotated = props.rotated || false;
    this.type = props.type
    this.size = Ships[this.type]
    this.x = props.x
    this.y = props.y
    this.setCoordinates(props.x, props.y)
  }

  public setCoordinates(x: number, y: number) {
    this.coordinates = this.defineShipCells(x, y)
    this.x = x
    this.y = y
  }

  public rotate() {
    this.rotated = !this.rotated
  }

  private defineShipCells = (x: number, y: number): ShipCoordinates => {
    const xEnd = !this.rotated ? x + this.size - 1 : x;
    const yEnd = this.rotated ? y + this.size - 1 : y;
  
    return { x: [x, xEnd], y: [y, yEnd] };
  }
}
