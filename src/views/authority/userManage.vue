<template>
  <div>
    <a-row :gutter="15" style="margin: 10px 0;">
      <a-col :span="5">
        <a-card :style="{ height: cardHeight }">
          <a-input placeholder="输入关键字进行过滤" style="width: 100%" @change="onSearch" />
          <a-tree
            :treeData="treeData"
            :selectedKeys="selectedKeys"
            @select="onSelect"
            @expand="onExpand"
            :expandedKeys="expandedKeys"
            :autoExpandParent="autoExpandParent"
          >
            <template slot="title" slot-scope="{ title }">
              <span v-if="title.indexOf(searchValue) > -1">
                {{ title.substr(0, title.indexOf(searchValue)) }}
                <span style="color: #f50">{{ searchValue }}</span>
                {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
              </span>
              <span v-else>{{ title }}</span>
            </template>
          </a-tree>
        </a-card>
      </a-col>
      <a-col :span="19">
        <a-card :style="{ height: cardHeight }">
          <base-table
            :columns="columns"
            :data="data"
            :total="total"
            :pageSize="ipagination.pageSize"
            rowKey="userId"
            :loading="loading"
            :bordered="true"
          >
            <template #roleList="{data:{text,record}}">
              <div v-for="(item, index) in text" :key="item.roleId">
                <a-tag v-if="index !== 0" color="blue" style="margin-top: 10px;">{{ item.roleName }}</a-tag>
                <a-tag v-else color="blue">{{ item.roleName }}</a-tag>
              </div>
            </template>
            <template #lockFlag="{data:{text,record}}">
              <a-tag v-if="text === '0'" color="blue">有效</a-tag>
              <a-tag v-else color="blue">锁定</a-tag>
            </template>
            <template #btn>
              <a-button slot="title" type="primary" icon="plus" @click="handleAction(0)">新增</a-button>
              <span style="float: right">
                用户名：<a-input
                  style="width: 200px;margin-right: 10px;"
                  placeholder="用户名"
                  v-model="userName"
                ></a-input>
                <a-button slot="title" type="primary" icon="search" @click="handleSearch">搜索</a-button>
                <a-button slot="title" icon="delete" @click="inputClear">清空</a-button>
              </span>
            </template>
            <template #actions="{data:{text,record}}">
              <a-button type="link" icon="edit" size="small" @click="handleAction(1, record)">编辑</a-button>
              <a-button type="link" icon="delete" size="small" @click="handleDelete(record)">删除</a-button>
            </template>
          </base-table>
        </a-card>
      </a-col>
    </a-row>
    <user-form ref="UserForm" @refreshUser="refreshUser"></user-form>
  </div>
</template>
<script>
import BaseTable from '@/components/tools/BaseTable'
import UserForm from './modules/userForm'

const columns = [
  {
    title: '序号',
    dataIndex: 'userId',
    align: 'center'
  },
  {
    title: '用户名',
    dataIndex: 'username',
    align: 'center'
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    align: 'center'
  },
  {
    title: '角色',
    dataIndex: 'roleList',
    align: 'center',
    scopedSlots: { customRender: 'roleList' }
  },
  {
    title: '状态',
    dataIndex: 'lockFlag',
    align: 'center',
    scopedSlots: { customRender: 'lockFlag' }
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
  name: 'userManage',
  components: {
    BaseTable,
    UserForm
  },
  data() {
    return {
      // 树
      treeData: [],
      autoExpandParent: true,
      expandedKeys: [],
      dataList: [],
      searchValue: '',
      selectedKeys: [],
      // table
      data: [],
      columns,
      total: 0,
      loading: true,
      ipagination: { current: 1, pageSize: 10 },
      // 传参
      deptId: '', // 树id
      userName: ''
    }
  },
  created() {
    let baseHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 80
    this.cardHeight = baseHeight + 'px'
  },
  mounted() {
    this.getTree()
    this.getUserList()
  },
  methods: {
    // 转换接口数据为antd格式
    deepClone(arr) {
      arr.forEach(element => {
        element.title = element.name
        element.key = element.id
        element.scopedSlots = { title: 'title' }
        if (element.children && element.children.length > 0) {
          this.deepClone(element.children)
        }
      })
      return arr
    },
    reWriterWithSlot(arr) {
      for (let item of arr) {
        if (item.children && item.children.length > 0) {
          this.reWriterWithSlot(item.children)
          let temp = Object.assign({}, item)
          temp.children = {}
          this.dataList.push(temp)
        } else {
          this.dataList.push(item)
        }
      }
    },
    getParentKey(currKey, treeData) {
      let parentKey
      for (let i = 0; i < treeData.length; i++) {
        const node = treeData[i]
        if (node.children) {
          if (node.children.some(item => item.key === currKey)) {
            parentKey = node.key
          } else if (this.getParentKey(currKey, node.children)) {
            parentKey = this.getParentKey(currKey, node.children)
          }
        }
      }
      return parentKey
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onSearch(e) {
      let value = e.target.value
      const expandedKeys = this.dataList
        .map(item => {
          if (item.title.indexOf(value) > -1) {
            return this.getParentKey(item.key, this.treeData)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)

      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    },
    onSelect(selectedKeys, info) {
      this.selectedKeys = selectedKeys
      this.deptId = selectedKeys[0]
      this.getUserList()
    },
    // 获取树数据
    getTree() {
      this.$api.userManage.getDeptTree().then(res => {
        if (res.code === 0) {
          this.treeData = this.deepClone(res.data)
          this.reWriterWithSlot(this.treeData)
        } else {
          this.$message.warning(res.msg || res.message)
        }
      })
    },
    getUserList() {
      const { current, pageSize: size } = this.ipagination
      this.$api.userManage
        .getUser({ current, size, deptId: this.deptId, username: this.userName })
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
      this.getUserList()
    },
    handleAction(type, record) {
      this.$refs.UserForm.open(type, record)
    },
    handleDelete(record) {
      this.$confirm({
        title: '警告',
        content: `是否确认删除用户名为 【${record.username}】 的数据项?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          this.$api.userManage.deleteUser(record.userId).then(res => {
            if (res.code === 0 && res.data) {
              // 删除成功
              this.$message.success('删除成功')
              this.getUserList()
            } else {
              this.$message.warning(res.msg || res.message)
            }
          })
        }
      })
    },
    handleSearch() {
      this.getUserList()
    },
    refreshUser() {
      this.getUserList()
    },
    inputClear() {
      this.userName = ''
      this.getUserList()
    }
  }
}
</script>

<style lang="less" scoped></style>
