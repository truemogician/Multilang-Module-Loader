import interpret from "interpret";
import rechoir from "rechoir";
import AsyncFs from "fs/promises";
import Path from "path";
import { pathToFileURL } from "url";

declare var __non_webpack_require__: ((id: string) => any) | undefined;
const dynamicRequire = typeof __non_webpack_require__ === "function" ? __non_webpack_require__ : require;

async function tryRequireThenImport(module: string): Promise<any> {
	let result: any;
	try {
		result = dynamicRequire(module);
	} catch (error: any) {
		let importEsm: ((module: string) => Promise<{ default: any }>) | undefined;
		try {
			importEsm = new Function("id", "return import(id);") as any;
		} catch (e) {
			importEsm = undefined;
		}
		if (error.code === "ERR_REQUIRE_ESM" && importEsm) {
			const urlForConfig = pathToFileURL(module).href;
			result = (await importEsm(urlForConfig)).default;
			return result;
		}
		throw error;
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
	return await tryRequireThenImport(path);
}