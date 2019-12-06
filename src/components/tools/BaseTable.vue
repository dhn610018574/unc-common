<template>
  <a-card style="margin-top: 15px;" :loading="loading" :bordered="false" :title="title">
    <div style="margin-bottom:20px;">
      <slot name="btn"></slot>
    </div>
    <a-table
      :rowKey="rowKey"
      :columns="columns"
      :dataSource="data"
      :bordered="bordered"
      :pagination="showPagination ? pagination : false"
      @change="handleTableChange"
    >
      <!-- <template
        v-for="item in columns"
        v-slot:[item.dataIndex]="text, record"
      > -->
      <template v-for="item in columns" :slot="item.dataIndex" slot-scope="text, record">
        <slot :name="item.dataIndex" :data="{ text, record }"></slot>
      </template>
    </a-table>
  </a-card>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      required: false,
      default: () => []
    },
    data: {
      type: Array,
      required: false,
      default: () => []
    },
    total: {
      type: Number,
      required: false,
      default: 0
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    bordered: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      required: false,
      default: ''
    },
    rowKey: {
      type: String,
      required: false,
      default: 'id'
    },
    showPagination: {
      type: Boolean,
      required: false,
      default: true
    },
    pageSize: {
      type: Number,
      required: false,
      default: 10
    }
  },
  watch: {
    total: {
      handler: function(val, oldVal) {
        this.pagination.total = val
      }
      // immediate: true
    },
    pageSize: {
      handler: function(val, oldVal) {
        this.pagination.pageSize = val
      }
      // immediate: true
    }
  },
  data() {
    return {
      pagination: {
        current: 1,
        pageSize: this.pageSize,
        total: this.total,
        pageSizeOptions: ['10', '20', '30', '40', '50', '100'],
        showTotal: (total, range) => {
          return range[0] + '-' + range[1] + ' 共' + this.total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  methods: {
    handleTableChange(pagination, filters, sorter) {
      this.pagination = pagination
      this.$emit('handleChange', pagination)
    }
  }
}
</script>

<style lang="less" scoped>
.ant-card /deep/ .ant-btn {
  margin-right: 10px;
}
</style>
