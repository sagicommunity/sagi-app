import { useState } from 'react';
import { ChevronLeft, Search, ShoppingBag, Calendar, Newspaper, MapPin, Users } from 'lucide-react';
import { Link } from 'react-router';

const VS_GRADIENT = 'linear-gradient(135deg, #0369A1 0%, #0284C7 50%, #0EA5E9 100%)';
const VS_DARK_BG  = 'linear-gradient(to bottom, #071B2E, #041422)';
const VS_COLOR    = '#38BDF8';

type Tab = 'offers' | 'events' | 'news';

const OFFERS = [
  {
    id: 1, business: 'Brew Society', businessType: 'cafe' as const,
    category: 'Кофейня', discount: '-10% на все напитки',
    photo: '/brew-society.jpeg', tag: 'Кофе',
  },
  {
    id: 2, business: 'Delish', businessType: 'cafe' as const,
    category: 'Кафе', discount: 'Десерт в подарок при заказе от 3 000 ₸',
    photo: '/delish.jpeg', tag: 'Еда',
  },
  {
    id: 3, business: 'Master Coffee', businessType: 'cafe' as const,
    category: 'Кофейня', discount: '-15% на кофе и напитки',
    photo: '/master-coffee.jpeg', tag: 'Кофе',
  },
  {
    id: 4, business: 'Drinkit', businessType: 'cafe' as const,
    category: 'Напитки', discount: 'Второй напиток в подарок',
    photo: '/drinkit.jpeg', tag: 'Напитки',
  },
];

const EVENTS = [
  {
    id: 1, title: 'День открытых дверей Vista School', date: 'Сб, 7 июн · 10:00',
    location: 'Главный актовый зал', photo: '/delish.jpeg',
  },
  {
    id: 2, title: 'Выпускной вечер 2025', date: 'Пт, 20 июн · 18:00',
    location: 'Vista School, Астана', photo: '/tap-tatti.jpeg',
  },
];

const NEWS = [
  {
    id: 1, author: 'Vista School', time: '2ч назад',
    text: 'Добро пожаловать в сообщество Vista School! Здесь родители, ученики и педагоги находят эксклюзивные офферы от партнёров школы и всегда в курсе актуальных событий.',
    photo: '/master-coffee.jpeg',
  },
  {
    id: 2, author: 'Vista School', time: '1д назад',
    text: 'Brew Society, Delish, Master Coffee и Drinkit стали официальными партнёрами сообщества. Показывай карту участника при оплате и получай скидки.',
    photo: '/drinkit.jpeg',
  },
];

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: 'offers', label: 'Офферы',   icon: ShoppingBag },
  { key: 'events', label: 'События',  icon: Calendar    },
  { key: 'news',   label: 'Новости',  icon: Newspaper   },
];

export function VistaSchoolCommunity() {
  const [tab, setTab]       = useState<Tab>('offers');
  const [search, setSearch] = useState('');
  const [rsvped, setRsvped] = useState<Set<number>>(new Set());

  const filtered = OFFERS.filter(o =>
    o.business.toLowerCase().includes(search.toLowerCase()) ||
    o.discount.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (key: Tab) => tab === key ? { background: VS_GRADIENT } : {};
  const tabClass = (key: Tab, extra = '') =>
    `flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${extra} ${
      tab === key ? 'text-white' : 'bg-input-background text-muted-foreground hover:text-foreground'
    }`;

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* ─── HEADER ─── */}
      <div className="px-4 pt-4 pb-6" style={{ background: VS_DARK_BG }}>
        <div className="max-w-md mx-auto">
          <Link to="/user" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 shadow-lg">
              <img src="/vista-school.jpg" alt="Vista School" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-white font-bold text-lg leading-tight">Vista School</h1>
            <p className="text-white/60 text-xs mt-0.5">Частная школа · Астана</p>
            <div className="flex items-center gap-1 mt-1.5 text-white/40 text-xs">
              <MapPin className="w-3 h-3" />
              <span>Астана, Казахстан</span>
            </div>
            <Link
              to="/user/network?community=VistaSchool"
              className="flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
            >
              <Users className="w-3.5 h-3.5" />
              540 участников
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
                style={{ '--tw-ring-color': VS_COLOR } as React.CSSProperties}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(offer => (
                <Link key={offer.id} to={`/user/offer/${offer.id}`}
                  state={{ business: offer.business, businessType: offer.businessType, category: offer.category, discount: offer.discount, photo: offer.photo, color: VS_COLOR, gradient: VS_GRADIENT, joinStatus: 'member' }}
                  className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-[#38BDF8] transition-colors">
                  <img src={offer.photo} alt={offer.business} className="w-full h-24 object-cover" />
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start mb-1.5"
                      style={{ background: `${VS_COLOR}20`, color: VS_COLOR }}>
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
                      style={{ background: gone ? '#10b981' : VS_GRADIENT }}
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
                      <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: `${VS_COLOR}20` }}>
                        <span className="text-[10px] font-bold" style={{ color: VS_COLOR }}>VS</span>
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
