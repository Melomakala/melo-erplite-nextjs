import { prisma } from "@/lib/prisma";

export const profileRepository = {
    async getProfile(user_id: string) {
        return await prisma.user.findUnique({
            where: { user_id },
            select: {
                user_id: true,
                username: true,
                name: true,
                role: true,
            },
        });
    },

    async updateProfile(user_id: string, data: any) {
        return await prisma.user.update({
            where: { user_id },
            data,
        });
    },

    async deleteProfile(user_id: string) {
        return await prisma.user.delete({
            where: { user_id },
        });
    },
}