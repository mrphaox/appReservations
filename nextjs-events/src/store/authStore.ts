import { create } from 'zustand';

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
  initializeToken: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  setToken: (token) => {
    localStorage.setItem('token', token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null });
  },
  initializeToken: () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) set({ token });
    }
  }
}));
