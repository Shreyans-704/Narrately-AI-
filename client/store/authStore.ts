import { create } from 'zustand';

export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  full_name: string;
  avatar_url?: string;
  role: UserRole;
  status: 'active' | 'inactive';
  credit_balance: number;
  total_views: number;
  trial_ends_at: string | null;
  created_at: string;
  onboarding_completed?: boolean;
  onboarding_goal?: string;
  onboarding_role?: string;
  onboarding_persona?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  updateCredits: (amount: number) => void;
  getTrialDaysRemaining: () => number;
  isTrialActive: () => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: false,
  error: null,
  setUser: (user) => set({ user, error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  updateCredits: (amount) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, credit_balance: state.user.credit_balance + amount }
        : null,
    })),
  getTrialDaysRemaining: () => {
    const state = get();
    if (!state.user?.trial_ends_at) return 0;
    const endDate = new Date(state.user.trial_ends_at);
    const today = new Date();
    const daysRemaining = Math.ceil(
      (endDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return Math.max(0, daysRemaining);
  },
  isTrialActive: () => {
    const state = get();
    if (!state.user?.trial_ends_at) return false;
    const endDate = new Date(state.user.trial_ends_at);
    return new Date() < endDate;
  },
  logout: () => set({ user: null, error: null }),
}));
