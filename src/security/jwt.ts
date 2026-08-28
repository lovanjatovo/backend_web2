import jwt from "jsonwebtoken";

function getJwtSecret(): string {
    const secret = process.env.JWT_SECRET;
    if (!secret) { throw new Error("JWT_SECRET is not defined");}
    return secret;
}

export function generateToken(userId: number, role: "ADMIN" | "STUDENT") {
    return jwt.sign(
        { userId, role },
        getJwtSecret(),
        { expiresIn: "24h" }
    );
}