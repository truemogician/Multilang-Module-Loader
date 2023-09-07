import path from "path";
import nodeExternals from "webpack-node-externals";
import tsconfig from "./tsconfig.json";
import type { Configuration } from "webpack";

const config: Configuration = {
	mode: "production",
	target: "node",
	externals: [nodeExternals()],
	entry: {
		index: path.resolve(__dirname, tsconfig.compilerOptions.rootDir, "index.ts")
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: [".ts", ".js", ".json"],
	},
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, tsconfig.compilerOptions.outDir),
		iife: false,
		clean: true
	},
	devtool: "source-map",
	optimization: {
		minimize: false
	}
};

export default config;