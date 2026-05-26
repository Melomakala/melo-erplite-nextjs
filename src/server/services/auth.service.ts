import bcrypt from "bcryptjs"
import { CustomError } from "@/server/helpers/CustomError"
import { logger } from "@/server/helpers/logger"
import { randomBytes } from "crypto"
import { authRepository } from "@/server/repositories/auth.repository"
import { LoginInput } from "@/server/validations/auth.validation"
export const authService = {
    async login(input: LoginInput) {
        const user = await authRepository.findUserByUsername(input.username);
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        const isPasswordValid = await bcrypt.compare(input.password, user.password);
        if (!isPasswordValid) {
            throw new CustomError("Invalid password", 401);
        }
        const session_token = randomBytes(32).toString("hex");
        const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        await authRepository.createSession({
            user_id: user.user_id,
            session_token: session_token,
            expires_at: expires_at,
        });

        logger.info("Auth Service", "User logged in successfully", {
            user_id: user.user_id,
            username: user.username,
            role: user.role,
        });

        return {
            session_token,
            expires_at,
            user: {
                user_id: user.user_id,
                username: user.username,
                role: user.role,
            }
        };
    },

    async logout(session_id: string) {
        await authRepository.deleteSession(session_id);
        logger.info("Auth Service", "User logged out successfully", {
            session_id,
        });
    },

}