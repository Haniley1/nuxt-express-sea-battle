import { useWebSocket } from '@vueuse/core';
import type { Player } from './../../shared/model/Player';
import { io, type Socket } from "socket.io-client";
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

export default function useGameSocket() {
  const isConnected = ref(false)
  const secondPlayer = ref<Player | null>(null);
  const secondPlayerConnected = ref(false);

  const socket = useWebSocket('ws://localhost:4000/game', {
    onConnected(ws) {
      isConnected.value = true
      ws.send(JSON.stringify({ type: 'joinRoom', payload: { roomId: 'random-room-id' } }))
    },
    onDisconnected(ws, event) {
      isConnected.value = false;
    },
    onMessage: (ws, evt) => {
      console.log(evt)
    }
  });

  onBeforeUnmount(() => {
    socket.close()
  })

  return {
    socket,
    secondPlayer: secondPlayer,
    secondPlayerConnected
  }
}