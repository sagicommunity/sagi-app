import { useState } from 'react';
import { ChevronLeft, Search, Star, ShoppingBag, Repeat2, Zap, X, Calendar, CheckSquare, Newspaper, Info, Users, Coffee, Briefcase } from 'lucide-react';
import { Link } from 'react-router';

const HANI_GRADIENT = 'linear-gradient(135deg, #F5C400 0%, #E6A800 50%, #CC8F00 100%)';
const HANI_DARK_BG  = 'linear-gradient(to bottom, #3A2E00, #1A1500)';

type Tab = 'bonuses' | 'offers' | 'cross' | 'stamps' | 'events' | 'tasks' | 'news' | 'info' | 'vacancies' | 'connections';

const USER = { bonuses: 1240, cashback: 5.0 };

const CATEGORIES = [
  { id: 'cake',     name: 'Торты' },
  { id: 'coffee',   name: 'Кофе' },
  { id: 'dessert',  name: 'Десерты' },
  { id: 'drinks',   name: 'Напитки' },
  { id: 'catering', name: 'Кейтеринг' },
];

const OFFERS = [
  { id: 1, title: '-20% на всё меню', business: 'Hani Kitchen', category: 'cake' },
  { id: 2, title: 'Кофе в подарок',   business: 'Hani Café',    category: 'coffee' },
];

const BUSINESSES = [
  { name: 'Master Coffee', label: 'Кофейня',      photo: '/master-coffee.jpeg' },
  { name: 'Tours',         label: 'Путешествия',  photo: '/tours.jpeg' },
  { name: 'Burabay Trips', label: 'Туры в Бурабай', photo: '/burabay.jpeg' },
  { name: 'Happy Cake',    label: 'Кондитерская', photo: '/happy-cake.jpeg' },
];

const CROSS_BONUSES = [
  { id: 1, name: 'Chez Georges',  category: 'Ресторан',    bonus: '3%', color: '#CC8F00', photo: '/chez-georges.jpeg' },
  { id: 2, name: 'Rafe Beauty',   category: 'Спа',         bonus: '5%', color: '#E040FB', photo: '/rafe-beauty.jpeg' },
  { id: 3, name: 'Ana Flowers',   category: 'Ретейл',      bonus: '2%', color: '#FF6D00', photo: '/ana-flowers.jpeg' },
  { id: 4, name: 'Master Coffee', category: 'Кофейня',     bonus: '4%', color: '#00BCD4', photo: '/master-coffee.jpeg' },
  { id: 5, name: 'Bronx Fitness', category: 'Фитнес',      bonus: '3%', color: '#43A047', photo: '/bronx-fitness.jpeg' },
  { id: 6, name: 'AIFC Academy',  category: 'Образование', bonus: '2%', color: '#F4511E', photo: '/aifc-academy.jpeg' },
];

const STAMP_CARDS = [
  {
    id: 1,
    business: 'hani · Кофе',
    photo: '/hani.jpeg',
    reward: 'Кофе в подарок',
    total: 10,
    collected: 7,
  },
  {
    id: 2,
    business: 'hani · Десерты',
    photo: '/hani.jpeg',
    reward: 'Десерт в подарок',
    total: 8,
    collected: 3,
  },
];

const EVENTS = [
  {
    id: 1, title: 'Мастер-класс по тортам', date: 'Сб, 19 апр · 11:00',
    location: 'Hani Kitchen, Астана', photo: '/hani-masterclass.jpeg',
    friends: [{ initials: 'KD', color: '#f06ac8' }, { initials: 'AB', color: '#7c6af0' }],
  },
  {
    id: 2, title: 'Дегустация новых десертов', date: 'Вс, 20 апр · 14:00',
    location: 'Hani Café, ТРЦ Mega', photo: '/hani-tasting.jpeg',
    friends: [{ initials: 'DS', color: '#f06a6a' }],
  },
  {
    id: 3, title: 'Розыгрыш среди участников hani', date: 'Пт, 25 апр · 18:00',
    location: 'Instagram Live', photo: '/hani-giveaway.jpeg',
    friends: [],
  },
];

const TASKS = [
  { id: 1, title: 'Купи кофе 3 раза за месяц', reward: '+50 бонусов', done: false },
  { id: 2, title: 'Оставь отзыв в Instagram', reward: '+30 бонусов', done: false },
  { id: 3, title: 'Пригласи друга в hani', reward: '+100 бонусов', done: true },
  { id: 4, title: 'Заполни профиль', reward: '+20 бонусов', done: true },
  { id: 5, title: 'Попробуй новинку меню', reward: '+40 бонусов', done: false },
];

const NEWS = [
  {
    id: 1, author: 'hani', time: '2ч назад',
    text: 'Новый вкус капучино с карамелью уже доступен во всех наших кофейнях! Попробуй и получи +20 бонусов.',
    image: '/master-coffee.jpeg',
  },
  {
    id: 2, author: 'hani Events', time: '1д назад',
    text: 'Записывайтесь на мастер-класс по украшению тортов 19 апреля. Места ограничены — только для участников клуба.',
    image: '/happy-cake.jpeg',
  },
  {
    id: 3, author: 'hani', time: '3д назад',
    text: 'Мы открыли новую точку в ТРЦ Mega! Приходи и получи приветственный кофе в подарок при первом посещении.',
    image: '/hani.jpeg',
  },
];

const CONNECTIONS = [
  { id: 1, name: 'Aigerim Bekova',  role: 'Кондитер',      photo: '/conn-aigerim.jpeg', visits: 14 },
  { id: 2, name: 'Dauren Seitkali', role: 'Бариста',       photo: '/conn-dauren.jpeg',  visits: 9  },
  { id: 3, name: 'Kamila Dosova',   role: 'Маркетолог',    photo: '/conn-kamila.jpeg',  visits: 6  },
  { id: 4, name: 'Arman Bekzhan',   role: 'Дизайнер',      photo: '/conn-arman.jpeg',   visits: 17 },
  { id: 5, name: 'Alina Sova',      role: 'Event Manager', photo: '/conn-alina.jpeg',   visits: 11 },
];

const VACANCIES = [
  { id: 1, title: 'Бариста', location: 'Hani Café · Mega', type: 'Полная занятость', photo: '/vacancy-barista.jpeg', link: 'https://hanicc.kz' },
  { id: 2, title: 'Кондитер', location: 'Hani Kitchen, Астана', type: 'Полная занятость', photo: '/vacancy-konditer.jpeg', link: 'https://hanicc.kz' },
  { id: 3, title: 'Менеджер зала', location: 'Hani Café · Khan Shatyr', type: 'Частичная', photo: '/vacancy-manager.jpeg', link: 'https://hanicc.kz' },
  { id: 4, title: 'SMM-специалист', location: 'Удалённо', type: 'Проект', photo: '/vacancy-smm.jpeg', link: 'https://hanicc.kz' },
];

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: 'bonuses',     label: 'Бонусы',     icon: Star        },
  { key: 'offers',      label: 'Офферы',     icon: ShoppingBag },
  { key: 'cross',       label: 'Кросс',      icon: Repeat2     },
  { key: 'stamps',      label: 'Штампики',   icon: Coffee      },
  { key: 'events',      label: 'События',    icon: Calendar    },
  { key: 'tasks',       label: 'Задания',    icon: CheckSquare },
  { key: 'news',        label: 'Новости',    icon: Newspaper   },
  { key: 'info',        label: 'Инфо',       icon: Info        },
  { key: 'vacancies',   label: 'Вакансии',   icon: Briefcase   },
  { key: 'connections', label: 'Контакты',   icon: Users       },
];

export function HaniCommunity() {
  const [tab, setTab]                    = useState<Tab>('bonuses');
  const [searchQuery, setSearchQuery]    = useState('');
  const [selectedCategory, setCategory] = useState('all');
  const [showBusinesses, setShowBusinesses] = useState(false);
  const [bizSearch, setBizSearch]           = useState('');
  const [taskDone, setTaskDone]             = useState<Set<number>>(new Set());
  const [rsvped, setRsvped]                 = useState<Set<number>>(new Set());

  const filteredOffers = OFFERS.filter(o => {
    const matchCat    = selectedCategory === 'all' || o.category === selectedCategory;
    const matchSearch = o.business.toLowerCase().includes(searchQuery.toLowerCase()) || o.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredBiz = BUSINESSES.filter(b =>
    b.name.toLowerCase().includes(bizSearch.toLowerCase()) ||
    b.label.toLowerCase().includes(bizSearch.toLowerCase())
  );

  const tabStyle = (key: Tab) => tab === key ? { background: HANI_GRADIENT } : {};
  const tabClass = (key: Tab, extra = '') =>
    `flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${extra} ${
      tab === key ? 'text-[#1A1500]' : 'bg-input-background text-muted-foreground hover:text-foreground'
    }`;
  const chipStyle = (active: boolean) => active ? { background: HANI_GRADIENT } : {};
  const chipClass = (active: boolean) =>
    `px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
      active ? 'text-[#1A1500]' : 'bg-input-background text-foreground'
    }`;

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* ─── HEADER ─── */}
      <div className="px-4 pt-4 pb-5" style={{ background: HANI_DARK_BG }}>
        <div className="max-w-md mx-auto">
          <Link to="/user" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl bg-white overflow-hidden mb-2 shadow-lg flex items-center justify-center p-1.5">
              <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover rounded-xl" />
            </div>
            <h1 className="text-white font-bold text-lg leading-tight">hani</h1>
            <p className="text-white/70 text-xs mt-0.5 font-medium">Сеть кондитерских-кофеен в Астане</p>
            <button
              onClick={() => setShowBusinesses(true)}
              className="text-white/50 text-xs mt-1 hover:text-white transition-colors"
            >
              4 партнёра
            </button>
          </div>
        </div>
      </div>

      {/* ─── DESCRIPTION ─── */}
      <div className="max-w-md mx-auto px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
          Hani - сладкий путь к успеху. Сеть кондитерских в Астане, покорившая всех своими фирменными тортами и десертами.
        </p>
        <a href="https://hanicc.kz" target="_blank" rel="noopener noreferrer" className="text-xs text-[#CC8F00] hover:underline font-medium mt-1 inline-block">
          hanicc.kz
        </a>
      </div>

      {/* ─── TABS ─── */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-1.5">
            {TABS.map((tb, idx) => {
              const isLastOdd = TABS.length % 2 !== 0 && idx === TABS.length - 1;
              return (
                <button
                  key={tb.key}
                  onClick={() => { setTab(tb.key); setSearchQuery(''); setCategory('all'); }}
                  className={tabClass(tb.key, isLastOdd ? 'col-span-2' : '')}
                  style={tabStyle(tb.key)}
                >
                  <tb.icon className="w-3 h-3" />
                  {tb.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4">

        {/* ══ МОИ БОНУСЫ ══ */}
        {tab === 'bonuses' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star size={15} className="text-yellow-500" fill="currentColor" />
                  <span className="text-sm font-bold">Уровень: Silver</span>
                </div>
                <span className="text-xs text-muted-foreground">760 / 2000</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-2 rounded-full" style={{ width: '38%', background: HANI_GRADIENT }} />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Ещё 1 240 бонусов до уровня Gold - кэшбэк вырастет до 7%
              </p>
            </div>

            <div className="relative rounded-3xl overflow-hidden p-5" style={{ background: HANI_GRADIENT, color: '#1A1500' }}>
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-black/5" />
              <div className="absolute -right-4 bottom-0 w-24 h-24 rounded-full bg-black/5" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm font-black">hani</span>
                </div>
                <div className="flex items-end gap-3 mb-1">
                  <span className="text-5xl font-black tracking-tight">{USER.bonuses.toLocaleString()}</span>
                  <span className="text-lg font-semibold opacity-60 mb-1">бонусов</span>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <div className="bg-black/10 rounded-lg px-2.5 py-1 text-xs font-bold">{USER.cashback}% кэшбэк</div>
                  <div className="bg-black/10 rounded-lg px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                    <Zap size={10} />Активен
                  </div>
                </div>
              </div>
              <div className="absolute right-5 bottom-4 text-5xl opacity-80 select-none">🐙</div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Заработано', value: '3 200' },
                { label: 'Потрачено',  value: '1 960' },
                { label: 'Истекает',   value: '15 мая' },
              ].map(s => (
                <div key={s.label} className="bg-card border border-border rounded-2xl p-3 text-center">
                  <div className="text-base font-black text-foreground">{s.value}</div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ОФФЕРЫ ══ */}
        {tab === 'offers' && (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Поиск офферов..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input-background rounded-xl border border-border focus:border-[#CC8F00] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mb-3">
              <button onClick={() => setCategory('all')} className={chipClass(selectedCategory === 'all')} style={chipStyle(selectedCategory === 'all')}>Все</button>
              {CATEGORIES.map(cat => (
                <button key={cat.id} onClick={() => setCategory(cat.id)} className={chipClass(selectedCategory === cat.id)} style={chipStyle(selectedCategory === cat.id)}>
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filteredOffers.map(offer => (
                <Link key={offer.id} to="/user/offer/1" className="flex flex-col bg-card border border-border rounded-2xl p-3 hover:border-[#CC8F00] transition-colors">
                  <div className="w-10 h-10 rounded-xl overflow-hidden mb-2 flex-shrink-0">
                    <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-xs font-semibold leading-tight mb-1 line-clamp-1">{offer.business}</h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-1">{offer.title}</p>
                  <span className="inline-flex items-center text-[10px] px-2 py-0.5 rounded-full self-start" style={{ background: '#CC8F0020', color: '#CC8F00' }}>
                    Активен
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ══ КРОСС БОНУСЫ ══ */}
        {tab === 'cross' && (
          <>
            <div className="grid grid-cols-3 gap-2.5">
              {CROSS_BONUSES.map(b => (
                <div key={b.id} className="rounded-2xl overflow-hidden flex flex-col cursor-pointer border border-transparent hover:border-yellow-300 transition-all bg-card">
                  <div className="w-full aspect-square overflow-hidden">
                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-2 text-center">
                    <div className="text-[11px] font-bold text-foreground leading-tight">{b.name}</div>
                    <div className="text-sm font-black mt-0.5" style={{ color: b.color }}>+{b.bonus}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ ШТАМПИКИ ══ */}
        {tab === 'stamps' && (
          <div className="space-y-4">
            <p className="text-xs text-muted-foreground leading-relaxed">
              Собирай штампики при каждом посещении — и получай подарки от hani.
            </p>
            {STAMP_CARDS.map(card => {
              const done = card.collected >= card.total;
              return (
                <div key={card.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                  {/* Header */}
                  <div className="flex items-center gap-3 p-4 pb-3">
                    <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={card.photo} alt={card.business} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold">{card.business}</p>
                      <p className="text-xs text-muted-foreground">Награда: {card.reward}</p>
                    </div>
                    {done && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-[#1A1500]" style={{ background: HANI_GRADIENT }}>
                        Готово!
                      </span>
                    )}
                  </div>

                  {/* Stamp grid */}
                  <div className="px-4 pb-4">
                    <div className="grid grid-cols-5 gap-2 mb-3">
                      {Array.from({ length: card.total }).map((_, i) => {
                        const filled = i < card.collected;
                        return (
                          <div
                            key={i}
                            className="aspect-square rounded-xl flex items-center justify-center border-2 transition-all"
                            style={filled
                              ? { background: HANI_GRADIENT, borderColor: '#CC8F00' }
                              : { borderColor: 'var(--border)', background: 'var(--input-background)' }
                            }
                          >
                            {filled
                              ? <Coffee className="w-4 h-4 text-[#1A1500]" />
                              : <Coffee className="w-4 h-4 text-muted-foreground opacity-30" />
                            }
                          </div>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{card.collected} из {card.total} штампов</span>
                      {done
                        ? <span className="text-xs font-bold" style={{ color: '#CC8F00' }}>Заберите подарок!</span>
                        : <span className="text-xs text-muted-foreground">Ещё {card.total - card.collected}</span>
                      }
                    </div>
                    {/* Progress bar */}
                    <div className="w-full bg-muted rounded-full h-1.5 mt-2 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full transition-all"
                        style={{ width: `${(card.collected / card.total) * 100}%`, background: HANI_GRADIENT }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
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
                  <div className="flex gap-3 mb-0">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-0.5">{ev.title}</p>
                      <p className="text-xs text-muted-foreground mb-0.5">{ev.date}</p>
                      <p className="text-xs text-muted-foreground">{ev.location}</p>
                    </div>
                  </div>
                  {ev.friends.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex -space-x-2">
                        {ev.friends.map(f => (
                          <div key={f.initials} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card"
                            style={{ background: f.color + '30', color: f.color }}>
                            {f.initials}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">из твоих контактов идут</p>
                    </div>
                  )}
                  <button
                    onClick={() => setRsvped(prev => { const s = new Set(prev); gone ? s.delete(ev.id) : s.add(ev.id); return s; })}
                    className="mt-3 w-full py-2 rounded-xl text-sm font-medium transition-colors"
                    style={gone ? { background: HANI_GRADIENT, color: '#1A1500' } : { background: '#CC8F0015', color: '#CC8F00' }}
                  >
                    {gone ? 'Записался ✓' : 'Записаться'}
                  </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ ЗАДАНИЯ ══ */}
        {tab === 'tasks' && (
          <div className="space-y-3">
            <div className="rounded-2xl p-3 flex items-center gap-3 mb-1" style={{ background: '#CC8F0015' }}>
              <Star size={16} style={{ color: '#CC8F00' }} fill="#CC8F00" />
              <p className="text-xs font-medium" style={{ color: '#CC8F00' }}>
                Выполняй задания и копи бонусы быстрее
              </p>
            </div>
            {TASKS.map(task => {
              const done = taskDone.has(task.id) || task.done;
              return (
                <div key={task.id} className={`bg-card border rounded-2xl p-4 flex items-center gap-3 ${done ? 'border-[#CC8F00]/30 opacity-70' : 'border-border'}`}>
                  <button
                    onClick={() => !task.done && setTaskDone(prev => {
                      const s = new Set(prev);
                      done ? s.delete(task.id) : s.add(task.id);
                      return s;
                    })}
                    className="w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors"
                    style={done ? { background: HANI_GRADIENT, borderColor: '#CC8F00' } : { borderColor: 'var(--muted-foreground)' }}
                  >
                    {done && <span className="text-[#1A1500] text-xs font-bold">✓</span>}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap font-medium" style={{ background: '#CC8F0015', color: '#CC8F00' }}>
                    {task.reward}
                  </span>
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
                <img src={post.image} alt="" className="w-full h-40 object-cover" />
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full overflow-hidden">
                        <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover" />
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

        {/* ══ ИНФО ══ */}
        {tab === 'info' && (
          <div className="space-y-4">
            <div className="bg-card border border-border rounded-2xl overflow-hidden">
              <img src="/hani.jpeg" alt="hani" className="w-full h-36 object-cover" />
              <div className="p-4">
                <h2 className="font-bold text-base mb-1">hani — сеть кондитерских-кофеен</h2>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                  Hani основана в 2019 году в Астане. Сеть специализируется на авторских тортах, десертах и specialty кофе.
                  Каждый продукт создаётся вручную из натуральных ингредиентов.
                </p>
                <a href="https://hanicc.kz" target="_blank" rel="noopener noreferrer"
                  className="text-xs font-bold hover:underline" style={{ color: '#CC8F00' }}>
                  hanicc.kz
                </a>
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-4 space-y-3">
              <h3 className="text-sm font-bold">Участие в клубе</h3>
              {[
                { icon: '☕', text: 'Каждая покупка — бонусы на счёт' },
                { icon: '🎂', text: 'Эксклюзивные скидки для участников' },
                { icon: '🎁', text: 'Подарки за штампики и задания' },
                { icon: '🤝', text: 'Кросс-бонусы у партнёров hani' },
              ].map(item => (
                <div key={item.icon} className="flex items-center gap-3">
                  <span className="text-lg">{item.icon}</span>
                  <p className="text-sm text-muted-foreground">{item.text}</p>
                </div>
              ))}
            </div>

            <div className="bg-card border border-border rounded-2xl p-4">
              <h3 className="text-sm font-bold mb-3">Наши точки</h3>
              {[
                { name: 'Hani Kitchen', address: 'пр. Мангилик Ел, 55' },
                { name: 'Hani Café · Mega', address: 'ТРЦ Mega, 1 этаж' },
                { name: 'Hani Café · Khan Shatyr', address: 'ТРЦ Khan Shatyr, 2 этаж' },
              ].map(loc => (
                <div key={loc.name} className="flex items-start gap-2 mb-2 last:mb-0">
                  <span className="text-[#CC8F00] mt-0.5">📍</span>
                  <div>
                    <p className="text-sm font-medium">{loc.name}</p>
                    <p className="text-xs text-muted-foreground">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══ ВАКАНСИИ ══ */}
        {tab === 'vacancies' && (
          <div className="space-y-3">
            {VACANCIES.map(v => (
              <div key={v.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                <img src={v.photo} alt={v.title} className="w-full h-36 object-cover" />
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm">{v.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{v.location}</p>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0 mt-0.5" style={{ background: '#CC8F0015', color: '#CC8F00' }}>
                      {v.type}
                    </span>
                  </div>
                  <a
                    href={v.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full py-2 rounded-xl text-sm font-medium text-center transition-colors"
                    style={{ background: HANI_GRADIENT, color: '#1A1500' }}
                  >
                    Откликнуться
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══ КОНТАКТЫ (CONNECTIONS) ══ */}
        {tab === 'connections' && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground">
              Твои контакты, которые тоже посещают hani
            </p>
            {CONNECTIONS.map(person => (
              <div key={person.id} className="flex items-center gap-3 bg-card border border-border rounded-2xl p-3">
                <img
                  src={person.photo}
                  alt={person.name}
                  className="w-11 h-11 rounded-full object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.role}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold" style={{ color: '#CC8F00' }}>{person.visits}</p>
                  <p className="text-[10px] text-muted-foreground">визитов</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ─── BUSINESSES MODAL ─── */}
      {showBusinesses && (
        <div
          className="fixed inset-0 z-50 flex flex-col justify-end items-center"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
          onClick={() => { setShowBusinesses(false); setBizSearch(''); }}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl flex flex-col"
            style={{ maxHeight: '85vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
              <div>
                <h2 className="text-base font-semibold">Партнёры hani</h2>
                <p className="text-xs text-muted-foreground">{BUSINESSES.length} партнёров</p>
              </div>
              <button
                onClick={() => { setShowBusinesses(false); setBizSearch(''); }}
                className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 pt-3 pb-2 shrink-0">
              <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-input-background">
                <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  type="text"
                  placeholder="Поиск партнёров..."
                  value={bizSearch}
                  onChange={e => setBizSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
                />
                {bizSearch && (
                  <button onClick={() => setBizSearch('')} className="text-muted-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-y-auto flex-1 px-4 pb-8 pt-2 space-y-2">
              {filteredBiz.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-10">Ничего не найдено</p>
              )}
              {filteredBiz.map(b => (
                <div key={b.name} className="flex items-center gap-3 bg-input-background rounded-2xl px-3 py-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-muted">
                    <img src={b.photo} alt={b.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{b.name}</p>
                    <p className="text-xs text-muted-foreground">{b.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
