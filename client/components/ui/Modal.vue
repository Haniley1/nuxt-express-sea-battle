<template>
  <dialog
    ref="modal"
    class="modal"
    @click="handleModalClick"
  >
    <div class="modal__wrapper">
      <slot />
    </div>
  </dialog>
</template>

<script setup lang="ts">
const emit = defineEmits(['close']);
const props = withDefaults(
  defineProps<{
    opened: boolean;
  }>(),
  {
    opened: false,
  },
);

const modalRef = useTemplateRef('modal');

const handleModalClick = (evt: MouseEvent) => {
  if (evt.target === evt.currentTarget) {
    console.log('CLOSE');
    emit('close');
  }
};

watch(
  () => [props.opened, modalRef.value],
  ([opened]) => {
    if (opened) {
      modalRef.value?.showModal();
    } else {
      modalRef.value?.close();
    }
  },
  { immediate: true },
);
</script>

<style lang="scss" scoped>
$modalTiming: 500ms;
$backdropTiming: 500ms;

.modal {
  animation: modalFadeClose $modalTiming ease;
  transition:
    display $modalTiming allow-discrete,
    overlay $modalTiming allow-discrete;

  &::backdrop {
    animation: backdropFadeClose $backdropTiming ease;
  }

  &[open] {
    animation: modalFadeOpen $modalTiming ease;
  }

  &[open]::backdrop {
    animation: backdropFadeOpen $backdropTiming ease;
    background-color: rgba(0, 0, 0, 0.3);
  }

  &__wrapper {
    padding: 8px;
  }
}

@keyframes backdropFadeOpen {
  from {
    background-color: transparent;
  }
  to {
    background-color: rgba(0, 0, 0, 0.3);
  }
}
@keyframes backdropFadeClose {
  from {
    background-color: rgba(0, 0, 0, 0.3);
  }
  to {
    background-color: transparent;
  }
}

@keyframes modalFadeOpen {
  from {
    transform: translateY(1000%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
@keyframes modalFadeClose {
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(1000%);
    opacity: 0;
  }
}
</style>
