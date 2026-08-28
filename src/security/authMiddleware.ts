import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).json({ message: "Authentication required"});
    }

    const parts = authorization.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({message: "Invalid authorization header"});
    }

    const token = parts[1];
    const secret = process.env.JWT_SECRET;
    if (!secret) {return res.status(500).json({message: "JWT secret is not configured"});}

    try {
        const decoded = jwt.verify(token, secret) as {
            userId: number;
            role: "ADMIN" | "STUDENT";
        };
        req.user = decoded;
        next();
    } catch {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}