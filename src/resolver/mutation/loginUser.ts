import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import userModel from "../../models/user.model";
import envs from "../../config/envs.config";

interface ILoginUserInput {
  email: string;
  password: string;
}

export default async function loginUser(
  _: any,
  { email, password }: ILoginUserInput
) {
  try {
    email = email.toLowerCase();
    const user = await userModel.findOne({ email, isVerified: true });

    if (!user) throw new Error("Invalid email or password");

    // compare password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) throw new Error("Invalid email or password");

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
      },
      envs.jwt.secret,
      {
        expiresIn: envs.jwt.expiration,
      }
    );

    return { user, token };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
