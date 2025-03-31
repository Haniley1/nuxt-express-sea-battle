<template>
  <DndProvider :backend="HTML5Backend">
    <div class="sea-battle" :style="{'--size': `${cellSize}px`}">
      <!-- Игровая сетка -->
      <div :ref="drop" class="grid">
        <div v-for="idx in 100" class="grid-cell">
          {{ idx }}
        </div>
        <Ship 
          v-for="(ship, key) in createdShips" 
          :key="key" 
          :id="key"
          :size="cellSize"
          :ship="ship"
        />
      </div>
    </div>
  </DndProvider>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useDrop, DndProvider } from "vue3-dnd";
import Ship from "./Ship.vue";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { Ship as ShipType } from "~/model/Game";

const props = withDefaults(defineProps<{ cellSize?: number }>(), {
  cellSize: 48,
});

const createdShips = reactive<Map<string, ShipType>>(new Map([
  ['a', { top: props.cellSize, left: props.cellSize * 2, type: 'BATTLESHIP' } as ShipType],
  ['b', { top: props.cellSize * 5, left: props.cellSize * 2, type: 'CRUISERS' }],
]));

const moveBox = (id: keyof typeof createdShips, left: number, top: number) => {
  Object.assign(createdShips[id], { left, top });
};

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / props.cellSize) * props.cellSize;
  const snappedY = Math.round(y / props.cellSize) * props.cellSize;
  return [snappedX, snappedY];
}

const [, drop] = useDrop(() => ({
  accept: "Ship",
  drop(item: ShipType, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset();
    if (!delta) return;

    console.log(item)

    const roundedLeft = Math.round(item.left + delta.x)
    const roundedTop = Math.round(item.top + delta.y)
    const left = Math.max(0, Math.min(roundedLeft, 10 * props.cellSize));
    const top = Math.max(0, Math.min(roundedTop, 10 * props.cellSize));
    const [snappedLeft, snappedTop] = snapToGrid(left, top);

    moveBox(item.id, snappedLeft, snappedTop);
    return undefined;
  },
}));
</script>

<style scoped lang="scss">
$cellSize: var(--size, 32px);

.sea-battle {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(10, $cellSize);
  grid-template-rows: repeat(10, $cellSize);
  border: 1px solid #000;
}

.grid-cell {
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: default;
}
</style>
