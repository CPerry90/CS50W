const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: "./src/volunteercenter/index.js",
  output: {
    path: path.resolve(__dirname, "./static/volunteercenter"),
    filename: "[name].js",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
    ],
  },
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
        // This has effect on the react lib size
        NODE_ENV: JSON.stringify("production"),
    }),
  ],
};