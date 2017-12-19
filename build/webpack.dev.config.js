const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')
const ManifestPlugin = require('webpack-manifest-plugin');

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: '酒龙仓',
			favicon: './favicon.png',
			template: './assets/template/index.ejs',
		}),
		new webpack.DefinePlugin({'process.env.NODE_ENV': JSON.stringify('dev')}),
		new ManifestPlugin()
	]
}
