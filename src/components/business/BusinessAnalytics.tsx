import { useState } from 'react';
import { ChevronLeft, TrendingUp, Users, ShoppingBag, RefreshCw } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../../context/LanguageContext';

type Period = 'week' | 'month' | 'all';

const periodData: Record<Period, {
  redemptions: number;
  membersReached: number;
  newMembers: number;
  repeatRate: number;
  barData: number[];
  offers: Array<{ title: string; redemptions: number; uniqueMembers: number; trend: number }>;
  communities: Array<{ name: string; redemptions: number; pct: number }>;
}> = {
  week: {
    redemptions: 84,
    membersReached: 61,
    newMembers: 12,
    repeatRate: 38,
    barData: [9, 11, 14, 18, 13, 22, 17],
    offers: [
      { title: 'discountAllMeals', redemptions: 48, uniqueMembers: 35, trend: 12 },
      { title: 'freeCoffeeWithPastry', redemptions: 23, uniqueMembers: 19, trend: 5 },
      { title: 'spaDaySpecial', redemptions: 13, uniqueMembers: 9, trend: -2 },
    ],
    communities: [
      { name: 'Highvill Ishim', redemptions: 24, pct: 29 },
      { name: 'English Quarter', redemptions: 17, pct: 20 },
      { name: 'French Quarter', redemptions: 13, pct: 16 },
      { name: 'Italian Quarter', redemptions: 12, pct: 14 },
      { name: 'AIFC', redemptions: 10, pct: 12 },
      { name: 'Vertex Club', redemptions: 6, pct: 7 },
      { name: 'Hani', redemptions: 2, pct: 2 },
    ],
  },
  month: {
    redemptions: 312,
    membersReached: 198,
    newMembers: 43,
    repeatRate: 44,
    barData: [28, 35, 42, 55, 40, 62, 50],
    offers: [
      { title: 'discountAllMeals', redemptions: 178, uniqueMembers: 104, trend: 18 },
      { title: 'freeCoffeeWithPastry', redemptions: 89, uniqueMembers: 67, trend: 9 },
      { title: 'spaDaySpecial', redemptions: 45, uniqueMembers: 31, trend: -4 },
    ],
    communities: [
      { name: 'Highvill Ishim', redemptions: 91, pct: 29 },
      { name: 'English Quarter', redemptions: 62, pct: 20 },
      { name: 'French Quarter', redemptions: 50, pct: 16 },
      { name: 'Italian Quarter', redemptions: 43, pct: 14 },
      { name: 'AIFC', redemptions: 35, pct: 11 },
      { name: 'Vertex Club', redemptions: 21, pct: 7 },
      { name: 'Hani', redemptions: 10, pct: 3 },
    ],
  },
  all: {
    redemptions: 1247,
    membersReached: 580,
    newMembers: 580,
    repeatRate: 51,
    barData: [120, 145, 168, 195, 172, 220, 227],
    offers: [
      { title: 'discountAllMeals', redemptions: 712, uniqueMembers: 380, trend: 0 },
      { title: 'freeCoffeeWithPastry', redemptions: 348, uniqueMembers: 241, trend: 0 },
      { title: 'spaDaySpecial', redemptions: 187, uniqueMembers: 129, trend: 0 },
    ],
    communities: [
      { name: 'Highvill Ishim', redemptions: 362, pct: 29 },
      { name: 'English Quarter', redemptions: 249, pct: 20 },
      { name: 'French Quarter', redemptions: 200, pct: 16 },
      { name: 'Italian Quarter', redemptions: 175, pct: 14 },
      { name: 'AIFC', redemptions: 137, pct: 11 },
      { name: 'Vertex Club', redemptions: 87, pct: 7 },
      { name: 'Hani', redemptions: 37, pct: 3 },
    ],
  },
};

export function BusinessAnalytics() {
  const { t } = useLanguage();
  const [period, setPeriod] = useState<Period>('month');
  const [communityPeriod, setCommunityPeriod] = useState<Period>('month');
  const [dateFrom, setDateFrom] = useState('2026-04-01');
  const [dateTo, setDateTo] = useState('2026-04-30');

  const data = periodData[period];
  const maxBar = Math.max(...data.barData);
  const maxOfferRedemptions = Math.max(...data.offers.map(o => o.redemptions));
  const days = [t('dayMon'), t('dayTue'), t('dayWed'), t('dayThu'), t('dayFri'), t('daySat'), t('daySun')];

  const periods: Array<{ key: Period; label: string }> = [
    { key: 'week', label: t('thisWeek') },
    { key: 'month', label: t('thisMonth') },
    { key: 'all', label: t('allTime') },
  ];

  const stats = [
    { label: t('totalRedemptions'), value: data.redemptions, icon: ShoppingBag, color: '#10b981' },
    { label: t('membersReached'), value: data.membersReached, icon: Users, color: '#3b82f6' },
    { label: t('conversionRate'), value: `${data.repeatRate}%`, icon: RefreshCw, color: '#8b5cf6' },
    { label: t('activeMembers'), value: data.newMembers, icon: TrendingUp, color: '#f59e0b' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <Link to="/business" className="text-foreground">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl font-semibold">{t('analytics')}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-5">

        {/* Period tabs */}
        <div className="flex gap-2">
          {periods.map(p => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                period === p.key
                  ? 'bg-[#10b981] text-white'
                  : 'bg-input-background text-muted-foreground'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Summary stats */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="bg-card border border-border rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
              <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Redemptions chart */}
        <div className="bg-card border border-border rounded-2xl p-4">
          <p className="text-sm font-semibold mb-3">{t('redemptionsByDay')}</p>
          <div className="flex items-end gap-1 h-28">
            {data.barData.map((val, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] text-muted-foreground">{val}</span>
                <div
                  className="w-full rounded-t-md bg-[#10b981]"
                  style={{ height: `${(val / maxBar) * 72}px` }}
                />
                <span className="text-[9px] text-muted-foreground">{days[idx]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top offers */}
        <div>
          <p className="text-sm font-semibold mb-3">{t('topOffers')}</p>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {data.offers.map((offer, idx) => (
              <div key={idx}>
                {idx > 0 && <div className="border-t border-border" />}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="text-sm font-bold text-[#10b981] w-4 flex-shrink-0">{idx + 1}</span>
                      <p className="text-sm font-medium truncate">{t(offer.title as Parameters<typeof t>[0])}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {period !== 'all' && (
                        <span className={`text-xs font-medium ${offer.trend >= 0 ? 'text-[#10b981]' : 'text-red-500'}`}>
                          {offer.trend >= 0 ? '+' : ''}{offer.trend}%
                        </span>
                      )}
                      <span className="text-sm font-bold text-[#10b981]">{offer.redemptions}</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#10b981]/15 overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-[#10b981]"
                      style={{ width: `${(offer.redemptions / maxOfferRedemptions) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{offer.uniqueMembers} {t('uniqueMembersLabel')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community breakdown */}
        <div>
          <div className="mb-3">
            <p className="text-sm font-semibold mb-2">Откуда пришли клиенты</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 flex items-center gap-1.5 bg-input-background border border-border rounded-xl px-3 py-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">От</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-foreground outline-none min-w-0"
                />
              </div>
              <span className="text-muted-foreground text-xs flex-shrink-0">—</span>
              <div className="flex-1 flex items-center gap-1.5 bg-input-background border border-border rounded-xl px-3 py-2">
                <span className="text-xs text-muted-foreground whitespace-nowrap">До</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="flex-1 bg-transparent text-xs text-foreground outline-none min-w-0"
                />
              </div>
            </div>
          </div>
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {periodData[communityPeriod].communities.map((c, idx) => (
              <div key={c.name}>
                {idx > 0 && <div className="border-t border-border" />}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium">{c.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{c.redemptions}</span>
                      <span className="text-xs text-muted-foreground">({c.pct}%)</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full bg-[#10b981]/20 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#10b981]"
                      style={{ width: `${c.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
