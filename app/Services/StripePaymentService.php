<?php

namespace App\Services;

use App\Models\Listing;
use App\Models\Order;
use App\Notifications\ListingPromotedNotification;
use Stripe\Stripe;
use Stripe\Checkout\Session;
use Stripe\Webhook;
use Illuminate\Support\Facades\Log;

class StripePaymentService
{
    public function __construct()
    {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function createPromotionCheckoutSession(Listing $listing, string $tier): string
    {
        $prices = [
            'promoted' => 1900, // 19.00 PLN w groszach
            'vip' => 3900,      // 39.00 PLN w groszach
        ];

        $amount = $prices[$tier] ?? 1900;
        $tierName = $tier === 'vip' ? 'Pakiet VIP (Strona Główna)' : 'Pakiet Promowany (Góra Listy)';

        $session = Session::create([
            'payment_method_types' => ['card', 'blik', 'p24'],
            'customer_email' => auth()->user()->email,
            'line_items' => [[
                'price_data' => [
                    'currency' => config('services.stripe.currency', 'pln'),
                    'unit_amount' => $amount,
                    'product_data' => [
                        'name' => "Promowanie ogłoszenia: {$listing->title}",
                        'description' => $tierName,
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'metadata' => [
                'listing_id' => $listing->id,
                'tier' => $tier,
                'user_id' => auth()->id(),
            ],
            'success_url' => route('stripe.success') . '?session_id={CHECKOUT_SESSION_ID}',
            'cancel_url' => route('stripe.cancel', ['listing' => $listing->id]),
        ]);

        return $session->url;
    }

    public function handleWebhookPayload(string $payload, string $sigHeader): void
    {
        $endpointSecret = config('services.stripe.webhook_secret');

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $endpointSecret);
        } catch (\Exception $e) {
            Log::error('Błąd weryfikacji sygnatury Stripe Webhook: ' . $e->getMessage());
            abort(400, 'Invalid signature');
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $listingId = $session->metadata->listing_id ?? null;
            $tier = $session->metadata->tier ?? 'promoted';

            if ($listingId) {
                $listing = Listing::find($listingId);
                if ($listing) {
                    $listing->update([
                        'status' => 'active',
                        'is_promoted' => $tier === 'promoted' || $tier === 'vip',
                        'is_vip' => $tier === 'vip',
                        'featured_until' => now()->addDays(30),
                    ]);

                    Order::create([
                        'listing_id' => $listing->id,
                        'user_id' => $listing->user_id,
                        'stripe_payment_id' => $session->payment_intent,
                        'amount' => $session->amount_total / 100,
                        'currency' => $session->currency,
                        'tier' => $tier,
                        'status' => 'succeeded',
                    ]);

                    // Wysłanie e-maila z potwierdzeniem i aktywacją
                    $listing->user->notify(new ListingPromotedNotification($listing, $tier));
                }
            }
        }
    }
}
