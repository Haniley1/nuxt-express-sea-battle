<template>
<div 
  :ref="preview" 
  class="base-ship"
  :style="shipStyles"
>
  <ShipSprite 
    :ship="ship"
    :dragging="isDragging"
  >
    <div 
      :ref="drag"
      class="base-ship__drag-handler"
      @dblclick="rotateShip"
    />
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
import { toRefs } from "@vueuse/core";
import { computed, type StyleValue } from "vue";
import { useDrag, type DragSourceMonitor } from "vue3-dnd";
import { Ship } from "~/model/Ship";
import ShipSprite from "./ShipSprite.vue";
import { BASE_CELL_SIZE } from "~/static/data/constants";

const props = defineProps<{
  ship: Ship;
  cellSize: number;
}>();

const [collect, drag, preview] = useDrag(() => ({
  type: "Ship",
  item: props.ship,

  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));
const { isDragging } = toRefs(collect);

const shipStyles = computed<StyleValue>(() => {
  const [left, top] = [props.ship.x * BASE_CELL_SIZE, props.ship.y * BASE_CELL_SIZE];

  return {
    "--size": `${BASE_CELL_SIZE}px`,
    transform: `translate3d(${left}px, ${top}px, 0)`,
    opacity: isDragging.value ? 0 : 1,
  };
});

const getHitStyles = (hit: number): StyleValue => {
  const propertyName = props.ship.rotated ? 'top' : 'left'
  const position = props.cellSize * (hit - 1)

  return {
    [propertyName]: `${position}px`
  }
}

const rotateShip = () => {
  console.log('ROTATE')
  props.ship.rotate()
}
</script>
<style scoped lang="scss">
$cellSize: var(--size, 32px);

.base-ship {
  position: absolute;

  &.ship_rotated {
    width: $cellSize;
  }

  &.ship_rotated .base-ship__drag-handler {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
  }

  &:not(.ship-rotated) {
    height: $cellSize;
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
