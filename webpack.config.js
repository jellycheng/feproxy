const path = require('path');
module.exports = {
  mode: 'production',	
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  devServer: {
    static: path.join(__dirname, 'public'),
    compress: true,
    port: 9000
  }
};
