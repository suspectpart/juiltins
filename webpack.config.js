const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: './src/juiltins.js',
  bail: true,
  mode: "production",
  output: {
    filename: 'juiltins.bundle.js',
    path: path.resolve(__dirname, 'dist'),
    libraryTarget: "global"
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {},
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: true,
          keep_fnames: false,
          safari10: false,
        },
      }),
    ],
  },
};