<template>
  <div class="lobby-list">
    <NuxtLink
      v-for="idx in 4"
      :key="idx"
      to="/game/random-uuid"
      class="lobby-list__item"
    >
      <h4 class="lobby-list__item-title">310 кабинет</h4>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.lobby-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;
}

.lobby-list__item {
  padding: 12px 24px;
  text-align: center;
  cursor: pointer;
  background-color: white;
  color: black;
  border: 5px outset black;
  transition: all 200ms ease;

  &:hover {
    border-style: inset;
  }
}
</style>
