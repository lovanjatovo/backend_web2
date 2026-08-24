export type Role = "ADMIN" | "STUDENT";

export interface User {
    id: number;
    email: string;
    passwordHash: string;
    role: Role;
    isActive: boolean;
}