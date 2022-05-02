const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpg|gif|svg)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx"],
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    scrivito: "scrivito",
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "jr-customer-portal-sdk",
  },
  mode: "production",
};
