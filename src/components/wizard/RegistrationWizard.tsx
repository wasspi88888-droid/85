import React, { useState, useEffect } from 'react';
import { z } from 'zod';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Fingerprint,
  ShieldCheck,
  Globe,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Sparkles,
  Loader2,
  CheckCircle2,
  Copy,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AFRICAN_COUNTRIES } from '../../constants/countries';
import { TRANSLATIONS } from '../../constants/translations';
import { useApp } from '../../context/AppContext';
import { UserProfile } from '../../types';
import { BrandLogo } from '../common/BrandLogo';

// Zod schemas for real-time validation
const nameSchema = z.string().trim().min(2, 'Le nom doit comporter au moins 2 caractères');
const phoneSchema = z.string().trim().regex(/^\d{6,14}$/, 'Numéro invalide (au moins 6 chiffres sans indicatif)');
const emailSchema = z.string().trim().email('Adresse email invalide (ex: nom@domaine.com)');
const countrySchema = z.string().min(1, 'Veuillez sélectionner un pays');

export const RegistrationWizard: React.FC = () => {
  const { wizardDraft, updateWizardDraft, registerNewUser, setLanguage: setGlobalLanguage, showToast } = useApp();

  const currentStep = wizardDraft.step || 1;

  // Local form fields synced with draft
  const [language, setLanguage] = useState<'fr' | 'en'>(wizardDraft.language || 'fr');
  const [fullName, setFullName] = useState<string>(wizardDraft.fullName || '');
  const [phoneDialCode, setPhoneDialCode] = useState<string>(wizardDraft.phoneDialCode || '+225');
  const [phoneNumber, setPhoneNumber] = useState<string>(wizardDraft.phoneNumber || '');
  const [email, setEmail] = useState<string>(wizardDraft.email || '');
  const [country, setCountry] = useState<string>(wizardDraft.country || "Côte d'Ivoire");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(wizardDraft.termsAccepted || false);

  const t = TRANSLATIONS[language].wizard;

  const handleLanguageChange = (lang: 'fr' | 'en') => {
    setLanguage(lang);
    setGlobalLanguage(lang);
  };

  // Biometric wallet generation states
  const [isBiometricScanning, setIsBiometricScanning] = useState(false);
  const [generatedWalletAddress, setGeneratedWalletAddress] = useState<string | null>(
    wizardDraft.walletAddress || null
  );
  const [hasCopiedAddress, setHasCopiedAddress] = useState(false);
  const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

  // Validation errors
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Sync back to context draft
  useEffect(() => {
    updateWizardDraft({
      language,
      fullName,
      phoneDialCode,
      phoneNumber,
      email,
      country,
      termsAccepted,
      walletAddress: generatedWalletAddress || undefined,
    });
  }, [language, fullName, phoneDialCode, phoneNumber, email, country, termsAccepted, generatedWalletAddress]);

  // Real-time validations
  const validateName = (val: string) => {
    setFullName(val);
    const res = nameSchema.safeParse(val);
    setNameError(res.success ? null : res.error.issues[0]?.message || 'Erreur');
  };

  const validatePhone = (val: string) => {
    const clean = val.replace(/\D/g, '');
    setPhoneNumber(clean);
    const res = phoneSchema.safeParse(clean);
    setPhoneError(res.success ? null : res.error.issues[0]?.message || 'Erreur');
  };

  const validateEmail = (val: string) => {
    setEmail(val);
    const res = emailSchema.safeParse(val);
    setEmailError(res.success ? null : res.error.issues[0]?.message || 'Erreur');
  };

  // Determine if Next is enabled
  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return !!language;
      case 2:
        return nameSchema.safeParse(fullName).success;
      case 3:
        return phoneSchema.safeParse(phoneNumber).success;
      case 4:
        return emailSchema.safeParse(email).success;
      case 5:
        return countrySchema.safeParse(country).success;
      case 6:
        return Boolean(generatedWalletAddress && termsAccepted);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (currentStep < 6) {
      updateWizardDraft({ step: currentStep + 1 });
    } else {
      handleFinalizeRegistration();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      updateWizardDraft({ step: currentStep - 1 });
    }
  };

  const handleStartBiometricWalletCreation = () => {
    setIsBiometricScanning(true);

    // 1.5s simulated Face ID / Biometric Passkey generation
    setTimeout(() => {
      // Generate keyless smart wallet address
      const randomHex = Array.from({ length: 40 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join('');
      const newAddress = `0x85${randomHex.substring(2)}`;

      setGeneratedWalletAddress(newAddress);
      updateWizardDraft({ walletAddress: newAddress });
      setIsBiometricScanning(false);

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });

      showToast('Identité biométrique vérifiée ! Smart Wallet généré.');
    }, 1500);
  };

  const handleCopyAddress = () => {
    if (generatedWalletAddress) {
      navigator.clipboard.writeText(generatedWalletAddress);
      setHasCopiedAddress(true);
      setTimeout(() => setHasCopiedAddress(false), 2000);
    }
  };

  const handleFinalizeRegistration = async () => {
    if (!generatedWalletAddress || !termsAccepted) return;

    setIsSubmittingFinal(true);

    // Simulate POST /api/auth/register + POST /api/auth/wallet
    await new Promise((res) => setTimeout(res, 1000));

    const newUser: UserProfile = {
      id: `usr_85_${Date.now()}`,
      fullName,
      phone: phoneNumber,
      countryDialCode: phoneDialCode,
      email,
      country,
      walletAddress: generatedWalletAddress,
      language,
      twoFactorEnabled: true,
      biometricType: 'Face ID',
      createdAt: new Date().toISOString(),
      avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80`,
      deviceInfo: 'Appareil Mobile Sécurisé • PWA Active',
    };

    await registerNewUser(newUser);
    setIsSubmittingFinal(false);

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.4 },
    });
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex flex-col justify-between max-w-md mx-auto px-5 py-6">
      {/* Top Section: Brand & Color-Coded Progress Bar */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <BrandLogo size="md" />
          </div>

          <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
            {t.step} {currentStep} / 6
          </span>
        </div>

        {/* Visual Progress Bar (Vert = fait, Orange = en cours, Gris = à venir) */}
        <div className="grid grid-cols-6 gap-1.5 mb-6">
          {[1, 2, 3, 4, 5, 6].map((st) => {
            let bgColor = 'bg-gray-200';
            if (st < currentStep) bgColor = 'bg-[#10B981]'; // Vert = fait
            else if (st === currentStep) bgColor = 'bg-[#FF6B35]'; // Orange = en cours

            return (
              <div
                key={st}
                className={`h-2 rounded-full transition-all duration-300 ${bgColor}`}
              />
            );
          })}
        </div>

        {/* Step Content Container */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200/80 shadow-xs">
          {/* Étape 1/6 : Langue */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-6">
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                  {t.welcomeTitle}
                </h1>
                <p className="text-xs text-gray-600 pt-2">
                  {t.welcomeSubtitle}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('fr')}
                  className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    language === 'fr'
                      ? 'border-[#FF6B35] bg-orange-50/50 ring-2 ring-[#FF6B35]/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">🇫🇷</span>
                  <span className="text-sm font-bold text-gray-900">Français</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`p-4 rounded-xl border text-center transition flex flex-col items-center justify-center gap-2 cursor-pointer ${
                    language === 'en'
                      ? 'border-[#FF6B35] bg-orange-50/50 ring-2 ring-[#FF6B35]/20 shadow-xs'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-3xl">🇬🇧</span>
                  <span className="text-sm font-bold text-gray-900">English</span>
                </button>
              </div>
            </div>
          )}

          {/* Étape 2/6 : Identité */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Votre Identité</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Indiquez votre nom complet officiel tel qu&apos;il apparaît sur vos pièces d&apos;identité.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Nom complet
                </label>
                <div className="relative">
                  <input
                    type="text"
                    autoFocus
                    value={fullName}
                    onChange={(e) => validateName(e.target.value)}
                    placeholder="Kouamé Jean-Marc"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition ${
                      nameError
                        ? 'border-[#EF4444] bg-red-50/20 text-[#EF4444]'
                        : fullName.length >= 2
                        ? 'border-[#10B981] bg-emerald-50/20 text-gray-900'
                        : 'border-gray-300 text-gray-900 focus:border-[#FF6B35]'
                    }`}
                  />
                  {fullName.length >= 2 && !nameError && (
                    <Check className="absolute right-3.5 top-3.5 w-4 h-4 text-[#10B981]" />
                  )}
                </div>
                {nameError ? (
                  <p className="text-[11px] font-semibold text-[#EF4444]">{nameError}</p>
                ) : (
                  <p className="text-[11px] text-gray-400">Au moins 2 caractères requis.</p>
                )}
              </div>
            </div>
          )}

          {/* Étape 3/6 : Téléphone */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Numéro de Téléphone</h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Numéro Mobile
                </label>
                <div className="flex gap-2">
                  <select
                    value={phoneDialCode}
                    onChange={(e) => setPhoneDialCode(e.target.value)}
                    className="w-32 px-2.5 py-3 rounded-xl border border-gray-300 bg-gray-50 text-xs font-bold text-gray-800 outline-none focus:border-[#FF6B35]"
                  >
                    {AFRICAN_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.dialCode}>
                        {c.flag} {c.dialCode}
                      </option>
                    ))}
                  </select>

                  <div className="relative flex-1">
                    <input
                      type="tel"
                      inputMode="numeric"
                      autoFocus
                      value={phoneNumber}
                      onChange={(e) => validatePhone(e.target.value)}
                      placeholder="0708091011"
                      className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition ${
                        phoneError
                          ? 'border-[#EF4444] bg-red-50/20 text-[#EF4444]'
                          : phoneNumber.length >= 6
                          ? 'border-[#10B981] bg-emerald-50/20 text-gray-900'
                          : 'border-gray-300 text-gray-900 focus:border-[#FF6B35]'
                      }`}
                    />
                    {phoneNumber.length >= 6 && !phoneError && (
                      <Check className="absolute right-3.5 top-3.5 w-4 h-4 text-[#10B981]" />
                    )}
                  </div>
                </div>
                {phoneError && (
                  <p className="text-[11px] font-semibold text-[#EF4444]">{phoneError}</p>
                )}
              </div>
            </div>
          )}

          {/* Étape 4/6 : Email */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Adresse Email</h2>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    autoFocus
                    value={email}
                    onChange={(e) => validateEmail(e.target.value)}
                    placeholder="exemple@domaine.com"
                    className={`w-full px-4 py-3 rounded-xl border text-sm font-semibold outline-none transition ${
                      emailError
                        ? 'border-[#EF4444] bg-red-50/20 text-[#EF4444]'
                        : email.includes('@') && email.includes('.')
                        ? 'border-[#10B981] bg-emerald-50/20 text-gray-900'
                        : 'border-gray-300 text-gray-900 focus:border-[#FF6B35]'
                    }`}
                  />
                  {email.length > 5 && !emailError && (
                    <Check className="absolute right-3.5 top-3.5 w-4 h-4 text-[#10B981]" />
                  )}
                </div>
                {emailError ? (
                  <p className="text-[11px] font-semibold text-[#EF4444]">{emailError}</p>
                ) : (
                  <p className="text-[11px] text-gray-400">Format email valide requis.</p>
                )}
              </div>
            </div>
          )}

          {/* Étape 5/6 : Pays */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900">Votre Pays de Résidence</h2>
              </div>

              <div className="space-y-1.5">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-300 bg-white text-sm font-semibold text-gray-900 outline-none focus:border-[#FF6B35]"
                >
                  {AFRICAN_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Étape 6/6 : Wallet (OBLIGATOIRE) */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#FF6B35] flex items-center justify-center mx-auto mb-2">
                  <Fingerprint className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-black text-gray-900">Votre wallet sécurisé</h2>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Technologie sans phrase secrète (Seedless). Sécurisé par votre biométrie (Face ID / Empreinte).
                </p>
              </div>

              {!generatedWalletAddress ? (
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleStartBiometricWalletCreation}
                    disabled={isBiometricScanning}
                    className="w-full py-4 rounded-xl bg-[#FF6B35] hover:bg-[#E85520] text-white font-extrabold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                  >
                    {isBiometricScanning ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Vérification biométrique en cours...</span>
                      </>
                    ) : (
                      <>
                        <Fingerprint className="w-5 h-5" />
                        <span>Créer mon wallet</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-gray-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Enclave sécurisée matérielle (Secure Enclave)</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 pt-1 animate-fade-in">
                  <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Identité vérifiée ! Wallet Biométrique Actif</span>
                    </div>

                    <div className="mt-2.5 p-2 bg-white rounded-lg border border-emerald-100 flex items-center justify-between">
                      <span className="font-mono text-[11px] text-gray-800 truncate select-all">
                        {generatedWalletAddress}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyAddress}
                        className="p-1 rounded-md text-gray-400 hover:text-gray-700 ml-2"
                        title="Copier l'adresse"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    {hasCopiedAddress && (
                      <span className="text-[10px] text-emerald-700 font-medium mt-1 block">
                        Adresse copiée dans le presse-papier !
                      </span>
                    )}
                  </div>

                  {/* Conditions Checkbox (Obligatoire) */}
                  <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#FF6B35] rounded-sm focus:ring-[#FF6B35] border-gray-300"
                    />
                    <span className="text-xs text-gray-700 leading-snug">
                      J&apos;accepte les <strong>Conditions Générales d&apos;Utilisation</strong> de 85, la politique de confidentialité et la gestion sans phrase secrète de mon wallet USDC.
                    </span>
                  </label>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Area (Zone du pouce) */}
      <div className="pt-4 flex items-center gap-3">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t.back}</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleNext}
          disabled={!isStepValid() || isSubmittingFinal}
          className={`flex-1 py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition shadow-md cursor-pointer active:scale-98 ${
            isStepValid() && !isSubmittingFinal
              ? 'bg-[#FF6B35] hover:bg-[#E85520] text-white shadow-orange-500/20'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
          }`}
        >
          {isSubmittingFinal ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Initialisation...</span>
            </>
          ) : currentStep === 6 ? (
            <>
              <Sparkles className="w-4 h-4" />
              <span>{t.finalize}</span>
            </>
          ) : (
            <>
              <span>{t.next}</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>

      {/* Biometric Scanning Overlay Modal Animation (1.5s) */}
      {isBiometricScanning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-8 max-w-xs w-full text-center space-y-4 shadow-2xl animate-scale-up">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-[#FF6B35] animate-ping opacity-25" />
              <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-[#FF6B35] ring-4 ring-[#FF6B35]/20">
                <Fingerprint className="w-10 h-10 animate-pulse stroke-[2.2]" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-extrabold text-gray-900">Scan Biométrique en cours</h3>
              <p className="text-xs text-gray-500 mt-1">
                Génération de la signature cryptographique sans phrase secrète...
              </p>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#FF6B35] h-full animate-[progress_1.5s_ease-in-out_infinite] w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
