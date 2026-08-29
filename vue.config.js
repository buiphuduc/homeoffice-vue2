const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: '/', // đổi thành './' nếu deploy vào thư mục con của domain
  productionSourceMap: false
})
