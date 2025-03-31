<template>
  <div 
    :ref="drag" 
    class="ship"
    :class="`ship_${ship.type.toLowerCase()}`"
    :style="{
      '--size': `${size}px`,
      transform: `translate3d(${ship.left}px, ${ship.top}px, 0)`,
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    }"
  >
    {{ ship.type }}
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import { useDrag, type DragSourceMonitor } from "vue3-dnd";
import type { Ship } from "~/model/Game";

const props = defineProps<{
  ship: Ship,
  size: number
}>();

const [collect, drag, preview] = useDrag(() => ({
  type: "Ship",
  item: props.ship,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const { value: isDragging } = toRefs(collect)
</script>
<style scoped lang="scss">
$cellSize: var(--size, 32px);

.ship {
  position: absolute;
  height: $cellSize;
  background-color: red;
  cursor: grab;

  &.ship_submarine {
    width: $cellSize;
    background-color: #28a745;
  }

  &.ship_destroyer {
    width: calc($cellSize * 2);
    background-color: #ffc107;
  }

  &.ship_cruisers {
    width: calc($cellSize * 3);
    background-color: #dc3545;
  }

  &.ship_battleship {
    width: calc($cellSize * 4);
    background-color: #6f42c1;
  }
}
</style>
