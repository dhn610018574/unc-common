import { axios } from '@/utils/request'
/** 获取菜单 */
const getRole = params => {
  return axios({
    url: '/admin/role/page',
    method: 'get',
    params: {
      current: params.current,
      size: params.size
    }
  })
}
/** 增加及修改角色 */
const addRole = (data, method) => {
  return axios({
    url: '/admin/role',
    method,
    data
  })
}
/** 删除角色 */
const delRole = id => {
  return axios({
    url: `/admin/role/${id}`,
    method: 'delete'
  })
}
/** 角色权限 */
const getRolePermission = id => {
  return axios({
    url: `/admin/menu/tree/${id}`,
    method: 'get'
  })
}
const updateRolePermission = params => {
  return axios({
    url: '/admin/role/menu',
    method: 'put',
    params
  })
}
export default {
  getRole,
  addRole,
  delRole,
  getRolePermission,
  updateRolePermission
}
