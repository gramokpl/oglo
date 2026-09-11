<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Services\StripePaymentService;
use Symfony\Component\HttpFoundation\Response;

class StripeWebhookController extends Controller
{
    public function __invoke(Request $request, StripePaymentService $stripeService): Response
    {
        $payload = $request->getContent();
        $sigHeader = $request->header('stripe-signature') ?? '';

        $stripeService->handleWebhookPayload($payload, $sigHeader);

        return response()->json(['status' => 'success', 'message' => 'Webhook processed successfully']);
    }
}
