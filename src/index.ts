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

const json5Extensions = [".json5", ".jsonc"];
const yamlExtensions = [".yaml", ".yml"];
const jsExtensions = Object.keys(interpret.jsVariants);

export default async function loadModule<T = any>(path: string): Promise<T> {
	const ext = Path.extname(path);
	if (jsExtensions.includes(ext)) {
		rechoir.prepare(interpret.jsVariants, path);
		return await tryRequireThenImport<T>(path);
	}
	const content = await AsyncFs.readFile(path, "utf-8");
	if (ext == ".json")
		return JSON.parse(content);
	if (json5Extensions.includes(ext)) {
		const JSON5 = await import("json5");
		return JSON5.parse(content);
	}
	if (yamlExtensions.includes(ext)) {
		const YAML = await import("yaml");
		return YAML.parse(content);
	}
	throw new Error(`Unsupported file type: ${ext}`);
}