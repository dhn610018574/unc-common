import { axios } from '@/utils/request'
/** 获取菜单树 */
const getDeptInfo = (id, method) => {
  return axios({
    url: `/admin/dept/${id}`,
    method
  })
}
/** 添加编辑部门 */
const addAndEditDept = (data, method) => {
  return axios({
    url: `/admin/dept`,
    method,
    data
  })
}

export default {
  getDeptInfo,
  addAndEditDept
}
