import mongoose from "mongoose";
import envs from "./envs.config";

export const connectDB = async () => {
  try {
    let url: string;
    if (envs.environment === "test") {
      url = envs.db.test_uri;
    } else {
      url = envs.db.uri;
    }
    await mongoose.connect(url);
    console.log("Connected to database successfully");
    return {
      status: "success",
    };
  } catch (err: any) {
    console.log("Could not connect to database", err);
    return {
      status: "error",
    };
  }

  process.on("exit", async () => {
    await mongoose.connection.close();
    console.log("Exiting the application.....");
  });
};

export const clearDB = async () => {
  try {
    await mongoose.connection.dropDatabase();
  } catch (err: any) {
    console.log("Error clearing database");
  }
};
