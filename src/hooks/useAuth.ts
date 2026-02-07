import { useAuthStore } from "@/store/useAuthStore";

export const useAuth = () => {
  const { user } = useAuthStore();
  return { user };
};
