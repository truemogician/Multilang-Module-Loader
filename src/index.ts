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

export default async function loadModule<T = any>(path: string): Promise<T> {
	const fileName = Path.basename(path).toLowerCase();
	const jsVariants = (await import("interpret")).jsVariants;
	if (Object.keys(jsVariants).some(ext => fileName.endsWith(ext))) {
		const rechoir = await import("rechoir");
		rechoir.prepare(jsVariants, path);
		return await tryRequireThenImport<T>(path);
	}
	const content = await AsyncFs.readFile(path, "utf-8");
	if (fileName.endsWith(".json"))
		return JSON.parse(content);
	if (fileName.endsWith(".json5") || fileName.endsWith(".jsonc")) {
		const JSON5 = await import("json5");
		return JSON5.parse(content);
	}
	if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
		const YAML = await import("yaml");
		return YAML.parse(content);
	}
	throw new Error(`Unsupported file type: ${fileName}`);
}