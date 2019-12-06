<template>
  <a-row :gutter="20" style="margin: 10px 0;">
    <a-col :span="5">
      <a-card :style="{ 'min-height': cardHeight + 'px', height: '100%' }">
        <template>
          <a-button type="primary" @click="handleCRUD(0)">添加</a-button>
          <a-button type="primary" style="margin:0 8px;" @click="handleCRUD(1)">编辑</a-button>
          <a-button type="primary" @click="handleCRUD(2)">删除</a-button>
        </template>
        <a-tree :treeData="treeData" :replaceFields="replaceFields" @select="onSelect" />
      </a-card>
    </a-col>
    <a-col :span="19">
      <a-card :style="{ 'min-height': cardHeight + 'px' }">
        <a-form :form="form">
          <a-form-item label="父级节点" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              disabled
              v-decorator="['parentId', validatorRules.parentId]"
              placeholder="请输入父级节点"
            ></a-input>
          </a-form-item>
          <a-form-item
            v-if="actionType === 1 || actionType === 3"
            label="节点ID"
            :labelCol="labelCol"
            :wrapperCol="wrapperCol"
          >
            <a-input disabled v-decorator="['menuId', validatorRules.menuId]" placeholder="请输入节点ID"></a-input>
          </a-form-item>
          <a-form-item label="标题" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-input
              :disabled="disabled"
              v-decorator="['name', validatorRules.name]"
              placeholder="请输入标题"
            ></a-input>
          </a-form-item>
          <a-form-item label="类型" :labelCol="labelCol" :wrapperCol="wrapperCol">
            <a-radio-group
              :disabled="disabled"
              v-decorator="['type', validatorRules.type]"
              @change="changeRadio"
            >
              <a-radio value="0">菜单</a-radio>
              <a-radio value="1">按钮</a-radio>
            </a-radio-group>
          </a-form-item>
          <template v-if="menuDetail.type === '0'">
            <a-form-item label="地址" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :disabled="disabled"
                v-decorator="['path', validatorRules.path]"
                placeholder="请输入路径"
              ></a-input>
            </a-form-item>
            <a-form-item label="图标" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :disabled="disabled"
                v-decorator="['icon', validatorRules.icon]"
                placeholder="点击右侧按钮选择图标"
              >
                <a-icon slot="addonAfter" type="setting" @click="selectIcons" />
              </a-input>
            </a-form-item>
            <a-form-item label="前端组件" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :disabled="disabled"
                v-decorator="['component', validatorRules.component]"
                placeholder="请输入前端组件"
              ></a-input>
            </a-form-item>
            <a-form-item label="排序" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input-number
                :disabled="disabled"
                style="width:100%"
                v-decorator="['sort', validatorRules.sort]"
                placeholder="排序"
              ></a-input-number>
            </a-form-item>
            <a-form-item label="路由缓冲" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-switch
                :disabled="disabled"
                checkedChildren="开"
                unCheckedChildren="关"
                v-decorator="['keepAlive', validatorRules.keepAlive]"
              />
            </a-form-item>
          </template>
          <template v-if="menuDetail.type === '1'">
            <a-form-item label="权限标识" :labelCol="labelCol" :wrapperCol="wrapperCol">
              <a-input
                :disabled="disabled"
                v-decorator="['permission', validatorRules.permission]"
                placeholder="权限标识"
              ></a-input>
            </a-form-item>
          </template>
          <a-form-item v-show="!disabled" style="margin-left:150px;">
            <a-button
              type="primary"
              style="margin-right:20px;"
              @click="submit"
              :loading="confirmLoading"
            >保存</a-button>
            <a-button @click="handleCancle">取消</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
    <!-- 选择图标 -->
    <icons
      @choose="handleIconChoose"
      @close="handleIconCancel"
      :iconChooseVisible="iconChooseVisible"
    ></icons>
  </a-row>
</template>
<script>
import pick from 'lodash.pick'
import Icons from './modules/icon/Icons'
export default {
  name: 'menuManage',
  components: { Icons },
  data() {
    return {
      treeData: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      form: this.$form.createForm(this),
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 20
      },
      validatorRules: {
        parentId: {
          rules: [{ required: false, message: '请输入父级节点' }]
        },
        menuId: {
          rules: [{ required: true, message: '请输入节点ID' }]
        },
        name: {
          rules: [{ required: true, message: '请输入标题' }]
        },
        type: {
          rules: [{ required: true, message: '请选择类型' }]
        },
        path: {
          rules: [{ required: false, message: '请选择路径' }]
        },
        icon: {
          rules: [{ required: false, message: '请输入图标' }]
        },
        component: {
          rules: [{ required: true, message: '请输入前端组件' }]
        },
        sort: {
          rules: [{ required: false, message: '请输入排序' }]
        },
        keepAlive: {
          rules: [{ required: true, message: '请选择路由缓冲' }],
          initialValue: false,
          valuePropName: 'checked'
        },
        permission: {
          rules: [{ required: false, message: '请输入权限标识' }]
        }
      },
      menuDetail: {},
      actionType: 3,
      cardHeight: '',
      selectedKeys: [],
      disabled: true,
      nodeData: {},
      iconChooseVisible: false,
      confirmLoading: false
    }
  },
  created() {
    const clientHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 59
    this.cardHeight = clientHeight
  },
  mounted() {
    this.getMenuTree()
  },

  methods: {
    getMenuTree() {
      this.$api.admin.getMenuTree().then(res => {
        if (res.code === 0) {
          this.treeData = res.data
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    onSelect(selectedKeys, info) {
      if (selectedKeys.length < 1) {
        this.form.resetFields()
        this.menuDetail = {}
        this.selectedKeys = []
        this.form.setFieldsValue({
          parentId: '-1'
        })
        this.actionType = 3
        this.disabled = true
        return
      }
      this.nodeData = info.node.dataRef
      this.selectedKeys = selectedKeys
      this.getDeptDetail()
    },
    getDeptDetail() {
      this.$api.admin.getDeptDetail(this.selectedKeys[0]).then(res => {
        if (res.code === 0) {
          this.menuDetail = res.data
          this.setForm()
        } else {
          this.$message.warning(res.msg)
        }
      })
    },
    handleCRUD(actionType) {
      this.actionType = actionType
      this.disabled = false
      switch (actionType) {
        case 0:
          this.add()
          break
        case 1:
          this.disabled = this.selectedKeys.length < 1
          break
        case 2:
          this.deleteUser()
          break
      }
    },
    setForm() {
      this.$nextTick(() => {
        if (this.actionType !== 0) {
          this.form.setFieldsValue({
            menuId: this.menuDetail.menuId
          })
        }
        if (this.menuDetail.type === '0') {
          this.form.setFieldsValue({
            keepAlive: this.menuDetail.keepAlive === '1'
          })
          this.form.setFieldsValue(
            pick(this.menuDetail, 'parentId', 'name', 'type', 'path', 'icon', 'component', 'sort')
          )
        } else if (this.menuDetail.type === '1') {
          this.form.setFieldsValue(pick(this.menuDetail, 'parentId', 'name', 'type', 'path', 'permission'))
        }
      })
    },
    changeRadio(e) {
      this.menuDetail.type = e.target.value
      this.$nextTick(() => {
        this.form.setFieldsValue({
          type: e.target.value
        })
      })
    },
    submit() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.confirmLoading = true
          let method = 'post'
          let params = {
            parentId: Number(values.parentId),
            name: values.name,
            icon: values.icon,
            keepAlive: values.keepAlive === false ? '0' : '1',
            menuId: values.menuId,
            path: values.path,
            type: values.type,
            permission: values.permission,
            component: values.component,
            sort: values.sort
          }
          if (this.actionType === 1) {
            // 编辑
            params = Object.assign(this.nodeData, params)
            method = 'put'
          }
          this.$api.admin.menuAction(params, method).then(res => {
            if (res.code === 0) {
              this.$message.success('操作成功')
              this.getDeptDetail()
              this.getMenuTree()
              this.confirmLoading = false
            } else {
              this.$message.warning(res.msg)
            }
          })
        }
      })
    },
    add() {
      this.form.resetFields()
      if (this.selectedKeys.length < 1) {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            parentId: '-1'
          })
        })
      } else {
        this.$nextTick(() => {
          this.form.setFieldsValue({
            parentId: this.selectedKeys[0]
          })
        })
      }
    },
    deleteUser() {
      if (this.selectedKeys.length < 1) {
        this.$message.info('请先选择要删除的菜单项')
      } else {
        this.$confirm({
          title: '警告',
          content: `是否确认删除名称为 【${this.nodeData.name}】 的菜单项?`,
          okText: '确定',
          cancelText: '取消',
          onOk: () => {
            this.$api.admin.menuDelete(this.nodeData.id).then(res => {
              if (res.code === 0 && res.data) {
                // 删除成功
                this.$message.success('删除成功')
                this.getMenuTree()
              } else {
                this.$message.warning(res.msg || res.message)
              }
            })
          }
        })
      }
    },
    selectIcons() {
      if (!this.disabled) {
        this.iconChooseVisible = true
      }
    },
    handleIconChoose(value) {
      this.menuDetail.icon = value
      this.$nextTick(() => {
        this.form.setFieldsValue({
          icon: value
        })
      })
      this.iconChooseVisible = false
    },
    handleIconCancel() {
      this.iconChooseVisible = false
    },
    handleCancle() {
      // this.form.resetFields()
      this.disabled = true
    }
  }
}
</script>

<style lang="less"></style>
