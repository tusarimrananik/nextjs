import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUser extends Document {
    _id: Types.ObjectId;
    userName: string;
    accessToken: string;
    balance: number;
    numberOfOperations: number;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    accessToken: {
        type: String,
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        required: true,
        default: 0
    },
    numberOfOperations: {
        type: Number,
        required: true,
        default: 0
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;