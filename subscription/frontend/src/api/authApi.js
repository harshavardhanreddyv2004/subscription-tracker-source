import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL?.replace(/\/api$/, "") || "http://localhost:4000";

export const authApi = {
  login: async (email, password) => {
    const { data } = await axios.post(`${baseURL}/api/auth/login`, { email, password });
    return data;
  },

  register: async (email, fullName, password) => {
    const { data } = await axios.post(`${baseURL}/api/auth/register`, {
      email,
      fullName,
      password
    });
    return data;
  }
};
