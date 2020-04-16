module.exports = {
  mode: 'production',
  css: {
    loaderOptions: {
      sass: {
        prependData: `@import "@/style/_variables.scss";`
      }
    }
  }
};
