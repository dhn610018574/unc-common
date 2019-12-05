<template>
  <a-layout class="layout">
    <Golbal-header />
    <a-layout>
      <s-menu />
      <a-layout>
        <Breadcrumb />
        <a-layout-content>
          <slot />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import GolbalHeader from '@/components/tools/GolbalHeader'
import Breadcrumb from '@/components/tools/Breadcrumb'
import SMenu from '@/components/menu/SMenu'
export default {
  components: {
    GolbalHeader,
    Breadcrumb,
    SMenu
  },
  data() {
    return {
      collapsed: false
    }
  }
}
</script>

<style>
.ant-layout {
  height: 100%;
}
</style>
