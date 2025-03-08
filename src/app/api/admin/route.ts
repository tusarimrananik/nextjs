import { NextResponse } from 'next/server';
import User from '@/models/User';
import { connectToDatabase } from '@/lib/db';

export async function PUT(request: Request) {

    try {
        await connectToDatabase();
        const body = await request.json();
        const { id, operation } = body;
        if (!id && !operation) {
            return NextResponse.json(
                { error: 'User ID is required and operation is required' },
                { status: 400 }
            );
        }
        const balanceChange = operation === "+" ? 70 : -70;
        const numberOfOperationsChange = operation === "+" ? 1 : -1;

        const updatedUser = await User.findByIdAndUpdate(
            id,
            {
                $inc: { balance: balanceChange, numberOfOperations: numberOfOperationsChange },
            },
        );

        if (!updatedUser) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        console.log("User Update Successfully!!!")

        return NextResponse.json({
            message: 'User updated successfully',
            user: updatedUser
        });

    } catch (error) {
        return NextResponse.json(
            { error: 'Error updating user' },
            { status: 500 }
        );
    }
}