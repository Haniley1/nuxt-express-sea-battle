<template>
  <DndProvider :backend="HTML5Backend">
    <div class="sea-battle" :style="{ '--size': `${cellSize}px` }">
      <!-- Игровая сетка -->
      <div :ref="drop" class="grid">
        <div v-for="idx in gridSize * 10" :key="idx" class="grid-cell" />
        <ShipComponent
          v-for="(ship, idx) in createdShips"
          :key="idx"
          :cell-size="cellSize"
          :ship="ship"
        />
      </div>
    </div>
    <button @click="createdShips.length = 0">Очистить поле</button>
    <InitialShips :ships="createdShips" />
  </DndProvider>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useDrop, DndProvider, type XYCoord } from "vue3-dnd";
import ShipComponent from "./Ship.vue";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Ship, Ships, type ShipType } from "~/model/Ship";
import InitialShips from "./InitialShips.vue";

const props = withDefaults(
  defineProps<{ cellSize?: number; gridSize?: number }>(),
  {
    cellSize: 48,
    gridSize: 10,
  }
);

const createdShips = reactive([
  new Ship({ x: 1, y: 1, type: "BATTLESHIP", rotated: false, hits: [1, 3] }),
]);

const [, drop] = useDrop(() => ({
  accept: ["Ship", "CopyShip"],
  drop(_, monitor) {
    const delta = monitor.getClientOffset()!;
    const dragType = monitor.getItemType()!;

    if (dragType === "CopyShip") {
      const { type } = monitor.getItem<{ type: ShipType }>();
      const [x, y] = getTargetCoordsFromPixels(Ships[type], false, delta);
      const newShip = new Ship({ type, rotated: false, x, y });

      if (canPlaceShip(x, y, newShip)) {
        createdShips.push(newShip);
      }
    } else if (dragType === 'Ship') {
      const ship = monitor.getItem<Ship>();
      const [x, y] = getTargetCoordsFromPixels(ship.size, ship.rotated, delta);

      if (canPlaceShip(x, y, ship)) {
        ship.setCoordinates(x, y);
      }
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

  return Array.from(createdShips)
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
  const gridEl = document.querySelector(".sea-battle .grid");
  const gridDelta = gridEl?.getBoundingClientRect()!;

  const gridX = delta.x - gridDelta.x;
  const gridY = delta.y - gridDelta.y;

  const maxXYDefault = props.gridSize;
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

.copy-ships {
  display: flex;
  justify-content: center;
  gap: 8px;
}
</style>
