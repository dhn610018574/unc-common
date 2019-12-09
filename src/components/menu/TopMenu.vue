<template>
  <a-menu mode="horizontal" theme="dark" class="horizontalMenu" :selectedKeys="selectedKeys">
    <a-menu-item :key="item.meta.id" v-for="item in menu">
      <span @click="handleClick(item)" class="menu-item-box">
        <a-icon :type="item.meta.icon" v-if="item.meta.icon" />{{ item.meta.title }}
      </span>
    </a-menu-item>
  </a-menu>
</template>

<script>
import { findParent } from '@/utils/util'

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
      selectedKeys: []
    }
  },
  created() {
    const menuList = this.$store.state.user.menuList
    const currentParent = findParent(menuList, this.$route.meta.parentId)
    this.selectedKeys = [currentParent.meta.id]
  },
  methods: {
    handleClick(currentMenu) {
      this.selectedKeys = [currentMenu.meta.id]
      if (currentMenu.children && currentMenu.children.length > 0) {
        this.$router.push({
          path: currentMenu.children[0].path
        })
      } else {
        this.$router.push({
          path: currentMenu.path
        })
      }
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
  .menu-item-box{
    width: 100%;
    height: 100%;
    display: block;
  }
}
</style>
