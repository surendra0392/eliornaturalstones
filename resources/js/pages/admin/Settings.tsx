import { useState, useTransition } from 'react';
import { Head } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import type {
    CategorizedSettings,
    SettingGroup,
    SettingMediaValue,
} from '../../types/setting';
import { AdminSettingsMediaPickerModal } from '../../components/admin/settings/AdminSettingsMediaPickerModal';
import { apiClient } from '../../api/client';
import { API_ENDPOINTS } from '../../api/endpoints';

interface SettingsAdminProps {
    initialSettings?: CategorizedSettings;
}

const CATEGORY_TABS: {
    id: SettingGroup;
    label: string;
    description: string;
}[] = [
    {
        id: 'general',
        label: 'General',
        description:
            'Basic site identity, headquarters location, and primary corporate communication channels.',
    },
    {
        id: 'branding',
        label: 'Branding',
        description:
            'Architectural brand marks, favicon asset, and global social preview cards chosen from the Media Library.',
    },
    {
        id: 'contact',
        label: 'Contact Channels',
        description:
            'Public enquiry desk, sample dispatch routing, and showroom viewing availability notice.',
    },
    {
        id: 'seo',
        label: 'SEO Defaults',
        description:
            'Fallback search engine titles and descriptions used when specific pages or collections have no custom metadata.',
    },
    {
        id: 'social',
        label: 'Social Profiles',
        description:
            'Verified corporate and architectural profile URLs across professional visual platforms.',
    },
];

export default function SettingsAdmin({
    initialSettings = {
        general: [],
        branding: [],
        contact: [],
        seo: [],
        social: [],
    },
}: SettingsAdminProps) {
    const [settingsState, setSettingsState] =
        useState<CategorizedSettings>(initialSettings);
    const [activeTab, setActiveTab] = useState<SettingGroup>('general');
    const [formValues, setFormValues] = useState<Record<string, any>>(() => {
        const initial: Record<string, any> = {};
        for (const group of Object.keys(initialSettings) as SettingGroup[]) {
            for (const item of initialSettings[group] || []) {
                initial[item.key] = item.value ?? '';
            }
        }
        return initial;
    });

    const [isSaving, setIsSaving] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [, startTransition] = useTransition();

    // Media Picker Modal State
    const [activeMediaKey, setActiveMediaKey] = useState<string | null>(null);

    // Toast notification state
    const [toast, setToast] = useState<{
        message: string;
        type: 'success' | 'error';
    } | null>(null);

    const showToast = (
        message: string,
        type: 'success' | 'error' = 'success',
    ) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3500);
    };

    // Calculate whether current tab has unsaved modifications
    const currentTabItems = settingsState[activeTab] || [];
    const hasUnsavedChangesInCurrentTab = currentTabItems.some((item) => {
        const currentVal = formValues[item.key];
        const savedVal = item.value ?? '';
        if (typeof savedVal === 'object' && savedVal !== null) {
            return JSON.stringify(currentVal) !== JSON.stringify(savedVal);
        }
        return currentVal !== savedVal;
    });

    // Handle generic text/textarea change
    const handleFieldChange = (key: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [key]: value }));
        if (fieldErrors[key]) {
            setFieldErrors((prev) => {
                const next = { ...prev };
                delete next[key];
                return next;
            });
        }
    };

    // Reset current tab changes
    const handleResetTab = () => {
        const reset: Record<string, any> = { ...formValues };
        for (const item of currentTabItems) {
            reset[item.key] = item.value ?? '';
        }
        setFormValues(reset);
        setFieldErrors({});
    };

    // Save settings for current tab
    const handleSaveTab = async () => {
        setIsSaving(true);
        setFieldErrors({});

        try {
            const payloadSettings: Record<string, any> = {};
            for (const item of currentTabItems) {
                payloadSettings[item.key] = formValues[item.key] ?? null;
            }

            const res = await apiClient<CategorizedSettings>(
                API_ENDPOINTS.v1.admin.settings,
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        group: activeTab,
                        settings: payloadSettings,
                    }),
                },
            );

            if (res?.data) {
                startTransition(() => {
                    setSettingsState(res.data);
                    // Update form values with saved values
                    const updatedVals: Record<string, any> = { ...formValues };
                    for (const group of Object.keys(
                        res.data,
                    ) as SettingGroup[]) {
                        for (const item of res.data[group] || []) {
                            updatedVals[item.key] = item.value ?? '';
                        }
                    }
                    setFormValues(updatedVals);
                });

                showToast(res.message || 'Settings saved successfully.');
            }
        } catch (err: any) {
            console.error('Failed to save settings:', err);
            if (err?.errors) {
                const mapped: Record<string, string> = {};
                for (const [k, msgs] of Object.entries(err.errors)) {
                    // Normalize key from 'settings.key_name' to 'key_name'
                    const cleanKey = k.replace(/^settings\./, '');
                    if (Array.isArray(msgs) && msgs.length > 0) {
                        mapped[cleanKey] = msgs[0];
                    }
                }
                setFieldErrors(mapped);
            }
            const msg =
                err?.response?.data?.message ||
                err?.message ||
                'Validation failed. Please review the highlighted fields.';
            showToast(msg, 'error');
        } finally {
            setIsSaving(false);
        }
    };

    // Media item selection handler
    const handleSelectMedia = (media: {
        id: number;
        url: string;
        alt?: string;
        name?: string;
    }) => {
        if (!activeMediaKey) return;

        const mediaVal: SettingMediaValue = {
            id: media.id,
            url: media.url,
            alt: media.alt,
            name: media.name,
        };

        handleFieldChange(activeMediaKey, mediaVal);
        setActiveMediaKey(null);
    };

    // Clear media setting
    const handleClearMedia = (key: string) => {
        handleFieldChange(key, null);
    };

    // Active category metadata
    const activeCategory = CATEGORY_TABS.find((t) => t.id === activeTab)!;

    return (
        <AdminLayout title="Site Configuration">
            <Head title="Settings — ELIOR Admin" />

            {/* Notification Toast */}
            {toast && (
                <div
                    className={`animate-in fade-in slide-in-from-top-2 fixed top-5 right-5 z-50 flex items-center gap-3 border px-4 py-3 text-xs shadow-lg transition-all ${
                        toast.type === 'success'
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950 dark:text-emerald-200'
                            : 'border-red-300 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-950 dark:text-red-200'
                    }`}
                    role="alert"
                >
                    <span
                        className={`h-2 w-2 rounded-full ${
                            toast.type === 'success'
                                ? 'bg-emerald-500'
                                : 'bg-red-500'
                        }`}
                    />
                    <span className="font-mono">{toast.message}</span>
                    <button
                        type="button"
                        onClick={() => setToast(null)}
                        className="ml-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
                        aria-label="Dismiss toast"
                    >
                        &times;
                    </button>
                </div>
            )}

            {/* Page Header */}
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="font-serif text-2xl font-light text-stone-900 sm:text-3xl dark:text-stone-100">
                        Site Configuration & Settings
                    </h1>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        Configure brand identity, architectural media
                        references, public contact channels, and search engine
                        defaults for ELIOR Natural Stones.
                    </p>
                </div>

                {hasUnsavedChangesInCurrentTab && (
                    <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 border border-amber-300 bg-amber-50 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider text-amber-800 uppercase dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                            Unsaved Changes
                        </span>
                    </div>
                )}
            </div>

            {/* Category Tabs */}
            <div className="mb-8 border-b border-stone-200 dark:border-stone-800">
                <nav
                    className="flex space-x-2 overflow-x-auto pb-px"
                    aria-label="Settings Categories"
                >
                    {CATEGORY_TABS.map((tab) => {
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`min-h-[44px] border-b-2 px-4 py-2 font-mono text-xs font-medium tracking-wider whitespace-nowrap uppercase transition-colors ${
                                    isActive
                                        ? 'border-stone-900 font-semibold text-stone-900 dark:border-stone-100 dark:text-stone-100'
                                        : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-700 dark:text-stone-400 dark:hover:border-stone-700 dark:hover:text-stone-200'
                                }`}
                            >
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Category Editor Container */}
            <div className="border border-stone-200 bg-white shadow-xs dark:border-stone-800 dark:bg-stone-900">
                {/* Category Header */}
                <div className="border-b border-stone-100 px-6 py-5 dark:border-stone-800">
                    <h2 className="font-serif text-lg font-light text-stone-900 dark:text-stone-100">
                        {activeCategory.label}
                    </h2>
                    <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                        {activeCategory.description}
                    </p>
                </div>

                {/* Form Fields Body */}
                <div className="space-y-6 p-6 sm:p-8">
                    {activeTab === 'general' && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Site Name */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Site Name{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formValues.site_name || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'site_name',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ELIOR"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.site_name && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.site_name}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Official title rendered in browser headers
                                    and brand signatures.
                                </p>
                            </div>

                            {/* Brand Descriptor */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Brand Descriptor Tagline
                                </label>
                                <input
                                    type="text"
                                    value={formValues.brand_descriptor || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'brand_descriptor',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Natural Stones"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.brand_descriptor && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.brand_descriptor}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Architectural positioning subtitle for
                                    editorial displays.
                                </p>
                            </div>

                            {/* Default Location */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Default Studio Location
                                </label>
                                <input
                                    type="text"
                                    value={formValues.default_location || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'default_location',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Hyderabad, India"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.default_location && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.default_location}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Primary headquarters city and geographic
                                    origin.
                                </p>
                            </div>

                            {/* Primary Phone */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Primary Telephone Line
                                </label>
                                <input
                                    type="text"
                                    value={formValues.primary_phone || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'primary_phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+91 81259 58071"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.primary_phone && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.primary_phone}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Direct telephone number linked in site
                                    footers and mobile menus.
                                </p>
                            </div>

                            {/* Primary Email */}
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Primary Contact Email Address{' '}
                                    <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={formValues.primary_email || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'primary_email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="info@eliornaturalstones.com"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.primary_email && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.primary_email}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Official email destination for general trade
                                    inquiries and correspondence.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'branding' && (
                        <div className="space-y-6">
                            {/* Logo Reference */}
                            <div className="border border-stone-200/80 bg-stone-50/40 p-5 dark:border-stone-800 dark:bg-stone-950/40">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-mono text-xs font-semibold tracking-wider text-stone-900 uppercase dark:text-stone-100">
                                            Architectural Brand Logo
                                        </h3>
                                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                            Vector or high-resolution logo mark
                                            assigned from the Media Library.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveMediaKey(
                                                    'logo_media_id',
                                                )
                                            }
                                            className="border border-stone-300 bg-white px-3.5 py-1.5 font-mono text-xs tracking-wider text-stone-800 uppercase hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                                        >
                                            {formValues.logo_media_id
                                                ? 'Replace Logo'
                                                : 'Choose From Media Library'}
                                        </button>
                                        {formValues.logo_media_id && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleClearMedia(
                                                        'logo_media_id',
                                                    )
                                                }
                                                className="border border-red-200 px-3 py-1.5 font-mono text-xs text-red-600 uppercase hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {formValues.logo_media_id && (
                                    <div className="mt-4 flex items-center gap-4 rounded-none border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                                        <div className="flex h-16 w-28 items-center justify-center overflow-hidden border border-stone-100 bg-stone-100 p-2 dark:border-stone-800 dark:bg-stone-800">
                                            <img
                                                src={
                                                    formValues.logo_media_id
                                                        .url ||
                                                    formValues.logo_media_id
                                                }
                                                alt="ELIOR Logo"
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <div className="truncate font-mono text-xs text-stone-600 dark:text-stone-300">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">
                                                {formValues.logo_media_id
                                                    .name ||
                                                    'Logo Asset Assigned'}
                                            </p>
                                            <p className="text-[10px] text-stone-400">
                                                {formValues.logo_media_id.url ||
                                                    ''}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Favicon Reference */}
                            <div className="border border-stone-200/80 bg-stone-50/40 p-5 dark:border-stone-800 dark:bg-stone-950/40">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-mono text-xs font-semibold tracking-wider text-stone-900 uppercase dark:text-stone-100">
                                            Favicon Asset
                                        </h3>
                                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                            Square icon rendered in browser tabs
                                            and bookmark drawers.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveMediaKey(
                                                    'favicon_media_id',
                                                )
                                            }
                                            className="border border-stone-300 bg-white px-3.5 py-1.5 font-mono text-xs tracking-wider text-stone-800 uppercase hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                                        >
                                            {formValues.favicon_media_id
                                                ? 'Replace Favicon'
                                                : 'Choose From Media Library'}
                                        </button>
                                        {formValues.favicon_media_id && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleClearMedia(
                                                        'favicon_media_id',
                                                    )
                                                }
                                                className="border border-red-200 px-3 py-1.5 font-mono text-xs text-red-600 uppercase hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {formValues.favicon_media_id && (
                                    <div className="mt-4 flex items-center gap-4 border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                                        <div className="flex h-12 w-12 items-center justify-center overflow-hidden border border-stone-100 bg-stone-100 p-1 dark:border-stone-800 dark:bg-stone-800">
                                            <img
                                                src={
                                                    formValues.favicon_media_id
                                                        .url ||
                                                    formValues.favicon_media_id
                                                }
                                                alt="Favicon"
                                                className="h-8 w-8 object-contain"
                                            />
                                        </div>
                                        <div className="truncate font-mono text-xs text-stone-600 dark:text-stone-300">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">
                                                {formValues.favicon_media_id
                                                    .name ||
                                                    'Favicon Asset Assigned'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Default Social Share Image */}
                            <div className="border border-stone-200/80 bg-stone-50/40 p-5 dark:border-stone-800 dark:bg-stone-950/40">
                                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <h3 className="font-mono text-xs font-semibold tracking-wider text-stone-900 uppercase dark:text-stone-100">
                                            Default Social Share Card
                                        </h3>
                                        <p className="mt-0.5 text-xs text-stone-500 dark:text-stone-400">
                                            Global fallback image when content
                                            is shared on WhatsApp, LinkedIn, or
                                            Twitter.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setActiveMediaKey(
                                                    'default_share_image_id',
                                                )
                                            }
                                            className="border border-stone-300 bg-white px-3.5 py-1.5 font-mono text-xs tracking-wider text-stone-800 uppercase hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700"
                                        >
                                            {formValues.default_share_image_id
                                                ? 'Replace Image'
                                                : 'Choose From Media Library'}
                                        </button>
                                        {formValues.default_share_image_id && (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleClearMedia(
                                                        'default_share_image_id',
                                                    )
                                                }
                                                className="border border-red-200 px-3 py-1.5 font-mono text-xs text-red-600 uppercase hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/30"
                                            >
                                                Clear
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {formValues.default_share_image_id && (
                                    <div className="mt-4 flex items-center gap-4 border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                                        <div className="flex h-20 w-36 items-center justify-center overflow-hidden border border-stone-100 bg-stone-100 dark:border-stone-800 dark:bg-stone-800">
                                            <img
                                                src={
                                                    formValues
                                                        .default_share_image_id
                                                        .url ||
                                                    formValues.default_share_image_id
                                                }
                                                alt="Social Share Card"
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="truncate font-mono text-xs text-stone-600 dark:text-stone-300">
                                            <p className="font-semibold text-stone-900 dark:text-stone-100">
                                                {formValues
                                                    .default_share_image_id
                                                    .name ||
                                                    'Social Card Assigned'}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'contact' && (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Enquiry Phone */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Enquiry & Dispatch Phone
                                </label>
                                <input
                                    type="text"
                                    value={formValues.enquiry_phone || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'enquiry_phone',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="+91 81259 58071"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.enquiry_phone && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.enquiry_phone}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Dedicated line for trade inquiries and
                                    sample box coordinates.
                                </p>
                            </div>

                            {/* Enquiry Email */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Enquiry & Specification Email
                                </label>
                                <input
                                    type="email"
                                    value={formValues.enquiry_email || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'enquiry_email',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="info@eliornaturalstones.com"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.enquiry_email && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.enquiry_email}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Routing address displayed in the public
                                    contact directory.
                                </p>
                            </div>

                            {/* Business Location */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Showroom & Gallery Address
                                </label>
                                <input
                                    type="text"
                                    value={formValues.business_location || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'business_location',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Hyderabad, India"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.business_location && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.business_location}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Physical gallery location for architectural
                                    consultations.
                                </p>
                            </div>

                            {/* Availability Text */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Viewing & Appointment Policy
                                </label>
                                <input
                                    type="text"
                                    value={formValues.availability_text || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'availability_text',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Private Viewings by Appointment"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.availability_text && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.availability_text}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Policy notice rendered beneath the gallery
                                    address.
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'seo' && (
                        <div className="space-y-6">
                            {/* Default Meta Title */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                        Fallback Meta Title
                                    </label>
                                    <span className="font-mono text-[10px] text-stone-400">
                                        {
                                            (
                                                formValues.default_meta_title ||
                                                ''
                                            ).length
                                        }{' '}
                                        / 60 characters
                                    </span>
                                </div>
                                <input
                                    type="text"
                                    value={formValues.default_meta_title || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'default_meta_title',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ELIOR Natural Stones — Curated Architectural Stone"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.default_meta_title && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.default_meta_title}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Fallback browser tab and search snippet
                                    title if no page-level title is defined.
                                </p>
                            </div>

                            {/* Default Meta Description */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                        Fallback Meta Description
                                    </label>
                                    <span className="font-mono text-[10px] text-stone-400">
                                        {
                                            (
                                                formValues.default_meta_description ||
                                                ''
                                            ).length
                                        }{' '}
                                        / 160 characters
                                    </span>
                                </div>
                                <textarea
                                    rows={3}
                                    value={
                                        formValues.default_meta_description ||
                                        ''
                                    }
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'default_meta_description',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="ELIOR curates eight canonical natural stone collections..."
                                    className="w-full border border-stone-300 bg-white p-3.5 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.default_meta_description && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.default_meta_description}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Search engine snippet summary when no
                                    specific page description exists.
                                </p>
                            </div>

                            {/* Google Search Result Live Preview */}
                            <div className="border border-stone-200 bg-stone-50/70 p-5 dark:border-stone-800 dark:bg-stone-950/60">
                                <span className="font-mono text-[10px] tracking-widest text-stone-500 uppercase dark:text-stone-400">
                                    Google Search Snippet Preview
                                </span>
                                <div className="mt-3 space-y-1">
                                    <span className="block font-mono text-xs text-stone-400">
                                        https://eliornaturalstones.com
                                    </span>
                                    <h4 className="cursor-pointer font-serif text-base text-blue-800 hover:underline dark:text-blue-400">
                                        {formValues.default_meta_title ||
                                            'ELIOR Natural Stones — Curated Architectural Stone'}
                                    </h4>
                                    <p className="line-clamp-2 text-xs text-stone-600 dark:text-stone-400">
                                        {formValues.default_meta_description ||
                                            'ELIOR curates eight canonical natural stone collections for discerning architects, interior designers, and luxury private residences.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'social' && (
                        <div className="space-y-6">
                            {/* Instagram */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Instagram Profile URL
                                </label>
                                <input
                                    type="url"
                                    value={formValues.instagram_url || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'instagram_url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://instagram.com/eliornaturalstones"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.instagram_url && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.instagram_url}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Official studio profile link for visual
                                    architectural stone portfolios.
                                </p>
                            </div>

                            {/* LinkedIn */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    LinkedIn Company URL
                                </label>
                                <input
                                    type="url"
                                    value={formValues.linkedin_url || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'linkedin_url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://linkedin.com/company/eliornaturalstones"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.linkedin_url && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.linkedin_url}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Corporate presence for architect and
                                    developer B2B dialogue.
                                </p>
                            </div>

                            {/* Pinterest */}
                            <div>
                                <label className="mb-1.5 block font-mono text-[11px] font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                    Pinterest Showcase URL
                                </label>
                                <input
                                    type="url"
                                    value={formValues.pinterest_url || ''}
                                    onChange={(e) =>
                                        handleFieldChange(
                                            'pinterest_url',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://pinterest.com/eliornaturalstones"
                                    className="min-h-[44px] w-full border border-stone-300 bg-white px-3.5 py-2 font-mono text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-950 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                                {fieldErrors.pinterest_url && (
                                    <p className="mt-1 font-mono text-[11px] text-red-600 dark:text-red-400">
                                        {fieldErrors.pinterest_url}
                                    </p>
                                )}
                                <p className="mt-1 font-mono text-[10px] text-stone-400">
                                    Material moodboards and texture palettes.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Save Actions */}
                <div className="flex items-center justify-between border-t border-stone-200 bg-stone-50/60 px-6 py-4 dark:border-stone-800 dark:bg-stone-950/60">
                    <div>
                        {hasUnsavedChangesInCurrentTab && (
                            <button
                                type="button"
                                onClick={handleResetTab}
                                disabled={isSaving}
                                className="font-mono text-xs text-stone-500 underline transition-colors hover:text-stone-900 disabled:opacity-40 dark:text-stone-400 dark:hover:text-stone-100"
                            >
                                Discard Unsaved Changes
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={handleSaveTab}
                            disabled={
                                isSaving || !hasUnsavedChangesInCurrentTab
                            }
                            className="inline-flex min-h-[40px] items-center gap-2 border border-transparent bg-stone-900 px-5 py-2 font-mono text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 disabled:opacity-40 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                        >
                            {isSaving ? (
                                <>
                                    <svg
                                        className="h-3.5 w-3.5 animate-spin"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                        />
                                    </svg>
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save {activeCategory.label}</span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Media Picker Modal */}
            <AdminSettingsMediaPickerModal
                isOpen={activeMediaKey !== null}
                onClose={() => setActiveMediaKey(null)}
                onSelect={handleSelectMedia}
                currentId={
                    activeMediaKey && formValues[activeMediaKey]?.id
                        ? formValues[activeMediaKey].id
                        : null
                }
                title={
                    activeMediaKey === 'logo_media_id'
                        ? 'Select Brand Logo'
                        : activeMediaKey === 'favicon_media_id'
                          ? 'Select Favicon Icon'
                          : 'Select Social Share Image'
                }
            />
        </AdminLayout>
    );
}
