/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, AppView } from './components/Navbar';
import { PublicPortal } from './components/PublicPortal';
import { FilamentAdminPanel } from './components/FilamentAdminPanel';
import { UserDashboard } from './components/UserDashboard';
import { ListingDetailModal } from './components/ListingDetailModal';
import { CreateListingWizard } from './components/CreateListingWizard';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { EmailSimulatorModal } from './components/EmailSimulatorModal';
import { LaravelCodeExportModal } from './components/LaravelCodeExportModal';

import {
  INITIAL_CATEGORIES,
  INITIAL_LISTINGS,
  INITIAL_USERS,
  INITIAL_TRANSACTIONS,
  INITIAL_EMAILS,
  INITIAL_SECURITY_SETTINGS,
  INITIAL_SECURITY_LOGS,
  INITIAL_STRIPE_CONFIG,
} from './data/mockData';

import {
  Listing,
  StripeTransaction,
  EmailNotification,
  SecuritySettings,
  SecurityLog,
  StripeConfig,
} from './types';

export default function App() {
  // State
  const [currentView, setCurrentView] = useState<AppView>('public');
  const [listings, setListings] = useState<Listing[]>(INITIAL_LISTINGS);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [transactions, setTransactions] = useState<StripeTransaction[]>(INITIAL_TRANSACTIONS);
  const [emails, setEmails] = useState<EmailNotification[]>(INITIAL_EMAILS);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>(INITIAL_SECURITY_SETTINGS);
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig>(INITIAL_STRIPE_CONFIG);

  // Modals
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [isCreateWizardOpen, setIsCreateWizardOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Stripe checkout state
  const [checkoutListing, setCheckoutListing] = useState<Listing | null>(null);
  const [checkoutTier, setCheckoutTier] = useState<'promoted' | 'vip'>('promoted');
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);

  // Global toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadEmailCount = emails.filter((e) => !e.read).length;

  // Handler: Start Stripe Promotion Checkout
  const handlePromoteClick = (listing: Listing, tier: 'promoted' | 'vip' = 'vip') => {
    setCheckoutListing(listing);
    setCheckoutTier(tier);
    setIsStripeModalOpen(true);
    if (selectedListing) setSelectedListing(null);
  };

  // Handler: Payment Succeeded via Stripe
  const handlePaymentSuccess = (newTx: StripeTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    // Update listing status
    setListings((prev) =>
      prev.map((l) => {
        if (l.id === newTx.listingId) {
          return {
            ...l,
            status: newTx.tier === 'vip' ? 'vip' : 'promoted',
            highlighted: true,
            vip: newTx.tier === 'vip',
            featuredUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
          };
        }
        return l;
      })
    );

    // Automated Transactional Email Notification
    const newEmail: EmailNotification = {
      id: `em-${Date.now()}`,
      to: newTx.userEmail,
      subject: `🧾 Potwierdzenie płatności Stripe: ${newTx.amount.toFixed(2)} ${newTx.currency} (Pakiet ${newTx.tier.toUpperCase()})`,
      type: 'payment_success',
      contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a; margin-bottom: 8px;">Płatność zakończona pomyślnie!</h2>
        <p>Witaj <strong>${newTx.userName}</strong>,</p>
        <p>Dziękujemy za opłacenie promowania ogłoszenia <em>"${newTx.listingTitle}"</em>.</p>
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0;"><strong>Numer transakcji Stripe:</strong> <code style="color: #6366f1;">${newTx.stripePaymentIntentId}</code></p>
          <p style="margin: 4px 0;"><strong>Kwota:</strong> ${newTx.amount.toFixed(2)} ${newTx.currency}</p>
          <p style="margin: 4px 0;"><strong>Pakiet promowania:</strong> ${newTx.tier === 'vip' ? 'VIP (Strona Główna)' : 'Promowane na Liście'}</p>
          <p style="margin: 4px 0;"><strong>Ważność:</strong> 30 dni</p>
        </div>
        <p>Ogłoszenie zostało natychmiast opublikowane z wyższym priorytetem.</p>
      </div>`,
      sentAt: new Date().toISOString(),
      read: false,
    };

    setEmails((prev) => [newEmail, ...prev]);

    // Add security audit log
    const newSecLog: SecurityLog = {
      id: `sec-${Date.now()}`,
      timestamp: new Date().toISOString(),
      event: 'Pomyślny Webhook Stripe: checkout.session.completed',
      ip: '54.187.174.169',
      userAgent: 'Stripe/1.0 (+https://stripe.com/docs/webhooks)',
      severity: 'info',
      details: `Transakcja ${newTx.stripePaymentIntentId} na kwotę ${newTx.amount} ${newTx.currency} rozliczona pomyślnie. Podpis HMAC poprawny.`,
    };
    setSecurityLogs((prev) => [newSecLog, ...prev]);

    showToast(`Płatność Stripe zakończona sukcesem! Ogłoszenie wyróżnione pakietem ${newTx.tier.toUpperCase()}.`);
  };

  // Handler: Submit new listing from wizard
  const handleSubmitNewListing = (newListingData: Partial<Listing>, tier: 'standard' | 'promoted' | 'vip') => {
    const newId = `lst-${Date.now().toString().slice(-4)}`;
    const fullListing: Listing = {
      id: newId,
      title: newListingData.title || 'Nowe ogłoszenie',
      slug: `${(newListingData.title || 'ogloszenie').toLowerCase().replace(/\s+/g, '-')}-${newId}`,
      description: newListingData.description || '',
      price: newListingData.price || 0,
      negotiable: !!newListingData.negotiable,
      category: newListingData.category || 'elektronika',
      location: newListingData.location || 'Warszawa',
      region: newListingData.region || 'Mazowieckie',
      images: newListingData.images || [],
      userId: 'user-jan',
      userName: 'Jan Kowalski (Użytkownik)',
      userPhone: '+48 691 882 119',
      userEmail: 'jan.kowalski@example.com',
      userVerified: true,
      status: tier === 'standard' ? 'pending_review' : tier === 'vip' ? 'vip' : 'promoted',
      views: 1,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      highlighted: tier !== 'standard',
      vip: tier === 'vip',
      featuredUntil: tier !== 'standard' ? new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString() : undefined,
    };

    setListings((prev) => [fullListing, ...prev]);

    if (tier !== 'standard') {
      // Open Stripe payment modal
      handlePromoteClick(fullListing, tier);
    } else {
      // Sent email notification about pending moderation
      const newEmail: EmailNotification = {
        id: `em-${Date.now()}`,
        to: 'jan.kowalski@example.com',
        subject: `📋 Twoje ogłoszenie "${fullListing.title}" zostało przyjęte do weryfikacji`,
        type: 'listing_activated',
        contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
          <h2 style="color: #0f172a;">Dziękujemy za dodanie ogłoszenia!</h2>
          <p>Twoje ogłoszenie <strong>"${fullListing.title}"</strong> zostało zapisane w systemie.</p>
          <p>Nasz moderator sprawdzi zgodność z regulaminem i opublikuje je w ciągu kilkunastu minut.</p>
        </div>`,
        sentAt: new Date().toISOString(),
        read: false,
      };
      setEmails((prev) => [newEmail, ...prev]);
      showToast('Ogłoszenie zostało dodane! Wysłano potwierdzenie e-mail.');
    }
  };

  // Handler: Send message from buyer to seller
  const handleSendMessage = (
    listing: Listing,
    buyerName: string,
    buyerEmail: string,
    message: string
  ) => {
    // Generate email to seller
    const newEmail: EmailNotification = {
      id: `em-${Date.now()}`,
      to: listing.userEmail,
      subject: `💬 Nowa wiadomość od ${buyerName} w sprawie "${listing.title}"`,
      type: 'new_message',
      contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a;">Masz nowe zapytanie w portalu!</h2>
        <p>Użytkownik <strong>${buyerName}</strong> (${buyerEmail}) przesłał wiadomość odnośnie Twojej oferty <em>"${listing.title}"</em>:</p>
        <blockquote style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 16px 0; font-style: italic; border-radius: 4px;">
          "${message}"
        </blockquote>
        <p>Możesz odpowiedzieć bezpośrednio na adres: <a href="mailto:${buyerEmail}">${buyerEmail}</a></p>
      </div>`,
      sentAt: new Date().toISOString(),
      read: false,
    };

    setEmails((prev) => [newEmail, ...prev]);
    showToast('Wiadomość została wysłana do sprzedawcy (oraz do skrzynki e-mail)!');
  };

  // Handler: Trigger test transactional email from Filament
  const handleTriggerTestEmail = () => {
    const testEmail: EmailNotification = {
      id: `em-${Date.now()}`,
      to: 'admin@serwis-ogloszeniowy.pl',
      subject: '🛡️ Testowy alert bezpieczeństwa: Nowe logowanie do Filament Admin',
      type: 'security_alert',
      contentHtml: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #1e293b;">
        <h2 style="color: #0f172a;">Dziennik bezpieczeństwa Filament</h2>
        <p>Wykryto pomyślne uwierzytelnienie do panelu administracyjnego z adresu IP: <code>194.29.130.5</code>.</p>
        <p>Uwierzytelnienie dwuskładnikowe 2FA zostało zweryfikowane poprawnie.</p>
      </div>`,
      sentAt: new Date().toISOString(),
      read: false,
    };
    setEmails((prev) => [testEmail, ...prev]);
    showToast('Wysłano testowy e-mail transakcyjny!');
  };

  // Handler: Refund Stripe transaction
  const handleRefundTransaction = (txId: string) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === txId ? { ...t, status: 'refunded' } : t))
    );
    showToast('Zlecono zwrot środków (Stripe Refund) dla wybranej transakcji.');
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-800 flex flex-col font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onViewChange={(view) => {
          if (view === 'code') {
            setIsCodeModalOpen(true);
          } else {
            setCurrentView(view);
          }
        }}
        onOpenCreateWizard={() => setIsCreateWizardOpen(true)}
        onOpenEmailModal={() => setIsEmailModalOpen(true)}
        unreadEmailCount={unreadEmailCount}
        stripeConfig={stripeConfig}
      />

      {/* Global Notification Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'public' && (
          <PublicPortal
            listings={listings}
            categories={categories}
            onSelectListing={(l) => setSelectedListing(l)}
            onOpenCreateWizard={() => setIsCreateWizardOpen(true)}
          />
        )}

        {currentView === 'user' && (
          <UserDashboard
            userListings={listings.filter((l) => l.userId === 'user-jan')}
            transactions={transactions.filter((t) => t.userEmail === 'jan.kowalski@example.com')}
            emails={emails}
            onAddNewListing={() => setIsCreateWizardOpen(true)}
            onPromoteListing={(l) => handlePromoteClick(l)}
            onDeleteListing={(id) => {
              setListings((prev) => prev.filter((l) => l.id !== id));
              showToast('Ogłoszenie zostało usunięte.');
            }}
            onViewListing={(l) => setSelectedListing(l)}
          />
        )}

        {currentView === 'filament' && (
          <FilamentAdminPanel
            listings={listings}
            users={users}
            transactions={transactions}
            securityLogs={securityLogs}
            securitySettings={securitySettings}
            stripeConfig={stripeConfig}
            emails={emails}
            onUpdateListingStatus={(id, status) => {
              setListings((prev) =>
                prev.map((l) => (l.id === id ? { ...l, status } : l))
              );
              showToast(`Status ogłoszenia zaktualizowany na: ${status}`);
            }}
            onDeleteListing={(id) => {
              setListings((prev) => prev.filter((l) => l.id !== id));
              showToast('Ogłoszenie zostało trwale usunięte.');
            }}
            onUpdateSecuritySettings={(settings) => setSecuritySettings(settings)}
            onUpdateStripeConfig={(config) => setStripeConfig(config)}
            onTriggerTestEmail={handleTriggerTestEmail}
            onRefundTransaction={handleRefundTransaction}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 text-xs py-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">Serwis Ogłoszeniowy</span>
            <span>• Architektura Laravel 13, Livewire v3, Filament Admin & Tailwind CSS</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline"
            >
              Pobierz projekt Laravel (.ZIP)
            </button>
            <button
              onClick={() => setIsEmailModalOpen(true)}
              className="hover:text-white cursor-pointer"
            >
              Skrzynka Mailpit ({emails.length})
            </button>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onPromoteClick={(l) => handlePromoteClick(l)}
          onSendMessage={handleSendMessage}
        />
      )}

      <CreateListingWizard
        isOpen={isCreateWizardOpen}
        onClose={() => setIsCreateWizardOpen(false)}
        categories={categories}
        stripeConfig={stripeConfig}
        onSubmitListing={handleSubmitNewListing}
      />

      {checkoutListing && (
        <StripeCheckoutModal
          isOpen={isStripeModalOpen}
          onClose={() => {
            setIsStripeModalOpen(false);
            setCheckoutListing(null);
          }}
          listing={checkoutListing}
          tier={checkoutTier}
          stripeConfig={stripeConfig}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <EmailSimulatorModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        emails={emails}
        onMarkAsRead={(id) => {
          setEmails((prev) =>
            prev.map((e) => (e.id === id ? { ...e, read: true } : e))
          );
        }}
        onClearAll={() => setEmails([])}
      />

      <LaravelCodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
      />
    </div>
  );
}
