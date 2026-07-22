import { prisma } from "@/lib/prisma";

export const authRepository = {
    async findUserByUsername(username: string) {
        return await prisma.user.findUnique({
            where: { username },
        });
    },

    async createSession(data: { user_id: string; session_token: string; expires_at: Date; }) {
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

    async deleteSession(session_token: string) {
        return await prisma.session.delete({
            where: { session_token: session_token },
        });
    },

    async deleteSessionByUser(user_id: string) {
        return await prisma.session.deleteMany({
            where: { user_id: user_id },
        });
    },
}