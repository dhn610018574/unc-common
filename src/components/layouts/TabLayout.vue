<template>
  <global-layout>
    <div class="globalContent">
      <router-view />
    </div>
  </global-layout>
</template>

<script>
import GlobalLayout from './GlobalLayout'

export default {
  name: 'TabLayout',
  components: {
    GlobalLayout
  }
}
</script>
<style lang="less">
.globalContent {
  height: 100%;
}
</style>
