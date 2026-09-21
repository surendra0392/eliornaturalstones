import { useState, type ReactNode } from 'react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { AdminHeader } from '../components/admin/AdminHeader';

interface AdminLayoutProps {
    title: string;
    children: ReactNode;
}

export function AdminLayout({ title, children }: AdminLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-stone-100/60 font-sans text-stone-900 antialiased dark:bg-stone-950 dark:text-stone-100">
            {/* Sidebar (Desktop + Mobile Drawer) */}
            <AdminSidebar
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
            />

            {/* Main Application Area */}
            <div className="flex min-w-0 flex-1 flex-col">
                <AdminHeader
                    title={title}
                    onMenuClick={() => setSidebarOpen(true)}
                />

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
