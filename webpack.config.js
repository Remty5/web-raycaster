const PnpWebpackPlugin = require(`pnp-webpack-plugin`);
const path = require('path');

module.exports = {
	// PnP plugin and typescript integration
	resolve: {
		plugins: [PnpWebpackPlugin],
		extensions: ['.tsx', '.ts', '.js'],
	},
	resolveLoader: {
		plugins: [PnpWebpackPlugin.moduleLoader(module)],
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	// Configs
	entry: './src/app/js/main.ts',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist/app/js'),
	},
	mode: 'development',
	devtool: 'inline-source-map',
};
