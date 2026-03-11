import http from "http";
import { WebSocketServer, type RawData } from "ws";
import { authenticateWsToken } from '../middleware/auth';

type SocketRequestMessage = 
  { type: 'joinRoom', payload: { roomId: number } } |
  { type: 'readyToPlay', payload: {  } }

type SocketResponseMessage = 
  { type: 'joinedRoom', payload: { room: { id: number } } } |
  { type: 'playerConnected', payload: { player: unknown } } |
  { type: 'playerReadyToPlay', payload: { player: unknown } }

export default function initializeSocket(server: http.Server) {
  const wss = new WebSocketServer({
    path: '/game/ws',
    noServer: true,
    verifyClient: authenticateWsToken
  });

  const buildRequest = (data: RawData): SocketRequestMessage => {
    return JSON.parse(data.toString())
  }

  const buildResponse = (message: SocketResponseMessage) => {
    return JSON.stringify(message)
  }

  wss.on("connection", function(ws) {
    let roomId;
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
