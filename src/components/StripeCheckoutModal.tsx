import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, Lock, CheckCircle, AlertCircle, Loader2, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Listing, StripeConfig, StripeTransaction } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  listing: Listing;
  tier: 'promoted' | 'vip';
  stripeConfig: StripeConfig;
  onSuccess: (transaction: StripeTransaction) => void;
}

export const StripeCheckoutModal: React.FC<Props> = ({
  isOpen,
  onClose,
  listing,
  tier,
  stripeConfig,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('123');
  const [cardHolder, setCardHolder] = useState(listing.userName || 'Jan Kowalski');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const price = tier === 'vip' ? stripeConfig.vipPrice : stripeConfig.promotedPrice;
  const tierName = tier === 'vip' ? 'Pakiet VIP (Strona Główna + Góra Listy)' : 'Pakiet Promowany (Góra Listy)';

  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setExpiry('12/28');
    setCvc('999');
    setError(null);
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanCard = cardNumber.replace(/\s+/g, '');
    if (cleanCard.length < 16) {
      setError('Wprowadź poprawny 16-cyfrowy numer karty testowej.');
      return;
    }

    setIsProcessing(true);
    setProcessingStep('Inicjalizacja PaymentIntent przez API Stripe...');

    await new Promise((r) => setTimeout(r, 900));
    setProcessingStep('Weryfikacja protokołu 3D Secure 2.0 (SCA)...');

    await new Promise((r) => setTimeout(r, 1100));
    setProcessingStep('Przetwarzanie webhooka: checkout.session.completed...');

    await new Promise((r) => setTimeout(r, 800));

    // Generate simulated successful transaction
    const newTx: StripeTransaction = {
      id: `tx-${Date.now().toString().slice(-6)}`,
      stripePaymentIntentId: `pi_3P${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      listingId: listing.id,
      listingTitle: listing.title,
      userEmail: listing.userEmail || 'klient@example.com',
      userName: cardHolder,
      amount: price,
      currency: stripeConfig.currency,
      tier: tier,
      status: 'succeeded',
      createdAt: new Date().toISOString(),
      cardLast4: cleanCard.slice(-4),
      receiptUrl: `https://pay.stripe.com/receipts/acct_livewire_filament/ch_${Date.now()}`,
    };

    setIsProcessing(false);

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore in iframe
    }

    onSuccess(newTx);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200">
        {/* Stripe Header Brand */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-2.5 py-1 bg-indigo-600 rounded text-xs font-bold tracking-wider uppercase">
              Stripe Checkout
            </div>
            {stripeConfig.testMode && (
              <span className="text-[11px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-medium">
                TRYB TESTOWY (Sandbox)
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-500 uppercase font-semibold tracking-wide">Promowanie Ogłoszenia</div>
            <div className="font-bold text-slate-900 text-sm">{listing.title}</div>
            <div className="text-xs text-indigo-600 font-medium">{tierName}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-500">Do zapłaty</div>
            <div className="text-2xl font-black text-slate-900">
              {price.toFixed(2)} <span className="text-sm font-semibold">{stripeConfig.currency}</span>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">Imię i nazwisko na karcie</label>
            <input
              type="text"
              required
              disabled={isProcessing}
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden transition"
              placeholder="np. Jan Kowalski"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-slate-500" />
                Numer karty płatniczej
              </label>
              <button
                type="button"
                onClick={handleFillTestCard}
                className="text-[11px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3" />
                Wstaw kartę testową Stripe
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                required
                disabled={isProcessing}
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full pl-3.5 pr-10 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                placeholder="4242 4242 4242 4242"
              />
              <div className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">
                VISA / MC
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Ważność (MM/RR)</label>
              <input
                type="text"
                required
                disabled={isProcessing}
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                placeholder="12/28"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Kod CVC / CVV</label>
              <input
                type="text"
                required
                disabled={isProcessing}
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm font-mono border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-hidden"
                placeholder="123"
              />
            </div>
          </div>

          {/* Security badge */}
          <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center gap-3 text-xs text-emerald-800">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-semibold">Bezpieczeństwo Stripe Elements:</span> Transakcja szyfrowana 256-bitowym certyfikatem SSL. Dane karty nie trafiają na nasz serwer.
            </div>
          </div>

          {/* Action button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{processingStep || 'Przetwarzanie...'}</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Zapłać {price.toFixed(2)} {stripeConfig.currency}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-400">
            Klucz publiczny: <code className="font-mono">{stripeConfig.publishableKey.slice(0, 18)}...</code>
          </div>
        </form>
      </div>
    </div>
  );
};
