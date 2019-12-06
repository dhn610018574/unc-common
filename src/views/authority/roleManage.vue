<template>
  <div>
    <base-table
      :columns="columns"
      :data="data"
      :total="total"
      :pageSize="ipagination.pageSize"
      rowKey="roleId"
      :loading="loading"
      :bordered="true"
      @handleChange="handleChange"
    >
      <template #btn>
        <a-button slot="title" type="primary" icon="edit" @click="handleCRUD(0)">添加</a-button>
      </template>
      <template #actions="{data:{text,record}}">
        <a-button type="link" icon="zoom-in" size="small" @click="handleCRUD(1, record)">查看</a-button>
        <a-button type="link" icon="edit" size="small" @click="handleCRUD(2, record)">编辑</a-button>
        <a-button type="link" icon="delete" size="small" @click="handleCRUD(3, record)">删除</a-button>
        <a-button type="link" icon="plus" size="small" @click="handleCRUD(4, record)">权限</a-button>
      </template>
    </base-table>
    <role-action @refreshRole="refreshRole" ref="RoleAction"></role-action>
    <role-tree ref="RoleTree"></role-tree>
  </div>
</template>
<script>
import BaseTable from '@/components/tools/BaseTable'
import RoleAction from './modules/RoleAction'
import RoleTree from './modules/RoleTree'
const columns = [
  {
    title: '序号',
    dataIndex: 'roleId',
    align: 'center'
  },
  {
    title: '角色名称',
    dataIndex: 'roleName',
    align: 'center'
  },
  {
    title: '角色标识',
    dataIndex: 'roleCode',
    align: 'center'
  },
  {
    title: '角色描述',
    dataIndex: 'roleDesc',
    align: 'center'
  },
  {
    title: '数据权限',
    dataIndex: 'dsType',
    align: 'center',
    customRender: (t, r, i) => {
      switch (t) {
        case 0:
          return '全部'
        case 1:
          return '自定义'
        case 2:
          return '本级及子级'
        case 3:
          return '本级'
      }
    }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    align: 'center'
  },
  {
    title: '操作',
    dataIndex: 'actions',
    align: 'center',
    scopedSlots: { customRender: 'actions' }
  }
]
export default {
  name: 'roleManage',
  components: {
    BaseTable,
    RoleAction,
    RoleTree
  },
  data() {
    return {
      data: [],
      columns,
      total: 0,
      loading: true,
      ipagination: { current: 1, pageSize: 10 },
      visible: true
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      const { current, pageSize: size } = this.ipagination
      this.$api.role
        .getRole({ current, size })
        .then(res => {
          if (res && res.code === 0) {
            const { records, total } = res.data
            this.loading = false
            this.total = total
            this.data = records
          } else {
            this.$message.warning(res.msg || res.message)
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    // 分页改变
    handleChange(pagination) {
      this.ipagination = pagination
      this.initData()
    },
    // 添加 查看 编辑 删除 权限
    handleCRUD(type, record) {
      switch (type) {
        case 0:
        case 1:
        case 2:
          this.$refs.RoleAction.open(type, record)
          break
        case 3:
          this.deleteRole(record)
          break
        case 4:
          this.$refs.RoleTree.visible = true
          this.$refs.RoleTree.handlePermission(record.roleId)
          break
      }
    },
    // 新增和编辑之后刷新
    refreshRole() {
      this.initData()
    },
    deleteRole(record) {
      this.$confirm({
        title: '警告',
        content: `是否确认删除名称为 【${record.roleName}】 的数据项?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$api.role.delRole(record.roleId).then(res => {
            if (res.code === 0 && res.data) {
              // 删除成功
              this.initData()
            } else {
              this.$message.warning(res.msg || res.message)
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
