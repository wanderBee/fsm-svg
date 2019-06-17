const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

module.exports = {
	mode: "development",

	entry: fs.readdirSync(__dirname).reduce((entries, dir) => {
		const fullDir = path.join(__dirname, dir);
		const entry = path.join(fullDir, "app.js");
		if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
			entries[dir] = ["webpack-hot-middleware/client", entry];
		}

		return entries;
	}, {}),

	output: {
		path: path.join(__dirname, "__build__"),
		filename: "[name].js",
		chunkFilename: "[id].chunk.js",
		publicPath: "/__build__/"
	},

	module: {
		rules: [
			{ test: /\.js$/, exclude: /node_modules/, use: ["babel-loader"] },
			{ test: /\.css$/, use: ["css-loader"] },
			{
				test: require.resolve("snapsvg/dist/snap.svg.js"),
				use: "imports-loader?this=>window,fix=>module.exports=0"
			}
		]
	},

	resolve: {
		alias: {
			"fsm.svg": path.resolve(__dirname, "../src/index.esm.js"),
			snapsvg: "snapsvg/dist/snap.svg.js",
			animejs: "animejs/lib/anime.esm.js"
		}
	},

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
					name: "shared",
					filename: "shared.js",
					chunks: "initial"
				}
			}
		}
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoEmitOnErrorsPlugin()
	]
};
