<template>
  <div class="game-page">
    <div class="game-page__container">
      <GameGrid 
        v-if="socketConnected"
        :ships="ships"
        @ship-add="addNewShip"
      />
      <Button
        v-if="showContinueButton" 
        text="Продолжить" 
      />
    </div>
    <ShipCreationTab 
      :ships="ships"
      @reset="ships.length = 0"
      @progress="(isFullset) => showContinueButton = isFullset"
    />
  </div>
</template>

<script setup lang="ts">
import io from 'socket.io-client'
import { ref } from 'vue';
import { Ship } from '~/model/Ship';
import GameGrid from '~/components/pages/game/GameGrid.vue';
import ShipCreationTab from '~/components/pages/game/ShipCreationTab.vue';
import Button from '~/components/ui/Button.vue';

const showContinueButton = ref(false)
const ships = ref<Ship[]>([
  new Ship({ x: 1, y: 1, type: "BATTLESHIP", rotated: false, hits: [2, 3] }),
]);

const addNewShip = (ship: Ship) => {
  ships.value.push(ship)
}






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

<style lang="scss" scoped>
</style>
