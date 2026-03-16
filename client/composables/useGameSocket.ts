import { useWebSocket, type UseWebSocketOptions, type UseWebSocketReturn } from '@vueuse/core';
import type { Player } from '@shared/model/Player';
import { onBeforeUnmount, ref } from 'vue';
import type { BaseWebSocketMessage } from '~/model/api';

export default function useGameSocket(lobbyId: string) {
  const isConnected = ref(false);
  const isError = ref(false);
  const player = ref<Player | null>(null);
  const secondPlayer = ref<Player | null>(null);

  let wsSender: WebSocketSender;

  const onMessage: UseWebSocketOptions['onMessage'] = (ws, evt) => {
    const data = JSON.parse(evt.data) as BaseWebSocketMessage;
    switch (data.type) {
      case 'error':
        isError.value = true;
        break;
      case 'gameUpdate':
        player.value = data.payload.player;
        secondPlayer.value = data.payload.enemy;
        break;
      case 'joinedLobby':
        console.log(data.payload);
        player.value = data.payload.player;
        secondPlayer.value = data.payload.enemy;
        break;
      case 'playerDisconnected':
        secondPlayer.value = null;
        break;
      default:
        console.info(`WEBSOCKET: Unhandled message type: ${data.type}`);
    }
  };

  const socket = useWebSocket('ws://localhost:4000/game/ws', {
    onConnected(ws) {
      isConnected.value = true;
      wsSender = new WebSocketSender(ws);

      wsSender.send('joinLobby', { lobbyId });
    },
    onDisconnected(ws, event) {
      isConnected.value = false;
    },
    onMessage,
  });

  onBeforeUnmount(() => {
    socket.close();
  });

  return {
    socket,
    player,
    secondPlayer,
    isError,
  };
}

class WebSocketSender {
  private ws: WebSocket;

  constructor(ws: WebSocket) {
    this.ws = ws;
  }

  public send(type: string, payload: unknown) {
    const message = JSON.stringify({ type, payload });
    this.ws.send(message);
  }
}
