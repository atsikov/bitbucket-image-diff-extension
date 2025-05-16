const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  entry: {
    content: {
      import: './src/content/index.preact.tsx',
    },
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        use: [
          {
            loader: '@wyw-in-js/webpack-loader',
            options: {
              babelOptions: {
                presets: ['@babel/preset-typescript'],
              },
            },
          },
          'ts-loader',
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(pcss|css)$/,
        loader: MiniCssExtractPlugin.loader,
      },
      {
        test: /\.(pcss|css)$/,
        use: [{ loader: 'css-loader' }],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
      'react/jsx-runtime': 'preact/jsx-runtime',
    },
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    minimizer: [`...`, new CssMinimizerPlugin()],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    }),
    new CopyPlugin({
      patterns: [{ from: 'static' }],
    }),
  ],
}
