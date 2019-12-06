import { axios } from '@/utils/request'

/** 获取用户tree */
const getDeptTree = (query) => {
  return axios({
    url: '/admin/dept/tree',
    method: 'get',
    params: query
  })
}
/** 获取角色下拉框 */
const getRoleList = () => {
  return axios({
    url: '/admin/role/list',
    method: 'get'
  })
}
/** 获取用户table */
const getUser = params => {
  return axios({
    url: '/admin/user/page',
    method: 'get',
    params: {
      current: params.current,
      size: params.size,
      deptId: params.deptId,
      username: params.username
    }
  })
}
/** 新增修改用户 */
const userAction = (data, method) => {
  return axios({
    url: '/admin/user',
    method: method,
    data
  })
}
/** 删除用户 */
const deleteUser = id => {
  return axios({
    url: '/admin/user/' + id,
    method: 'delete'
  })
}
export default {
  getDeptTree,
  getUser,
  deleteUser,
  getRoleList,
  userAction
}
