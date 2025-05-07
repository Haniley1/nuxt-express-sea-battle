<script setup lang="ts">
import LobbyList from '~/components/pages/main/LobbyList.vue';

</script>

<template>
<div class="main-page">
  <div class="main-page__header">
    <h1 class="main-page__header-title">Морской бой</h1>
    <h2 class="main-page__header-subtitle">Список лобби:</h2>
  </div>
  <div class="main-page__content">
    <LobbyList />
  </div>
</div>
</template>

<style scoped lang="scss">
.main-page {
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.main-page__header {
  text-align: center;
}

.main-page__header-title {
  font-size: 72px;
  line-height: 1.15;
  font-weight: 700;
}

.main-page__header-subtitle {
  font-size: 48px;
  line-height: 1.15;
  font-weight: 500;
}

.main-page__content {
  margin-top: 24px;
  padding: 12px 48px;
  border: 3px double black;
  background-color: #31353e94;
  backdrop-filter: blur(2px);
  overflow: auto;
}
</style>
