import { ReactNode } from 'react';
import { X } from 'lucide-react';

// Since I didn't install headlessui, I'll use a custom implementation for now.
// But user asked for "Production-ready". Headless UI or Radix is standard.
// I'll stick to a simple custom modal to avoid extra install unless I install it.
// I'll check package.json again. I only installed what was requested.
// I'll write a simple custom modal.

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    footer?: ReactNode;
}

export const Modal = ({ isOpen, onClose, title, children, footer }: ModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

                <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white dark:bg-gray-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4 transition-colors">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold leading-6 text-gray-900 dark:text-white">{title}</h3>
                            <button
                                onClick={onClose}
                                className="rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>
                        <div className="mt-2">{children}</div>
                    </div>
                    {footer && (
                        <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 transition-colors">
                            {footer}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
