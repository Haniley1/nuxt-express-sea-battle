<script setup lang="ts">
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "vue3-dnd";
</script>

<template>
  <NuxtLayout>
    <DndProvider :backend="HTML5Backend">
      <NuxtPage />
    </DndProvider>
  </NuxtLayout>
</template>
