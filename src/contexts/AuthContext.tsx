import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserStore {
  user: User | null;
  loading: boolean;

  setUser: (user: User) => void;
  updateUser: (data: Partial<User>) => void;
  clearUser: () => void;
  setLoading: (value: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  loading: false,

  setUser: (user) => set({ user }),

  updateUser: (data) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...data } : null,
    })),

  clearUser: () => set({ user: null }),

  setLoading: (value) => set({ loading: value }),
}));
