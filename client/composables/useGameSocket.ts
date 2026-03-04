import type { Player } from './../../shared/model/Player';
import { io, type Socket } from "socket.io-client";
import { onBeforeUnmount, onMounted, ref, type Ref } from "vue";

export default function useGameSocket() {
  const socket = ref<Socket | null>(null);
  const secondPlayer = ref<Player | null>(null);
  const secondPlayerConnected = ref(false);

  onMounted(() => {
    socket.value = io('http://localhost:4000/game', {
      transports: ['websocket', 'polling']
    })

    socket.value.on('playerConnected', (player: Player) => {
      console.log('%cSecond player connected!', 'color: darkgreen', player)
      secondPlayer.value = player;
      secondPlayerConnected.value = true
    })

    socket.value.on('playerDisconnected', (player) => {
      console.log('%cSecond player disconnected!', 'color: yellow', player)
      secondPlayer.value = null;
      secondPlayerConnected.value = false
    })
  })

  onBeforeUnmount(() => {
    socket.value?.disconnect()
  })

  return {
    socket,
    secondPlayer: secondPlayer,
    secondPlayerConnected
  }
}