const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// Please use the same version that is also used by the transpiler (e.g. "target" of tsconfig)
const ecmascriptTarget = 'es2015';

module.exports = {
  cache: true,
  node: false,
  target: ['web', ecmascriptTarget],
  entry: {
    index: "./src/index.ts",
    ScrivitoExtensions: "./src/Components/ScrivitoExtensions/index.ts",
    ScrivitoEditing: "./src/ScrivitoEditing/index.ts",
    // cssBundle: "./src/assets/stylesheets/main.scss",
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
    react: "react",
    "react-dom": "react-dom",
    "react-bootstrap": "react-bootstrap",
    "react-overlays": "react-overlays",
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
    library: "jr-ticketing-sdk",
    globalObject: "this",
  },
  mode: "production",
};
