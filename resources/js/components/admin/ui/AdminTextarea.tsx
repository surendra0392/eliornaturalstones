import type { TextareaHTMLAttributes } from 'react';

export interface AdminTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
}

export function AdminTextarea({
    label,
    error,
    helperText,
    id,
    required,
    className = '',
    rows = 4,
    ...props
}: AdminTextareaProps) {
    const textareaId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={textareaId}
                    className="block text-[11px] font-medium tracking-[0.16em] text-stone-700 uppercase dark:text-stone-300"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <textarea
                id={textareaId}
                rows={rows}
                required={required}
                aria-invalid={!!error}
                aria-describedby={
                    error && textareaId ? `${textareaId}-error` : undefined
                }
                className={`w-full border bg-white px-3.5 py-2 text-xs text-stone-900 placeholder-stone-400 transition-colors focus:ring-1 focus:outline-none dark:bg-stone-950 dark:text-stone-100 ${
                    error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                        : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900 dark:border-stone-700 dark:focus:border-stone-100 dark:focus:ring-stone-100'
                } ${className}`}
                {...props}
            />

            {error && textareaId && (
                <p
                    id={`${textareaId}-error`}
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
