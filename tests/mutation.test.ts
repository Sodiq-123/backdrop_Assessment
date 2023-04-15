import { expect } from "chai";
import { Server } from "http";
import request from "superagent";
import jwt from "jsonwebtoken";
import { faker } from "@faker-js/faker";
import envs from "../src/config/envs.config";
import paystack from "../utils/paystack";
import { clearDB } from "../src/config/mongo.config";
import { startTestServer } from "./setup";
import { TokenData } from "../src/apollo";

const url = `http://localhost:${envs.port}/graphql`;
let server: Server;
const user = {
  email: faker.internet.email(),
  firstname: faker.name.firstName(),
  surname: faker.name.lastName(),
  password: faker.internet.password(),
};

beforeAll(async () => {
  const serverRes = await startTestServer();
  if (serverRes.error) {
    throw new Error("Could not start test server");
  }
  if (serverRes.data) {
    console.log("Test server started");
    server = serverRes.data;
  }
});

afterAll(async () => {
  console.log("Clearing database");
  await clearDB();
  if (server) {
    console.log("Closing server");
    server.close();
  }
});

describe("Tests", () => {
  describe("Mutations", () => {
    it("should create a user", async () => {
      const response = await request.post(url).send({
        query: `
          mutation CreateUser($surname: String!, $firstname: String!, $email: String!, $password: String!) {
            createUser(surname: $surname, firstname: $firstname, email: $email, password: $password) {
                email
                fullname
                id
                isVerified
              }
            }
          `,
        variables: {
          email: user.email,
          firstname: user.firstname,
          surname: user.surname,
          password: user.password,
        },
      });

      expect(response.status).to.equal(200);
      expect(response.body.data.createUser.id).to.be.a("string");
      expect(response.body.data.createUser.email).to.equal(
        user.email.toLowerCase()
      );
      expect(response.body.data.createUser.fullname).to.equal(
        `${user.surname} ${user.firstname}`
      );
      expect(response.body.data.createUser.isVerified).to.be.true;
    });

    it("should not create a user with an existing email", async () => {
      const response = await request.post(url).send({
        query: `
          mutation CreateUser($surname: String!, $firstname: String!, $email: String!, $password: String!) {
            createUser(surname: $surname, firstname: $firstname, email: $email, password: $password) {
                email
                fullname
                id
                isVerified
              }
            }
          `,
        variables: {
          email: user.email,
          firstname: user.firstname,
          surname: user.surname,
          password: user.password,
        },
      });

      expect(response.status).to.equal(200);
      expect(response.body.errors[0].message).to.equal("User already exist");
    });

    it("should login a user", async () => {
      const response = await request.post(url).send({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
                user {
                  email
                  fullname
                  id
                }
              }
            }
          `,
        variables: {
          email: user.email,
          password: user.password,
        },
      });

      const token = response.body.data.loginUser.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET) as TokenData;

      expect(response.status).to.equal(200);
      expect(response.body.data.loginUser.user.email).to.equal(
        user.email.toLowerCase()
      );
      expect(response.body.data.loginUser.user.fullname).to.equal(
        `${user.surname} ${user.firstname}`
      );
      expect(response.body.data.loginUser.user.id).to.be.a("string");
      expect(decoded.email).to.equal(user.email.toLowerCase());
      expect(decoded.id).to.be.a("string");
    });

    it("should not login a user with an invalid email", async () => {
      const response = await request.post(url).send({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
                user {
                  email
                  fullname
                  id
                }
              }
            }
          `,
        variables: {
          email: faker.internet.email(),
          password: faker.internet.password(),
        },
      });

      expect(response.status).to.equal(200);
      expect(response.body.errors[0].message).to.equal(
        "Invalid email or password"
      );
    });

    it("should not login a user with an invalid password", async () => {
      const response = await request.post(url).send({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
                user {
                  email
                  fullname
                  id
                }
              }
            }
          `,
        variables: {
          email: user.email,
          password: faker.internet.password(),
        },
      });

      expect(response.status).to.equal(200);
      expect(response.body.errors[0].message).to.equal(
        "Invalid email or password"
      );
    });

    it("should add user bank account", async () => {
      const loginResponse = await request.post(url).send({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
                user {
                  email
                  fullname
                  id
                }
              }
            }
          `,
        variables: {
          email: user.email,
          password: user.password,
        },
      });

      const token = loginResponse.body.data.loginUser.token;
      const verifyAccountMock = jest.spyOn(paystack, "verifyAccount");

      verifyAccountMock.mockImplementation(async () => {
        return {
          account_name: "Agunbiade Sodiq",
          account_number: "0463801856",
          bank_code: "058",
        };
      });

      const response = await request
        .post(url)
        .send({
          query: `
          mutation AddBankAccount($accountNumber: String!, $accountName: String!, $bankCode: String!) {
            addBankAccount(account_number: $accountNumber, account_name: $accountName, bank_code: $bankCode) {
              account_name
              bank_code
              account_number
              id
              is_verified
              user {
                email
                fullname
                id
              }
            }
          }
          `,
          variables: {
            accountName: "Agunbiade Sodiq",
            accountNumber: "0463801856",
            bankCode: "058",
          },
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);

      verifyAccountMock.mockRestore();
      expect(response.body.data.addBankAccount.id).to.be.a("string");
      expect(response.body.data.addBankAccount.account_name).to.be.eq(
        "Agunbiade Sodiq"
      );
      expect(response.body.data.addBankAccount.account_number).to.be.eq(
        "0463801856"
      );
      expect(response.body.data.addBankAccount.is_verified).to.be.true;

      expect(response.body.data.addBankAccount.user.email).to.be.eq(
        user.email.toLowerCase()
      );
    });

    afterAll(async () => {
      console.log("Clearing database");
      await clearDB();
    });
  });

  describe("Queries", () => {
    it("should fetch user bank accounts", async () => {
      await request.post(url).send({
        query: `
          mutation CreateUser($surname: String!, $firstname: String!, $email: String!, $password: String!) {
            createUser(surname: $surname, firstname: $firstname, email: $email, password: $password) {
                email
                fullname
                id
                isVerified
              }
            }
          `,
        variables: {
          email: "sodiq.agunbiade.4@gmail.com",
          firstname: "Sodiq",
          surname: "Agunbiade",
          password: "temitope123",
        },
      });

      const loginResponse = await request.post(url).send({
        query: `
          mutation LoginUser($email: String!, $password: String!) {
              loginUser(email: $email, password: $password) {
                token
                user {
                  email
                  fullname
                  id
                }
              }
            }
          `,
        variables: {
          email: "sodiq.agunbiade.4@gmail.com",
          password: "temitope123",
        },
      });

      const token = loginResponse.body.data.loginUser.token;

      const bankAccountResponse = await request
        .post(url)
        .send({
          query: `
          mutation AddBankAccount($accountNumber: String!, $accountName: String!, $bankCode: String!) {
            addBankAccount(account_number: $accountNumber, account_name: $accountName, bank_code: $bankCode) {
              account_name
              bank_code
              account_number
              id
              is_verified
              user {
                email
                fullname
                id
              }
            }
          }
          `,
          variables: {
            accountName: "Agunbiade Sodiq",
            accountNumber: "0463801856",
            bankCode: "058",
          },
        })
        .set("Authorization", `Bearer ${token}`);

      console.log(bankAccountResponse.body);

      const response = await request
        .post(url)
        .send({
          query: `
          query FetchUserBankAccounts($page: Int, $perPage: Int) {
            fetchUserBankAccounts(page: $page, perPage: $perPage) {
              data {
                user {
                  isVerified
                  id
                  fullname
                  email
                }
                is_verified
                id
                bank_code
                account_number
                account_name
              }
            }
          }
          `,
          variables: {
            page: 1,
            perPage: 10,
          },
        })
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).to.equal(200);
      expect(
        response.body.data.fetchUserBankAccounts.data.length
      ).to.be.greaterThan(0);
      expect(response.body.data.fetchUserBankAccounts.data[0].id).to.be.a(
        "string"
      );
    });
  });

  it("should fetch banks by country", async () => {
    const fetchBankMock = jest.spyOn(paystack, "listBanks");

    const data = [
      {
        name: "Abbey Mortgage Bank",
        slug: "abbey-mortgage-bank",
        code: "801",
        longcode: "",
        gateway: null,
        pay_with_bank: false,
        active: true,
        is_deleted: false,
        country: "Nigeria",
        currency: "NGN",
        type: "nuban",
        id: 174,
        createdAt: "2020-12-07T16:19:09.000Z",
        updatedAt: "2020-12-07T16:19:19.000Z",
      },
    ];

    fetchBankMock.mockImplementation(async () => {
      return data;
    });

    const response = await request.post(url).send({
      query: `
        query Query($country: String!, $page: Int, $perPage: Int) {
          fetchBanks(country: $country, page: $page, perPage: $perPage) {
            pagination {
              count
              hasNextPage
            }
            data {
              code
              country
              currency
              slug
              type
            }
          }
        }`,
      variables: {
        country: "Nigeria",
        page: 1,
        perPage: 10,
      },
    });

    console.log(response.body);
    expect(response.status).to.equal(200);
    fetchBankMock.mockRestore();
    expect(response.body.data.fetchBanks.data.length).to.be.greaterThan(0);
    expect(response.body.data.fetchBanks.data[0].code).to.be.a("string");
    expect(response.body.data.fetchBanks.data[0].country).to.be.a("string");
    expect(response.body.data.fetchBanks.data[0].currency).to.be.a("string");
    expect(response.body.data.fetchBanks.data[0].slug).to.be.a("string");
    expect(response.body.data.fetchBanks.data[0].type).to.be.a("string");

    expect(response.body.data.fetchBanks.pagination.count).to.be.greaterThan(0);
    expect(response.body.data.fetchBanks.pagination.hasNextPage).to.be.a(
      "boolean"
    );
  });
});
