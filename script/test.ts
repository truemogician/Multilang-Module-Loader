import loadModule from "../dist";

const testModule = {
	path: __filename,
	sayHello: () => console.log("TypeScript module loaded successfully!"),
	loadModule
};

export default testModule;

console.log("Using the test script itself as a module to test TypeScript module loading.");
loadModule<typeof testModule>(__filename)
	.then(module => {
		module.sayHello();
		console.log(module);
	}, console.error);