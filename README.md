# Multilang Module Loader

### Description

This is a utility library that helps to dynamically load modules in Node.js and works fine with TypeScript.  
This library is primarily designed for configuration files, as it's a common practice to write configuration files in JavaScript or TypeScript.

### Supported Formats

|    Format    |           Extension           |
| :----------: | :---------------------------: |
|     JSON     |            `.json`            |
|    JSON5     |      `.json5`, `.jsonc`       |
|     YAML     |        `.yaml`, `.yml`        |
|  JavaScript  | `.js`, `.cjs`, `.mjs`, `.jsx` |
| CoffeeScript |    `.coffee`, `.litcoffee`    |
|  TypeScript  | `.ts`, `.cts`, `.mts`, `.tsx` |

For more detailed information, please refer to [interpret](https://github.com/gulpjs/interpret). This library uses `interpret` and `rechoir` to load script modules.

### Example

```ts
import loadModule from "multilang-module-loader";

// Construct the path to the module dynamically, e.g. by reading config files, scanning directories, making network requests, etc.
const modulePath = ...;
// Define the module type or import from somewhere. If not specified, the module will be loaded as `any`.
type ModuleType = ...;

// Load the module.
loadModule<ModuleType>(modulePath).then(module => {
	// Use the module.
	...
});
```

### Notes

If you're running a TypeScript source file using this library with `ts-node`, remember to apply appropriate `compilerOptions` to `ts-node`, e.g. as a common practice, it's likely that you import this library using `import` syntax. It's a ESM feature, so you need to specify this file as a ESM module or pass a TSConfig file with `esModuleInterop` enabled to `ts-node`.
