const HtmlWebPackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require("webpack").container;
const path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html",
  filename: "./index.html",
});

module.exports = {
  mode: "development",
  devServer: {
    static: path.join(__dirname, "dist"),
    port: 3020,
    historyApiFallback: {
      index: "/public/index.html",
    },
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader", // Transpile JavaScript avec Babel
        },
      },
      {
        test: /\.css$/,
        use: [
          "style-loader", // Injecte les styles dans le DOM
          "css-loader",
          "postcss-loader", // Traite le CSS avec PostCSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Gestion des fichiers images
        use: [
          {
            loader: "file-loader",
            options: {
              name: "images/[name].[ext]", // Stocke les images dans le dossier "images"
              outputPath: "images",
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg)$/, // Gestion des fichiers vidéo
        use: {
          loader: "file-loader",
          options: {
            name: "videos/[name].[hash].[ext]", // Stocke les vidéos dans "videos"
            outputPath: "videos",
          },
        },
      },
    ],
  },

  plugins: [
    htmlPlugin,
    new ModuleFederationPlugin({
      name: "ShellApplication",
      filename: "remoteEntry.js",
      remotes: {
        ShellApplication:
          "ShellApplication@http://localhost:3020/remoteEntry.js",
      },
    }),
  ],
};
