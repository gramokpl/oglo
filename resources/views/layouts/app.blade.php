<!DOCTYPE html>
<html lang="pl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>{{ config('app.name', 'Serwis Ogłoszeniowy') }}</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    @livewireStyles
</head>
<body class="bg-slate-50 text-slate-900 font-sans antialiased min-h-screen flex flex-col">
    <!-- Nawigacja -->
    <header class="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <a href="{{ route('home') }}" class="flex items-center gap-2 font-black text-xl text-indigo-600">
                <span>OGŁOSZENIA</span>
            </a>

            <div class="flex items-center gap-3">
                @auth
                    <a href="{{ route('user.dashboard') }}" class="text-xs font-semibold text-slate-700 hover:text-indigo-600">
                        {{ auth()->user()->name }}
                    </a>
                @else
                    <a href="/login" class="text-xs font-semibold text-slate-700 hover:text-indigo-600">Zaloguj się</a>
                @endauth
                <a href="{{ route('listings.create') }}" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-sm">
                    + Dodaj ogłoszenie
                </a>
            </div>
        </div>
    </header>

    <!-- Treść strony -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {{ $slot ?? '' }}
        @yield('content')
    </main>

    <!-- Stopka -->
    <footer class="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            &copy; {{ date('Y') }} Serwis Ogłoszeniowy. Oparty o Laravel 13, Livewire v3 & Filament v3.
        </div>
    </footer>

    @livewireScripts
</body>
</html>
