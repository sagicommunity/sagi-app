import { useState } from 'react';
import { ChevronLeft, Search, ShoppingBag, Calendar, Newspaper, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router';

const EC_GRADIENT = 'linear-gradient(135deg, #1D4ED8 0%, #4338CA 50%, #6D28D9 100%)';
const EC_DARK_BG  = 'linear-gradient(to bottom, #0D0F2E, #0A0C22)';
const EC_COLOR    = '#818CF8';

type Tab = 'offers' | 'events' | 'news';

const OFFERS = [
  {
    id: 1, business: 'Café Europa', businessType: 'cafe' as const,
    category: 'Кафе', discount: '-10% на все напитки',
    photo: '/brew-society.jpeg', tag: 'Кофе',
  },
  {
    id: 2, business: 'Bistro Wien', businessType: 'restaurant' as const,
    category: 'Ресторан', discount: 'Десерт в подарок при заказе от 4 000 ₸',
    photo: '/tap-tatti.jpeg', tag: 'Еда',
  },
  {
    id: 3, business: 'Delish', businessType: 'cafe' as const,
    category: 'Кафе', discount: '-15% на завтраки',
    photo: '/delish.jpeg', tag: 'Еда',
  },
  {
    id: 4, business: 'Drinkit', businessType: 'cafe' as const,
    category: 'Напитки', discount: 'Второй напиток в подарок',
    photo: '/drinkit.jpeg', tag: 'Напитки',
  },
];

const EVENTS = [
  {
    id: 1, title: 'Добро пожаловать в Europe City!', date: 'Сб, 10 мая · 12:00',
    location: 'Лобби, 1 этаж', photo: '/delish.jpeg',
  },
  {
    id: 2, title: 'Европейский вечер в Bistro Wien', date: 'Вс, 11 мая · 18:00',
    location: 'Bistro Wien, Europe City', photo: '/tap-tatti.jpeg',
  },
];

const NEWS = [
  {
    id: 1, author: 'Europe City', time: '1ч назад',
    text: 'Добро пожаловать в сообщество жителей Europe City! Здесь вы найдёте эксклюзивные офферы от европейских партнёров прямо в вашем жилом квартале.',
    photo: '/brew-society.jpeg',
  },
  {
    id: 2, author: 'Europe City', time: '3д назад',
    text: 'Café Europa, Bistro Wien, Delish и Drinkit стали официальными партнёрами сообщества. Показывай карту участника при оплате и получай скидки.',
    photo: '/drinkit.jpeg',
  },
];

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: 'offers', label: 'Офферы',   icon: ShoppingBag },
  { key: 'events', label: 'События',  icon: Calendar    },
  { key: 'news',   label: 'Новости',  icon: Newspaper   },
];

export function EuropeCityCommunity() {
  const [tab, setTab]       = useState<Tab>('offers');
  const [search, setSearch] = useState('');
  const [rsvped, setRsvped] = useState<Set<number>>(new Set());

  const filtered = OFFERS.filter(o =>
    o.business.toLowerCase().includes(search.toLowerCase()) ||
    o.discount.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (key: Tab) => tab === key ? { background: EC_GRADIENT } : {};
  const tabClass = (key: Tab, extra = '') =>
    `flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${extra} ${
      tab === key ? 'text-white' : 'bg-input-background text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* ─── HEADER ─── */}
      <div className="px-4 pt-4 pb-6" style={{ background: EC_DARK_BG }}>
        <div className="max-w-md mx-auto">
          <Link to="/user" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 shadow-lg">
              <img src="/europe_city.jpg" alt="Europe City" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-white font-bold text-lg leading-tight">Europe City</h1>
            <p className="text-white/60 text-xs mt-0.5">Жилой квартал · Астана</p>
            <div className="flex items-center gap-1 mt-1.5 text-white/40 text-xs">
              <MapPin className="w-3 h-3" />
              <span>ул. Кабанбай батыра 11</span>
            </div>
            <Link
              to="/user/network?community=EuropeCity"
              className="flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
            >
              <Users className="w-3.5 h-3.5" />
              287 участников
            </Link>
          </div>
        </div>
      </div>

      {/* ─── TABS ─── */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {TABS.map((tb, idx) => {
              const isLastOdd = TABS.length % 2 !== 0 && idx === TABS.length - 1;
              return (
                <button
                  key={tb.key}
                  onClick={() => { setTab(tb.key); setSearch(''); }}
                  className={tabClass(tb.key, isLastOdd ? 'col-span-2' : '')}
                  style={tabStyle(tb.key)}
                >
                  <tb.icon className="w-3.5 h-3.5" />
                  {tb.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">

        {/* ══ ОФФЕРЫ ══ */}
        {tab === 'offers' && (
          <>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск офферов..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input-background rounded-xl border border-border focus:outline-none transition-colors text-sm"
                style={{ '--tw-ring-color': EC_COLOR } as React.CSSProperties}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(offer => (
                <Link key={offer.id} to={`/user/offer/${offer.id}`}
                  state={{ business: offer.business, businessType: offer.businessType, category: offer.category, discount: offer.discount, photo: offer.photo, color: EC_COLOR, gradient: EC_GRADIENT, joinStatus: 'member' }}
                  className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-[#818CF8] transition-colors">
                  <img src={offer.photo} alt={offer.business} className="w-full h-24 object-cover" />
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start mb-1.5"
                      style={{ background: `${EC_COLOR}20`, color: EC_COLOR }}>
                      {offer.tag}
                    </span>
                    <h3 className="text-xs font-bold leading-tight mb-1">{offer.business}</h3>
                    <p className="text-xs text-muted-foreground mb-2 flex-1 line-clamp-2">{offer.discount}</p>
                    <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full self-start"
                      style={{ background: '#10b98120', color: '#10b981' }}>
                      Активен
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ══ СОБЫТИЯ ══ */}
        {tab === 'events' && (
          <div className="space-y-3">
            {EVENTS.map(ev => {
              const gone = rsvped.has(ev.id);
              return (
                <div key={ev.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <img src={ev.photo} alt={ev.title} className="w-full h-36 object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-sm mb-0.5">{ev.title}</p>
                    <p className="text-xs text-muted-foreground mb-0.5">{ev.date}</p>
                    <p className="text-xs text-muted-foreground mb-3">{ev.location}</p>
                    <button
                      onClick={() => setRsvped(prev => { const s = new Set(prev); gone ? s.delete(ev.id) : s.add(ev.id); return s; })}
                      className="w-full py-2 rounded-xl text-sm font-medium transition-colors text-white"
                      style={{ background: gone ? '#10b981' : EC_GRADIENT }}
                    >
                      {gone ? 'Записался ✓' : 'Записаться'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ НОВОСТИ ══ */}
        {tab === 'news' && (
          <div className="space-y-3">
            {NEWS.map(post => (
              <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <img src={post.photo} alt="" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${EC_COLOR}20` }}>
                        <span className="text-[10px] font-bold" style={{ color: EC_COLOR }}>EC</span>
                      </div>
                      <p className="text-xs font-semibold">{post.author}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{post.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
