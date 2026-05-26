import { prisma } from "@/lib/prisma";

export const authRepository = {
    async findUserByUsername(username: string) {
        return await prisma.user.findUnique({
            where: { username },
        });
    },

    async createSession(data: any) {
        return await prisma.session.create({
            data: {
                user_id: data.user_id,
                session_token: data.session_token,
                expires_at: data.expires_at,
            }
        });
    },

    async findSessionById(session_id: string) {
        return await prisma.session.findUnique({
            where: { session_id },
        });
    },

    async deleteSession(session_id: string) {
        return await prisma.session.delete({
            where: { session_id },
        });
    },
}