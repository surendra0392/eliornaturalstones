import type { ReactNode, TableHTMLAttributes } from 'react';

export function AdminTable({
    className = '',
    children,
    ...props
}: TableHTMLAttributes<HTMLTableElement>) {
    return (
        <div className="w-full overflow-x-auto">
            <table
                className={`w-full border-collapse text-left text-xs ${className}`}
                {...props}
            >
                {children}
            </table>
        </div>
    );
}

export function AdminTableHeader({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <thead
            className={`border-b border-stone-200 bg-stone-50/80 font-mono text-[10px] tracking-wider text-stone-500 uppercase dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-400 ${className}`}
        >
            {children}
        </thead>
    );
}

export function AdminTableBody({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <tbody
            className={`divide-y divide-stone-200/80 text-stone-800 dark:divide-stone-800/80 dark:text-stone-200 ${className}`}
        >
            {children}
        </tbody>
    );
}

export function AdminTableRow({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <tr
            className={`transition-colors hover:bg-stone-50/80 dark:hover:bg-stone-800/50 ${className}`}
        >
            {children}
        </tr>
    );
}

export function AdminTableHead({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <th className={`px-5 py-3.5 font-medium ${className}`}>{children}</th>
    );
}

export function AdminTableCell({
    children,
    className = '',
}: {
    children: ReactNode;
    className?: string;
}) {
    return <td className={`px-5 py-3.5 ${className}`}>{children}</td>;
}
