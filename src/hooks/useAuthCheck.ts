import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    exp: number;
    // Add other fields from your JWT payload if needed
}

export const useAuthCheck = () => {
    const token = useAuthStore((state) => state.token);
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        if (!token) return;

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                // Token already expired
                logout();
            } else {
                // Token valid, set timer for expiration
                const timeoutDuration = (decoded.exp - currentTime) * 1000;

                // Ensure timeout is positive (safeguard)
                // Use a max timeout to avoid integer overflow, though unlikely for standard JWTs
                if (timeoutDuration > 0) {
                    const timer = setTimeout(() => {
                        logout();
                    }, timeoutDuration);

                    return () => clearTimeout(timer);
                } else {
                    logout();
                }
            }
        } catch (error) {
            console.error("Invalid token:", error);
            logout();
        }
    }, [token, logout]);
};
