import type { LobbyID, GamePhase, LobbyPlayer, PlayerId } from "../../server/models/Lobby";

export interface Lobby {
  id: LobbyID;
  name: string
  phase: GamePhase;
  playersState: LobbyPlayer[];
  currentTurnPlayerId?: PlayerId;
}