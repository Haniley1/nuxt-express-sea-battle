<template>
  <div class="players-tab base-box">
    <div class="players-tab__item">
      <img
        class="players-tab__item-avatar"
        src="/static/images/avatars/default.jpg"
      />
      <span class="players-tab__item-nickname">
        {{ player?.nickname }}
      </span>
    </div>

    <div class="players-tab__separator" />

    <div
      v-if="secondPlayer"
      class="players-tab__item"
    >
      <img
        class="players-tab__item-avatar"
        :src="secondPlayer.avatar || '/static/images/avatars/default.jpg'"
      />
      <span
        class="players-tab__item-nickname"
        v-text="secondPlayer.nickname"
      />
    </div>
    <div
      v-else
      class="players-tab__item"
    >
      <span class="players-tab__item-waiting"> Ищем игрока </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Player } from '@shared/model/Player';

const props = defineProps<{
  player?: Player;
  secondPlayer?: Player;
}>();
</script>

<style lang="scss" scoped>
.players-tab {
  position: fixed;
  inset: 12px auto auto 50%;
  display: flex;
  gap: 24px;
  padding: 12px;
  transform: translateX(-50%);

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: default;
    user-select: none;

    & + & {
      margin-top: 4px;
    }

    &-avatar {
      width: 32px;
      border: 1px solid black;
      border-radius: 2px;
      aspect-ratio: 1 / 1;
    }

    &-nickname {
      font-size: 22px;
      font-weight: 500;
    }

    &-waiting {
      &::after {
        display: inline-block;
        width: 1em;
        content: '';
        animation: blink-dots infinite 1s;
      }
    }
  }

  &__separator {
    width: 1px;
    height: auto;
    border-left: 2px solid black;
    border-radius: 2px;
  }
}

@keyframes blink-dots {
  0% {
    content: '';
  }
  20% {
    content: '.';
  }
  40% {
    content: '..';
  }
  60% {
    content: '...';
  }
  80% {
    content: '..';
  }
  100% {
    content: '.';
  }
}
</style>
