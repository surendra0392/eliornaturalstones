import type { ReactNode, SelectHTMLAttributes } from 'react';

export interface AdminSelectOption {
    value: string | number;
    label: string;
}

export interface AdminSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options?: AdminSelectOption[];
    children?: ReactNode;
}

export function AdminSelect({
    label,
    error,
    helperText,
    id,
    required,
    className = '',
    options,
    children,
    ...props
}: AdminSelectProps) {
    const selectId =
        id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
        <div className="w-full space-y-1.5">
            {label && (
                <label
                    htmlFor={selectId}
                    className="block text-[11px] font-medium tracking-[0.16em] text-stone-700 uppercase dark:text-stone-300"
                >
                    {label}
                    {required && <span className="ml-1 text-red-500">*</span>}
                </label>
            )}

            <div className="relative">
                <select
                    id={selectId}
                    required={required}
                    aria-invalid={!!error}
                    aria-describedby={
                        error && selectId ? `${selectId}-error` : undefined
                    }
                    className={`min-h-[44px] w-full appearance-none border bg-white px-3.5 py-2 pr-10 text-xs text-stone-900 transition-colors focus:ring-1 focus:outline-none dark:bg-stone-950 dark:text-stone-100 ${
                        error
                            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                            : 'border-stone-300 focus:border-stone-900 focus:ring-stone-900 dark:border-stone-700 dark:focus:border-stone-100 dark:focus:ring-stone-100'
                    } ${className}`}
                    {...props}
                >
                    {options
                        ? options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                  {opt.label}
                              </option>
                          ))
                        : children}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-stone-500">
                    <svg
                        className="h-4 w-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {error && selectId && (
                <p
                    id={`${selectId}-error`}
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
