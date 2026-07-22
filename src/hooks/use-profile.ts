import { useQuery } from "@tanstack/react-query";

interface Profile {
  user_id: string;
  username: string;
  name: string | null;
  role: string;
}

async function fetchProfile(): Promise<Profile> {
  const res = await fetch(`/api/profile`);
  const result = await res.json();
  if (!result.success) {
    throw new Error(result.message);
  }
  return result.data.profile;
}

export function useProfile() {
  return useQuery({
    queryKey: ["profile"],
    queryFn: () => fetchProfile(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
