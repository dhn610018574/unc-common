<template>
  <a-breadcrumb class="subTitle">
    <a-breadcrumb-item>{{ title }}</a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
.subTitle {
  height: 56px;
  line-height: 56px;
  background-color: #e6f7ff;
  padding-left: 40px;
  font-size: 16px;
  position: relative;
  text-align: left;
  &:before {
    position: absolute;
    content: '';
    height: 18px;
    width: 3px;
    background-color: #1890ff;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
  }
}
</style>
