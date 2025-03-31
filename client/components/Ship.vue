<template>
  <div
    :ref="drag"
    class="ship"
    :class="[`ship_${ship.type.toLowerCase()}`, { ship_rotated: ship.rotated }]"
    :style="shipStyles"
  >
    {{ ship.type }}
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { type StyleValue } from "vue";
import { toRefs } from "vue";
import { useDrag, type DragSourceMonitor } from "vue3-dnd";
import type { Ship } from "~/model/Game";

const props = defineProps<{
  ship: Ship;
  id: string;
  cellSize: number;
}>();

const shipStyles = computed<StyleValue>(() => {
  const { ship, cellSize } = props;
  let transformValue = `translate3d(${ship.left}px, ${ship.top}px, 0)`;

  return {
    "--size": `${cellSize}px`,
    transform: transformValue,
    opacity: isDragging ? 0 : 1,
    height: isDragging ? 0 : "",
  };
});

const [collect, drag, preview] = useDrag(() => ({
  type: "Ship",
  item: { ship: props.ship, id: props.id },
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));

const { value: isDragging } = toRefs(collect);
</script>
<style scoped lang="scss">
$cellSize: var(--size, 32px);

.ship {
  position: absolute;
  height: $cellSize;
  background-color: red;
  cursor: grab;

  &.ship_rotated {
    width: $cellSize !important;
  }

  &.ship_submarine {
    width: $cellSize;
    background-color: #28a745;

    &.ship_rotated {
      height: calc($cellSize * 1);
    }
  }

  &.ship_destroyer {
    width: calc($cellSize * 2);
    background-color: #ffc107;

    &.ship_rotated {
      height: calc($cellSize * 2);
    }
  }

  &.ship_cruisers {
    width: calc($cellSize * 3);
    background-color: #dc3545;

    &.ship_rotated {
      height: calc($cellSize * 3);
    }
  }

  &.ship_battleship {
    width: calc($cellSize * 4);
    background-color: #6f42c1;

    &.ship_rotated {
      height: calc($cellSize * 4);
    }
  }
}
</style>
