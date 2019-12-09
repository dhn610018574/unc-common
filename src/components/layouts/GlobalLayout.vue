<template>
  <a-layout class="layout">
    <Golbal-header :menus="topMenus" />
    <a-layout>
      <a-layout-sider class="slider" v-show="!isHome">
        <h4 class="sider-header">{{ menuParent }}</h4>
        <s-menu :menu="menus" />
      </a-layout-sider>
      <a-layout>
        <Breadcrumb :title="$route.name" v-show="!isHome" />
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
import SMenu from '@/components/menu'
import { findParent } from '@/utils/util'
export default {
  components: {
    GolbalHeader,
    Breadcrumb,
    SMenu
  },
  watch: {
    $route() {
      this.updateMenu()
    }
  },
  data() {
    return {
      menuParent: '',
      menus: [],
      topMenus: [],
      isHome: false
    }
  },
  mounted() {
    this.updateMenu()
  },
  methods: {
    updateMenu() {
      console.log(this.$route.path)
      this.isHome = this.$route.path === '/home'
      const menuList = this.$store.state.user.menuList
      const currentParent = findParent(menuList, this.$route.meta.parentId)
      if (currentParent) {
        this.menus = currentParent.children || []
        this.menuParent = currentParent.name
      }
      this.topMenus = menuList
    }
  }
}
</script>

<style lang="less">
.ant-layout {
  height: 100%;
}
.slider {
  width: 180px !important;
  max-width: 180px !important;
  min-width: 180px !important;
  background-color: #d8dde6;
  /deep/ .ant-menu:not(.ant-menu-horizontal) .ant-menu-item-selected {
    background-color: #fff;
  }
  /deep/ .ant-menu-item {
    margin-top: 0;
    text-align: left;
  }
  ul.ant-menu {
    background-color: #d8dde6;
  }
  .ant-menu-inline .ant-menu-item-selected::after {
    border: 0;
  }
  .ant-menu-item-selected > a {
    color: #666;
  }
}
.sider-header {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  padding-left: 20px;
  margin: 0;
  font-weight: 700;
  background-color: #a6b8ce;
  text-align: left;
}
</style>
