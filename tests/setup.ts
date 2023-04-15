import { IncomingMessage, Server } from "http";
import { connectDB } from "../src/config/mongo.config";
import createServer from "../src/server";

export interface ITestServer {
  data?: Server<typeof IncomingMessage>;
  error?: Error;
}
export const startTestServer = async (): Promise<ITestServer> => {
  const dbConnection = await connectDB();
  if (dbConnection.status === "error") {
    return {
      error: new Error("Could not connect to database"),
    };
  }
  try {
    const server = await createServer();
    server.listen({ port: 4000 }, () => {
      console.log("Test server started");
    });

    return {
      data: server,
    };
  } catch (error) {
    console.log(error);

    return {
      error,
    };
  }
};
