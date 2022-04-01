module.exports = {
  assetsDir: "assets",
  transpileDependencies: ['vuetify'],
  css: {
    loaderOptions: {
      sass: {
        additionalData: '@import "~@/styles/variables.scss"',
      },
      scss: {
        additionalData: '@import "~@/styles/variables.scss";',
      },
    },
  },
  pages: {
    index: {
      entry: "./src/main.js",
      title: "在线学车预约系统",
    },
  },
  devServer: {
    disableHostCheck: true,
    https: false,
    port: 808,
    proxy: {
      "/devApi/": {
        target: "http://localhost:9006/",
        changeOrigin: true,
        pathRewrite: {
          "^/devApi/": "",
        },
      },
      "/prodApi/": {
        //target: 'http://121.196.153.82:8080/',
        target: "http://localhost:9006/",
        changeOrigin: true,
        pathRewrite: {
          "^/prodApi/": "",
        },
      }
    },
  },
  productionSourceMap: false,
};
