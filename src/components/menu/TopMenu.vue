<template>
  <a-menu v-model="current" mode="horizontal" theme="dark" class="horizontalMenu">
    <a-menu-item :key="item.meta.id" v-for="item in menu">
      <a-icon :type="item.meta.icon" v-if="item.meta.icon"/>{{ item.meta.title }}
    </a-menu-item>
  </a-menu>
</template>

<script>
export default {
  props: {
    menu: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      current: ['mail']
    }
  }
}
</script>

<style lang="less" scoped>
.horizontalMenu {
  height: 64px;
  line-height: 64px;
  width: calc(100%-470px);
  overflow: hidden;
  margin: 0 260px 0 163px;
  text-align: left;
  /deep/ .ant-menu-item {
    padding: 0 18px;
  }
  /deep/ .ant-menu-item-selected {
    background-color: rgba(161, 156, 156, 0.3);
  }
}
</style>
