<template>
  <div class="initial-ships">
    <div class="initial-ships__item">
      <CopyShip :can-create="battleShipRemaining > 0" :cell-size="48" ship-type="BATTLESHIP" />
      <span class="initial-ships__counter">{{ battleShipRemaining }}</span>
    </div>
    <div class="initial-ships__item">
      <CopyShip :can-create="cruisersRemaining > 0" :cell-size="48" ship-type="CRUISERS" />
      <span class="initial-ships__counter">{{ cruisersRemaining }}</span>
    </div>
    <div class="initial-ships__item">
      <CopyShip :can-create="destroyersRemaining > 0" :cell-size="48" ship-type="DESTROYER" />
      <span class="initial-ships__counter">{{ destroyersRemaining }}</span>
    </div>
    <div class="initial-ships__item">
      <CopyShip :can-create="submarinesRemaining > 0" :cell-size="48" ship-type="SUBMARINE" />
      <span class="initial-ships__counter">{{ submarinesRemaining }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { Ship, ShipType } from "~/model/Ship";
import CopyShip from "./CopyShip.vue";

const { ships } = defineProps<{
  ships: Ship[];
}>();

const battleShipRemaining = computed(() => getShipsRemaining('BATTLESHIP', 1))
const cruisersRemaining = computed(() => getShipsRemaining('CRUISERS', 2))
const destroyersRemaining = computed(() => getShipsRemaining('DESTROYER', 3))
const submarinesRemaining = computed(() => getShipsRemaining('SUBMARINE', 4))

const getShipsRemaining = (type: ShipType, startCount: number) => {
  return ships.reduce((remaining, ship) => {
    if (ship.type === type) {
      remaining--
    }

    return remaining
  }, startCount)
}
</script>

<style lang="scss" scoped>
.initial-ships {
  display: flex;
  justify-content: center;
  gap: 4px;
}

.initial-ships__item {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: center;
}

.initial-ships__counter {
  font-size: 1.5rem;
  font-weight: 600;
}
</style>
