<template>
  <BaseShip
    class="draggable-ship"
    :ship="ship" 
    :dragging="isDragging"
    :preview="preview"
  >
    <div 
      :ref="drag" 
      class="draggable-ship__drag-handler" 
      @dblclick="rotateShip" 
    />
  </BaseShip>
</template>

<script setup lang="ts">
import type { Ship } from '~/model/Ship';
import BaseShip from './BaseShip.vue';
import { useDrag, type DragSourceMonitor } from 'vue3-dnd';
import { toRefs } from '@vueuse/core';

const props = withDefaults(defineProps<{
  ship: Ship;
  canDrag?: boolean;
  dragType?: string
}>(), {
  canDrag: true,
  dragType: 'Ship'
});

const [collect, drag, preview] = useDrag(() => ({
  type: props.dragType,
  item: props.ship,
  canDrag: () => props.canDrag,
  collect: (monitor: DragSourceMonitor) => ({
    isDragging: monitor.isDragging(),
  }),
}));
const { isDragging } = toRefs(collect);

const rotateShip = () => {
  props.ship.rotate()
}
</script>

<style lang="scss" scoped>
.draggable-ship {
  &__drag-handler {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 16px;
    width: 16px;
    height: 16px;
    background-color: black;
    cursor: grab;
    z-index: 1;
  }

  &.ship_rotated &__drag-handler {
    top: 16px;
    left: 50%;
    transform: translateX(-50%);
  }
}
</style>