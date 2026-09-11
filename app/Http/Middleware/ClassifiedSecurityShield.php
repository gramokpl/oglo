<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class ClassifiedSecurityShield
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1. Zabezpieczenie przed atakami DDoS i spamem (Rate Limiting)
        $ip = $request->ip();
        $executed = RateLimiter::attempt(
            'portal-shield:' . $ip,
            $perMinute = 60,
            function() {}
        );

        if (!$executed) {
            return response()->json([
                'error' => 'Przekroczono limit zapytań. Odczekaj chwilę.',
                'retry_after' => RateLimiter::availableIn('portal-shield:' . $ip),
            ], 429);
        }

        // 2. Dodanie nagłówków bezpieczeństwa (OWASP Best Practices)
        $response = $next($request);

        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');

        return $response;
    }
}
