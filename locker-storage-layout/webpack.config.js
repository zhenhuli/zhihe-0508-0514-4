const path = require('path')
const { VueLoaderPlugin } = require('vue-loader')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const detect = require('detect-port')

module.exports = async (env, argv) => {
  const isDevelopment = argv.mode === 'development'
  
  const defaultPort = 8080
  const port = await detect(defaultPort)
  
  if (port !== defaultPort) {
    console.log(`端口 ${defaultPort} 被占用，使用端口 ${port}`)
  }

  return {
    entry: './src/main.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    devServer: {
      port: port,
      open: true,
      hot: true,
      static: {
        directory: path.join(__dirname, 'public')
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.scss$/,
          use: [
            'style-loader', 
            'css-loader', 
            {
              loader: 'sass-loader',
              options: {
                api: 'modern'
              }
            }
          ]
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          type: 'asset/resource'
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './public/index.html'
      })
    ],
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    }
  }
}
