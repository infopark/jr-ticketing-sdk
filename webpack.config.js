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
    scrivito: "scrivito",
    "react-dom": "react-dom",
    lodash: "lodash",
    "date-fns": "date-fns",
    "date-fns/locale": "date-fns/locale",
    classnames: "classnames",
    "react-overlays": "react-overlays",
    "lodash-es": "lodash-es",
    axios: "axios",
    "react-router-dom": "react-router-dom",
    "html-react-parser": "html-react-parser",
    "sanitize-html": "sanitize-html",
    "react-bootstrap": "react-bootstrap",
    "uuid": "uuid",
    "@honeybadger-io/js": "@honeybadger-io/js",
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
