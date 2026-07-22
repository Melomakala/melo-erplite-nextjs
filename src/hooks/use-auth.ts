import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginInput } from "@/server/validations/auth.validation";

export function useAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

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
            setIsLoggedIn(true);
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
            setIsLoggedIn(false);
            router.push("/login");
        } catch (error) {
            throw error;
        }
    };

    return {
        isLoggedIn,
        login,
        logout,
    };
}