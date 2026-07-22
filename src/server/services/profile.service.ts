import { profileRepository } from "@/server/repositories/profile.repository";

export const profileService = {
    async getProfile(user_id: string) {
        return await profileRepository.getProfile(user_id);
    }
}
