<template>
  <div class="sea-battle">
    <!-- Игровая сетка -->
    <div class="grid">
      <div
        v-for="(row, rowIndex) in grid"
        :key="rowIndex"
        class="grid-row"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="grid-cell"
          @dragover="onDrop($event, rowIndex, colIndex)"
          @drop="onDrop($event, rowIndex, colIndex)"
        >
          <div
            v-if="cell.ship"
            class="ship"
            :class="`ship-${cell.ship.size}`"
          >
            {{ cell.ship.size }}
          </div>
        </div>
      </div>
    </div>

    <!-- Иконки кораблей -->
    <div class="ships">
      <div
        v-for="ship in ships"
        :key="ship.id"
        class="ship-icon"
        :class="`ship-${ship.size}`"
        draggable="true"
        @dragstart="onDragStart($event, ship)"
      >
        {{ ship.size }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Состояние сетки
const grid = ref(Array.from({ length: 10 }, () => Array.from({ length: 10 }, () => ({ ship: null }))));
console.log(grid)

// Корабли для размещения
const ships = ref([
  { id: 1, size: 4 }, // Линкор (4 клетки)
  { id: 2, size: 3 }, // Крейсер (3 клетки)
  { id: 4, size: 2 }, // Эсминец (2 клетки)
  { id: 10, size: 1 }, // Катер (1 клетка)
]);

// Текущий перетаскиваемый корабль
let draggedShip = null;

// Начало перетаскивания
const onDragStart = (event, ship) => {
  draggedShip = ship;
  event.dataTransfer.setData('text/plain', ship.id);
};

// Обработка размещения корабля
const onDrop = (event, row, col) => {
  if (!draggedShip) return;

  // Проверка, можно ли разместить корабль
  if (canPlaceShip(row, col, draggedShip.size)) {
    placeShip(row, col, draggedShip);
  }

  draggedShip = null;
};

// Проверка возможности размещения корабля
const canPlaceShip = (row, col, size) => {
  for (let i = 0; i < size; i++) {
    if (col + i >= 10 || grid.value[row][col + i].ship) {
      return false;
    }
  }
  return true;
};

// Размещение корабля на сетке
const placeShip = (row, col, ship) => {
  for (let i = 0; i < ship.size; i++) {
    grid.value[row][col + i].ship = ship;
  }
};
</script>

<style scoped>
.sea-battle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.grid {
  display: flex;
  flex-direction: column;
  border: 1px solid #000;
}

.grid-row {
  display: flex;
}

.grid-cell {
  width: 40px;
  height: 40px;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ship {
  background-color: #007bff;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ship-1 {
  width: 40px;
  background-color: #28a745;
}

.ship-2 {
  width: 80px;
  background-color: #ffc107;
}

.ship-3 {
  width: 120px;
  background-color: #dc3545;
}

.ship-4 {
  width: 160px;
  background-color: #6f42c1;
}

.ships {
  display: flex;
  gap: 10px;
}

.ship-icon {
  height: 40px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
}
</style>