<template>
  <Modal
    class="lobby-creation-modal"
    :opened="opened"
    @close="$emit('close')"
  >
    <div class="lobby-creation-modal__content">
      <h3 class="lobby-creation-modal__title">Создание лобби</h3>

      <input
        v-model="lobbyName"
        type="text"
        placeholder="Название лобби:"
      />

      <Button
        text="Создать"
        @click="createLobby"
      />
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Button from '~/components/ui/Button.vue';
import Modal from '~/components/ui/Modal.vue';

const emit = defineEmits<{
  close: [void];
  submit: [{ name: string }];
}>();
const props = withDefaults(
  defineProps<{
    opened: boolean;
  }>(),
  {
    opened: false,
  },
);

const lobbyName = ref('');

const createLobby = () => {
  if (lobbyName.value.length) {
    emit('submit', { name: lobbyName.value });
  }
};
</script>

<style scoped lang="scss">
.lobby-creation-modal {
  &__content {
    display: flex;
    flex-direction: column;
  }
}
</style>
