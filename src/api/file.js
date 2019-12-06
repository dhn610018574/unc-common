import { axios } from '@/utils/request'

// 文件下载
const fileDownLoad = function(url, filename, params) {
  return axios({ url, params, method: 'get', responseType: 'blob' }).then(res => {
    if (res instanceof Blob) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(res, filename)
      } else {
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(res)
        link.download = filename
        link.style.display = 'none'
        // 兼容火狐浏览器
        document.body.appendChild(link)
        const evt = document.createEvent('MouseEvents')
        evt.initEvent('click', false, false)
        link.dispatchEvent(evt)
        document.body.removeChild(link)
      }
    }
    return Promise.resolve()
  })
}
export default {
  fileDownLoad
}
