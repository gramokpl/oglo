import { Category, Listing, UserAccount, StripeTransaction, EmailNotification, SecurityLog, SecuritySettings, StripeConfig } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'elektronika', name: 'Elektronika', slug: 'elektronika', icon: 'Smartphone', count: 42 },
  { id: 'motoryzacja', name: 'Motoryzacja', slug: 'motoryzacja', icon: 'Car', count: 28 },
  { id: 'nieruchomosci', name: 'Nieruchomości', slug: 'nieruchomosci', icon: 'Home', count: 19 },
  { id: 'dom-ogrod', name: 'Dom i Ogród', slug: 'dom-ogrod', icon: 'Sofa', count: 35 },
  { id: 'praca', name: 'Praca i Kariera', slug: 'praca', icon: 'Briefcase', count: 14 },
  { id: 'moda', name: 'Moda i Akcesoria', slug: 'moda', icon: 'Shirt', count: 50 },
  { id: 'uslugi', name: 'Usługi i Firmy', slug: 'uslugi', icon: 'Wrench', count: 22 },
  { id: 'sport', name: 'Sport i Hobby', slug: 'sport', icon: 'Bike', count: 17 },
];

export const INITIAL_USERS: UserAccount[] = [
  {
    id: 'user-admin',
    name: 'Główny Administrator (Filament)',
    email: 'admin@serwis-ogloszeniowy.pl',
    role: 'admin',
    phone: '+48 600 100 200',
    twoFactorEnabled: true,
    verified: true,
    createdAt: '2025-01-10T10:00:00Z',
    listingsCount: 2,
  },
  {
    id: 'user-mod',
    name: 'Kamil Moderator',
    email: 'moderator@serwis-ogloszeniowy.pl',
    role: 'moderator',
    phone: '+48 501 234 567',
    twoFactorEnabled: true,
    verified: true,
    createdAt: '2025-02-15T12:30:00Z',
    listingsCount: 1,
  },
  {
    id: 'user-jan',
    name: 'Jan Kowalski (Użytkownik)',
    email: 'jan.kowalski@example.com',
    role: 'user',
    phone: '+48 691 882 119',
    twoFactorEnabled: false,
    verified: true,
    createdAt: '2025-03-01T08:15:00Z',
    listingsCount: 4,
  },
  {
    id: 'user-anna',
    name: 'Anna Nowak',
    email: 'anna.nowak@gmail.com',
    role: 'user',
    phone: '+48 782 443 210',
    twoFactorEnabled: true,
    verified: true,
    createdAt: '2025-03-12T14:40:00Z',
    listingsCount: 2,
  }
];

export const INITIAL_LISTINGS: Listing[] = [
  {
    id: 'lst-101',
    title: 'Apple MacBook Pro 14" M3 Pro 18GB/512GB Space Black - Gwarancja',
    slug: 'apple-macbook-pro-14-m3-pro-space-black',
    description: 'Stan idealny, zaledwie 34 cykle baterii. Zakupiony w polskim salonie iSpot w lutym 2025. W komplecie oryginalny zasilacz MagSafe 70W, pudełko oraz dowód zakupu. Brak jakichkolwiek rys, używany wyłącznie w biurze.',
    price: 8499,
    negotiable: true,
    category: 'elektronika',
    location: 'Warszawa',
    region: 'Mazowieckie',
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-jan',
    userName: 'Jan Kowalski',
    userPhone: '+48 691 882 119',
    userEmail: 'jan.kowalski@example.com',
    userVerified: true,
    status: 'vip',
    views: 428,
    createdAt: '2026-03-01T10:00:00Z',
    expiresAt: '2026-04-01T10:00:00Z',
    featuredUntil: '2026-03-31T23:59:59Z',
    highlighted: true,
    vip: true,
  },
  {
    id: 'lst-102',
    title: 'BMW Seria 3 G20 320d xDrive M Sport Shadowline 2021 Bezwypadkowy',
    slug: 'bmw-seria-3-g20-320d-xdrive-m-sport-2021',
    description: 'Pierwszy właściciel, salon Polska, serwisowany wyłącznie w ASO BMW Bawaria Motors. Przebieg 78 500 km. Pełny pakiet M Sport, lakier Dravit Grey, nagłośnienie Harman Kardon, reflektory laserowe, dach panoramiczny. Samochód zabezpieczony powłoką ceramiczną.',
    price: 159900,
    negotiable: true,
    category: 'motoryzacja',
    location: 'Kraków',
    region: 'Małopolskie',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-jan',
    userName: 'Jan Kowalski',
    userPhone: '+48 691 882 119',
    userEmail: 'jan.kowalski@example.com',
    userVerified: true,
    status: 'promoted',
    views: 890,
    createdAt: '2026-03-02T14:20:00Z',
    expiresAt: '2026-04-02T14:20:00Z',
    featuredUntil: '2026-03-25T23:59:59Z',
    highlighted: true,
    vip: false,
  },
  {
    id: 'lst-103',
    title: 'Nowoczesny Apartament 2 pokoje 48m² z Tarasem i Miejscem Parkingowym',
    slug: 'nowoczesny-apartament-2-pokoje-48m2-taras',
    description: 'Do wynajęcia od zaraz wykończony w wysokim standardzie apartament na Mokotowie (ul. Cybernetyki). Klimatyzacja, w pełni wyposażona kuchnia ze sprzętem Bosch, winda, monitoring, osiedle zamknięte. W cenie komórka lokatorska.',
    price: 3600,
    negotiable: false,
    category: 'nieruchomosci',
    location: 'Warszawa',
    region: 'Mazowieckie',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-anna',
    userName: 'Anna Nowak',
    userPhone: '+48 782 443 210',
    userEmail: 'anna.nowak@gmail.com',
    userVerified: true,
    status: 'vip',
    views: 612,
    createdAt: '2026-03-03T11:05:00Z',
    expiresAt: '2026-04-03T11:05:00Z',
    featuredUntil: '2026-03-30T23:59:59Z',
    highlighted: true,
    vip: true,
  },
  {
    id: 'lst-104',
    title: 'Rower Gravel Canyon Grizl CF SL 8 2024 Rozmiar M Carbon',
    slug: 'rower-gravel-canyon-grizl-cf-sl-8-carbon',
    description: 'Świetny gravel na osprzęcie Shimano GRX RX820 2x12. Koła DT Swiss Gravel LN, opony Schwalbe G-One Bite 45mm. Przebieg około 900 km, stan wzorowy. Po pełnym przeglądzie wiosennym w autoryzowanym serwisie.',
    price: 9200,
    negotiable: true,
    category: 'sport',
    location: 'Wrocław',
    region: 'Dolnośląskie',
    images: [
      'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-anna',
    userName: 'Anna Nowak',
    userPhone: '+48 782 443 210',
    userEmail: 'anna.nowak@gmail.com',
    userVerified: true,
    status: 'active',
    views: 245,
    createdAt: '2026-03-04T09:15:00Z',
    expiresAt: '2026-04-04T09:15:00Z',
    highlighted: false,
    vip: false,
  },
  {
    id: 'lst-105',
    title: 'Stół z Litego Dębu 200x100cm Styl Loft / Industrialny Rękodzieło',
    slug: 'stol-lity-dab-200x100-loft-industrial',
    description: 'Blat z sezonowanego, certyfikowanego polskiego dębu o grubości 4.5 cm, zabezpieczony matowym olejem Rubio Monocoat. Metalowa podstawa malowana proszkowo na kolor czarny mat.',
    price: 3100,
    negotiable: true,
    category: 'dom-ogrod',
    location: 'Poznań',
    region: 'Wielkopolskie',
    images: [
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-jan',
    userName: 'Jan Kowalski',
    userPhone: '+48 691 882 119',
    userEmail: 'jan.kowalski@example.com',
    userVerified: true,
    status: 'active',
    views: 180,
    createdAt: '2026-03-05T16:45:00Z',
    expiresAt: '2026-04-05T16:45:00Z',
    highlighted: false,
    vip: false,
  },
  {
    id: 'lst-106',
    title: 'Senior Laravel / Full-Stack Developer (B2B, 100% Zdalnie)',
    slug: 'senior-laravel-full-stack-developer-remote',
    description: 'Poszukujemy doświadczonego programisty z biegłą znajomością Laravel 11/12, Livewire 3, Filament Admin oraz Tailwind CSS do długofalowego projektu fintech. Stawka 140 - 180 PLN/h netto B2B.',
    price: 26000,
    negotiable: true,
    category: 'praca',
    location: 'Gdańsk',
    region: 'Pomorskie',
    images: [
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80'
    ],
    userId: 'user-admin',
    userName: 'Główny Administrator (Filament)',
    userPhone: '+48 600 100 200',
    userEmail: 'admin@serwis-ogloszeniowy.pl',
    userVerified: true,
    status: 'promoted',
    views: 940,
    createdAt: '2026-03-06T08:00:00Z',
    expiresAt: '2026-04-06T08:00:00Z',
    featuredUntil: '2026-03-28T23:59:59Z',
    highlighted: true,
    vip: false,
  }
];

export const INITIAL_STRIPE_CONFIG: StripeConfig = {
  publishableKey: 'pk_test_51MzSAMPLE_KEY_LARAVEL_FILAMENT_LIVEWIRE_PUBLIC',
  secretKey: 'sk_test_51MzSAMPLE_KEY_LARAVEL_FILAMENT_LIVEWIRE_SECRET',
  webhookSecret: 'whsec_99a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4',
  currency: 'PLN',
  testMode: true,
  standardPrice: 0,
  promotedPrice: 19.00,
  vipPrice: 39.00,
};

export const INITIAL_TRANSACTIONS: StripeTransaction[] = [
  {
    id: 'tx-901',
    stripePaymentIntentId: 'pi_3PjX89A12B34C56D78',
    listingId: 'lst-101',
    listingTitle: 'Apple MacBook Pro 14" M3 Pro',
    userEmail: 'jan.kowalski@example.com',
    userName: 'Jan Kowalski',
    amount: 39.00,
    currency: 'PLN',
    tier: 'vip',
    status: 'succeeded',
    createdAt: '2026-03-01T10:05:00Z',
    cardLast4: '4242',
    receiptUrl: 'https://pay.stripe.com/receipts/acct_demo/ch_12345/rcpt_sample1',
  },
  {
    id: 'tx-902',
    stripePaymentIntentId: 'pi_3PjY99Z99B88C77D66',
    listingId: 'lst-102',
    listingTitle: 'BMW Seria 3 G20 320d xDrive M Sport',
    userEmail: 'jan.kowalski@example.com',
    userName: 'Jan Kowalski',
    amount: 19.00,
    currency: 'PLN',
    tier: 'promoted',
    status: 'succeeded',
    createdAt: '2026-03-02T14:25:00Z',
    cardLast4: '5556',
    receiptUrl: 'https://pay.stripe.com/receipts/acct_demo/ch_12346/rcpt_sample2',
  },
  {
    id: 'tx-903',
    stripePaymentIntentId: 'pi_3PjZ11X11B22C33D44',
    listingId: 'lst-103',
    listingTitle: 'Nowoczesny Apartament 2 pokoje 48m²',
    userEmail: 'anna.nowak@gmail.com',
    userName: 'Anna Nowak',
    amount: 39.00,
    currency: 'PLN',
    tier: 'vip',
    status: 'succeeded',
    createdAt: '2026-03-03T11:10:00Z',
    cardLast4: '4242',
    receiptUrl: 'https://pay.stripe.com/receipts/acct_demo/ch_12347/rcpt_sample3',
  }
];

export const INITIAL_EMAILS: EmailNotification[] = [
  {
    id: 'em-001',
    to: 'jan.kowalski@example.com',
    subject: '✅ Twoje ogłoszenie zostało opublikowane i wyróżnione!',
    type: 'listing_activated',
    contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0f172a;">Witaj Jan!</h2>
      <p>Twoje ogłoszenie <strong>"Apple MacBook Pro 14 M3 Pro"</strong> zostało pomyślnie opłacone i wyróżnione pakietem <strong>VIP</strong>.</p>
      <div style="background: #f8fafc; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0;">
        <p style="margin: 0;"><strong>Pakiet:</strong> VIP (Strona Główna + Góra Listy)</p>
        <p style="margin: 0;"><strong>Ważność promowania:</strong> 30 dni</p>
      </div>
      <p>Dziękujemy za korzystanie z naszego serwisu ogłoszeniowego Laravel!</p>
    </div>`,
    sentAt: '2026-03-01T10:06:00Z',
    read: false,
  },
  {
    id: 'em-002',
    to: 'jan.kowalski@example.com',
    subject: '🧾 Potwierdzenie płatności Stripe: 39.00 PLN (Pakiet VIP)',
    type: 'payment_success',
    contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0f172a;">Dziękujemy za płatność!</h2>
      <p>Otrzymaliśmy płatność kartą zakończoną na <strong>4242</strong>.</p>
      <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0;">Identyfikator transakcji:</td><td style="text-align: right; font-family: monospace;">pi_3PjX89A12B34C56D78</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 8px 0;">Kwota brutto:</td><td style="text-align: right; font-weight: bold;">39.00 PLN</td></tr>
        <tr><td style="padding: 8px 0;">Operator płatności:</td><td style="text-align: right;">Stripe Payments Europe Ltd.</td></tr>
      </table>
    </div>`,
    sentAt: '2026-03-01T10:05:30Z',
    read: true,
  },
  {
    id: 'em-003',
    to: 'anna.nowak@gmail.com',
    subject: '💬 Nowe zapytanie od kupującego w sprawie apartamentu',
    type: 'new_message',
    contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2 style="color: #0f172a;">Nowa wiadomość w serwisie!</h2>
      <p>Użytkownik <strong>Piotr Zieliński</strong> przesłał zapytanie do Twojego ogłoszenia <em>"Nowoczesny Apartament 2 pokoje 48m²"</em>:</p>
      <blockquote style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 10px 16px; margin: 12px 0; font-style: italic;">
        "Dzień dobry, czy miejsce postojowe w garażu podziemnym jest już wliczone w podany czynsz najmu?"
      </blockquote>
      <p>Odpowiedz bezpośrednio przez Panel Użytkownika Livewire.</p>
    </div>`,
    sentAt: '2026-03-03T14:20:00Z',
    read: false,
  }
];

export const INITIAL_SECURITY_SETTINGS: SecuritySettings = {
  rateLimitingEnabled: true,
  maxRequestsPerMinute: 60,
  honeypotSpamFilter: true,
  xssSanitization: true,
  phishingKeywordFilter: true,
  require2FAForAdmin: true,
  sessionTimeoutMinutes: 120,
  watermarkUploadedImages: true,
};

export const INITIAL_SECURITY_LOGS: SecurityLog[] = [
  {
    id: 'sec-1',
    timestamp: '2026-03-09T08:12:44Z',
    event: 'Ochrona Honeypot: Zablokowano bota spamującego',
    ip: '185.220.101.42',
    userAgent: 'Python-urllib/3.10',
    severity: 'danger',
    details: 'Wypełniono ukryte pole "_website_hp_trap" w formularzu dodawania ogłoszenia. Żądanie odrzucone z kodem 403 Forbidden.',
  },
  {
    id: 'sec-2',
    timestamp: '2026-03-09T08:24:10Z',
    event: 'Filtr Phishingu: Wykryto próbę wysłania linku wyłudzającego',
    ip: '89.64.12.98',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    severity: 'warning',
    details: 'Wiadomość w czacie zawierała podejrzaną domenę "olx-platnosc-bezpieczna.xyz". Link został automatycznie zneutralizowany.',
  },
  {
    id: 'sec-3',
    timestamp: '2026-03-09T09:02:18Z',
    event: 'Pomyślne uwierzytelnienie Filament Admin z kodem 2FA',
    ip: '194.29.130.5',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    severity: 'info',
    details: 'Użytkownik admin@serwis-ogloszeniowy.pl zalogował się do panelu zarządczego Filament po weryfikacji TOTP.',
  },
  {
    id: 'sec-4',
    timestamp: '2026-03-09T09:40:02Z',
    event: 'Weryfikacja podpisu Webhooka Stripe (HMAC SHA-256)',
    ip: '54.187.174.169',
    userAgent: 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
    severity: 'info',
    details: 'Podpis stripe-signature zweryfikowany pomyślnie z secretem whsec_***. Event checkout.session.completed przetworzony.',
  }
];
