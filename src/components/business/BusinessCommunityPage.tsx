import { useState } from 'react';
import { ChevronLeft, ShoppingBag, Calendar, Briefcase, Newspaper, Plus, MoreHorizontal, Pencil, Trash2, ToggleLeft, ToggleRight, X, Check, Settings, Star, Repeat2, Zap, Gift } from 'lucide-react';
import { Link } from 'react-router';
import { BusinessLogo } from '../BusinessLogo';
import { useLanguage } from '../../context/LanguageContext';

type Tab = 'offers' | 'events' | 'vacancies' | 'news' | 'bonuses' | 'cross';

interface Modules {
  bonuses: boolean;
  cross: boolean;
}

interface BizOffer {
  id: number;
  title: string;
  type: 'restaurant' | 'cafe' | 'spa' | 'retail' | 'hotel' | 'fitness';
  active: boolean;
  expiry: string;
  redemptions: number;
  exclusive: boolean;
}

interface BizEvent {
  id: number;
  title: string;
  date: string;
  location: string;
}

interface BizVacancy {
  id: number;
  title: string;
  type: string;
}

interface BizNews {
  id: number;
  text: string;
  time: string;
}

const HANI_GRADIENT = 'linear-gradient(135deg, #F5C400 0%, #E6A800 50%, #CC8F00 100%)';

const CROSS_BONUSES = [
  { id: 1, name: 'Chez Georges',  category: 'Ресторан',    bonus: '3%', color: '#CC8F00', photo: '/chez-georges.jpeg' },
  { id: 2, name: 'Rafe Beauty',   category: 'Спа',         bonus: '5%', color: '#E040FB', photo: '/rafe-beauty.jpeg' },
  { id: 3, name: 'Ana Flowers',   category: 'Ретейл',      bonus: '2%', color: '#FF6D00', photo: '/ana-flowers.jpeg' },
  { id: 4, name: 'Master Coffee', category: 'Кофейня',     bonus: '4%', color: '#00BCD4', photo: '/master-coffee.jpeg' },
  { id: 5, name: 'Bronx Fitness', category: 'Фитнес',      bonus: '3%', color: '#43A047', photo: '/bronx-fitness.jpeg' },
  { id: 6, name: 'AIFC Academy',  category: 'Образование', bonus: '2%', color: '#F4511E', photo: '/aifc-academy.jpeg' },
];

export function BusinessCommunityPage() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<Tab>('offers');
  const [menuOpenId, setMenuOpenId] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [modules, setModules] = useState<Modules>({ bonuses: false, cross: false });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [showAddOffer, setShowAddOffer] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddVacancy, setShowAddVacancy] = useState(false);
  const [showAddNews, setShowAddNews] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSub, setNewSub] = useState('');
  const [newNewsText, setNewNewsText] = useState('');

  const [offers, setOffers] = useState<BizOffer[]>([
    { id: 1, title: t('discountAllMeals'), type: 'restaurant', active: true, expiry: 'Apr 30, 2026', redemptions: 48, exclusive: false },
    { id: 2, title: t('freeCoffeeWithPastry'), type: 'cafe', active: true, expiry: 'May 15, 2026', redemptions: 23, exclusive: true },
    { id: 3, title: t('buy2Get1'), type: 'retail', active: false, expiry: 'Mar 31, 2026', redemptions: 11, exclusive: false },
  ]);

  const [events, setEvents] = useState<BizEvent[]>([
    { id: 1, title: 'AIFC Morning Coffee', date: 'Thu, Apr 17 · 09:00', location: 'Master Coffee, AIFC Tower' },
    { id: 2, title: 'Networking Business Lunch', date: 'Sat, Apr 19 · 12:30', location: 'Chez Georges' },
  ]);

  const [vacancies, setVacancies] = useState<BizVacancy[]>([
    { id: 1, title: 'Financial Analyst', type: 'Full-time' },
    { id: 2, title: 'Marketing Manager', type: 'Contract' },
  ]);

  const [newsPosts, setNewsPosts] = useState<BizNews[]>([
    { id: 1, text: 'New parking passes are available at reception. Please collect before Friday.', time: '2h ago' },
    { id: 2, text: 'The Q2 Networking Breakfast is confirmed for April 17th.', time: '5h ago' },
  ]);

  const baseTabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
    { key: 'offers',    label: t('offers'),      icon: ShoppingBag },
    { key: 'events',    label: 'Events',         icon: Calendar },
    { key: 'vacancies', label: 'Vacancies',      icon: Briefcase },
    { key: 'news',      label: 'News',           icon: Newspaper },
  ];
  const tabs = [
    ...baseTabs,
    ...(modules.bonuses ? [{ key: 'bonuses' as Tab, label: 'Бонусы',       icon: Star }]   : []),
    ...(modules.cross   ? [{ key: 'cross'   as Tab, label: 'Кросс бонусы', icon: Repeat2 }] : []),
  ];

  const toggleModule = (key: keyof Modules) => {
    setModules(prev => {
      const next = { ...prev, [key]: !prev[key] };
      if (!next[key] && tab === key) setTab('offers');
      return next;
    });
  };

  const toggleMenu = (id: number) => setMenuOpenId(prev => prev === id ? null : id);

  /* ---- Offers ---- */
  const toggleOfferActive = (id: number) =>
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o));
  const deleteOffer = (id: number) => setOffers(prev => prev.filter(o => o.id !== id));
  const addOffer = () => {
    if (!newTitle.trim()) return;
    setOffers(prev => [...prev, { id: Date.now(), title: newTitle.trim(), type: 'restaurant', active: true, expiry: 'Dec 31, 2026', redemptions: 0, exclusive: false }]);
    setNewTitle(''); setNewSub(''); setShowAddOffer(false);
  };

  /* ---- Events ---- */
  const deleteEvent = (id: number) => setEvents(prev => prev.filter(e => e.id !== id));
  const startEditEvent = (ev: BizEvent) => { setEditingId(ev.id); setEditText(ev.title); setMenuOpenId(null); };
  const saveEditEvent = (id: number) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, title: editText } : e));
    setEditingId(null);
  };
  const addEvent = () => {
    if (!newTitle.trim()) return;
    setEvents(prev => [...prev, { id: Date.now(), title: newTitle.trim(), date: newSub.trim() || 'TBD', location: 'AIFC' }]);
    setNewTitle(''); setNewSub(''); setShowAddEvent(false);
  };

  /* ---- Vacancies ---- */
  const deleteVacancy = (id: number) => setVacancies(prev => prev.filter(v => v.id !== id));
  const startEditVacancy = (v: BizVacancy) => { setEditingId(v.id); setEditText(v.title); setMenuOpenId(null); };
  const saveEditVacancy = (id: number) => {
    setVacancies(prev => prev.map(v => v.id === id ? { ...v, title: editText } : v));
    setEditingId(null);
  };
  const addVacancy = () => {
    if (!newTitle.trim()) return;
    setVacancies(prev => [...prev, { id: Date.now(), title: newTitle.trim(), type: newSub.trim() || 'Full-time' }]);
    setNewTitle(''); setNewSub(''); setShowAddVacancy(false);
  };

  /* ---- News ---- */
  const deleteNews = (id: number) => setNewsPosts(prev => prev.filter(n => n.id !== id));
  const startEditNews = (n: BizNews) => { setEditingId(n.id); setEditText(n.text); setMenuOpenId(null); };
  const saveEditNews = (id: number) => {
    setNewsPosts(prev => prev.map(n => n.id === id ? { ...n, text: editText } : n));
    setEditingId(null);
  };
  const addNews = () => {
    if (!newNewsText.trim()) return;
    setNewsPosts(prev => [{ id: Date.now(), text: newNewsText.trim(), time: 'Just now' }, ...prev]);
    setNewNewsText(''); setShowAddNews(false);
  };

  return (
    <div className="min-h-screen bg-background pb-20" onClick={() => { if (menuOpenId !== null) setMenuOpenId(null); }}>

      {/* Header */}
      <div className="bg-gradient-to-b from-[#071c12] to-[#0d3d26] px-4 pt-4 pb-5">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Link to="/business" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setShowSettings(true)}
              className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center mb-2 shadow-lg p-2">
              <svg viewBox="0 0 64 64" className="w-full h-full">
                <path d="M32 6 A26 26 0 1 0 32 58 A26 26 0 0 0 56 38" fill="none" stroke="#008080" strokeWidth="7" strokeLinecap="round" />
                <path d="M32 16 A16 16 0 1 0 32 48 A16 16 0 0 0 46 40" fill="none" stroke="#008080" strokeWidth="5" strokeLinecap="round" />
                <circle cx="32" cy="32" r="4.5" fill="#111" />
              </svg>
            </div>
            <h1 className="text-white font-bold text-lg">AIFC</h1>
            <p className="text-white/60 text-xs mt-0.5">570 {t('members')} · 42 {t('businesses')}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-md mx-auto px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">{t('aifcDescription')}</p>
      </div>

      {/* Tab switcher */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4">
          <div className="flex gap-0 overflow-x-auto scrollbar-hide">
            {tabs.map((tb) => (
              <button
                key={tb.key}
                onClick={() => setTab(tb.key)}
                className={`flex items-center gap-1.5 px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors flex-shrink-0 ${
                  tab === tb.key ? 'border-[#10b981] text-[#10b981]' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <tb.icon className="w-3.5 h-3.5" />
                {tb.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">

        {/* OFFERS TAB */}
        {tab === 'offers' && (
          <>
            <div className="space-y-3">
              {offers.map((offer) => (
                <div key={offer.id} className="bg-card border border-border rounded-2xl p-4 relative">
                  <div className="flex gap-3">
                    <BusinessLogo name={offer.title} type={offer.type} size="lg" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-sm font-semibold truncate pr-6">{offer.title}</h3>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => toggleOfferActive(offer.id)}
                          className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full transition-colors ${offer.active ? 'bg-[#10b981]/10 text-[#10b981]' : 'bg-input-background text-muted-foreground'}`}
                        >
                          {offer.active ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {offer.active ? t('active') : t('offersPaused')}
                        </button>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>{t('validUntil')} {offer.expiry}</span>
                        <span>{offer.redemptions} {t('redemptionsCount')}</span>
                      </div>
                    </div>
                  </div>

                  {/* ⋯ menu */}
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(offer.id)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-input-background transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpenId === offer.id && (
                      <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden">
                        <button
                          onClick={() => { toggleOfferActive(offer.id); setMenuOpenId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-input-background transition-colors"
                        >
                          {offer.active ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4 text-[#10b981]" />}
                          {offer.active ? 'Pause' : 'Activate'}
                        </button>
                        <div className="border-t border-border" />
                        <button
                          onClick={() => { deleteOffer(offer.id); setMenuOpenId(null); }}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Offer */}
            {showAddOffer ? (
              <div className="mt-3 bg-card border border-[#10b981]/40 rounded-2xl p-4">
                <input
                  autoFocus
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Offer title..."
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={addOffer} className="flex-1 py-2 bg-[#10b981] text-white rounded-xl text-sm font-medium">Add</button>
                  <button onClick={() => { setShowAddOffer(false); setNewTitle(''); }} className="px-4 py-2 bg-input-background rounded-xl text-sm text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddOffer(true)}
                className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#10b981]/40 rounded-2xl text-sm text-[#10b981] hover:border-[#10b981] hover:bg-[#10b981]/5 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Offer
              </button>
            )}
          </>
        )}

        {/* EVENTS TAB */}
        {tab === 'events' && (
          <>
            <div className="space-y-3">
              {events.map((ev) => (
                <div key={ev.id} className="bg-card border border-border rounded-2xl p-4 relative">
                  <div className="flex gap-3 pr-8">
                    <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      {editingId === ev.id ? (
                        <div className="flex gap-2">
                          <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 px-2 py-1 bg-input-background border border-[#10b981] rounded-lg text-sm focus:outline-none" />
                          <button onClick={() => saveEditEvent(ev.id)} className="w-7 h-7 rounded-lg bg-[#10b981] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></button>
                          <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-input-background flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                        </div>
                      ) : (
                        <p className="font-medium text-sm mb-0.5">{ev.title}</p>
                      )}
                      <p className="text-xs text-muted-foreground">{ev.date}</p>
                      <p className="text-xs text-muted-foreground">{ev.location}</p>
                    </div>
                  </div>
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(ev.id)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-input-background transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpenId === ev.id && (
                      <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden">
                        <button onClick={() => startEditEvent(ev)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-input-background">
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <div className="border-t border-border" />
                        <button onClick={() => { deleteEvent(ev.id); setMenuOpenId(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showAddEvent ? (
              <div className="mt-3 bg-card border border-[#10b981]/40 rounded-2xl p-4">
                <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Event title..." className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none mb-2" />
                <input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="Date & time..." className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none mb-2" />
                <div className="flex gap-2">
                  <button onClick={addEvent} className="flex-1 py-2 bg-[#10b981] text-white rounded-xl text-sm font-medium">Add</button>
                  <button onClick={() => { setShowAddEvent(false); setNewTitle(''); setNewSub(''); }} className="px-4 py-2 bg-input-background rounded-xl text-sm text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddEvent(true)} className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#10b981]/40 rounded-2xl text-sm text-[#10b981] hover:border-[#10b981] hover:bg-[#10b981]/5 transition-colors">
                <Plus className="w-4 h-4" /> Add Event
              </button>
            )}
          </>
        )}

        {/* VACANCIES TAB */}
        {tab === 'vacancies' && (
          <>
            <div className="space-y-3">
              {vacancies.map((v) => (
                <div key={v.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3 relative">
                  <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                    <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    {editingId === v.id ? (
                      <div className="flex gap-2">
                        <input autoFocus value={editText} onChange={(e) => setEditText(e.target.value)} className="flex-1 px-2 py-1 bg-input-background border border-[#10b981] rounded-lg text-sm focus:outline-none" />
                        <button onClick={() => saveEditVacancy(v.id)} className="w-7 h-7 rounded-lg bg-[#10b981] flex items-center justify-center"><Check className="w-3.5 h-3.5 text-white" /></button>
                        <button onClick={() => setEditingId(null)} className="w-7 h-7 rounded-lg bg-input-background flex items-center justify-center"><X className="w-3.5 h-3.5 text-muted-foreground" /></button>
                      </div>
                    ) : (
                      <p className="font-medium text-sm">{v.title}</p>
                    )}
                    <span className="text-xs px-2 py-0.5 bg-input-background text-muted-foreground rounded-full">{v.type}</span>
                  </div>
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(v.id)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-input-background transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpenId === v.id && (
                      <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden">
                        <button onClick={() => startEditVacancy(v)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-input-background">
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <div className="border-t border-border" />
                        <button onClick={() => { deleteVacancy(v.id); setMenuOpenId(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {showAddVacancy ? (
              <div className="mt-3 bg-card border border-[#10b981]/40 rounded-2xl p-4">
                <input autoFocus value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Job title..." className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none mb-2" />
                <input value={newSub} onChange={(e) => setNewSub(e.target.value)} placeholder="Type (Full-time, Part-time...)" className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none mb-2" />
                <div className="flex gap-2">
                  <button onClick={addVacancy} className="flex-1 py-2 bg-[#10b981] text-white rounded-xl text-sm font-medium">Add</button>
                  <button onClick={() => { setShowAddVacancy(false); setNewTitle(''); setNewSub(''); }} className="px-4 py-2 bg-input-background rounded-xl text-sm text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddVacancy(true)} className="mt-3 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#10b981]/40 rounded-2xl text-sm text-[#10b981] hover:border-[#10b981] hover:bg-[#10b981]/5 transition-colors">
                <Plus className="w-4 h-4" /> Add Vacancy
              </button>
            )}
          </>
        )}

        {/* NEWS TAB */}
        {tab === 'news' && (
          <>
            {/* Post news input */}
            {showAddNews ? (
              <div className="mb-3 bg-card border border-[#10b981]/40 rounded-2xl p-4">
                <textarea
                  autoFocus
                  value={newNewsText}
                  onChange={(e) => setNewNewsText(e.target.value)}
                  placeholder="Write a post..."
                  rows={3}
                  className="w-full px-3 py-2 bg-input-background border border-border rounded-xl text-sm focus:border-[#10b981] focus:outline-none resize-none mb-2"
                />
                <div className="flex gap-2">
                  <button onClick={addNews} className="flex-1 py-2 bg-[#10b981] text-white rounded-xl text-sm font-medium">Post</button>
                  <button onClick={() => { setShowAddNews(false); setNewNewsText(''); }} className="px-4 py-2 bg-input-background rounded-xl text-sm text-muted-foreground">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddNews(true)} className="mb-3 w-full flex items-center justify-center gap-2 py-3 border border-dashed border-[#10b981]/40 rounded-2xl text-sm text-[#10b981] hover:border-[#10b981] hover:bg-[#10b981]/5 transition-colors">
                <Plus className="w-4 h-4" /> Post News
              </button>
            )}

            <div className="space-y-3">
              {newsPosts.map((post) => (
                <div key={post.id} className="bg-card border border-border rounded-2xl p-4 relative">
                  <div className="flex items-center justify-between mb-2 pr-8">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-[#10b981]">LB</span>
                      </div>
                      <p className="text-xs font-semibold">Local Bistro</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{post.time}</p>
                  </div>
                  {editingId === post.id ? (
                    <div>
                      <textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={2} className="w-full px-2 py-1.5 bg-input-background border border-[#10b981] rounded-lg text-sm focus:outline-none resize-none mb-2" />
                      <div className="flex gap-2">
                        <button onClick={() => saveEditNews(post.id)} className="flex-1 py-1.5 bg-[#10b981] text-white rounded-lg text-xs font-medium">Save</button>
                        <button onClick={() => setEditingId(null)} className="px-3 py-1.5 bg-input-background rounded-lg text-xs text-muted-foreground">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground leading-relaxed">{post.text}</p>
                  )}
                  <div className="absolute top-3 right-3" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => toggleMenu(post.id)} className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-input-background transition-colors">
                      <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                    </button>
                    {menuOpenId === post.id && (
                      <div className="absolute right-0 top-8 bg-card border border-border rounded-xl shadow-lg z-20 min-w-[130px] overflow-hidden">
                        <button onClick={() => startEditNews(post)} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-input-background">
                          <Pencil className="w-4 h-4" /> Edit
                        </button>
                        <div className="border-t border-border" />
                        <button onClick={() => { deleteNews(post.id); setMenuOpenId(null); }} className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-red-500/10">
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* BONUSES TAB */}
        {tab === 'bonuses' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star size={15} className="text-yellow-500" fill="currentColor" />
                  <span className="text-sm font-bold">Уровень участника: Silver</span>
                </div>
                <span className="text-xs text-muted-foreground">760 / 2000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full" style={{ width: '38%', background: HANI_GRADIENT }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Ещё 1 240 бонусов до уровня Gold</p>
            </div>

            <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: HANI_GRADIENT, color: '#1A1500' }}>
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-black/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-black">hani</span>
                </div>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-5xl font-black tracking-tight">1 240</span>
                  <span className="text-lg font-semibold opacity-60 mb-1">бонусов</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="bg-black/10 rounded-lg px-2.5 py-1 text-xs font-bold">5% кэшбэк</div>
                  <div className="bg-black/10 rounded-lg px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                    <Zap size={10} />Активен
                  </div>
                </div>
              </div>
              <div className="absolute right-5 bottom-4 text-5xl opacity-80 select-none">🐙</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[{ label: 'Заработано', value: '3 200' }, { label: 'Потрачено', value: '1 960' }, { label: 'Истекает', value: '15 мая' }].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
                  <div className="text-base font-black">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CROSS TAB */}
        {tab === 'cross' && (
          <>
            <div className="rounded-2xl bg-card border border-border p-4 flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <Gift size={16} className="text-yellow-600" />
              </div>
              <div>
                <div className="text-sm font-bold mb-0.5">Кросс-бонусы партнёров</div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Бонусы, которые участники получают при оплате у партнёров сообщества.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {CROSS_BONUSES.map(b => (
                <div key={b.id} className="rounded-2xl overflow-hidden flex flex-col bg-card border border-border">
                  <div className="w-full aspect-square overflow-hidden">
                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-center">
                    <div className="text-[11px] font-bold leading-tight">{b.name}</div>
                    <div className="text-sm font-black mt-0.5" style={{ color: b.color }}>+{b.bonus}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>

      {/* ─── SETTINGS MODAL ─── */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end items-center"
          style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)' }}
          onClick={() => setShowSettings(false)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 rounded-full bg-border mx-auto mb-5" />
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold">Модули сообщества</h2>
              <button onClick={() => setShowSettings(false)} className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-3">
              {([
                { key: 'bonuses' as keyof Modules, label: 'Бонусы участника', desc: 'Показывает бонусную карту и уровень', icon: Star },
                { key: 'cross'   as keyof Modules, label: 'Кросс бонусы',     desc: 'Показывает бонусы партнёров',        icon: Repeat2 },
              ] as const).map(m => (
                <div key={m.key} className="flex items-center justify-between bg-input-background rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-card flex items-center justify-center">
                      <m.icon className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{m.label}</div>
                      <div className="text-xs text-muted-foreground">{m.desc}</div>
                    </div>
                  </div>
                  <button onClick={() => toggleModule(m.key)}>
                    {modules[m.key]
                      ? <ToggleRight className="w-8 h-8 text-[#10b981]" />
                      : <ToggleLeft  className="w-8 h-8 text-muted-foreground" />
                    }
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
