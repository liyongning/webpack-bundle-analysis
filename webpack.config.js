const path = require('path')

module.exports = {
  entry: './src/index.js',
  // 为了利于分析打包后的代码，这里选择开发模式
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js'
  }
}