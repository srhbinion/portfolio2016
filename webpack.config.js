//const Webpack = require('webpack');
// TODO: what is the diff webpack vs webpack-dev-server

module.exports = {
  entry: {
    jsPage:'./src/scripts/main.js'
  },
  mode: 'development',
  output: {
    filename: './jsbundle.js'
  },
  watch: true
};
