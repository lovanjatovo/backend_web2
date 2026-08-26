export type Role = "ADMIN" | "STUDENT";

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
}
