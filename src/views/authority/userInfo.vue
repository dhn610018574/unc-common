<template>
  <div style="margin: 10px 20px;">
    <a-tabs defaultActiveKey="1" @change="callback">
      <a-tab-pane tab="信息管理" key="1">
        <a-form :form="form">
          <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input disabled v-decorator="['username', validatorRules.username]"></a-input>
          </a-form-item>
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['phone', validatorRules.phone]" placeholder="请输入手机号"></a-input>
          </a-form-item>
          <a-form-item label="头像" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-upload
              name="file"
              :headers="headers"
              listType="picture-card"
              class="avatar-uploader"
              :showUploadList="false"
              action="/admin/sys-file/upload"
              @change="handleChange"
            >
              <img v-show="imageUrl" :src="imageUrl" id="avatar" alt="avatar" class="avatar" />
              <div v-if="!imageUrl">
                <a-icon :type="loading ? 'loading' : 'plus'" class="avatar-uploader-icon" />
              </div>
            </a-upload>
          </a-form-item>
          <a-form-item style="margin-left:150px;">
            <a-button type="primary" style="margin-right:20px;" @click="submit(1)" :loading="confirmLoading"
              >提交</a-button
            >
            <a-button @click="handleCancle(1)">重置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
      <a-tab-pane tab="密码管理" key="2" forceRender>
        <a-form :form="form">
          <a-form-item label="原密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input type="password" v-decorator="['password', validatorRules.password]"></a-input>
          </a-form-item>
          <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="password"
              v-decorator="['newpassword1', validatorRules.newpassword1]"
              placeholder="请输入密码"
            ></a-input>
          </a-form-item>
          <a-form-item label="确认密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="password"
              v-decorator="['newpassword2', validatorRules.newpassword2]"
              placeholder="请输入密码"
            ></a-input>
          </a-form-item>
          <a-form-item style="margin-left:150px;">
            <a-button type="primary" style="margin-right:20px;" @click="submit(2)" :loading="confirmLoading"
              >提交</a-button
            >
            <a-button @click="handleCancle(2)">重置</a-button>
          </a-form-item>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script>
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'
import { handleImg } from '@/utils/util'
import pick from 'lodash.pick'
export default {
  name: 'userInfo',
  data() {
    return {
      form: this.$form.createForm(this),
      labelCol: {
        span: 2
      },
      wrapperCol: {
        span: 10
      },
      validatorRules: {
        username: {
          rules: [{ required: false, message: '请输入用户名' }]
        },
        phone: {
          rules: [
            { required: false, message: '请输入手机号' },
            { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
          ]
        },
        password: {
          rules: [
            { required: true, message: '请输入原密码' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        },
        newpassword1: {
          rules: [
            { required: false, message: '请输入密码' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        },
        newpassword2: {
          rules: [
            { required: false, message: '请输入密码' },
            { validator: this.validatePass, trigger: 'blur' }
          ]
        }
      },
      confirmLoading: false,
      loading: false,
      imageUrl: '',
      headers: {
        Authorization: 'Bearer ' + this.$ls.get(ACCESS_TOKEN)
      },
      userData: {},
      avatar: ''
    }
  },
  mounted() {
    const userInfo = this.$ls.get(USER_INFO)
    handleImg(userInfo.avatar).then(res => {
      this.imageUrl = URL.createObjectURL(res)
    })
    this.$nextTick(() => {
      this.form.setFieldsValue({
        username: userInfo.username,
        phone: userInfo.phone
      })
    })
  },
  methods: {
    // 校验确认密码
    validatePass(rule, value, callback) {
      if (this.form.getFieldValue('password') !== '') {
        if (value !== this.form.getFieldValue('newpassword1')) {
          callback(new Error('两次输入密码不一致!'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    callback() {},
    submit(type) {
      let validateFields = type === 1 ? ['username', 'phone', 'avatar'] : ['password', 'newpassword1', 'newpassword2']
      this.form.validateFields(validateFields, (err, values) => {
        if (!err) {
          this.confirmLoading = true
          let params = {
            username: values.username,
            phone: values.phone,
            avatar: this.avatar
          }
          if (type === 2) {
            params = {
              password: values.password,
              newpassword1: values.newpassword1,
              newpassword2: values.newpassword2
            }
          }
          params = Object.assign(this.userData, params)
          this.$api.user
            .userEdit(params)
            .then(res => {
              if (res.code === 0 && res.data) {
                this.confirmLoading = false
                this.$message.success('修改成功')
                if (type === 2) {
                  this.$store.dispatch('Logout').then(() => {
                    window.location.reload() // 为了重新实例化vue-router对象 避免bug
                  })
                }
              } else {
                this.$message.warning(res.msg || res.message)
              }
            })
            .catch(() => {
              this.confirmLoading = false
            })
        }
      })
    },
    handleCancle(type) {
      if (type === 1) {
        this.form.setFieldsValue(pick(this.userData, 'username', 'phone'))
        handleImg(this.userData.avatar, 'avatar')
      } else {
        this.form.resetFields(['password', 'newpassword1', 'newpassword2'])
      }
    },
    handleChange(info) {
      if (info.file.status === 'uploading') {
        this.loading = true
        return
      }
      if (info.file.status === 'done') {
        this.imageUrl = URL.createObjectURL(info.file.originFileObj)
        this.avatar = `${info.file.response.data.bucketName}-${info.file.response.data.fileName}`
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.avatar-uploader .a-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader-icon {
  font-size: 28px !important;
  color: #8c939d !important;
  width: 178px !important;
  height: 178px !important;
  line-height: 178px !important;
  text-align: center !important;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
