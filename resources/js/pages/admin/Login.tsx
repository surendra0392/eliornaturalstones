import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Head, router } from '@inertiajs/react';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminInput } from '../../components/admin/ui/AdminInput';

interface LoginProps {
    status?: string;
    error?: string;
    errors?: Record<string, string>;
}

export default function Login({
    status,
    error,
    errors: pageErrors = {},
}: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [remember, setRemember] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setFormErrors({});

        const localErrors: Record<string, string> = {};
        if (!email.trim()) {
            localErrors.email = 'Please enter your administrator email.';
        }
        if (!password) {
            localErrors.password = 'Please enter your password.';
        }

        if (Object.keys(localErrors).length > 0) {
            setFormErrors(localErrors);
            return;
        }

        setIsSubmitting(true);

        router.post(
            '/admin/login',
            {
                email,
                password,
                remember: remember ? 1 : 0,
            },
            {
                onError: (errs) => {
                    setFormErrors(errs);
                    setIsSubmitting(false);
                },
                onFinish: () => {
                    setIsSubmitting(false);
                },
            },
        );
    }

    const mergedErrors = { ...pageErrors, ...formErrors };
    const generalErrorMessage = error || mergedErrors.general;

    return (
        <div className="flex min-h-screen flex-col justify-center bg-stone-100/80 px-4 py-12 sm:px-6 lg:px-8 dark:bg-stone-950">
            <Head title="Admin Console Login — ELIOR Natural Stones" />

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {/* Brand Header */}
                <div className="text-center">
                    <span className="font-serif text-2xl tracking-[0.28em] text-stone-900 uppercase dark:text-stone-100">
                        ELIOR
                    </span>
                    <p className="mt-1 font-mono text-[10px] tracking-[0.3em] text-stone-500 uppercase dark:text-stone-400">
                        Content Management Console
                    </p>
                </div>

                {/* Login Card */}
                <div className="mt-8 border border-stone-200 bg-white p-8 shadow-xs sm:p-10 dark:border-stone-800 dark:bg-stone-900">
                    <h2 className="font-serif text-xl font-normal text-stone-900 dark:text-stone-100">
                        Sign In
                    </h2>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Enter your administrative credentials to access the
                        console.
                    </p>

                    {/* Status Alert */}
                    {status && (
                        <div
                            role="status"
                            className="mt-6 border border-emerald-300 bg-emerald-50/80 p-3 text-xs text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        >
                            {status}
                        </div>
                    )}

                    {/* Error Alert */}
                    {generalErrorMessage && (
                        <div
                            role="alert"
                            className="mt-6 border border-red-300 bg-red-50/80 p-3 text-xs text-red-800 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-300"
                        >
                            {generalErrorMessage}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="mt-6 space-y-5"
                    >
                        <AdminInput
                            label="Email Address"
                            type="email"
                            required
                            autoComplete="email"
                            value={email}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setEmail(e.target.value)
                            }
                            error={mergedErrors.email}
                            placeholder="admin@eliornaturalstones.com"
                        />

                        <AdminInput
                            label="Password"
                            type="password"
                            required
                            autoComplete="current-password"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            error={mergedErrors.password}
                            placeholder="••••••••••••"
                        />

                        <div className="flex items-center justify-between pt-1">
                            <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
                                <input
                                    type="checkbox"
                                    checked={remember}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => setRemember(e.target.checked)}
                                    className="h-4 w-4 rounded-none border-stone-300 text-stone-900 focus:ring-stone-500 dark:border-stone-700 dark:bg-stone-950"
                                />
                                <span>Remember session</span>
                            </label>
                        </div>

                        <div className="pt-2">
                            <AdminButton
                                type="submit"
                                variant="primary"
                                isLoading={isSubmitting}
                                className="w-full"
                            >
                                Sign In to Console
                            </AdminButton>
                        </div>
                    </form>
                </div>

                <div className="mt-6 text-center">
                    <a
                        href="/"
                        className="font-mono text-[10px] tracking-widest text-stone-400 uppercase transition-colors hover:text-stone-900 dark:hover:text-stone-200"
                    >
                        &larr; Return to Public Website
                    </a>
                </div>
            </div>
        </div>
    );
}
