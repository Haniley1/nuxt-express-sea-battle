import { randomUUID } from "crypto";

export type RoomId = string;
export type PlayerId = string;

export type Coordinate = { x: number; y: number };

export type GamePhase =
  | "waitingForPlayers"
  | "placingShips"
  | "inProgress"
  | "finished";

export interface RoomPlayer {
  id: PlayerId;
  ready: boolean;
  ships: Coordinate[];
  hits: Coordinate[];
  misses: Coordinate[];
  /**
   * Пометка для клиента, какой игрок является текущим.
   * На сервере это поле не обязательно использовать.
   */
  isYou?: boolean;
}

export interface Room {
  id: RoomId;
  name: string
  phase: GamePhase;
  players: RoomPlayer[];
  currentTurnPlayerId?: PlayerId;
}

export const rooms = new Map<RoomId, Room>();

export const createRoom = (name: string = 'Новая комната'): Room => {
  const room: Room = {
    id: randomUUID(),
    name,
    phase: "waitingForPlayers",
    players: [],
  };

  rooms.set(room.id, room);

  return room;
};

export const getRoom = (id: RoomId): Room | undefined => rooms.get(id);

