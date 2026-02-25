<template>
<div 
  class="ship-sprite"
  :class="[`ship-sprite_${ship.type.toLowerCase()}`, { 'ship-sprite_rotated': ship.rotated }]"
>
  <slot />
</div>
</template>

<script setup lang="ts">
import type { Ship } from '~/model/Ship';

const { ship } = defineProps<{
  ship: Ship
}>()
</script>

<style scoped lang="scss">
$cellSize: var(--cell-size, 48px);

.ship-sprite {
  background-color: white;
  outline: 2px solid black;

  &.ship-sprite_rotated {
    width: $cellSize;
  }

  &.ship-sprite_rotated .ship-sprite__drag-handler {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
  }

  &:not(.ship-rotated) {
    height: $cellSize;
  }

  &.ship-sprite_submarine {
    /* background-color: #28a745; */

    &:not(.ship-sprite_rotated) {
      width: calc($cellSize);
    }

    &.ship-sprite_rotated {
      height: calc($cellSize * 1);
    }
  }

  &.ship-sprite_destroyer {
    /* background-color: #ffc107; */

    &:not(.ship-sprite_rotated) {
      width: calc($cellSize * 2);
    }

    &.ship-sprite_rotated {
      height: calc($cellSize * 2);
    }
  }

  &.ship-sprite_cruisers {
    /* background-color: #dc3545; */

    &:not(.ship-sprite_rotated) {
      width: calc($cellSize * 3);
    }

    &.ship-sprite_rotated {
      height: calc($cellSize * 3);
    }
  }

  &.ship-sprite_battleship {
    /* background-color: #6f42c1; */

    &:not(.ship-sprite_rotated) {
      width: calc($cellSize * 4);
    }

    &.ship-sprite_rotated {
      height: calc($cellSize * 4);
    }
  }

  &__drag-handler {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
    width: 16px;
    height: 16px;
    background-color: black;
    cursor: grab;
  }

  &__hit {
    position: absolute;
    width: $cellSize;
    height: $cellSize;
    border: 3px dashed darkred;

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