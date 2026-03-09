import { apiClient } from "./client";

export const subscriptionsApi = {
  getAll: async () => {
    const response = await apiClient.get("/subscriptions");
    return response.data;
  },
  create: async (payload) => {
    const response = await apiClient.post("/subscriptions", payload);
    return response.data;
  },
  update: async (id, payload) => {
    const response = await apiClient.put(`/subscriptions/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.delete(`/subscriptions/${id}`);
    return response.data;
  },
  setBudget: async (budgetLimit) => {
    const response = await apiClient.patch("/subscriptions/budget", { budgetLimit });
    return response.data;
  },
  getInsights: async () => {
    const response = await apiClient.get("/insights");
    return response.data;
  },
  getSmartInsights: async () => {
    const response = await apiClient.get("/insights/smart");
    return response.data;
  }
};
