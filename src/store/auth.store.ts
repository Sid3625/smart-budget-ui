import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User } from '@/types/auth.types';

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            // Initialize auth state if token is in storage
            checkAuth: () => {
                const token = get().token;
                if (token) {
                    set({ isAuthenticated: true });
                }
            },

            setAuth: (user: User, token: string) => {
                set({ user, token, isAuthenticated: true });
            },

            updateUser: (updatedUser: Partial<User>) => {
                const currentUser = get().user;
                if (currentUser) {
                    set({ user: { ...currentUser, ...updatedUser } });
                }
            },

            logout: async () => {
                try {
                    // Call backend logout endpoint
                    const token = get().token;
                    if (token) {
                        // Import authApi dynamically to avoid circular dependency
                        const { authApi } = await import('@/api/auth.api');
                        await authApi.logout();
                    }
                } catch (error) {
                    console.error('Logout error:', error);
                } finally {
                    // Always clear local state regardless of API call success
                    set({ user: null, token: null, isAuthenticated: false });
                }
            },
        }),
        {
            name: 'smart-budget-auth', // name of the item in the storage (must be unique)
            partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
