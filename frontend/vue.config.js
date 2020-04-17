module.exports = {
  configureWebpack: {
    mode: 'production'
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/_variables.scss";`
      }
    }
  },
  productionSourceMap: false
};
