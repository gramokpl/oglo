<div class="max-w-3xl mx-auto bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
    <!-- Wskaźnik kroków -->
    <div class="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
        <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {{ $currentStep >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400' }}">1</span>
            <span class="text-xs font-semibold {{ $currentStep === 1 ? 'text-indigo-600' : 'text-slate-600' }}">Dane podstawowe</span>
        </div>
        <div class="h-0.5 w-12 bg-slate-200"></div>
        <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {{ $currentStep >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400' }}">2</span>
            <span class="text-xs font-semibold {{ $currentStep === 2 ? 'text-indigo-600' : 'text-slate-600' }}">Opis i zdjęcia</span>
        </div>
        <div class="h-0.5 w-12 bg-slate-200"></div>
        <div class="flex items-center gap-2">
            <span class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold {{ $currentStep >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400' }}">3</span>
            <span class="text-xs font-semibold {{ $currentStep === 3 ? 'text-indigo-600' : 'text-slate-600' }}">Promowanie (Stripe)</span>
        </div>
    </div>

    <!-- Honeypot antybotowy -->
    <input type="text" wire:model="honeypot" style="display:none !important;" tabindex="-1" autocomplete="off">

    @if ($currentStep === 1)
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Tytuł ogłoszenia</label>
                <input type="text" wire:model.live="title" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="np. Apple iPhone 15 Pro 128GB Gwarancja">
                @error('title') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Kategoria</label>
                    <select wire:model="categoryId" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20">
                        <option value="">Wybierz kategorię...</option>
                        @foreach ($categories as $cat)
                            <option value="{{ $cat->id }}">{{ $cat->name }}</option>
                        @endforeach
                    </select>
                    @error('categoryId') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
                </div>

                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Cena (PLN)</label>
                    <input type="number" wire:model="price" step="0.01" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="0.00">
                    @error('price') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Miejscowość</label>
                    <input type="text" wire:model="location" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" placeholder="np. Warszawa">
                    @error('location') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-700 mb-1">Województwo</label>
                    <select wire:model="region" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                        <option value="Mazowieckie">Mazowieckie</option>
                        <option value="Małopolskie">Małopolskie</option>
                        <option value="Wielkopolskie">Wielkopolskie</option>
                        <option value="Śląskie">Śląskie</option>
                        <option value="Dolnośląskie">Dolnośląskie</option>
                    </select>
                </div>
            </div>

            <div class="pt-4 flex justify-end">
                <button wire:click="nextStep" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                    Dalej: Treść ogłoszenia &rarr;
                </button>
            </div>
        </div>
    @elseif ($currentStep === 2)
        <div class="space-y-4">
            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Szczegółowy opis</label>
                <textarea wire:model="description" rows="6" class="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Dokładny opis przedmiotu..."></textarea>
                @error('description') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
            </div>

            <div>
                <label class="block text-xs font-bold text-slate-700 mb-1">Zdjęcia przedmiotu</label>
                <input type="file" wire:model="uploadedImages" multiple accept="image/*" class="w-full text-xs text-slate-500">
                @error('uploadedImages.*') <span class="text-xs text-rose-500">{{ $message }}</span> @enderror
            </div>

            <div class="pt-4 flex justify-between">
                <button wire:click="previousStep" class="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
                    &larr; Wstecz
                </button>
                <button wire:click="nextStep" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl">
                    Dalej: Wybierz pakiet &rarr;
                </button>
            </div>
        </div>
    @else
        <div class="space-y-4">
            <h3 class="text-sm font-bold text-slate-900 mb-2">Wybierz sposób publikacji i promowania:</h3>
            
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label class="p-4 border-2 rounded-xl cursor-pointer {{ $promotionTier === 'standard' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200' }}">
                    <input type="radio" wire:model="promotionTier" value="standard" class="sr-only">
                    <div class="font-bold text-sm text-slate-900">Standard</div>
                    <div class="text-xl font-black text-slate-900 my-1">0 PLN</div>
                    <p class="text-xs text-slate-500">Podstawowa publikacja w portalu na 30 dni.</p>
                </label>

                <label class="p-4 border-2 rounded-xl cursor-pointer {{ $promotionTier === 'promoted' ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-200' }}">
                    <input type="radio" wire:model="promotionTier" value="promoted" class="sr-only">
                    <div class="font-bold text-sm text-indigo-700">Promowane</div>
                    <div class="text-xl font-black text-indigo-600 my-1">19.00 PLN</div>
                    <p class="text-xs text-slate-500">Wyróżnione na górze listy kategorii przez 30 dni.</p>
                </label>

                <label class="p-4 border-2 rounded-xl cursor-pointer {{ $promotionTier === 'vip' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200' }}">
                    <input type="radio" wire:model="promotionTier" value="vip" class="sr-only">
                    <div class="font-bold text-sm text-amber-700">Pakiet VIP</div>
                    <div class="text-xl font-black text-amber-600 my-1">39.00 PLN</div>
                    <p class="text-xs text-slate-500">Ekspozycja na stronie głównej w karuzeli VIP + góra listy.</p>
                </label>
            </div>

            <div class="pt-6 flex justify-between">
                <button wire:click="previousStep" class="px-4 py-2 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl">
                    &larr; Wstecz
                </button>
                <button wire:click="submitListing" class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md">
                    {{ $promotionTier === 'standard' ? 'Opublikuj bezpłatnie' : 'Przejdź do płatności Stripe →' }}
                </button>
            </div>
        </div>
    @endif
</div>
