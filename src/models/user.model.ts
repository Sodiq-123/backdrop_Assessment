import { Document, Schema, model } from "mongoose";
import { IBankAccount } from "./bankAccount.model";

export interface IUser extends Document {
  fullname: string;
  email: string;
  password: string;
  isVerified: boolean;
  bank_accounts: IBankAccount[];
}

const userSchema = new Schema<IUser>({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

export default model<IUser>("User", userSchema);
