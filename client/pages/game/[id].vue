<template>
  <div class="game-page">
    <div class="game-page__container">
      <GameGrid
        :ships="ships"
        @ship-add="addNewShip"
      />
      <Button
        v-if="showContinueButton" 
        text="Продолжить" 
      />

    </div>
    <PlayersTab :second-player="secondPlayer" />
    <ShipCreationTab 
      :ships="ships"
      @reset="ships.length = 0"
      @progress="(isFullset) => allShipsPlaced = isFullset"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, provide, ref } from 'vue';
import { Ship } from '~/model/Ship';
import GameGrid from '~/components/pages/game/GameGrid.vue';
import ShipCreationTab from '~/components/pages/game/ShipCreationTab.vue';
import Button from '~/components/ui/Button.vue';
import PlayersTab from '~/components/pages/game/PlayersTab.vue';
import useGameSocket from '~/composables/useGameSocket';

provide('cellSize', 48);

const { socket, secondPlayer, secondPlayerConnected } = useGameSocket()

const allShipsPlaced = ref(false)
const ships = ref<Ship[]>([
  new Ship({ x: 1, y: 1, type: "BATTLESHIP", rotated: false, hits: [2, 3] }),
]);

const showContinueButton = computed(() => allShipsPlaced.value && secondPlayerConnected.value)

const addNewShip = (ship: Ship) => {
  ships.value.push(ship)
}
</script>

<style lang="scss" scoped>
</style>
