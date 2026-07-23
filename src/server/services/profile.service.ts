import { profileRepository } from "@/server/repositories/profile.repository";
import { getValidSession } from "@/server/helpers/session.helper";
import { logger } from "@/server/helpers/logger";
import { CustomError } from "@/server/helpers/CustomError";

export const profileService = {
    async getProfile(session_token: string) {
        const session = await getValidSession(session_token);
        const user = await profileRepository.getProfile(session.user_id);
        if (!user) {
            throw new CustomError("User not found", 404);
        }
        logger.info("getProfile", "User found", {
            user_id: user.user_id,
            username: user.username,
            name: user.name,
            role: user.role,
        });
        return {
            profile: {
                user_id: user.user_id,
                username: user.username,
                name: user.name,
                role: user.role,
            }
        };
    }
}
