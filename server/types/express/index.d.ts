import { Account, User } from "@prisma/client";

declare global {
    namespace Express {
        interface User {
            id: string;
            username?: string;
            displayName?: string;
            email?: string;
            accounts?: Account[];
        }
    }
}
