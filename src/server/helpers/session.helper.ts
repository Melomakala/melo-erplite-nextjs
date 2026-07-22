import { authRepository } from "../repositories/auth.repository";

export async function getValidSession(sessionToken: string) {
    const session = await authRepository.findSessionByToken(sessionToken);
    if (!session) {
        throw new Error("Invalid session token");
    }
    if (session.expires_at < new Date()) {
        throw new Error("Session expired");
    }
    return session;
}