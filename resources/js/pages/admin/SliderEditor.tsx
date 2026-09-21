import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { AdminButton } from '../../components/admin/ui/AdminButton';
import { AdminBadge } from '../../components/admin/ui/AdminBadge';
import { apiClient } from '../../api/client';
import type { Slider, Slide, SlideLayer, LayerType } from '../../types/slider';

interface SliderEditorProps {
    initialSlider: Slider;
}

function normalizeSlider(raw: Slider | Record<string, unknown>): Slider {
    if (!raw) return raw as Slider;
    const rawSlides = (raw as { slides?: Slide[] | { data?: Slide[] } }).slides;
    const slides: Slide[] = Array.isArray(rawSlides)
        ? rawSlides
        : (rawSlides?.data ?? []);
    return {
        ...(raw as Slider),
        slides: slides.map((s) => {
            const rawLayers = (
                s as { layers?: SlideLayer[] | { data?: SlideLayer[] } }
            ).layers;
            const layers: SlideLayer[] = Array.isArray(rawLayers)
                ? rawLayers
                : (rawLayers?.data ?? []);
            return {
                ...s,
                layers,
            };
        }),
    };
}

export default function SliderEditor({ initialSlider }: SliderEditorProps) {
    const [slider, setSlider] = useState<Slider>(() =>
        normalizeSlider(initialSlider),
    );
    const [activeSlideIndex, setActiveSlideIndex] = useState<number>(0);
    const [selectedLayerId, setSelectedLayerId] = useState<number | null>(null);
    const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>(
        'desktop',
    );
    const [isSaving, setIsSaving] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const [animationKey, setAnimationKey] = useState(0);

    const activeSlide: Slide | undefined = slider.slides?.[activeSlideIndex];
    const selectedLayer: SlideLayer | undefined = activeSlide?.layers?.find(
        (l) => l.id === selectedLayerId,
    );

    // Reload full slider data from server
    const reloadSlider = async () => {
        try {
            const res = await apiClient<Slider>(
                `/api/v1/admin/sliders/${slider.id}`,
            );
            if (res.data) {
                setSlider(normalizeSlider(res.data));
            }
        } catch (err) {
            console.error('Failed to reload slider', err);
        }
    };

    const showSuccess = (msg: string) => {
        setStatusMessage(msg);
        setErrorMessage(null);
        setTimeout(() => setStatusMessage(null), 3000);
    };

    const showError = (msg: string) => {
        setErrorMessage(msg);
        setStatusMessage(null);
    };

    // ==========================================
    // Slide Actions
    // ==========================================
    const handleAddSlide = async () => {
        try {
            setIsSaving(true);
            await apiClient<Slide>(
                `/api/v1/admin/sliders/${slider.id}/slides`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        title: `Slide ${String((slider.slides?.length ?? 0) + 1).padStart(2, '0')}`,
                        status: 'published',
                        background_type: 'image',
                        background_image:
                            '/images/elior/homepage/homepage-hero.webp',
                        background_color: '#0F0F0F',
                        overlay_type: 'gradient',
                        overlay_opacity: 45,
                        content_alignment: 'left',
                        content_width: 'standard',
                        vertical_position: 'center',
                        parallax_enabled: true,
                        parallax_intensity: 0.15,
                    }),
                },
            );

            await reloadSlider();
            if (slider.slides) {
                setActiveSlideIndex(slider.slides.length);
            }
            showSuccess('New slide created.');
        } catch {
            showError('Failed to create slide.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDuplicateSlide = async (slideId: number) => {
        try {
            setIsSaving(true);
            await apiClient(`/api/v1/admin/slides/${slideId}/duplicate`, {
                method: 'POST',
            });
            await reloadSlider();
            showSuccess('Slide duplicated.');
        } catch {
            showError('Failed to duplicate slide.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteSlide = async (slideId: number) => {
        if ((slider.slides?.length ?? 0) <= 1) {
            showError('Cannot delete the only slide in a presentation.');
            return;
        }
        if (!confirm('Are you sure you want to delete this slide?')) return;

        try {
            setIsSaving(true);
            await apiClient(`/api/v1/admin/slides/${slideId}`, {
                method: 'DELETE',
            });
            await reloadSlider();
            setActiveSlideIndex(0);
            setSelectedLayerId(null);
            showSuccess('Slide deleted.');
        } catch {
            showError('Failed to delete slide.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleSlidePropertyChange = async (key: keyof Slide, value: any) => {
        if (!activeSlide) return;

        // Optimistic UI update
        const updatedSlides = [...(slider.slides || [])];
        updatedSlides[activeSlideIndex] = {
            ...activeSlide,
            [key]: value,
        };
        setSlider({ ...slider, slides: updatedSlides });

        try {
            await apiClient(`/api/v1/admin/slides/${activeSlide.id}`, {
                method: 'PATCH',
                body: JSON.stringify({ [key]: value }),
            });
            showSuccess('Slide updated.');
        } catch {
            showError('Failed to save slide change.');
            await reloadSlider();
        }
    };

    const handleReorderSlides = async (fromIndex: number, toIndex: number) => {
        if (!slider.slides || toIndex < 0 || toIndex >= slider.slides.length)
            return;

        const newSlides = [...slider.slides];
        const [moved] = newSlides.splice(fromIndex, 1);
        newSlides.splice(toIndex, 0, moved);

        setSlider({ ...slider, slides: newSlides });
        setActiveSlideIndex(toIndex);

        try {
            await apiClient(
                `/api/v1/admin/sliders/${slider.id}/reorder-slides`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        slide_ids: newSlides.map((s) => s.id),
                    }),
                },
            );
            showSuccess('Slides reordered.');
        } catch {
            showError('Failed to save slide order.');
            await reloadSlider();
        }
    };

    // ==========================================
    // Layer Actions
    // ==========================================
    const handleAddLayer = async (type: LayerType) => {
        if (!activeSlide) return;

        const layerDefaults: Record<LayerType, Partial<SlideLayer>> = {
            eyebrow: {
                name: 'Brand Eyebrow',
                content: {
                    text: 'ELIOR / NATURAL STONES',
                    color: '#D4B381',
                    font_family: 'Montserrat',
                },
                positioning: { horizontal_align: 'left' },
                animation: { entrance: 'fade-up', duration: 0.8, delay: 0.1 },
            },
            heading: {
                name: 'Slide Heading',
                content: {
                    text: 'Architectural Statement',
                    tag: 'h2',
                    color: '#FFFFFF',
                    font_family: 'Playfair Display',
                },
                positioning: { horizontal_align: 'left', max_width: '24ch' },
                animation: { entrance: 'fade-up', duration: 1.0, delay: 0.2 },
            },
            description: {
                name: 'Text Description',
                content: {
                    text: 'Natural stone selected with architectural intention.',
                    color: 'rgba(255,255,255,0.85)',
                    font_family: 'Montserrat',
                },
                positioning: { horizontal_align: 'left', max_width: '54ch' },
                animation: { entrance: 'fade-up', duration: 0.8, delay: 0.3 },
            },
            cta: {
                name: 'Action Buttons',
                content: {
                    primary_label: 'Explore Collections',
                    primary_url: '/collections',
                    primary_variant: 'primary',
                    secondary_label: 'Contact ELIOR',
                    secondary_url: '/contact',
                    secondary_variant: 'secondary',
                },
                positioning: { horizontal_align: 'left' },
                animation: { entrance: 'fade-up', duration: 0.8, delay: 0.4 },
            },
            decorative_shape: {
                name: 'Accent Divider Line',
                content: {
                    shape_type: 'line',
                    color: '#B9987A',
                    width: '48px',
                    height: '1px',
                },
                positioning: { horizontal_align: 'left' },
                animation: { entrance: 'scale-in', duration: 0.6, delay: 0.2 },
            },
            image: {
                name: 'Supporting Visual',
                content: {
                    src: '/images/elior/collections/italian-marble/hero.webp',
                    alt: 'Specimen',
                    width: '320px',
                },
                positioning: { horizontal_align: 'left' },
                animation: { entrance: 'fade-in', duration: 0.8, delay: 0.3 },
            },
            spacer: {
                name: 'Visual Spacer',
                content: { height: '24px' },
                positioning: { horizontal_align: 'left' },
                animation: { entrance: 'none' },
            },
        };

        const payload = {
            type,
            name: layerDefaults[type].name,
            sort_order: (activeSlide.layers?.length ?? 0) + 1,
            z_index: 10,
            is_visible: true,
            content: layerDefaults[type].content,
            positioning: layerDefaults[type].positioning,
            animation: layerDefaults[type].animation,
        };

        try {
            setIsSaving(true);
            const res = await apiClient<SlideLayer>(
                `/api/v1/admin/slides/${activeSlide.id}/layers`,
                {
                    method: 'POST',
                    body: JSON.stringify(payload),
                },
            );

            await reloadSlider();
            if (res.data) {
                setSelectedLayerId(res.data.id);
            }
            showSuccess(`Added ${type} layer.`);
        } catch {
            showError('Failed to add layer.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDuplicateLayer = async (layerId: number) => {
        try {
            setIsSaving(true);
            const res = await apiClient<SlideLayer>(
                `/api/v1/admin/layers/${layerId}/duplicate`,
                {
                    method: 'POST',
                },
            );
            await reloadSlider();
            if (res.data) {
                setSelectedLayerId(res.data.id);
            }
            showSuccess('Layer duplicated.');
        } catch {
            showError('Failed to duplicate layer.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLayer = async (layerId: number) => {
        if (!confirm('Are you sure you want to delete this layer?')) return;

        try {
            setIsSaving(true);
            await apiClient(`/api/v1/admin/layers/${layerId}`, {
                method: 'DELETE',
            });
            await reloadSlider();
            if (selectedLayerId === layerId) {
                setSelectedLayerId(null);
            }
            showSuccess('Layer deleted.');
        } catch {
            showError('Failed to delete layer.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleLayerPropertyChange = async (
        section:
            | 'content'
            | 'positioning'
            | 'animation'
            | 'responsive'
            | 'root',
        field: string,
        value: any,
    ) => {
        if (!selectedLayer || !activeSlide) return;

        let updatedLayer: SlideLayer;
        if (section === 'root') {
            updatedLayer = { ...selectedLayer, [field]: value };
        } else {
            updatedLayer = {
                ...selectedLayer,
                [section]: {
                    ...(selectedLayer as any)[section],
                    [field]: value,
                },
            };
        }

        // Optimistic UI update
        const updatedLayers = (activeSlide.layers || []).map((l) =>
            l.id === selectedLayer.id ? updatedLayer : l,
        );
        const updatedSlides = [...(slider.slides || [])];
        updatedSlides[activeSlideIndex] = {
            ...activeSlide,
            layers: updatedLayers,
        };
        setSlider({ ...slider, slides: updatedSlides });

        try {
            await apiClient(`/api/v1/admin/layers/${selectedLayer.id}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    [section === 'root' ? field : section]:
                        section === 'root' ? value : updatedLayer[section],
                }),
            });
        } catch {
            showError('Failed to save layer update.');
            await reloadSlider();
        }
    };

    const handleReorderLayers = async (fromIndex: number, toIndex: number) => {
        if (
            !activeSlide ||
            !activeSlide.layers ||
            toIndex < 0 ||
            toIndex >= activeSlide.layers.length
        )
            return;

        const newLayers = [...activeSlide.layers];
        const [moved] = newLayers.splice(fromIndex, 1);
        newLayers.splice(toIndex, 0, moved);

        const updatedSlides = [...(slider.slides || [])];
        updatedSlides[activeSlideIndex] = { ...activeSlide, layers: newLayers };
        setSlider({ ...slider, slides: updatedSlides });

        try {
            await apiClient(
                `/api/v1/admin/slides/${activeSlide.id}/reorder-layers`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        layer_ids: newLayers.map((l) => l.id),
                    }),
                },
            );
            showSuccess('Layers reordered.');
        } catch {
            showError('Failed to save layer order.');
            await reloadSlider();
        }
    };

    const triggerPreviewAnimation = () => {
        setAnimationKey((prev) => prev + 1);
        setIsPlayingPreview(true);
        setTimeout(() => setIsPlayingPreview(false), 1500);
    };

    return (
        <AdminLayout title={`Visual Editor: ${slider.name}`}>
            <Head title={`Admin — ${slider.name}`} />

            <div className="flex h-full flex-col space-y-4">
                {/* Top Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/sliders"
                            className="font-mono text-xs tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
                        >
                            &larr; Sliders
                        </Link>
                        <span className="text-stone-300 dark:text-stone-700">
                            |
                        </span>
                        <h2 className="font-serif text-lg font-light text-stone-900 dark:text-stone-100">
                            {slider.name}
                        </h2>
                        <AdminBadge
                            variant={
                                slider.status === 'published'
                                    ? 'success'
                                    : 'neutral'
                            }
                        >
                            {slider.status.toUpperCase()}
                        </AdminBadge>
                        {isSaving && (
                            <span className="text-champagne animate-pulse font-mono text-[11px] tracking-wider uppercase">
                                Saving...
                            </span>
                        )}
                    </div>

                    {/* Viewport Width Toggles */}
                    <div className="flex items-center gap-1 rounded-none border border-stone-200 bg-stone-100 p-0.5 dark:border-stone-700 dark:bg-stone-800">
                        <button
                            type="button"
                            onClick={() => setViewport('desktop')}
                            className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors ${
                                viewport === 'desktop'
                                    ? 'bg-white font-medium text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
                                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                            }`}
                        >
                            Desktop (1440)
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewport('tablet')}
                            className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors ${
                                viewport === 'tablet'
                                    ? 'bg-white font-medium text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
                                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                            }`}
                        >
                            Tablet (768)
                        </button>
                        <button
                            type="button"
                            onClick={() => setViewport('mobile')}
                            className={`px-3 py-1 text-xs tracking-wider uppercase transition-colors ${
                                viewport === 'mobile'
                                    ? 'bg-white font-medium text-stone-900 shadow-xs dark:bg-stone-900 dark:text-stone-100'
                                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                            }`}
                        >
                            Mobile (390)
                        </button>
                    </div>

                    {/* Status Feedback & Actions */}
                    <div className="flex items-center gap-2">
                        {statusMessage && (
                            <span className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                                ✓ {statusMessage}
                            </span>
                        )}
                        {errorMessage && (
                            <span className="font-mono text-xs text-red-600 dark:text-red-400">
                                ⚠ {errorMessage}
                            </span>
                        )}
                        <AdminButton
                            variant="secondary"
                            size="sm"
                            onClick={triggerPreviewAnimation}
                        >
                            ▶ Replay Animation
                        </AdminButton>
                    </div>
                </div>

                {/* 3-Column Studio Interface */}
                <div className="grid grid-cols-12 gap-4">
                    {/* Left Column (3 cols): Slide Navigator & Slide Settings */}
                    <div className="col-span-12 space-y-4 lg:col-span-3">
                        {/* Slide Deck Navigator */}
                        <div className="border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                            <div className="flex items-center justify-between pb-2">
                                <span className="font-mono text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                                    Slide Deck ({slider.slides?.length ?? 0})
                                </span>
                                <button
                                    type="button"
                                    onClick={handleAddSlide}
                                    className="font-mono text-xs font-semibold text-stone-900 hover:underline dark:text-stone-100"
                                >
                                    + Add Slide
                                </button>
                            </div>

                            <div className="space-y-2 pt-1">
                                {slider.slides?.map((s, idx) => (
                                    <div
                                        key={s.id}
                                        onClick={() => {
                                            setActiveSlideIndex(idx);
                                            setSelectedLayerId(null);
                                        }}
                                        className={`group relative cursor-pointer border p-2.5 transition-all ${
                                            activeSlideIndex === idx
                                                ? 'border-stone-900 bg-stone-100/90 dark:border-stone-100 dark:bg-stone-800'
                                                : 'border-stone-200 bg-white hover:border-stone-300 dark:border-stone-800 dark:bg-stone-900'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-[10px] text-stone-400">
                                                    0{idx + 1}
                                                </span>
                                                <span className="text-xs font-medium text-stone-900 dark:text-stone-100">
                                                    {s.title}
                                                </span>
                                            </div>
                                            <span
                                                className={`h-2 w-2 rounded-full ${
                                                    s.status === 'published'
                                                        ? 'bg-emerald-500'
                                                        : 'bg-stone-400'
                                                }`}
                                            />
                                        </div>

                                        <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
                                            <span>
                                                {s.layers?.length ?? 0} layers
                                            </span>
                                            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        void handleReorderSlides(
                                                            idx,
                                                            idx - 1,
                                                        );
                                                    }}
                                                    disabled={idx === 0}
                                                    className="px-1 hover:text-stone-900 disabled:opacity-30 dark:hover:text-stone-100"
                                                    title="Move Up"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        void handleReorderSlides(
                                                            idx,
                                                            idx + 1,
                                                        );
                                                    }}
                                                    disabled={
                                                        idx ===
                                                        (slider.slides
                                                            ?.length ?? 0) -
                                                            1
                                                    }
                                                    className="px-1 hover:text-stone-900 disabled:opacity-30 dark:hover:text-stone-100"
                                                    title="Move Down"
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        void handleDuplicateSlide(
                                                            s.id,
                                                        );
                                                    }}
                                                    className="px-1 hover:text-stone-900 dark:hover:text-stone-100"
                                                    title="Duplicate Slide"
                                                >
                                                    ⧉
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        void handleDeleteSlide(
                                                            s.id,
                                                        );
                                                    }}
                                                    className="px-1 text-red-500 hover:text-red-700"
                                                    title="Delete Slide"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Active Slide Settings */}
                        {activeSlide && (
                            <div className="space-y-3 border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                                <span className="font-mono text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                                    Slide Settings (0{activeSlideIndex + 1})
                                </span>

                                <div>
                                    <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                        Slide Title
                                    </label>
                                    <input
                                        type="text"
                                        value={activeSlide.title}
                                        onChange={(e) =>
                                            handleSlidePropertyChange(
                                                'title',
                                                e.target.value,
                                            )
                                        }
                                        className="mt-1 block w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                        Background Image URL
                                    </label>
                                    <input
                                        type="text"
                                        value={
                                            activeSlide.background_image || ''
                                        }
                                        onChange={(e) =>
                                            handleSlidePropertyChange(
                                                'background_image',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="/images/elior/homepage/homepage-hero.webp"
                                        className="mt-1 block w-full border border-stone-300 bg-white px-2.5 py-1.5 font-mono text-[11px] dark:border-stone-700 dark:bg-stone-800"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                            Overlay Type
                                        </label>
                                        <select
                                            value={activeSlide.overlay_type}
                                            onChange={(e) =>
                                                handleSlidePropertyChange(
                                                    'overlay_type',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full border border-stone-300 bg-white px-2 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                        >
                                            <option value="none">None</option>
                                            <option value="subtle">
                                                Subtle
                                            </option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="gradient">
                                                Gradient
                                            </option>
                                            <option value="dark">Dark</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                            Opacity (
                                            {activeSlide.overlay_opacity}%)
                                        </label>
                                        <input
                                            type="range"
                                            min={0}
                                            max={100}
                                            value={activeSlide.overlay_opacity}
                                            onChange={(e) =>
                                                handleSlidePropertyChange(
                                                    'overlay_opacity',
                                                    parseInt(e.target.value),
                                                )
                                            }
                                            className="mt-2 block w-full"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                            Content Align
                                        </label>
                                        <select
                                            value={
                                                activeSlide.content_alignment
                                            }
                                            onChange={(e) =>
                                                handleSlidePropertyChange(
                                                    'content_alignment',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full border border-stone-300 bg-white px-2 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                        >
                                            <option value="left">Left</option>
                                            <option value="center">
                                                Center
                                            </option>
                                            <option value="right">Right</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                            Status
                                        </label>
                                        <select
                                            value={activeSlide.status}
                                            onChange={(e) =>
                                                handleSlidePropertyChange(
                                                    'status',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full border border-stone-300 bg-white px-2 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                        >
                                            <option value="published">
                                                Published
                                            </option>
                                            <option value="draft">Draft</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Center Column (6 cols): Live Preview Canvas */}
                    <div className="col-span-12 flex flex-col items-center lg:col-span-6">
                        <div
                            className={`w-full overflow-hidden border border-stone-300 bg-stone-900 shadow-md transition-all duration-300 dark:border-stone-700 ${
                                viewport === 'mobile'
                                    ? 'min-h-[640px] max-w-[390px]'
                                    : viewport === 'tablet'
                                      ? 'min-h-[540px] max-w-[768px]'
                                      : 'min-h-[500px] w-full'
                            }`}
                        >
                            {/* Slide Canvas */}
                            {activeSlide ? (
                                <div
                                    key={animationKey}
                                    className="relative flex min-h-[500px] w-full flex-col justify-center overflow-hidden p-6 sm:p-10"
                                    style={{
                                        backgroundImage:
                                            activeSlide.background_image
                                                ? `url(${activeSlide.background_image})`
                                                : undefined,
                                        backgroundColor:
                                            activeSlide.background_color ||
                                            '#0F0F0F',
                                        backgroundPosition:
                                            activeSlide.background_position ||
                                            'center center',
                                        backgroundSize:
                                            activeSlide.background_size ||
                                            'cover',
                                    }}
                                >
                                    {/* Overlay Layer */}
                                    {activeSlide.overlay_type !== 'none' && (
                                        <div
                                            className={`pointer-events-none absolute inset-0 ${
                                                activeSlide.overlay_type ===
                                                'gradient'
                                                    ? 'bg-gradient-to-t from-black/80 via-black/30 to-black/10'
                                                    : activeSlide.overlay_type ===
                                                        'subtle'
                                                      ? 'bg-black/20'
                                                      : activeSlide.overlay_type ===
                                                          'medium'
                                                        ? 'bg-black/40'
                                                        : 'bg-black/60'
                                            }`}
                                            style={{
                                                opacity:
                                                    activeSlide.overlay_opacity /
                                                    100,
                                            }}
                                        />
                                    )}

                                    {/* Layers Container */}
                                    <div
                                        className={`relative z-10 w-full space-y-4 ${
                                            activeSlide.content_alignment ===
                                            'center'
                                                ? 'mx-auto text-center'
                                                : activeSlide.content_alignment ===
                                                    'right'
                                                  ? 'ml-auto text-right'
                                                  : 'text-left'
                                        }`}
                                        style={{
                                            maxWidth:
                                                activeSlide.content_width ===
                                                'compact'
                                                    ? '480px'
                                                    : activeSlide.content_width ===
                                                        'standard'
                                                      ? '680px'
                                                      : activeSlide.content_width ===
                                                          'wide'
                                                        ? '920px'
                                                        : '100%',
                                        }}
                                    >
                                        {activeSlide.layers?.map((layer) => {
                                            if (!layer.is_visible) return null;
                                            const isSelected =
                                                selectedLayerId === layer.id;

                                            return (
                                                <div
                                                    key={layer.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedLayerId(
                                                            layer.id,
                                                        );
                                                    }}
                                                    className={`cursor-pointer transition-all ${
                                                        isSelected
                                                            ? 'ring-champagne ring-2 ring-offset-2 ring-offset-black/50'
                                                            : 'hover:outline-1 hover:outline-white/50 hover:outline-dashed'
                                                    } ${isPlayingPreview ? 'animate-fade-in' : ''}`}
                                                    style={{
                                                        zIndex: layer.z_index,
                                                        opacity:
                                                            layer.positioning
                                                                ?.opacity ?? 1,
                                                        maxWidth:
                                                            layer.positioning
                                                                ?.max_width,
                                                    }}
                                                >
                                                    {/* Eyebrow Layer */}
                                                    {layer.type ===
                                                        'eyebrow' && (
                                                        <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.3em] uppercase sm:text-xs">
                                                            <span
                                                                style={{
                                                                    color:
                                                                        layer
                                                                            .content
                                                                            ?.color ||
                                                                        '#D4B381',
                                                                }}
                                                            >
                                                                {layer.content
                                                                    ?.text ||
                                                                    'ELIOR'}
                                                            </span>
                                                            {layer.content
                                                                ?.secondary_text && (
                                                                <>
                                                                    <span className="text-white/40">
                                                                        /
                                                                    </span>
                                                                    <span className="text-white/80">
                                                                        {
                                                                            layer
                                                                                .content
                                                                                .secondary_text
                                                                        }
                                                                    </span>
                                                                </>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Decorative Shape */}
                                                    {layer.type ===
                                                        'decorative_shape' && (
                                                        <div
                                                            style={{
                                                                backgroundColor:
                                                                    layer
                                                                        .content
                                                                        ?.color ||
                                                                    '#B9987A',
                                                                width:
                                                                    layer
                                                                        .content
                                                                        ?.width ||
                                                                    '48px',
                                                                height:
                                                                    layer
                                                                        .content
                                                                        ?.height ||
                                                                    '1px',
                                                            }}
                                                        />
                                                    )}

                                                    {/* Heading Layer */}
                                                    {layer.type ===
                                                        'heading' && (
                                                        <h2
                                                            className={`font-serif leading-[1.08] font-light tracking-tight ${
                                                                viewport ===
                                                                'mobile'
                                                                    ? 'text-2xl sm:text-3xl'
                                                                    : 'text-3xl sm:text-4xl lg:text-5xl'
                                                            }`}
                                                            style={{
                                                                color:
                                                                    layer
                                                                        .content
                                                                        ?.color ||
                                                                    '#FFFFFF',
                                                                fontFamily:
                                                                    layer
                                                                        .content
                                                                        ?.font_family ||
                                                                    'Playfair Display',
                                                            }}
                                                        >
                                                            {layer.content
                                                                ?.text ||
                                                                'Heading text'}
                                                        </h2>
                                                    )}

                                                    {/* Description Layer */}
                                                    {layer.type ===
                                                        'description' && (
                                                        <p
                                                            className="text-xs leading-relaxed font-light sm:text-sm"
                                                            style={{
                                                                color:
                                                                    layer
                                                                        .content
                                                                        ?.color ||
                                                                    'rgba(255,255,255,0.85)',
                                                                fontFamily:
                                                                    layer
                                                                        .content
                                                                        ?.font_family ||
                                                                    'Montserrat',
                                                            }}
                                                        >
                                                            {layer.content
                                                                ?.text ||
                                                                'Description text'}
                                                        </p>
                                                    )}

                                                    {/* CTA Layer */}
                                                    {layer.type === 'cta' && (
                                                        <div className="flex flex-wrap items-center gap-3 pt-2">
                                                            {layer.content
                                                                ?.primary_label && (
                                                                <span className="text-graphite inline-block border border-white bg-white px-4 py-2 text-[10px] font-medium tracking-[0.2em] uppercase shadow-xs sm:text-xs">
                                                                    {
                                                                        layer
                                                                            .content
                                                                            .primary_label
                                                                    }
                                                                </span>
                                                            )}
                                                            {layer.content
                                                                ?.secondary_label && (
                                                                <span className="inline-block border border-white/40 bg-white/10 px-4 py-2 text-[10px] font-medium tracking-[0.2em] text-white uppercase backdrop-blur-xs sm:text-xs">
                                                                    {
                                                                        layer
                                                                            .content
                                                                            .secondary_label
                                                                    }
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    {/* Image Layer */}
                                                    {layer.type === 'image' &&
                                                        layer.content?.src && (
                                                            <img
                                                                src={
                                                                    layer
                                                                        .content
                                                                        .src
                                                                }
                                                                alt={
                                                                    layer
                                                                        .content
                                                                        .alt ||
                                                                    'Layer asset'
                                                                }
                                                                className="object-cover shadow-md"
                                                                style={{
                                                                    width:
                                                                        layer
                                                                            .content
                                                                            .width ||
                                                                        '280px',
                                                                }}
                                                            />
                                                        )}

                                                    {/* Spacer */}
                                                    {layer.type ===
                                                        'spacer' && (
                                                        <div
                                                            style={{
                                                                height:
                                                                    layer
                                                                        .content
                                                                        ?.height ||
                                                                    '16px',
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex h-[400px] items-center justify-center text-stone-500">
                                    No slide selected.
                                </div>
                            )}
                        </div>

                        {/* Layer Timeline / Stack Bar */}
                        <div className="mt-3 w-full border border-stone-200 bg-white p-3 dark:border-stone-800 dark:bg-stone-900">
                            <div className="flex items-center justify-between pb-2">
                                <span className="font-mono text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                                    Layers Stack (
                                    {activeSlide?.layers?.length ?? 0})
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddLayer('eyebrow')
                                        }
                                        className="font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                    >
                                        + Eyebrow
                                    </button>
                                    <span className="text-stone-300 dark:text-stone-700">
                                        ·
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddLayer('heading')
                                        }
                                        className="font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                    >
                                        + Heading
                                    </button>
                                    <span className="text-stone-300 dark:text-stone-700">
                                        ·
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddLayer('description')
                                        }
                                        className="font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                    >
                                        + Text
                                    </button>
                                    <span className="text-stone-300 dark:text-stone-700">
                                        ·
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => handleAddLayer('cta')}
                                        className="font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                    >
                                        + CTA
                                    </button>
                                    <span className="text-stone-300 dark:text-stone-700">
                                        ·
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleAddLayer('decorative_shape')
                                        }
                                        className="font-mono text-[11px] text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
                                    >
                                        + Shape
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {activeSlide?.layers?.map((layer, idx) => (
                                    <div
                                        key={layer.id}
                                        onClick={() =>
                                            setSelectedLayerId(layer.id)
                                        }
                                        className={`flex cursor-pointer items-center gap-2 border px-2.5 py-1 text-xs transition-colors ${
                                            selectedLayerId === layer.id
                                                ? 'border-stone-900 bg-stone-900 text-white dark:border-stone-100 dark:bg-stone-100 dark:text-stone-900'
                                                : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-300'
                                        }`}
                                    >
                                        <span className="font-mono text-[10px] opacity-60">
                                            #{layer.sort_order}
                                        </span>
                                        <span>{layer.name}</span>
                                        <div className="ml-1 flex items-center gap-1 opacity-70">
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleReorderLayers(
                                                        idx,
                                                        idx - 1,
                                                    );
                                                }}
                                                disabled={idx === 0}
                                                className="hover:scale-125 disabled:opacity-20"
                                            >
                                                ↑
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleReorderLayers(
                                                        idx,
                                                        idx + 1,
                                                    );
                                                }}
                                                disabled={
                                                    idx ===
                                                    (activeSlide.layers
                                                        ?.length ?? 0) -
                                                        1
                                                }
                                                className="hover:scale-125 disabled:opacity-20"
                                            >
                                                ↓
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleDuplicateLayer(
                                                        layer.id,
                                                    );
                                                }}
                                                className="hover:scale-125"
                                                title="Clone layer"
                                            >
                                                ⧉
                                            </button>
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    void handleDeleteLayer(
                                                        layer.id,
                                                    );
                                                }}
                                                className="text-red-400 hover:text-red-200"
                                                title="Delete layer"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column (3 cols): Selected Layer Inspector */}
                    <div className="col-span-12 space-y-4 lg:col-span-3">
                        <div className="border border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900">
                            <span className="font-mono text-[11px] font-medium tracking-wider text-stone-500 uppercase">
                                Layer Inspector
                            </span>

                            {selectedLayer ? (
                                <div className="mt-3 space-y-3">
                                    {/* Layer Basics */}
                                    <div>
                                        <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                            Layer Name
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedLayer.name}
                                            onChange={(e) =>
                                                handleLayerPropertyChange(
                                                    'root',
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className="mt-1 block w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                        />
                                    </div>

                                    {/* Content Editor */}
                                    {(selectedLayer.type === 'heading' ||
                                        selectedLayer.type === 'description' ||
                                        selectedLayer.type === 'eyebrow') && (
                                        <div>
                                            <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                                Text Content
                                            </label>
                                            <textarea
                                                value={
                                                    selectedLayer.content
                                                        ?.text || ''
                                                }
                                                onChange={(e) =>
                                                    handleLayerPropertyChange(
                                                        'content',
                                                        'text',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={3}
                                                className="mt-1 block w-full border border-stone-300 bg-white px-2.5 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                            />
                                        </div>
                                    )}

                                    {/* Heading Tag */}
                                    {selectedLayer.type === 'heading' && (
                                        <div>
                                            <label className="block text-[11px] font-medium tracking-wider text-stone-600 uppercase dark:text-stone-400">
                                                Semantic HTML Tag
                                            </label>
                                            <select
                                                value={
                                                    selectedLayer.content
                                                        ?.tag || 'h2'
                                                }
                                                onChange={(e) =>
                                                    handleLayerPropertyChange(
                                                        'content',
                                                        'tag',
                                                        e.target.value,
                                                    )
                                                }
                                                className="mt-1 block w-full border border-stone-300 bg-white px-2 py-1.5 text-xs dark:border-stone-700 dark:bg-stone-800"
                                            >
                                                <option value="h1">
                                                    H1 (Single per page)
                                                </option>
                                                <option value="h2">
                                                    H2 (Standard)
                                                </option>
                                                <option value="h3">
                                                    H3 (Sub-heading)
                                                </option>
                                            </select>
                                        </div>
                                    )}

                                    {/* CTA Buttons Editor */}
                                    {selectedLayer.type === 'cta' && (
                                        <div className="space-y-2 border-t border-stone-100 pt-2 dark:border-stone-800">
                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Primary Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedLayer.content
                                                            ?.primary_label ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'content',
                                                            'primary_label',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 text-xs dark:border-stone-700 dark:bg-stone-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Primary Destination URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedLayer.content
                                                            ?.primary_url || ''
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'content',
                                                            'primary_url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 font-mono text-[11px] dark:border-stone-700 dark:bg-stone-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Secondary Button Label
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedLayer.content
                                                            ?.secondary_label ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'content',
                                                            'secondary_label',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 text-xs dark:border-stone-700 dark:bg-stone-800"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Secondary Destination URL
                                                </label>
                                                <input
                                                    type="text"
                                                    value={
                                                        selectedLayer.content
                                                            ?.secondary_url ||
                                                        ''
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'content',
                                                            'secondary_url',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 font-mono text-[11px] dark:border-stone-700 dark:bg-stone-800"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Animation Controls */}
                                    <div className="space-y-2 border-t border-stone-100 pt-2 dark:border-stone-800">
                                        <span className="font-mono text-[10px] font-medium tracking-wider text-stone-400 uppercase">
                                            GSAP Animation Controls
                                        </span>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Entrance
                                                </label>
                                                <select
                                                    value={
                                                        selectedLayer.animation
                                                            ?.entrance ||
                                                        'fade-up'
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'animation',
                                                            'entrance',
                                                            e.target.value,
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 text-xs dark:border-stone-700 dark:bg-stone-800"
                                                >
                                                    <option value="fade-up">
                                                        Fade Up
                                                    </option>
                                                    <option value="fade-down">
                                                        Fade Down
                                                    </option>
                                                    <option value="fade-in">
                                                        Fade In
                                                    </option>
                                                    <option value="slide-left">
                                                        Slide Left
                                                    </option>
                                                    <option value="slide-right">
                                                        Slide Right
                                                    </option>
                                                    <option value="scale-in">
                                                        Scale In
                                                    </option>
                                                    <option value="clip-reveal">
                                                        Clip Reveal
                                                    </option>
                                                    <option value="none">
                                                        None
                                                    </option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-[10px] font-medium text-stone-500 uppercase">
                                                    Delay (s)
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.05"
                                                    min="0"
                                                    value={
                                                        selectedLayer.animation
                                                            ?.delay ?? 0.2
                                                    }
                                                    onChange={(e) =>
                                                        handleLayerPropertyChange(
                                                            'animation',
                                                            'delay',
                                                            parseFloat(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="mt-0.5 block w-full border border-stone-300 bg-white px-2 py-1 text-xs dark:border-stone-700 dark:bg-stone-800"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Visibility Toggle */}
                                    <div className="border-t border-stone-100 pt-2 dark:border-stone-800">
                                        <label className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300">
                                            <input
                                                type="checkbox"
                                                checked={
                                                    selectedLayer.is_visible
                                                }
                                                onChange={(e) =>
                                                    handleLayerPropertyChange(
                                                        'root',
                                                        'is_visible',
                                                        e.target.checked,
                                                    )
                                                }
                                            />
                                            Layer Visible in Slide
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <p className="mt-4 text-xs text-stone-400">
                                    Click any layer in the preview canvas or
                                    layer stack to edit its properties.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
