import { useState } from 'react';
import { X, Check, ChevronRight, Crown } from 'lucide-react';
import { useWallet } from '../context/WalletContext';

interface Props {
  onClose: () => void;
}

type Category = 'dining' | 'cafe' | 'beauty' | 'fitness' | 'hotel' | 'leisure' | 'travel';

interface BogoOffer {
  id: number;
  business: string;
  deal: string;
  detail: string;
  category: Category;
  days: string;
  plan: 'plus' | 'premium';
}

const BOGO_OFFERS: BogoOffer[] = [
  // Sagi+ — dining casual
  { id: 1,  business: 'Brew Society',     deal: '2 за 1',  detail: 'На все специальные напитки',         category: 'cafe',    days: 'Пн–Пт',    plan: 'plus' },
  { id: 2,  business: 'Daily Grind',      deal: '2 за 1',  detail: 'На любой кофе и выпечку',            category: 'cafe',    days: 'Ежедневно', plan: 'plus' },
  { id: 3,  business: 'Rooftop Café',     deal: '2 за 1',  detail: 'На вечерние коктейли',               category: 'cafe',    days: 'Пт–Вс',    plan: 'plus' },
  { id: 4,  business: 'Atlas Bar',        deal: '2 за 1',  detail: 'На сигнатурные коктейли',            category: 'cafe',    days: 'Пн–Чт',    plan: 'plus' },
  { id: 5,  business: 'Sakura Kitchen',   deal: '2 за 1',  detail: 'На сеты с суши',                     category: 'dining',  days: 'Ежедневно', plan: 'plus' },
  { id: 6,  business: 'Olivia Bistro',    deal: '2 за 1',  detail: 'На бизнес-ланч',                     category: 'dining',  days: 'Пн–Пт',    plan: 'plus' },
  { id: 7,  business: 'La Piazza',        deal: '2 за 1',  detail: 'На пиццу из дровяной печи',          category: 'dining',  days: 'Ежедневно', plan: 'plus' },
  { id: 8,  business: 'TapTatti',         deal: '2 за 1',  detail: 'На основные блюда меню',             category: 'dining',  days: 'Вт–Вс',    plan: 'plus' },
  { id: 9,  business: 'Aura Beauty',      deal: '2 за 1',  detail: 'На SPA-процедуры',                   category: 'beauty',  days: 'Пн–Пт',    plan: 'plus' },
  { id: 10, business: 'SmileCare Clinic', deal: '2 за 1',  detail: 'На первичную консультацию',          category: 'beauty',  days: 'Ежедневно', plan: 'plus' },
  { id: 11, business: 'Iron Grid Gym',    deal: '2 за 1',  detail: 'На дневную тренировку',              category: 'fitness', days: 'Пн–Пт',    plan: 'plus' },
  { id: 12, business: 'Kinetic Club',     deal: '2 за 1',  detail: 'На персональную тренировку',         category: 'fitness', days: 'Ежедневно', plan: 'plus' },
  // Sagi Premium — fine dining, hotels, leisure, travel
  { id: 13, business: 'Le Bistro',        deal: '2 за 1',  detail: 'На обеденное меню',                  category: 'dining',  days: 'Пн–Пт',    plan: 'premium' },
  { id: 14, business: 'Noma Grill',       deal: '2 за 1',  detail: 'На стейки и гриль',                  category: 'dining',  days: 'Вт–Вс',    plan: 'premium' },
  { id: 15, business: 'The Loft',         deal: '2 за 1',  detail: 'На ужин в пятницу',                  category: 'dining',  days: 'Пт–Сб',    plan: 'premium' },
  { id: 16, business: 'Master Coffee',    deal: '2 за 1',  detail: 'На авторский кофе',                  category: 'cafe',    days: 'Ежедневно', plan: 'premium' },
  { id: 17, business: 'Skyline Hotel',    deal: '2 за 1',  detail: 'На 2 ночи при бронировании',         category: 'hotel',   days: 'Вс–Чт',    plan: 'premium' },
  { id: 18, business: 'Grand Vega Hotel', deal: '2 за 1',  detail: 'На проживание в стандартном номере', category: 'hotel',   days: 'Ежедневно', plan: 'premium' },
  { id: 19, business: 'Meridian Hotel',   deal: '2 за 1',  detail: 'На ужин в ресторане отеля',          category: 'hotel',   days: 'Пн–Чт',    plan: 'premium' },
  { id: 20, business: 'Eagle Golf Studio',deal: '2 за 1',  detail: 'На уроки и аренду кортов',           category: 'leisure', days: 'Пн–Пт',    plan: 'premium' },
  { id: 21, business: 'Vertex Academy',   deal: '2 за 1',  detail: 'На бизнес-курсы',                    category: 'leisure', days: 'Ежедневно', plan: 'premium' },
  { id: 22, business: 'SkyLink Airways',  deal: '2 за 1',  detail: 'На билеты бизнес-класса',            category: 'travel',  days: 'Ежедневно', plan: 'premium' },
  { id: 23, business: 'WanderKZ',         deal: '2 за 1',  detail: 'На туры выходного дня',              category: 'travel',  days: 'Сб–Вс',    plan: 'premium' },
  { id: 24, business: 'Horizon Travel',   deal: '2 за 1',  detail: 'На международные туры',              category: 'travel',  days: 'Ежедневно', plan: 'premium' },
];

const CAT_META: Record<Category, { label: string; color: string; bg: string }> = {
  dining:  { label: 'Рестораны',  color: '#f59e0b', bg: 'rgba(245,158,11,0.12)'  },
  cafe:    { label: 'Кафе',       color: '#10b981', bg: 'rgba(16,185,129,0.12)'  },
  beauty:  { label: 'Красота',    color: '#ec4899', bg: 'rgba(236,72,153,0.12)'  },
  fitness: { label: 'Фитнес',     color: '#3b82f6', bg: 'rgba(59,130,246,0.12)'  },
  hotel:   { label: 'Отели',      color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)'  },
  leisure: { label: 'Досуг',      color: '#06b6d4', bg: 'rgba(6,182,212,0.12)'   },
  travel:  { label: 'Путешествия',color: '#f97316', bg: 'rgba(249,115,22,0.12)'  },
};

const PLANS = {
  plus: {
    name: 'Sagi+',
    price: '2 990',
    color: '#9ca3af',
    gradient: 'linear-gradient(135deg, #6b7280 0%, #c0c8d4 40%, #e5e9f0 55%, #c8cfd8 70%, #8e97a6 100%)',
    categories: ['cafe', 'dining', 'beauty', 'fitness'] as Category[],
    description: 'Кафе, рестораны, красота и фитнес',
  },
  premium: {
    name: 'Sagi Premium',
    price: '6 990',
    color: '#d97706',
    gradient: 'linear-gradient(135deg, #92400e 0%, #d97706 35%, #fbbf24 55%, #d97706 75%, #92400e 100%)',
    categories: ['cafe', 'dining', 'beauty', 'fitness', 'hotel', 'leisure', 'travel'] as Category[],
    description: 'Всё из Sagi+ · Отели · Досуг · Путешествия',
  },
};

type PlanKey = 'plus' | 'premium';
type Screen = 'plans' | 'offers' | 'success';

export function SagiPlusModal({ onClose }: Props) {
  const { setActivePlan } = useWallet();
  const [selected, setSelected] = useState<PlanKey>('premium');
  const [screen, setScreen] = useState<Screen>('plans');
  const [activeCategory, setActiveCategory] = useState<'all' | Category>('all');

  const plan = PLANS[selected];
  const planOffers = BOGO_OFFERS.filter(o =>
    selected === 'premium' ? true : o.plan === 'plus'
  );
  const visibleOffers = activeCategory === 'all'
    ? planOffers
    : planOffers.filter(o => o.category === activeCategory);

  const plusCount = BOGO_OFFERS.filter(o => o.plan === 'plus').length;
  const premiumCount = BOGO_OFFERS.length;

  // ── SUCCESS SCREEN ───────────────────────────────────────────
  if (screen === 'success') {
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + 1);
    const expiryStr = expiry.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
    const offerCount = selected === 'plus' ? BOGO_OFFERS.filter(o => o.plan === 'plus').length : BOGO_OFFERS.length;

    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-card rounded-t-3xl w-full max-w-md flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
          <div className="flex justify-center pt-3 shrink-0"><div className="w-10 h-1 rounded-full bg-border" /></div>

          <div className="px-5 pt-6 pb-10 flex flex-col items-center text-center">
            {/* Icon */}
            <div className="w-20 h-20 rounded-full flex items-center justify-center mb-5 shadow-lg"
              style={{ background: plan.gradient }}>
              <Crown className="w-9 h-9 text-white" />
            </div>

            <h2 className="font-bold text-xl mb-1">Подписка активна!</h2>
            <p className="text-sm text-muted-foreground mb-6">Добро пожаловать в {plan.name}</p>

            {/* Plan card */}
            <div className="w-full rounded-2xl p-5 mb-6 text-left" style={{ background: plan.gradient }}>
              <p className="text-[10px] tracking-widest uppercase text-white/40 mb-1">Активный тариф</p>
              <p className="text-xl font-bold text-white mb-3">{plan.name}</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Офферов</p>
                  <p className="text-lg font-bold text-white">{offerCount} BOGO</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Действует до</p>
                  <p className="text-sm font-semibold text-white">{expiryStr}</p>
                </div>
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">Стоимость</p>
                  <p className="text-sm font-semibold text-white">{plan.price} ₸/мес</p>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {plan.categories.map(c => {
                const meta = CAT_META[c];
                return (
                  <span key={c} className="text-[11px] font-semibold px-3 py-1 rounded-xl"
                    style={{ background: meta.bg, color: meta.color }}>
                    {meta.label}
                  </span>
                );
              })}
            </div>

            <button onClick={onClose} className="w-full py-4 rounded-2xl text-white font-bold text-sm" style={{ background: plan.color }}>
              Начать пользоваться
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── OFFERS PREVIEW SCREEN ────────────────────────────────────
  if (screen === 'offers') {
    const cats = ['all', ...plan.categories] as ('all' | Category)[];
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <div className="relative bg-card rounded-t-3xl w-full max-w-md flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
          <div className="flex justify-center pt-3 shrink-0"><div className="w-10 h-1 rounded-full bg-border" /></div>

          {/* Header */}
          <div className="px-5 pt-4 pb-3 shrink-0">
            <div className="flex items-center justify-between mb-1">
              <button onClick={() => setScreen('plans')} className="text-sm text-muted-foreground flex items-center gap-1">
                <ChevronRight className="w-4 h-4 rotate-180" /> Назад
              </button>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-bold text-base">{plan.name}</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ background: plan.color }}>
                {planOffers.length} BOGO
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{plan.price} ₸/мес · {plan.description}</p>

            {/* Category chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 mt-3 -mx-5 px-5 scrollbar-hide">
              {cats.map(c => {
                const meta = c === 'all' ? null : CAT_META[c];
                const isActive = activeCategory === c;
                return (
                  <button key={c} onClick={() => setActiveCategory(c)}
                    className="px-3 py-1.5 rounded-xl text-xs whitespace-nowrap flex-shrink-0 font-medium transition-colors"
                    style={isActive
                      ? { background: meta?.color ?? plan.color, color: '#fff' }
                      : { background: 'var(--input-background)', color: 'var(--muted-foreground)' }}>
                    {c === 'all' ? `Все (${planOffers.length})` : `${meta!.label}`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Offer list */}
          <div className="overflow-y-auto flex-1 px-5 pb-4">
            <div className="space-y-2">
              {visibleOffers.map(offer => {
                const meta = CAT_META[offer.category];
                const ini = offer.business.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
                return (
                  <div key={offer.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-border bg-card">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: meta.bg, color: meta.color }}>{ini}</div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{offer.business}</p>
                      <p className="text-xs text-muted-foreground truncate">{offer.detail}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{offer.days}</p>
                    </div>

                    {/* BOGO badge */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                        style={{ background: meta.bg, color: meta.color }}>{meta.label}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-lg bg-foreground text-background">
                        {offer.deal}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="px-5 pb-8 pt-3 shrink-0 border-t border-border">
            <button
              onClick={() => { setActivePlan(selected); setScreen('success'); }}
              className="w-full py-4 rounded-2xl text-white font-bold text-sm"
              style={{ background: plan.color }}
            >
              Подключить {plan.name} — {plan.price} ₸/мес
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── PLAN SELECTION SCREEN ────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-card rounded-t-3xl w-full max-w-md flex flex-col" style={{ maxHeight: '92vh' }} onClick={e => e.stopPropagation()}>
        <div className="flex justify-center pt-3 shrink-0"><div className="w-10 h-1 rounded-full bg-border" /></div>

        <div className="px-5 pt-4 pb-2 shrink-0 flex items-start justify-between">
          <div>
            <h2 className="font-bold text-lg">Выберите тариф</h2>
            <p className="text-xs text-muted-foreground mt-0.5">BOGO офферы — второй за счёт Sagi</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground mt-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 pb-8 space-y-3">
          {(Object.entries(PLANS) as [PlanKey, typeof PLANS.plus][]).map(([key, p]) => {
            const isSelected = selected === key;
            const offerCount = key === 'plus' ? plusCount : premiumCount;
            return (
              <button
                key={key}
                onClick={() => setSelected(key)}
                className={`w-full text-left rounded-2xl p-4 border-2 transition-all relative overflow-hidden ${!isSelected ? 'bg-input-background border-transparent' : ''}`}
                style={isSelected ? { borderColor: p.color, background: p.gradient } : undefined}
              >

                {/* Title row */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`font-bold text-base ${isSelected ? 'text-white' : 'text-foreground'}`}>{p.name}</span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full flex items-center justify-center ml-auto mr-8" style={{ background: p.color }}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Price */}
                <p className={`text-2xl font-bold mb-3 ${isSelected ? 'text-white' : 'text-foreground'}`}>
                  {p.price} <span className={`text-sm font-normal ${isSelected ? 'text-white/50' : 'text-muted-foreground'}`}>₸/мес</span>
                </p>

                {/* BOGO count */}
                <p className={`text-xs font-semibold mb-3 ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}>
                  {offerCount} BOGO офферов включено
                </p>

                {/* Category pills */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {key === 'premium' && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg"
                      style={isSelected
                        ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                        : { background: 'rgba(156,163,175,0.15)', color: '#6b7280' }}>
                      Sagi+
                    </span>
                  )}
                  {(key === 'plus'
                    ? (['cafe', 'dining', 'beauty', 'fitness'] as Category[])
                    : (['hotel', 'leisure', 'travel'] as Category[])
                  ).map(c => {
                    const meta = CAT_META[c];
                    return (
                      <span key={c} className="text-[10px] font-semibold px-2 py-0.5 rounded-lg"
                        style={isSelected
                          ? { background: 'rgba(255,255,255,0.15)', color: '#fff' }
                          : { background: meta.bg, color: meta.color }}>
                        {meta.label}
                      </span>
                    );
                  })}
                </div>

                {/* See offers link */}
                <button
                  onClick={e => { e.stopPropagation(); setSelected(key); setScreen('offers'); }}
                  className={`flex items-center gap-1 text-xs font-medium ${isSelected ? 'text-white/70' : 'text-muted-foreground'}`}
                >
                  Смотреть все офферы <ChevronRight className="w-3 h-3" />
                </button>
              </button>
            );
          })}

          <button
            onClick={() => setScreen('offers')}
            className="w-full py-4 rounded-2xl text-white font-bold text-sm mt-2"
            style={{ background: plan.color }}
          >
            Продолжить с {plan.name}
          </button>
          <p className="text-center text-[10px] text-muted-foreground -mt-1">Отмена в любой момент · Без скрытых платежей</p>
        </div>
      </div>
    </div>
  );
}
