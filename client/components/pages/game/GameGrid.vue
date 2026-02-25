<template>
  <div class="game-grid" :style="{ '--cell-size': `${cellSize}px` }">
    <!-- Игровая сетка -->
    <div :ref="drop" class="game-grid__grid">
      <div 
        v-for="idx in 10 * 10" 
        :key="idx" 
        class="game-grid__grid-cell" 
      />
      <DraggableShip
        v-for="(ship, idx) in ships"
        :key="idx"
        class="game-grid__grid-ship"
        :cell-size="cellSize"
        :ship="ship"
      />
    </div>
    <button @click="ships.length = 0">Очистить поле</button>
  </div>
</template>

<script setup lang="ts">
import { provide } from "vue";
import { useDrop, type XYCoord } from "vue3-dnd";
import DraggableShip from "~/components/ship/DraggableShip.vue";
import { Ship } from "~/model/Ship";

const props = withDefaults(
  defineProps<{
    ships: Ship[];
    cellSize?: number;
  }>(),
  {
    cellSize: 48,
  }
);

const emit = defineEmits<{
  'ship-add': [Ship]
}>()

provide('cellSize', props.cellSize)

const [, drop] = useDrop(() => ({
  accept: ["Ship", "NewShip"],
  drop(_, monitor) {
    const delta = monitor.getClientOffset()!;
    const dragType = monitor.getItemType()!;
    const ship = monitor.getItem<Ship>();
    const [x, y] = getTargetCoordsFromPixels(ship.size, ship.rotated, delta);

    if (!canPlaceShip(x, y, ship)) {
      return
    }
    
    if (dragType === "Ship") {
      ship.setCoordinates(x, y);
    } else if (dragType === "NewShip") {
      const newShip = new Ship({ x, y, type: ship.type, rotated: false })
      newShip.setCoordinates(x, y)

      emit('ship-add', newShip)
    }
  },
}));

const getTurtleCoordinates = (
  x: number,
  y: number,
  ship: Ship
): { x: [number, number]; y: [number, number] } => {
  const xEnd = !ship.rotated ? x + ship.size - 1 : x;
  const yEnd = ship.rotated ? y + ship.size - 1 : y;

  return { x: [x, xEnd], y: [y, yEnd] };
};

const canPlaceShip = (x: number, y: number, placingShip: Ship): boolean => {
  const placingCoords = getTurtleCoordinates(x, y, placingShip);

  return Array.from(props.ships)
    .filter((ship) => ship !== placingShip)
    .every((ship) => {
      const placedCoords = ship.coordinates;

      // Проверка пересечения или соседства по оси X
      const xIntersectOrAdjacent =
        (placingCoords.x[0] <= placedCoords.x[1] + 1 &&
          placingCoords.x[1] >= placedCoords.x[0] - 1) ||
        (placedCoords.x[0] <= placingCoords.x[1] + 1 &&
          placedCoords.x[1] >= placingCoords.x[0] - 1);

      // Проверка пересечения или соседства по оси Y
      const yIntersectOrAdjacent =
        (placingCoords.y[0] <= placedCoords.y[1] + 1 &&
          placingCoords.y[1] >= placedCoords.y[0] - 1) ||
        (placedCoords.y[0] <= placingCoords.y[1] + 1 &&
          placedCoords.y[1] >= placingCoords.y[0] - 1);

      return !(xIntersectOrAdjacent && yIntersectOrAdjacent);
    });
};

const getTargetCoordsFromPixels = (
  shipSize: number,
  shipRotated: boolean,
  delta: XYCoord
) => {
  // TODO: Получать элемент через рефку
  const gridEl = document.querySelector(".game-grid__grid");
  const gridDelta = gridEl?.getBoundingClientRect()!;

  const gridX = delta.x - gridDelta.x;
  const gridY = delta.y - gridDelta.y;

  const maxXYDefault = 10;
  const maxXYRotated = maxXYDefault - shipSize;
  const maxX = shipRotated ? maxXYDefault : maxXYRotated;
  const maxY = !shipRotated ? maxXYDefault : maxXYRotated;

  const roundedX = Math.ceil((gridX - props.cellSize) / props.cellSize);
  const roundedY = Math.ceil((gridY - props.cellSize) / props.cellSize);
  const x = Math.max(0, Math.min(roundedX, maxX));
  const y = Math.max(0, Math.min(roundedY, maxY));

  return [x, y];
};
</script>

<style scoped lang="scss">
$cellSize: var(--cell-size, 32px);

.game-grid {
  position: relative;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;

  &__grid {
    display: grid;
    grid-template-columns: repeat(10, $cellSize);
    grid-template-rows: repeat(10, $cellSize);
    border: 2px dashed black;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.3);

    &-cell {
      border: 1px solid black;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: default;
    }

    &-ship {
      position: absolute;
    }
  }
}
</style>
