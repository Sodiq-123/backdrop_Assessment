import axios from "axios";
import envs from "../src/config/envs.config";

const listBanks = async (country: string) => {
  try {
    const { data } = await axios.get(
      `${envs.paystack.apiUrl}/bank?country=${country}`,
      {
        headers: {
          Authorization: `Bearer ${envs.paystack.secretKey}`,
        },
      }
    );
    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const verifyAccount = async (account_number: string, bank_code: string) => {
  try {
    const { data } = await axios.get(
      `${envs.paystack.apiUrl}/bank/resolve?account_number=${account_number}&bank_code=${bank_code}`,
      {
        headers: {
          Authorization: `Bearer ${envs.paystack.secretKey}`,
        },
      }
    );
    return data.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

export default { listBanks, verifyAccount };
