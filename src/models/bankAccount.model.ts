import { Document, Schema, model } from "mongoose";
import { IUser } from "./user.model";

export interface IBankAccount extends Document {
  account_number: string;
  bank_code: string;
  account_name: string;
  is_verified: boolean;
  user: IUser;
}

const bankAccountSchema = new Schema<IBankAccount>({
  account_number: {
    type: String,
    required: true,
    unique: true,
  },
  bank_code: {
    type: String,
    required: true,
  },
  account_name: {
    type: String,
    required: true,
  },
  is_verified: {
    type: Boolean,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export default model<IBankAccount>("BankAccount", bankAccountSchema);
