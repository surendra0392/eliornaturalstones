<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    use ApiResponse;

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        // 1. Check Authentication
        if (! $user) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return $this->error('Unauthenticated.', Response::HTTP_UNAUTHORIZED);
            }

            return redirect()->guest(route('admin.login'))->with('error', 'Please authenticate to access the admin console.');
        }

        // 2. Check Admin Authorization
        if (! $user->isAdmin()) {
            if ($request->expectsJson() || $request->is('api/*')) {
                return $this->error('Forbidden: Administrator privileges required.', Response::HTTP_FORBIDDEN);
            }

            abort(Response::HTTP_FORBIDDEN, 'Forbidden: Administrator privileges required.');
        }

        return $next($request);
    }
}
