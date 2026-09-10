import React, { useState } from 'react';
import { Mail, X, CheckCircle2, Clock, Trash2, Send, ExternalLink, ShieldCheck } from 'lucide-react';
import { EmailNotification } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  emails: EmailNotification[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export const EmailSimulatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  emails,
  onMarkAsRead,
  onClearAll,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string | null>(
    emails.length > 0 ? emails[0].id : null
  );

  if (!isOpen) return null;

  const currentEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleSelect = (email: EmailNotification) => {
    setSelectedEmailId(email.id);
    if (!email.read) {
      onMarkAsRead(email.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl h-[85vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-lg text-white">System Powiadomień E-mail (Symulator Mailpit / SMTP)</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                  Driver: SMTP / Queue Active
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Powiadomienia transakcyjne wysyłane przez Laravel Mailables (Stripe, nowe zapytania, moderacja)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {emails.length > 0 && (
              <button
                onClick={onClearAll}
                className="px-3 py-1.5 text-xs text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors flex items-center gap-1.5 border border-rose-500/20"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Wyczyść skrzynkę
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Email list sidebar */}
          <div className="w-80 border-r border-slate-800 overflow-y-auto bg-slate-950/60 divide-y divide-slate-800/60">
            {emails.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                <Mail className="w-8 h-8 mx-auto mb-2 opacity-40" />
                Brak wiadomości w kolejce. Dodaj ogłoszenie lub opłać pakiet Stripe, aby wygenerować e-mail.
              </div>
            ) : (
              emails.map((em) => (
                <button
                  key={em.id}
                  onClick={() => handleSelect(em)}
                  className={`w-full text-left p-4 transition-all hover:bg-slate-800/50 flex flex-col gap-1.5 ${
                    currentEmail?.id === em.id
                      ? 'bg-slate-800/80 border-l-4 border-indigo-500'
                      : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-slate-300 truncate max-w-[150px]">
                      {em.to}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(em.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-sm font-semibold text-white truncate flex items-center gap-2">
                    {!em.read && <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />}
                    <span className="truncate">{em.subject}</span>
                  </div>
                  <div className="text-xs text-slate-400 line-clamp-1">
                    {em.type === 'payment_success' && 'Faktura i potwierdzenie płatności Stripe'}
                    {em.type === 'listing_activated' && 'Aktywacja ogłoszenia w serwisie'}
                    {em.type === 'new_message' && 'Wiadomość z formularza kontaktowego'}
                    {em.type === 'security_alert' && 'Powiadomienie bezpieczeństwa konta'}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Email Preview pane */}
          <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden">
            {currentEmail ? (
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Meta details */}
                <div className="p-6 border-b border-slate-800 bg-slate-900/90">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white mb-2">{currentEmail.subject}</h2>
                      <div className="flex flex-wrap gap-4 text-xs text-slate-300">
                        <div>
                          <span className="text-slate-500">Nadawca: </span>
                          <span className="font-mono text-emerald-400">system@serwis-ogloszeniowy.pl</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Odbiorca: </span>
                          <span className="font-mono text-indigo-300">{currentEmail.to}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Wysłano: </span>
                          <span>{new Date(currentEmail.sentAt).toLocaleString('pl-PL')}</span>
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 text-xs rounded-md bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      SPF: PASS | DKIM: VALID
                    </span>
                  </div>
                </div>

                {/* Rendered HTML inside simulated client window */}
                <div className="flex-1 p-6 overflow-y-auto bg-slate-950/40">
                  <div className="max-w-2xl mx-auto bg-white text-slate-900 rounded-xl shadow-lg p-8 border border-slate-200">
                    <div className="border-b border-slate-200 pb-4 mb-6 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                          L13
                        </div>
                        <span className="font-bold text-slate-900 tracking-tight text-base">Serwis Ogłoszeniowy</span>
                      </div>
                      <span className="text-xs text-slate-500">Powiadomienie automatyczne</span>
                    </div>

                    <div
                      className="email-rendered-content text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: currentEmail.contentHtml }}
                    />

                    <div className="mt-8 pt-6 border-t border-slate-200 text-xs text-slate-500 text-center">
                      Wiadomość wygenerowana przez Laravel 13 Framework (Livewire & Filament) z integracją Stripe.
                      <br />
                      Wszelkie prawa zastrzeżone © {new Date().getFullYear()} Serwis Ogłoszeniowy Sp. z o.o.
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500">
                Wybierz wiadomość z listy po lewej stronie.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
