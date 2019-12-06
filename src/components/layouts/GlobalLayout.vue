<template>
  <a-layout class="layout">
    <Golbal-header :menus="topMenus" />
    <a-layout>
      <a-layout-sider class="slider">
        <h4 class="sider-header">{{ breadTitle }}</h4>
        <s-menu :menu="menus" />
      </a-layout-sider>
      <a-layout>
        <Breadcrumb :title="$route.name" />
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
export default {
  components: {
    GolbalHeader,
    Breadcrumb,
    SMenu
  },
  data() {
    return {
      breadTitle: '',
      menus: [],
      topMenus: []
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
}
.sider-header {
  height: 56px;
  line-height: 56px;
  font-size: 14px;
  padding-left: 20px;
  margin: 0;
  font-weight: 600;
  background-color: #a6b8ce;
  text-align: left;
}
</style>
