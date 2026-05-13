import { useState } from 'react';
import { ChevronLeft, Search, ShoppingBag, Calendar, Newspaper, MapPin, Users, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

const HV_GRADIENT = 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)';
const HV_DARK_BG  = 'linear-gradient(to bottom, #0C1B2E, #0A1628)';
const HV_COLOR    = '#3B82F6';

type Tab = 'offers' | 'events' | 'news';

const OFFERS = [
  {
    id: 1, business: 'Tap Tatti', businessType: 'restaurant' as const,
    category: 'Ресторан', discount: '-10% на всё меню',
    photo: '/tap-tatti.jpeg', tag: 'Еда',
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
    id: 1, title: 'Добро пожаловать в Highvill Isim!', date: 'Сб, 26 апр · 12:00',
    location: 'Лобби, 1 этаж', photo: '/delish.jpeg',
  },
  {
    id: 2, title: 'Дегустация от Tap Tatti', date: 'Вс, 27 апр · 14:00',
    location: 'Tap Tatti, ЖК Highvill Isim', photo: '/tap-tatti.jpeg',
  },
];

const ANNOUNCEMENTS = [
  {
    id: 1, name: 'Камила Д.', initials: 'КД', color: '#f06ac8', time: '15 мин назад',
    tag: 'Продаю', tagColor: '#10b981',
    text: 'Продаю диван-кровать, почти новый. 55 000 ₸, торг. Самовывоз, 4 этаж башня A.',
    role: 'Дизайнер интерьеров', location: 'Астана · Башня A, эт. 4',
    tags: ['Дизайн', 'Интерьер', 'Highvill'],
    bio: 'Дизайнер интерьеров, живёт в Highvill Isim. Занимается оформлением квартир под ключ.',
    aiSummary: ['Специализируется на жилых интерьерах премиум-класса.', 'Активный участник соседского сообщества.', 'Открыта к сотрудничеству с соседями по вопросам ремонта и дизайна.'] as [string, string, string],
    mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'],
    whatsapp: '77001234561', telegram: 'kamila_d',
  },
  {
    id: 2, name: 'Арман Б.', initials: 'АБ', color: '#7c6af0', time: '2ч назад',
    tag: 'Ищу', tagColor: '#f59e0b',
    text: 'Ищу кота или кошку в добрые руки. Есть опыт, живём в 2-комнатной. Напишите если отдаёте.',
    role: 'IT-разработчик', location: 'Астана · Башня B, эт. 7',
    tags: ['IT', 'Технологии', 'Highvill'],
    bio: 'Разработчик в финтех-компании. Живёт в Highvill Isim с 2023 года.',
    aiSummary: ['Технический специалист с опытом в финтех-сфере.', 'Активный житель сообщества, участвует в локальных чатах.', 'Полезный контакт для IT-вопросов среди соседей.'] as [string, string, string],
    mutualCount: 2, mutualNames: ['Камила Д.', 'Ержан К.'],
    whatsapp: '77001234562', telegram: 'arman_b',
  },
  {
    id: 3, name: 'Жанара М.', initials: 'ЖМ', color: '#f06a6a', time: '4ч назад',
    tag: 'Вопрос', tagColor: '#64748b',
    text: 'Когда заработает детская площадка у башни B? Уже месяц стоит закрытая, дети расстроены.',
    role: 'Педиатр', location: 'Астана · Башня B, эт. 12',
    tags: ['Медицина', 'Дети', 'Здоровье'],
    bio: 'Врач-педиатр в частной клинике. Мама двух детей, активно участвует в жизни ЖК.',
    aiSummary: ['Педиатр с 8-летним опытом в детской медицине.', 'Инициативный житель — часто поднимает важные вопросы по ЖК.', 'Полезный контакт для семей с детьми в Highvill Isim.'] as [string, string, string],
    mutualCount: 1, mutualNames: ['Сауле Н.'],
    whatsapp: '77001234563', telegram: 'zhanara_m',
  },
  {
    id: 4, name: 'Тимур О.', initials: 'ТО', color: '#0ea5e9', time: 'Вчера',
    tag: 'Услуги', tagColor: '#8b5cf6',
    text: 'Предлагаю услуги репетитора по математике для школьников 5–11 классов. Живу в ЖК, первое занятие бесплатно.',
    role: 'Преподаватель математики', location: 'Астана · Башня C, эт. 9',
    tags: ['Образование', 'Математика', 'Репетитор'],
    bio: 'Преподаватель математики с 12-летним стажем. Работает с учениками 5–11 классов.',
    aiSummary: ['Опытный репетитор с высоким процентом поступления учеников в топ-вузы.', 'Проводит занятия очно в ЖК — удобно для соседей.', 'Первое пробное занятие бесплатно.'] as [string, string, string],
    mutualCount: 2, mutualNames: ['Камила Д.', 'Арман Б.'],
    whatsapp: '77001234564', telegram: 'timur_o',
  },
  {
    id: 5, name: 'Сауле Н.', initials: 'СН', color: '#f97316', time: 'Вчера',
    tag: 'Отдаю', tagColor: '#6366f1',
    text: 'Отдаю детские книги и игрушки, дочь выросла. Всё чистое, в хорошем состоянии. Звоните!',
    role: 'Маркетолог', location: 'Астана · Башня A, эт. 6',
    tags: ['Маркетинг', 'SMM', 'Бренды'],
    bio: 'Маркетолог в сфере FMCG. Мама, живёт в Highvill с семьёй.',
    aiSummary: ['Специалист по продвижению брендов с 6-летним опытом.', 'Активный участник соседского сообщества.', 'Открыта к неформальному общению и обмену вещами.'] as [string, string, string],
    mutualCount: 2, mutualNames: ['Жанара М.', 'Камила Д.'],
    whatsapp: '77001234565', telegram: 'saule_n',
  },
  {
    id: 6, name: 'Ержан К.', initials: 'ЕК', color: '#14b8a6', time: '2д назад',
    tag: 'Продаю', tagColor: '#10b981',
    text: 'Продаю паркинговое место на подземной парковке, блок C. Документы готовы. 2 500 000 ₸.',
    role: 'Финансовый аналитик', location: 'Астана · Башня C, эт. 15',
    tags: ['Финансы', 'Инвестиции', 'Недвижимость'],
    bio: 'Финансовый аналитик, специализируется на инвестициях в недвижимость Астаны.',
    aiSummary: ['Глубокая экспертиза в оценке жилой недвижимости.', 'Полезен для соседей, интересующихся доходной недвижимостью.', 'Один из наиболее информированных жителей по вопросам рынка.'] as [string, string, string],
    mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'],
    whatsapp: '77001234566', telegram: 'erzhan_k',
  },
];

const TABS: { key: Tab; label: string; icon: typeof ShoppingBag }[] = [
  { key: 'offers', label: 'Офферы',   icon: ShoppingBag },
  { key: 'events', label: 'События',  icon: Calendar    },
  { key: 'news',   label: 'Новости',  icon: Newspaper   },
];

export function HighvillCommunity() {
  const [tab, setTab]             = useState<Tab>('offers');
  const [search, setSearch]       = useState('');
  const [rsvped, setRsvped]       = useState<Set<number>>(new Set());
  const [contactCard, setContactCard] = useState<typeof ANNOUNCEMENTS[0] | null>(null);
  const [connected, setConnected]     = useState<Set<number>>(new Set());

  const filtered = OFFERS.filter(o =>
    o.business.toLowerCase().includes(search.toLowerCase()) ||
    o.discount.toLowerCase().includes(search.toLowerCase())
  );

  const tabStyle = (key: Tab) => tab === key ? { background: HV_GRADIENT } : {};
  const tabClass = (key: Tab, extra = '') =>
    `flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${extra} ${
      tab === key ? 'text-white' : 'bg-input-background text-muted-foreground hover:text-foreground'
    }`;

  return (
    <>
    <div className="min-h-screen bg-background pb-20">

      {/* ─── HEADER ─── */}
      <div className="px-4 pt-4 pb-6" style={{ background: HV_DARK_BG }}>
        <div className="max-w-md mx-auto">
          <Link to="/user" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="w-16 h-16 rounded-2xl overflow-hidden mb-3 shadow-lg">
              <img src="/highvill-isim.jpeg" alt="Highvill Isim" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-white font-bold text-lg leading-tight">Highvill Isim</h1>
            <p className="text-white/60 text-xs mt-0.5">Жилой комплекс · Астана</p>
            <div className="flex items-center gap-1 mt-1.5 text-white/40 text-xs">
              <MapPin className="w-3 h-3" />
              <span>ул. Шамши Калдаякова 3</span>
            </div>
            <Link
              to="/user/network?community=Highvill"
              className="flex items-center gap-1.5 mt-3 px-4 py-1.5 rounded-full text-xs font-medium transition-opacity hover:opacity-80"
              style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.8)' }}
            >
              <Users className="w-3.5 h-3.5" />
              324 участника
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
                style={{ '--tw-ring-color': HV_COLOR } as React.CSSProperties}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(offer => (
                <Link key={offer.id} to={`/user/offer/${offer.id}`}
                  state={{ business: offer.business, businessType: offer.businessType, category: offer.category, discount: offer.discount, photo: offer.photo, color: HV_COLOR, gradient: HV_GRADIENT, joinStatus: 'member' }}
                  className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-[#3B82F6] transition-colors">
                  <img src={offer.photo} alt={offer.business} className="w-full h-24 object-cover" />
                  <div className="p-3 flex flex-col flex-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full self-start mb-1.5"
                      style={{ background: `${HV_COLOR}20`, color: HV_COLOR }}>
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
                      style={{ background: gone ? '#10b981' : HV_GRADIENT }}
                    >
                      {gone ? 'Записался ✓' : 'Записаться'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ══ ОБЪЯВЛЕНИЯ ══ */}
        {tab === 'news' && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground mb-3">Объявления от жителей Highvill Isim</p>
            {ANNOUNCEMENTS.map(post => (
              <div key={post.id} className="bg-card border border-border rounded-2xl p-3.5">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => setContactCard(post)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 active:opacity-80"
                    style={{ background: post.color }}
                  >
                    {post.initials}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <button onClick={() => setContactCard(post)} className="text-xs font-semibold truncate hover:underline text-left">
                        {post.name}
                      </button>
                      <p className="text-[10px] text-muted-foreground whitespace-nowrap">{post.time}</p>
                    </div>
                    <p className="text-sm text-foreground leading-snug mb-2">{post.text}</p>
                    <span
                      className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full text-white"
                      style={{ background: post.tagColor }}
                    >
                      {post.tag}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>

    {/* ─── CONTACT CARD (Network style) ─── */}
    {contactCard && (
      <div
        className="fixed inset-0 z-50 flex flex-col justify-end items-center"
        onClick={() => setContactCard(null)}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div
          className="relative bg-card rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto w-full max-w-md"
          onClick={e => e.stopPropagation()}
        >
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
          <button
            onClick={() => setContactCard(null)}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
              style={{ background: contactCard.color + '20', border: `2px solid ${contactCard.color}`, color: contactCard.color }}
            >
              {contactCard.initials}
            </div>
            <div>
              <div className="font-bold text-base text-foreground">{contactCard.name}</div>
              <div className="text-sm text-muted-foreground mt-0.5">{contactCard.role}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{contactCard.location}</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                <span className="font-medium text-foreground">{contactCard.mutualCount}</span> общих соседа
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-5">
            {contactCard.tags.map(tag => (
              <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
                {tag}
              </span>
            ))}
          </div>

          {/* AI Summary */}
          <div className="bg-muted/40 rounded-2xl p-4 mb-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
              <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
            </div>
            <ul className="space-y-2">
              {contactCard.aiSummary.map((line, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: contactCard.color }} />
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* Reach via */}
          <p className="text-xs text-muted-foreground mb-5">
            Общие соседи:{' '}
            <span className="text-foreground font-medium">{contactCard.mutualNames.join(', ')}</span>
          </p>

          {/* Social buttons */}
          <div className="flex gap-2 mb-3">
            <a
              href={`https://wa.me/${contactCard.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-xs font-semibold"
              style={{ background: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
              WhatsApp
            </a>
            <a
              href={`https://t.me/${contactCard.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-2xl text-white text-xs font-semibold"
              style={{ background: '#2AABEE' }}
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              Telegram
            </a>
          </div>

          {/* Connect button */}
          <button
            onClick={() => {
              setConnected(prev => { const s = new Set(prev); connected.has(contactCard.id) ? s.delete(contactCard.id) : s.add(contactCard.id); return s; });
              if (!connected.has(contactCard.id)) setContactCard(null);
            }}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
            style={{ background: contactCard.color }}
          >
            {connected.has(contactCard.id) ? '⏳ Pending' : '+ Connect'}
          </button>
        </div>
      </div>
    )}
    </>
  );
}
