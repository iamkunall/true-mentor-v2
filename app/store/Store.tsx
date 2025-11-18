import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Session {
  _id: string;
  mentor?: string;
  student?: string;
  chatRoom?: string;
  price?: number;
  [key: string]: any;
}

interface AuthState {
  token: string | null;
  tempToken: string | null;
  student: any;
  user: any;
  role: string | null;
  currentSession: Session | null; // current session
  setToken: (token: string | null) => void;
  setTempToken: (token: string | null) => void;
  setStudent: (data: any) => void;
  setUser: (data: any) => void;
  setRole: (role: string | null) => void;
  setCurrentSession: (session: Session | null) => void;
  clearCurrentSession: () => void; // 👈 new function
  clearAuth: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      student: null,
      user: null,
      role: null,
      currentSession: null,
      tempToken: null,

      setToken: (token) => set({ token }),
      setTempToken: (token) => set({ tempToken: token }),
      setStudent: (data) => set({ student: data }),
      setUser: (data) => set({ user: data }),
      setRole: (role) => set({ role }),
      setCurrentSession: (session) => set({ currentSession: session }),

      clearCurrentSession: () => set({ currentSession: null }), // ✅ only clears session

      clearAuth: () =>
        set({
          token: null,
          student: null,
          user: null,
          role: null,
          currentSession: null,
        }),
    }),
    {
      name: 'auth-storage',
      storage: {
        getItem: async (key) => {
          const value = await AsyncStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (key, value) => {
          await AsyncStorage.setItem(key, JSON.stringify(value));
        },
        removeItem: async (key) => {
          await AsyncStorage.removeItem(key);
        },
      },
    },
  ),
);

export default useAuthStore;
