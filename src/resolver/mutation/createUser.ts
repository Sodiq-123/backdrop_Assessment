import bcrypt from "bcrypt";
import { capitalizeWords } from "../../../utils/helpers";
import userModel from "../../models/user.model";

interface ICreateUserInput {
  surname: string;
  firstname: string;
  email: string;
  password: string;
}

export default async function createUser(
  _: any,
  { surname, firstname, email, password }: ICreateUserInput
) {
  try {
    email = email.toLowerCase();
    const userExist = await userModel.findOne({ email });
    if (userExist) throw new Error("User already exist");

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      fullname: capitalizeWords(`${surname} ${firstname}`),
      email,
      password: passwordHash,
      isVerified: true,
    });

    return user;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
