import { Link, useLocation } from 'react-router-dom';
import { clsx } from 'clsx';
import { LayoutDashboard, Receipt, User, LogOut, PiggyBank, Target, CalendarClock } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';

export const Sidebar = () => {
    const location = useLocation();
    const logout = useAuthStore((state) => state.logout);

    const links = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Budgets', href: '/budgets', icon: PiggyBank },
        { name: 'Transactions', href: '/transactions', icon: Receipt },
        { name: 'Savings Goals', href: '/goals', icon: Target },
        { name: 'Recurring Bills', href: '/bills', icon: CalendarClock },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 flex flex-col">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-primary-600 flex items-center gap-2">
                    <Receipt className="w-8 h-8" />
                    BudgetApp
                </h1>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location.pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            to={link.href}
                            className={clsx(
                                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors font-medium',
                                isActive
                                    ? 'bg-primary-50 text-primary-700'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            {link.name}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex flex-col gap-2">
                <button
                    onClick={() => document.documentElement.classList.toggle('dark')}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                >
                    <span className="w-5 h-5 flex items-center justify-center text-xl leading-none">🌙</span>
                    Toggle Theme
                </button>
                <button
                    onClick={logout}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors font-medium"
                >
                    <LogOut className="w-5 h-5" />
                    Logout
                </button>
            </div>
        </aside>
    );
};
