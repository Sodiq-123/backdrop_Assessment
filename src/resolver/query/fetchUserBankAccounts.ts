import ensureAuthorized from "../../../utils/authorizer";
import bankAccountModel from "../../models/bankAccount.model";

interface IFetchUserBankAccountsInput {
  page: number;
  perPage: number;
}

export default async function fetchUserBankAccounts(
  parent: any,
  { page, perPage }: IFetchUserBankAccountsInput,
  context: any
) {
  ensureAuthorized(context);

  const { user } = context;

  const pageNo = page || 1;
  const perPageNo = perPage || 10;
  const pageSkips = (pageNo - 1) * perPageNo;

  let data;
  let count: number;

  try {
    data = await bankAccountModel
      .find({
        user: user._id,
        is_verified: true,
      })
      .sort({ createdAt: -1 })
      .populate("user");

    count = data.length;

    data = data.slice(pageSkips, pageSkips + perPageNo);

    const fetchedPage = page * perPage;
    const pageLeft = count - fetchedPage;
    const hasNextPage = pageLeft > 0;

    return {
      data,
      pagination: {
        count,
        hasNextPage,
      },
    };
  } catch (error: any) {
    throw new Error(error.message);
  }
}
