import { create } from "zustand";
import { subscriptionsApi } from "../api/subscriptionsApi";

const toMessage = (error) => error?.response?.data?.message || "Something went wrong";

export const useSubscriptionStore = create((set, get) => ({
  loading: false,
  error: "",
  subscriptions: [],
  user: null,
  insights: null,

  fetchData: async () => {
    set({ loading: true, error: "" });
    try {
      const [subscriptionsResponse, insightsResponse] = await Promise.all([
        subscriptionsApi.getAll(),
        subscriptionsApi.getInsights()
      ]);

      set({
        subscriptions: subscriptionsResponse.data,
        user: subscriptionsResponse.user,
        insights: insightsResponse.data,
        loading: false
      });
    } catch (error) {
      set({ error: toMessage(error), loading: false });
    }
  },

  createSubscription: async (payload) => {
    set({ loading: true, error: "" });
    try {
      await subscriptionsApi.create(payload);
      await get().fetchData();
    } catch (error) {
      set({ error: toMessage(error), loading: false });
    }
  },

  updateSubscription: async (id, payload) => {
    set({ loading: true, error: "" });
    try {
      await subscriptionsApi.update(id, payload);
      await get().fetchData();
    } catch (error) {
      set({ error: toMessage(error), loading: false });
    }
  },

  deleteSubscription: async (id) => {
    set({ loading: true, error: "" });
    try {
      await subscriptionsApi.remove(id);
      await get().fetchData();
    } catch (error) {
      set({ error: toMessage(error), loading: false });
    }
  },

  setBudgetLimit: async (budgetLimit) => {
    set({ loading: true, error: "" });
    try {
      await subscriptionsApi.setBudget(budgetLimit);
      await get().fetchData();
    } catch (error) {
      set({ error: toMessage(error), loading: false });
    }
  }
}));
