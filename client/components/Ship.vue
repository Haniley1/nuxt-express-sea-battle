<template>
  <div 
    :ref="drag" 
    class="ship"
    :class="`ship_${type}`"
    :style="{
      '--size': `${size}px`,
      transform: `translate3d(${left}px, ${top}px, 0)`,
      opacity: isDragging ? 0 : 1,
      height: isDragging ? 0 : '',
    }"
  >
    {{ type }}
  </div>
</template>
<script setup lang="ts">
import { toRefs } from "vue";
import { useDrag, type DragSourceMonitor } from "vue3-dnd";

const props = defineProps<{
  type: "battleship" | "cruisers" | "destroyer" | "submarine";
  size: number
  left: number
  top: number
  id: string
}>();

const [collect, drag, preview] = useDrag(() => ({
  type: "Ship",
  item: props,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const { value: isDragging } = toRefs(collect)
console.log({isDragging})
</script>
<style scoped lang="scss">
$cellSize: var(--size, 32px);

.ship {
  position: absolute;
  height: $cellSize;
  background-color: red;

  &.ship_submarine {
    width: $cellSize;
  }

  &.ship_destroyer {
    width: calc($cellSize * 2);
  }

  &.ship_cruisers {
    width: calc($cellSize * 3);
  }

  &.ship_battleship {
    width: calc($cellSize * 4);
  }
}
</style>
