const Pagination = {
  data() {
    return {
      resultList: [], // 返回结果
      loading: false, // table的loading
      pagination: {
        // 分页对象
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['10', '20', '50'],
        showTotal: total => {
          return ' 共' + total + '条'
        },
        showQuickJumper: true,
        showSizeChanger: true
      }
    }
  },
  mounted() {
    this.searchData()
  },
  methods: {
    searchBtn() {
      this.pagination.current = 1
      this.searchData()
    },
    handleTableChange(pagination) {
      this.pagination.current = pagination.current
      this.pagination.pageSize = pagination.pageSize
      this.searchData()
    }
  }
}

export default Pagination
