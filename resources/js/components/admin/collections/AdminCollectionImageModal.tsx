import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { AdminModal } from '../ui/AdminModal';
import { AdminButton } from '../ui/AdminButton';
import { AdminBadge } from '../ui/AdminBadge';
import { AdminMediaPickerModal } from '../pages/AdminMediaPickerModal';
import { apiClient, ApiError } from '../../../api/client';
import type { AdminCollectionItem } from '../../../pages/admin/Collections';

interface AdminCollectionImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    collection: AdminCollectionItem | null;
    currentDisplayImage: string | null;
    onImageUpdated: (updatedCollection: AdminCollectionItem) => void;
    onError: (message: string) => void;
}

export function AdminCollectionImageModal({
    isOpen,
    onClose,
    collection,
    currentDisplayImage,
    onImageUpdated,
    onError,
}: AdminCollectionImageModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [altText, setAltText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Reset state when collection changes or modal opens
    useEffect(() => {
        if (isOpen && collection) {
            setSelectedFile(null);
            setFilePreview(null);
            setAltText(`${collection.name} natural stone collection`);
            setIsUploading(false);
            setIsRemoving(false);
        }
    }, [isOpen, collection]);

    // Clean up object URLs
    useEffect(() => {
        return () => {
            if (filePreview && filePreview.startsWith('blob:')) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);

    if (!collection) return null;

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            onError('Please select a valid image file (JPEG, PNG, WebP, or AVIF).');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            onError('The selected image exceeds the 10MB size limit.');
            return;
        }

        setSelectedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setFilePreview(previewUrl);
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleUploadSubmit = async (e?: FormEvent) => {
        if (e) e.preventDefault();
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            if (altText.trim()) {
                formData.append('alt_text', altText.trim());
            }

            const res = await apiClient<AdminCollectionItem>(
                `/api/v1/admin/collections/${collection.id}/image`,
                {
                    method: 'POST',
                    body: formData,
                },
            );

            if (res.data) {
                onImageUpdated(res.data);
                onClose();
            }
        } catch (err) {
            const apiErr = err as ApiError;
            onError(apiErr.message || 'Failed to upload and update collection hero image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveCustomImage = async () => {
        if (!collection.hero_image) return;

        setIsRemoving(true);
        try {
            const res = await apiClient<AdminCollectionItem>(
                `/api/v1/admin/collections/${collection.id}/image`,
                {
                    method: 'DELETE',
                },
            );

            if (res.data) {
                onImageUpdated(res.data);
                onClose();
            }
        } catch (err) {
            const apiErr = err as ApiError;
            onError(apiErr.message || 'Failed to reset collection hero image.');
        } finally {
            setIsRemoving(false);
        }
    };

    const handleMediaLibrarySelected = async (media: { url: string; alt: string; id?: number }) => {
        setIsMediaPickerOpen(false);

        if (media.id) {
            setIsUploading(true);
            try {
                // Assign selected media from library directly to collection hero slot
                await apiClient(
                    `/api/v1/admin/media/${media.id}/assign`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            entity_type: 'collection',
                            entity_id: collection.id,
                            collection_name: 'hero',
                            mode: 'copy',
                        }),
                    },
                );

                // Fetch fresh collection details
                const freshRes = await apiClient<AdminCollectionItem>(
                    `/api/v1/admin/collections/${collection.id}`,
                );

                if (freshRes.data) {
                    onImageUpdated(freshRes.data);
                    onClose();
                }
            } catch (err) {
                const apiErr = err as ApiError;
                onError(apiErr.message || 'Failed to assign image from Media Library.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    const hasCustomImage = Boolean(collection.hero_image);
    const activePreview = filePreview || currentDisplayImage;

    return (
        <>
            <AdminModal
                isOpen={isOpen}
                onClose={() => !isUploading && !isRemoving && onClose()}
                title={`Change Collection Image: ${collection.name}`}
                description={`Update the monumental hero image for ${collection.name}. This image is featured in the main collections directory, card grid, and collection showcase header.`}
                maxWidth="lg"
                footer={
                    <div className="flex w-full items-center justify-between">
                        <div>
                            {hasCustomImage && (
                                <AdminButton
                                    variant="danger"
                                    size="sm"
                                    type="button"
                                    onClick={handleRemoveCustomImage}
                                    isLoading={isRemoving}
                                    disabled={isUploading}
                                >
                                    Revert to Default
                                </AdminButton>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <AdminButton
                                variant="outline"
                                size="sm"
                                type="button"
                                onClick={onClose}
                                disabled={isUploading || isRemoving}
                            >
                                Cancel
                            </AdminButton>
                            <AdminButton
                                variant="primary"
                                size="sm"
                                type="button"
                                onClick={() => void handleUploadSubmit()}
                                isLoading={isUploading}
                                disabled={!selectedFile || isRemoving}
                            >
                                Apply New Image
                            </AdminButton>
                        </div>
                    </div>
                }
            >
                <div className="space-y-6">
                    {/* Image Status & Current Preview */}
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        {/* Current / Proposed Preview */}
                        <div>
                            <div className="mb-2 flex items-center justify-between">
                                <label className="text-[11px] font-medium tracking-[0.16em] text-stone-700 uppercase dark:text-stone-300">
                                    {selectedFile ? 'Proposed Replacement' : 'Current Active Image'}
                                </label>
                                {selectedFile ? (
                                    <AdminBadge variant="warning">Ready to Save</AdminBadge>
                                ) : hasCustomImage ? (
                                    <AdminBadge variant="success">Custom Upload</AdminBadge>
                                ) : (
                                    <AdminBadge variant="neutral">Default Editorial Image</AdminBadge>
                                )}
                            </div>

                            <div className="relative aspect-[4/3] w-full overflow-hidden border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-950">
                                {activePreview ? (
                                    <img
                                        src={activePreview}
                                        alt={altText || collection.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-full w-full flex-col items-center justify-center text-stone-400">
                                        <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                            />
                                        </svg>
                                        <span className="mt-1 text-xs">No image available</span>
                                    </div>
                                )}

                                {selectedFile && (
                                    <div className="absolute right-2 bottom-2 rounded bg-stone-900/80 px-2 py-1 font-mono text-[10px] text-white backdrop-blur-xs">
                                        {(selectedFile.size / 1024).toFixed(0)} KB
                                    </div>
                                )}
                            </div>

                            <p className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                                {selectedFile
                                    ? `Selected: ${selectedFile.name}`
                                    : hasCustomImage
                                      ? 'This collection uses a custom uploaded hero photo.'
                                      : 'This collection is currently using the curated authentic editorial photography.'}
                            </p>
                        </div>

                        {/* Upload Controls & Media Library Picker */}
                        <div className="flex flex-col justify-between space-y-4">
                            {/* Drag & Drop Upload Zone */}
                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`flex flex-1 cursor-pointer flex-col items-center justify-center border-2 border-dashed p-6 text-center transition-colors ${
                                    isDragging
                                        ? 'border-stone-900 bg-stone-100 dark:border-stone-100 dark:bg-stone-800'
                                        : 'border-stone-300 hover:border-stone-500 hover:bg-stone-50/50 dark:border-stone-700 dark:hover:border-stone-500 dark:hover:bg-stone-900/50'
                                }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/jpeg,image/png,image/webp,image/avif"
                                    onChange={handleFileInputChange}
                                    className="hidden"
                                />
                                <svg
                                    className="h-8 w-8 text-stone-400 dark:text-stone-500"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                    />
                                </svg>
                                <p className="mt-2 text-xs font-medium text-stone-800 dark:text-stone-200">
                                    Click or drag & drop to upload
                                </p>
                                <p className="mt-0.5 text-[10px] text-stone-400 dark:text-stone-500">
                                    WebP, JPG, PNG or AVIF up to 10MB
                                </p>

                                {selectedFile && (
                                    <div className="mt-3 flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                                setFilePreview(null);
                                            }}
                                            className="font-mono text-[10px] text-red-600 underline hover:text-red-800 dark:text-red-400"
                                        >
                                            Clear selection
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Or Pick from Media Library */}
                            <div className="rounded border border-stone-200 bg-stone-50 p-3 dark:border-stone-800 dark:bg-stone-950">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="text-xs font-medium text-stone-900 dark:text-stone-100">
                                            Media Library
                                        </h4>
                                        <p className="text-[10px] text-stone-500 dark:text-stone-400">
                                            Select from existing uploaded assets
                                        </p>
                                    </div>
                                    <AdminButton
                                        variant="outline"
                                        size="sm"
                                        type="button"
                                        onClick={() => setIsMediaPickerOpen(true)}
                                    >
                                        Browse Library
                                    </AdminButton>
                                </div>
                            </div>

                            {/* Alt Text Input */}
                            <div>
                                <label className="block text-[10px] font-medium tracking-[0.16em] text-stone-600 uppercase dark:text-stone-400">
                                    Image Description / Alt Text
                                </label>
                                <input
                                    type="text"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    placeholder="e.g. Italian Marble monumental architectural feature wall"
                                    className="mt-1 w-full border border-stone-300 bg-white px-3 py-1.5 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100 dark:focus:border-stone-100"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AdminModal>

            {/* Media Library Picker Modal */}
            <AdminMediaPickerModal
                isOpen={isMediaPickerOpen}
                onClose={() => setIsMediaPickerOpen(false)}
                onSelect={(media) => void handleMediaLibrarySelected(media)}
                currentUrl={currentDisplayImage || ''}
            />
        </>
    );
}
