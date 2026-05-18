import { useState } from 'react';
import { X, Phone, UserPlus, Search, Users, Clock } from 'lucide-react';
import { people } from './NetworkPage';
import { PersonCard } from './PersonCard';

interface PhoneContact {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  pending: boolean;
}

interface SagiProfile {
  role: string;
  location: string;
  tags: string[];
  aiSummary: [string, string, string];
  connections: number;
}

interface SocialContact {
  id: string;
  name: string;
  username: string;
  initials: string;
  color: string;
  mutualCount: number;
  mutualNames: string[];
  source: 'instagram' | 'facebook';
  pending: boolean;
  sagiProfile?: SagiProfile;
}

const STORAGE_KEY = 'sagi_phone_contacts';
const SOCIAL_STORAGE_KEY = 'sagi_social_contacts';

const INSTAGRAM_SUGGESTIONS: Omit<SocialContact, 'pending'>[] = [
  {
    id: 'ig1', name: 'Aizat Bekova', username: '@aizat.bekova', initials: 'AB', color: '#7c6af0',
    mutualCount: 5, mutualNames: ['Madina', 'Areli', 'Kamila'], source: 'instagram',
    sagiProfile: { role: 'Product Manager', location: 'Almaty, Kazakhstan', tags: ['PropTech', 'Agile', 'B2B'], connections: 14,
      aiSummary: ['Strong product sense across FMCG and PropTech domains.', 'Bridges business strategy and agile delivery in B2B contexts.', 'Well-connected — 3 mutual contacts reachable.'] },
  },
  {
    id: 'ig2', name: 'Daniyar Seitkali', username: '@daniyar.s', initials: 'DS', color: '#f06a6a',
    mutualCount: 3, mutualNames: ['Kamila', 'Timur', 'Ruslan'], source: 'instagram',
    sagiProfile: { role: 'PropTech Founder', location: 'Astana, Kazakhstan', tags: ['Investment', 'Real Estate', 'AI'], connections: 22,
      aiSummary: ['Founder-level operator with 9 years in real estate tech.', 'Actively seeking B2C distribution partners.', 'High-value node — 5 mutual connections make intro easy.'] },
  },
  {
    id: 'ig3', name: 'Zarina Smatova', username: '@zarina_interiors', initials: 'ZS', color: '#f0c86a',
    mutualCount: 7, mutualNames: ['Areli', 'Saniya', 'Ruslan'], source: 'instagram',
    sagiProfile: { role: 'Interior Designer', location: 'Almaty, Kazakhstan', tags: ['Interiors', 'Staging', 'Luxury'], connections: 28,
      aiSummary: ['Top-of-funnel asset for property sales — staging boosts close rate.', '82k Instagram audience gives organic reach to HNW buyers.', 'Natural partner for developers in the premium segment.'] },
  },
  {
    id: 'ig4', name: 'Aigul Seitkali', username: '@aigul.pr', initials: 'AS', color: '#f06ab0',
    mutualCount: 4, mutualNames: ['Daniyar', 'Kamila', 'Madina'], source: 'instagram',
    // No Sagi profile — will show invite
  },
  {
    id: 'ig5', name: 'Madina Ilyasova', username: '@madina.community', initials: 'MI', color: '#c86af0',
    mutualCount: 6, mutualNames: ['Aizat', 'Areli', 'Saniya'], source: 'instagram',
    sagiProfile: { role: 'Community Manager', location: 'Astana, Kazakhstan', tags: ['Events', 'Network', 'RC'], connections: 40,
      aiSummary: ['Most networked person in the community — 40 connections.', 'Launched 3 resident clubs — proven community builder.', 'Ideal partner for onboarding residents or running events.'] },
  },
];

const FACEBOOK_SUGGESTIONS: Omit<SocialContact, 'pending'>[] = [
  {
    id: 'fb1', name: 'Ruslan Akhmetov', username: 'ruslan.akhmetov', initials: 'RA', color: '#6af0e0',
    mutualCount: 4, mutualNames: ['Daniyar', 'Kamila', 'Saniya'], source: 'facebook',
    sagiProfile: { role: 'RE Developer', location: 'Astana, Kazakhstan', tags: ['Construction', 'Elite', 'PPP'], connections: 25,
      aiSummary: ['15 years in elite real estate development — deep credibility.', 'Actively seeking PPP and infrastructure co-investment partners.', 'Best approached with a concrete proposal.'] },
  },
  {
    id: 'fb2', name: 'Kamila Duzhan', username: 'kamila.duzhan', initials: 'KD', color: '#f06ac8',
    mutualCount: 6, mutualNames: ['Daniyar', 'Aslan', 'Ruslan'], source: 'facebook',
    sagiProfile: { role: 'Investor Analyst', location: 'Almaty, Kazakhstan', tags: ['VC', 'Due Diligence', 'Kazakhstan'], connections: 31,
      aiSummary: ['Active deal-flow at pre-seed/seed stage in PropTech and EdTech.', 'Largest network in this community — 31 connections.', 'Key gatekeeper: an intro through her can open investor doors.'] },
  },
  {
    id: 'fb3', name: 'Arman Korov', username: 'arman.korov', initials: 'AK', color: '#6aaff0',
    mutualCount: 3, mutualNames: ['Aizat', 'Areli', 'Madina'], source: 'facebook',
    // No Sagi profile — will show invite
  },
  {
    id: 'fb4', name: 'Saniya Bekturova', username: 'saniya.bekturova', initials: 'SB', color: '#f0e06a',
    mutualCount: 2, mutualNames: ['Madina', 'Ruslan'], source: 'facebook',
    sagiProfile: { role: 'Architect', location: 'Astana, Kazakhstan', tags: ['BIM', 'Astana', 'Masterplan'], connections: 8,
      aiSummary: ['BIM-fluent architect with a focus on Astana urban development.', '14 completed projects show consistent delivery.', 'Urban Forum network gives access to city-level planning decisions.'] },
  },
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
}

function nameColor(name: string) {
  const palette = ['#7c6af0', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#f97316'];
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) & 0xffff;
  return palette[h % palette.length];
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

export function ContactsModal({ onClose }: { onClose: () => void }) {
  const [contacts, setContacts] = useState<PhoneContact[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [socialContacts, setSocialContacts] = useState<SocialContact[]>(() => {
    try {
      const saved = localStorage.getItem(SOCIAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [importing, setImporting] = useState(false);
  const [search, setSearch] = useState('');
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [instagramConnected, setInstagramConnected] = useState(() =>
    socialContacts.some(c => c.source === 'instagram')
  );
  const [facebookConnected, setFacebookConnected] = useState(() =>
    socialContacts.some(c => c.source === 'facebook')
  );
  const [connectingPlatform, setConnectingPlatform] = useState<'instagram' | 'facebook' | null>(null);
  const [openSections, setOpenSections] = useState<Set<'instagram' | 'facebook'>>(() => {
    const s = new Set<'instagram' | 'facebook'>();
    try {
      const saved = localStorage.getItem(SOCIAL_STORAGE_KEY);
      const list: SocialContact[] = saved ? JSON.parse(saved) : [];
      if (list.some(c => c.source === 'instagram')) s.add('instagram');
      if (list.some(c => c.source === 'facebook')) s.add('facebook');
    } catch { }
    return s;
  });
  const [selectedContact, setSelectedContact] = useState<SocialContact | null>(null);
  const [networkConnected, setNetworkConnected] = useState<Set<number>>(new Set());

  const apiSupported = typeof navigator !== 'undefined' && 'contacts' in navigator;

  const persistPhone = (list: PhoneContact[]) => {
    setContacts(list);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  };

  const persistSocial = (list: SocialContact[]) => {
    setSocialContacts(list);
    localStorage.setItem(SOCIAL_STORAGE_KEY, JSON.stringify(list));
  };

  const toggleSection = (p: 'instagram' | 'facebook') =>
    setOpenSections(prev => { const s = new Set(prev); s.has(p) ? s.delete(p) : s.add(p); return s; });

  const connectInstagram = () => {
    if (instagramConnected) { toggleSection('instagram'); return; }
    setConnectingPlatform('instagram');
    setTimeout(() => {
      const newContacts = INSTAGRAM_SUGGESTIONS.map(s => ({ ...s, pending: false }));
      const merged = [...socialContacts.filter(c => c.source !== 'instagram'), ...newContacts];
      persistSocial(merged);
      setInstagramConnected(true);
      setConnectingPlatform(null);
      setOpenSections(prev => new Set(prev).add('instagram'));
    }, 1200);
  };

  const connectFacebook = () => {
    if (facebookConnected) { toggleSection('facebook'); return; }
    setConnectingPlatform('facebook');
    setTimeout(() => {
      const newContacts = FACEBOOK_SUGGESTIONS.map(s => ({ ...s, pending: false }));
      const merged = [...socialContacts.filter(c => c.source !== 'facebook'), ...newContacts];
      persistSocial(merged);
      setFacebookConnected(true);
      setConnectingPlatform(null);
      setOpenSections(prev => new Set(prev).add('facebook'));
    }, 1200);
  };

  const importFromPhone = async () => {
    setImporting(true);
    try {
      const results = await (navigator as any).contacts.select(['name', 'tel', 'email'], { multiple: true });
      const existing = new Set(contacts.map(c => c.name));
      const added: PhoneContact[] = results
        .filter((r: any) => r.name?.[0] && !existing.has(r.name[0]))
        .map((r: any) => ({
          id: Date.now().toString(36) + Math.random().toString(36).slice(2),
          name: r.name[0],
          phone: r.tel?.[0],
          email: r.email?.[0],
          pending: false,
        }));
      persistPhone([...contacts, ...added]);
    } catch { }
    setImporting(false);
  };

  const addManual = () => {
    if (!manualName.trim()) return;
    const c: PhoneContact = {
      id: Date.now().toString(36),
      name: manualName.trim(),
      phone: manualPhone.trim() || undefined,
      pending: false,
    };
    persistPhone([...contacts, c]);
    setManualName(''); setManualPhone(''); setShowManual(false);
  };

  const togglePhonePending = (id: string) =>
    persistPhone(contacts.map(c => c.id === id ? { ...c, pending: !c.pending } : c));

  const toggleSocialPending = (id: string) =>
    persistSocial(socialContacts.map(c => c.id === id ? { ...c, pending: !c.pending } : c));

  const instagramContacts = socialContacts.filter(c => c.source === 'instagram');
  const facebookContacts  = socialContacts.filter(c => c.source === 'facebook');

  const filteredPhone = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? '').includes(search)
  );
  const filteredIG = instagramContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );
  const filteredFB = facebookContacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.username.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = contacts.length + socialContacts.length;

  return (
    <>
    <div
      className="fixed inset-0 z-50 flex flex-col justify-end items-center"
      style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full max-w-md bg-card rounded-t-3xl flex flex-col" style={{ maxHeight: '88vh' }}>

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[#10b981]" />
            <h2 className="text-lg font-semibold">Contacts</h2>
            {totalCount > 0 && (
              <span className="text-xs text-muted-foreground">· {totalCount}</span>
            )}
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls */}
        <div className="px-4 py-3 shrink-0 space-y-2">
          {/* Phone + Manual */}
          <div className="flex gap-2">
            <button
              onClick={apiSupported ? importFromPhone : () => alert('Contact import is only available on Android Chrome. Please add contacts manually.')}
              disabled={importing}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-opacity"
              style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)', opacity: importing ? 0.6 : 1 }}
            >
              <Phone className="w-4 h-4" />
              {importing ? 'Importing…' : 'Import from Phone'}
            </button>
            <button
              onClick={() => setShowManual(v => !v)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-colors"
              style={{ background: showManual ? 'rgba(16,185,129,0.18)' : 'rgba(16,185,129,0.06)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
            >
              <UserPlus className="w-4 h-4" />
              Add Manually
            </button>
          </div>

          {/* Instagram + Facebook */}
          <div className="flex gap-2">
            <button
              onClick={connectingPlatform ? undefined : connectInstagram}
              disabled={!!connectingPlatform}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all"
              style={instagramConnected
                ? { background: openSections.has('instagram') ? 'rgba(225,48,108,0.2)' : 'rgba(225,48,108,0.12)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.4)', opacity: connectingPlatform === 'instagram' ? 0.6 : 1 }
                : { background: 'rgba(225,48,108,0.07)', color: '#E1306C', border: '1px solid rgba(225,48,108,0.2)' }
              }
            >
              <InstagramIcon />
              {connectingPlatform === 'instagram' ? 'Connecting…' : instagramConnected ? 'Instagram ✓' : 'Instagram'}
            </button>
            <button
              onClick={connectingPlatform ? undefined : connectFacebook}
              disabled={!!connectingPlatform}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-sm font-medium transition-all"
              style={facebookConnected
                ? { background: openSections.has('facebook') ? 'rgba(24,119,242,0.2)' : 'rgba(24,119,242,0.12)', color: '#1877F2', border: '1px solid rgba(24,119,242,0.4)', opacity: connectingPlatform === 'facebook' ? 0.6 : 1 }
                : { background: 'rgba(24,119,242,0.07)', color: '#1877F2', border: '1px solid rgba(24,119,242,0.2)' }
              }
            >
              <FacebookIcon />
              {connectingPlatform === 'facebook' ? 'Connecting…' : facebookConnected ? 'Facebook ✓' : 'Facebook'}
            </button>
          </div>

          {/* Search */}
          {totalCount > 0 && (
            <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-input-background">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search contacts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-muted-foreground">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Manual add form */}
        {showManual && (
          <div className="px-4 pb-3 shrink-0 space-y-2 border-b border-border">
            <input
              type="text"
              placeholder="Full name *"
              value={manualName}
              onChange={e => setManualName(e.target.value)}
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <input
              type="tel"
              placeholder="Phone number"
              value={manualPhone}
              onChange={e => setManualPhone(e.target.value)}
              className="w-full bg-input-background rounded-xl px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <div className="flex gap-2">
              <button
                onClick={() => { setShowManual(false); setManualName(''); setManualPhone(''); }}
                className="flex-1 py-2.5 rounded-xl text-sm text-muted-foreground bg-input-background"
              >
                Cancel
              </button>
              <button onClick={addManual} className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white" style={{ background: '#10b981' }}>
                Add
              </button>
            </div>
          </div>
        )}

        {/* Contact list */}
        <div className="overflow-y-auto flex-1 px-4 pb-8">

          {/* Empty state — only phone contacts empty */}
          {contacts.length === 0 && !instagramConnected && !facebookConnected && (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <Users className="w-7 h-7 text-muted-foreground" />
              <p className="text-sm text-muted-foreground text-center leading-relaxed">
                Импортируй контакты с телефона<br />или подключи соцсети ниже
              </p>
            </div>
          )}

          {/* Phone contacts */}
          {filteredPhone.length > 0 && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">From Phone</p>
              <div className="space-y-2">
                {filteredPhone.map(c => (
                  <PhoneContactRow key={c.id} contact={c} onToggle={togglePhonePending} />
                ))}
              </div>
            </div>
          )}

          {/* Instagram contacts */}
          {openSections.has('instagram') && filteredIG.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#E1306C' }}>Instagram · {filteredIG.length} найдено</p>
              {filteredIG.map(c => (
                <SocialContactRow key={c.id} contact={c} onToggle={toggleSocialPending} onSelect={setSelectedContact} platformColor="#E1306C" />
              ))}
            </div>
          )}

          {/* Facebook contacts */}
          {openSections.has('facebook') && filteredFB.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1877F2' }}>Facebook · {filteredFB.length} найдено</p>
              {filteredFB.map(c => (
                <SocialContactRow key={c.id} contact={c} onToggle={toggleSocialPending} onSelect={setSelectedContact} platformColor="#1877F2" />
              ))}
            </div>
          )}

          {search && filteredPhone.length === 0 && filteredIG.length === 0 && filteredFB.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-10">No results for "{search}"</p>
          )}
        </div>
      </div>
    </div>

    {/* ── Profile card ── */}
    {selectedContact && (() => {
      const networkPerson = people.find(p => p.name === selectedContact.name);
      if (networkPerson) {
        return (
          <PersonCard
            person={networkPerson}
            isConnected={networkConnected.has(networkPerson.id)}
            onToggleConnect={id => setNetworkConnected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; })}
            onClose={() => setSelectedContact(null)}
            zIndex={60}
          />
        );
      }
      // No Sagi profile — invite card
      const platformColor = selectedContact.source === 'instagram' ? '#E1306C' : '#1877F2';
      return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center" onClick={() => setSelectedContact(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-card rounded-t-3xl p-6 pb-10 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <button onClick={() => setSelectedContact(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: selectedContact.color + '20', border: `2px solid ${selectedContact.color}`, color: selectedContact.color }}>
                {selectedContact.initials}
              </div>
              <div>
                <div className="font-bold text-base">{selectedContact.name}</div>
                <div className="flex items-center gap-1.5 mt-1">
                  <span style={{ color: platformColor }}>{selectedContact.source === 'instagram' ? <InstagramIcon /> : <FacebookIcon />}</span>
                  <span className="text-xs text-muted-foreground">{selectedContact.username}</span>
                </div>
              </div>
            </div>
            {selectedContact.mutualCount > 0 && (
              <div className="rounded-2xl px-4 py-3 mb-5" style={{ background: platformColor + '12' }}>
                <p className="text-xs font-semibold mb-0.5" style={{ color: platformColor }}>{selectedContact.mutualCount} общих подписок</p>
                <p className="text-xs text-muted-foreground">Вы оба подписаны на: <span className="text-foreground font-medium">{selectedContact.mutualNames.join(', ')}</span></p>
              </div>
            )}
            <div className="bg-muted/40 rounded-2xl p-4 mb-5 text-center">
              <div className="text-2xl mb-2">👤</div>
              <p className="text-sm font-medium mb-1">Нет профиля в Sagi</p>
              <p className="text-xs text-muted-foreground">{selectedContact.name} ещё не зарегистрирован(а). Пригласи его/её!</p>
            </div>
            <a
              href={selectedContact.source === 'instagram'
                ? `https://instagram.com/${selectedContact.username.replace('@', '')}`
                : `https://facebook.com/${selectedContact.username}`}
              target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-sm font-semibold mb-3"
              style={{ background: selectedContact.source === 'instagram' ? 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)' : '#1877F2' }}
            >
              {selectedContact.source === 'instagram' ? <InstagramIcon /> : <FacebookIcon />}
              Написать в {selectedContact.source === 'instagram' ? 'Instagram' : 'Facebook'}
            </a>
            <button
              onClick={() => { navigator.clipboard.writeText('Привет! Присоединяйся к Sagi. sagibonus.com'); setSelectedContact(null); }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
              style={{ background: '#10b981' }}
            >
              Пригласить в Sagi Community
            </button>
          </div>
        </div>
      );
    })()}
    </>
  );
}

function PhoneContactRow({ contact, onToggle }: { contact: PhoneContact; onToggle: (id: string) => void }) {
  const color = nameColor(contact.name);
  const initials = getInitials(contact.name);
  return (
    <div className="flex items-center gap-3 bg-input-background rounded-2xl px-3 py-3">
      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0" style={{ background: color }}>
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{contact.name}</p>
        <p className="text-xs text-muted-foreground truncate">{contact.phone ?? contact.email ?? 'No details'}</p>
      </div>
      <button
        onClick={() => onToggle(contact.id)}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
        style={contact.pending
          ? { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
          : { background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
        }
      >
        {contact.pending ? <><Clock className="w-3.5 h-3.5" /> Pending</> : <><UserPlus className="w-3.5 h-3.5" /> Connect</>}
      </button>
    </div>
  );
}

function SocialContactRow({ contact, onToggle, onSelect, platformColor }: {
  contact: SocialContact;
  onToggle: (id: string) => void;
  onSelect: (c: SocialContact) => void;
  platformColor: string;
}) {
  return (
    <div className="flex items-start gap-3 bg-input-background rounded-2xl px-3 py-3">
      <button
        onClick={() => onSelect(contact)}
        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 mt-0.5 active:opacity-75"
        style={{ background: contact.color }}
      >
        {contact.initials}
      </button>
      <button onClick={() => onSelect(contact)} className="flex-1 min-w-0 text-left">
        <p className="text-sm font-medium truncate">{contact.name}</p>
        <p className="text-xs text-muted-foreground truncate">{contact.username}</p>
        {contact.mutualCount > 0 && (
          <div className="flex items-center gap-1 mt-1">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ background: platformColor + '15', color: platformColor }}
            >
              {contact.mutualCount} общих · {contact.mutualNames.slice(0, 2).join(', ')}{contact.mutualNames.length > 2 ? ` +${contact.mutualNames.length - 2}` : ''}
            </span>
          </div>
        )}
      </button>
      <button
        onClick={() => onToggle(contact.id)}
        className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all mt-0.5"
        style={contact.pending
          ? { background: 'rgba(245,158,11,0.12)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
          : { background: 'rgba(16,185,129,0.08)', color: '#10b981', border: '1px solid rgba(16,185,129,0.3)' }
        }
      >
        {contact.pending ? <><Clock className="w-3.5 h-3.5" /> Pending</> : <><UserPlus className="w-3.5 h-3.5" /> Connect</>}
      </button>
    </div>
  );
}
