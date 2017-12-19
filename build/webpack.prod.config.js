const HtmlWebpackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const webpack = require('webpack')

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: '酒龙仓',
			favicon: './favicon.png',
			template: './assets/template/index.ejs',
			// template: './assets/template/index-embed.ejs.html',
			// minify: {
			// 	removeComments: true,
			// 	collapseWhitespace: true
			// }
		}),
		new webpack.optimize.UglifyJsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('pro')
		}),
		new ManifestPlugin()
	],
}
