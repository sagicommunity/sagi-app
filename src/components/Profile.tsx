import { useState } from 'react';
import { ChevronRight, ChevronDown, Moon, Sun, Bell, HelpCircle, Languages, UserPlus, ArrowLeftRight, LogOut, User as UserIcon, Users, MapPin, Network, Search, X, Settings } from 'lucide-react';

const MemberQR = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 80 80" className={className}>
    <rect width="80" height="80" fill="white"/>
    <rect x="4" y="4" width="20" height="20" fill="#0a1a12"/><rect x="7" y="7" width="14" height="14" fill="white"/><rect x="10" y="10" width="8" height="8" fill="#0a1a12"/>
    <rect x="56" y="4" width="20" height="20" fill="#0a1a12"/><rect x="59" y="7" width="14" height="14" fill="white"/><rect x="62" y="10" width="8" height="8" fill="#0a1a12"/>
    <rect x="4" y="56" width="20" height="20" fill="#0a1a12"/><rect x="7" y="59" width="14" height="14" fill="white"/><rect x="10" y="62" width="8" height="8" fill="#0a1a12"/>
    <rect x="28" y="4" width="4" height="4" fill="#0a1a12"/><rect x="36" y="4" width="4" height="4" fill="#0a1a12"/><rect x="44" y="4" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="12" width="4" height="4" fill="#0a1a12"/><rect x="44" y="12" width="4" height="4" fill="#0a1a12"/>
    <rect x="36" y="20" width="4" height="4" fill="#0a1a12"/>
    <rect x="4" y="28" width="4" height="4" fill="#0a1a12"/><rect x="12" y="28" width="4" height="4" fill="#0a1a12"/><rect x="20" y="28" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="28" width="4" height="4" fill="#0a1a12"/><rect x="36" y="28" width="4" height="4" fill="#0a1a12"/>
    <rect x="52" y="28" width="4" height="4" fill="#0a1a12"/><rect x="60" y="28" width="4" height="4" fill="#0a1a12"/><rect x="68" y="28" width="4" height="4" fill="#0a1a12"/>
    <rect x="4" y="36" width="4" height="4" fill="#0a1a12"/><rect x="20" y="36" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="36" width="4" height="4" fill="#0a1a12"/><rect x="44" y="36" width="4" height="4" fill="#0a1a12"/><rect x="52" y="36" width="4" height="4" fill="#0a1a12"/><rect x="68" y="36" width="4" height="4" fill="#0a1a12"/>
    <rect x="4" y="44" width="4" height="4" fill="#0a1a12"/><rect x="12" y="44" width="4" height="4" fill="#0a1a12"/>
    <rect x="36" y="44" width="4" height="4" fill="#0a1a12"/><rect x="52" y="44" width="4" height="4" fill="#0a1a12"/><rect x="60" y="44" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="52" width="4" height="4" fill="#0a1a12"/><rect x="36" y="52" width="4" height="4" fill="#0a1a12"/><rect x="44" y="52" width="4" height="4" fill="#0a1a12"/><rect x="68" y="52" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="60" width="4" height="4" fill="#0a1a12"/><rect x="52" y="60" width="4" height="4" fill="#0a1a12"/><rect x="60" y="60" width="4" height="4" fill="#0a1a12"/>
    <rect x="28" y="68" width="4" height="4" fill="#0a1a12"/><rect x="36" y="68" width="4" height="4" fill="#0a1a12"/><rect x="44" y="68" width="4" height="4" fill="#0a1a12"/><rect x="52" y="68" width="4" height="4" fill="#0a1a12"/><rect x="68" y="68" width="4" height="4" fill="#0a1a12"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);
import { Link } from 'react-router';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import sagiLogo from '../assets/sagi-logo.png';
import { useAuth } from '../context/AuthContext';
import { RoleSwitcherModal } from './RoleSwitcherModal';
import { ContactsModal } from './ContactsModal';
import { MyCalendar } from './MyCalendar';
import { ConnectionsModal } from './ConnectionsModal';

export function Profile() {
  const { theme, toggleTheme } = useTheme();
  const { language, t } = useLanguage();
  const { logout } = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [showConnections, setShowConnections] = useState(false);
  const [showMemberQR, setShowMemberQR] = useState(false);
  const getLanguageName = (lang: string) => {
    switch (lang) {
      case 'en': return 'English';
      case 'ru': return 'Р СѓСЃСЃРєРёР№';
      case 'kk': return 'ТљР°Р·Р°Т›С€Р°';
      default: return lang;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4">
          <h1 className="text-xl">{t('myProfile')}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Profile header */}
        <div className="flex items-center gap-4 mb-6">
          <img
            src="https://images.unsplash.com/photo-1689600944138-da3b150d9cb8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200"
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#10b981]"
          />
          <div className="flex-1">
            <h2 className="mb-1">{language === 'en' ? 'Alima Alieva' : 'РђР»РёРјР° РђР»РёРµРІР°'}</h2>
            <p className="text-sm text-muted-foreground">alima.alieva@example.com</p>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Almaty, Kazakhstan</span>
            </div>
            <div className="flex gap-2 mt-1.5">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
                <LinkedInIcon />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
                className="w-7 h-7 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
                <InstagramIcon />
              </a>
            </div>
          </div>
          <Link to="/user/profile/edit" className="text-[#10b981] text-sm">{t('edit')}</Link>
        </div>

        {/* Bio & Tags & Socials */}
        <div className="mb-5 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">Fintech enthusiast and Vertex Club member. Open to collaboration and investment opportunities.</p>
          <div className="flex flex-wrap gap-2">
            {['Investor', 'Fintech'].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-[#10b981]/10 text-[#10b981] rounded-full text-xs font-medium">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
              className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
              <LinkedInIcon />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"
              className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/20 transition-colors">
              <InstagramIcon />
            </a>
          </div>
        </div>

        {/* Digital card вЂ” premium */}
        <div
          onClick={() => setShowMemberQR(true)}
          className="relative rounded-3xl overflow-hidden shadow-2xl mb-4 w-full text-left active:scale-[0.98] transition-transform cursor-pointer select-none"
          style={{ background: 'linear-gradient(135deg, #8e9199 0%, #c8cdd6 18%, #e8eaf0 35%, #f2f4f8 45%, #d8dce6 55%, #a8adb8 72%, #c4c8d2 85%, #9098a8 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.35) 0%, transparent 70%)' }} />
          <div className="absolute -bottom-12 -left-8 w-52 h-52 rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(180,185,200,0.25) 0%, transparent 70%)' }} />
          {/* Metallic shine band */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.55) 45%, rgba(255,255,255,0.15) 55%, transparent 75%)' }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%, rgba(0,0,0,0.08) 100%)' }} />

          <div className="relative z-10 px-4 pt-3 pb-2 text-[#1a1e2a]">
            {/* Top row: logo + badge */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <img src={sagiLogo} alt="Sagi" className="w-6 h-6 rounded-lg" />
                <span className="text-sm font-bold tracking-[0.18em] text-[#1a1e2a]">SAGI+</span>
              </div>
            </div>

            {/* Main content: left info + right QR/barcode stack */}
            <div className="flex gap-3">
              {/* Left: member code, name, stats */}
              <div className="flex-1 flex flex-col justify-between gap-1.5">
                {/* Member code вЂ” single line */}
                <p className="font-mono text-xs tracking-[0.22em] text-[#2a2e3a]/80 whitespace-nowrap">042718</p>

                {/* Name */}
                <p className="text-sm font-semibold tracking-wide leading-tight text-[#1a1e2a]">{language === 'en' ? 'Alima Alieva' : 'РђР»РёРјР° РђР»РёРµРІР°'}</p>

                {/* Stats */}
                <div className="flex gap-4">
                  <div>
                    <p className="text-[8px] tracking-widest uppercase text-[#1a1e2a]/45 mb-0.5">{t('communities')}</p>
                    <p className="text-sm font-bold text-[#1a1e2a]">1</p>
                  </div>
                  <div>
                    <p className="text-[8px] tracking-widest uppercase text-[#1a1e2a]/45 mb-0.5">{t('partners')}</p>
                    <p className="text-sm font-bold text-[#1a1e2a]">42</p>
                  </div>
                </div>
              </div>

              {/* Right: QR on top, barcode beneath */}
              <div className="flex flex-col items-center gap-1.5 -mt-7">
                {/* QR code вЂ” separate tap target */}
                <button
                  onClick={e => { e.stopPropagation(); setShowMemberQR(true); }}
                  className="bg-white rounded-xl p-1.5 shadow-lg active:scale-95 transition-transform"
                >
                  <MemberQR className="w-12 h-12" />
                </button>

                {/* Barcode beneath QR */}
                <div className="bg-white rounded-lg p-1 shadow-lg w-12">
                  <svg viewBox="0 0 60 28" className="w-full h-6">
                    {Array.from({ length: 28 }, (_, i) => (
                      <rect key={i} x={i * 2 + 2} y="1" width={i % 3 === 0 ? 1.5 : 0.8} height="26" fill="#1a1a2e" opacity={0.6 + (i % 5) * 0.08} />
                    ))}
                  </svg>
                </div>
              </div>
            </div>

            {/* Tap hint */}
            <div className="flex items-center justify-center gap-1 mt-2 pb-0.5 opacity-35">
              <ChevronDown className="w-3 h-3 text-[#1a1e2a]" />
              <span className="text-[9px] tracking-widest uppercase text-[#1a1e2a]">Show QR</span>
              <ChevronDown className="w-3 h-3 text-[#1a1e2a]" />
            </div>
          </div>
        </div>

        {/* Connections / Contacts / Communities вЂ” 2 per row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button
            onClick={() => setShowConnections(true)}
            className="flex flex-col gap-2 bg-card border border-border rounded-2xl p-4 hover:border-[#10b981]/50 transition-colors text-left"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <Network className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-base font-bold text-[#10b981]">42</span>
            </div>
            <span className="text-sm font-medium text-foreground">
              {language === 'kk' ? 'Р‘Р°Р№Р»Р°РЅС‹СЃС‚Р°СЂ' : language === 'ru' ? 'РљРѕРЅС‚Р°РєС‚С‹' : 'Connections'}
            </span>
          </button>

          <button
            onClick={() => setShowContacts(true)}
            className="flex flex-col gap-2 bg-card border border-border rounded-2xl p-4 hover:border-[#10b981]/50 transition-colors text-left"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <Users className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-base font-bold text-[#10b981]">14</span>
            </div>
            <span className="text-sm font-medium text-foreground">Contacts</span>
          </button>

          <Link
            to="/user/join-community"
            className="flex flex-col gap-2 bg-card border border-border rounded-2xl p-4 hover:border-[#10b981]/50 transition-colors"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                <UserPlus className="w-4 h-4 text-[#10b981]" />
              </div>
              <span className="text-base font-bold text-[#10b981]">1</span>
            </div>
            <span className="text-sm font-medium text-foreground">{t('communities')}</span>
          </Link>
        </div>

        {/* Calendar */}
        <div className="mb-6">
          <MyCalendar />
        </div>

        {/* Settings button */}
        <button
          onClick={() => setShowSettings(true)}
          className="w-full flex items-center gap-3 bg-card border border-border rounded-2xl p-4 mb-4 hover:border-[#10b981]/50 transition-colors"
        >
          <div className="w-9 h-9 rounded-xl bg-[#10b981]/10 flex items-center justify-center shrink-0">
            <Settings className="w-5 h-5 text-[#10b981]" />
          </div>
          <span className="flex-1 font-medium text-left">
            {language === 'kk' ? 'Р‘Р°РїС‚Р°СѓР»Р°СЂ' : language === 'ru' ? 'РќР°СЃС‚СЂРѕР№РєРё' : 'Settings'}
          </span>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <p className="text-center text-xs text-muted-foreground mb-4">{t('version')}</p>

        <button
          onClick={logout}
          className="w-full py-3 flex items-center justify-center gap-2 text-red-500 hover:text-red-600 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">{t('signOut')}</span>
        </button>
      </div>

      {showSwitcher && <RoleSwitcherModal onClose={() => setShowSwitcher(false)} />}
      {showContacts && <ContactsModal onClose={() => setShowContacts(false)} />}
      {showConnections && <ConnectionsModal onClose={() => setShowConnections(false)} />}

      {/* Settings bottom sheet */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end items-center">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSettings(false)} />
          <div className="relative bg-card rounded-t-3xl pb-8 z-10 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 pt-5 pb-3">
              <h2 className="text-lg font-bold">
                {language === 'kk' ? 'Р‘Р°РїС‚Р°СѓР»Р°СЂ' : language === 'ru' ? 'РќР°СЃС‚СЂРѕР№РєРё' : 'Settings'}
              </h2>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <div className="bg-input-background mx-4 rounded-2xl overflow-hidden">
              <Link to="/user/profile/edit" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  <UserIcon className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="flex-1 text-sm">{t('editProfile')}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/user/profile/appearance" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  {theme === 'dark' ? <Moon className="w-4 h-4 text-[#10b981]" /> : <Sun className="w-4 h-4 text-[#10b981]" />}
                </div>
                <span className="flex-1 text-sm">{t('appearance')}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/user/profile/language" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  <Languages className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="flex-1 text-sm">{t('language')}</span>
                <span className="text-xs text-muted-foreground mr-2">{getLanguageName(language)}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/user/profile/notifications" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="flex-1 text-sm">{t('notifications')}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <Link to="/user/profile/support" onClick={() => setShowSettings(false)} className="flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border">
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="flex-1 text-sm">{t('support')}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Link>
              <button
                onClick={() => { setShowSettings(false); setShowSwitcher(true); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-card transition-colors border-b border-border"
              >
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4 text-[#10b981]" />
                </div>
                <span className="flex-1 text-sm text-left">{t('switchRole')}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </button>
              <button
                onClick={() => { toggleTheme(); setShowSettings(false); }}
                className="w-full flex items-center gap-3 p-4 hover:bg-card transition-colors"
              >
                <div className="w-8 h-8 rounded-xl bg-[#10b981]/10 flex items-center justify-center">
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-[#10b981]" /> : <Moon className="w-4 h-4 text-[#10b981]" />}
                </div>
                <span className="flex-1 text-sm text-left">
                  {theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Member QR modal */}
      {showMemberQR && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setShowMemberQR(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg">Show to cashier</h3>
              <button onClick={() => setShowMemberQR(false)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#10b981] mb-2">Show the QR code to staff to get your discount</p>
            <div className="w-10 h-0.5 rounded-full bg-[#10b981] mb-5" />
            <div className="flex justify-center mb-5">
              <div className="bg-white rounded-2xl p-3 shadow-sm">
                <MemberQR className="w-44 h-44" />
              </div>
            </div>
            <div className="flex flex-col items-center gap-1">
              <p className="font-mono text-sm tracking-widest text-muted-foreground">SAGI &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; 0042</p>
              <p className="text-xs font-medium text-[#10b981]">Valid for 15 minutes</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
