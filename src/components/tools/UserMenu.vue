<template>
  <div class="userWrapper">
    <span class="action">
      <a-icon type="question-circle" />
    </span>
    <span class="action" @click="showMessage">
      <a-badge
        :count="total"
        :offset="[6, -4]"
        :numberStyle="{ backgroundColor: 'red', color: '#fff', boxShadow: '0 0 0 1px #d9d9d9 inset' }"
      >
        <a-icon type="bell" style="font-size: 14px;" class="head-example" />
      </a-badge>
    </span>
    <span class="action">
      <img id="thumbnail" class="top-bar__img" />
      <span>欢迎您，{{ userName }}</span>
    </span>
    <span class="action" @click="handleLogout">
      <a-icon type="logout" class="menu-icon" />
      <span>退出登录</span>
    </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      total: 1,
      userName: 'admin'
    }
  },
  methods: {
    showMessage() {},
    handleLogout() {
      const self = this
      this.$confirm({
        title: '提示',
        content: '真的要注销登录吗 ?',
        onOk() {
          return self.$store.dispatch('Logout')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
@height: 59px;

.userWrapper {
  text-align: right;
  float: right;
  width: 340px;
  .action {
    color: #ffffff;
    display: inline-block;
    line-height: @height;
    text-align: center;
    padding: 0 12px;
    cursor: pointer;
    &:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    .menu-icon {
      margin-right: 8px;
    }
  }
  .logout_title {
    color: inherit;
    text-decoration: none;
  }
  .avatar {
    margin-right: 8px;
  }
}
.top-bar__img {
  margin: 0 8px 0 5px;
  padding: 2px;
  width: 30px;
  height: 30px;
  border-radius: 100%;
  box-sizing: border-box;
  border: 1px solid #eee;
  vertical-align: middle;
  display: inline-block;
}
.head-example {
  color: #fff;
}
</style>
