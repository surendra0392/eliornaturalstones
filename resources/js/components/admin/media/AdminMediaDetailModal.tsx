import { useState, useEffect } from 'react';
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

interface AdminMediaDetailModalProps {
    isOpen: boolean;
    media: MediaItem | null;
    onClose: () => void;
    onUpdate: (updated: MediaItem) => void;
    onDelete: (deletedId: number) => void;
    onAssign: (assigned: MediaItem) => void;
    canonicalCollections: CanonicalCollectionRef[];
    varieties: VarietyRef[];
}

export function AdminMediaDetailModal({
    isOpen,
    media,
    onClose,
    onUpdate,
    onDelete,
    onAssign,
    canonicalCollections,
    varieties,
}: AdminMediaDetailModalProps) {
    const [name, setName] = useState('');
    const [altText, setAltText] = useState('');
    const [copied, setCopied] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<string | null>(null);

    // Assignment state
    const [showAssign, setShowAssign] = useState(false);
    const [assignEntityType, setAssignEntityType] = useState<
        'collection' | 'variety'
    >('collection');
    const [assignCollectionId, setAssignCollectionId] = useState<number | ''>(
        '',
    );
    const [assignVarietyId, setAssignVarietyId] = useState<number | ''>('');
    const [assignSlot, setAssignSlot] = useState<string>('hero');
    const assignMode: 'copy' | 'move' = 'copy';
    const [isAssigning, setIsAssigning] = useState(false);
    const [assignError, setAssignError] = useState<string | null>(null);

    // Delete state
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (media) {
            setName(media.name || media.file_name);
            setAltText(media.alt_text || '');
            setSaveMessage(null);
            setCopied(false);
            setShowAssign(false);
            setShowDeleteConfirm(false);
            setAssignError(null);
            setDeleteError(null);
        }
    }, [media]);

    if (!media) return null;

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(media.url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        } catch {
            setCopied(false);
        }
    };

    const handleSaveMetadata = async () => {
        setIsSaving(true);
        setSaveMessage(null);

        try {
            const response = await apiClient<MediaItem>(
                API_ENDPOINTS.v1.admin.mediaItem(media.id),
                {
                    method: 'PATCH',
                    body: JSON.stringify({
                        name: name.trim(),
                        alt_text: altText.trim() || null,
                    }),
                },
            );

            if (response.data) {
                onUpdate(response.data);
                setSaveMessage('Metadata updated successfully.');
                setTimeout(() => setSaveMessage(null), 3000);
            }
        } catch (err: unknown) {
            const msg =
                err instanceof Error
                    ? err.message
                    : 'Failed to update metadata.';
            setSaveMessage(msg);
        } finally {
            setIsSaving(false);
        }
    };

    const handleExecuteAssign = async () => {
        const entityId =
            assignEntityType === 'collection'
                ? assignCollectionId
                : assignVarietyId;
        if (!entityId) {
            setAssignError('Please select a target entity.');
            return;
        }

        setIsAssigning(true);
        setAssignError(null);

        try {
            const response = await apiClient<MediaItem>(
                API_ENDPOINTS.v1.admin.assignMedia(media.id),
                {
                    method: 'POST',
                    body: JSON.stringify({
                        entity_type: assignEntityType,
                        entity_id: entityId,
                        collection_name: assignSlot,
                        mode: assignMode,
                    }),
                },
            );

            if (response.data) {
                onAssign(response.data);
                setShowAssign(false);
                setSaveMessage(`Successfully assigned to ${assignEntityType}.`);
            }
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : 'Failed to assign media.';
            setAssignError(msg);
        } finally {
            setIsAssigning(false);
        }
    };

    const handleDelete = async (force = false) => {
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const endpoint = `${API_ENDPOINTS.v1.admin.mediaItem(media.id)}${force ? '?force=true' : ''}`;
            await apiClient(endpoint, {
                method: 'DELETE',
            });

            onDelete(media.id);
            onClose();
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : 'Failed to delete asset.';
            setDeleteError(msg);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <AdminModal
            isOpen={isOpen}
            onClose={onClose}
            title="Media Asset Details"
            description="Inspect dimensions, metadata, associations, and public media URLs."
            maxWidth="xl"
        >
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                {/* Left: Large Visual Preview */}
                <div className="flex flex-col space-y-3 lg:col-span-7">
                    <div className="border-border-stone bg-graphite relative flex aspect-4/3 w-full items-center justify-center overflow-hidden border">
                        <img
                            src={media.large_url || media.url}
                            alt={media.alt_text || media.name}
                            className="h-full w-full object-contain"
                        />
                    </div>

                    {/* Quick URL Copy Bar */}
                    <div className="border-border-stone bg-stone-base/40 flex items-center justify-between border p-2.5">
                        <div className="text-taupe truncate pr-2 font-mono text-xs select-all">
                            {media.url}
                        </div>
                        <AdminButton
                            variant="secondary"
                            size="sm"
                            onClick={handleCopyUrl}
                        >
                            {copied ? 'Copied!' : 'Copy URL'}
                        </AdminButton>
                    </div>

                    {saveMessage && (
                        <div className="border-gold/30 bg-gold/10 text-gold-light border p-2.5 font-mono text-xs">
                            {saveMessage}
                        </div>
                    )}
                </div>

                {/* Right: Technical Metadata & Editorial Controls */}
                <div className="flex flex-col justify-between space-y-4 text-xs lg:col-span-5">
                    <div className="space-y-4">
                        {/* Technical Metadata Table */}
                        <div className="border-border-stone bg-stone-base/60 divide-border-subtle divide-y border font-mono">
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    Filename
                                </span>
                                <span
                                    className="text-ivory max-w-[180px] truncate"
                                    title={media.file_name}
                                >
                                    {media.file_name}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    MIME Type
                                </span>
                                <span className="text-ivory">
                                    {media.mime_type}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    File Size
                                </span>
                                <span className="text-ivory">
                                    {media.size_formatted}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    Dimensions
                                </span>
                                <span className="text-ivory">
                                    {media.dimensions.formatted || 'Original'}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    Media Slot
                                </span>
                                <span className="text-gold-light uppercase">
                                    {media.collection_name}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    Association
                                </span>
                                <span className="text-ivory max-w-[180px] truncate">
                                    {media.is_associated &&
                                    media.associated_entity
                                        ? `${media.associated_entity.name} (${media.associated_entity.type})`
                                        : 'Unassigned (General Asset)'}
                                </span>
                            </div>
                            <div className="flex justify-between p-2">
                                <span className="text-taupe uppercase">
                                    Uploaded
                                </span>
                                <span className="text-ivory">
                                    {new Date(
                                        media.created_at,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>

                        {/* Editorial Metadata Inputs */}
                        <div className="border-border-stone space-y-3 border-t pt-4">
                            <AdminInput
                                label="Display Title / Name"
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />

                            <AdminInput
                                label="Alt Text (Accessible Description)"
                                name="alt_text"
                                value={altText}
                                onChange={(e) => setAltText(e.target.value)}
                                placeholder="e.g. Statuario Extra slab with charcoal veins"
                                helperText="Material description for screen readers and SEO."
                            />

                            <AdminButton
                                variant="outline"
                                size="sm"
                                onClick={handleSaveMetadata}
                                isLoading={isSaving}
                                className="w-full"
                            >
                                Save Changes
                            </AdminButton>
                        </div>

                        {/* Assignment Panel Trigger */}
                        <div className="border-border-stone border-t pt-3">
                            {!showAssign ? (
                                <AdminButton
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => {
                                        setShowAssign(true);
                                        setAssignSlot(
                                            assignEntityType === 'collection'
                                                ? 'hero'
                                                : 'slab',
                                        );
                                    }}
                                    className="w-full"
                                >
                                    Assign Asset to Stone / Collection
                                </AdminButton>
                            ) : (
                                <div className="border-border-stone bg-stone-base/40 space-y-3 border p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gold-light font-mono text-xs tracking-wider uppercase">
                                            Assign Media
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => setShowAssign(false)}
                                            className="text-taupe hover:text-ivory font-mono text-xs"
                                        >
                                            Cancel
                                        </button>
                                    </div>

                                    {assignError && (
                                        <div className="font-mono text-[11px] text-red-400">
                                            {assignError}
                                        </div>
                                    )}

                                    <AdminSelect
                                        label="Target Entity"
                                        name="assign_entity_type"
                                        value={assignEntityType}
                                        onChange={(e) => {
                                            const type = e.target.value as
                                                | 'collection'
                                                | 'variety';
                                            setAssignEntityType(type);
                                            setAssignCollectionId('');
                                            setAssignVarietyId('');
                                            setAssignSlot(
                                                type === 'collection'
                                                    ? 'hero'
                                                    : 'slab',
                                            );
                                        }}
                                        options={[
                                            {
                                                value: 'collection',
                                                label: 'Collection',
                                            },
                                            {
                                                value: 'variety',
                                                label: 'Stone Variety',
                                            },
                                        ]}
                                    />

                                    {assignEntityType === 'collection' ? (
                                        <>
                                            <AdminSelect
                                                label="Collection"
                                                name="assign_collection"
                                                value={assignCollectionId}
                                                onChange={(e) =>
                                                    setAssignCollectionId(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                options={[
                                                    {
                                                        value: '',
                                                        label: '— Select Collection —',
                                                    },
                                                    ...canonicalCollections.map(
                                                        (c) => ({
                                                            value: c.id,
                                                            label: c.name,
                                                        }),
                                                    ),
                                                ]}
                                            />
                                            <AdminSelect
                                                label="Slot"
                                                name="assign_slot"
                                                value={assignSlot}
                                                onChange={(e) =>
                                                    setAssignSlot(
                                                        e.target.value,
                                                    )
                                                }
                                                options={[
                                                    {
                                                        value: 'hero',
                                                        label: 'Hero Image',
                                                    },
                                                    {
                                                        value: 'gallery',
                                                        label: 'Gallery',
                                                    },
                                                ]}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            <AdminSelect
                                                label="Stone Variety"
                                                name="assign_variety"
                                                value={assignVarietyId}
                                                onChange={(e) =>
                                                    setAssignVarietyId(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                options={[
                                                    {
                                                        value: '',
                                                        label: '— Select Variety —',
                                                    },
                                                    ...varieties.map((v) => ({
                                                        value: v.id,
                                                        label: v.name,
                                                    })),
                                                ]}
                                            />
                                            <AdminSelect
                                                label="Slot"
                                                name="assign_slot"
                                                value={assignSlot}
                                                onChange={(e) =>
                                                    setAssignSlot(
                                                        e.target.value,
                                                    )
                                                }
                                                options={[
                                                    {
                                                        value: 'slab',
                                                        label: 'Slab Image',
                                                    },
                                                    {
                                                        value: 'swatch',
                                                        label: 'Swatch',
                                                    },
                                                    {
                                                        value: 'gallery',
                                                        label: 'Gallery',
                                                    },
                                                ]}
                                            />
                                        </>
                                    )}

                                    <div className="flex gap-2">
                                        <AdminButton
                                            variant="primary"
                                            size="sm"
                                            onClick={handleExecuteAssign}
                                            isLoading={isAssigning}
                                            className="w-full"
                                        >
                                            Confirm Assignment
                                        </AdminButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Destructive Delete Control with Safety Check */}
                    <div className="border-border-stone border-t pt-4">
                        {!showDeleteConfirm ? (
                            <AdminButton
                                variant="danger"
                                size="sm"
                                onClick={() => setShowDeleteConfirm(true)}
                                className="w-full"
                            >
                                Delete Asset
                            </AdminButton>
                        ) : (
                            <div className="space-y-2 border border-red-500/30 bg-red-950/30 p-3">
                                <p className="font-mono text-xs text-red-300">
                                    {media.is_associated
                                        ? `Warning: This asset is currently associated with ${media.associated_entity?.name}. Deleting it will remove the image from that entity.`
                                        : 'Are you sure you want to permanently delete this media asset?'}
                                </p>
                                {deleteError && (
                                    <p className="font-mono text-[11px] text-red-400">
                                        {deleteError}
                                    </p>
                                )}
                                <div className="flex gap-2 pt-1">
                                    <AdminButton
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            setShowDeleteConfirm(false)
                                        }
                                        disabled={isDeleting}
                                    >
                                        Cancel
                                    </AdminButton>
                                    <AdminButton
                                        variant="danger"
                                        size="sm"
                                        onClick={() =>
                                            handleDelete(media.is_associated)
                                        }
                                        isLoading={isDeleting}
                                    >
                                        Confirm Delete
                                    </AdminButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminModal>
    );
}
