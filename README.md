# 🚀 Nowoczesny Serwis Ogłoszeniowy (Laravel 13 + Livewire v3 + Filament v3 + Stripe)

Kompletny, bezpieczny portal ogłoszeniowy stworzony w oparciu o ekosystem **Laravel (11/12/13)**, panel administracyjny **Filament Admin v3**, komponenty reaktywne **Livewire v3** oraz bramkę płatności **Stripe Checkout & Webhooks**.

---

## 📦 Struktura Projektu Laravel

- **`composer.json`** – Zależności frameworka Laravel, Filament v3, Livewire v3, Stripe PHP, Spatie Permission, Spatie Honeypot i HTMLPurifier.
- **`app/Models/`**:
  - `Listing.php` – Model ogłoszenia (relacje, statusy, scope'y dla promowanych/VIP, soft-deletes).
  - `Category.php` – Model kategorii ogłoszeń.
  - `Order.php` – Model zamówień i transakcji płatności Stripe.
  - `User.php` – Model użytkownika z rolami (`admin`, `moderator`, `user`) i integracją z Filament Panel (`FilamentUser`).
- **`app/Filament/Resources/`**:
  - `ListingResource.php` – Zasób administracyjny Filament do moderacji, zatwierdzania i edycji ogłoszeń.
- **`app/Livewire/`**:
  - `CreateListingWizard.php` – Wieloetapowy, reaktywny kreator ogłoszeń z walidacją w czasie rzeczywistym i ochroną antyspamową Honeypot.
- **`app/Services/`**:
  - `StripePaymentService.php` – Tworzenie sesji Stripe Checkout dla pakietów Promowany i VIP oraz bezpieczna weryfikacja webhooków.
- **`app/Http/Controllers/`**:
  - `StripeWebhookController.php` – Obsługa webhooka Stripe z weryfikacją sygnatury HMAC SHA-256 (`stripe-signature`).
  - `ListingController.php` – Kontroler publicznego katalogu i podglądu ofert.
- **`app/Http/Middleware/`**:
  - `ClassifiedSecurityShield.php` – Ochrona Rate Limiting (DDoS) oraz nagłówki bezpieczeństwa OWASP.
- **`database/migrations/`**:
  - Migracje tabel `categories`, `listings`, `orders`.
- **`database/seeders/DatabaseSeeder.php`**:
  - Wstępne dane kategorii, konta administratora (`admin@serwis-ogloszeniowy.pl` / `admin123`) i ogłoszeń demonstracyjnych.
- **`routes/web.php` & `routes/api.php`**:
  - Trasy aplikacji i webhooka Stripe.

---

## 🛠️ Wymagania systemowe

* **PHP** >= 8.2 (rozszerzenia: `pdo`, `mbstring`, `fileinfo`, `intl`, `gd`, `bcmath`)
* **Composer** >= 2.6
* **Node.js** >= 18 oraz **npm** (do kompilacji assetów Tailwind CSS & Vite)
* **Baza danych**: MySQL 8+ lub PostgreSQL 14+

---

## ⚡ Instalacja i Uruchomienie (Krok po Kroku)

### 1. Klonowanie i instalacja zależności
```bash
git clone <adres-twojego-repozytorium-github>
cd <katalog-projektu>

# Instalacja pakietów PHP (Laravel, Filament, Livewire, Stripe)
composer install

# Instalacja zależności frontendowych (Tailwind, Vite)
npm install
npm run build
```

### 2. Konfiguracja pliku środowiskowego
```bash
cp .env.example .env
php artisan key:generate
```

Uzupełnij w `.env` dane bazy danych oraz klucze Stripe:
```ini
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ogloszenia_db
DB_USERNAME=root
DB_PASSWORD=secret

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Migracje bazy i seedowanie danych
```bash
php artisan migrate --seed
```

### 4. Dostęp do Panelu Administracyjnego Filament
Panel administracyjny jest dostępny pod adresem:
`http://127.0.0.1:8000/admin`

Domyślne dane logowania (z seedera):
* **Email:** `admin@serwis-ogloszeniowy.pl`
* **Hasło:** `admin123`

Możesz też utworzyć nowego administratora poleceniem:
```bash
php artisan make:filament-user
```

### 5. Uruchomienie serwera deweloperskiego
```bash
php artisan serve
```
Aplikacja ruszy pod adresem `http://127.0.0.1:8000`.

---

## 🔒 Bezpieczeństwo i Integracja Stripe
- **Honeypot**: Ukryte pole w formularzu blokujące boty próbujące automatycznie dodawać oferty.
- **Purifier**: Czyszczenie opisów ofert z niebezpiecznego kodu JavaScript / XSS.
- **Podpisy Webhooków**: Weryfikacja sygnatury kryptograficznej Stripe chroniąca przed fałszowaniem wpłat.
