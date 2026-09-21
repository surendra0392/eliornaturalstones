<?php

namespace App\Http\Controllers\Api\Concerns;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpFoundation\Response;

trait ApiResponse
{
    /**
     * Standardized success response envelope for ELIOR API.
     *
     * @param  array<string, mixed>  $meta
     */
    protected function success(
        mixed $data = [],
        ?string $message = null,
        int $statusCode = Response::HTTP_OK,
        array $meta = []
    ): JsonResponse {
        return response()->json([
            'data' => $data,
            'meta' => (object) $meta,
            'message' => $message,
        ], $statusCode);
    }

    /**
     * Standardized error response envelope for ELIOR API.
     *
     * @param  array<string, mixed>  $meta
     */
    protected function error(
        string $message,
        int $statusCode = Response::HTTP_BAD_REQUEST,
        mixed $errors = null,
        array $meta = []
    ): JsonResponse {
        $payload = [
            'data' => null,
            'meta' => (object) $meta,
            'message' => $message,
        ];

        if ($errors !== null) {
            $payload['errors'] = $errors;
        }

        return response()->json($payload, $statusCode);
    }
}
