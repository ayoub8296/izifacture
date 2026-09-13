'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  Mail, 
  Lock, 
  ArrowRight, 
  UserPlus, 
  LogIn, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';

function GoogleIcon() {
  return (
    <svg className="w-4 h-4" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.5s.7 4.8 1.9 7.2l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setErrorMsg(null);
    setGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setGoogleLoading(false);
      }
    } catch (err: unknown) {
      console.error(err);
      setErrorMsg('Impossible de démarrer la connexion Google.');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    if (!email || !password) {
      setErrorMsg('Veuillez renseigner votre email et votre mot de passe.');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Le mot de passe doit comporter au moins 6 caractères.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        const { error, data } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) {
          setErrorMsg(error.message);
        } else if (data.user && !data.session) {
          setSuccessMsg('Compte créé ! Veuillez vérifier votre boîte email pour valider votre inscription.');
        } else {
          setSuccessMsg('Compte créé avec succès ! Redirection en cours...');
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 1000);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          setErrorMsg(
            error.message === 'Invalid login credentials'
              ? 'Identifiants incorrects (email ou mot de passe invalide).'
              : error.message
          );
        } else {
          setSuccessMsg('Connexion réussie ! Chargement de votre espace...');
          setTimeout(() => {
            router.push('/');
            router.refresh();
          }, 800);
        }
      }
    } catch (err: unknown) {
      setErrorMsg('Une erreur inattendue est survenue.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-slate-900/95 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl shadow-black/50"
    >
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6">
        <Link href="/" className="flex items-center gap-2.5 mb-2.5 group">
          <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-pink-gradientStart to-brand-pink-gradientEnd shadow-lg shadow-brand-pink/30 group-hover:scale-105 transition-transform">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-outfit font-extrabold text-white tracking-tight">
            izi <span className="text-brand-pink">facture</span>
          </span>
        </Link>
        <p className="text-xs text-slate-400 font-medium">
          Logiciel de facturation & devis SaaS pour l’Afrique
        </p>
      </div>

      {/* Google OAuth Button */}
      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 rounded-xl text-xs font-semibold shadow-md transition-all mb-5 border border-slate-200 cursor-pointer touch-manipulation disabled:opacity-50"
      >
        {googleLoading ? (
          <span className="w-4 h-4 border-2 border-slate-400 border-t-slate-800 rounded-full animate-spin" />
        ) : (
          <GoogleIcon />
        )}
        <span>Continuer avec Google (Gmail)</span>
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex-1 h-px bg-slate-800" />
        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">ou avec email</span>
        <div className="flex-1 h-px bg-slate-800" />
      </div>

      {/* Mode Switch Tabs */}
      <div className="grid grid-cols-2 p-1 bg-slate-950/60 rounded-2xl border border-slate-800/80 mb-5">
        <button
          type="button"
          onClick={() => {
            setIsSignUp(false);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            !isSignUp
              ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Se connecter
        </button>
        <button
          type="button"
          onClick={() => {
            setIsSignUp(true);
            setErrorMsg(null);
            setSuccessMsg(null);
          }}
          className={`py-2 text-xs font-semibold rounded-xl transition-all ${
            isSignUp
              ? 'bg-brand-pink text-white shadow-md shadow-brand-pink/20'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Créer un compte
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Adresse Email
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              placeholder="ex: contact@entreprise.ci"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Mot de passe
            </label>
            {!isSignUp && (
              <span className="text-[11px] text-slate-400 hover:text-brand-pink cursor-pointer transition-colors">
                Mot de passe oublié ?
              </span>
            )}
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full pl-10 pr-10 py-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:border-brand-pink focus:ring-2 focus:ring-brand-pink/20 transition-all font-sans"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="p-1 text-slate-500 hover:text-slate-300 absolute right-3 top-1/2 -translate-y-1/2"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Feedback Alerts */}
        <AnimatePresence>
          {errorMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-start gap-2 text-rose-400 text-xs"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2 text-emerald-400 text-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="pinkPill"
          size="md"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 mt-2 shadow-lg shadow-brand-pink/25 font-semibold text-sm cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Traitement...</span>
            </span>
          ) : isSignUp ? (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Créer mon compte</span>
            </>
          ) : (
            <>
              <LogIn className="w-4 h-4" />
              <span>Se connecter</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </Button>
      </form>

      {/* Footer Info */}
      <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
        <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-pink" />
          <span>Sécurisé par Supabase Auth (Gmail & Email)</span>
        </p>
      </div>
    </motion.div>
  );
}
