import { useRouter } from "next/navigation";
import { LoginInput } from "@/server/validations/auth.validation";
import { useAuthStore } from "@/stores/auth-store";

export function useAuth() {
    const router = useRouter();
    const { setAuth, clearAuth } = useAuthStore();
    const login = async (data: LoginInput) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }
            setAuth({ user_id: result.data.user.user_id });
            // ✅ อ่านค่ากลับจาก Zustand store โดยตรง (ไม่ใช้ closure)
            const storeState = useAuthStore.getState();
            console.log("[useAuth] user_id from Zustand:", storeState.user?.user_id);
            router.push("/");
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            const response = await fetch("/api/auth/logout", {
                method: "POST",
            });
            const result = await response.json();
            if (!result.success) {
                throw new Error(result.message);
            }
            clearAuth();
            router.push("/login");
        } catch (error) {
            throw error;
        }
    };

    return {
        login,
        logout,
    };
}