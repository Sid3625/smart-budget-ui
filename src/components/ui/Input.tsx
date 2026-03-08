import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, error, label, value, ...props }, ref) => {
        // Handle NaN for numeric inputs to avoid React warnings when empty
        const safeValue = typeof value === 'number' && Number.isNaN(value) ? '' : value;

        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {label}
                    </label>
                )}

                <input
                    ref={ref}
                    value={safeValue}
                    className={clsx(
                        "w-full rounded-lg border bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100",
                        "border-gray-300 dark:border-gray-600 placeholder:text-gray-400 dark:placeholder:text-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400",
                        "transition duration-150 ease-in-out",
                        "disabled:bg-gray-100 dark:disabled:bg-gray-900 disabled:cursor-not-allowed",
                        {
                            "border-red-500 focus:ring-red-500 focus:border-red-500": error,
                        },
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="mt-1 text-xs text-red-600">{error}</p>
                )}
            </div>
        );
    }
);
