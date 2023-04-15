import envs from "./src/config/envs.config";
import { connectDB } from "./src/config/mongo.config";
import createServer from "./src/server";

export const startServer = async () => {
  const port = envs.port;
  try {
    const server = await createServer();
    server.listen({ port }, () => {
      connectDB();
      console.log(`🚀 Server ready at http://localhost:${port}/graphql`);
    });
  } catch (error) {
    console.log(error);
  }
};

startServer();
