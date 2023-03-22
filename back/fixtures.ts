import mongoose from "mongoose";
import config from "./config";
import User from "./models/User";

const run = async () => {
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
    await db.dropCollection('messages');
  } catch (e) {
    console.log("Collections were not present, skipping drop...");
  }

  await User.create({
    username: "user",
    password: "user",
    displayName: "User",
    token: "user_token",
    role: "user"
  }, {
    username: "admin",
    password: "admin",
    displayName: "Admin",
    token: "admin_token",
    role: "moderator"
  });

  await db.close();
};

void run();