<template>
  <div class="logo">
    <router-link :to="{ path: '/' }">
      <img src="chinaunicom.png" alt="logo" />
      <h1>天玑视频云</h1>
    </router-link>
  </div>
</template>

<style lang="less" scoped>
@height: 64px;

.logo {
  height: @height;
  line-height: @height;
  float: left;
  width: 130px;

  a {
    color: white;
    position: relative;
    top: -2px;
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }

  img,
  h1 {
    display: inline-block;
    vertical-align: middle;
  }

  img {
    height: 32px;
  }

  h1 {
    color: #ffffff;
    font-size: 18px;
    margin: 0 0 0 8px;
    font-weight: 700;
  }
}
</style>
