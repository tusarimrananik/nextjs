import User from "@/models/User"

import { connectToDatabase } from "@/lib/db"


export const getUser = async () => {

    await connectToDatabase();

    const users = await User.find({});
    return users;

}