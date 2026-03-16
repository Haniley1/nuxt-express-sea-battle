import http from "http";
import { WebSocketServer, type WebSocket, type RawData } from "ws";
import {
  type Coordinate,
  type GamePhase,
  type PlayerId,
  type Room,
  type RoomId,
  rooms,
} from "./rooms";

type SocketRequestMessageType = "joinRoom" | "placeShips" | "fire";

type SocketResponseMessageType =
  | "joinedRoom"
  | "gameUpdate"
  | "shotResult"
  | "playerConnected"
  | "error";

interface SocketRequestMessageBase<TType extends SocketRequestMessageType, TPayload> {
  type: TType;
  payload: TPayload;
}

// === REQUESTS ===
interface JoinRoomPayload {
  roomId: RoomId;
}
interface PlaceShipsPayload {
  roomId: RoomId;
  ships: Coordinate[];
}
interface FirePayload {
  roomId: RoomId;
  x: number;
  y: number;
}
type JoinRoomRequest = SocketRequestMessageBase<"joinRoom", JoinRoomPayload>;
type PlaceShipsRequest = SocketRequestMessageBase<"placeShips", PlaceShipsPayload>;
type FireRequest = SocketRequestMessageBase<"fire", FirePayload>;

interface SocketResponseMessageBase<TType extends SocketResponseMessageType, TPayload> {
  type: TType;
  payload: TPayload;
}

type SocketRequestMessage =
  | JoinRoomRequest
  | PlaceShipsRequest
  | FireRequest;
// === REQUESTS ===

// === RESPONSES ===
type JoinRoomResponse = SocketResponseMessageBase<"joinedRoom", { room: Room }>;
type GameUpdateResponse = SocketResponseMessageBase<"gameUpdate", { room: Room }>;
type ShotResultResponse = SocketResponseMessageBase<"shotResult", {
  roomId: RoomId;
  x: number;
  y: number;
  result: "hit" | "miss" | "sunk" | "win";
  yourTurn: boolean;
}>;
type PlayerConnectedResponse = SocketResponseMessageBase<"playerConnected", { playerId: PlayerId; roomId?: RoomId }>;
type ErrorResponse = SocketResponseMessageBase<"error", { message: string }>;

type SocketResponseMessage =
  | JoinRoomResponse
  | GameUpdateResponse
  | ShotResultResponse
  | PlayerConnectedResponse
  | ErrorResponse;
// === RESPONSES ===

interface PlayerState {
  id: PlayerId;
  socket: WebSocket;
  roomId?: RoomId;
}

const serializeCoord = (x: number, y: number) => `${x},${y}`;

const deserializeCoord = (key: string): Coordinate => {
  const [x, y] = key.split(",").map(Number);
  return { x, y };
};

const createClientRoomState = (room: Room, currentPlayer?: PlayerState): Room => ({
  ...room,
  players: room.players.map((p) => ({
    ...p,
    isYou: currentPlayer ? p.id === currentPlayer.id : undefined,
  })),
});

const generateId = () => Math.random().toString(36).slice(2, 10);

export default function initializeSocket(server: http.Server) {
  const wss = new WebSocketServer({
    path: "/game",
    server,
  });

  const playersBySocket = new Map<WebSocket, PlayerState>();

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

  const broadcastRoom = (room: Room) => {
    playersBySocket.forEach((player) => {
      if (player.roomId !== room.id) return;
      sendToPlayer(player, {
        type: "gameUpdate",
        payload: { room: createClientRoomState(room, player) },
      });
    });
  };

  const handleJoinRoom = (player: PlayerState, payload: JoinRoomRequest["payload"]) => {
    const room = rooms.get(payload.roomId);
    if (!room) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Комната не найдена" },
      });
      return;
    }

    if (room.players.length >= 2) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Комната уже заполнена" },
      });
      return;
    }

    room.players.push({
      id: player.id,
      ready: false,
      ships: [],
      hits: [],
      misses: [],
    });
    player.roomId = room.id;
    room.phase = "placingShips";

    room.players.forEach((roomPlayer) => {
      const targetPlayer = [...playersBySocket.values()].find((p) => p.id === roomPlayer.id);
      if (!targetPlayer) return;
      sendToPlayer(targetPlayer, {
        type: "joinedRoom",
        payload: { room: createClientRoomState(room, targetPlayer) },
      });
    });
  };

  const handlePlaceShips = (player: PlayerState, payload: PlaceShipsRequest["payload"]) => {
    const room = rooms.get(payload.roomId);
    if (!room || player.roomId !== room.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Неверная комната" },
      });
      return;
    }

    if (room.phase !== "placingShips" && room.phase !== "waitingForPlayers") {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Нельзя расставить корабли на этой стадии игры" },
      });
      return;
    }

    const roomPlayer = room.players.find((p) => p.id === player.id);
    if (!roomPlayer) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Игрок не найден в комнате" },
      });
      return;
    }

    roomPlayer.ships = payload.ships.map(({ x, y }) => ({ x, y }));
    roomPlayer.ready = true;

    // Если оба игрока готовы -- начинаем игру
    if (room.players.length === 2 && room.players.every((p) => p.ready)) {
      room.phase = "inProgress";
      // Случайно выбираем кто ходит первым
      const starter = room.players[Math.floor(Math.random() * room.players.length)];
      room.currentTurnPlayerId = starter.id;
    }

    broadcastRoom(room);
  };

  const handleFire = (player: PlayerState, payload: FireRequest["payload"]) => {
    const room = rooms.get(payload.roomId);
    if (!room || player.roomId !== room.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Неверная комната" },
      });
      return;
    }

    if (room.phase !== "inProgress") {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Игра ещё не началась или уже закончилась" },
      });
      return;
    }

    if (room.currentTurnPlayerId !== player.id) {
      sendToPlayer(player, {
        type: "error",
        payload: { message: "Сейчас ход соперника" },
      });
      return;
    }

    const currentPlayer = room.players.find((p) => p.id === player.id);
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

    const opponent = room.players.find((p) => p.id !== player.id);
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
        room.phase = "finished";
      }
    } else {
      currentPlayer.misses.push({ x: payload.x, y: payload.y });
      result = "miss";
    }

    // Меняем ход, если промах или игра не закончилась
    if (room.phase === "inProgress" && result === "miss") {
      room.currentTurnPlayerId = opponent.id;
    }

    const yourTurn = room.currentTurnPlayerId === player.id && room.phase === "inProgress";

    // Ответ стреляющему
    sendToPlayer(player, {
      type: "shotResult",
      payload: {
        roomId: room.id,
        x: payload.x,
        y: payload.y,
        result,
        yourTurn,
      },
    });

    // Обновление комнаты всем
    broadcastRoom(room);
  };

  wss.on("connection", (ws) => {
    console.log("New client connected");

    const player: PlayerState = {
      id: generateId(),
      socket: ws,
      roomId: undefined,
    };

    playersBySocket.set(ws, player);

    // Сообщим клиенту его id
    sendToPlayer(player, {
      type: "playerConnected",
      payload: { playerId: player.id, roomId: undefined },
    });

    ws.on("message", (data) => {
      let request: SocketRequestMessage;
      try {
        request = buildRequest(data);
      } catch (err) {
        console.error("Failed to parse message", err);
        sendToPlayer(player, {
          type: "error",
          payload: { message: "Неверный формат сообщения" },
        });
        return;
      }

      console.log("Received:", request);

      switch (request.type) {
        case "joinRoom":
          handleJoinRoom(player, request.payload);
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
            payload: { message: "Неизвестный тип сообщения" },
          });
      }
    });

    ws.on("close", () => {
      console.log("Client disconnected");
      const p = playersBySocket.get(ws);
      if (!p) return;

      if (p.roomId != null) {
        const room = rooms.get(p.roomId);
        if (room) {
          room.players = room.players.filter((pl) => pl.id !== p.id);

          if (room.players.length === 0) {
            rooms.delete(room.id);
          } else {
            if (room.phase === "inProgress") {
              room.phase = "finished";
            }
            broadcastRoom(room);
          }
        }
      }

      playersBySocket.delete(ws);
    });
  });
}
