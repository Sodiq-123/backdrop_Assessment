import { ApolloServer } from "apollo-server-express";
import jwt from "jsonwebtoken";
import { Request } from "express";
import resolvers from "./resolver";
import typeDefs from "./schema";
import envs from "./config/envs.config";
import userModel, { IUser } from "./models/user.model";

export interface TokenData {
  id: string;
  email: string;
}

const gqlServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: { req: Request }) => {
    const headers = req.headers.authorization || "";
    const token = headers.split(" ")[1];
    if (!token) return { user: null };

    let user: IUser;
    try {
      const tokenData = jwt.verify(token, envs.jwt.secret) as TokenData;
      user = await userModel.findOne({ _id: tokenData?.id });
    } catch (error) {
      console.log("Error verifying request header token", error);
    }

    return { user };
  },
});

export default gqlServer;
