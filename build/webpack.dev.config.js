const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
	plugins: [
		new HtmlWebpackPlugin({
			title: "酒龙仓",
			favicon: "./favicon.png",
			template: "./assets/template/index.ejs",
		})
	],
	mode: "development"
};
