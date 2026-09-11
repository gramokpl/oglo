<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Listing;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Administrator Filament
        $admin = User::firstOrCreate(
            ['email' => 'admin@serwis-ogloszeniowy.pl'],
            [
                'name' => 'Administrator Główny',
                'password' => bcrypt('admin123'),
                'role' => 'admin',
                'is_verified' => true,
                'two_factor_enabled' => true,
            ]
        );

        // Użytkownik testowy
        $user = User::firstOrCreate(
            ['email' => 'jan.kowalski@example.com'],
            [
                'name' => 'Jan Kowalski',
                'phone' => '+48 691 882 119',
                'password' => bcrypt('password123'),
                'role' => 'user',
                'is_verified' => true,
                'two_factor_enabled' => false,
            ]
        );

        $categoriesData = [
            ['name' => 'Elektronika', 'slug' => 'elektronika', 'icon' => 'laptop'],
            ['name' => 'Motoryzacja', 'slug' => 'motoryzacja', 'icon' => 'car'],
            ['name' => 'Nieruchomości', 'slug' => 'nieruchomosci', 'icon' => 'home'],
            ['name' => 'Dom i Ogród', 'slug' => 'dom-i-ogrod', 'icon' => 'armchair'],
            ['name' => 'Moda i Styl', 'slug' => 'moda', 'icon' => 'shirt'],
            ['name' => 'Sport i Hobby', 'slug' => 'sport', 'icon' => 'bike'],
            ['name' => 'Praca', 'slug' => 'praca', 'icon' => 'briefcase'],
            ['name' => 'Usługi', 'slug' => 'uslugi', 'icon' => 'wrench'],
        ];

        foreach ($categoriesData as $c) {
            Category::firstOrCreate(['slug' => $c['slug']], $c);
        }

        $catElektronika = Category::where('slug', 'elektronika')->first();
        $catAuto = Category::where('slug', 'motoryzacja')->first();

        Listing::firstOrCreate(
            ['slug' => 'macbook-pro-16-m3-max-36gb-1tb'],
            [
                'user_id' => $user->id,
                'category_id' => $catElektronika->id,
                'title' => 'MacBook Pro 16" M3 Max 36GB / 1TB Space Black Stan Idealny',
                'description' => 'Sprzedam laptop w stanie idealnym, kupiony w polskim salonie Apple. Bateria 99%, pełna gwarancja.',
                'price' => 12900.00,
                'is_negotiable' => true,
                'location' => 'Warszawa',
                'region' => 'Mazowieckie',
                'status' => 'active',
                'is_promoted' => true,
                'is_vip' => true,
                'featured_until' => now()->addDays(28),
                'views_count' => 1420,
                'contact_phone' => '+48 691 882 119',
                'contact_email' => 'jan.kowalski@example.com',
                'images' => ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
            ]
        );
    }
}
