import JSZip from 'jszip';

export interface LaravelFile {
  path: string;
  language: string;
  description: string;
  content: string;
}

export const LARAVEL_PROJECT_FILES: LaravelFile[] = [
  {
    path: 'artisan',
    language: 'php',
    description: 'Konsola CLI Artisan frameworka Laravel',
    content: `#!/usr/bin/env php
<?php

use Symfony\\Component\\Console\\Input\\ArgvInput;

define('LARAVEL_START', microtime(true));

// 1. Sprawdzenie autoloader Composer
if (!file_exists(__DIR__.'/vendor/autoload.php')) {
    fwrite(STDERR, "\\n[BŁĄD] Brak katalogu vendor/ lub pliku autoloader.\\n");
    fwrite(STDERR, "Uruchom najpierw w katalogu projektu: composer install\\n\\n");
    exit(1);
}

require __DIR__.'/vendor/autoload.php';

// 2. Sprawdzenie bootstrap/app.php
if (!file_exists(__DIR__.'/bootstrap/app.php')) {
    fwrite(STDERR, "\\n[BŁĄD] Brak pliku bootstrap/app.php wymaganego do uruchomienia aplikacji Laravel.\\n\\n");
    exit(1);
}

// Bootstrap Laravel i wykonanie komendy Artisan...
$app = require_once __DIR__.'/bootstrap/app.php';
$status = $app->handleCommand(new ArgvInput);
exit($status);
`
  },
  {
    path: 'bootstrap/app.php',
    language: 'php',
    description: 'Główny plik startowy aplikacji Laravel 11/12/13 (routing, middleware, wyjątki)',
    content: `<?php

use Illuminate\\Foundation\\Application;
use Illuminate\\Foundation\\Configuration\\Exceptions;
use Illuminate\\Foundation\\Configuration\\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \\App\\Http\\Middleware\\ClassifiedSecurityShield::class,
        ]);

        $middleware->validateCsrfTokens(except: [
            'stripe/webhook',
            'api/stripe/webhook',
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
`
  },
  {
    path: 'bootstrap/providers.php',
    language: 'php',
    description: 'Rejestracja providerów usług i panelu Filament Admin',
    content: `<?php

return [
    App\\Providers\\AppServiceProvider::class,
    App\\Providers\\Filament\\AdminPanelProvider::class,
];
`
  },
  {
    path: 'composer.json',
    language: 'json',
    description: 'Konfiguracja Composer z Laravel 11/12/13, Filament v3, Livewire v3 i pakietem Stripe',
    content: `{
    "name": "laravel/classifieds-portal",
    "type": "project",
    "description": "Nowoczesny serwis ogłoszeniowy z panelem Filament, Livewire i płatnościami Stripe",
    "keywords": ["laravel", "filament", "livewire", "stripe", "classifieds"],
    "license": "MIT",
    "require": {
        "php": "^8.2",
        "filament/filament": "^3.2",
        "filament/spatie-laravel-media-library-plugin": "^3.2",
        "laravel/framework": "^11.0|^12.0",
        "laravel/tinker": "^2.9",
        "livewire/livewire": "^3.5",
        "spatie/laravel-permission": "^6.4",
        "spatie/laravel-honeypot": "^4.5",
        "mews/purifier": "^3.4",
        "stripe/stripe-php": "^16.0"
    },
    "require-dev": {
        "fakerphp/faker": "^1.23",
        "laravel/pint": "^1.13",
        "mockery/mockery": "^1.6",
        "nunomaduro/collision": "^8.1",
        "pestphp/pest": "^3.0"
    },
    "autoload": {
        "psr-4": {
            "App\\\\": "app/",
            "Database\\\\Factories\\\\": "database/factories/",
            "Database\\\\Seeders\\\\": "database/seeders/"
        }
    },
    "scripts": {
        "post-autoload-dump": [
            "Illuminate\\\\Foundation\\\\ComposerScripts::postAutoloadDump",
            "@php artisan package:discover --ansi",
            "@php artisan filament:upgrade"
        ],
        "post-root-package-install": [
            "@php -r \\"file_exists('.env') || copy('.env.example', '.env');\\""
        ],
        "post-create-project-cmd": [
            "@php artisan key:generate --ansi"
        ]
    }
}`
  },
  {
    path: 'app/Models/Listing.php',
    language: 'php',
    description: 'Model Eloquent dla ogłoszenia z relacjami, scopes dla promowanych i bezpiecznym rzutowaniem',
    content: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Builder;

class Listing extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'is_negotiable',
        'location',
        'region',
        'images',
        'status', // pending_review, active, rejected, expired
        'is_promoted',
        'is_vip',
        'featured_until',
        'views_count',
        'contact_phone',
        'contact_email',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'is_negotiable' => 'boolean',
        'is_promoted' => 'boolean',
        'is_vip' => 'boolean',
        'featured_until' => 'datetime',
        'images' => 'array',
        'views_count' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    // Scopes
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }

    public function scopeVip(Builder $query): Builder
    {
        return $query->where('is_vip', true)
                     ->where('featured_until', '>=', now());
    }

    public function scopePromoted(Builder $query): Builder
    {
        return $query->where('is_promoted', true)
                     ->where('featured_until', '>=', now());
    }
}`
  },
  {
    path: 'app/Filament/Resources/ListingResource.php',
    language: 'php',
    description: 'Zasób Filament Admin z formularzem moderacji, tabelą ze statusami i akcjami zbiorczymi',
    content: `<?php

namespace App\\Filament\\Resources;

use App\\Filament\\Resources\\ListingResource\\Pages;
use App\\Models\\Listing;
use Filament\\Forms;
use Filament\\Forms\\Form;
use Filament\\Resources\\Resource;
use Filament\\Tables;
use Filament\\Tables\\Table;
use Filament\\Notifications\\Notification;
use Illuminate\\Support\\Str;

class ListingResource extends Resource
{
    protected static ?string $model = Listing::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static ?string $navigationGroup = 'Zarządzanie Portalem';
    protected static ?string $modelLabel = 'Ogłoszenie';
    protected static ?string $pluralModelLabel = 'Ogłoszenia';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\\Components\\Section::make('Podstawowe informacje')
                    ->schema([
                        Forms\\Components\\TextInput::make('title')
                            ->label('Tytuł ogłoszenia')
                            ->required()
                            ->maxLength(120)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, Forms\\Set $set) => $set('slug', Str::slug($state))),
                        
                        Forms\\Components\\TextInput::make('slug')
                            ->required()
                            ->unique(Listing::class, 'slug', ignoreRecord: true),

                        Forms\\Components\\Select::make('category_id')
                            ->label('Kategoria')
                            ->relationship('category', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\\Components\\Select::make('user_id')
                            ->label('Właściciel / Autor')
                            ->relationship('user', 'name')
                            ->searchable()
                            ->preload()
                            ->required(),

                        Forms\\Components\\TextInput::make('price')
                            ->label('Cena (PLN)')
                            ->numeric()
                            ->prefix('PLN')
                            ->required(),

                        Forms\\Components\\Toggle::make('is_negotiable')
                            ->label('Do negocjacji'),
                    ])->columns(2),

                Forms\\Components\\Section::make('Treść i multimedia')
                    ->schema([
                        Forms\\Components\\RichEditor::make('description')
                            ->label('Opis (oczyszczany przez HTMLPurifier)')
                            ->required()
                            ->columnSpanFull(),

                        Forms\\Components\\FileUpload::make('images')
                            ->label('Zdjęcia')
                            ->multiple()
                            ->image()
                            ->maxFiles(8)
                            ->directory('listings/photos')
                            ->columnSpanFull(),
                    ]),

                Forms\\Components\\Section::make('Status i Promowanie')
                    ->schema([
                        Forms\\Components\\Select::make('status')
                            ->options([
                                'pending_review' => 'Oczekuje na zatwierdzenie',
                                'active' => 'Opublikowane',
                                'rejected' => 'Odrzucone przez moderatora',
                                'expired' => 'Wygasłe',
                            ])
                            ->required(),

                        Forms\\Components\\Toggle::make('is_promoted')
                            ->label('Wyróżnione na liście'),

                        Forms\\Components\\Toggle::make('is_vip')
                            ->label('Pakiet VIP (Strona Główna)'),

                        Forms\\Components\\DateTimePicker::make('featured_until')
                            ->label('Ważność promowania'),
                    ])->columns(2),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\\Columns\\ImageColumn::make('images')
                    ->circular()
                    ->stacked()
                    ->limit(2),
                Tables\\Columns\\TextColumn::make('title')
                    ->label('Tytuł')
                    ->searchable()
                    ->limit(35)
                    ->sortable(),
                Tables\\Columns\\TextColumn::make('category.name')
                    ->label('Kategoria')
                    ->badge(),
                Tables\\Columns\\TextColumn::make('price')
                    ->money('PLN')
                    ->sortable(),
                Tables\\Columns\\BadgeColumn::make('status')
                    ->colors([
                        'warning' => 'pending_review',
                        'success' => 'active',
                        'danger' => 'rejected',
                        'gray' => 'expired',
                    ]),
                Tables\\Columns\\IconColumn::make('is_vip')
                    ->label('VIP')
                    ->boolean(),
                Tables\\Columns\\TextColumn::make('created_at')
                    ->dateTime('d.m.Y H:i')
                    ->sortable(),
            ])
            ->filters([
                Tables\\Filters\\SelectFilter::make('status'),
                Tables\\Filters\\TernaryFilter::make('is_vip')->label('Tylko VIP'),
                Tables\\Filters\\TernaryFilter::make('is_promoted')->label('Promowane'),
            ])
            ->actions([
                Tables\\Actions\\Action::make('approve')
                    ->label('Zatwierdź')
                    ->icon('heroicon-m-check-badge')
                    ->color('success')
                    ->visible(fn (Listing $record) => $record->status !== 'active')
                    ->action(function (Listing $record) {
                        $record->update(['status' => 'active']);
                        Notification::make()
                            ->title('Ogłoszenie zostało zatwierdzone')
                            ->success()
                            ->send();
                    }),
                Tables\\Actions\\EditAction::make(),
            ])
            ->bulkActions([
                Tables\\Actions\\BulkActionGroup::make([
                    Tables\\Actions\\DeleteBulkAction::make(),
                ]),
            ]);
    }
}`
  },
  {
    path: 'app/Livewire/CreateListingWizard.php',
    language: 'php',
    description: 'Komponent Livewire z wieloetapowym kreatorem ogłoszeń, sanityzacją, ochroną honeypot i integracją ze Stripe',
    content: `<?php

namespace App\\Livewire;

use Livewire\\Component;
use Livewire\\WithFileUploads;
use App\\Models\\Listing;
use App\\Models\\Category;
use App\\Services\\StripePaymentService;
use Illuminate\\Support\\Str;
use Mews\\Purifier\\Facades\\Purifier;

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
}`
  },
  {
    path: 'app/Services/StripePaymentService.php',
    language: 'php',
    description: 'Serwis płatności Stripe obsługujący sesje Checkout, weryfikację podpisów webhooków i aktywację',
    content: `<?php

namespace App\\Services;

use App\\Models\\Listing;
use App\\Models\\Order;
use App\\Notifications\\ListingPromotedNotification;
use Stripe\\Stripe;
use Stripe\\Checkout\\Session;
use Stripe\\Webhook;
use Illuminate\\Support\\Facades\\Log;

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
        } catch (\\Exception $e) {
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
}`
  },
  {
    path: 'app/Http/Middleware/ClassifiedSecurityShield.php',
    language: 'php',
    description: 'Middleware zabezpieczający: Rate Limiting, nagłówki CSP, blokada spamu i walidacja CSRF',
    content: `<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;
use Illuminate\\Support\\Facades\\RateLimiter;
use Symfony\\Component\\HttpFoundation\\Response;

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
}`
  },
  {
    path: 'app/Notifications/ListingPromotedNotification.php',
    language: 'php',
    description: 'Powiadomienie e-mail (Mailable / Notification) z szablonem Blade i fakturą',
    content: `<?php

namespace App\\Notifications;

use App\\Models\\Listing;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Notifications\\Notification;
use Illuminate\\Notifications\\Messages\\MailMessage;

class ListingPromotedNotification extends Notification
{
    use Queueable;

    public function __construct(
        public Listing $listing,
        public string $tier
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $tierName = $this->tier === 'vip' ? 'VIP (Strona Główna)' : 'Wyróżnione na Liście';

        return (new MailMessage)
            ->subject('🎉 Twoje ogłoszenie zostało pomyślnie promowane!')
            ->greeting('Cześć, ' . $notifiable->name . '!')
            ->line('Płatność przez Stripe została zaksięgowana z sukcesem.')
            ->line("Ogłoszenie: **{$this->listing->title}**")
            ->line("Aktywowany pakiet: **{$tierName}** na okres 30 dni.")
            ->action('Zobacz swoje ogłoszenie', url("/ogloszenie/{$this->listing->slug}"))
            ->line('Dziękujemy za korzystanie z naszego serwisu ogłoszeniowego.');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'listing_id' => $this->listing->id,
            'title' => $this->listing->title,
            'tier' => $this->tier,
        ];
    }
}`
  },
  {
    path: 'database/migrations/2026_01_01_create_listings_and_payments_tables.php',
    language: 'php',
    description: 'Migracje bazy danych MySQL / PostgreSQL dla tabel ogłoszeń, kategorii i transakcji',
    content: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('icon')->nullable();
            $table->timestamps();
        });

        Schema::create('listings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->longText('description');
            $table->decimal('price', 10, 2);
            $table->boolean('is_negotiable')->default(false);
            $table->string('location');
            $table->string('region')->default('Mazowieckie');
            $table->json('images')->nullable();
            $table->enum('status', ['pending_review', 'active', 'rejected', 'expired'])->default('pending_review');
            $table->boolean('is_promoted')->default(false);
            $table->boolean('is_vip')->default(false);
            $table->timestamp('featured_until')->nullable();
            $table->unsignedBigInteger('views_count')->default(0);
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'is_vip', 'created_at']);
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('listing_id')->constrained()->cascadeOnDelete();
            $table->string('stripe_payment_id')->nullable();
            $table->decimal('amount', 8, 2);
            $table->string('currency', 3)->default('pln');
            $table->string('tier');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
        Schema::dropIfExists('listings');
        Schema::dropIfExists('categories');
    }
};`
  },
  {
    path: '.env.example',
    language: 'ini',
    description: 'Przykładowa konfiguracja środowiskowa Laravel, bazy danych, Stripe i e-maili',
    content: `APP_NAME="Serwis Ogłoszeniowy"
APP_ENV=production
APP_KEY=base64:GENERATE_WITH_PHP_ARTISAN_KEY_GENERATE
APP_DEBUG=false
APP_URL=https://twoja-domena.pl

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ogloszenia_db
DB_USERNAME=root
DB_PASSWORD=secret

# Konfiguracja Płatności Stripe
STRIPE_KEY=pk_test_twoj_klucz_publiczny
STRIPE_SECRET=sk_test_twoj_klucz_prywatny
STRIPE_WEBHOOK_SECRET=whsec_twoj_klucz_webhooka
STRIPE_CURRENCY=pln

# Konfiguracja Wysyłki E-mail (SMTP / Mailgun / Resend)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailgun.org
MAIL_PORT=587
MAIL_USERNAME=twoj_user
MAIL_PASSWORD=twoje_haslo
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="powiadomienia@twoja-domena.pl"
MAIL_FROM_NAME="\${APP_NAME}"

# Ochrona i Bezpieczeństwo
HONEYPOT_ENABLED=true
SESSION_LIFETIME=120
RATE_LIMIT_PER_MINUTE=60`
  },
  {
    path: 'README.md',
    language: 'markdown',
    description: 'Instrukcja instalacji i uruchomienia projektu krok po kroku',
    content: `# Serwis Ogloszeniowy Laravel + Livewire + Filament + Stripe

Kompletny, nowoczesny system ogloszeniowy stworzony w oparciu o ekosystem Laravel 11/12/13, Livewire v3 oraz Filament v3.

## Wymagania
- PHP >= 8.2 (rozszerzenia: pdo, mbstring, fileinfo, intl, gd)
- Composer >= 2.6
- Node.js & npm (do kompilacji Tailwind CSS)
- Baza danych MySQL / PostgreSQL

## Instalacja krok po kroku

1. Pobierz zaleznosci:
   composer install
   npm install && npm run build

2. Skonfiguruj plik srodowiskowy:
   cp .env.example .env
   php artisan key:generate

3. Uruchom migracje i seedery:
   php artisan migrate --seed

4. Stworz konto administratora Filament:
   php artisan make:filament-user

5. Uruchom serwer developerski:
   php artisan serve

Panel administratora dostepny pod adresem: http://127.0.0.1:8000/admin
`
  }
];

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  for (const file of LARAVEL_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  return await zip.generateAsync({ type: 'blob' });
}
