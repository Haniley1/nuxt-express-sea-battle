<script setup lang="ts">
import GameGrid from './components/GameGrid.vue';
import { DndProvider } from "vue3-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
</script>

<template>
  <div>
  <DndProvider :backend="HTML5Backend">
    <GameGrid />
  </DndProvider>
  </div>
</template>
