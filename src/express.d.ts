declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                role: "ADMIN" | "STUDENT";
            };
        }
    }
}

export {};