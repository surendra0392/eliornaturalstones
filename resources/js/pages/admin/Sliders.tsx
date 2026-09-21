import { useState, type FormEvent } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { AdminCard } from '../../components/admin/ui/AdminCard';
import {
    AdminTable,
    AdminTableHeader,
    AdminTableBody,
    AdminTableRow,
    AdminTableHead,
    AdminTableCell,
} from '../../components/admin/ui/AdminTable';
import { AdminInput } from '../../components/admin/ui/AdminInput';
import { AdminTextarea } from '../../components/admin/ui/AdminTextarea';
import { AdminModal } from '../../components/admin/ui/AdminModal';
import { AdminEmptyState } from '../../components/admin/ui/AdminEmptyState';
import { apiClient, ApiError } from '../../api/client';
import type { Slider, TransitionType } from '../../types/slider';

interface SlidersAdminProps {
    initialSliders?: Slider[];
}

export default function SlidersAdmin({
    initialSliders = [],
}: SlidersAdminProps) {
    const [sliders, setSliders] = useState<Slider[]>(initialSliders);
    const [isLoading, setIsLoading] = useState(false);
    const [actionError, setActionError] = useState<string | null>(null);

    // Create / Edit modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        description: '',
        status: 'published' as 'published' | 'draft',
        settings: {
            autoplay: true,
            autoplay_interval: 6500,
            pause_on_hover: true,
            loop: true,
            navigation: true,
            pagination: true,
            progress_bar: true,
            keyboard_nav: true,
            touch_swipe: true,
            default_transition: 'fade' as TransitionType,
            transition_duration: 0.8,
        },
    });

    // Delete confirmation state
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [sliderToDelete, setSliderToDelete] = useState<Slider | null>(null);

    const refreshSliders = async () => {
        try {
            setIsLoading(true);
            const res = await apiClient<Slider[]>('/api/v1/admin/sliders');
            if (res.data) {
                setSliders(res.data);
            }
        } catch (err) {
            console.error('Failed to load sliders', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpenCreate = () => {
        setEditingSlider(null);
        setFormData({
            name: '',
            slug: '',
            description: '',
            status: 'published',
            settings: {
                autoplay: true,
                autoplay_interval: 6500,
                pause_on_hover: true,
                loop: true,
                navigation: true,
                pagination: true,
                progress_bar: true,
                keyboard_nav: true,
                touch_swipe: true,
                default_transition: 'fade',
                transition_duration: 0.8,
            },
        });
        setActionError(null);
        setModalOpen(true);
    };

    const handleOpenEdit = (slider: Slider) => {
        setEditingSlider(slider);
        setFormData({
            name: slider.name,
            slug: slider.slug,
            description: slider.description || '',
            status: slider.status,
            settings: {
                autoplay: slider.settings?.autoplay ?? true,
                autoplay_interval: slider.settings?.autoplay_interval ?? 6500,
                pause_on_hover: slider.settings?.pause_on_hover ?? true,
                loop: slider.settings?.loop ?? true,
                navigation: slider.settings?.navigation ?? true,
                pagination: slider.settings?.pagination ?? true,
                progress_bar: slider.settings?.progress_bar ?? true,
                keyboard_nav: slider.settings?.keyboard_nav ?? true,
                touch_swipe: slider.settings?.touch_swipe ?? true,
                default_transition:
                    slider.settings?.default_transition ?? 'fade',
                transition_duration:
                    slider.settings?.transition_duration ?? 0.8,
            },
        });
        setActionError(null);
        setModalOpen(true);
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setActionError(null);
        setIsLoading(true);

        try {
            if (editingSlider) {
                await apiClient(`/api/v1/admin/sliders/${editingSlider.id}`, {
                    method: 'PATCH',
                    body: JSON.stringify(formData),
                });
            } else {
                await apiClient('/api/v1/admin/sliders', {
                    method: 'POST',
                    body: JSON.stringify(formData),
                });
            }

            setModalOpen(false);
            await refreshSliders();
        } catch (err) {
            if (err instanceof ApiError) {
                setActionError(err.message || 'Failed to save slider.');
            } else {
                setActionError('An unexpected error occurred.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleDuplicate = async (slider: Slider) => {
        try {
            setIsLoading(true);
            await apiClient(`/api/v1/admin/sliders/${slider.id}/duplicate`, {
                method: 'POST',
            });
            await refreshSliders();
        } catch (err) {
            console.error('Failed to duplicate slider', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteConfirm = async () => {
        if (!sliderToDelete) return;
        try {
            setIsLoading(true);
            await apiClient(`/api/v1/admin/sliders/${sliderToDelete.id}`, {
                method: 'DELETE',
            });
            setDeleteModalOpen(false);
            setSliderToDelete(null);
            await refreshSliders();
        } catch (err) {
            console.error('Failed to delete slider', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AdminLayout title="Sliders & Architectural Presentations">
            <Head title="Admin — Sliders" />

            <div className="space-y-6">
                {/* Header & Controls */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-serif text-2xl font-light tracking-tight text-stone-900 sm:text-3xl dark:text-stone-100">
                            Hero Sliders Engine
                        </h1>
                        <p className="mt-1 text-xs text-stone-500 dark:text-stone-400">
                            Create, customize and visually orchestrate
                            multi-layer architectural presentations.
                        </p>
                    </div>

                    <AdminButton variant="primary" onClick={handleOpenCreate}>
                        + Create New Slider
                    </AdminButton>
                </div>

                {/* Sliders Table */}
                <AdminCard>
                    {sliders.length === 0 ? (
                        <AdminEmptyState
                            title="No sliders configured"
                            description="Create your first architectural presentation slider to begin."
                            action={
                                <AdminButton onClick={handleOpenCreate}>
                                    Create Slider
                                </AdminButton>
                            }
                        />
                    ) : (
                        <AdminTable>
                            <AdminTableHeader>
                                <AdminTableRow>
                                    <AdminTableHead>
                                        Slider Name & Slug
                                    </AdminTableHead>
                                    <AdminTableHead>Status</AdminTableHead>
                                    <AdminTableHead>
                                        Slides Count
                                    </AdminTableHead>
                                    <AdminTableHead>Autoplay</AdminTableHead>
                                    <AdminTableHead>
                                        Default Transition
                                    </AdminTableHead>
                                    <AdminTableHead className="text-right">
                                        Actions
                                    </AdminTableHead>
                                </AdminTableRow>
                            </AdminTableHeader>
                            <AdminTableBody>
                                {sliders.map((slider) => (
                                    <AdminTableRow key={slider.id}>
                                        <AdminTableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-stone-900 dark:text-stone-100">
                                                    {slider.name}
                                                </span>
                                                <span className="font-mono text-[11px] text-stone-400">
                                                    slug: {slider.slug}
                                                </span>
                                            </div>
                                        </AdminTableCell>

                                        <AdminTableCell>
                                            <AdminBadge
                                                variant={
                                                    slider.status ===
                                                    'published'
                                                        ? 'success'
                                                        : 'neutral'
                                                }
                                            >
                                                {slider.status.toUpperCase()}
                                            </AdminBadge>
                                        </AdminTableCell>

                                        <AdminTableCell>
                                            <span className="font-mono text-xs">
                                                {slider.published_slides_count ??
                                                    slider.slides_count ??
                                                    0}{' '}
                                                active /{' '}
                                                {slider.slides_count ?? 0} total
                                            </span>
                                        </AdminTableCell>

                                        <AdminTableCell>
                                            <span className="text-xs text-stone-600 dark:text-stone-400">
                                                {slider.settings?.autoplay
                                                    ? `Yes (${slider.settings?.autoplay_interval ?? 6000}ms)`
                                                    : 'Disabled'}
                                            </span>
                                        </AdminTableCell>

                                        <AdminTableCell>
                                            <span className="font-mono text-xs text-stone-500 uppercase">
                                                {slider.settings
                                                    ?.default_transition ??
                                                    'fade'}
                                            </span>
                                        </AdminTableCell>

                                        <AdminTableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/sliders/${slider.id}/editor`}
                                                    className="inline-flex items-center rounded-none border border-stone-800 bg-stone-900 px-3 py-1.5 text-xs font-medium tracking-wider text-white uppercase transition-colors hover:bg-stone-800 dark:border-stone-200 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200"
                                                >
                                                    Visual Editor &rarr;
                                                </Link>

                                                <AdminButton
                                                    variant="secondary"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleOpenEdit(slider)
                                                    }
                                                >
                                                    Settings
                                                </AdminButton>

                                                <AdminButton
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() =>
                                                        handleDuplicate(slider)
                                                    }
                                                    title="Duplicate Slider"
                                                >
                                                    Clone
                                                </AdminButton>

                                                <AdminButton
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSliderToDelete(
                                                            slider,
                                                        );
                                                        setDeleteModalOpen(
                                                            true,
                                                        );
                                                    }}
                                                    title="Delete Slider"
                                                >
                                                    Delete
                                                </AdminButton>
                                            </div>
                                        </AdminTableCell>
                                    </AdminTableRow>
                                ))}
                            </AdminTableBody>
                        </AdminTable>
                    )}
                </AdminCard>
            </div>

            {/* Create / Edit Settings Modal */}
            <AdminModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={
                    editingSlider
                        ? `Edit Slider: ${editingSlider.name}`
                        : 'Create Architectural Slider'
                }
                maxWidth="xl"
            >
                <form onSubmit={handleFormSubmit} className="space-y-4">
                    {actionError && (
                        <div className="rounded-none border border-red-200 bg-red-50 p-3 text-xs text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300">
                            {actionError}
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AdminInput
                            label="Slider Name"
                            value={formData.name}
                            onChange={(e) => {
                                const val = e.target.value;
                                setFormData((prev) => ({
                                    ...prev,
                                    name: val,
                                    slug: !editingSlider
                                        ? val
                                              .toLowerCase()
                                              .replace(/[^a-z0-9]+/g, '-')
                                              .replace(/(^-|-$)/g, '')
                                        : prev.slug,
                                }));
                            }}
                            required
                        />

                        <AdminInput
                            label="Slug (Unique URL identifier)"
                            value={formData.slug}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    slug: e.target.value,
                                })
                            }
                            required
                        />
                    </div>

                    <AdminTextarea
                        label="Description (Internal Purpose)"
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                description: e.target.value,
                            })
                        }
                        rows={2}
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                            <label className="block text-xs font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                Status
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        status: e.target.value as
                                            | 'published'
                                            | 'draft',
                                    })
                                }
                                className="mt-1.5 block w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                            >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium tracking-wider text-stone-700 uppercase dark:text-stone-300">
                                Default Transition
                            </label>
                            <select
                                value={formData.settings.default_transition}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        settings: {
                                            ...formData.settings,
                                            default_transition: e.target
                                                .value as any,
                                        },
                                    })
                                }
                                className="mt-1.5 block w-full border border-stone-300 bg-white px-3 py-2 text-xs text-stone-900 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                            >
                                <option value="fade">Fade</option>
                                <option value="slide">Horizontal Slide</option>
                                <option value="crossfade">Crossfade</option>
                                <option value="cinematic">
                                    Cinematic Reveal
                                </option>
                            </select>
                        </div>

                        <AdminInput
                            type="number"
                            label="Autoplay Interval (ms)"
                            value={formData.settings.autoplay_interval}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    settings: {
                                        ...formData.settings,
                                        autoplay_interval:
                                            parseInt(e.target.value) || 6000,
                                    },
                                })
                            }
                            min={1000}
                            step={500}
                        />
                    </div>

                    {/* Checkbox Options */}
                    <div className="border-t border-stone-200 pt-3 dark:border-stone-800">
                        <span className="text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                            Playback & Interaction Controls
                        </span>
                        <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-3">
                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.autoplay}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                autoplay: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Autoplay Enabled
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.pause_on_hover}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                pause_on_hover:
                                                    e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Pause on Hover
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.loop}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                loop: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Infinite Loop
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.navigation}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                navigation: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Prev / Next Arrows
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.pagination}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                pagination: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Dot Indicators
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.progress_bar}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                progress_bar: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Progress Bar
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.keyboard_nav}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                keyboard_nav: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Keyboard Navigation
                            </label>

                            <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                <input
                                    type="checkbox"
                                    checked={formData.settings.touch_swipe}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            settings: {
                                                ...formData.settings,
                                                touch_swipe: e.target.checked,
                                            },
                                        })
                                    }
                                    className="rounded-none border-stone-300"
                                />
                                Touch / Swipe
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <AdminButton
                            variant="secondary"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            variant="primary"
                            type="submit"
                            isLoading={isLoading}
                        >
                            {editingSlider ? 'Save Settings' : 'Create Slider'}
                        </AdminButton>
                    </div>
                </form>
            </AdminModal>

            {/* Delete Confirmation Modal */}
            <AdminModal
                isOpen={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                title="Confirm Deletion"
                maxWidth="md"
            >
                <div className="space-y-4">
                    <p className="text-xs leading-relaxed text-stone-600 dark:text-stone-400">
                        Are you sure you want to delete{' '}
                        <strong className="text-stone-900 dark:text-stone-100">
                            {sliderToDelete?.name}
                        </strong>
                        ? All child slides and layers will be permanently
                        removed.
                    </p>

                    <div className="flex justify-end gap-2 pt-2">
                        <AdminButton
                            variant="secondary"
                            onClick={() => setDeleteModalOpen(false)}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            variant="danger"
                            onClick={handleDeleteConfirm}
                            isLoading={isLoading}
                        >
                            Delete Slider
                        </AdminButton>
                    </div>
                </div>
            </AdminModal>
        </AdminLayout>
    );
}
