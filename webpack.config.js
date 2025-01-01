const path = require('path')

const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

module.exports = {
  entry: {
    content: {
      import: './src/content/index.ts',
      layer: 'html',
    },
    'content.preact': {
      import: './src/content/index.preact.tsx',
      layer: 'preact',
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
        oneOf: [
          {
            issuerLayer: 'html',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: 'diff-image-ext__[local]-[hash:base64:5]',
                  },
                },
              },
              'postcss-loader',
            ],
          },
          {
            issuerLayer: 'preact',
            use: [{ loader: 'css-loader' }],
          },
        ],
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
  experiments: {
    layers: true,
  },
}
