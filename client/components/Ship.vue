<template>
  <div
    :ref="preview"
    class="ship"
    :class="[`ship_${ship.type.toLowerCase()}`, { ship_rotated: ship.rotated }]"
    :style="shipStyles"
    @dblclick="rotateShip"
  >
    <div 
      :ref="drag"
      class="ship__drag-handler" 
    />
    <div 
      v-for="hit in ship.hits"
      :key="hit"
      class="ship__hit"
      :style="getHitStyles(hit)"
    />
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "@vueuse/core";
import { computed, type StyleValue } from "vue";
import { useDrag, type DragSourceMonitor } from "vue3-dnd";
import { Ship } from "~/model/Ship";

const props = defineProps<{
  ship: Ship;
  cellSize: number;
}>();

const shipStyles = computed<StyleValue>(() => {
  const { ship, cellSize } = props;
  const [left, top] = [ship.x * cellSize, ship.y * cellSize];

  return {
    "--size": `${cellSize}px`,
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

const [collect, drag, preview] = useDrag(() => ({
  type: "Ship",
  item: props.ship,

  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const { isDragging } = toRefs(collect);

const rotateShip = () => {
  props.ship.rotate()
}
</script>
<style scoped lang="scss">
$cellSize: var(--size, 32px);

.ship {
  position: absolute;
  border-radius: 16px;
  background-color: grey;

  &.ship_rotated {
    width: $cellSize;
  }

  &.ship_rotated .ship__drag-handler {
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
    border-radius: 4px;
    cursor: grab;
  }

  &__hit {
    position: absolute;
    width: $cellSize;
    height: $cellSize;
    border: 1px solid red;

    &::before, &::after {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      background-color:red;
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
