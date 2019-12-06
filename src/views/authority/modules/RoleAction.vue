<template>
  <a-modal width="40%" :title="title" :visible="visible" :confirmLoading="confirmLoading" @cancel="handleCancel">
    <template slot="footer">
      <a-button type="primary" v-show="type !== 1" @click="handleOk">{{ type === 0 ? '保存' : '修改' }}</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <a-form :form="form">
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="角色名称" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="disabled"
              v-decorator="['roleName', validatorRules.roleName]"
              placeholder="请输入角色名称"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="角色标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="disabled || type === 2"
              v-decorator="['roleCode', validatorRules.roleCode]"
              placeholder="请输入角色标识"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="角色描述" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-textarea
              :disabled="disabled"
              v-decorator="['roleDesc', validatorRules.roleDesc]"
              placeholder="请输入角色描述"
            ></a-textarea>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        <a-col :span="24">
          <a-form-item label="数据权限" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-select
              labelInValue
              :disabled="disabled"
              v-decorator="['dsType', validatorRules.dsType]"
              placeholder="请选择数据权限"
              @change="handleSelectChange"
            >
              <a-select-option v-for="item in dsTypeList" :key="item.key">{{ item.label }}</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-if="type === 1">
        <a-col :span="24">
          <a-form-item label="创建时间" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="disabled"
              v-decorator="['createTime', validatorRules.createTime]"
              placeholder="请输入创建时间"
            ></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24" v-show="isDefine">
        <a-col :span="20" offset="3">
          <a-tree
            checkable
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
            v-model="checkedKeys"
            :treeData="treeData"
            :replaceFields="replaceFields"
          />
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'RoleAction',
  data() {
    return {
      title: '新增',
      visible: false,
      confirmLoading: false,
      form: this.$form.createForm(this),
      labelCol: {
        span: 4
      },
      wrapperCol: {
        span: 20
      },
      validatorRules: {
        roleName: {
          rules: [{ required: true, message: '请输入角色名称' }]
        },
        roleCode: {
          rules: [{ required: true, message: '请输入角色标识' }]
        },
        roleDesc: {
          rules: [{ required: false, message: '请输入角色描述' }]
        },
        dsType: {
          rules: [{ required: true, message: '请选择数据权限' }]
        },
        createTime: {
          rules: [{ required: true, message: '请输入创建时间' }]
        }
      },
      expandedKeys: [],
      autoExpandParent: true,
      checkedKeys: [],
      treeData: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      isDefine: false,
      model: {},
      disabled: false,
      type: 0,
      dsTypeList: [
        {
          key: 0,
          label: '全部'
        },
        {
          key: 1,
          label: '自定义'
        },
        {
          key: 2,
          label: '本级及子级'
        },
        {
          key: 3,
          label: '本级'
        }
      ]
    }
  },
  watch: {
    checkedKeys(val) {
      this.checkedKeys = val
    },
    isDefine(val) {
      if (val) {
        this.getTree()
      }
    }
  },
  methods: {
    // 打开弹框
    open(type, record) {
      this.resetForm()
      this.type = type
      this.model = Object.assign({}, record)
      this.visible = true
      if (type === 0) {
        this.title = '新增'
        return
      }
      if (type === 1) {
        // 查看
        this.title = '查看'
        this.disabled = true
      } else if (type === 2) {
        // 编辑
        this.title = '编辑'
        if (this.model.dsType === 1) {
          this.isDefine = true
          this.checkedKeys = this.model.dsScope && this.model.dsScope.split(',').map(val => Number(val))
        }
      }
      const labelInValue = this.findLabelByKey(Number(this.model.dsType))
      this.$nextTick(() => {
        this.form.setFieldsValue({
          dsType: labelInValue
        })
        this.form.setFieldsValue(pick(this.model, 'roleName', 'roleCode', 'roleDesc', 'createTime'))
      })
    },
    // 根据key查找label
    findLabelByKey(key) {
      return this.dsTypeList.find(item => item.key === key)
    },
    // 获取树数据
    getTree() {
      this.$api.admin.getDeptTree().then(res => {
        if (res.code === 0) {
          this.treeData = res.data
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    handleOk() {
      this.confirmLoading = true
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.type !== 1) {
            // 新增和编辑
            const { key, label } = values.dsType
            const dsScope = this.checkedKeys.join(',') || ''
            let methods = 'post'
            let params = {
              dsScope,
              dsType: Number(key),
              $dsType: label,
              roleCode: values.roleCode,
              roleDesc: values.roleDesc,
              roleName: values.roleName,
              createTime: values.createTime
            }
            if (this.type === 2) {
              // 编辑
              params = Object.assign(this.model, params)
              methods = 'put'
            }
            this.$api.role
              .addRole(params, methods)
              .then(res => {
                if (res.code === 0 && res.data) {
                  // 回刷父级列表
                  this.$emit('refreshRole')
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
        }
      })
    },
    handleCancel() {
      this.visible = false
    },
    resetForm() {
      this.form.resetFields()
      this.disabled = false
      this.isDefine = false
      this.checkedKeys = []
      this.expandedKeys = []
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    handleSelectChange(val) {
      if (val.key === 1) {
        this.isDefine = true
        return
      }
      this.isDefine = false
    }
  }
}
</script>

<style lang="less" scoped></style>
