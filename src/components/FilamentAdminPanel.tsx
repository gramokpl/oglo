import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Users,
  CreditCard,
  ShieldCheck,
  Mail,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Filter,
  Trash2,
  Eye,
  Sparkles,
  Key,
  DollarSign,
  Activity,
  RefreshCw,
  Sliders,
  ExternalLink,
  Lock
} from 'lucide-react';
import {
  Listing,
  UserAccount,
  StripeTransaction,
  SecurityLog,
  SecuritySettings,
  StripeConfig,
  EmailNotification
} from '../types';

interface Props {
  listings: Listing[];
  users: UserAccount[];
  transactions: StripeTransaction[];
  securityLogs: SecurityLog[];
  securitySettings: SecuritySettings;
  stripeConfig: StripeConfig;
  emails: EmailNotification[];
  onUpdateListingStatus: (id: string, status: Listing['status']) => void;
  onDeleteListing: (id: string) => void;
  onUpdateSecuritySettings: (settings: SecuritySettings) => void;
  onUpdateStripeConfig: (config: StripeConfig) => void;
  onTriggerTestEmail: () => void;
  onRefundTransaction: (txId: string) => void;
}

type AdminTab = 'dashboard' | 'listings' | 'users' | 'stripe' | 'security' | 'emails';

export const FilamentAdminPanel: React.FC<Props> = ({
  listings,
  users,
  transactions,
  securityLogs,
  securitySettings,
  stripeConfig,
  emails,
  onUpdateListingStatus,
  onDeleteListing,
  onUpdateSecuritySettings,
  onUpdateStripeConfig,
  onTriggerTestEmail,
  onRefundTransaction,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [stripeForm, setStripeForm] = useState<StripeConfig>(stripeConfig);
  const [securityForm, setSecurityForm] = useState<SecuritySettings>(securitySettings);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const totalRevenue = transactions
    .filter((t) => t.status === 'succeeded')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingListings = listings.filter((l) => l.status === 'pending_review');
  const activeListings = listings.filter((l) => l.status === 'active' || l.status === 'promoted' || l.status === 'vip');

  const filteredListings = listings.filter((l) => {
    const matchesSearch = l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          l.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' ? true : l.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleSaveStripe = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateStripeConfig(stripeForm);
    setSaveSuccessMsg('Konfiguracja Stripe została zaktualizowana.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSecuritySettings(securityForm);
    setSaveSuccessMsg('Ustawienia tarczy bezpieczeństwa zostały zapisane.');
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col md:flex-row min-h-[720px]">
      {/* Filament Left Sidebar */}
      <div className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-4 flex flex-col justify-between">
        <div>
          {/* Filament Brand Badge */}
          <div className="flex items-center gap-3 px-3 py-4 mb-3 border-b border-slate-800/80">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-600 flex items-center justify-center text-slate-950 font-black text-sm shadow-md">
              F3
            </div>
            <div>
              <div className="font-bold text-sm text-white tracking-wide flex items-center gap-1.5">
                Filament Admin
                <span className="text-[10px] px-1.5 py-0.2 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded font-mono">
                  v3.2
                </span>
              </div>
              <div className="text-[11px] text-slate-500">Panel Zarządzania Portalem</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'dashboard'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Pulpit Główny</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Zarządzanie Treścią
            </div>

            <button
              onClick={() => setActiveTab('listings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'listings'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers className="w-4 h-4" />
                <span>Ogłoszenia</span>
              </div>
              {pendingListings.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                  {pendingListings.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'users'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Użytkownicy i Role</span>
            </button>

            <div className="pt-3 pb-1 px-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Finanse & System
            </div>

            <button
              onClick={() => setActiveTab('stripe')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'stripe'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <CreditCard className="w-4 h-4" />
              <span>Płatności Stripe</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'security'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Tarcza Bezpieczeństwa</span>
            </button>

            <button
              onClick={() => setActiveTab('emails')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition ${
                activeTab === 'emails'
                  ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4" />
                <span>Powiadomienia E-mail</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                {emails.length}
              </span>
            </button>
          </nav>
        </div>

        {/* Current user footer in Filament */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-xs">
            AD
          </div>
          <div className="truncate">
            <div className="text-xs font-semibold text-slate-200 truncate">Super Administrator</div>
            <div className="text-[10px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              2FA Aktywne
            </div>
          </div>
        </div>
      </div>

      {/* Filament Main Content Area */}
      <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
        {/* Filament Topbar */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-white capitalize">
              {activeTab === 'dashboard' && 'Pulpit Administratora'}
              {activeTab === 'listings' && 'Zarządzanie Ogłoszeniami (ListingResource)'}
              {activeTab === 'users' && 'Baza Użytkowników (UserResource)'}
              {activeTab === 'stripe' && 'Integracja i Transakcje Stripe'}
              {activeTab === 'security' && 'Centrum Ochrony i Audyt Bezpieczeństwa'}
              {activeTab === 'emails' && 'Dziennik Powiadomień i Szablony E-mail'}
            </h1>
          </div>

          {saveSuccessMsg && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-lg">
              {saveSuccessMsg}
            </div>
          )}
        </div>

        {/* Filament Content Panels */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* 1. DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Filament KPI Stats Widgets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="text-xs text-slate-400 font-medium">Przychód Stripe (Brutto)</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {totalRevenue.toFixed(2)} <span className="text-xs font-semibold text-amber-400">{stripeConfig.currency}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> +100% z pakietów promowań
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="text-xs text-slate-400 font-medium">Aktywne Ogłoszenia</div>
                  <div className="text-2xl font-black text-white mt-1">{activeListings.length}</div>
                  <div className="text-[11px] text-slate-500 mt-2">
                    W tym VIP: {listings.filter((l) => l.vip).length}
                  </div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="text-xs text-slate-400 font-medium">Oczekuje na moderację</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">{pendingListings.length}</div>
                  <div className="text-[11px] text-slate-500 mt-2">Wymaga weryfikacji treści</div>
                </div>

                <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="text-xs text-slate-400 font-medium">Zablokowane ataki / Boty</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">142</div>
                  <div className="text-[11px] text-slate-500 mt-2">Honeypot + RateLimiter 60/min</div>
                </div>
              </div>

              {/* Quick moderation queue banner */}
              {pendingListings.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    <div>
                      <div className="font-semibold text-xs text-amber-200">
                        {pendingListings.length} ogłoszenie(a) oczekuje na akceptację przez moderatora
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Zatwierdź ogłoszenia, aby pojawiły się w publicznym portalu.
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('listings');
                      setFilterStatus('pending_review');
                    }}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition"
                  >
                    Przejdź do moderacji
                  </button>
                </div>
              )}

              {/* Recent Stripe Orders Table inside Dashboard */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-sm text-white">Ostatnie transakcje Stripe Checkout</h3>
                  <button
                    onClick={() => setActiveTab('stripe')}
                    className="text-xs text-amber-400 hover:underline"
                  >
                    Zobacz wszystkie ({transactions.length})
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Ogłoszenie</th>
                        <th className="py-2.5 px-3">Klient</th>
                        <th className="py-2.5 px-3">Kwota</th>
                        <th className="py-2.5 px-3">Pakiet</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Data</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {transactions.slice(0, 4).map((t) => (
                        <tr key={t.id} className="hover:bg-slate-900/50">
                          <td className="py-3 px-3 font-medium text-slate-200">{t.listingTitle}</td>
                          <td className="py-3 px-3 text-slate-400">{t.userName}</td>
                          <td className="py-3 px-3 font-mono font-bold text-white">
                            {t.amount.toFixed(2)} {t.currency}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-300">
                              {t.tier}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Succeeded
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-500 font-mono">
                            {new Date(t.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. LISTINGS (ListingResource) */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              {/* Table Toolbar */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj po tytule, mieście..."
                    className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl focus:border-amber-500 outline-hidden text-white"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-300 focus:border-amber-500 outline-hidden"
                  >
                    <option value="all">Wszystkie statusy</option>
                    <option value="active">Opublikowane</option>
                    <option value="pending_review">Oczekuje na zatwierdzenie</option>
                    <option value="vip">Tylko VIP</option>
                    <option value="promoted">Tylko Promowane</option>
                    <option value="rejected">Odrzucone</option>
                  </select>
                </div>
              </div>

              {/* Filament Data Table */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase text-slate-500 bg-slate-900/80 border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Przedmiot / Tytuł</th>
                        <th className="py-3 px-3">Kategoria</th>
                        <th className="py-3 px-3">Cena</th>
                        <th className="py-3 px-3">Lokalizacja</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Wyróżnienie</th>
                        <th className="py-3 px-4 text-right">Akcje moderacji</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredListings.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-slate-500">
                            Brak ogłoszeń spełniających kryteria.
                          </td>
                        </tr>
                      ) : (
                        filteredListings.map((lst) => (
                          <tr key={lst.id} className="hover:bg-slate-900/40">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white truncate max-w-xs">{lst.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono">Autor: {lst.userName}</div>
                            </td>
                            <td className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px]">
                                {lst.category}
                              </span>
                            </td>
                            <td className="py-3 px-3 font-bold text-white font-mono">
                              {lst.price.toLocaleString()} PLN
                            </td>
                            <td className="py-3 px-3 text-slate-400">{lst.location}</td>
                            <td className="py-3 px-3">
                              {lst.status === 'active' && (
                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold">
                                  Aktywne
                                </span>
                              )}
                              {lst.status === 'pending_review' && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold">
                                  Oczekuje
                                </span>
                              )}
                              {lst.status === 'vip' && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-[10px] font-semibold">
                                  VIP
                                </span>
                              )}
                              {lst.status === 'promoted' && (
                                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-semibold">
                                  Promowane
                                </span>
                              )}
                              {lst.status === 'rejected' && (
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px]">
                                  Odrzucone
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-3">
                              {lst.vip ? (
                                <span className="text-amber-400 font-bold text-[10px] flex items-center gap-1">
                                  <Sparkles className="w-3 h-3" /> VIP
                                </span>
                              ) : lst.highlighted ? (
                                <span className="text-indigo-400 font-bold text-[10px]">PROMO</span>
                              ) : (
                                <span className="text-slate-600 text-[10px]">Brak</span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {lst.status !== 'active' && lst.status !== 'vip' && lst.status !== 'promoted' && (
                                  <button
                                    onClick={() => onUpdateListingStatus(lst.id, 'active')}
                                    title="Zatwierdź ogłoszenie"
                                    className="p-1 text-emerald-400 hover:bg-emerald-500/20 rounded transition"
                                  >
                                    <CheckCircle2 className="w-4 h-4" />
                                  </button>
                                )}
                                {lst.status !== 'rejected' && (
                                  <button
                                    onClick={() => onUpdateListingStatus(lst.id, 'rejected')}
                                    title="Odrzuć z podaniem powodu"
                                    className="p-1 text-amber-400 hover:bg-amber-500/20 rounded transition"
                                  >
                                    <XCircle className="w-4 h-4" />
                                  </button>
                                )}
                                <button
                                  onClick={() => onDeleteListing(lst.id)}
                                  title="Usuń trwale"
                                  className="p-1 text-rose-400 hover:bg-rose-500/20 rounded transition"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. USERS (UserResource) */}
          {activeTab === 'users' && (
            <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-white">Zarządzanie kontami użytkowników i rolami (Spatie RBAC)</h3>
                  <p className="text-xs text-slate-400">Kontrola uprawnień dostępu do panelu Filament oraz weryfikacja tożsamości</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800">
                    <tr>
                      <th className="py-2.5 px-3">Imię i Nazwisko</th>
                      <th className="py-2.5 px-3">Adres E-mail</th>
                      <th className="py-2.5 px-3">Rola w systemie</th>
                      <th className="py-2.5 px-3">Weryfikacja 2FA</th>
                      <th className="py-2.5 px-3">Ilość ogłoszeń</th>
                      <th className="py-2.5 px-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {users.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-3 font-semibold text-slate-200">{u.name}</td>
                        <td className="py-3 px-3 font-mono text-slate-400">{u.email}</td>
                        <td className="py-3 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : u.role === 'moderator'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-3">
                          {u.twoFactorEnabled ? (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> TOTP Włączone
                            </span>
                          ) : (
                            <span className="text-slate-500">Wyłączone</span>
                          )}
                        </td>
                        <td className="py-3 px-3 font-mono">{u.listingsCount}</td>
                        <td className="py-3 px-3">
                          <span className="text-emerald-400 text-[10px] font-semibold">Aktywny</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. STRIPE CONFIG & TRANSACTIONS */}
          {activeTab === 'stripe' && (
            <div className="space-y-6">
              {/* Stripe Settings Form */}
              <form onSubmit={handleSaveStripe} className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-bold text-sm text-white">Konfigurator Bramki Płatności Stripe</h3>
                  </div>
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full font-medium">
                    Obsługa kart, BLIK, Przelewy24
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Klucz publiczny (Publishable Key)</label>
                    <input
                      type="text"
                      value={stripeForm.publishableKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, publishableKey: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-amber-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Klucz prywatny (Secret Key)</label>
                    <input
                      type="password"
                      value={stripeForm.secretKey}
                      onChange={(e) => setStripeForm({ ...stripeForm, secretKey: e.target.value })}
                      className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-amber-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Waluta rozliczeń</label>
                    <select
                      value={stripeForm.currency}
                      onChange={(e) => setStripeForm({ ...stripeForm, currency: e.target.value as any })}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-amber-500 outline-hidden"
                    >
                      <option value="PLN">PLN (Polski Złoty)</option>
                      <option value="EUR">EUR (Euro)</option>
                      <option value="USD">USD (Dolar)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cena: Pakiet Promowany (Góra listy)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={stripeForm.promotedPrice}
                      onChange={(e) => setStripeForm({ ...stripeForm, promotedPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-amber-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1.5">Cena: Pakiet VIP (Strona Główna)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={stripeForm.vipPrice}
                      onChange={(e) => setStripeForm({ ...stripeForm, vipPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-800 rounded-xl text-white focus:border-amber-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Zapisz konfigurację Stripe
                  </button>
                </div>
              </form>

              {/* Transactions Ledger */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-sm text-white">Rejestr Transakcji Stripe (Orders)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">ID Transakcji</th>
                        <th className="py-2.5 px-3">Ogłoszenie</th>
                        <th className="py-2.5 px-3">Płatnik</th>
                        <th className="py-2.5 px-3">Kwota</th>
                        <th className="py-2.5 px-3">Karta</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3 text-right">Akcja</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {transactions.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-3 font-mono text-slate-400">{t.stripePaymentIntentId}</td>
                          <td className="py-3 px-3 font-semibold text-slate-200">{t.listingTitle}</td>
                          <td className="py-3 px-3 text-slate-400">{t.userEmail}</td>
                          <td className="py-3 px-3 font-bold font-mono text-white">
                            {t.amount.toFixed(2)} {t.currency}
                          </td>
                          <td className="py-3 px-3 font-mono text-slate-400">•••• {t.cardLast4}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              t.status === 'succeeded'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-rose-500/20 text-rose-300'
                            }`}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right">
                            {t.status === 'succeeded' && (
                              <button
                                onClick={() => onRefundTransaction(t.id)}
                                className="text-[11px] text-rose-400 hover:text-rose-300 underline font-medium"
                              >
                                Wykonaj zwrot (Refund)
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. SECURITY SHIELD */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Security Shield Controls */}
              <form onSubmit={handleSaveSecurity} className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Konfiguracja Tarczy Bezpieczeństwa Portalu</h3>
                  </div>
                  <span className="text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full font-medium">
                    Standard OWASP & CSP
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-white">Rate Limiting (Ochrona przed DDoS)</div>
                      <div className="text-[11px] text-slate-400">Limit 60 żądań / minutę na adres IP</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.rateLimitingEnabled}
                      onChange={(e) => setSecurityForm({ ...securityForm, rateLimitingEnabled: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-white">Pułapka Honeypot (Spatie)</div>
                      <div className="text-[11px] text-slate-400">Niewidoczne pola blokujące boty spamujące</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.honeypotSpamFilter}
                      onChange={(e) => setSecurityForm({ ...securityForm, honeypotSpamFilter: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-white">Sanityzacja XSS (HTMLPurifier)</div>
                      <div className="text-[11px] text-slate-400">Usuwanie złośliwych skryptów z opisów</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.xssSanitization}
                      onChange={(e) => setSecurityForm({ ...securityForm, xssSanitization: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                  </div>

                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-xs text-white">Wymuszenie 2FA dla Filament Admin</div>
                      <div className="text-[11px] text-slate-400">Wymaga aplikacji Google Authenticator / Authy</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={securityForm.require2FAForAdmin}
                      onChange={(e) => setSecurityForm({ ...securityForm, require2FAForAdmin: e.target.checked })}
                      className="w-4 h-4 text-amber-500 rounded"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    Zastosuj reguły bezpieczeństwa
                  </button>
                </div>
              </form>

              {/* Security Activity Audit Log */}
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4">
                <h3 className="font-bold text-sm text-white">Dziennik Audytu Bezpieczeństwa (Security Audit Log)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="text-[11px] uppercase text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3">Czas</th>
                        <th className="py-2.5 px-3">Zdarzenie</th>
                        <th className="py-2.5 px-3">Adres IP</th>
                        <th className="py-2.5 px-3">Waga</th>
                        <th className="py-2.5 px-3">Szczegóły</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {securityLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="py-3 px-3 font-mono text-slate-500">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </td>
                          <td className="py-3 px-3 font-semibold text-slate-200">{log.event}</td>
                          <td className="py-3 px-3 font-mono text-indigo-300">{log.ip}</td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              log.severity === 'danger'
                                ? 'bg-rose-500/20 text-rose-300'
                                : log.severity === 'warning'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-emerald-500/20 text-emerald-300'
                            }`}>
                              {log.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 max-w-sm truncate">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. EMAILS */}
          {activeTab === 'emails' && (
            <div className="space-y-6">
              <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="font-bold text-sm text-white">System Powiadomień E-mail (Laravel Notifications & Mailables)</h3>
                    <p className="text-xs text-slate-400">Automatyczna wysyłka e-maili przez sterownik SMTP z obsługą kolejki (Redis/Database Queue)</p>
                  </div>
                  <button
                    onClick={onTriggerTestEmail}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Wyślij testowy e-mail transakcyjny
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-white mb-1">1. Potwierdzenie Stripe</div>
                    <p className="text-slate-400 text-[11px]">Wysyłane po zdarzeniu <code>checkout.session.completed</code> z załączoną fakturą.</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-white mb-1">2. Zapytanie kupującego</div>
                    <p className="text-slate-400 text-[11px]">Wysyłane do sprzedającego, gdy potencjalny kupiec wyśle formularz Livewire.</p>
                  </div>
                  <div className="p-4 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="font-bold text-white mb-1">3. Status moderacji</div>
                    <p className="text-slate-400 text-[11px]">Informacja o zatwierdzeniu lub odrzuceniu oferty przez administratora Filament.</p>
                  </div>
                </div>

                {/* Queue status */}
                <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-slate-300 font-medium">Laravel Queue Worker: <code className="font-mono text-emerald-400">php artisan queue:work</code> aktywny</span>
                  </div>
                  <span className="text-xs text-slate-400">Wysłano łącznie: <strong>{emails.length}</strong> e-maili</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
