import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/auth-store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Profile {
  user_id: string;
  username: string;
  name: string | null;
  role: string;
}

async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`/api/profile/getProfile`);
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data.profile;
}

export function useProfile() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const query = useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: false,
  });

  useEffect(() => {
    if (query.isError) {
      clearAuth();
      router.push("/login");
    }
  }, [query.isError, router]);

  return query;
}
