<template>
  <div id="login">
    <div class="login">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane tab="智玄云账号" key="1">
          <a-form :form="form">
            <a-form-item>
              <a-input
                placeholder="请输入用户名"
                v-decorator="[
                  'username',
                  {
                    rules: [{ required: true, message: '用户名不能为空!' }]
                  }
                ]"
              >
                <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                placeholder="请输入密码"
                type="password"
                @keydown.enter.native="handleSubmit"
                v-decorator="[
                  'password',
                  {
                    rules: [{ validator: null }]
                  }
                ]"
              >
                <a-icon slot="prefix" type="insurance" :style="{ color: 'rgba(0,0,0,.25)' }" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-button class="login-btn" type="primary" shape="round" block :loading="loginBtn" @click="handleSubmit"
                >登录</a-button
              >
              <a href class="code">短信快捷登录</a>
              <span class="other">
                <a href>立即注册</a>
                <a href class="forgetPwd">忘记密码</a>
              </span>
            </a-form-item>
            <div class="tips">
              <p>温馨提示：</p>
              <p>请妥善保管好您的登录密码，请每隔三个月重置一次密码</p>
            </div>
          </a-form>
        </a-tab-pane>
      </a-tabs>
      <div class="tang-pass-pop-login">
        <div
          :class="changeQrcode ? 'tang-pass-pop-qrcodeLogin' : 'tang-pass-pop-qrcodeLogin2'"
          @click="handleQrLogin"
        ></div>
      </div>
      <i class="decoration"></i>
    </div>
  </div>
</template>

<script>
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'

export default {
  name: 'LoginForm',
  data() {
    return {
      changeQrcode: true,
      loginBtn: false
    }
  },
  beforeCreate() {
    this.form = this.$form.createForm(this)
    this.$ls.remove(ACCESS_TOKEN)
    this.$ls.remove(USER_INFO)
  },

  methods: {
    handleQrLogin() {
      this.changeQrcode = !this.changeQrcode
    },

    handleSubmit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.loginBtn = true
          this.login(values)
        }
      })
    },

    // 用户登录
    login(data) {
      this.$store
        .dispatch('Login', data)
        .then(res => {
          this.$notification.success({
            message: '系统提示',
            description: '登录成功',
            duration: 3,
            top: '62px'
          })

          this.getUserInfo()
        })
        .finally(() => (this.loginBtn = false))
    },

    getUserInfo() {
      this.$store.dispatch('GetUserInfo').then(res => {
        this.$router.push({ path: '/' })
      })
    }
  }
}
</script>

<style lang="less" scoped>
#login {
  width: 364px;
  height: 472px;
  background-color: #fff;
  float: right;
  border-radius: 4px;
  margin-top: -30px;
  position: relative;
  .login {
    width: 300px;
    height: 442px;
    margin: 30px auto 0;
    position: relative;
    .code {
      float: left;
      font-size: 12px;
      color: #2468f2;
    }
    .other {
      font-size: 12px;
      float: right;
      a {
        color: #2468f2;
        &.forgetPwd {
          margin-left: 5px;
        }
      }
    }
    .tips {
      margin-top: 35px;
      p {
        text-align: left;
        font-size: 12px;
        line-height: 24px;
        margin: 0;
        color: #333;
      }
    }
    .tang-pass-pop-login {
      position: absolute;
      right: -32px;
      bottom: 30px;
      z-index: 22;
      width: 44px;
      height: 44px;
    }
    .tang-pass-pop-qrcodeLogin {
      width: 44px;
      height: 44px;
      position: absolute;
      right: 0;
      bottom: -30px;
      cursor: pointer;
      background: url('~@/assets/images/pass_login_icons.png') no-repeat 0 0;
      z-index: 21;
      background-position: -44px -86px;
    }
    .tang-pass-pop-qrcodeLogin2 {
      width: 44px;
      height: 44px;
      position: absolute;
      right: 0;
      bottom: -30px;
      cursor: pointer;
      background: url('~@/assets/images/pass_login_icons.png') no-repeat 0 0;
      z-index: 21;
      background-position: 0 -86px;
    }
    .decoration {
      width: 125px;
      height: 42px;
      background: url('~@/assets/images/decoration2@2x.png') no-repeat 0 0;
      background-size: 125px 42px;
      position: absolute;
      right: 73px;
      bottom: -50px;
      z-index: 100;
    }
  }
}
</style>
