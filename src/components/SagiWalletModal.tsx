import { useState, useEffect } from 'react';
import { X, CheckCircle2, ChevronDown, Users } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { SagiPlusModal } from './SagiPlusModal';

const PARTNER_OFFERS = [
  { id: 1,  business: 'Brew Society',      deal: '1+1 Offer',              descriptor: 'On all Specialty Coffees',        category: 'Food & Drink', type: 'food',      saved: 45  },
  { id: 2,  business: 'Le Bistro',         deal: "Second one's on us",     descriptor: 'On all Main Courses',             category: 'Food & Drink', type: 'food',      saved: 120 },
  { id: 3,  business: 'Skyline Hotel',     deal: 'Complimentary Upgrade',  descriptor: 'On Standard Room Bookings',       category: 'Hotel',        type: 'hotel',     saved: 280 },
  { id: 4,  business: 'Iron Grid Gym',     deal: 'Double the Value',       descriptor: 'On Monthly Memberships',          category: 'Fitness',      type: 'fitness',   saved: 90  },
  { id: 5,  business: 'Aura Beauty',       deal: '1+1 Offer',              descriptor: 'On all Spa Treatments',           category: 'Wellness',     type: 'wellness',  saved: 150 },
  { id: 6,  business: 'Vertex Academy',    deal: 'Complimentary Upgrade',  descriptor: 'On Executive Courses',            category: 'Education',    type: 'education', saved: 200 },
  { id: 7,  business: 'Sakura Kitchen',    deal: "Second one's on us",     descriptor: 'On Signature Sushi Sets',         category: 'Food & Drink', type: 'food',      saved: 85  },
  { id: 8,  business: 'Eagle Golf Studio', deal: 'Double the Value',       descriptor: 'On All Golf Lessons',             category: 'Fitness',      type: 'fitness',   saved: 160 },
  { id: 9,  business: 'Daily Grind',       deal: '1+1 Offer',              descriptor: 'On Weekend Brunch Menu',          category: 'Food & Drink', type: 'food',      saved: 55  },
  { id: 10, business: 'SkyLink Airways',   deal: 'Complimentary Upgrade',  descriptor: 'On Business Class Bookings',      category: 'Travel',       type: 'travel',    saved: 350 },
  { id: 11, business: 'Rooftop Café',      deal: "Second one's on us",     descriptor: 'On Evening Cocktails',            category: 'Food & Drink', type: 'food',      saved: 65  },
  { id: 12, business: 'Grand Vega Hotel',  deal: 'Complimentary Upgrade',  descriptor: 'On Luxury Suite Stays',           category: 'Hotel',        type: 'hotel',     saved: 420 },
  { id: 13, business: 'Noma Grill',        deal: 'Double the Value',       descriptor: 'On Premium Steaks & Grills',      category: 'Food & Drink', type: 'food',      saved: 95  },
  { id: 14, business: 'Kinetic Club',      deal: '1+1 Offer',              descriptor: 'On Personal Training Sessions',   category: 'Fitness',      type: 'fitness',   saved: 110 },
  { id: 15, business: 'WanderKZ',          deal: 'Double the Value',       descriptor: 'On Weekend Tour Packages',        category: 'Travel',       type: 'travel',    saved: 180 },
  { id: 16, business: 'Meridian Hotel',    deal: "Second one's on us",     descriptor: 'On In-Hotel Dining',              category: 'Hotel',        type: 'hotel',     saved: 230 },
  { id: 17, business: 'SmileCare Clinic',  deal: '1+1 Offer',              descriptor: 'On Dental Consultations',         category: 'Wellness',     type: 'wellness',  saved: 80  },
  { id: 18, business: 'Atlas Bar',         deal: "Second one's on us",     descriptor: 'On Signature Cocktails',          category: 'Food & Drink', type: 'food',      saved: 60  },
  { id: 19, business: 'The Loft',          deal: 'Double the Value',       descriptor: 'On Friday Night Dinners',         category: 'Food & Drink', type: 'food',      saved: 70  },
  { id: 20, business: 'Horizon Travel',    deal: 'Complimentary Upgrade',  descriptor: 'On International Tour Packages',  category: 'Travel',       type: 'travel',    saved: 290 },
  { id: 21, business: 'Olivia Bistro',     deal: '1+1 Offer',              descriptor: 'On Set Lunch Menu',               category: 'Food & Drink', type: 'food',      saved: 50  },
  { id: 22, business: 'Lotus Medical',     deal: 'Complimentary Upgrade',  descriptor: 'On Annual Health Screenings',     category: 'Wellness',     type: 'wellness',  saved: 175 },
  { id: 23, business: 'La Piazza',         deal: "Second one's on us",     descriptor: 'On Wood-Fired Pizzas',            category: 'Food & Drink', type: 'food',      saved: 55  },
  { id: 24, business: 'Nova University',   deal: 'Double the Value',       descriptor: 'On Short Professional Courses',   category: 'Education',    type: 'education', saved: 320 },
];

const SAVINGS_BY_PERIOD: Record<string, number> = {
  month: 240,
  year:  1450,
  all:   3280,
};

const COMMUNITY_OFFERS = [
  { id: 301, business: 'Brew Society',       deal: 'Member Discount',   dealDetail: '15% off all orders',              descriptor: 'Show your Vertex Club card at checkout', category: 'Food & Drink', type: 'food'      },
  { id: 302, business: 'Le Bistro',          deal: 'Exclusive Rate',    dealDetail: "Members' lunch from $18",         descriptor: 'Available Mon–Fri, 12:00–15:00',         category: 'Food & Drink', type: 'food'      },
  { id: 303, business: 'Skyline Hotel',      deal: 'Priority Access',   dealDetail: 'Early check-in from 10am',        descriptor: 'Subject to availability',                category: 'Hotel',        type: 'hotel'     },
  { id: 304, business: 'Grand Vega Hotel',   deal: 'Member Discount',   dealDetail: '20% off best available rate',     descriptor: 'Vertex Club exclusive pricing',          category: 'Hotel',        type: 'hotel'     },
  { id: 305, business: 'Iron Grid Gym',      deal: 'Corporate Rate',    dealDetail: '$49/month membership',            descriptor: 'Save $30 vs standard pricing',           category: 'Fitness',      type: 'fitness'   },
  { id: 306, business: 'Vertex Academy',     deal: 'Member Discount',   dealDetail: '25% off all programs',            descriptor: 'Exclusive to Vertex Club members',       category: 'Education',    type: 'education' },
  { id: 307, business: 'Aura Beauty',        deal: 'Welcome Gift',      dealDetail: 'Free consultation on 1st visit',  descriptor: 'For new Vertex Club members',            category: 'Wellness',     type: 'wellness'  },
  { id: 308, business: 'Eagle Golf Studio',  deal: 'Member Discount',   dealDetail: '30% off lessons & court hire',   descriptor: 'Weekday bookings via Vertex app',        category: 'Fitness',      type: 'fitness'   },
  { id: 309, business: 'Daily Grind',        deal: 'Exclusive Rate',    dealDetail: 'Free pastry with any coffee',     descriptor: 'Every visit, no limit',                  category: 'Food & Drink', type: 'food'      },
  { id: 310, business: 'SkyLink Airways',    deal: 'Priority Boarding', dealDetail: 'Fast-track check-in',             descriptor: 'On all Vertex member bookings',          category: 'Travel',       type: 'travel'    },
  { id: 311, business: 'Noma Grill',         deal: 'Member Discount',   dealDetail: '10% off à la carte menu',        descriptor: 'Dinner only, Tue–Sun',                   category: 'Food & Drink', type: 'food'      },
  { id: 312, business: 'SmileCare Clinic',   deal: 'Exclusive Rate',    dealDetail: 'Free initial consultation',       descriptor: 'Book via Vertex Club portal',            category: 'Wellness',     type: 'wellness'  },
];

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

const CAT_TABS = [
  { id: 'all',       label: 'All'       },
  { id: 'food',      label: 'Food'      },
  { id: 'hotel',     label: 'Hotel'     },
  { id: 'fitness',   label: 'Fitness'   },
  { id: 'wellness',  label: 'Wellness'  },
  { id: 'education', label: 'Education' },
  { id: 'travel',    label: 'Travel'    },
];

const DEAL_STYLE: Record<string, { bg: string; text: string }> = {
  '1+1 Offer':             { bg: 'rgba(16,185,129,0.14)',  text: '#10b981' },
  "Second one's on us":    { bg: 'rgba(139,92,246,0.14)',  text: '#a78bfa' },
  'Double the Value':      { bg: 'rgba(245,158,11,0.14)',  text: '#fbbf24' },
  'Complimentary Upgrade': { bg: 'rgba(59,130,246,0.14)',  text: '#60a5fa' },
};

const MY_COMMUNITIES = [
  {
    id: 'vertex', name: 'Vertex Club', sub: 'Member exclusive offers',
    bg: 'linear-gradient(135deg,#071c12,#0d3d26)',
    icon: (
      <svg viewBox="0 0 64 64" className="w-5 h-5">
        <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="#00695C" strokeWidth="3.5"/>
        <polyline points="18,22 32,44 46,22" fill="none" stroke="#00695C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    id: 'highvill', name: 'Highvill Isim', sub: 'Resident exclusive offers',
    bg: 'linear-gradient(135deg,#0a1628,#1a3a5c)',
    icon: <img src="/english-quarter.jpeg" alt="" className="w-full h-full object-cover" />,
  },
];

export function SagiWalletModal() {
  const { isOpen, defaultTab, closeWallet, activePlan } = useWallet();

  const [walletTab, setWalletTab] = useState<'package' | 'community'>(defaultTab);
  const [showSagiPlus, setShowSagiPlus] = useState(false);
  const [showCommunityPicker, setShowCommunityPicker] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<string>('all');
  const [offerCategory, setOfferCategory] = useState('all');
  const [savingsPeriod, setSavingsPeriod] = useState<'month' | 'year' | 'all'>('year');
  const [usedOffers, setUsedOffers] = useState<Set<number>>(new Set());
  const [redeemOffer, setRedeemOffer] = useState<typeof PARTNER_OFFERS[0] | null>(null);
  const [showMemberQR, setShowMemberQR] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setWalletTab(defaultTab);
      setOfferCategory('all');
    }
  }, [isOpen, defaultTab]);

  if (!isOpen) return null;

  const handleClose = () => {
    closeWallet();
    setOfferCategory('all');
  };

  const usedSavings = Array.from(usedOffers).reduce((sum, id) => {
    const o = PARTNER_OFFERS.find(p => p.id === id);
    return sum + (o?.saved ?? 0);
  }, 0);
  const totalSavings = SAVINGS_BY_PERIOD[savingsPeriod] + usedSavings;

  const activeCommunity = MY_COMMUNITIES.find(c => c.id === selectedCommunity);
  const communityFiltered = COMMUNITY_OFFERS.filter(o => offerCategory === 'all' || o.type === offerCategory);

  return (
    <>
      {/* Sagi Wallet bottom sheet */}
      <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={handleClose}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div
          className="relative bg-card rounded-t-3xl w-full max-w-md flex flex-col"
          style={{ maxHeight: '92vh' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-0 shrink-0">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Header */}
          <div className="shrink-0 px-5 pt-3 pb-0">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-base tracking-tight">Sagi Wallet</h2>
                <button onClick={() => setShowSagiPlus(true)} className="w-6 h-6 rounded-full bg-[#10b981] flex items-center justify-center">
                  <span className="text-white text-sm font-bold leading-none">+</span>
                </button>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 p-1 bg-input-background rounded-2xl mb-4">
              <button
                onClick={() => setWalletTab('package')}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${walletTab === 'package' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Sagi+
              </button>
              <button
                onClick={() => setWalletTab('community')}
                className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${walletTab === 'community' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`}
              >
                Community Offers
              </button>
            </div>
          </div>

          {/* SAGI+ TAB */}
          {walletTab === 'package' && (
            <div className="overflow-y-auto flex-1 px-5 pb-8">

              {/* Active plan banner */}
              {activePlan ? (() => {
                const isPlus = activePlan === 'plus';
                const gradient = isPlus
                  ? 'linear-gradient(135deg, #6b7280 0%, #c0c8d4 40%, #e5e9f0 55%, #c8cfd8 70%, #8e97a6 100%)'
                  : 'linear-gradient(135deg, #92400e 0%, #d97706 35%, #fbbf24 55%, #d97706 75%, #92400e 100%)';
                const expiry = new Date();
                expiry.setMonth(expiry.getMonth() + 1);
                return (
                  <div className="rounded-2xl p-4 mb-4" style={{ background: gradient }}>
                    <p className="text-[10px] tracking-widest uppercase text-white/50 mb-1">Активный тариф</p>
                    <p className="text-lg font-bold text-white mb-2">{isPlus ? 'Sagi+' : 'Sagi Premium'}</p>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">BOGO офферов</p>
                        <p className="text-base font-bold text-white">{isPlus ? '12' : '24'}</p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">До</p>
                        <p className="text-xs font-semibold text-white">
                          {expiry.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-[9px] text-white/40 uppercase tracking-widest">Цена</p>
                        <p className="text-xs font-semibold text-white">{isPlus ? '2 990' : '6 990'} ₸/мес</p>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <button
                  onClick={() => setShowSagiPlus(true)}
                  className="w-full flex items-center gap-3 p-3.5 rounded-2xl mb-4 border border-dashed border-[#10b981]/40 bg-[#10b981]/5"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#10b981] flex items-center justify-center shrink-0">
                    <span className="text-white font-bold text-lg leading-none">+</span>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-semibold">Подключить Sagi+</p>
                    <p className="text-[10px] text-muted-foreground">BOGO офферы — второй за счёт Sagi</p>
                  </div>
                  <span className="text-xs text-[#10b981] font-medium">от 2 990 ₸</span>
                </button>
              )}

              {/* Savings block */}
              <div className="rounded-2xl p-4 mb-4" style={{ background: 'linear-gradient(135deg, #071c12 0%, #0d4a32 60%, #031408 100%)' }}>
                <p className="text-[10px] tracking-widest uppercase text-white/40 mb-1">My Savings</p>
                <p className="text-3xl font-bold text-white tracking-tight">
                  <span className="text-lg font-semibold text-[#34d399]">$</span>{totalSavings.toLocaleString()}
                </p>
                <p className="text-[11px] text-white/40 mt-1">Total amount you've saved with our partners</p>
                <div className="flex gap-2 mt-3">
                  {([['month', 'This Month'], ['year', 'This Year'], ['all', 'All Time']] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setSavingsPeriod(key)}
                      className="px-3 py-1 rounded-lg text-[11px] font-medium transition-colors"
                      style={savingsPeriod === key ? { background: '#10b981', color: '#fff' } : { background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
                {CAT_TABS.map(cat => (
                  <button key={cat.id} onClick={() => setOfferCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap flex-shrink-0 transition-colors ${offerCategory === cat.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* 2-col offer grid */}
              <div className="grid grid-cols-2 gap-3">
                {PARTNER_OFFERS.filter(o => offerCategory === 'all' || o.type === offerCategory).map(offer => {
                  const used = usedOffers.has(offer.id);
                  const ds = DEAL_STYLE[offer.deal] ?? { bg: 'rgba(16,185,129,0.14)', text: '#10b981' };
                  const ini = offer.business.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={offer.id}
                      className={`flex flex-col rounded-2xl border p-3.5 ${used ? 'border-[#10b981]/40' : 'border-border'}`}
                      style={used ? { background: 'rgba(16,185,129,0.05)' } : undefined}>
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>{ini}</div>
                        {used && <CheckCircle2 className="w-4 h-4 text-[#10b981]" />}
                      </div>
                      <p className="text-[9px] font-medium uppercase tracking-widest text-muted-foreground mb-0.5">{offer.category}</p>
                      <p className="text-sm font-bold leading-tight mb-1">{offer.business}</p>
                      <span className="self-start text-[10px] font-bold px-2 py-0.5 rounded-lg mb-1" style={{ background: ds.bg, color: ds.text }}>{offer.deal}</span>
                      <p className="text-[10px] text-muted-foreground leading-snug flex-1 mb-3">{offer.descriptor}</p>
                      <button onClick={() => setRedeemOffer(offer)} disabled={used}
                        className="w-full py-2 rounded-xl text-xs font-semibold border transition-colors"
                        style={used ? { borderColor: 'rgba(16,185,129,0.3)', color: '#10b981', background: 'transparent' } : { borderColor: '#10b981', color: '#10b981', background: 'transparent' }}>
                        {used ? 'Redeemed' : 'View Offer'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* COMMUNITY OFFERS TAB */}
          {walletTab === 'community' && (
            <div className="overflow-y-auto flex-1 px-5 pb-8">
              {/* Community selector badge */}
              <button
                onClick={() => setShowCommunityPicker(true)}
                className="w-full flex items-center gap-2.5 p-3 rounded-2xl bg-input-background mb-4 active:opacity-70 transition-opacity"
              >
                <div className="w-8 h-8 rounded-xl overflow-hidden flex items-center justify-center shrink-0"
                  style={{ background: activeCommunity?.bg ?? 'linear-gradient(135deg,#071c12,#0d3d26)' }}>
                  {activeCommunity?.icon ?? MY_COMMUNITIES[0].icon}
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-xs font-semibold">{activeCommunity?.name ?? 'All Communities'}</p>
                  <p className="text-[10px] text-muted-foreground">{activeCommunity?.sub ?? 'Offers from all your communities'}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
                    {communityFiltered.length} offers
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </button>

              {/* Category chips */}
              <div className="flex gap-2 overflow-x-auto pb-3 -mx-5 px-5 scrollbar-hide">
                {CAT_TABS.map(cat => (
                  <button key={cat.id} onClick={() => setOfferCategory(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs whitespace-nowrap flex-shrink-0 transition-colors ${offerCategory === cat.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Community offers list */}
              <div className="space-y-2">
                {communityFiltered.map(offer => {
                  const used = usedOffers.has(offer.id);
                  const ini = offer.business.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                  return (
                    <div key={offer.id}
                      className={`flex items-center gap-3 p-3.5 rounded-2xl border ${used ? 'border-[#10b981]/40' : 'border-border'}`}
                      style={used ? { background: 'rgba(16,185,129,0.05)' } : undefined}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                        style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>{ini}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{offer.business}</p>
                        <p className="text-xs font-medium text-[#10b981]">{offer.dealDetail}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{offer.descriptor}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        <span className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-input-background text-muted-foreground whitespace-nowrap">
                          {offer.deal}
                        </span>
                        {used ? (
                          <CheckCircle2 className="w-5 h-5 text-[#10b981]" />
                        ) : (
                          <button
                            onClick={() => setRedeemOffer({ ...offer, deal: offer.dealDetail, descriptor: offer.descriptor, saved: 0 })}
                            className="text-[10px] font-semibold px-2.5 py-1 rounded-lg border border-[#10b981] text-[#10b981]">
                            Use
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Community picker */}
      {showCommunityPicker && (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center" onClick={() => setShowCommunityPicker(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative bg-card rounded-t-3xl w-full max-w-md p-5 pb-8" onClick={e => e.stopPropagation()}>
            <div className="flex justify-center mb-4"><div className="w-10 h-1 rounded-full bg-border" /></div>
            <p className="text-sm font-semibold mb-3">Select Community</p>

            <button
              onClick={() => { setSelectedCommunity('all'); setShowCommunityPicker(false); }}
              className={`w-full flex items-center gap-3 p-3 rounded-2xl mb-2 transition-colors ${selectedCommunity === 'all' ? 'bg-[#10b981]/10 border border-[#10b981]/30' : 'bg-input-background'}`}
            >
              <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">All Communities</p>
                <p className="text-[10px] text-muted-foreground">Offers from all your communities</p>
              </div>
              {selectedCommunity === 'all' && <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />}
            </button>

            {MY_COMMUNITIES.map(c => (
              <button
                key={c.id}
                onClick={() => { setSelectedCommunity(c.id); setShowCommunityPicker(false); }}
                className={`w-full flex items-center gap-3 p-3 rounded-2xl mb-2 transition-colors ${selectedCommunity === c.id ? 'bg-[#10b981]/10 border border-[#10b981]/30' : 'bg-input-background'}`}
              >
                <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0" style={{ background: c.bg }}>
                  {c.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-[10px] text-muted-foreground">{c.sub}</p>
                </div>
                {selectedCommunity === c.id && <CheckCircle2 className="w-4 h-4 text-[#10b981] shrink-0" />}
              </button>
            ))}
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

      {/* Redemption modal */}
      {redeemOffer && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-6" onClick={() => setRedeemOffer(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-card rounded-3xl w-full max-w-sm p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-lg">Show to cashier</h3>
              <button onClick={() => setRedeemOffer(null)} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
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
              <p className="font-mono text-sm tracking-widest text-muted-foreground">
                SAGI &nbsp;·&nbsp; 2026 &nbsp;·&nbsp; {String(redeemOffer.id).padStart(4, '0')}
              </p>
              <p className="text-xs font-medium text-[#10b981]">Valid for 15 minutes</p>
            </div>
            <button
              onClick={() => { setUsedOffers(prev => new Set(prev).add(redeemOffer.id)); setRedeemOffer(null); }}
              className="mt-5 w-full py-3 rounded-2xl bg-[#10b981] text-white text-sm font-semibold"
            >
              Mark as Redeemed
            </button>
          </div>
        </div>
      )}

      {showSagiPlus && <SagiPlusModal onClose={() => setShowSagiPlus(false)} />}
    </>
  );
}
