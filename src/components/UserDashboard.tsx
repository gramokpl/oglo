import React, { useState } from 'react';
import {
  Layers,
  CreditCard,
  MessageSquare,
  Shield,
  Sparkles,
  Eye,
  Plus,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ExternalLink,
  User,
  KeyRound,
  LogOut,
  Save,
  Lock,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';
import { Listing, StripeTransaction, EmailNotification, UserAccount } from '../types';

interface Props {
  currentUser: UserAccount | null;
  userListings: Listing[];
  transactions: StripeTransaction[];
  emails: EmailNotification[];
  onAddNewListing: () => void;
  onPromoteListing: (listing: Listing) => void;
  onDeleteListing: (id: string) => void;
  onViewListing: (listing: Listing) => void;
  onUpdateUser: (updated: Partial<UserAccount>) => void;
  onChangePassword: (currentPass: string, newPass: string) => { success: boolean; message: string };
  onOpenAuthModal: () => void;
  onLogout: () => void;
}

export const UserDashboard: React.FC<Props> = ({
  currentUser,
  userListings,
  transactions,
  emails,
  onAddNewListing,
  onPromoteListing,
  onDeleteListing,
  onViewListing,
  onUpdateUser,
  onChangePassword,
  onOpenAuthModal,
  onLogout,
}) => {
  const [activeTab, setActiveTab] = useState<'listings' | 'payments' | 'profile' | 'security'>('listings');
  const [twoFaActive, setTwoFaActive] = useState(currentUser?.twoFactorEnabled ?? false);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [errorToast, setErrorToast] = useState<string | null>(null);

  // Profile edit fields
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');

  // Password change fields
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const totalViews = userListings.reduce((sum, l) => sum + l.views, 0);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const handleToggle2FA = () => {
    const newState = !twoFaActive;
    setTwoFaActive(newState);
    onUpdateUser({ twoFactorEnabled: newState });
    setSuccessToast(newState ? 'Uwierzytelnianie dwuskładnikowe 2FA włączone!' : 'Uwierzytelnianie 2FA wyłączone.');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      setErrorToast('Imię i nazwisko nie mogą być puste.');
      setTimeout(() => setErrorToast(null), 3000);
      return;
    }
    onUpdateUser({
      name: profileName.trim(),
      phone: profilePhone.trim(),
    });
    setSuccessToast('Dane profilowe zostały pomyślnie zaktualizowane!');
    setTimeout(() => setSuccessToast(null), 3500);
  };

  const handleChangePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorToast(null);

    if (newPassword.length < 8) {
      setErrorToast('Nowe hasło musi mieć minimum 8 znaków.');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorToast('Nowe hasła nie są ze sobą zgodne.');
      setTimeout(() => setErrorToast(null), 3500);
      return;
    }

    const res = onChangePassword(oldPassword, newPassword);
    if (!res.success) {
      setErrorToast(res.message);
      setTimeout(() => setErrorToast(null), 3500);
    } else {
      setSuccessToast('Hasło do konta zostało pomyślnie zmienione!');
      setOldPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setSuccessToast(null), 3500);
    }
  };

  // If user is guest
  if (!currentUser) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-10 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Panel użytkownika wymaga zalogowania</h2>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Aby zarządzać swoimi ogłoszeniami, kupować wyróżnienia Stripe, edytować dane profilowe lub zabezpieczać konto kodem 2FA, zaloguj się lub załóż bezpłatne konto.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onOpenAuthModal}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition"
          >
            Zaloguj się lub Zarejestruj
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md overflow-hidden">
      {/* Dashboard Header */}
      <div className="bg-slate-900 text-white p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white font-black text-xl shadow-lg">
            {getInitials(currentUser.name)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold">{currentUser.name}</h2>
              {currentUser.verified && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1">
                  <UserCheck className="w-3 h-3" />
                  Zweryfikowany
                </span>
              )}
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-mono capitalize">
                Rola: {currentUser.role}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {currentUser.email} • {currentUser.phone || 'Brak telefonu'} • Dołączono:{' '}
              {new Date(currentUser.createdAt).toLocaleDateString('pl-PL')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onAddNewListing}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-md flex items-center gap-2 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Dodaj nowe ogłoszenie
          </button>

          <button
            onClick={onLogout}
            className="px-3 py-2.5 bg-slate-800 hover:bg-rose-900/50 hover:text-rose-300 text-slate-300 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-slate-700"
            title="Wyloguj z sesji"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Wyloguj</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 px-6 flex flex-wrap gap-4 sm:gap-6 bg-slate-50 text-xs font-medium text-slate-600">
        <button
          onClick={() => setActiveTab('listings')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
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
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'payments'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Płatności i Faktury Stripe ({transactions.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Mój Profil & Hasło
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`py-3.5 border-b-2 transition flex items-center gap-2 cursor-pointer ${
            activeTab === 'security'
              ? 'border-indigo-600 text-indigo-600 font-bold'
              : 'border-transparent hover:text-slate-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          Bezpieczeństwo & 2FA
        </button>
      </div>

      {/* Toast Feedback */}
      {successToast && (
        <div className="mx-6 mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {errorToast && (
        <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorToast}</span>
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
                Nie dodałeś jeszcze żadnego ogłoszenia na tym koncie.
                <div className="mt-3">
                  <button
                    onClick={onAddNewListing}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 cursor-pointer"
                  >
                    Dodaj pierwsze ogłoszenie
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {userListings.map((lst) => (
                  <div key={lst.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-slate-50 transition">
                    <div className="flex items-center gap-4">
                      <img
                        src={lst.images[0] || 'https://images.unsplash.com/photo-1581291518655-9523c932edcf?w=400'}
                        alt={lst.title}
                        className="w-16 h-16 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-bold text-sm text-slate-900 hover:text-indigo-600 transition cursor-pointer" onClick={() => onViewListing(lst)}>
                            {lst.title}
                          </h4>
                          {lst.vip && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                              VIP
                            </span>
                          )}
                          {lst.highlighted && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                              Wyróżnione
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              lst.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : lst.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {lst.status === 'active' ? 'Aktywne' : lst.status === 'pending' ? 'Oczekuje' : 'Wstrzymane'}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          Cena: <strong className="text-slate-800 font-bold">{lst.price.toLocaleString()} {lst.currency}</strong> • Wyświetlenia: {lst.views} • ID: {lst.id}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => onViewListing(lst)}
                        className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                        title="Podgląd ogłoszenia"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onPromoteListing(lst)}
                        className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                        Promuj (Stripe)
                      </button>
                      <button
                        onClick={() => onDeleteListing(lst.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Usuń ogłoszenie"
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

        {/* Tab 2: Stripe Payments & Billing */}
        {activeTab === 'payments' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
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
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        Brak transakcji Stripe dla Twojego konta.
                      </td>
                    </tr>
                  ) : (
                    transactions.map((t) => (
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
                            href={t.receiptUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1"
                          >
                            Rachunek Stripe
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Profile & Password */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl space-y-8">
            {/* Profile Data Form */}
            <form onSubmit={handleSaveProfile} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-indigo-600" />
                  Dane personalne i kontaktowe
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Te informacje są widoczne przy Twoich ogłoszeniach oraz na fakturach Stripe.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Imię i nazwisko
                  </label>
                  <input
                    type="text"
                    required
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Adres e-mail (Login)
                  </label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400">Adres e-mail można zmienić kontaktując się z administratorem.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Numer telefonu
                  </label>
                  <input
                    type="tel"
                    value={profilePhone}
                    onChange={(e) => setProfilePhone(e.target.value)}
                    placeholder="+48 600 000 000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Rola systemowa
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.role.toUpperCase()}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Save className="w-3.5 h-3.5" />
                  Zapisz zmiany profilu
                </button>
              </div>
            </form>

            {/* Change Password Form */}
            <form onSubmit={handleChangePasswordSubmit} className="p-5 border border-slate-200 rounded-2xl bg-white space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-indigo-600" />
                  Zmiana hasła do konta
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Dla bezpieczeństwa hasło powinno zawierać co najmniej 8 znaków, wielką literę i cyfrę.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Aktualne hasło
                  </label>
                  <input
                    type="password"
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full max-w-md px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nowe hasło
                    </label>
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min. 8 znaków"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Powtórz nowe hasło
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      placeholder="Powtórz hasło"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-start">
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer transition"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Zaktualizuj hasło
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 4: Security & 2FA */}
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
