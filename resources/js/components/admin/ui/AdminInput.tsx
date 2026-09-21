import type { InputHTMLAttributes } from 'react';

export interface AdminInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function AdminInput({
    label,
    error,
    helperText,
    id,
    required,
    className = '',
    ...props
}: AdminInputProps) {
    const inputId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={inputId}
                    className="block text-[11px] font-medium tracking-[0.16em] text-stone-700 uppercase dark:text-stone-300"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <input
                id={inputId}
                required={required}
                aria-invalid={!!error}
                aria-describedby={
                    error && inputId ? `${inputId}-error` : undefined
                }
                className={`min-h-[44px] w-full border bg-white px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 transition-colors focus:ring-1 focus:outline-none dark:bg-stone-950 dark:text-stone-100 ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900 dark:border-stone-700 dark:focus:border-stone-100 dark:focus:ring-stone-100'
                } ${className}`}
                {...props}
            />

            {error && inputId && (
                <p
                    id={`${inputId}-error`}
                    className="text-[11px] text-red-600 dark:text-red-400"
                >
                    {error}
                </p>
            )}

            {!error && helperText && (
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                    {helperText}
                </p>
            )}
        </div>
    );
}
