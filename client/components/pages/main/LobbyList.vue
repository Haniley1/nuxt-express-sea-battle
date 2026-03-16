<template>
  <div class="lobby-list">
    <div
      class="lobby-list__item"
      @click="opened = true"
    >
      + Создать лобби
    </div>

    <NuxtLink
      v-for="lobby in lobbies"
      :key="lobby.id"
      :to="`/game/${lobby.id}`"
      class="lobby-list__item"
    >
      <span v-text="lobby.name" />
    </NuxtLink>
  </div>

  <LobbyCreationModal
    :opened="opened"
    @close="opened = false"
    @submit="handleCreateLobby"
  />
</template>

<script setup lang="ts">
import { api } from '~/api';
import LobbyCreationModal from './LobbyCreationModal.vue';
import useLobbiesList from '~/composables/api/useLobbiesList';

const router = useRouter();

const opened = ref(false);

const { data: lobbies, refresh: refreshLobbies } = await useLobbiesList();

const handleCreateLobby = async ({ name }: { name: string }) => {
  try {
    const response = await api.post('/lobby/create', { lobbyName: name });
    opened.value = false;
    router.push({ path: `/game/${response.data.id}` });
  } catch (err) {
    console.error(err);
  }
};
</script>

<style scoped lang="scss">
.lobby-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow-y: auto;

  &__item {
    padding: 12px 24px;
    text-align: center;
    cursor: pointer;
    background-color: white;
    color: black;
    border: 5px outset black;
    text-decoration: none;
    font-weight: 500;
    transition: all 200ms ease;

    &:hover {
      border-style: inset;
    }
  }
}
</style>
