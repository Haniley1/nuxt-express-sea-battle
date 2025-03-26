<template>
  <DndProvider :backend="HTML5Backend">
    <div class="sea-battle">
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
          v-bind="ship"
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

interface Ship {
  top: number;
  left: number;
  type: "battleship" | "cruisers" | "destroyer" | "submarine";
}

const props = withDefaults(defineProps<{ cellSize?: number }>(), {
  cellSize: 48,
});

const createdShips = reactive<{ [key: string]: Ship }>({
  a: { top: props.cellSize, left: props.cellSize * 2, type: 'battleship' },
});

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
  drop(item: any, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset();
    if (!delta) return;

    let l = Math.round(item.left + delta.x);
    let t = Math.round(item.top + delta.y);
    const [left, top] = snapToGrid(l, t);

    moveBox(item.id, left, top);
    return undefined;
  },
}));
</script>

<style scoped lang="scss">
$cellSize: 48px;

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
  cursor: pointer;
}

.ship-1 {
  width: $cellSize;
  background-color: #28a745;
}

.ship-2 {
  width: calc($cellSize * 2);
  background-color: #ffc107;
}

.ship-3 {
  width: calc($cellSize * 3);
  background-color: #dc3545;
}

.ship-4 {
  width: calc($cellSize * 4);
  background-color: #6f42c1;
}

.ships {
  display: flex;
  gap: 10px;
}

.ship-icon {
  height: $cellSize;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}
</style>
