const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
	entry: {
		index: path.resolve(__dirname, 'src/index.tsx'),
		another: path.resolve(__dirname, 'src/RaiderIoApi.tsx'),
		additional: path.resolve(__dirname, 'src/rioColors.tsx'),
	},
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: '[name].bundle.js',
		// assetModuleFilename: "assets/img/[name][ext]",
		clean: true,
	},
	// devtool: 'inline-source-map', // devtool: 'inline-source-map' выключать если продакшн!!!
	mode: 'production', // production or development не забыть выключить new ReactRefreshWebpackPlugin() и devtool: "inline-source-map"
	module: {
		rules: [
			{
				test: /\.(tsx)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript'],
					},
				},
			},
			{
				test: /\.css$/i,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(csv|tsv)$/i,
				use: ['csv-loader'],
			},
			{
				test: /\.xml$/i,
				use: ['xml-loader'],
			},
		],
	},
	resolve: {
		extensions: ['*', '.js', '.jsx', '.tsx', '.ts'],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'webpack Boilerplate',
			template: path.resolve(__dirname, './src/template.html'), // шаблон
			filename: 'index.html', // название выходного файла
		}),
		// new ReactRefreshWebpackPlugin(), // new ReactRefreshWebpackPlugin() ВЫКЛЮЧИТЬ ЕСЛИ ПРОДАКШН
	],
	devServer: {
		static: path.resolve(__dirname, 'dist'),
		port: 5001, // default is often 8080
		open: true,
		hot: true,
		watchFiles: [path.resolve(__dirname, 'src')],
		historyApiFallback: true,
	},
};
