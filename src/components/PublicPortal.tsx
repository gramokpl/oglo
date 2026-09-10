import React, { useState, useMemo } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import { Listing, Category } from '../types';

interface Props {
  listings: Listing[];
  categories: Category[];
  onSelectListing: (listing: Listing) => void;
  onOpenCreateWizard: () => void;
}

export const PublicPortal: React.FC<Props> = ({
  listings,
  categories,
  onSelectListing,
  onOpenCreateWizard,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [sortBy, setSortBy] = useState<'latest' | 'price_asc' | 'price_desc'>('latest');
  const [onlyPromoted, setOnlyPromoted] = useState(false);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings
      .filter((l) => l.status !== 'rejected' && l.status !== 'pending_review')
      .filter((l) => {
        const matchesQuery =
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCat = selectedCategory === 'all' || l.category === selectedCategory;
        const matchesRegion = selectedRegion === 'all' || l.region === selectedRegion;
        const matchesPromo = !onlyPromoted || (l.vip || l.highlighted);

        return matchesQuery && matchesCat && matchesRegion && matchesPromo;
      })
      .sort((a, b) => {
        // VIP listings naturally float to top unless price sort is applied
        if (sortBy === 'latest') {
          if (a.vip && !b.vip) return -1;
          if (!a.vip && b.vip) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        return 0;
      });
  }, [listings, searchQuery, selectedCategory, selectedRegion, sortBy, onlyPromoted]);

  const vipListings = listings.filter((l) => l.vip && l.status !== 'rejected');

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Search Section */}
      <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-10 shadow-xl overflow-hidden border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Nowoczesny Polski Portal Ogłoszeniowy • Laravel 13 & Livewire
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Znajdź to, czego szukasz lub sprzedaj w kilka minut
          </h1>
          <p className="text-sm text-slate-300">
            Tysiące zweryfikowanych ogłoszeń z bezpiecznymi płatnościami kartą przez Stripe
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="relative max-w-4xl mx-auto bg-white rounded-2xl p-2 sm:p-3 shadow-2xl flex flex-col sm:flex-row items-center gap-2 text-slate-900">
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Czego szukasz? (np. MacBook, BMW, Mieszkanie)"
              className="w-full pl-11 pr-4 py-3 text-sm rounded-xl focus:outline-hidden font-medium placeholder:text-slate-400"
            />
          </div>

          <div className="w-full sm:w-48 border-t sm:border-t-0 sm:border-l border-slate-200 pt-2 sm:pt-0 sm:pl-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full py-2.5 px-3 text-sm font-medium text-slate-700 bg-transparent focus:outline-hidden cursor-pointer"
            >
              <option value="all">Wszystkie kategorie</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => {}}
            className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold shadow-md transition flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Szukaj</span>
          </button>
        </div>

        {/* Quick category badges */}
        <div className="max-w-4xl mx-auto mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
            }`}
          >
            Wszystkie
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* VIP Featured Carousel / Grid */}
      {vipListings.length > 0 && selectedCategory === 'all' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Wyróżnione Oferty VIP (Strona Główna)</h2>
                <p className="text-xs text-slate-500">Najwyższa widoczność opłacona przez Stripe</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              Pakiety VIP Aktywne
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {vipListings.map((lst) => (
              <div
                key={lst.id}
                onClick={() => onSelectListing(lst)}
                className="group relative bg-white rounded-2xl border-2 border-amber-400/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col sm:flex-row cursor-pointer"
              >
                <div className="absolute top-3 left-3 z-10 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> VIP
                </div>

                <div className="sm:w-52 h-48 sm:h-auto shrink-0 relative overflow-hidden bg-slate-100">
                  <img
                    src={lst.images[0]}
                    alt={lst.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="capitalize font-medium text-indigo-600">{lst.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {lst.location}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition">
                      {lst.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-slate-950">
                        {lst.price.toLocaleString()} PLN
                      </span>
                      {lst.negotiable && (
                        <span className="ml-1.5 text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Negocjacje
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-semibold text-indigo-600 flex items-center gap-0.5 group-hover:translate-x-1 transition">
                      Szczegóły <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Listing List with Sorting & Filters */}
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Ogłoszenia {selectedCategory !== 'all' ? `• ${selectedCategory}` : ''}
            </h2>
            <p className="text-xs text-slate-500">
              Znaleziono: <strong>{filteredListings.length}</strong> ofert
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setOnlyPromoted(!onlyPromoted)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 border cursor-pointer ${
                onlyPromoted
                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Tylko wyróżnione
            </button>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white border border-slate-200 rounded-xl px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent font-medium focus:outline-hidden cursor-pointer"
              >
                <option value="latest">Sortuj: Najnowsze</option>
                <option value="price_asc">Cena: rosnąco</option>
                <option value="price_desc">Cena: malejąco</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        {filteredListings.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-3xl border border-slate-200 space-y-3">
            <Search className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">Brak ogłoszeń dla wybranych kryteriów</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Spróbuj zmienić słowo kluczowe lub wyczyść filtry kategorii.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((lst) => (
              <div
                key={lst.id}
                onClick={() => onSelectListing(lst)}
                className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-xl overflow-hidden flex flex-col cursor-pointer ${
                  lst.vip
                    ? 'border-amber-400 shadow-md ring-1 ring-amber-300/50'
                    : lst.highlighted
                    ? 'border-indigo-300 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {/* Card Thumbnail */}
                <div className="aspect-16/10 relative overflow-hidden bg-slate-100">
                  <img
                    src={lst.images[0]}
                    alt={lst.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {lst.vip && (
                    <div className="absolute top-2.5 left-2.5 bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> VIP
                    </div>
                  )}
                  {lst.highlighted && !lst.vip && (
                    <div className="absolute top-2.5 left-2.5 bg-indigo-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      WYRÓŻNIONE
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {lst.views}
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                      <span className="capitalize font-medium text-slate-600">{lst.category}</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {lst.location}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition">
                      {lst.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-black text-slate-950">
                        {lst.price.toLocaleString()} PLN
                      </div>
                      {lst.negotiable && (
                        <div className="text-[10px] text-emerald-600 font-semibold">Do negocjacji</div>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 font-mono">
                      {new Date(lst.createdAt).toLocaleDateString('pl-PL')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Safety and Security Education Footer */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-5 h-5" />
            Bezpieczne Transakcje i Ochrona Danych
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Wszystkie ogłoszenia są monitorowane przez moduł bezpieczeństwa z filtrem spamu (Honeypot) i ochroną przed phishingiem. Płatności realizowane są przez Stripe z pełnym szyfrowaniem 3D Secure 2.0.
          </p>
        </div>
        <button
          onClick={onOpenCreateWizard}
          className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg transition shrink-0 cursor-pointer"
        >
          Wystaw ogłoszenie teraz
        </button>
      </div>
    </div>
  );
};
