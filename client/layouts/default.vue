<template>
  <div id="content-window">
    <slot />
  </div>
</template>

<style lang="scss">
body {
  background-image: url("/static/images/bg-tile.gif");
  background-size: 128px;
  overflow: hidden;
  backdrop-filter: sepia(0.15);
}

#content-window {
  $offset: 64px;
  padding: $offset calc($offset * 2);
  height: 100vh;
}
</style>
