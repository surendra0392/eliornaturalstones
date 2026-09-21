import { type ReactNode, useEffect } from 'react';

export interface AdminModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    children: ReactNode;
    footer?: ReactNode;
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AdminModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    footer,
    maxWidth = 'lg',
}: AdminModalProps) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent background scrolling
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const maxWidthClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Container */}
            <div
                className={`relative w-full ${maxWidthClasses[maxWidth]} flex max-h-[90vh] flex-col overflow-hidden border border-stone-200 bg-white shadow-xl dark:border-stone-800 dark:bg-stone-900`}
            >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-200/80 px-6 py-4 dark:border-stone-800/80">
                    <div>
                        <h3
                            id="modal-title"
                            className="font-serif text-lg font-normal text-stone-900 dark:text-stone-100"
                        >
                            {title}
                        </h3>
                        {description && (
                            <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                                {description}
                            </p>
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center p-1 text-stone-400 hover:text-stone-700 dark:text-stone-500 dark:hover:text-stone-200"
                        aria-label="Close dialog"
                    >
                        <svg
                            className="h-5 w-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto p-6">{children}</div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 border-t border-stone-200/80 bg-stone-50/50 px-6 py-4 dark:border-stone-800/80 dark:bg-stone-900/50">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
