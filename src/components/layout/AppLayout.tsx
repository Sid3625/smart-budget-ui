import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { clsx } from 'clsx';
import { Menu } from 'lucide-react';
import { useState } from 'react';

export const AppLayout = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex bg-gray-50 dark:bg-gray-900 dark:text-gray-100 min-h-screen transition-colors duration-200">
            {/* Mobile Sidebar overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div
                className={clsx(
                    'fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none',
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 min-w-0 overflow-y-auto">
                {/* Mobile Header */}
                <div className="lg:hidden flex items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 -ml-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <span className="ml-4 text-lg font-bold text-gray-900 dark:text-white">BudgetApp</span>
                </div>

                <div className="p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};
