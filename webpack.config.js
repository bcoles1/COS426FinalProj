const path = require('path');
const pkg = require('./package.json');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const buildPath = './build/';

module.exports = {
  entry: ['./src/app.js'],
  output: {
    path: path.join(__dirname, buildPath),
    filename: '[name].[hash].js',
    publicPath: `/${pkg.repository}/`,
  },
  target: 'web',
  devtool: 'source-map',
  stats: {
    warnings: false
  },
  module: {
    rules: [{
        test: /\.js$/,
        use: 'babel-loader',
        exclude: path.resolve(__dirname, './node_modules/'),
      },
      {
        test: /\.(mtl)$/i,
        use: path.resolve('plugins/mtl-loader.js'),
        exclude: path.resolve(__dirname, './node_modules/'),
      },
      {
        test: /\.(jpe?g|png|gif|svg|tga|gltf|glb|babylon|pcb|pcd|prwm|obj|mat|mp3|ogg)$/i,
        use: 'file-loader',
        exclude: path.resolve(__dirname, './node_modules/'),
      },
      {
        test: /\.(vert|frag|glsl|shader|txt)$/i,
        use: 'raw-loader',
        exclude: path.resolve(__dirname, './node_modules/'),
      },
      {
        test: /\.(bin)$/i,
        exclude: path.resolve(__dirname, './node_modules/'),
        use: [
          {
            loader: 'url-loader',
             options: {
               encoding: false,
               mimetype: false,
               generator: (content) => {
                 return content;
               }
             },
           },
         ],
      },
    ],
  },
  resolve: {
    alias: {
      lights$: path.resolve(__dirname, 'src/components/lights'),
      objects$: path.resolve(__dirname, 'src/components/objects'),
      scenes$: path.resolve(__dirname, 'src/components/scenes'),
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: pkg.title,
      favicon: 'src/favicon.ico',
      template: 'src/index.html'
    }),
    new CopyPlugin([
      {
          from: 'src/ctqo.gif',
          to: 'ctqo.gif',
      },
      {
          from: 'src/win.gif',
          to: 'win.gif',
      },
      {
        from: 'src/components/objects/Stand/Standscene.bin',
        to: 'Standscene.bin',
      },
      {
        from: 'src/components/objects/Stand/Dellis_American_Oak_Tar_1_baseColor.jpeg',
        to: 'Dellis_American_Oak_Tar_1_baseColor.jpeg',
      },
      {
        from: 'src/components/objects/Road/Jezdnia_Kraweznik_MAT_baseColor.jpg',
        to: 'Jezdnia_Kraweznik_MAT_baseColor.jpg',
      },
      {
        from: 'src/components/objects/Road/Jezdnia_Kraweznik_MAT_normal.png',
        to: 'Jezdnia_Kraweznik_MAT_normal.png',
      },
      {
        from: 'src/components/objects/Road/Roadscene.bin',
        to: 'Roadscene.bin',
      },
      {
        from: 'src/components/objects/Tree/Treescene.bin',
        to: 'Treescene.bin',
      },
      {
      from: 'src/components/objects/Nature/Naturescene.bin',
      to: 'Naturescene.bin',
      },
      {
        from: 'src/components/objects/Goal/Goalscene.bin',
        to: 'Goalscene.bin',
      },
      {
        from: 'src/components/objects/Goal/Metal_baseColor.png',
        to: 'Metal_baseColor.png',
      },
      {
        from: 'src/components/objects/Goal/Metal_0_baseColor.png',
        to: 'Metal_0_baseColor.png',
      },
  ]),
  ],
};