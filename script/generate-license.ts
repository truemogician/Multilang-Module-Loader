import FileSystem from "fs";
import Path from "path";
import packageInfo from "../package.json";

const licenseTemplate = FileSystem
	.readFileSync(Path.join(__dirname, "../template/LICENSE.template"))
	.toString("utf-8");
const license = licenseTemplate
	.replace("{{current_year}}", new Date().getFullYear().toString())
	.replace("{{author}}", packageInfo.author.name)
	.replace("{{email}}", packageInfo.author.email);
FileSystem.writeFileSync(Path.join(__dirname, "../LICENSE"), license, "utf-8");