<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Api\Concerns\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Symfony\Component\HttpFoundation\Response;

class AdminAuthController extends Controller
{
    use ApiResponse;

    /**
     * Display the Admin Login interface.
     */
    public function showLogin(Request $request): InertiaResponse|RedirectResponse
    {
        if (Auth::check() && $request->user()?->isAdmin()) {
            return redirect()->route('admin.dashboard');
        }

        return Inertia::render('admin/Login', [
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * Authenticate the Admin credentials and establish session.
     */
    public function login(Request $request): RedirectResponse|JsonResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
            'remember' => ['nullable', 'boolean'],
        ]);

        $throttleKey = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $message = "Too many login attempts. Please try again in {$seconds} seconds.";

            if ($request->expectsJson()) {
                return $this->error($message, Response::HTTP_TOO_MANY_REQUESTS);
            }

            throw ValidationException::withMessages([
                'email' => [$message],
            ]);
        }

        $remember = (bool) ($credentials['remember'] ?? false);

        // Check if user exists and verify admin role
        $user = User::where('email', $credentials['email'])->first();

        if ($user && ! $user->isAdmin()) {
            RateLimiter::hit($throttleKey);

            if ($request->expectsJson()) {
                return $this->error('Access denied: User does not have administrator privileges.', Response::HTTP_FORBIDDEN);
            }

            throw ValidationException::withMessages([
                'email' => ['Access denied: You do not have administrator privileges.'],
            ]);
        }

        if (! Auth::attempt(['email' => $credentials['email'], 'password' => $credentials['password'], 'is_admin' => true], $remember)) {
            RateLimiter::hit($throttleKey);

            if ($request->expectsJson()) {
                return $this->error('The provided credentials do not match our records.', Response::HTTP_UNPROCESSABLE_ENTITY);
            }

            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        RateLimiter::clear($throttleKey);
        $request->session()->regenerate();

        if ($request->expectsJson()) {
            return $this->success([
                'user' => Auth::user(),
                'redirect' => route('admin.dashboard'),
            ], 'Authentication successful.');
        }

        return redirect()->intended(route('admin.dashboard'));
    }

    /**
     * Terminate the authenticated Admin session.
     */
    public function logout(Request $request): RedirectResponse|JsonResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($request->expectsJson()) {
            return $this->success(null, 'Logged out successfully.');
        }

        return redirect()->route('admin.login')->with('status', 'You have been logged out.');
    }
}
