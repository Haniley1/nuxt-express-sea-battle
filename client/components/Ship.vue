<template>
  <div
    :ref="drag"
    class="ship"
    :class="[`ship_${ship.type.toLowerCase()}`, { ship_rotated: ship.rotated }]"
    :style="shipStyles"
    @dblclick="rotateShip"
  />
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

const [collect, drag] = useDrag(() => ({
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
  cursor: grab;
  border-radius: 16px;

  &.ship_rotated {
    width: $cellSize;
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
