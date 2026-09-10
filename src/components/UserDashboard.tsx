import React, { useState } from 'react';
import { Layers, CreditCard, MessageSquare, Shield, Sparkles, Eye, Plus, CheckCircle2, AlertCircle, Trash2, ExternalLink } from 'lucide-react';
import { Listing, StripeTransaction, EmailNotification } from '../types';

interface Props {
  userListings: Listing[];
  transactions: StripeTransaction[];
  emails: EmailNotification[];
  onAddNewListing: () => void;
  onPromoteListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onViewListing: (listing: Listing) => void;
}

export const UserDashboard: React.FC<Props> = ({
  userListings,
  transactions,
  emails,
  onAddNewListing,
  onPromoteListing,
  onDeleteListing,
  onViewListing,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'payments' | 'messages' | 'security'>('listings');
  const [twoFaActive, setTwoFaActive] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const totalViews = userListings.reduce((sum, l) => sum + l.views, 0);

  const handleToggle2FA = () => {
    setTwoFaActive((prev) => !prev);
    setSuccessToast(!twoFaActive ? 'Uwierzytelnianie dwuskładnikowe 2FA włączone!' : 'Uwierzytelnianie 2FA wyłączone.');
    setTimeout(() => setSuccessToast(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            JK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">Jan Kowalski</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">
                Zweryfikowany
              </span>
            </div>
            <p className="text-xs text-slate-400">jan.kowalski@example.com • Konto aktywne od marca 2025</p>
          </div>
        </div>

        <button
          onClick={onAddNewListing}
          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Dodaj nowe ogłoszenie
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-6 flex gap-6 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'listings'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Moje ogłoszenia ({userListings.length})
        </button>
        <button
          onClick={() => setActiveTab('payments')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'payments'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Płatności i Faktury Stripe ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Bezpieczeństwo konta & 2FA
        </button>
      </div>

      {/* Toast */}
      {successToast && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Body Content */}
      <div className="p-6">
        {/* Tab 1: My Listings */}
        {activeTab === 'listings' && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Wszystkie ogłoszenia</div>
                <div className="text-2xl font-black text-slate-900 mt-1">{userListings.length}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Łączna liczba wyświetleń</div>
                <div className="text-2xl font-black text-indigo-600 mt-1">{totalViews}</div>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Aktywne pakiety promowania</div>
                <div className="text-2xl font-black text-amber-500 mt-1">
                  {userListings.filter((l) => l.vip || l.highlighted).length}
                </div>
              </div>
            </div>

            {/* Listings list */}
            {userListings.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 text-sm">
                Nie dodałeś jeszcze żadnego ogłoszenia.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {userListings.map((lst) => (
                  <div key={lst.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                      <img
                        src={lst.images[0]}
                        alt={lst.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-slate-900 text-sm">{lst.title}</h4>
                          {lst.vip && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                              VIP
                            </span>
                          )}
                          {lst.highlighted && !lst.vip && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800">
                              PROMO
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center gap-3">
                          <span className="font-bold text-slate-900">{lst.price.toLocaleString()} PLN</span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" /> {lst.views} odsłon
                          </span>
                          <span>•</span>
                          <span>{lst.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => onViewListing(lst)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition"
                      >
                        Podgląd
                      </button>

                      {(!lst.vip || !lst.highlighted) && (
                        <button
                          onClick={() => onPromoteListing(lst)}
                          className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Wyróżnij (Stripe)
                        </button>
                      )}

                      <button
                        onClick={() => onDeleteListing(lst.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Stripe Invoices */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="text-xs text-slate-500 mb-2">
              Historia wszystkich transakcji wykonanych za pośrednictwem bramki <strong>Stripe Checkout</strong>.
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="text-[11px] uppercase text-slate-500 bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Pakiet / Usługa</th>
                    <th className="py-3 px-4">Kwota</th>
                    <th className="py-3 px-4">Karta</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Data</th>
                    <th className="py-3 px-4 text-right">Potwierdzenie</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{t.listingTitle}</div>
                        <div className="text-[10px] text-slate-500">Pakiet {t.tier.toUpperCase()} (30 dni)</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {t.amount.toFixed(2)} {t.currency}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">•••• {t.cardLast4}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          OPŁACONE
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {new Date(t.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={t.receiptUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                        >
                          Rachunek Stripe
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Security & 2FA */}
        {activeTab === 'security' && (
          <div className="max-w-xl space-y-6">
            <div className="p-5 border border-slate-200 rounded-2xl space-y-3 bg-slate-50">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">Uwierzytelnianie dwuskładnikowe (2FA)</h4>
                  <p className="text-xs text-slate-500">
                    Zabezpiecz konto przed nieautoryzowanym dostępem kodem jednorazowym z aplikacji (Google Authenticator / Authy).
                  </p>
                </div>
                <button
                  onClick={handleToggle2FA}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                    twoFaActive
                      ? 'bg-rose-100 text-rose-700 hover:bg-rose-200'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {twoFaActive ? 'Wyłącz 2FA' : 'Włącz 2FA'}
                </button>
              </div>

              {twoFaActive && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Konto jest w pełni zabezpieczone kluczem TOTP zgodnie ze standardem RFC 6238.</span>
                </div>
              )}
            </div>

            <div className="p-5 border border-slate-200 rounded-2xl space-y-3">
              <h4 className="font-bold text-sm text-slate-900">Aktywne sesje logowania</h4>
              <div className="space-y-2 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-800">Przeglądarka bieżąca (Vite / Chrome)</div>
                    <div className="text-[11px] text-slate-500">Adres IP: 194.29.130.5 • Warszawa, Polska</div>
                  </div>
                  <span className="text-[10px] text-emerald-600 font-bold bg-emerald-100 px-2 py-0.5 rounded">TERAZ</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
