<template>
  <div class="ship-creation-tab">
    <div class="ship-creation-tab__container">
      <div class="ship-creation-tab__inner">
        <template
          v-for="type in ['BATTLESHIP', 'CRUISERS', 'DESTROYER', 'SUBMARINE'] as const"
          :key="type"
        >
          <div
            :class="{
              'ship-creation-tab__item': true,
              disabled: shipsRemaining[type] <= 0,
            }"
          >
            <DraggableShip
              :ship="new Ship({ type, rotated: false, x: 0, y: 0 })"
              :can-drag="shipsRemaining[type] > 0"
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
    <Button
      text="Сбросить сетку"
      @click="$emit('reset')"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue';
import DraggableShip from '~/components/ship/DraggableShip.vue';
import Button from '~/components/ui/Button.vue';
import { Ship, type ShipType } from '~/model/Ship';

const { ships } = defineProps<{
  ships: Ship[];
}>();
const emit = defineEmits<{
  progress: [boolean];
  reset: [void];
}>();

const getShipCountByType = (type: ShipType) =>
  ships.reduce((count, ship) => {
    if (ship.type === type) {
      count++;
    }

    return count;
  }, 0);

const getShipsRemainingByType = (type: ShipType, max: number) => {
  const shipsCount = getShipCountByType(type);
  return max - shipsCount;
};

const shipsRemaining = computed<{ [key in ShipType]: number }>(() => ({
  BATTLESHIP: getShipsRemainingByType('BATTLESHIP', 1),
  CRUISERS: getShipsRemainingByType('CRUISERS', 2),
  DESTROYER: getShipsRemainingByType('DESTROYER', 3),
  SUBMARINE: getShipsRemainingByType('SUBMARINE', 4),
}));

watch(shipsRemaining, (remaining) => {
  const isFullset = Object.values(shipsRemaining.value).every((count) => count === 0);

  emit('progress', isFullset);
});
</script>

<style scoped lang="scss">
.ship-creation-tab {
  position: fixed;
  inset: 50% auto 0 16px;
  height: fit-content;
  transform: translateY(-50%);

  &__container {
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 4px;
    border: 2px dashed black;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 24px;
    padding: 12px;
  }

  &__item {
    text-align: center;

    &.disabled {
      opacity: 0.5;
    }

    &-count {
      display: block;
      margin-top: 8px;
      font-size: 18px;
      font-weight: 600;
      color: black;
    }
  }
}
</style>
