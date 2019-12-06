<template>
  <div class="home">
    <p>欢迎您 {{ username }}</p>
  </div>
</template>
<script>
import { USER_INFO } from '@/store/mutation-types'
export default {
  data() {
    return {
      username: ''
    }
  },
  created() {
    this.username = this.$ls.get(USER_INFO).username
  }
}
</script>

<style lang="less" scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100%-59px);
  width: 100vw;
  font-size: 32px;
  color: aqua;
  margin-top: 300px;
}
</style>
