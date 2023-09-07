import Path from "path";
import loadModule from "../dist";

console.log("Using webpack.config.ts as test module...");
loadModule(Path.resolve(__dirname, "../webpack.config.ts"))
	.then(config => {
		console.log("TypeScript module loaded successfully!");
		console.log(config);
	})
	.catch(err => console.error(err));