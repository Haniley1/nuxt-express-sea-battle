<template>
<div class="main-page">
  <div class="main-page__header">
    <h1 class="main-page__header-title">Морской бой</h1>
  </div>
  <div class="main-page__content">
    <div class="main-page__content-box">
      <NicknameInput
        v-if="!session.isAuthenticated"
        @submit="login" 
      />
      <h2 
        v-else 
        v-text="session.nickname.value" 
      />
    </div>

    <div class="main-page__content-box">
      <h2 class="main-page__content-box-title">
        Список лобби:
      </h2>
      <LobbyList />
    </div>
  </div>
</div>
</template>

<script setup lang="ts">
import LobbyList from '~/components/pages/main/LobbyList.vue';
import NicknameInput from '~/components/ui/NicknameInput.vue';
import { useAuth } from '~/composables/useAuth';

const session = useAuth()
console.log('Session state:', session)

const login = async (nickname: string) => {
  const result = await session.login(nickname)
  
  if (!result.success) {
    alert('Ошибка при входе')
  }
}
</script>

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
  position: fixed;
  inset: 50% 50%;
  width: 100%;
  height: fit-content;
  max-width: 800px;
  transform: translate(-50%, -50%);
  margin-top: 24px;
  
  &-box {
    padding: 12px 24px;
    border: 3px double black;
    background-color: #31353e94;
    backdrop-filter: blur(2px);

    & + & {
      margin-top: 24px;
    }

    &-title {
      margin-bottom: 12px;
      font-size: 28px;
      line-height: 1.15;
      font-weight: 500;
      text-align: center;
      color: white;
    }
  }
}
</style>
