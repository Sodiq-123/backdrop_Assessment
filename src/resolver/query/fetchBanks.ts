import paystack from "../../../utils/paystack";

interface IFetchBanksInput {
  country: string;
  page: number;
  perPage: number;
}

export default async function fetchBanks(
  parent: any,
  { country, page, perPage }: IFetchBanksInput
) {
  let data: any[];
  let count;
  try {
    data = await paystack.listBanks(country.toLowerCase());

    const pageNo = page || 1;
    const perPageNo = perPage || 10;
    const pageSkips = (pageNo - 1) * perPageNo;

    count = data.length;

    // sort banks by id
    data = data.sort((a: any, b: any) => a.id - b.id);

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
