<template>
  <button
    :class="{
      button: true,
      [`theme_${theme}`]: !!theme,
    }"
    v-text="text"
  />
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    text?: string;
    theme?: string;
  }>(),
  {
    theme: 'main',
  },
);
</script>

<style scoped>
.button {
  padding: 12px;
  border: 2px outset black;
  background-color: rgb(224, 223, 223);
  font-size: 16px;
  font-weight: 500;

  &:active {
    border-style: inset;
  }

  &.theme_primary {
    background-color: blue;
  }
}
</style>
