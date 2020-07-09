const path= require('path')
// const mode= process.env.NODE_ENV === 'development' ? 'deveopment' : 'production'
const isDev= process.env.NODE_ENV === 'development'
module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),//已多次提及的唯一入口文件
  output: {
    path: path.resolve(__dirname, "./lib/"),//打包后的文件存放的地方
    filename: isDev ? "index.dev.js" : 'index.min.js', //打包后输出文件的文件名
    libraryTarget: "umd", //配置模块导出（解决模块导入引用为空问题）
    library: "minsmap",
    // auxiliaryComment: "Test Comment"
  },
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /(\.jsx|\.js)$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  }
}