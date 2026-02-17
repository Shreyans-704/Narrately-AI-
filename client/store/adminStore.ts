import { create } from 'zustand';

interface AdminState {
  isAdminAuthenticated: boolean;
  adminUsername: string | null;
  setAdminAuthenticated: (authenticated: boolean, username?: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAdminAuthenticated: localStorage.getItem('admin_authenticated') === 'true',
  adminUsername: localStorage.getItem('admin_username') || null,
  
  setAdminAuthenticated: (authenticated, username = '') => {
    if (authenticated) {
      localStorage.setItem('admin_authenticated', 'true');
      localStorage.setItem('admin_username', username);
    }
    set({ isAdminAuthenticated: authenticated, adminUsername: authenticated ? username : null });
  },
  
  logout: () => {
    localStorage.removeItem('admin_authenticated');
    localStorage.removeItem('admin_username');
    set({ isAdminAuthenticated: false, adminUsername: null });
  },
}));
