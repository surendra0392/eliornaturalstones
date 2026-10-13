import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { AdminModal } from '../ui/AdminModal';
import { AdminButton } from '../ui/AdminButton';
import { AdminBadge } from '../ui/AdminBadge';
import { apiClient, ApiError } from '../../../api/client';

export interface AdminGalleryItem {
    id: number;
    title: string;
    slug: string;
    category: string;
    space_type: string | null;
    material: string | null;
    description: string | null;
    is_featured: boolean;
    is_active: boolean;
    sort_order: number;
    image_url: string | null;
    thumb_url: string | null;
    created_at?: string;
    updated_at?: string;
}

interface AdminGalleryImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: AdminGalleryItem | null;
    onImageUpdated: (updatedItem: AdminGalleryItem) => void;
    onError: (message: string) => void;
}

export function AdminGalleryImageModal({
    isOpen,
    onClose,
    item,
    onImageUpdated,
    onError,
}: AdminGalleryImageModalProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [altText, setAltText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen && item) {
            setSelectedFile(null);
            setFilePreview(null);
            setAltText(`${item.title} architectural stone application`);
            setIsUploading(false);
            setIsRemoving(false);
        }
    }, [isOpen, item]);

    useEffect(() => {
        return () => {
            if (filePreview && filePreview.startsWith('blob:')) {
                URL.revokeObjectURL(filePreview);
            }
        };
    }, [filePreview]);

    if (!item) return null;

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('image/')) {
            onError('Please select a valid image file (JPEG, PNG, WebP, or AVIF).');
            return;
        }

        if (file.size > 15 * 1024 * 1024) {
            onError('File exceeds maximum upload size of 15MB.');
            return;
        }

        setSelectedFile(file);
        setFilePreview(URL.createObjectURL(file));
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
        }
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

            const res = await apiClient<AdminGalleryItem>(
                `/api/v1/admin/gallery/${item.id}/image`,
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
            onError(apiErr.message || 'Failed to upload and update gallery image.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemoveImage = async () => {
        if (!item.image_url) return;

        setIsRemoving(true);
        try {
            const res = await apiClient<AdminGalleryItem>(
                `/api/v1/admin/gallery/${item.id}/image`,
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
            onError(apiErr.message || 'Failed to remove gallery image.');
        } finally {
            setIsRemoving(false);
        }
    };

    const currentImage = item.image_url || item.thumb_url;

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title={`Manage Image: ${item.title}`}
            size="lg"
            footer={
                <div className="flex w-full items-center justify-between">
                    <div>
                        {currentImage && (
                            <AdminButton
                                type="button"
                                variant="danger"
                                size="sm"
                                onClick={handleRemoveImage}
                                disabled={isUploading || isRemoving}
                            >
                                {isRemoving ? 'Removing...' : 'Remove Image'}
                            </AdminButton>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <AdminButton
                            type="button"
                            variant="secondary"
                            onClick={onClose}
                            disabled={isUploading || isRemoving}
                        >
                            Cancel
                        </AdminButton>
                        <AdminButton
                            type="button"
                            variant="primary"
                            onClick={() => handleUploadSubmit()}
                            disabled={!selectedFile || isUploading || isRemoving}
                        >
                            {isUploading ? 'Uploading...' : 'Save & Update'}
                        </AdminButton>
                    </div>
                </div>
            }
        >
            <div className="space-y-6">
                {/* Current & New Preview Comparison */}
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Current Active Image */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-xs tracking-wider text-stone-500 uppercase dark:text-stone-400">
                                Current Image
                            </span>
                            {currentImage ? (
                                <AdminBadge variant="success">Active</AdminBadge>
                            ) : (
                                <AdminBadge variant="secondary">No Image</AdminBadge>
                            )}
                        </div>
                        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-md border border-stone-200 bg-stone-100 dark:border-stone-800 dark:bg-stone-900">
                            {currentImage ? (
                                <img
                                    src={currentImage}
                                    alt={item.title}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                    <span className="font-serif text-sm text-stone-400">
                                        No image assigned
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* New Selected Image Preview */}
                    <div>
                        <div className="mb-2 flex items-center justify-between">
                            <span className="font-mono text-xs tracking-wider text-stone-500 uppercase dark:text-stone-400">
                                Replacement Preview (5:4)
                            </span>
                            {filePreview ? (
                                <AdminBadge variant="warning">Ready to Save</AdminBadge>
                            ) : (
                                <span className="font-mono text-[10px] text-stone-400">
                                    Awaiting selection
                                </span>
                            )}
                        </div>
                        <div className="relative aspect-[5/4] w-full overflow-hidden rounded-md border border-dashed border-stone-300 bg-stone-50 dark:border-stone-700 dark:bg-stone-950">
                            {filePreview ? (
                                <img
                                    src={filePreview}
                                    alt="New preview"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                                    <svg
                                        className="mb-2 h-8 w-8 text-stone-300 dark:text-stone-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                        />
                                    </svg>
                                    <p className="font-mono text-xs text-stone-400">
                                        Select or drop a new image below
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Upload Dropzone */}
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
                        isDragging
                            ? 'border-amber-500 bg-amber-50/20'
                            : 'border-stone-300 hover:border-amber-500 dark:border-stone-700 dark:hover:border-amber-500'
                    }`}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/avif"
                        onChange={handleFileInputChange}
                        className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 dark:bg-stone-800">
                            <svg
                                className="h-5 w-5 text-stone-600 dark:text-stone-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                />
                            </svg>
                        </div>
                        <div className="text-sm">
                            <span className="font-medium text-amber-600 hover:text-amber-500 dark:text-amber-400">
                                Click to upload
                            </span>{' '}
                            <span className="text-stone-500">or drag and drop</span>
                        </div>
                        <p className="font-mono text-[11px] text-stone-400">
                            WebP, JPEG, PNG, AVIF up to 15MB (Standard 5:4 ratio recommended)
                        </p>
                        {selectedFile && (
                            <div className="mt-2 inline-flex items-center gap-2 rounded bg-stone-100 px-3 py-1 font-mono text-xs text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                                <span>{selectedFile.name}</span>
                                <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Alt Text Input */}
                <div>
                    <label className="mb-1.5 block font-mono text-xs tracking-wider text-stone-600 uppercase dark:text-stone-400">
                        Image Alt Text (Accessibility & SEO)
                    </label>
                    <input
                        type="text"
                        value={altText}
                        onChange={(e) => setAltText(e.target.value)}
                        placeholder="Descriptive architectural alt text"
                        className="w-full rounded-md border border-stone-300 bg-white px-3 py-2 text-sm text-stone-900 focus:border-amber-500 focus:outline-none dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
                    />
                </div>
            </div>
        </AdminModal>
    );
}
