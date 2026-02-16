export interface User {
    id: string;
    email: string;
    name: string;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    logout: () => void;
    checkAuth: () => void;
    updateUser: (user: Partial<User>) => void;
}
