import http from "http";
import { WebSocketServer, type WebSocket, type RawData } from "ws";
import { GamePhase, type LobbyID, lobbies, type PlayerId } from "../models/Lobby";
import type { Lobby } from "../../shared/model/Lobby";
import { parseCookie } from "cookie";
import type {
  FireRequest,
  JoinLobbyPayloadOut,
  JoinLobbyRequest,
  PlaceShipsRequest,
  SocketRequestMessage,
  SocketResponseMessage,
} from "./messages";

export interface PlayerState {
  id: PlayerId;
  nickname: string
  socket: WebSocket;
  lobbyId?: LobbyID;
}

const createClientLobbyState = (
  lobby: Lobby,
  currentPlayer?: PlayerState,
): JoinLobbyPayloadOut => {
  const currentPlayerId = currentPlayer?.id;
  const player = lobby.playersState.find((p) => p.id === currentPlayerId);
  const enemyPlayer = lobby.playersState.find((p) => p.id !== currentPlayerId);

  return {
    player: {
      ...player!,
    },
    enemy: enemyPlayer ? { id: enemyPlayer.id, nickname: enemyPlayer.nickname } : undefined,
    lobbyId: lobby.id,
    phase: lobby.phase,
  };
};

const generateId = () => Math.random().toString(36).slice(2, 10);

export default function initializeSocket(server: http.Server) {
  const playersBySocket = new Map<WebSocket, PlayerState>();
  const wss = new WebSocketServer({
    path: "/game/ws",
    server,
  });

  const buildRequest = (data: RawData): SocketRequestMessage => {
    return JSON.parse(data.toString());
  };

  const buildResponse = (message: SocketResponseMessage) => {
    return JSON.stringify(message);
  };

  const sendToPlayer = (player: PlayerState, message: SocketResponseMessage) => {
    try {
      player.socket.send(buildResponse(message));
    } catch (err) {
      console.error("Failed to send to player", player.id, err);
    }
  };

  const sendToLobby = (lobby: Lobby) => {
    playersBySocket.forEach((player) => {
      if (player.lobbyId !== lobby.id) return;
      sendToPlayer(player, {
        type: "gameUpdate",
        payload: createClientLobbyState(lobby, player),
      });
    });
  };

  const handleJoinLobby = (player: PlayerState, payload: JoinLobbyRequest["payload"]) => {
    const lobby = lobbies.get(payload.lobbyId);
    if (!lobby) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Lobby not found" },
      });
      return;
    }

    if (lobby.playersState.length >= 2) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Lobby is full" },
      });
      return;
    }

    lobby.playersState.push({
      id: player.id,
      nickname: player.nickname,
      ready: false,
      ships: [],
      hits: [],
      misses: [],
    });
    player.lobbyId = lobby.id;
    lobby.phase = GamePhase.PlacingShips;

    lobby.playersState.forEach((lobbyPlayer) => {
      const targetPlayer = [...playersBySocket.values()].find((p) => p.id === lobbyPlayer.id);
      if (!targetPlayer) return;
      sendToPlayer(targetPlayer, {
        type: "joinedLobby",
        payload: createClientLobbyState(lobby, targetPlayer),
      });
    });
  };

  const handlePlaceShips = (player: PlayerState, payload: PlaceShipsRequest["payload"]) => {
    const lobby = lobbies.get(payload.lobbyId);
    if (!lobby || player.lobbyId !== lobby.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Неверная комната" },
      });
      return;
    }

    if (lobby.phase !== GamePhase.PlacingShips && lobby.phase !== GamePhase.WaitingForPlayers) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Нельзя расставить корабли на этой стадии игры" },
      });
      return;
    }

    const lobbyPlayer = lobby.playersState.find((p) => p.id === player.id);
    if (!lobbyPlayer) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Игрок не найден в комнате" },
      });
      return;
    }

    lobbyPlayer.ships = payload.ships.map(({ x, y }) => ({ x, y }));
    lobbyPlayer.ready = true;

    // Если оба игрока готовы -- начинаем игру
    if (lobby.playersState.length === 2 && lobby.playersState.every((p) => p.ready)) {
      lobby.phase = GamePhase.InProgress;
      // Случайно выбираем кто ходит первым
      const starter = lobby.playersState[Math.floor(Math.random() * lobby.playersState.length)];
      lobby.currentTurnPlayerId = starter.id;
    }

    sendToLobby(lobby);
  };

  const handlePlayerLeftLobby = (player: PlayerState) => {
    if (player.lobbyId == null) {
      return;
    }

    const lobby = lobbies.get(player.lobbyId);
    if (!lobby) {
      return;
    }

    lobby.playersState = lobby.playersState.filter((pl) => pl.id !== player.id);

    if (lobby.playersState.length === 0) {
      lobbies.delete(lobby.id);
      return;
    }

    const remainingPlayerState = lobby.playersState[0];
    const remainingSocketPlayer = [...playersBySocket.values()].find(
      (pl) => pl.id === remainingPlayerState.id,
    );

    if (remainingSocketPlayer) {
      sendToPlayer(remainingSocketPlayer, {
        type: "playerDisconnected",
        payload: { lobbyId: lobby.id, enemyId: player.id },
      });
    }

    if (lobby.phase === GamePhase.InProgress) {
      lobby.phase = GamePhase.Finished;
    }

    sendToLobby(lobby);
  };

  const handleFire = (player: PlayerState, payload: FireRequest["payload"]) => {
    const lobby = lobbies.get(payload.lobbyId);
    if (!lobby || player.lobbyId !== lobby.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Неверная комната" },
      });
      return;
    }

    if (lobby.phase !== GamePhase.InProgress) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Игра ещё не началась или уже закончилась" },
      });
      return;
    }

    if (lobby.currentTurnPlayerId !== player.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Сейчас ход соперника" },
      });
      return;
    }

    const currentPlayer = lobby.playersState.find((p) => p.id === player.id);
    if (!currentPlayer) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Игрок не найден в комнате" },
      });
      return;
    }

    const alreadyShot = currentPlayer.hits.concat(currentPlayer.misses).some(
      (c) => c.x === payload.x && c.y === payload.y,
    );

    if (alreadyShot) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Вы уже стреляли в эту клетку" },
      });
      return;
    }

    let result: "hit" | "miss" | "sunk" | "win" = "miss";

    const opponent = lobby.playersState.find((p) => p.id !== player.id);
    if (!opponent) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Нет соперника" },
      });
      return;
    }

    const isHit = opponent.ships.some((c) => c.x === payload.x && c.y === payload.y);

    if (isHit) {
      currentPlayer.hits.push({ x: payload.x, y: payload.y });
      opponent.hits.push({ x: payload.x, y: payload.y });
      result = "hit";

      const remainingShipCells = opponent.ships.filter(
        (cell) => !opponent.hits.some((hit) => hit.x === cell.x && hit.y === cell.y),
      );

      if (remainingShipCells.length === 0) {
        result = "win";
        lobby.phase = GamePhase.Finished;
      }
    } else {
      currentPlayer.misses.push({ x: payload.x, y: payload.y });
      result = "miss";
    }

    // Меняем ход, если промах или игра не закончилась
    if (lobby.phase === GamePhase.InProgress && result === "miss") {
      lobby.currentTurnPlayerId = opponent.id;
    }

    const yourTurn = lobby.currentTurnPlayerId === player.id && lobby.phase === GamePhase.InProgress;

    // Ответ стреляющему
    sendToPlayer(player, {
      type: "shotResult",
      payload: {
        lobbyId: lobby.id,
        x: payload.x,
        y: payload.y,
        result,
        yourTurn,
      },
    });

    // Обновление комнаты всем
    sendToLobby(lobby);
  };

  wss.on("connection", (ws, request) => {
    const cookie = parseCookie(request.headers.cookie || '')
    const nickname = cookie.nickname || 'Unknown Player'
    console.log("New client connected");

    const player: PlayerState = {
      id: generateId(),
      nickname,
      socket: ws,
      lobbyId: undefined,
    };

    playersBySocket.set(ws, player);

    // Сообщим клиенту его id
    sendToPlayer(player, {
      type: "playerConnected",
      payload: { playerId: player.id, lobbyId: undefined },
    });

    ws.on("message", (data) => {
      let request: SocketRequestMessage;
      try {
        request = buildRequest(data);
      } catch (err) {
        console.error("Failed to parse message", err);
        sendToPlayer(player, {
          type: "error",
          payload: { message: "Incorrect message format" },
        });
        return;
      }

      console.log("Received:", request);

      switch (request.type) {
        case "joinLobby":
          handleJoinLobby(player, request.payload);
          break;
        case "placeShips":
          handlePlaceShips(player, request.payload);
          break;
        case "fire":
          handleFire(player, request.payload);
          break;
        default:
          sendToPlayer(player, {
            type: "error",
            payload: { message: "Unknown message type" },
          });
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      const player = playersBySocket.get(ws);
      if (!player) return;

      handlePlayerLeftLobby(player);
      playersBySocket.delete(ws);
    });
  });
}
