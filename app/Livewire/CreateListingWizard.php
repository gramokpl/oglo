<?php

namespace App\Livewire;

use Livewire\Component;
use Livewire\WithFileUploads;
use App\Models\Listing;
use App\Models\Category;
use App\Services\StripePaymentService;
use Illuminate\Support\Str;
use Mews\Purifier\Facades\Purifier;

class CreateListingWizard extends Component
{
    use WithFileUploads;

    public int $currentStep = 1;
    public string $honeypot = ''; // Ukryta pułapka na boty spamujące

    // Krok 1: Dane podstawowe
    public string $title = '';
    public ?int $categoryId = null;
    public string $price = '';
    public bool $isNegotiable = false;
    public string $location = '';
    public string $region = 'Mazowieckie';

    // Krok 2: Opis i zdjęcia
    public string $description = '';
    public array $uploadedImages = [];

    // Krok 3: Pakiet promowania
    public string $promotionTier = 'standard'; // standard, promoted, vip

    protected function rules(): array
    {
        if ($this->currentStep === 1) {
            return [
                'title' => 'required|string|min:5|max:120',
                'categoryId' => 'required|exists:categories,id',
                'price' => 'required|numeric|min:0',
                'location' => 'required|string|min:2|max:60',
            ];
        }

        if ($this->currentStep === 2) {
            return [
                'description' => 'required|string|min:20|max:5000',
                'uploadedImages.*' => 'image|max:5120', // maks 5MB
            ];
        }

        return [
            'promotionTier' => 'required|in:standard,promoted,vip',
        ];
    }

    public function nextStep(): void
    {
        // Sprawdzenie Honeypot
        if (!empty($this->honeypot)) {
            abort(403, 'Bot activity detected');
        }

        $this->validate();
        $this->currentStep++;
    }

    public function previousStep(): void
    {
        $this->currentStep = max(1, $this->currentStep - 1);
    }

    public function submitListing(StripePaymentService $stripeService)
    {
        $this->validate();

        // Bezpieczna sanityzacja opisu przeciwko atakom XSS
        $cleanDescription = Purifier::clean($this->description);

        $listing = Listing::create([
            'user_id' => auth()->id(),
            'category_id' => $this->categoryId,
            'title' => strip_tags($this->title),
            'slug' => Str::slug($this->title) . '-' . Str::random(6),
            'description' => $cleanDescription,
            'price' => $this->price,
            'is_negotiable' => $this->isNegotiable,
            'location' => strip_tags($this->location),
            'region' => $this->region,
            'status' => 'pending_review',
            'is_promoted' => $this->promotionTier === 'promoted',
            'is_vip' => $this->promotionTier === 'vip',
            'featured_until' => $this->promotionTier !== 'standard' ? now()->addDays(30) : null,
        ]);

        // Jeśli wybrano płatne promowanie, generujemy sesję Stripe Checkout
        if ($this->promotionTier !== 'standard') {
            $checkoutUrl = $stripeService->createPromotionCheckoutSession($listing, $this->promotionTier);
            return redirect()->away($checkoutUrl);
        }

        session()->flash('success', 'Ogłoszenie zostało dodane i oczekuje na weryfikację!');
        return redirect()->route('listings.show', $listing->slug);
    }

    public function render()
    {
        return view('livewire.create-listing-wizard', [
            'categories' => Category::orderBy('name')->get(),
        ]);
    }
}
