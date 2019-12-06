<template>
  <a-modal width="40%" :title="title" :visible="visible" @cancel="handleCancel">
    <template slot="footer">
      <a-button type="primary" :loading="confirmLoading" @click="handleOk">{{ type === 1 ? '修改' : '新增' }}</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <a-form :form="form">
      <a-row :gutter="24" v-show="type === 1">
        <a-col :span="24">
          <a-form-item label="id" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input disabled v-decorator="['userId', validatorRules.userId]"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="用户名" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="type === 1"
              v-decorator="['username', validatorRules.username]"
              placeholder="请输入用户名"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="密码" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              type="password"
              v-decorator="['password', validatorRules.password]"
              placeholder="请输入密码"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="所属部门" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-tree-select
              style="width: 100%"
              :dropdownStyle="{ maxHeight: '200px', overflow: 'auto' }"
              :treeData="treeDataSon"
              placeholder="请选择所属部门"
              v-decorator="['deptId', validatorRules.deptId]"
              treeDefaultExpandAll
            >
            </a-tree-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="手机号" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input v-decorator="['phone', validatorRules.phone]" placeholder="请输入手机号"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="角色" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              mode="multiple"
              placeholder="请选择角色"
              v-decorator="['roleId', validatorRules.roleId]"
              style="width: 100%"
            >
              <a-select-option v-for="item in roleList" :key="item.roleId">
                {{ item.roleName }}
              </a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="状态" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group v-decorator="['lockFlag', validatorRules.lockFlag]">
              <a-radio value="0" :bordered="true">有效</a-radio>
              <a-radio value="9">锁定</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-show="type === 1">
        <a-col :span="24">
          <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              disabled
              v-decorator="['createTime', validatorRules.createTime]"
              placeholder="请输入创建时间"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'UserForm',
  data() {
    return {
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 21
      },
      validatorRules: {
        userId: {
          rules: [{ required: false, message: '请输入id' }]
        },
        username: {
          rules: [{ required: true, message: '请输入用户名' }]
        },
        passward: {
          rules: [
            { required: false, message: '请输入密码' },
            { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
          ]
        },
        deptId: {
          rules: [{ required: true, message: '请选择所属部门' }]
        },
        phone: {
          rules: [
            { required: false, message: '请输入手机号' },
            { min: 11, max: 11, message: '长度在 11 个字符', trigger: 'blur' }
          ]
        },
        roleId: {
          rules: [{ required: true, message: '请选择角色' }]
        },
        lockFlag: {
          rules: [{ required: true, message: '请选择状态' }]
        },
        createTime: {
          rules: [{ required: false, message: '请输入创建时间' }]
        }
      },
      treeDataSon: [],
      model: {},
      type: 0,
      roleList: [],
      title: '新增',
      defaultRole: []
    }
  },
  watch: {},
  methods: {
    // 打开弹框
    open(type, record) {
      this.resetForm()
      this.visible = true
      this.type = type
      this.getTree()
      this.getRole()
      if (type !== 0) {
        this.title = '编辑'
        this.model = Object.assign({}, record)
        this.defaultRole.splice(0)
        this.model.roleList.forEach(element => {
          this.defaultRole.push(element.roleId)
        })
        this.$nextTick(() => {
          this.form.setFieldsValue({
            deptId: this.model.deptId + '',
            roleId: this.defaultRole
          })
          this.form.setFieldsValue(
            pick(this.model, 'userId', 'username', 'password', 'phone', 'createTime', 'lockFlag')
          )
        })
      }
    },

    // 转换接口数据为antd格式
    deepClone(arr) {
      arr.forEach(element => {
        element.label = element.name
        element.value = element.id + ''
        if (element.children && element.children.length > 0) {
          this.deepClone(element.children)
        }
      })
      return arr
    },
    // 获取树数据
    getTree() {
      this.$api.admin.getDeptTree().then(res => {
        if (res.code === 0) {
          this.treeDataSon = this.deepClone(res.data)
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    // 获取角色列表
    getRole() {
      this.$api.userManage.getRoleList().then(res => {
        if (res.code === 0) {
          this.roleList = res.data
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    handleOk() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let method = 'post'
          let params = {
            username: values.username,
            password: values.password,
            phone: values.phone,
            deptId: values.deptId,
            lockFlag: values.lockFlag,
            role: values.roleId
          }
          if (this.type === 1) {
            method = 'put'
            params = Object.assign(this.model, params)
          }
          this.$api.userManage
            .userAction(params, method)
            .then(res => {
              if (res.code === 0 && res.data) {
                // 回刷父级列表
                this.$emit('refreshUser')
                this.handleCancel()
                this.resetForm()
                this.confirmLoading = false
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
    handleCancel() {
      this.visible = false
    },
    resetForm() {
      this.form.resetFields()
    }
  }
}
</script>

<style lang="less" scoped></style>
