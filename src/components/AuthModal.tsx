import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Phone,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  ShieldCheck,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { UserAccount, EmailNotification, SecurityLog } from '../types';

export type AuthMode = 'login' | 'register' | 'forgot_password' | 'reset_password';

interface Props {
  isOpen: boolean;
  initialMode?: AuthMode;
  onClose: () => void;
  users: UserAccount[];
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterSuccess: (newUser: UserAccount) => void;
  onSendPasswordResetEmail: (email: string, token: string) => void;
  onPasswordResetSuccess: (email: string, newPass: string) => void;
  initialResetToken?: string;
  initialResetEmail?: string;
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  initialMode = 'login',
  onClose,
  users,
  onLoginSuccess,
  onRegisterSuccess,
  onSendPasswordResetEmail,
  onPasswordResetSuccess,
  initialResetToken = '',
  initialResetEmail = '',
}) => {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Register fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [honeypotValue, setHoneypotValue] = useState(''); // Anti-bot honeypot

  // Password reset fields
  const [resetToken, setResetToken] = useState(initialResetToken);
  const [resetEmail, setResetEmail] = useState(initialResetEmail);
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // UI status
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMsg(null);
      setSuccessMsg(null);
      if (initialResetToken) setResetToken(initialResetToken);
      if (initialResetEmail) setResetEmail(initialResetEmail);
    }
  }, [isOpen, initialMode, initialResetToken, initialResetEmail]);

  if (!isOpen) return null;

  // Password strength checker
  const calculatePasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: '', color: 'bg-slate-200' };
    let score = 0;
    if (pwd.length >= 8) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) score += 1;

    switch (score) {
      case 1:
        return { score: 25, label: 'Bardzo słabe', color: 'bg-rose-500' };
      case 2:
        return { score: 50, label: 'Średnie', color: 'bg-amber-500' };
      case 3:
        return { score: 75, label: 'Silne', color: 'bg-indigo-500' };
      case 4:
        return { score: 100, label: 'Bardzo silne', color: 'bg-emerald-500' };
      default:
        return { score: 10, label: 'Za krótkie', color: 'bg-rose-400' };
    }
  };

  const strength = calculatePasswordStrength(password);

  // Quick fill test user
  const handleQuickLogin = (testEmail: string, testPass: string) => {
    setEmail(testEmail);
    setPassword(testPass);
    setErrorMsg(null);
  };

  // Handle Login Submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const user = users.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (!user) {
        setErrorMsg('Nie znaleziono konta przypisanego do tego adresu e-mail.');
        return;
      }

      // Check password (default fallback password123 / admin123 if not set)
      const expectedPass = user.password || (user.role === 'admin' ? 'admin123' : 'password123');
      if (password !== expectedPass) {
        setErrorMsg('Nieprawidłowe hasło. Sprawdź wielkość liter lub użyj opcji resetu hasła.');
        return;
      }

      onLoginSuccess(user);
      onClose();
    }, 450);
  };

  // Handle Register Submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Bot trap check
    if (honeypotValue.trim() !== '') {
      // Silent rejection
      onClose();
      return;
    }

    if (!name.trim()) {
      setErrorMsg('Podaj imię i nazwisko.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Podaj poprawny adres e-mail.');
      return;
    }

    // Check email uniqueness
    const existing = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
    if (existing) {
      setErrorMsg('Użytkownik o takim adresie e-mail jest już zarejestrowany. Zaloguj się lub zresetuj hasło.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Hasło musi zawierać minimum 8 znaków.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Hasła nie są identyczne.');
      return;
    }

    if (!termsAccepted) {
      setErrorMsg('Wymagana jest akceptacja Regulaminu serwisu oraz Polityki Prywatności.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const newUser: UserAccount = {
        id: `user-${Date.now().toString().slice(-5)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        phone: phone.trim() || '+48 500 000 000',
        role: 'user',
        twoFactorEnabled: false,
        verified: true,
        createdAt: new Date().toISOString(),
        listingsCount: 0,
      };

      onRegisterSuccess(newUser);
      onClose();
    }, 550);
  };

  // Handle Forgot Password (Step 1)
  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Podaj poprawny adres e-mail.');
      return;
    }

    const user = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      setErrorMsg('Nie znaleziono konta z podanym adresem e-mail.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Generate pseudo secure token
      const generatedToken = `tok_${Math.random().toString(36).substring(2, 10)}${Date.now().toString(36)}`;
      setResetToken(generatedToken);
      setResetEmail(user.email);

      onSendPasswordResetEmail(user.email, generatedToken);
      setSuccessMsg(`Link i token resetujący zostały wysłane na adres ${user.email}. Sprawdź skrzynkę e-mail (Mailpit).`);
      setMode('reset_password');
    }, 500);
  };

  // Handle Reset Password (Step 2)
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!resetToken.trim()) {
      setErrorMsg('Podaj ważny token resetujący.');
      return;
    }

    if (!resetEmail.trim()) {
      setErrorMsg('Podaj adres e-mail.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMsg('Nowe hasło musi zawierać co najmniej 8 znaków.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setErrorMsg('Nowe hasła nie są ze sobą zgodne.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onPasswordResetSuccess(resetEmail.trim().toLowerCase(), newPassword);
      setSuccessMsg('Hasło zostało pomyślnie zmienione! Możesz się teraz zalogować nowym hasłem.');
      setEmail(resetEmail);
      setPassword(newPassword);
      setMode('login');
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center font-black text-sm text-white shadow-xs">
              L13
            </div>
            <span className="font-bold text-slate-200 text-xs tracking-wide uppercase">
              Serwis Ogłoszeniowy • Autoryzacja
            </span>
          </div>

          <h2 className="text-xl font-extrabold tracking-tight text-white">
            {mode === 'login' && 'Zaloguj się do swojego konta'}
            {mode === 'register' && 'Dołącz do serwisu ogłoszeń'}
            {mode === 'forgot_password' && 'Resetowanie hasła'}
            {mode === 'reset_password' && 'Ustaw nowe hasło'}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' && 'Zarządzaj swoimi ogłoszeniami, płatnościami Stripe i wiadomościami.'}
            {mode === 'register' && 'Rejestracja trwa mniej niż minutę. Bezpieczeństwo i ochrona danych.'}
            {mode === 'forgot_password' && 'Wyślemy link z bezpiecznym tokenem do zmiany hasła.'}
            {mode === 'reset_password' && 'Wprowadź otrzymany token i ustaw nowe, silne hasło.'}
          </p>

          {/* Mode Tabs for Login / Register */}
          {(mode === 'login' || mode === 'register') && (
            <div className="mt-5 grid grid-cols-2 p-1 bg-slate-800/80 rounded-xl border border-slate-700/80 text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'login'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Logowanie
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg(null);
                }}
                className={`py-2 rounded-lg transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'register'
                    ? 'bg-indigo-600 text-white shadow-xs font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Rejestracja
              </button>
            </div>
          )}
        </div>

        {/* Feedback Messages */}
        <div className="px-6 pt-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}
        </div>

        {/* Forms Container */}
        <div className="p-6 pt-4">
          {/* ======================= 1. LOGIN FORM ======================= */}
          {mode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adres e-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">Hasło</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot_password');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                  >
                    Nie pamiętasz hasła?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Zapamiętaj mnie (sesja Livewire)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>Zaloguj się</span>
                  </>
                )}
              </button>

              {/* Quick Demo Credentials Switcher */}
              <div className="pt-4 border-t border-slate-100">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2 text-center">
                  Szybkie logowanie testowe:
                </div>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('jan.kowalski@example.com', 'password123')}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 text-xs transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Jan Kowalski (Użytkownik)</div>
                      <div className="text-[10px] text-slate-500">jan.kowalski@example.com • Hasło: password123</div>
                    </div>
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded">
                      Wybierz
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@serwis-ogloszeniowy.pl', 'admin123')}
                    className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 text-xs transition flex items-center justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-bold text-slate-800">Administrator Filament</div>
                      <div className="text-[10px] text-slate-500">admin@serwis-ogloszeniowy.pl • Hasło: admin123</div>
                    </div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                      Admin
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ======================= 2. REGISTER FORM ======================= */}
          {mode === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {/* Invisible Honeypot field for bot protection */}
              <input
                type="text"
                name="hp_website_contact"
                value={honeypotValue}
                onChange={(e) => setHoneypotValue(e.target.value)}
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Imię i nazwisko <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="np. Piotr Wiśniewski"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adres e-mail <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="piotr.wisniewski@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Numer telefonu (widoczny w ogłoszeniach)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+48 600 123 456"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hasło <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min. 8 znaków"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password strength bar */}
                {password && (
                  <div className="mt-1.5 space-y-1">
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color} transition-all duration-300`}
                        style={{ width: `${strength.score}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-500">
                      <span>Siła hasła: <strong>{strength.label}</strong></span>
                      <span>Min. 8 znaków, cyfra, wielka litera</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Powtórz hasło <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Powtórz hasło"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600 select-none leading-relaxed">
                  <input
                    type="checkbox"
                    required
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 mt-0.5 shrink-0"
                  />
                  <span>
                    Akceptuję <strong className="text-slate-800">Regulamin</strong> oraz zapoznałem się z{' '}
                    <strong className="text-slate-800">Polityką Prywatności</strong> (RODO).
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:from-indigo-800 active:to-violet-800 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Zarejestruj się i utwórz konto</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* ======================= 3. FORGOT PASSWORD ======================= */}
          {mode === 'forgot_password' && (
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
              <div className="p-3.5 bg-indigo-50/70 border border-indigo-100 rounded-xl text-xs text-indigo-900 leading-relaxed">
                Podaj adres e-mail przypisany do konta. System wyśle automatyczną wiadomość transakcyjną z <strong>jednorazowym tokenem bezpieczeństwa</strong>.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adres e-mail konta
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="twoj.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Wyślij link i token resetujący</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-xs pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-slate-600 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Wróć do logowania
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('reset_password');
                    setErrorMsg(null);
                  }}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer"
                >
                  Mam już token resetujący →
                </button>
              </div>
            </form>
          )}

          {/* ======================= 4. RESET PASSWORD (STEP 2) ======================= */}
          {mode === 'reset_password' && (
            <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5">
              <div className="p-3 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl">
                Wprowadź kod tokenu, który został wygenerowany i przesłany do skrzynki powiadomień (Mailpit).
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Token resetujący hasło
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    placeholder="tok_..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Adres e-mail
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="twoj.email@example.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nowe hasło
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min. 8 znaków"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Powtórz nowe hasło
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Powtórz nowe hasło"
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-600 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {isLoading ? (
                  <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Zapisz nowe hasło i zaloguj</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                >
                  ← Anuluj i wróć do logowania
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
