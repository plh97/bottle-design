const
	path = require("path"),
	merge = require('webpack-merge'),
	webpack = require('webpack'),
	devWebpackConfig = require('./build/webpack.dev.config'),
	prodWebpackConfig = require('./build/webpack.prod.config'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env)=> {
	let _path_ = path.resolve(
		'../../tool',
		'mall',
		'src',
		'main',
		'web',
		'static',
		'embed',
		'react-canvas'
	)
	console.log('NODE_ENV: ', env.NODE_ENV, _path_) // 'local'
	return merge(env.NODE_ENV == 'dev' ? devWebpackConfig : prodWebpackConfig, {
		entry: {
			'app': [
				'./src/client/index.jsx'
			],
			vender: [
				'mobx',
				'react',
				'mobx-react',
				'react-router',
				'react-router-dom'
			]
		},
		output: {
			filename: "[name].[hash].js",
			chunkFilename: '[name].[chunkhash].js',
			//打包到公司项目
			// path: _path_,
			//打包到dist
			path: path.join(__dirname, "dist"),
			publicPath: "/",
		},
		module: {
			rules: [
				{
					test: /(\.less|\.css)$/,
					// use: ExtractTextPlugin.extract({
					// 	fallback: 'style-loader',
					// 	use: ['css-loader', 'less-loader']
					// }),
					use:[ 'style-loader', 'css-loader',"less-loader" ]
				}, {
					test: /\.(png|svg|jpg|gif)$/,
					use: [
						'file-loader'
					]
				}, {
					test: /\.(js|jsx)$/,
					exclude: /(node_module|bower_components)/,
					loader: 'babel-loader'
					// },{
					//   test: /\.json$/,
					//   loader: 'json-loader'
				}, {
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					use: [
						'file-loader'
					]
				}
			]
		},
		plugins: [
			new CleanWebpackPlugin(['dist']),
			new webpack.optimize.CommonsChunkPlugin({
				name: "vender",
				minChunks: function (module) {
					return module.context && module.context.indexOf("node_modules") !== -1;
				},
				minChunks: Infinity,
			}),
			new ExtractTextPlugin({
				filename: 'index.[hash].css'
			})
		],
	})
}
