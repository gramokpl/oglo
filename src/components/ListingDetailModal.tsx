import React, { useState } from 'react';
import { X, MapPin, Calendar, Eye, Phone, MessageSquare, ShieldCheck, AlertTriangle, Sparkles, CheckCircle2, Share2 } from 'lucide-react';
import { Listing } from '../types';

interface Props {
  listing: Listing | null;
  onClose: () => void;
  onPromoteClick: (listing: Listing) => void;
  onSendMessage: (listing: Listing, buyerName: string, buyerEmail: string, message: string) => void;
}

export const ListingDetailModal: React.FC<Props> = ({
  listing,
  onClose,
  onPromoteClick,
  onSendMessage,
}) => {
  const [showPhone, setShowPhone] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [messageText, setMessageText] = useState('Dzień dobry, czy ogłoszenie jest nadal aktualne? Chętnie odbiorę osobiście.');
  const [messageSent, setMessageSent] = useState(false);

  if (!listing) return null;

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail || !messageText) return;

    onSendMessage(listing, buyerName, buyerEmail, messageText);
    setMessageSent(true);
    setTimeout(() => {
      setMessageSent(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-slate-200 my-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 uppercase tracking-wider">
              {listing.category}
            </span>
            {listing.vip && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center gap-1 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                VIP WYRÓŻNIONE
              </span>
            )}
            {listing.highlighted && !listing.vip && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-100 text-amber-800">
                PROMO
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Media & Description (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Main Image */}
            <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 relative border border-slate-200 shadow-xs">
              <img
                src={listing.images[activeImageIndex] || listing.images[0]}
                alt={listing.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Image Thumbnails if more than 1 */}
            {listing.images.length > 1 && (
              <div className="flex gap-2">
                {listing.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition ${
                      activeImageIndex === idx ? 'border-indigo-600 ring-2 ring-indigo-200' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="mini" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
            )}

            {/* Title & Metadata */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-2 leading-tight">
                {listing.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {listing.location}, {listing.region}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Dodano: {new Date(listing.createdAt).toLocaleDateString('pl-PL')}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  Wyświetleń: {listing.views}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="border-t border-slate-200 pt-4">
              <h3 className="font-semibold text-slate-900 text-sm mb-2">Opis przedmiotu</h3>
              <p className="text-slate-700 text-sm leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-100">
                {listing.description}
              </p>
            </div>

            {/* Security Guarantee Box */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex gap-3 text-xs text-emerald-900">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-emerald-950 mb-1">Ochrona Kupującego i Bezpieczne Transakcje</div>
                <p className="text-emerald-800 leading-normal">
                  Płatności za pakiety promocyjne realizowane są przez certyfikowany system Stripe. Nigdy nie podawaj danych logowania do bankowości internetowej ani numerów kart na zewnętrznych komunikatorach.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Price, Contact, Inquiry Form (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Price Box */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
              <div className="text-xs text-slate-500 uppercase font-semibold">Cena ofertowa</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-950">
                  {listing.price.toLocaleString('pl-PL')} PLN
                </span>
                {listing.negotiable && (
                  <span className="text-xs font-medium text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Do negocjacji
                  </span>
                )}
              </div>

              {/* Promote button */}
              <button
                onClick={() => onPromoteClick(listing)}
                className="w-full py-2.5 px-3 bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white font-semibold text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Wyróżnij to ogłoszenie (Stripe)
              </button>
            </div>

            {/* Seller Info Card */}
            <div className="border border-slate-200 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                    {listing.userName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-slate-900">{listing.userName}</div>
                    <div className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Zweryfikowany profil
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone reveal */}
              <div>
                {showPhone ? (
                  <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl font-mono text-sm font-bold text-indigo-900 text-center flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" />
                    {listing.userPhone}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowPhone(true)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition"
                  >
                    <Phone className="w-4 h-4" />
                    Pokaż numer telefonu ({listing.userPhone.slice(0, 7)}***)
                  </button>
                )}
              </div>

              {/* Message form */}
              <div className="border-t border-slate-100 pt-4">
                <div className="font-semibold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                  Napisz wiadomość do sprzedającego
                </div>

                {messageSent ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium text-center space-y-1">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 mx-auto" />
                    <div>Wiadomość została wysłana!</div>
                    <p className="text-[11px] text-emerald-600">
                      Sprzedawca otrzymał również automatyczne powiadomienie e-mail (sprawdź skrzynkę).
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleMessageSubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Twoje imię"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="email"
                      required
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      placeholder="Twój adres e-mail"
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden"
                    />
                    <textarea
                      required
                      rows={3}
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Treść pytania..."
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500 outline-hidden resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition"
                    >
                      Wyślij zapytanie przez Livewire
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
