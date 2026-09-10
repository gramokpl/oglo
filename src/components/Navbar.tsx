import React from 'react';
import {
  Globe,
  LayoutDashboard,
  ShieldCheck,
  FileCode2,
  Mail,
  Plus,
  Sparkles,
  CreditCard,
  User,
  Shield
} from 'lucide-react';
import { StripeConfig } from '../types';

export type AppView = 'public' | 'user' | 'filament' | 'code';

interface Props {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  onOpenCreateWizard: () => void;
  onOpenEmailModal: () => void;
  unreadEmailCount: number;
  stripeConfig: StripeConfig;
}

export const Navbar: React.FC<Props> = ({
  currentView,
  onViewChange,
  onOpenCreateWizard,
  onOpenEmailModal,
  unreadEmailCount,
  stripeConfig,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div
            onClick={() => onViewChange('public')}
            className="flex items-center gap-3 cursor-pointer select-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-violet-700 text-white flex items-center justify-center font-black text-lg shadow-md shadow-indigo-200">
              L13
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 tracking-tight text-base">
                  Ogłoszenia<span className="text-indigo-600">24</span>
                </span>
                <span className="hidden sm:inline-flex text-[10px] px-2 py-0.5 rounded-md font-bold bg-slate-100 text-slate-600 border border-slate-200">
                  Laravel + Filament
                </span>
              </div>
              <div className="text-[10px] text-slate-400 leading-none hidden sm:block">
                Tailwind CSS • Livewire v3 • Stripe
              </div>
            </div>
          </div>

          {/* Center Navigation Switcher */}
          <nav className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 text-xs font-medium text-slate-600">
            <button
              onClick={() => onViewChange('public')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'public'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Portal</span>
            </button>

            <button
              onClick={() => onViewChange('user')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'user'
                  ? 'bg-white text-slate-900 font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <User className="w-3.5 h-3.5 text-violet-600" />
              <span className="hidden sm:inline">Panel Użytkownika</span>
            </button>

            <button
              onClick={() => onViewChange('filament')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'filament'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden md:inline">Panel Filament (Admin)</span>
              <span className="md:hidden">Admin</span>
            </button>

            <button
              onClick={() => onViewChange('code')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                currentView === 'code'
                  ? 'bg-slate-900 text-white font-bold shadow-xs'
                  : 'hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden md:inline">Kod Laravel & ZIP</span>
              <span className="md:hidden">Kod</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            {/* Email Inbox Simulator Trigger */}
            <button
              onClick={onOpenEmailModal}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition border border-slate-200 cursor-pointer"
              title="Skrzynka e-mail powiadomień transakcyjnych (Mailpit)"
            >
              <Mail className="w-4 h-4" />
              {unreadEmailCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {unreadEmailCount}
                </span>
              )}
            </button>

            {/* Create Listing Button */}
            <button
              onClick={onOpenCreateWizard}
              className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Dodaj ogłoszenie</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
