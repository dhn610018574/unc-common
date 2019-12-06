<template>
  <a-layout-header class="header">
    <logo />
    <user-menu />
    <top-menu :menu="menus" />
  </a-layout-header>
</template>

<script>
import Logo from './Logo'
import TopMenu from '@/components/menu/TopMenu'
import UserMenu from './UserMenu'
export default {
  props: {
    menus: {
      type: Array,
      required: true
    }
  },
  components: {
    Logo,
    TopMenu,
    UserMenu
  }
}
</script>

<style lang="less" scoped>
.header {
  padding: 0 16px;
}
</style>
