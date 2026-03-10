import http from "http";
import { WebSocketServer, type RawData } from "ws";

type SocketRequestMessageType = 'joinRoom'
type SocketResponseMessageType = 'joinedRoom' | 'playerConnected'

interface SocketRequestMessageBase {
  type: SocketRequestMessageType;
  payload: unknown
}

type SocketRequestMessage = 
  { type: 'joinRoom', payload: { roomId: number } }

type SocketResponseMessage = 
  { type: 'joinedRoom', payload: { room: { id: number } } } |
  { type: 'playerConnected', payload: { player: unknown } }

export default function initializeSocket(server: http.Server) {
  const wss = new WebSocketServer({
    path: '/game',
    server
  });

  const buildRequest = (data: RawData): SocketRequestMessage => {
    return JSON.parse(data.toString())
  }

  const buildResponse = (message: SocketResponseMessage) => {
    return JSON.stringify(message)
  }

  let roomId;

  wss.on("connection", function(ws) {
    console.log("New client connected");

    ws.on("message", function (data) {
      const request = buildRequest(data)

      if (request.type === 'joinRoom') {
        roomId = request.payload.roomId

        ws.emit(buildResponse({
          type: 'joinedRoom',
          payload: {
            room: {
              id: roomId
            }
          }
        }))
      }

      console.log("Received:", request);
    });

    ws.on("close", function() {
      console.log("Client disconnected");
    });
  });
}
