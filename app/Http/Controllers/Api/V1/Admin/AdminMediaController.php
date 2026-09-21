<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssignMediaRequest;
use App\Http\Requests\Admin\StoreMediaRequest;
use App\Http\Requests\Admin\UpdateMediaRequest;
use App\Http\Resources\V1\Admin\AdminMediaResource;
use App\Models\Collection;
use App\Models\User;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class AdminMediaController extends Controller
{
    /**
     * Display a paginated listing of media assets with server-side search and filters.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Media::query()->with(['model']);

        // Server-side search (filename, display name, alt text)
        if ($search = $request->query('search')) {
            $searchStr = (string) $search;
            $query->where(function ($q) use ($searchStr): void {
                $q->where('file_name', 'like', "%{$searchStr}%")
                    ->orWhere('name', 'like', "%{$searchStr}%")
                    ->orWhere('custom_properties->alt_text', 'like', "%{$searchStr}%");
            });
        }

        // Filter by media collection name
        if ($collection = $request->query('collection')) {
            if ($collection !== 'all') {
                $query->where('collection_name', (string) $collection);
            }
        }

        // Filter by associated entity type
        if ($entity = $request->query('entity')) {
            if ($entity === 'collection') {
                $query->where('model_type', Collection::class);
            } elseif ($entity === 'variety') {
                $query->where('model_type', Variety::class);
            } elseif ($entity === 'unassigned') {
                $query->where('model_type', User::class);
            }
        }

        // Filter by MIME type
        if ($type = $request->query('type')) {
            if ($type === 'image') {
                $query->where('mime_type', 'like', 'image/%');
            }
        }

        $perPage = max(1, min(100, (int) $request->query('per_page', 24)));
        $paginated = $query->latest('id')->paginate($perPage);

        return response()->json([
            'data' => AdminMediaResource::collection($paginated->items()),
            'meta' => [
                'current_page' => $paginated->currentPage(),
                'last_page' => $paginated->lastPage(),
                'per_page' => $paginated->perPage(),
                'total' => $paginated->total(),
            ],
            'message' => 'Media library items retrieved successfully.',
        ]);
    }

    /**
     * Display a single media asset.
     */
    public function show(Media $media): JsonResponse
    {
        $media->loadMissing(['model']);

        return response()->json([
            'data' => new AdminMediaResource($media),
            'message' => 'Media item retrieved successfully.',
        ]);
    }

    /**
     * Upload one or multiple media files.
     */
    public function store(StoreMediaRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var HasMedia $targetModel */
        $targetModel = $user;
        $collectionName = 'uploads';

        if ($request->filled('entity_type') && $request->filled('entity_id')) {
            $entityType = (string) $request->input('entity_type');
            $entityId = (int) $request->input('entity_id');

            if ($entityType === 'collection') {
                $targetModel = Collection::query()->findOrFail($entityId);
                $collectionName = (string) $request->input('collection_name', 'gallery');
            } elseif ($entityType === 'variety') {
                $targetModel = Variety::query()->findOrFail($entityId);
                $collectionName = (string) $request->input('collection_name', 'gallery');
            }
        }

        /** @var array<UploadedFile> $files */
        $files = [];
        if ($request->hasFile('files')) {
            $fileInput = $request->file('files');
            $files = is_array($fileInput) ? $fileInput : [$fileInput];
        } elseif ($request->hasFile('file')) {
            /** @var UploadedFile $singleFile */
            $singleFile = $request->file('file');
            $files = [$singleFile];
        }

        $altText = $request->input('alt_text');
        $createdMedia = [];

        foreach ($files as $file) {
            $dimensions = @getimagesize($file->getRealPath());
            $width = is_array($dimensions) ? $dimensions[0] : null;
            $height = is_array($dimensions) ? $dimensions[1] : null;

            $customProperties = [
                'alt_text' => $altText ?: null,
                'width' => $width,
                'height' => $height,
            ];

            $mediaItem = $targetModel
                ->addMedia($file)
                ->withCustomProperties($customProperties)
                ->toMediaCollection($collectionName);

            $createdMedia[] = $mediaItem;
        }

        $responseData = count($createdMedia) === 1
            ? new AdminMediaResource($createdMedia[0])
            : AdminMediaResource::collection(collect($createdMedia));

        return response()->json([
            'data' => $responseData,
            'message' => count($createdMedia) === 1
                ? 'Image uploaded to Media Library successfully.'
                : count($createdMedia).' images uploaded to Media Library successfully.',
        ], 201);
    }

    /**
     * Update media metadata (display name and alt text).
     */
    public function update(UpdateMediaRequest $request, Media $media): JsonResponse
    {
        if ($request->has('name')) {
            $media->name = (string) $request->input('name');
        }

        if ($request->has('alt_text')) {
            $alt = $request->input('alt_text');
            $media->setCustomProperty('alt_text', $alt ?: null);
        }

        $media->save();

        return response()->json([
            'data' => new AdminMediaResource($media->fresh(['model'])),
            'message' => 'Media metadata updated successfully.',
        ]);
    }

    /**
     * Assign an existing media item to a Collection or Variety.
     */
    public function assign(AssignMediaRequest $request, Media $media): JsonResponse
    {
        $entityType = (string) $request->input('entity_type');
        $entityId = (int) $request->input('entity_id');
        $slot = (string) $request->input('collection_name');
        $mode = (string) $request->input('mode', 'copy');
        $targetEntity = $entityType === 'collection'
            ? Collection::query()->findOrFail($entityId)
            : Variety::query()->findOrFail($entityId);

        if ($mode === 'move') {
            $newMedia = $media->move($targetEntity, $slot);
        } else {
            $newMedia = $media->copy($targetEntity, $slot);
        }

        return response()->json([
            'data' => new AdminMediaResource($newMedia->fresh(['model'])),
            'message' => "Media asset assigned successfully to {$entityType}.",
        ]);
    }

    /**
     * Safely delete a media asset.
     */
    public function destroy(Request $request, Media $media): JsonResponse
    {
        $isAssociated = $media->model_type !== User::class && ! is_null($media->model);
        $force = filter_var($request->query('force', $request->input('force', false)), FILTER_VALIDATE_BOOLEAN);

        if ($isAssociated && ! $force) {
            $model = $media->model;
            $entityName = 'an entity';
            if ($model instanceof Collection) {
                $entityName = $model->name;
            } elseif ($model instanceof Variety) {
                $entityName = $model->name;
            }

            return response()->json([
                'message' => "This media asset is currently associated with {$entityName} ('{$media->collection_name}' slot). Deletion requires explicit confirmation (force=true).",
                'is_associated' => true,
                'associated_entity' => [
                    'type' => $media->model_type === Collection::class ? 'collection' : 'variety',
                    'id' => $media->model_id,
                    'name' => $entityName,
                    'slot' => $media->collection_name,
                ],
            ], 422);
        }

        // Delete the media file and DB record without touching parent model
        $media->delete();

        return response()->json([
            'message' => 'Media asset deleted successfully.',
        ]);
    }
}
