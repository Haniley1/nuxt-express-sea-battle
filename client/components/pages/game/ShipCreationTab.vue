<template>
<div class="ship-creation-tab">
  <div class="ship-creation-tab__inner">
    <template
      v-for="type in ['BATTLESHIP', 'CRUISERS', 'DESTROYER', 'SUBMARINE'] as const"
      :key="type"
    >
      <div 
        class="ship-creation-tab__item" 
        :data-ships-remaining="shipsRemaining[type]"
      >
        <DraggableShip
          :ship="new Ship({ type, rotated: false, x: 0, y: 0 })" 
          :cell-size="32"
          drag-type="NewShip"
        />
        <span 
          class="ship-creation-tab__item-count" 
          v-text="shipsRemaining[type]"
        />
      </div>
    </template>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import DraggableShip from '~/components/ship/DraggableShip.vue';
import { Ship, type ShipType, Ships } from '~/model/Ship';

const { ships } = defineProps<{
  ships: Ship[]
}>()

const getShipCountByType = (type: ShipType) => ships.reduce((count, ship) => {
  if (ship.type === type) {
    count++
  }

  return count
}, 0)

const getShipsRemainingByType = (type: ShipType, max: number) => {
  const shipsCount = getShipCountByType(type)
  return max - shipsCount
}

const shipsRemaining = computed<{ [key in ShipType]: number }>(() => ({
  BATTLESHIP: getShipsRemainingByType('BATTLESHIP', 1),
  CRUISERS: getShipsRemainingByType('CRUISERS', 2),
  DESTROYER: getShipsRemainingByType('DESTROYER', 3),
  SUBMARINE: getShipsRemainingByType('SUBMARINE', 4),
}))

</script>

<style scoped lang="scss">
.ship-creation-tab {
  position: fixed;
  inset: auto 0 24px 0;
  max-width: 80%;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  border: 2px dashed black;

  &__inner {
    display: flex;
    justify-content: space-between;
    padding: 12px;
  }
}
</style>