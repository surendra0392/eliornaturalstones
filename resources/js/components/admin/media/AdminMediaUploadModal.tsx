import { useState, useRef, type DragEvent, type ChangeEvent } from 'react';
import { AdminModal } from '../ui/AdminModal';
import { AdminButton } from '../ui/AdminButton';
import { AdminInput } from '../ui/AdminInput';
import { AdminSelect } from '../ui/AdminSelect';
import { apiClient } from '../../../api/client';
import { API_ENDPOINTS } from '../../../api/endpoints';
import type {
    CanonicalCollectionRef,
    VarietyRef,
    MediaItem,
} from '../../../types/media';

interface AdminMediaUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (uploaded: MediaItem[]) => void;
    canonicalCollections: CanonicalCollectionRef[];
    varieties: VarietyRef[];
}

interface QueuedFile {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'uploading' | 'success' | 'error';
    error?: string;
}

export function AdminMediaUploadModal({
    isOpen,
    onClose,
    onSuccess,
    canonicalCollections,
    varieties,
}: AdminMediaUploadModalProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [queue, setQueue] = useState<QueuedFile[]>([]);
    const [altText, setAltText] = useState('');
    const [entityType, setEntityType] = useState<
        'unassigned' | 'collection' | 'variety'
    >('unassigned');
    const [selectedCollectionId, setSelectedCollectionId] = useState<
        number | ''
    >('');
    const [selectedVarietyId, setSelectedVarietyId] = useState<number | ''>('');
    const [collectionSlot, setCollectionSlot] = useState<'hero' | 'gallery'>(
        'hero',
    );
    const [varietySlot, setVarietySlot] = useState<
        'slab' | 'swatch' | 'gallery'
    >('slab');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const addFilesToQueue = (files: FileList | File[]) => {
        const newQueueItems: QueuedFile[] = [];
        Array.from(files).forEach((file) => {
            if (!file.type.startsWith('image/')) {
                setUploadError(
                    `File "${file.name}" is not an accepted image format.`,
                );
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setUploadError(`File "${file.name}" exceeds the 10MB limit.`);
                return;
            }

            const preview = URL.createObjectURL(file);
            newQueueItems.push({
                id: `${file.name}-${Date.now()}-${Math.random()}`,
                file,
                preview,
                status: 'pending',
            });
        });

        if (newQueueItems.length > 0) {
            setUploadError(null);
            setQueue((prev) => [...prev, ...newQueueItems]);
        }
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            addFilesToQueue(e.dataTransfer.files);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            addFilesToQueue(e.target.files);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFileFromQueue = (id: string) => {
        setQueue((prev) => {
            const item = prev.find((q) => q.id === id);
            if (item) {
                URL.revokeObjectURL(item.preview);
            }
            return prev.filter((q) => q.id !== id);
        });
    };

    const handleClose = () => {
        queue.forEach((item) => URL.revokeObjectURL(item.preview));
        setQueue([]);
        setAltText('');
        setEntityType('unassigned');
        setSelectedCollectionId('');
        setSelectedVarietyId('');
        setUploadError(null);
        setIsUploading(false);
        onClose();
    };

    const handleUploadAll = async () => {
        if (queue.length === 0) return;

        setIsUploading(true);
        setUploadError(null);

        const uploadedResults: MediaItem[] = [];

        try {
            for (let i = 0; i < queue.length; i++) {
                const item = queue[i];
                setQueue((prev) =>
                    prev.map((q) =>
                        q.id === item.id ? { ...q, status: 'uploading' } : q,
                    ),
                );

                const formData = new FormData();
                formData.append('file', item.file);

                if (altText.trim()) {
                    formData.append('alt_text', altText.trim());
                }

                if (entityType === 'collection' && selectedCollectionId) {
                    formData.append('entity_type', 'collection');
                    formData.append('entity_id', String(selectedCollectionId));
                    formData.append('collection_name', collectionSlot);
                } else if (entityType === 'variety' && selectedVarietyId) {
                    formData.append('entity_type', 'variety');
                    formData.append('entity_id', String(selectedVarietyId));
                    formData.append('collection_name', varietySlot);
                }

                const response = await apiClient<MediaItem>(
                    API_ENDPOINTS.v1.admin.media,
                    {
                        method: 'POST',
                        body: formData,
                    },
                );

                if (response.data) {
                    uploadedResults.push(response.data);
                    setQueue((prev) =>
                        prev.map((q) =>
                            q.id === item.id ? { ...q, status: 'success' } : q,
                        ),
                    );
                }
            }

            onSuccess(uploadedResults);
            handleClose();
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : 'An error occurred during upload.';
            setUploadError(message);
            setQueue((prev) =>
                prev.map((q) =>
                    q.status === 'uploading'
                        ? { ...q, status: 'error', error: message }
                        : q,
                ),
            );
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={handleClose}
            title="Upload Media"
            description="Add high-resolution architectural photography to the ELIOR asset catalog."
            maxWidth="lg"
        >
            <div className="space-y-6 text-sm">
                {uploadError && (
                    <div className="border border-red-500/40 bg-red-950/30 p-3 font-mono text-xs text-red-300">
                        {uploadError}
                    </div>
                )}

                {/* Dropzone */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex cursor-pointer flex-col items-center justify-center border-2 border-dashed p-8 transition-colors ${
                        isDragging
                            ? 'border-gold bg-stone-light/40'
                            : 'border-border-stone bg-stone-base/40 hover:border-gold/50 hover:bg-stone-light/20'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />

                    <svg
                        className="text-taupe/60 mb-3 h-10 w-10"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                    </svg>
                    <p className="text-ivory font-sans text-sm">
                        Drag and drop architectural images here, or{' '}
                        <span className="text-gold underline">
                            browse your filesystem
                        </span>
                    </p>
                    <p className="text-taupe mt-1 font-mono text-xs">
                        Supports JPEG, PNG, WebP, AVIF up to 10MB each
                    </p>
                </div>

                {/* File Queue Previews */}
                {queue.length > 0 && (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <h4 className="text-taupe font-mono text-xs tracking-wider uppercase">
                                Selected Assets ({queue.length})
                            </h4>
                            <button
                                type="button"
                                onClick={() => setQueue([])}
                                className="text-taupe font-mono text-xs transition-colors hover:text-red-400"
                            >
                                Clear Selection
                            </button>
                        </div>

                        <div className="divide-border-subtle max-h-48 space-y-2 divide-y overflow-y-auto pr-1">
                            {queue.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center justify-between pt-2 first:pt-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={item.preview}
                                            alt={item.file.name}
                                            className="border-border-stone h-10 w-10 border object-cover"
                                        />
                                        <div>
                                            <p className="text-ivory max-w-xs truncate font-sans text-xs">
                                                {item.file.name}
                                            </p>
                                            <p className="text-taupe font-mono text-[10px]">
                                                {(
                                                    item.file.size / 1024
                                                ).toFixed(1)}{' '}
                                                KB
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {item.status === 'uploading' && (
                                            <span className="text-gold animate-pulse font-mono text-[10px] uppercase">
                                                Uploading...
                                            </span>
                                        )}
                                        {item.status === 'success' && (
                                            <span className="font-mono text-[10px] text-emerald-400 uppercase">
                                                Complete
                                            </span>
                                        )}
                                        {item.status === 'error' && (
                                            <span className="font-mono text-[10px] text-red-400 uppercase">
                                                Failed
                                            </span>
                                        )}
                                        {item.status === 'pending' &&
                                            !isUploading && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFileFromQueue(
                                                            item.id,
                                                        )
                                                    }
                                                    className="text-taupe p-1 font-mono text-xs hover:text-red-400"
                                                    title="Remove"
                                                >
                                                    ×
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Metadata & Assignment Options */}
                <div className="border-border-stone space-y-4 border-t pt-4">
                    <AdminInput
                        label="Alt Text / Accessible Description"
                        name="alt_text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="e.g., Calacatta Gold marble slab with warm honey veining"
                        helperText="Provide an authentic description of the material. Leave empty if unverified."
                    />

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <AdminSelect
                            label="Target Assignment"
                            name="entity_type"
                            value={entityType}
                            onChange={(e) => {
                                const val = e.target.value as
                                    | 'unassigned'
                                    | 'collection'
                                    | 'variety';
                                setEntityType(val);
                                setSelectedCollectionId('');
                                setSelectedVarietyId('');
                            }}
                            options={[
                                {
                                    value: 'unassigned',
                                    label: 'Unassigned (General Asset Library)',
                                },
                                {
                                    value: 'collection',
                                    label: 'Assign to Collection',
                                },
                                {
                                    value: 'variety',
                                    label: 'Assign to Stone Variety',
                                },
                            ]}
                        />

                        {entityType === 'collection' && (
                            <>
                                <AdminSelect
                                    label="Select Collection"
                                    name="collection_id"
                                    value={selectedCollectionId}
                                    onChange={(e) =>
                                        setSelectedCollectionId(
                                            Number(e.target.value),
                                        )
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: '— Select Collection —',
                                        },
                                        ...canonicalCollections.map((c) => ({
                                            value: c.id,
                                            label: c.name,
                                        })),
                                    ]}
                                />
                                <AdminSelect
                                    label="Collection Media Slot"
                                    name="collection_slot"
                                    value={collectionSlot}
                                    onChange={(e) =>
                                        setCollectionSlot(
                                            e.target.value as
                                                | 'hero'
                                                | 'gallery',
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'hero',
                                            label: 'Hero Image (Primary Showcase)',
                                        },
                                        {
                                            value: 'gallery',
                                            label: 'Gallery Showcase',
                                        },
                                    ]}
                                />
                            </>
                        )}

                        {entityType === 'variety' && (
                            <>
                                <AdminSelect
                                    label="Select Variety"
                                    name="variety_id"
                                    value={selectedVarietyId}
                                    onChange={(e) =>
                                        setSelectedVarietyId(
                                            Number(e.target.value),
                                        )
                                    }
                                    options={[
                                        {
                                            value: '',
                                            label: '— Select Stone Variety —',
                                        },
                                        ...varieties.map((v) => ({
                                            value: v.id,
                                            label: v.name,
                                        })),
                                    ]}
                                />
                                <AdminSelect
                                    label="Variety Media Slot"
                                    name="variety_slot"
                                    value={varietySlot}
                                    onChange={(e) =>
                                        setVarietySlot(
                                            e.target.value as
                                                | 'slab'
                                                | 'swatch'
                                                | 'gallery',
                                        )
                                    }
                                    options={[
                                        {
                                            value: 'slab',
                                            label: 'Slab Image (Primary Surface)',
                                        },
                                        {
                                            value: 'swatch',
                                            label: 'Swatch / Texture',
                                        },
                                        {
                                            value: 'gallery',
                                            label: 'Gallery Detail',
                                        },
                                    ]}
                                />
                            </>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="border-border-stone flex justify-end gap-3 border-t pt-4">
                    <AdminButton
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Cancel
                    </AdminButton>
                    <AdminButton
                        variant="primary"
                        onClick={handleUploadAll}
                        isLoading={isUploading}
                        disabled={queue.length === 0 || isUploading}
                    >
                        {isUploading
                            ? 'Uploading...'
                            : queue.length > 1
                              ? `Upload ${queue.length} Images`
                              : 'Upload to Library'}
                    </AdminButton>
                </div>
            </div>
        </AdminModal>
    );
}
