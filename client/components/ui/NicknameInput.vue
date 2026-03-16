<template>
  <div class="nickname-input">
    <input
      class="nickname-input__input"
      placeholder="Никнейм"
      v-model="nickname"
      name="nickname"
      type="text"
      @keyup.enter="login"
    />
    <button
      class="nickname-input__button"
      @click="login"
    >
      ✓
    </button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit']);

const nickname = ref('');

const login = () => {
  emit('submit', nickname.value);
};
</script>

<style scoped lang="scss">
.nickname-input {
  display: flex;
  height: 40px;
  align-items: center;
  outline: 2px solid black;
  font-family: Tiny5, sans-serif;

  &__input {
    flex: 1;
    height: 100%;
    padding: 8px 12px;
    font-size: 18px;
    line-height: 1.15;
    font-weight: 400;
    border: none;
    border-right: 1px solid black;
    outline: none;
    font-family: inherit;
  }

  &__button {
    height: 100%;
    padding: 8px 12px;
    font-size: 18px;
    line-height: 1.15;
    font-weight: 400;
    border: none;
    border-left: 1px solid black;
    outline: none;
    background-color: #4caf50;
    color: white;
    cursor: pointer;

    &:hover {
      background-color: #45a049;
    }
  }
}
</style>
