import ensureAuthorized from "../../../utils/authorizer";
import { isWithinLevenshteinDistance } from "../../../utils/helpers";
import paystack from "../../../utils/paystack";
import bankAccountModel from "../../models/bankAccount.model";
import { capitalizeWords, getFirstAndLastName } from "../../../utils/helpers";
import { IUser } from "../../../src/models/user.model";

interface IAddBankAccountInput {
  account_number: string;
  account_name: string;
  bank_code: string;
}

interface IBankAccount {
  account_number: string;
  bank_code: string;
  account_name: string;
  is_verified: boolean;
  user: IUser;
}

export default async function addBankAccount(
  parent: any,
  { account_number, account_name, bank_code }: IAddBankAccountInput,
  context: any
) {
  ensureAuthorized(context);

  const { user } = context;

  let bankAccount: IBankAccount;

  try {
    const account = await paystack.verifyAccount(account_number, bank_code);
    const accountName = getFirstAndLastName(account.account_name);

    if (
      isWithinLevenshteinDistance(capitalizeWords(accountName), account_name)
    ) {
      bankAccount = await bankAccountModel.create({
        account_number,
        bank_code,
        account_name,
        user: user._id,
        is_verified: true,
      });
    } else {
      throw new Error("Account name does not match");
    }

    bankAccount.user = user;
    return bankAccount;
  } catch (error: any) {
    throw new Error(error.message);
  }
}
