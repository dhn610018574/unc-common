import Vue from 'vue'
import userApi from '@/api/user'
import { ACCESS_TOKEN, USER_INFO } from '@/store/mutation-types'
import { encryption, generateIndexRouter } from '@/utils/util'
import menu from '@/api/admin'
const user = {
  state: {
    permissionList: [],
    menuList: []
  },
  mutations: {
    SET_PERMISSIONLIST(state, permissionList) {
      state.permissionList = permissionList
    },

    SET_MENU_LIST(state, menuList) {
      state.menuList = menuList
    }
  },
  actions: {
    // 获取菜单信息
    GetMenuList({ commit }) {
      return new Promise((resolve, reject) => {
        menu.getMenu().then(res => {
          const menuData = res.data || []
          if (!menuData.length) {
            resolve()
            return
          }

          const menus = generateIndexRouter(menuData)
          commit('SET_MENU_LIST', menus[0]['children'].slice(1))
          resolve(menus)
        })
      })
    },

    /** 获取用户信息 */
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        userApi
          .getUserInfo()
          .then(res => {
            const { sysUser, permissions, roles } = res.data
            Vue.ls.set(
              USER_INFO,
              {
                avatar: sysUser.avatar,
                deptId: sysUser.deptId,
                wxOpenid: sysUser.wxOpenid,
                oscId: sysUser.oscId,
                qqOpenid: sysUser.qqOpenid,
                giteeLogin: sysUser.giteeLogin,
                phone: sysUser.phone,
                userId: sysUser.userId,
                username: sysUser.username,
                roles: roles || []
              },
              24 * 60 * 60 * 1000
            )

            commit('SET_PERMISSIONLIST', permissions)
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },

    // 登出
    Logout() {
      return new Promise(resolve => {
        userApi
          .logout()
          .then(() => {
            Vue.ls.remove(ACCESS_TOKEN)
            Vue.ls.remove(USER_INFO)
            window.location.reload()
          })
          .finally(() => resolve())
      })
    },

    // 登录
    Login({ commit }, userInfo) {
      const user = encryption({ data: userInfo, key: 'pigxpigxpigxpigx', param: ['password'] })
      return new Promise((resolve, reject) => {
        userApi
          .login(user.username, user.password)
          .then(res => {
            Vue.ls.set(ACCESS_TOKEN, res.access_token, 24 * 60 * 60 * 1000)
            resolve(res)
            commit()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}

export default user
