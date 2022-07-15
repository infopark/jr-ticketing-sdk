const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    index: "./src/index.ts",
    cssBundle: "./src/assets/stylesheets/main.scss",
  },
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
      {
        test: /\.s?css$/,
        use: [
          { loader: MiniCssExtractPlugin.loader },
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: "asset/resource",
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".tsx", ".scss"],
  },
  externals: {
    "@honeybadger-io/js": "@honeybadger-io/js",
    axios: "axios",
    classnames: "classnames",
    "date-fns": "date-fns",
    "date-fns/locale": "date-fns/locale",
    "html-react-parser": "html-react-parser",
    lodash: "lodash",
    "lodash-es": "lodash-es",
    history: "history",
    react: "react",
    "react-dom": "react-dom",
    "react-bootstrap": "react-bootstrap",
    "react-overlays": "react-overlays",
    "react-router": "react-router",
    "react-router-dom": "react-router-dom",
    "sanitize-html": "sanitize-html",
    scrivito: "scrivito",
    uuid: "uuid",
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
    }),
  ],
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: path.resolve(__dirname, "dist"),
    libraryTarget: "umd",
    library: "jr-customer-portal-sdk",
  },
  mode: "production",
};
