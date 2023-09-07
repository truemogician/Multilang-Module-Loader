import interpret from "interpret";
import rechoir from "rechoir";
import AsyncFs from "fs/promises";
import Path from "path";
import { pathToFileURL } from "url";

async function tryRequireThenImport<T = any>(module: string): Promise<T> {
	let result: any;
	try {
		result = require(module);
	} catch (error: any) {
		if (error?.code !== "ERR_REQUIRE_ESM")
			throw error;
		result = await import(pathToFileURL(module).href);
	}
	// For babel/typescript
	if (result && typeof result === "object" && "default" in result)
		result = result.default || {};
	return result || {};
}

const jsonExtensions = [".json", ".jsonc", ".json5"];
const yamlExtensions = [".yaml", ".yml"];

export default async function loadModule<T = any>(path: string): Promise<T> {
	const ext = Path.extname(path);
	if (jsonExtensions.includes(ext)) {
		const content = await AsyncFs.readFile(path, "utf-8");
		return JSON.parse(content);
	}
	if (yamlExtensions.includes(ext)) {
		const content = await AsyncFs.readFile(path, "utf-8");
		const YAML = await import("yaml");
		return YAML.parse(content);
	}
	if (!Object.keys(interpret.jsVariants).includes(ext))
		throw new Error(`Unsupported file type: ${ext}`);
	rechoir.prepare(interpret.jsVariants, path);
	return await tryRequireThenImport<T>(path);
}