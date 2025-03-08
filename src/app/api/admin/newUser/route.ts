import { NextRequest } from 'next/server';
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

export async function POST(request: NextRequest) {


    const { name, accessToken } = await request.json();



    await connectToDatabase();


    const newUser = await User.create({
        userName: name,
        accessToken: accessToken,
        balance: 0,
        numberOfOperations:0,

    });

    return new Response(JSON.stringify(newUser), {
        headers: { 'Content-Type': 'application/json' },
        status: 201
    });




}