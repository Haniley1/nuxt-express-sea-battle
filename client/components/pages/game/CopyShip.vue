<template>
  <div
    :ref="drag"
    class="ship"
    :class="[`ship_${shipType.toLowerCase()}`, !canCreate && 'ship_disabled']"
    :style="{ '--size': `${cellSize}px` }"
  />
</template>

<script setup lang="ts">
import { useDrag } from "vue3-dnd";
import type { ShipType } from "~/model/Ship";

const props = defineProps<{
  cellSize: number;
  shipType: ShipType;
  canCreate: boolean
}>();

const [collect, drag] = useDrag(() => ({
  type: "CopyShip",
  item: { type: props.shipType },
  options: {
    dropEffect: "copy",
  },
  canDrag: () => props.canCreate
}));
</script>

<style lang="scss" scoped>
$cellSize: var(--size, 32px);

.ship {
  cursor: grab;
  border-radius: 16px;

  &.ship_rotated {
    width: $cellSize;
  }

  &.ship_disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  &:not(.ship-rotated) {
    height: $cellSize;
  }

  &.ship_submarine {
    background-color: #28a745;

    &:not(.ship_rotated) {
      width: calc($cellSize);
    }

    &.ship_rotated {
      height: calc($cellSize * 1);
    }
  }

  &.ship_destroyer {
    background-color: #ffc107;

    &:not(.ship_rotated) {
      width: calc($cellSize * 2);
    }

    &.ship_rotated {
      height: calc($cellSize * 2);
    }
  }

  &.ship_cruisers {
    background-color: #dc3545;

    &:not(.ship_rotated) {
      width: calc($cellSize * 3);
    }

    &.ship_rotated {
      height: calc($cellSize * 3);
    }
  }

  &.ship_battleship {
    background-color: #6f42c1;

    &:not(.ship_rotated) {
      width: calc($cellSize * 4);
    }

    &.ship_rotated {
      height: calc($cellSize * 4);
    }
  }
}
</style>
