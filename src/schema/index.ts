import { readFileSync, readdirSync } from "fs";
import path from "path";
import { gql } from "apollo-server-express";

const getSchemaDefinition = (dirPath: string) => {
  const files = readdirSync(dirPath);
  const schemaDefinitions = files
    .filter((file) => file.endsWith(".graphql"))
    .map((file) => readFileSync(path.join(dirPath, file), "utf8"))
    .join("\n");
  return gql`
    ${schemaDefinitions}
  `;
};

export default getSchemaDefinition(path.join(process.cwd(), "./src/schema"));
