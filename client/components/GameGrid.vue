<template>
  <DndProvider :backend="HTML5Backend">
    <div class="sea-battle" :style="{'--size': `${cellSize}px`}">
      <!-- Игровая сетка -->
      <div :ref="drop" class="grid">
        <div v-for="idx in gridSize * 10" :key="idx" class="grid-cell" />
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

const props = withDefaults(defineProps<{ cellSize?: number, gridSize?: number }>(), {
  cellSize: 50,
  gridSize: 10,
});

const createdShips = reactive(new Map<string, Ship>([
  ['a', { x: 2, y: 1, type: 'BATTLESHIP', rotated: false }],
  ['b', { x: 2, y: 5, type: 'CRUISERS', rotated: true }],
]));

const moveBox = (id: string, x: number, y: number) => {
  const draggedShip = createdShips.get(id)

  if (draggedShip) {
    Object.assign(draggedShip, { x, y });
  }
};

const [, drop] = useDrop(() => ({
  accept: "Ship",
  drop(item: { id: string, ship: Ship }, monitor) {
    const delta = monitor.getDifferenceFromInitialOffset();
    if (!delta) return;

    const shipSize = Ships[item.ship.type] as number
    const maxXYDefault = props.gridSize
    const maxXYRotated = maxXYDefault - shipSize
    const maxX = item.ship.rotated ? maxXYDefault : maxXYRotated
    const maxY = !item.ship.rotated ? maxXYDefault : maxXYRotated
    
    const roundedX = Math.round((item.ship.x * props.cellSize + delta.x) / props.cellSize)
    const roundedY = Math.round((item.ship.y * props.cellSize + delta.y) / props.cellSize)
    const x = Math.max(0, Math.min(roundedX, maxX));
    const y = Math.max(0, Math.min(roundedY, maxY));

    moveBox(item.id, x, y);
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
