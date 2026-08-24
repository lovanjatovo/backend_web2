import { UserRepository } from "../repository/UserRepository";
import { comparePassword } from "../security/password";
import { generateToken } from "../security/jwt";

export class AuthService {

    private userRepository = new UserRepository();

    async login(email: string, password: string) {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {throw new Error("INVALID_CREDENTIALS");}

        if (!user.isActive) {throw new Error("ACCOUNT_DISABLED"); }

        const valid = await comparePassword(password, user.passwordHash );

        if (!valid) {throw new Error("INVALID_CREDENTIALS"); }

        const token = generateToken(user.id, user.role);

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}