<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;
use App\Livewire\CreateListingWizard;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
*/

Route::get('/', [ListingController::class, 'index'])->name('home');
Route::get('/ogloszenie/{slug}', [ListingController::class, 'show'])->name('listings.show');

Route::middleware(['auth'])->group(function () {
    Route::get('/dodaj-ogloszenie', CreateListingWizard::class)->name('listings.create');
    Route::get('/moje-konto', fn () => view('user.dashboard'))->name('user.dashboard');
    Route::get('/platnosc/sukces', fn () => view('stripe.success'))->name('stripe.success');
    Route::get('/platnosc/anulowano', fn () => view('stripe.cancel'))->name('stripe.cancel');
});

// Autoryzacja i Fortify
require __DIR__.'/auth.php';
