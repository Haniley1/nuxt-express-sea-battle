<template>
  <DndProvider :backend="HTML5Backend">
    <div class="sea-battle" :style="{'--size': `${cellSize}px`}">
      <!-- Игровая сетка -->
      <div :ref="drop" class="grid">
        <div v-for="idx in 100" class="grid-cell" />
        <ShipComponent
          v-for="[key, ship] in createdShips" 
          :key="key" 
          :id="key"
          :cell-size="cellSize"
          :ship="ship"
        />
      </div>
    </div>
  </DndProvider>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useDrop, DndProvider } from "vue3-dnd";
import ShipComponent from "./Ship.vue";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Ships, type Ship } from "~/model/Game";

const props = withDefaults(defineProps<{ cellSize?: number }>(), {
  cellSize: 50,
});

const createdShips = reactive(new Map<string, Ship>([
  ['a', { top: props.cellSize, left: props.cellSize * 2, type: 'BATTLESHIP', rotated: false }],
  ['b', { top: props.cellSize * 5, left: props.cellSize * 2, type: 'CRUISERS', rotated: true }],
]));

const moveBox = (id: string, left: number, top: number) => {
  const draggedShip = createdShips.get(id)

  if (draggedShip) {
    Object.assign(draggedShip, { left, top });
  }
};

function snapToGrid(x: number, y: number): [number, number] {
  const snappedX = Math.round(x / props.cellSize) * props.cellSize;
  const snappedY = Math.round(y / props.cellSize) * props.cellSize;
  return [snappedX, snappedY];
}

const [, drop] = useDrop(() => ({
  accept: "Ship",
  drop(item: { id: string, ship: Ship }, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset();
    if (!delta) return;

    const maxDefault = 10 * props.cellSize
    const max = maxDefault - (Ships[item.ship.type] * props.cellSize)
    const maxLeft = !item.ship.rotated ? max : maxDefault
    const maxTop = item.ship.rotated ? max : maxDefault
    
    const roundedLeft = Math.round(item.ship.left + delta.x)
    const roundedTop = Math.round(item.ship.top + delta.y)
    const left = Math.max(0, Math.min(roundedLeft, maxLeft));
    const top = Math.max(0, Math.min(roundedTop, maxTop));
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
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
