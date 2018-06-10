const
	path = require("path"),
	merge = require("webpack-merge"),
	devWebpackConfig = require("./build/webpack.dev.config"),
	prodWebpackConfig = require("./build/webpack.prod.config"),
	ExtractTextPlugin = require("extract-text-webpack-plugin"),
	CleanWebpackPlugin = require("clean-webpack-plugin");


const resolve = dir => path.join(__dirname, "..", dir);

module.exports = env => merge(env.NODE_ENV == "dev" ? devWebpackConfig : prodWebpackConfig, {
	context: __dirname,
	resolve: {
		extensions: [".js", ".jsx", ".json"],
		alias: {
			"@": resolve("src"),
		},
	},
	entry: {
		"app": [
			"./src/client/index.jsx"
		],
		vender: [
			"react",
			"mobx",
			"mobx-react",
			"three"
		]
	},
	output: {
		filename: "[name].[hash].js",
		chunkFilename: "[name].[chunkhash].js",
		path: path.join(__dirname, "dist"),
		publicPath: "/canvas",
	},
	module: {
		rules: [
			{
				test: /(\.less|\.css)$/,
				use: ExtractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader", "less-loader"]
				}),
				// use:[ "style-loader", "css-loader","less-loader" ]
			}, {
				test: /\.(png|svg|jpg|gif)$/,
				use: [
					"file-loader"
				]
			}, {
				test: /\.(js|jsx)$/,
				exclude: /(node_module|bower_components)/,
				loader: "babel-loader"
			}, {
				test: /\.(woff|woff2|eot|ttf|otf)$/,
				use: [
					"file-loader"
				]
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(["dist"]),
		new ExtractTextPlugin({
			filename: "index.[hash].css"
		})
	],
	optimization: {
		splitChunks: {
			cacheGroups: {
				commons: {
					name: "vender",
					chunks: "initial",
					minChunks: 2
				}
			}
		}
	}
});
