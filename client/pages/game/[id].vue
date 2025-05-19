<script setup lang="ts">
import GameGrid from '~/components/pages/game/GameGrid.vue';
import io from 'socket.io-client'
import { ref } from 'vue';

const socket = io('http://localhost:4000/game')
const socketConnected = ref(false)
const secondPlayerConnected = ref(false)

socket.on('greetings', () => {
  console.log('Socket connected!')
  socketConnected.value = true
})

socket.on('playerConnected', () => {
  console.log('Second player connected!')
  secondPlayerConnected.value = true
})
</script>

<template>
  <div class="game-page">
    <GameGrid v-if="socketConnected" />
    <GameGrid v-if="secondPlayerConnected" />
  </div>
</template>

<style lang="scss" scoped></style>
