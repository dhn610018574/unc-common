<template>
  <div class="login-user">
    <div class="main">
      <header>
        <i class="decoration"></i>
        <div class="container">
          <a href="">
            <img width="104" height="22" class="logo" src="@/assets/images/login_logo.png" alt="" />
          </a>
          <div class="right">
            <a href="">English</a>
          </div>
        </div>
      </header>
      <div id="root">
        <a-row :gutter="0">
          <a-col :span="12" class="left">
            <h2>智玄视频云,智慧无限可能</h2>
            <h3>
              全面、落地的<span>AI型视频云</span><br />
              开放、安全的<span>Big Data</span><br />
              持续、先进的<span>Cloud</span>
            </h3>
            <p class="hr"></p>
            <p>
              <a href="">
                <img width="366px" height="100px" src="@/assets/images/banner002.png" alt="" class="banner" />
              </a>
            </p>
          </a-col>
          <a-col :span="12">
            <login-form />
          </a-col>
        </a-row>
      </div>
      <footer>
        <footer>
          ©2019 联通(上海)产业互联网有限公司
          <a href="http://www.baidu.com/duty/" target="_blank">使用前必读</a><br />
          沪ICP备19006540号-3&nbsp;&nbsp;&nbsp;&nbsp;<a
            target="blank"
            href="https://cloud.baidu.com/doc/Agreements/s/Kjwvy245m/"
            >隐私政策</a
          >
        </footer>
      </footer>
    </div>
  </div>
</template>

<script>
import LoginForm from './modules/LoginForm'
export default {
  components: {
    LoginForm
  }
}
</script>
<style lang="less" scoped>
.login-user {
  height: 100%;
  width: 100%;
  min-height: 700px;
  min-width: 1200px;
  background: #f6f8fb url('~@/assets/images/login_bg.png') repeat-y top right;
  background-repeat: repeat-y;
  background-size: 31% 100%;
  background-position: 100% 0;
}

.main {
  margin: 0 auto;
  width: 930px;
  height: 100%;
  header {
    height: 20px;
    width: 100%;
    padding: 70px 0;
    position: relative;
    .decoration {
      display: inline-block;
      width: 166px;
      height: 178px;
      background: url('~@/assets/images/decoration1@2x.png') no-repeat 0 0;
      background-size: 166px 178px;
      position: absolute;
      top: 0;
      left: -195px;
    }
    .container {
      height: 100%;
      margin-left: auto;
      margin-right: auto;
      width: 930px;
      a {
        font-size: 14px;
        color: #fff;
      }
      .logo {
        float: left;
      }
      .right {
        float: right;
      }
    }
  }
  #root {
    .left {
      h2,
      h3 {
        text-align: left;
        font-weight: normal;
      }
      h2 {
        font-size: 30px;
        color: #2e3341;
        line-height: 36px;
        margin: 32px 0;
      }
      h3 {
        opacity: 0.6;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #2e3341;
        line-height: 30px;
        margin: 0;
        span {
          font-family: DINAlternate-Bold;
          font-size: 16px;
          color: #00151d;
          line-height: 30px;
          margin-left: 5px;
        }
      }
      p.hr {
        margin: 30px 0;
        border-top: 1px solid rgba(216, 216, 216, 0.5);
        width: 366px;
      }
      img.banner {
        float: left;
      }
    }
  }

  footer {
    position: relative;
    z-index: 2;
    margin: 0 auto;
    margin-top: -40px;
    text-align: left;
    padding: 40px 0;
    line-height: 24px;
    font-size: 12px;
    color: rgba(46, 51, 65, 0.66);
    display: block;
    width: 930px;
    a {
      color: rgba(46, 51, 65, 0.66);
      &:hover {
        text-decoration: underline;
      }
    }
  }
}

.main /deep/ .ant-tabs-nav .ant-tabs-tab-active {
  font-weight: 500;
  font-size: 18px;
  color: #2468f2;
}
.main /deep/ .ant-tabs-ink-bar {
  background-color: #2468f2;
}
.main /deep/ .login-btn {
  background-color: #2468f2;
}
</style>
