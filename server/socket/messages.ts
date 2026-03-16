import type { RawData } from "ws";
import type { Lobby } from "../../shared/model/Lobby";
import type { Coordinate, GamePhase, LobbyID, PlayerId } from "../models/Lobby";

// === REQUESTS ===
export type SocketRequestMessageType = "joinLobby" | "placeShips" | "fire";

export interface SocketRequestMessageBase<
  TType extends SocketRequestMessageType,
  TPayload,
> {
  type: TType;
  payload: TPayload;
}

export interface JoinLobbyPayload {
  lobbyId: LobbyID;
}

export interface PlaceShipsPayload {
  lobbyId: LobbyID;
  ships: Coordinate[];
}

export interface FirePayload {
  lobbyId: LobbyID;
  x: number;
  y: number;
}

export type JoinLobbyRequest = SocketRequestMessageBase<"joinLobby", JoinLobbyPayload>;
export type PlaceShipsRequest = SocketRequestMessageBase<"placeShips", PlaceShipsPayload>;
export type FireRequest = SocketRequestMessageBase<"fire", FirePayload>;

export type SocketRequestMessage = JoinLobbyRequest | PlaceShipsRequest | FireRequest;
// === REQUESTS ===

// === RESPONSES ===
export type SocketResponseMessageType =
  | "joinedLobby"
  | "gameUpdate"
  | "shotResult"
  | "playerConnected"
  | "playerDisconnected"
  | "error";

export interface SocketResponseMessageBase<
  TType extends SocketResponseMessageType,
  TPayload,
> {
  type: TType;
  payload: TPayload;
}

export type JoinLobbyPayloadOut = {
  player: Lobby["playersState"][number];
  enemy?: { id: PlayerId; nickname: string };
  lobbyId: LobbyID;
  phase: GamePhase;
};
export type GameUpdatePayloadOut = JoinLobbyPayloadOut;

export type JoinLobbyResponse = SocketResponseMessageBase<"joinedLobby", JoinLobbyPayloadOut>;
export type GameUpdateResponse = SocketResponseMessageBase<
  "gameUpdate",
  GameUpdatePayloadOut
>;
export type ShotResultResponse = SocketResponseMessageBase<"shotResult", {
  lobbyId: LobbyID;
  x: number;
  y: number;
  result: "hit" | "miss" | "sunk" | "win";
  yourTurn: boolean;
}>;
export type PlayerConnectedResponse = SocketResponseMessageBase<
  "playerConnected",
  { playerId: PlayerId; lobbyId?: LobbyID }
>;
export type PlayerDisconnectedResponse = SocketResponseMessageBase<
  "playerDisconnected",
  { lobbyId: LobbyID; enemyId: PlayerId }
>;
export type ErrorResponse = SocketResponseMessageBase<"error", { message: string }>;

export type SocketResponseMessage =
  | JoinLobbyResponse
  | GameUpdateResponse
  | ShotResultResponse
  | PlayerConnectedResponse
  | PlayerDisconnectedResponse
  | ErrorResponse;
// === RESPONSES ===

