const HtmlWebPackPlugin = require("html-webpack-plugin");
const { ModuleFederationPlugin } = require('webpack').container;
const path = require("path");

const htmlPlugin = new HtmlWebPackPlugin({
    template: "./public/index.html",
    filename: "./index.html",
});

module.exports = {
  mode: 'development', 
  devServer: {
    static: path.join(__dirname, 'dist'),
    port: 3015,
    historyApiFallback: {
        index: '/public/index.html',
    },
  },
  
  module: {
    rules: [
      {
        test: /\.js$/, 
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Utilise babel-loader pour transpiler le JavaScript
        },
      },
      // Ajoutez cette règle pour les fichiers CSS
      {
        test: /\.css$/, // Applique cette règle aux fichiers .css
        use: [
          'style-loader', // Injecte les styles dans le DOM
          'css-loader', 
          'postcss-loader'  // Traduit CSS en CommonJS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i, // Regex pour les fichiers image
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]', // Nom du fichier de sortie
              outputPath: 'images', // Dossier de sortie pour les images
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
        name: 'blogs',
        filename: "remoteEntry.js",
        remotes: {
          blogs: "blogs@http://localhost:3015/remoteEntry.js"
        }
    })
  ]
};