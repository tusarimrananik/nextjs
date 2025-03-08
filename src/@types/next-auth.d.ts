import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string;
            balance: number;
            numberOfOperations: number;
        };
    }

    interface User {
        balance: number;
        numberOfOperations: number;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        balance: number;
        numberOfOperations: number;
    }
}