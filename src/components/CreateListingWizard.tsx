import React, { useState } from 'react';
import { X, Check, Sparkles, ArrowRight, ArrowLeft, Upload, ShieldCheck, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { Listing, Category, StripeConfig } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  stripeConfig: StripeConfig;
  onSubmitListing: (newListing: Partial<Listing>, tier: 'standard' | 'promoted' | 'vip') => void;
}

export const CreateListingWizard: React.FC<Props> = ({
  isOpen,
  onClose,
  categories,
  stripeConfig,
  onSubmitListing,
}) => {
  const [step, setStep] = useState<number>(1);
  const [honeypotValue, setHoneypotValue] = useState(''); // Anti-bot honeypot
  const [botBlocked, setBotBlocked] = useState(false);

  // Step 1: Basic info
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'elektronika');
  const [price, setPrice] = useState('');
  const [negotiable, setNegotiable] = useState(false);
  const [location, setLocation] = useState('Warszawa');
  const [region, setRegion] = useState('Mazowieckie');

  // Step 2: Description & Photos
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
  ]);

  // Step 3: Promotion tier
  const [selectedTier, setSelectedTier] = useState<'standard' | 'promoted' | 'vip'>('promoted');

  if (!isOpen) return null;

  const handleNext = () => {
    // Check honeypot trap
    if (honeypotValue.trim() !== '') {
      setBotBlocked(true);
      return;
    }
    if (step === 1) {
      if (!title.trim() || !price) return;
    }
    if (step === 2) {
      if (!description.trim()) return;
    }
    setStep((prev) => prev + 1);
  };

  const handleAddImage = () => {
    if (imageUrl.trim()) {
      setUploadedImages((prev) => [...prev, imageUrl.trim()]);
      setImageUrl('');
    }
  };

  const handleSubmit = () => {
    if (honeypotValue.trim() !== '') {
      setBotBlocked(true);
      return;
    }

    const cleanTitle = title.replace(/<[^>]*>?/gm, ''); // XSS sanitization
    const cleanDesc = description.replace(/<[^>]*>?/gm, ''); // XSS sanitization

    const newListingData: Partial<Listing> = {
      title: cleanTitle,
      category,
      price: parseFloat(price) || 0,
      negotiable,
      location,
      region,
      description: cleanDesc,
      images: uploadedImages.length > 0 ? uploadedImages : ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'],
      userName: 'Jan Kowalski (Użytkownik)',
      userPhone: '+48 691 882 119',
      userEmail: 'jan.kowalski@example.com',
      userVerified: true,
      status: selectedTier === 'standard' ? 'active' : (selectedTier === 'vip' ? 'vip' : 'promoted'),
      highlighted: selectedTier !== 'standard',
      vip: selectedTier === 'vip',
      views: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
    };

    onSubmitListing(newListingData, selectedTier);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
              LW3
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-base">Dodaj nowe ogłoszenie (Livewire Wizard)</h2>
              <p className="text-xs text-slate-500">Krok {step} z 3: {step === 1 ? 'Podstawowe dane' : step === 2 ? 'Opis i zdjęcia' : 'Pakiet promowania'}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 h-1.5">
          <div
            className="bg-indigo-600 h-1.5 transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {/* Body content */}
        <div className="p-6 space-y-6">
          {botBlocked && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
              <div>
                <strong>Wykryto zachowanie bota (Honeypot Triggered)!</strong> Twoje zapytanie zostało zablokowane ze względów bezpieczeństwa.
              </div>
            </div>
          )}

          {/* Honeypot hidden input (Spam bot trap) */}
          <div className="hidden" aria-hidden="true">
            <input
              type="text"
              name="_website_hp_trap"
              value={honeypotValue}
              onChange={(e) => setHoneypotValue(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Tytuł ogłoszenia <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="np. PlayStation 5 Slim 1TB + 2 Pady DualSense"
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
                <span className="text-[11px] text-slate-400">Automatyczna sanityzacja tagów HTML w locie.</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Kategoria <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Cena (PLN) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      required
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-3.5 pr-12 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">
                      PLN
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="neg"
                  checked={negotiable}
                  onChange={(e) => setNegotiable(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="neg" className="text-xs text-slate-700 select-none cursor-pointer">
                  Cena do rozsądnej negocjacji
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Miejscowość</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Województwo</label>
                  <input
                    type="text"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Description and Media */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Treść ogłoszenia i parametry <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Opisz dokładnie stan przedmiotu, historię, powód sprzedaży oraz warunki odbioru lub wysyłki..."
                  className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-hidden resize-none"
                />
                <span className="text-[11px] text-slate-400">
                  Obsługiwany przez Mews/Purifier - ochrona przed wstrzykiwaniem złośliwego kodu JavaScript (XSS).
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Zdjęcia przedmiotu (URL lub galeria)
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="Wklej adres URL zdjęcia (https://...)"
                    className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-1 focus:ring-indigo-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-medium transition"
                  >
                    Dodaj zdjęcie
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((img, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={img} alt="preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <button
                        type="button"
                        onClick={() => setUploadedImages((prev) => prev.filter((_, i) => i !== idx))}
                        className="absolute top-1 right-1 p-1 bg-rose-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Promotion tier */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <h3 className="font-bold text-slate-900 text-base">Wybierz pakiet promowania oferty</h3>
                <p className="text-xs text-slate-500">Zwiększ widoczność ogłoszenia nawet 10-krotnie dzięki płatnościom Stripe</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Standard */}
                <div
                  onClick={() => setSelectedTier('standard')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTier === 'standard'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-sm text-slate-900">Standard</div>
                    <div className="text-xl font-black text-slate-900 mt-1">Darmowy</div>
                    <p className="text-xs text-slate-500 mt-2">Standardowa publikacja w wybranej kategorii.</p>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-4 border-t border-slate-200/80 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Ważność 30 dni
                    </li>
                    <li className="flex items-center gap-1.5 text-slate-400">
                      Zwykła pozycja na liście
                    </li>
                  </ul>
                </div>

                {/* Promoted */}
                <div
                  onClick={() => setSelectedTier('promoted')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    selectedTier === 'promoted'
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900">Promowane</div>
                      <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">POPULARNE</span>
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {stripeConfig.promotedPrice.toFixed(2)} <span className="text-xs font-semibold">{stripeConfig.currency}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Wyróżnienie na liście kategorii i wyższa pozycja.</p>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-4 border-t border-slate-200/80 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Wyższa pozycja w wynikach
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Wyróżnienie kolorem
                    </li>
                  </ul>
                </div>

                {/* VIP */}
                <div
                  onClick={() => setSelectedTier('vip')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${
                    selectedTier === 'vip'
                      ? 'border-amber-500 bg-amber-50/40 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded-bl-lg">
                    NAJLEPSZY
                  </div>
                  <div>
                    <div className="font-bold text-sm text-slate-900 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      Pakiet VIP
                    </div>
                    <div className="text-xl font-black text-slate-900 mt-1">
                      {stripeConfig.vipPrice.toFixed(2)} <span className="text-xs font-semibold">{stripeConfig.currency}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Ekspozycja na Stronie Głównej + odznaka VIP.</p>
                  </div>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 mt-4 border-t border-slate-200/80 pt-3">
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Karuzela VIP Strony Głównej
                    </li>
                    <li className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      Powiadomienia e-mail o ofertach
                    </li>
                  </ul>
                </div>
              </div>

              {selectedTier !== 'standard' && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-indigo-600" />
                    <span>Płatność zostanie zrealizowana przez bramkę <strong>Stripe Checkout</strong>.</span>
                  </div>
                  <span className="font-mono font-bold text-indigo-600">{stripeConfig.currency}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((p) => p - 1)}
              className="px-4 py-2 border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Wstecz
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={step === 1 && !title.trim()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-xs"
            >
              Dalej
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              {selectedTier === 'standard' ? 'Opublikuj bezpłatnie' : 'Przejdź do płatności Stripe'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
