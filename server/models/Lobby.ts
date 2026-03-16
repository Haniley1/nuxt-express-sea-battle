import { Lobby } from './../../shared/model/Lobby';
import { randomUUID } from "crypto";

export type LobbyID = string;
export type PlayerId = string;

export type Coordinate = { x: number; y: number };

export enum GamePhase {
  WaitingForPlayers = "waitingForPlayers",
  PlacingShips = "placingShips",
  InProgress = "inProgress",
  Finished = "finished",
}

export interface LobbyPlayer {
  id: PlayerId;
  nickname: string;
  ready: boolean;
  ships: Coordinate[];
  hits: Coordinate[];
  misses: Coordinate[];
  isYou?: boolean;
}

export const lobbies = new Map<LobbyID, Lobby>();

export const createLobby = (name: string = 'Новая комната'): Lobby => {
  const room: Lobby = {
    id: randomUUID(),
    name,
    phase: GamePhase.WaitingForPlayers,
    playersState: [],
  };

  lobbies.set(room.id, room);

  return room;
};

export const getLobby = (id: LobbyID): Lobby | undefined => lobbies.get(id);

export const getLobbies = () => Array.from(lobbies.values())

