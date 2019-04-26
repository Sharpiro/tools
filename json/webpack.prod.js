 const merge = require('webpack-merge');
 const common = require('./webpack.common.js');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');

 module.exports = merge(common, {
   mode: 'production',
   plugins: [
    new HtmlWebpackPlugin({
        title: 'Output Management',
        template: 'src/index.html',
        favicon: "src/favicon.ico",
        inlineSource: '.(js|css|svg)$'
    }),
    new HtmlWebpackInlineSourcePlugin()
],
 });
