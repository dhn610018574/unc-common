<template>
  <div class="depart-manage">
    <a-card :bordered="false">
      <template slot="title">
        <a-button type="primary" icon="plus" @click="add">添加</a-button>
        <a-button type="primary" icon="edit" style="margin:0 8px;" @click="edit">编辑</a-button>
        <a-button type="danger" icon="delete" ghost @click="delDept">删除</a-button>
      </template>
      <a-row :gutter="0">
        <a-col :span="8">
          <a-tree
            v-if="treeData.length !== 0"
            defaultExpandAll
            :treeData="treeData"
            :replaceFields="replaceFields"
            @select="onSelect"
          />
        </a-col>
        <a-col :span="16">
          <a-form :form="form" style="margin-top:30px;">
            <a-form-item
              v-for="(item, idx) in formItem"
              :key="idx"
              :label="item.label"
              :labelCol="labelCol"
              :wrapperCol="wrapperCol"
              v-show="item.show"
            >
              <a-input
                v-decorator="[item.keyWord, validatorRules[item.keyWord]]"
                :disabled="item.disabled"
                :placeholder="item.placeholder"
              ></a-input>
            </a-form-item>
            <a-form-item label :labelCol="labelCol" :wrapperCol="wrapperCol">
              <div style="margin-left:140px;" v-show="addBtn">
                <a-button type="primary" style="margin-right:8px;" @click="handleAdd">保存</a-button>
                <a-button @click="handleCancle">取消</a-button>
              </div>
              <div style="margin-left:140px;" v-show="editBtn">
                <a-button type="primary" style="margin-right:8px;" @click="updateDept">更新</a-button>
                <a-button @click="handleCancle">取消</a-button>
              </div>
            </a-form-item>
          </a-form>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>
<script>
import pick from 'lodash.pick'
export default {
  name: 'departmentManage',
  data() {
    return {
      treeData: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      disabled: true,
      form: this.$form.createForm(this),
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 12
      },
      validatorRules: {
        parentId: {
          rules: [{ required: true, message: '请输入父级节点' }]
        },
        deptId: {
          rules: [{ required: true, message: '请输入节点编号' }]
        },
        name: {
          rules: [{ required: true, message: '请输入部门名称' }]
        },
        sort: {
          rules: [{ required: true, message: '请输入排序' }]
        }
      },
      formItem: [
        {
          label: '父级节点',
          keyWord: 'parentId',
          disabled: true,
          show: true,
          placeholder: '请输入父级节点'
        },
        {
          label: '节点编号',
          keyWord: 'deptId',
          disabled: true,
          show: true,
          placeholder: '请输入节点编号'
        },
        {
          label: '部门名称',
          keyWord: 'name',
          disabled: true,
          show: true,
          placeholder: '请输入部门名称'
        },
        {
          label: '排序',
          keyWord: 'sort',
          disabled: true,
          show: true,
          placeholder: '请输入排序'
        }
      ],
      selectedKeys: [],
      addBtn: false,
      editBtn: false,
      currentSelect: {}
    }
  },
  created() {
    this.getTree()
  },
  methods: {
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
    // 查看组织详情
    getDeptInfo() {
      if (this.selectedKeys.length === 0) {
        return
      }
      this.$api.dept.getDeptInfo(this.selectedKeys, 'get').then(res => {
        if (res.code === 0) {
          this.currentSelect = res.data
          this.$nextTick(() => {
            this.form.setFieldsValue(pick(res.data, 'name', 'deptId', 'parentId', 'sort'))
          })
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    // 添加编辑切换form数据
    addEdit() {
      this.formItem.forEach(item => {
        if (item.keyWord === 'deptId') {
          item.show = false
        }
        if (item.keyWord === 'name') {
          item.disabled = false
        }
        if (item.keyWord === 'sort') {
          item.disabled = false
        }
      })
      this.editBtn = false
      this.addBtn = false
      this.validatorRules.deptId.rules[0].required = false
    },
    // 添加
    add() {
      const parentId = this.selectedKeys[0] || '0'
      this.addEdit()
      this.addBtn = true
      this.form.resetFields()
      this.form.setFieldsValue({
        parentId
      })
    },
    // 编辑
    edit() {
      if (!this.currentSelect.deptId) {
        this.$message.warning('请选择编辑的部门')
        return
      }
      this.addEdit()
      this.editBtn = true
    },
    // 保存新增
    handleAdd() {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.dept.addAndEditDept(values, 'post').then(res => {
            this.success(res)
          })
        }
      })
    },
    // 更新组织信息
    updateDept() {
      this.form.validateFields((err, values) => {
        if (!err) {
          const data = Object.assign(this.currentSelect, values)
          this.$api.dept.addAndEditDept(data, 'put').then(res => {
            this.success(res)
          })
        }
      })
    },
    // 删除组织
    delDept() {
      if (!this.currentSelect.deptId) {
        this.$message.warning('请选择要删除的部门')
        return
      }
      this.$confirm({
        title: '提示',
        content: '此操作将永久删除, 是否继续?',
        onOk: () => {
          this.$api.dept.getDeptInfo(this.currentSelect.deptId, 'delete').then(res => {
            this.success(res)
            this.form.resetFields()
            this.currentSelect = {}
            this.selectedKeys = []
          })
        }
      })
    },
    // 选择组织
    onSelect(selectedKeys) {
      this.selectedKeys = selectedKeys
      this.getDeptInfo()
    },
    success(res) {
      if (res.code === 0 && res.data) {
        this.getTree()
      } else {
        this.$message.warning(res.msg || res.message)
      }
    },
    handleCancle() {
      this.formItem.forEach(item => {
        if (item.keyWord === 'deptId') {
          item.show = true
        }
        if (item.keyWord === 'name') {
          item.disabled = true
        }
        if (item.keyWord === 'sort') {
          item.disabled = true
        }
      })
      this.editBtn = false
      this.addBtn = false
    }
  }
}
</script>

<style lang="less" scoped>
.depart-manage /deep/ .ant-tree li .ant-tree-node-content-wrapper {
  width: 100%;
}
.depart-manage /deep/ .ant-card-head {
  border: 0;
}
</style>
