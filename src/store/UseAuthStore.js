import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5000" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,
  isLoggingIn: false,
  socket: null,
  onlineUsers: [],

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket(); // ✅ FIX: Connect socket on page load
    } catch (err) {
      console.log("error in authCheck", err);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (data) => {
  try {
    const res = await axiosInstance.put("/auth/updateProfile", data);
    
    // ✅ Merge instead of replace - prevents socket reconnection
    set((state) => ({
      authUser: {
        ...state.authUser,
        ...res.data,
      },
    }));
    
    toast.success("Profile updated successfully");
  } catch (error) {
    console.log("Error in update profile:", error);
    toast.error(error.response?.data?.message || "Profile update failed");
  }
},

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response.data.message);
    } finally {
      set({ isSigningUp: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      withCredentials: true,
    });

    // ✅ FIX: Set up listener before storing socket
    socket.on("getOnlineUsers", (userIds) => {
      console.log('📡 Received online users:', userIds);
      set({ onlineUsers: userIds });
    });

    set({ socket });
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out");
      get().disconnectSocket();
    } catch (error) {
      toast.error("Error logging out");
      console.log("Logout error:", error);
    }
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));