import dotenv from "dotenv";

dotenv.config();

const {
  MONGO_URI,
  JWT_SECRET,
  PAYSTACK_API_URL,
  PAYSTACK_SECRET_KEY,
  MONGODB_TEST_URI,
  NODE_ENV,
  PORT,
} = process.env;

export default {
  port: PORT || 4000,
  environment: NODE_ENV || "development",
  db: {
    uri: MONGO_URI || "mongodb://localhost:27017/backdrop",
    test_uri: MONGODB_TEST_URI || "mongodb://localhost:27017/backdrop_test",
  },
  jwt: {
    secret: JWT_SECRET || "secret",
    expiration: "2hr",
  },
  paystack: {
    apiUrl: PAYSTACK_API_URL || "https://api.paystack.co",
    secretKey: PAYSTACK_SECRET_KEY,
  },
};
