import { axios } from '@/utils/request'

// 获取用户信息
const getUserInfo = () => {
  return axios.get('/admin/user/info')
}

// 编辑用户信息
const userEdit = data => {
  return axios({
    url: '/admin/user/edit',
    method: 'put',
    data
  })
}

// 登出
const logout = () => {
  return axios({ url: '/auth/token/logout', method: 'delete' })
}

// 登录 开发环境时使用
const login = (username, password) => {
  const grantType = 'password'
  const scope = 'server'
  return axios({
    url: '/auth/oauth/token',
    headers: {
      Authorization: 'Basic dGVzdDp0ZXN0'
    },
    method: 'post',
    params: { username, password, grant_type: grantType, scope }
  })
}
export default {
  getUserInfo,
  logout,
  login,
  userEdit
}
