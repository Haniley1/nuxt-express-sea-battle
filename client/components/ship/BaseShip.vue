<template>
<div
  :ref="preview"
  :class="{ 'base-ship': true, 'ship_rotated': ship.rotated }"
  :style="shipStyles"
>
  <ShipSprite 
    :ship="ship"
    :dragging="dragging"
  >
    <slot />
    <div 
      v-for="hit in ship.hits" 
      :key="hit" 
      class="base-ship__hit" 
      :style="getHitStyles(hit)" 
    />
  </ShipSprite>
</div>
</template>
<script setup lang="ts">
import { computed, inject, type StyleValue } from "vue";
import { Ship } from "~/model/Ship";
import ShipSprite from "./ShipSprite.vue";
import { BASE_CELL_SIZE } from "~/static/data/constants";
import type { ConnectDragPreview, DragPreviewOptions } from "vue3-dnd";

const props = defineProps<{
  ship: Ship;
  dragging?: boolean;
  preview?: ConnectDragPreview<DragPreviewOptions>
}>();

const cellSize = inject<number>('cellSize')!;

const shipStyles = computed<StyleValue>(() => {
  const [left, top] = [props.ship.x * BASE_CELL_SIZE, props.ship.y * BASE_CELL_SIZE];

  return {
    "--cell-size": `${BASE_CELL_SIZE}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    opacity: props.dragging ? 0 : 1,
  };
});

const getHitStyles = (hit: number): StyleValue => {
  const propertyName = props.ship.rotated ? 'top' : 'left'
  const position = cellSize * (hit - 1)

  return {
    [propertyName]: `${position}px`
  }
}
</script>
<style scoped lang="scss">
$cellSize: var(--cell-size, 32px);

.base-ship {
  &.ship_rotated {
    width: $cellSize;
  }

  &.ship_submarine {
    /* background-color: #28a745; */

    &:not(.ship_rotated) {
      width: calc($cellSize);
    }

    &.ship_rotated {
      height: calc($cellSize * 1);
    }
  }

  &.ship_destroyer {
    /* background-color: #ffc107; */

    &:not(.ship_rotated) {
      width: calc($cellSize * 2);
    }

    &.ship_rotated {
      height: calc($cellSize * 2);
    }
  }

  &.ship_cruisers {
    /* background-color: #dc3545; */

    &:not(.ship_rotated) {
      width: calc($cellSize * 3);
    }

    &.ship_rotated {
      height: calc($cellSize * 3);
    }
  }

  &.ship_battleship {
    /* background-color: #6f42c1; */

    &:not(.ship_rotated) {
      width: calc($cellSize * 4);
    }

    &.ship_rotated {
      height: calc($cellSize * 4);
    }
  }

  &__hit {
    position: absolute;
    width: $cellSize;
    height: $cellSize;
    border: 2px dashed darkred;

    &::before, &::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      background-color:darkred;
      width: 100%;
      height: 2px;
    }

    &::before {
      transform: rotate(45deg);
    }

    &::after {
      transform: rotate(-45deg);
    }
  }
}
</style>
