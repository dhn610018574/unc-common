<template>
  <a-modal
    class="modal-container"
    title="分配权限"
    width="40%"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <template slot="footer">
      <a-button type="primary" @click="handleOk">更新</a-button>
      <a-button @click="handleCancel">取消</a-button>
    </template>
    <a-tree
      v-if="treeData.length !== 0"
      checkable
      defaultExpandAll
      v-model="checkedKeys"
      @check="onCheck"
      :treeData="treeData"
      :replaceFields="replaceFields"
    />
  </a-modal>
</template>

<script>
export default {
  name: 'RoleTree',
  data() {
    return {
      visible: false,
      confirmLoading: false,

      checkedKeys: [],
      treeData: [],
      replaceFields: {
        children: 'children',
        title: 'name',
        key: 'id'
      },
      roleId: ''
    }
  },
  methods: {
    handlePermission(id) {
      this.roleId = id
      this.$api.admin
        .getMenuTree()
        .then(response => {
          this.treeData = response.data
          return this.$api.role.getRolePermission(id)
        })
        .then(response => {
          this.checkedKeysAndHalf = response.data
          const arr = []
          this.resolveAllEunuchNodeId(this.treeData, response.data, arr)
          this.checkedKeys = arr
        })
    },
    /**
     * 解析出所有的太监节点id
     * @param json 待解析的json串
     * @param idArr 原始节点数组
     * @param temp 临时存放节点id的数组
     * @return 太监节点id数组
     */
    resolveAllEunuchNodeId(json, idArr, temp) {
      for (let i = 0; i < json.length; i++) {
        const item = json[i]
        // 存在子节点，递归遍历;不存在子节点，将json的id添加到临时数组中
        if (item.children && item.children.length !== 0) {
          this.resolveAllEunuchNodeId(item.children, idArr, temp)
        } else {
          if (idArr.includes(item.id)) {
            temp.push(item.id)
          }
        }
      }
    },
    // 更新
    handleOk() {
      const roleId = this.roleId
      const menuIds = this.checkedKeysAndHalf.join(',')
      this.$api.role.updateRolePermission({ roleId, menuIds }).then(res => {
        if (res.code === 0 && res.data) {
          this.handleCancel()
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    handleCancel() {
      this.visible = false
      this.checkedKeys = []
    },
    onCheck(checkedKeys, info) {
      this.checkedKeys = checkedKeys
      this.checkedKeysAndHalf = [...checkedKeys, ...info.halfCheckedKeys]
    }
  }
}
</script>

<style lang="less">
.modal-container .ant-modal-body {
  max-height: 400px;
  overflow-y: auto;
}
</style>
