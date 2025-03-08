// lib/users.ts
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export const getUsers = async () => {
  await connectToDatabase();
  return await User.find().lean();
};