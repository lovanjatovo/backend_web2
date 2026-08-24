import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";

export class AuthController {

    private authService = new AuthService();

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password required"
                });
            }
            const result = await this.authService.login(email, password);

            return res.status(200).json(result);

        } catch (error) {
            if (
                error instanceof Error &&
                error.message === "ACCOUNT_DISABLED"
            ) {
                return res.status(403).json({message: "Account disabled" });
            }

            return res.status(401).json({message: "Invalid email or password"
            });
        }
    };
}