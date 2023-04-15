import fs from "fs";
import path from "path";

const queries: any = {};

const folderPath = path.join(process.cwd(), "./dist/src/resolver/query");

fs.readdirSync(folderPath).forEach((file) => {
  if (file !== "index.js" && file.endsWith(".js")) {
    const query = require(path.join(folderPath, file));
    const queryName = file.split(".")[0];
    queries[queryName] = query.default;
  }
});

export default queries;
