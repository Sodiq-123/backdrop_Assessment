import { ApolloError } from "apollo-server-express";
import Errors from "../src/errors";
import { IUser } from "../src/models/user.model";

const ensureAuthorized = ({ user }: { user: IUser }) => {
  if (user.isVerified === false)
    throw new ApolloError(Errors.UNVERIFIED, "UNVERIFIED");
  if (!user) throw new ApolloError(Errors.UNAUTHORIZED, "UNAUTHORIZED");
};
export default ensureAuthorized;
