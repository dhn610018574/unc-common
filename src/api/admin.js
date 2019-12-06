import { axios } from '@/utils/request'

/** 获取菜单 */
const getMenu = () => {
  return axios({
    url: '/admin/menu',
    method: 'get',
    params: { type: 'left' }
  })
}
/** 获取菜单树 */
const getMenuTree = () => {
  return axios({
    url: '/admin/menu/tree',
    method: 'get'
  })
}
/** 获取组织树 */
const getDeptTree = () => {
  return axios({
    url: '/admin/dept/tree',
    method: 'get'
  })
}
/** 获取菜单详细信息 */
const getDeptDetail = id => {
  return axios({
    url: `/admin/menu/${id}`,
    method: 'get'
  })
}
/** 新增编辑菜单 */
const menuAction = (data, method) => {
  return axios({
    url: '/admin/menu',
    method: method,
    data
  })
}
/** 删除菜单 */
const menuDelete = id => {
  return axios({
    url: '/admin/menu/' + id,
    method: 'delete'
  })
}
export default {
  getMenu,
  getMenuTree,
  getDeptTree,
  getDeptDetail,
  menuAction,
  menuDelete
}
