import { create } from "zustand";
import { persist } from "zustand/middleware";
import { authApi } from "../api/authApi";

const TOKEN_KEY = "subscription-tracker-token";
const USER_KEY = "subscription-tracker-user";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: "",

      login: async (email, password) => {
        set({ loading: true, error: "" });
        try {
          const { token, user } = await authApi.login(email, password);
          set({ token, user, loading: false, error: "" });
          return { success: true };
        } catch (err) {
          const message = err?.response?.data?.message || "Login failed";
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      register: async (email, fullName, password) => {
        set({ loading: true, error: "" });
        try {
          const { token, user } = await authApi.register(email, fullName, password);
          set({ token, user, loading: false, error: "" });
          return { success: true };
        } catch (err) {
          const message = err?.response?.data?.message || "Registration failed";
          set({ error: message, loading: false });
          return { success: false, message };
        }
      },

      logout: () => {
        set({ token: null, user: null, error: "" });
      },

      clearError: () => set({ error: "" }),

      isAuthenticated: () => !!get().token
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
);
