<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Collection;
use App\Models\Enquiry;
use App\Models\Variety;
use Illuminate\Http\JsonResponse;

class AdminDashboardController extends Controller
{
    use ApiResponse;

    /**
     * Retrieve authenticated admin dashboard overview metrics.
     */
    public function index(): JsonResponse
    {
        $metrics = [
            'collections_count' => Collection::count(),
            'varieties_count' => Variety::count(),
            'enquiries_count' => Enquiry::count(),
            'pending_enquiries_count' => Enquiry::where('status', 'pending')->count(),
            'recent_enquiries' => Enquiry::latest()->take(5)->get(),
        ];

        return $this->success($metrics, 'Admin dashboard metrics retrieved.');
    }
}
