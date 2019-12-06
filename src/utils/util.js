import { validatenull } from '@/utils/validate'
import { axios } from '@/utils/request'
import avator from '@/assets/images/avator.jpg'
/**
 *加密处理
 */
export const encryption = params => {
  let { data, type, param, key } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      let data = result[ele]
      /* eslint-disable */
      key = CryptoJS.enc.Latin1.parse(key)
      let iv = key
      // 加密
      let encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.ZeroPadding
      })
      /* eslint-enable */
      result[ele] = encrypted.toString()
    })
  }
  return result
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000)
    .toString()
    .substr(0, len || 4)
  if (date) random = random + Date.now()
  return random
}

export function compare(propertyName) {
  return function(object1, object2) {
    var value1 = object1[propertyName]
    var value2 = object2[propertyName]
    if (value2 < value1) {
      return 1
    } else if (value2 > value1) {
      return -1
    } else {
      return 0
    }
  }
}

export const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

/**
 * 过滤对象中为空的属性
 * @param obj
 * @returns {*}
 */
export function filterObj(obj) {
  if (!(typeof obj === 'object')) {
    return
  }

  for (var key in obj) {
    if (obj.hasOwnProperty(key) && (obj[key] === null || obj[key] === undefined || obj[key] === '')) {
      delete obj[key]
    }
  }
  return obj
}

/**
 * 深度克隆对象、数组
 * @param obj 被克隆的对象
 * @return 克隆后的对象
 */
export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/**
 * 动态路由处理
 * @param data 后台返回的数据
 */
export function generateIndexRouter(data) {
  return [
    {
      path: '/',
      component: resolve => require(['@/components/layouts/TabLayout'], resolve),
      redirect: '/home',
      children: [
        {
          path: '/home',
          component: resolve => require(['@/views/home/index'], resolve)
        },
        ...generateChildRouters(data)
      ]
    },
    {
      path: '*',
      redirect: '/404',
      hidden: true
    },
    {
      path: '/404',
      hidden: true,
      component: resolve => require(['@/views/exception/404'], resolve)
    }
  ]
}

/**
 * 生成嵌套路由（子路由）
 * @param data
 */
function generateChildRouters(data) {
  if (!Array.isArray(data) || data.length < 1) {
    return []
  }
  const routers = []
  for (let item of data) {
    let component = ''
    if (item.component) {
      if (item.component.indexOf('layouts') >= 0) {
        component = 'components/' + item.component
      } else {
        component = 'views/' + item.component
      }
    } else {
      component = 'views/exception/404'
    }

    const menu = {
      path: item.path,
      name: item.name,
      component: resolve => require(['@/' + component + '.vue'], resolve),
      meta: {
        title: item.name,
        icon: item.icon,
        id: item.id,
        keepAlive: item.keepAlive === '0',
        parentId: item.parentId
      }
    }
    if (item.children && item.children.length > 0) {
      menu.children = [...generateChildRouters(item.children)]
    }

    routers.push(menu)
  }
  return routers
}

/**
 *  <img> <a> src 处理
 * @returns {PromiseLike<T | never> | Promise<T | never>}
 */
export function handleImg(url, id) {
  return validatenull(url)
    ? null
    : axios({
      url: url,
      method: 'get',
      responseType: 'blob'
    })
      .then(response => {
        // 处理返回的文件流
        const blob = response.data
        console.log(blob)
        const img = document.getElementById(id)
        img.src = URL.createObjectURL(blob)
        window.setTimeout(function() {
          window.URL.revokeObjectURL(blob)
        }, 0)
      })
      .catch(() => {
        const img = document.getElementById(id)
        img.src = avator
      })
}
