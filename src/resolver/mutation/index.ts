import fs from "fs";
import path from "path";

const mutations: any = {};

const folderPath = path.join(process.cwd(), "./dist/src/resolver/mutation");

fs.readdirSync(folderPath).forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const mutation = require(path.join(folderPath, file));
    const mutationName = file.split(".")[0];
    mutations[mutationName] = mutation.default;
  }
});

export default mutations;
