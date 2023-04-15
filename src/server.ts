import http from "http";
import express, { Application } from "express";
import gqlServer from "./apollo";
import cors from "../src/config/cors.config";

const createServer = async () => {
  const app: Application = express();

  app.use(express.json({ limit: "5mb" }));
  app.use(express.urlencoded({ limit: "5mb", extended: true }));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", cors.origins);
    res.header("Access-Control-Allow-Headers", cors.headers);
    if (req.method === "OPTIONS") {
      // preflight request
      res.header("Access-Control-Allow-Methods", cors.methods);
      return res.status(200).json({});
    }

    next();
  });

  await gqlServer.start();
  gqlServer.applyMiddleware({ app, path: "/graphql" });

  const httpServer = http.createServer(app);
  return httpServer;
};

export default createServer;
