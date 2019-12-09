let url = ''
const _NODE_ENV = process.env.NODE_ENV
switch (_NODE_ENV) {
  case 'test':
    url = 'http://172.100.25.16:9523'
    break
  case 'production':
    url = 'http://172.100.25.16:9523'
    break
  default:
    url = 'http://172.100.25.16:9523'
    break
}

module.exports = {
  publicPath: './',
  lintOnSave: 'error',
  productionSourceMap: _NODE_ENV === 'production' ? false : true,
  configureWebpack: config => {},
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    port: 8899,
    hot: true,
    open: true,
    proxy: {
      '/admin': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/admin': '/admin'
        }
      },
      '/auth': {
        target: url,
        ws: true,
        pathRewrite: {
          '^/auth': '/auth'
        }
      }
    }
  }
}
