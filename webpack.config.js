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
    "@honeybadger-io/js": "@honeybadger-io/js",
    axios: "axios",
    classnames: "classnames",
    "date-fns": "date-fns",
    "date-fns/locale": "date-fns/locale",
    "html-react-parser": "html-react-parser",
    lodash: "lodash",
    "lodash-es": "lodash-es",
    react: "react",
    "react-dom": "react-dom",
    "react-bootstrap": "react-bootstrap",
    "react-overlays": "react-overlays",        
    "react-router": "react-router",
    "react-router-dom": "react-router-dom",
    "sanitize-html": "sanitize-html",
    scrivito: "scrivito",
    "uuid": "uuid",
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
