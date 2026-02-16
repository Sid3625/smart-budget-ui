import { useState, useEffect } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/api/auth.api';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';


export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const setAuth = useAuthStore((state) => state.setAuth);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const navigate = useNavigate();

    // Password validation regex
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasMinLength = password.length >= 8;

    const isPasswordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar && hasMinLength;

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        if (!isPasswordValid) {
            setError('Please meet all password requirements');
            setIsLoading(false);
            return;
        }

        try {
            const { user, accessToken } = await authApi.register({ name, email, password });
            setAuth(user, accessToken);
            navigate('/dashboard');
        } catch (err: any) {
            const message = err.response?.data?.message;
            // Handle array of messages from class-validator
            setError(Array.isArray(message) ? message[0] : message || 'Failed to create account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                    Create a new account
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </Link>
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <Input
                            id="name"
                            type="text"
                            label="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                        />

                        <Input
                            id="email"
                            type="email"
                            label="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <div>
                            <Input
                                id="password"
                                type="password"
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* Password Strength Indicators */}
                            <div className="mt-2 space-y-1 text-xs text-gray-500">
                                <p className={hasMinLength ? 'text-green-600' : 'text-gray-500'}>
                                    • At least 8 characters
                                </p>
                                <p className={hasUpperCase ? 'text-green-600' : 'text-gray-500'}>
                                    • One uppercase letter
                                </p>
                                <p className={hasLowerCase ? 'text-green-600' : 'text-gray-500'}>
                                    • One lowercase letter
                                </p>
                                <p className={hasNumber ? 'text-green-600' : 'text-gray-500'}>
                                    • One number
                                </p>
                                <p className={hasSpecialChar ? 'text-green-600' : 'text-gray-500'}>
                                    • One special character
                                </p>
                            </div>
                        </div>

                        <Input
                            id="confirmPassword"
                            type="password"
                            label="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        {error && <div className="text-red-600 text-sm">{error}</div>}

                        <Button
                            type="submit"
                            className="w-full"
                            loading={isLoading}
                        >
                            Register
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
};
