import { useState } from 'react';
import { ChevronLeft, Search, X, ShieldCheck, Users, Clock, MessageCircle, Plus, ImagePlus, ChevronDown, MapPin, Sparkles } from 'lucide-react';
import { Link } from 'react-router';

const HV_COLOR    = '#3B82F6';
const HV_GRADIENT = 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 50%, #1E40AF 100%)';

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = 'all' | 'tickets' | 'electronics' | 'home' | 'transport' | 'services' | 'rentals';

interface Seller {
  name: string;
  initials: string;
  color: string;
  tower: string;
  joinYear: number;
  role: string;
  tags: string[];
  aiSummary: [string, string, string];
  whatsapp: string;
  telegram: string;
}

interface Listing {
  id: number;
  category: Category;
  title: string;
  price: string;
  priceNote?: string;
  seller: Seller;
  mutualCount: number;
  mutualNames: string[];
  expiresInDays: number;
  tag: string;
  description: string;
  photo?: string;
  isUrgent?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const S = {
  KD: { name: 'Камила Д.', initials: 'КД', color: '#f06ac8', tower: 'Башня A', joinYear: 2022,
    role: 'Дизайнер интерьеров', tags: ['Дизайн', 'Интерьер', 'Highvill'],
    aiSummary: ['Специализируется на жилых интерьерах премиум-класса.', 'Активный участник соседского сообщества.', 'Открыта к сотрудничеству по вопросам ремонта и дизайна.'] as [string,string,string],
    whatsapp: '77001234561', telegram: 'kamila_d' },
  AB: { name: 'Арман Б.', initials: 'АБ', color: '#7c6af0', tower: 'Башня B', joinYear: 2023,
    role: 'IT-разработчик', tags: ['IT', 'Технологии', 'Highvill'],
    aiSummary: ['Технический специалист с опытом в финтех-сфере.', 'Активный житель, участвует в локальных чатах.', 'Полезный контакт для IT-вопросов среди соседей.'] as [string,string,string],
    whatsapp: '77001234562', telegram: 'arman_b' },
  ZM: { name: 'Жанара М.', initials: 'ЖМ', color: '#f06a6a', tower: 'Башня B', joinYear: 2023,
    role: 'Педиатр', tags: ['Медицина', 'Дети', 'Здоровье'],
    aiSummary: ['Педиатр с 8-летним опытом в детской медицине.', 'Инициативный житель — часто поднимает важные вопросы по ЖК.', 'Полезный контакт для семей с детьми.'] as [string,string,string],
    whatsapp: '77001234563', telegram: 'zhanara_m' },
  TO: { name: 'Тимур О.', initials: 'ТО', color: '#0ea5e9', tower: 'Башня C', joinYear: 2021,
    role: 'Преподаватель математики', tags: ['Образование', 'Математика', 'Репетитор'],
    aiSummary: ['Опытный репетитор — высокий процент поступления в топ-вузы.', 'Проводит занятия очно в ЖК — удобно для соседей.', 'Первое пробное занятие бесплатно.'] as [string,string,string],
    whatsapp: '77001234564', telegram: 'timur_o' },
  SN: { name: 'Сауле Н.', initials: 'СН', color: '#f97316', tower: 'Башня A', joinYear: 2022,
    role: 'Маркетолог', tags: ['Маркетинг', 'SMM', 'Бренды'],
    aiSummary: ['Специалист по продвижению брендов с 6-летним опытом.', 'Активный участник соседского сообщества.', 'Открыта к неформальному общению и обмену вещами.'] as [string,string,string],
    whatsapp: '77001234565', telegram: 'saule_n' },
  EK: { name: 'Ержан К.', initials: 'ЕК', color: '#14b8a6', tower: 'Башня C', joinYear: 2021,
    role: 'Финансовый аналитик', tags: ['Финансы', 'Инвестиции', 'Недвижимость'],
    aiSummary: ['Глубокая экспертиза в оценке жилой недвижимости.', 'Полезен для соседей, интересующихся доходной недвижимостью.', 'Один из наиболее информированных жителей по вопросам рынка.'] as [string,string,string],
    whatsapp: '77001234566', telegram: 'erzhan_k' },
};

const LISTINGS: Listing[] = [
  { id: 1,  category: 'tickets',     seller: S.KD, mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'], expiresInDays: 2,  tag: 'Билеты',      title: '2 билета на Dimash — «Arnau» Tour, 26 апр', price: '45 000 ₸', priceNote: '/шт', description: 'VIP-ряд 3. Брала на двоих, подруга не смогла. Оригиналы, QR-код.', isUrgent: true },
  { id: 2,  category: 'electronics', seller: S.AB, mutualCount: 2, mutualNames: ['Камила Д.', 'Ержан К.'],            expiresInDays: 7,  tag: 'Электроника', title: 'iPhone 13 Pro 256 GB, Sierra Blue',           price: '280 000 ₸',              description: 'Полный комплект, Apple Care до 12.2024. Без царапин.',                    photo: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=600&h=280&fit=crop&q=80' },
  { id: 3,  category: 'home',        seller: S.KD, mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'], expiresInDays: 5,  tag: 'Интерьер',    title: 'Диван-кровать IKEA Friheten, серый',          price: '55 000 ₸',              description: 'Купили год назад. Самовывоз с 4-го этажа, помогу разобрать.' },
  { id: 4,  category: 'services',    seller: S.TO, mutualCount: 2, mutualNames: ['Камила Д.', 'Арман Б.'],            expiresInDays: 30, tag: 'Услуги',      title: 'Репетитор математики — 5–11 класс',           price: '5 000 ₸',  priceNote: '/ч',   description: 'Первое занятие бесплатно. Очно в ЖК. 12 лет опыта, ЕНТ / олимпиады.' },
  { id: 5,  category: 'transport',   seller: S.SN, mutualCount: 2, mutualNames: ['Жанара М.', 'Камила Д.'],           expiresInDays: 10, tag: 'Транспорт',   title: 'Горный велосипед Merida 21-скорость',         price: '85 000 ₸',              description: 'ТО сделано. Новые тормозные колодки. Рост 160–180 см.' },
  { id: 6,  category: 'rentals',     seller: S.EK, mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'], expiresInDays: 14, tag: 'Аренда',      title: 'Паркинговое место — подземный паркинг, блок C', price: '35 000 ₸', priceNote: '/мес', description: 'Стандартное место, видеонаблюдение. Договор на руки. Свободно с 1 мая.' },
  { id: 7,  category: 'electronics', seller: S.ZM, mutualCount: 1, mutualNames: ['Сауле Н.'],                        expiresInDays: 4,  tag: 'Электроника', title: 'MacBook Air M1 13", 8/256 GB, Space Gray',   price: '450 000 ₸',              description: 'Идеальное состояние. Чехол в подарок. Переходник на USB-C в комплекте.' },
  { id: 8,  category: 'tickets',     seller: S.AB, mutualCount: 2, mutualNames: ['Камила Д.', 'Ержан К.'],            expiresInDays: 3,  tag: 'Билеты',      title: 'VIP-билет Tesla Owners Meetup, 1 мая',        price: '15 000 ₸',              description: 'Не смогу прийти. Официальный билет, перенос имени при наличии паспорта.', isUrgent: true },
  { id: 9,  category: 'services',    seller: S.SN, mutualCount: 2, mutualNames: ['Жанара М.', 'Камила Д.'],           expiresInDays: 30, tag: 'Услуги',      title: 'Выгул собак по утрам — в ЖК и парке рядом',  price: '3 000 ₸',  priceNote: '/раз', description: 'Люблю собак. Опыт с лабрадорами и хаски. 7:00–8:30 пн-пт.' },
  { id: 10, category: 'rentals',     seller: S.EK, mutualCount: 3, mutualNames: ['Арман Б.', 'Тимур О.', 'Сауле Н.'], expiresInDays: 30, tag: 'Инструменты', title: 'Перфоратор Bosch + набор свёрл (18 шт.)',     price: '2 000 ₸',  priceNote: '/день', description: 'Профессиональный инструмент. Залог не нужен — соседи свои.' },
];

const CATEGORIES: { key: Category; label: string; emoji: string; color: string }[] = [
  { key: 'all',         label: 'Все',           emoji: '🔍', color: HV_COLOR },
  { key: 'tickets',     label: 'Билеты',        emoji: '🎟',  color: '#ec4899' },
  { key: 'electronics', label: 'Техника',       emoji: '📱',  color: '#8b5cf6' },
  { key: 'home',        label: 'Интерьер',      emoji: '🏠',  color: '#f59e0b' },
  { key: 'transport',   label: 'Транспорт',     emoji: '🚲',  color: '#10b981' },
  { key: 'services',    label: 'Услуги',        emoji: '🤝',  color: '#f97316' },
  { key: 'rentals',     label: 'Аренда',        emoji: '🔑',  color: '#6366f1' },
];

function categoryColor(cat: Category) {
  return CATEGORIES.find(c => c.key === cat)?.color ?? HV_COLOR;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function TrustBadge({ seller, mutualCount, mutualNames }: Pick<Listing, 'seller' | 'mutualCount' | 'mutualNames'>) {
  return (
    <div className="flex flex-wrap gap-1.5 mt-2.5">
      {/* Verified resident */}
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
        style={{ background: `${HV_COLOR}15`, color: HV_COLOR }}>
        <ShieldCheck className="w-2.5 h-2.5" />
        Житель {seller.tower}
      </span>
      {/* Mutual connections */}
      {mutualCount > 0 && (
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: '#10b98115', color: '#10b981' }}>
          <Users className="w-2.5 h-2.5" />
          {mutualCount} общих · {mutualNames[0]}{mutualCount > 1 ? ` +${mutualCount - 1}` : ''}
        </span>
      )}
      {/* Activity score */}
      <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
        <Clock className="w-2.5 h-2.5" />
        с {seller.joinYear}
      </span>
    </div>
  );
}

function ExpiryBar({ days }: { days: number }) {
  const urgent = days <= 3;
  return (
    <div className="flex items-center gap-1 mt-2">
      <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${Math.min(100, (days / 14) * 100)}%`,
            background: urgent ? '#ef4444' : days <= 7 ? '#f59e0b' : '#10b981',
          }}
        />
      </div>
      <span className={`text-[10px] font-medium whitespace-nowrap ${urgent ? 'text-red-500' : 'text-muted-foreground'}`}>
        {urgent ? `⚠ ${days}д осталось` : `${days}д`}
      </span>
    </div>
  );
}

function ListingCard({ listing, onChat, onTrust, onSellerClick }: {
  listing: Listing;
  onChat: (l: Listing) => void;
  onTrust: (l: Listing) => void;
  onSellerClick: (l: Listing) => void;
}) {
  const catColor = categoryColor(listing.category);
  const catMeta  = CATEGORIES.find(c => c.key === listing.category)!;

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Photo */}
      {listing.photo && (
        <div className="relative">
          <img src={listing.photo} alt={listing.title} className="w-full h-44 object-cover" />
          {listing.isUrgent && (
            <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 rounded-lg bg-red-500 text-white shadow">
              СРОЧНО
            </span>
          )}
          <div className="absolute bottom-2 left-2 flex items-baseline gap-1">
            <span className="text-base font-bold text-white drop-shadow-md">{listing.price}</span>
            {listing.priceNote && (
              <span className="text-xs text-white/80 drop-shadow-sm">{listing.priceNote}</span>
            )}
          </div>
        </div>
      )}

      <div className="p-4">
      {/* Top row: emoji + title + price (only when no photo) */}
      <div className="flex items-start gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
          style={{ background: catColor + '18' }}>
          {catMeta.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-semibold leading-snug line-clamp-2 flex-1">{listing.title}</p>
            {!listing.photo && listing.isUrgent && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 shrink-0 mt-0.5">
                СРОЧНО
              </span>
            )}
          </div>
          {!listing.photo && (
            <div className="flex items-baseline gap-1 mt-0.5">
              <span className="text-base font-bold" style={{ color: catColor }}>{listing.price}</span>
              {listing.priceNote && (
                <span className="text-xs text-muted-foreground">{listing.priceNote}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-0">{listing.description}</p>

      {/* Seller row */}
      <div className="flex items-center gap-2 mt-2.5">
        <button
          onClick={() => onSellerClick(listing)}
          className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0 active:opacity-75"
          style={{ background: listing.seller.color }}
        >
          {listing.seller.initials}
        </button>
        <button onClick={() => onSellerClick(listing)} className="text-xs text-muted-foreground hover:underline">
          {listing.seller.name}
        </button>
        <span className="text-muted-foreground/40 text-xs">·</span>
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
          style={{ background: catColor + '12', color: catColor }}>{listing.tag}</span>
      </div>

      {/* Trust badges */}
      <TrustBadge seller={listing.seller} mutualCount={listing.mutualCount} mutualNames={listing.mutualNames} />

      {/* Expiry bar */}
      <ExpiryBar days={listing.expiresInDays} />

      {/* Action buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onChat(listing)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold border border-border text-foreground transition-all active:scale-95"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Написать
        </button>
        <button
          onClick={() => onTrust(listing)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold text-white transition-all active:scale-95"
          style={{ background: HV_GRADIENT }}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Купить с гарантией
        </button>
      </div>
      </div>
    </div>
  );
}

// ─── Chat bottom sheet ─────────────────────────────────────────────────────────

function ChatSheet({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-card rounded-t-3xl p-6 pb-10 w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
            style={{ background: listing.seller.color }}>
            {listing.seller.initials}
          </div>
          <div>
            <p className="font-semibold text-sm">{listing.seller.name}</p>
            <p className="text-xs text-muted-foreground">{listing.seller.tower} · Highvill Isim</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-[#3B82F6]" />
              <span className="text-[10px] text-[#3B82F6] font-medium">Верифицированный житель</span>
            </div>
          </div>
        </div>

        {listing.mutualCount > 0 && (
          <div className="bg-muted/40 rounded-2xl px-4 py-3 mb-5">
            <p className="text-xs font-semibold mb-0.5" style={{ color: '#10b981' }}>
              {listing.mutualCount} общих соседей
            </p>
            <p className="text-xs text-muted-foreground">
              Вы оба знаете: <span className="text-foreground font-medium">{listing.mutualNames.join(', ')}</span>
            </p>
          </div>
        )}

        <p className="text-xs text-muted-foreground mb-4">
          Выберите мессенджер — продавец получит уведомление и ответит в течение нескольких минут.
        </p>

        <div className="flex gap-2">
          <a href={`https://wa.me/${listing.seller.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{ background: '#25D366' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
          <a href={`https://t.me/${listing.seller.telegram}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{ background: '#2AABEE' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Trust Guide bottom sheet ──────────────────────────────────────────────────

function TrustSheet({ listing, onClose }: { listing: Listing; onClose: () => void }) {
  const steps = [
    { icon: '💬', title: 'Свяжитесь с продавцом', body: 'Напишите в WhatsApp или Telegram. Проверьте товар фото/видео.' },
    { icon: '🤝', title: 'Договоритесь о встрече', body: 'Встреча в лобби или у подъезда — оба живут в ЖК, всё рядом.' },
    { icon: '🔍', title: 'Осмотрите товар лично', body: 'Проверьте состояние до передачи денег. Никаких предоплат чужим.' },
    { icon: '✅', title: 'Подтвердите сделку', body: 'Оставьте отзыв о продавце — это повышает доверие в сообществе.' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-card rounded-t-3xl p-6 pb-10 w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <ShieldCheck className="w-5 h-5" style={{ color: HV_COLOR }} />
          <h2 className="font-bold text-base">Купить с гарантией</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-5 leading-relaxed">
          Highvill Маркет работает на доверии между соседями. Следуй этим шагам — и сделка пройдёт безопасно.
        </p>

        {/* Listing summary */}
        <div className="bg-muted/40 rounded-2xl p-3.5 mb-5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
            style={{ background: categoryColor(listing.category) + '18' }}>
            {CATEGORIES.find(c => c.key === listing.category)?.emoji}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{listing.title}</p>
            <p className="text-xs font-bold mt-0.5" style={{ color: HV_COLOR }}>{listing.price}{listing.priceNote}</p>
          </div>
          <div className="text-right">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: listing.seller.color }}>
              {listing.seller.initials}
            </div>
          </div>
        </div>

        {/* Steps */}
        <div className="space-y-3 mb-6">
          {steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 bg-muted/60">
                {step.icon}
              </div>
              <div>
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{step.body}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <a href={`https://wa.me/${listing.seller.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{ background: HV_GRADIENT }}>
            <MessageCircle className="w-4 h-4" />
            Написать продавцу
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Seller Card (Network style + WA/TG open) ──────────────────────────────────

function SellerCard({ listing, mutualCount, mutualNames, onClose }: {
  listing: Listing; mutualCount: number; mutualNames: string[]; onClose: () => void;
}) {
  const { seller } = listing;
  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-card rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto w-full max-w-md" onClick={e => e.stopPropagation()}>
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
          <X className="w-4 h-4" />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
            style={{ background: seller.color + '20', border: `2px solid ${seller.color}`, color: seller.color }}>
            {seller.initials}
          </div>
          <div>
            <div className="font-bold text-base">{seller.name}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{seller.role}</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <MapPin className="w-3 h-3 shrink-0" />
              <span>Астана · {seller.tower}, Highvill Isim</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{mutualCount}</span> общих соседа
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {seller.tags.map(t => (
            <span key={t} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{t}</span>
          ))}
        </div>

        {/* AI Summary */}
        <div className="bg-muted/40 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
          </div>
          <ul className="space-y-2">
            {seller.aiSummary.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: seller.color }} />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Mutual */}
        {mutualCount > 0 && (
          <p className="text-xs text-muted-foreground mb-5">
            Общие соседи: <span className="text-foreground font-medium">{mutualNames.join(', ')}</span>
          </p>
        )}

        {/* Listing chip */}
        <div className="bg-muted/30 rounded-2xl px-4 py-3 mb-5 flex items-center gap-3">
          <span className="text-lg">{CATEGORIES.find(c => c.key === listing.category)?.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">Объявление</p>
            <p className="text-sm font-semibold truncate">{listing.title}</p>
          </div>
          <span className="text-sm font-bold" style={{ color: categoryColor(listing.category) }}>
            {listing.price}{listing.priceNote}
          </span>
        </div>

        {/* Contact buttons — always open */}
        <p className="text-xs text-muted-foreground mb-3">Связаться с продавцом:</p>
        <div className="flex gap-2">
          <a href={`https://wa.me/${seller.whatsapp}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{ background: '#25D366' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
            WhatsApp
          </a>
          <a href={`https://t.me/${seller.telegram}`} target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-white text-sm font-semibold"
            style={{ background: '#2AABEE' }}>
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
            Telegram
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Post Listing Sheet ────────────────────────────────────────────────────────

const PRICE_UNITS = ['₸', '₸/ч', '₸/день', '₸/мес', '₸/раз', '₸/шт'];
const EXPIRY_OPTIONS = [
  { days: 3,  label: '3 дня',   note: 'Срочная продажа' },
  { days: 7,  label: '7 дней',  note: 'Стандартно' },
  { days: 14, label: '14 дней', note: 'Нет спешки' },
  { days: 30, label: '30 дней', note: 'Долгосрочно' },
];

function PostSheet({ onClose }: { onClose: () => void }) {
  const [step, setStep]             = useState<1 | 2>(1);
  const [category, setCategory]     = useState<Category | null>(null);
  const [title, setTitle]           = useState('');
  const [price, setPrice]           = useState('');
  const [unit, setUnit]             = useState('₸');
  const [description, setDescription] = useState('');
  const [expiry, setExpiry]         = useState(7);
  const [submitted, setSubmitted]   = useState(false);
  const [showUnitPicker, setShowUnitPicker] = useState(false);

  const selCat = CATEGORIES.find(c => c.key === category);
  const canNext = category !== null && title.trim().length > 3;
  const canSubmit = canNext && description.trim().length > 5;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-t-3xl p-8 pb-12 w-full max-w-md text-center" onClick={e => e.stopPropagation()}>
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-6" />
          <div className="text-5xl mb-4">✅</div>
          <h2 className="font-bold text-lg mb-2">Объявление размещено!</h2>
          <p className="text-sm text-muted-foreground mb-1">
            Соседи увидят его в разделе <span className="font-medium" style={{ color: selCat?.color }}>{selCat?.label}</span>
          </p>
          <p className="text-xs text-muted-foreground mb-6">
            Объявление активно <span className="font-medium text-foreground">{expiry} дней</span> — после истечения скроется автоматически.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white"
            style={{ background: HV_GRADIENT }}
          >
            Отлично!
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative bg-card rounded-t-3xl w-full max-w-md max-h-[92vh] flex flex-col" onClick={e => e.stopPropagation()}>

        {/* Handle + header */}
        <div className="shrink-0 px-5 pt-4 pb-3 border-b border-border">
          <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base">Разместить объявление</h2>
              <p className="text-xs text-muted-foreground mt-0.5">Шаг {step} из 2</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-3 h-1 rounded-full bg-muted overflow-hidden">
            <div className="h-full rounded-full transition-all duration-300" style={{ width: step === 1 ? '50%' : '100%', background: HV_GRADIENT }} />
          </div>
        </div>

        <div className="overflow-y-auto flex-1 px-5 py-4 space-y-4">

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <>
              {/* Category */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Категория *</p>
                <div className="grid grid-cols-3 gap-2">
                  {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setCategory(cat.key)}
                      className="flex flex-col items-center gap-1.5 py-3 rounded-2xl border transition-all text-center"
                      style={category === cat.key
                        ? { background: cat.color + '15', borderColor: cat.color }
                        : { background: 'transparent', borderColor: 'var(--border)' }
                      }
                    >
                      <span className="text-xl">{cat.emoji}</span>
                      <span className="text-[11px] font-medium leading-tight"
                        style={{ color: category === cat.key ? cat.color : undefined }}>
                        {cat.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Заголовок *</p>
                <input
                  type="text"
                  placeholder="Опишите предложение кратко..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={80}
                  className="w-full bg-input-background rounded-xl px-3 py-3 text-sm outline-none placeholder:text-muted-foreground border border-border"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{title.length}/80</p>
              </div>

              {/* Price */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Цена</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="0"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    className="flex-1 bg-input-background rounded-xl px-3 py-3 text-sm outline-none placeholder:text-muted-foreground border border-border"
                  />
                  <button
                    onClick={() => setShowUnitPicker(v => !v)}
                    className="flex items-center gap-1 px-3 py-3 rounded-xl border border-border bg-input-background text-sm font-medium min-w-[72px] justify-between"
                  >
                    {unit}
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                </div>
                {showUnitPicker && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PRICE_UNITS.map(u => (
                      <button key={u} onClick={() => { setUnit(u); setShowUnitPicker(false); }}
                        className="px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
                        style={unit === u
                          ? { background: HV_COLOR, color: '#fff', borderColor: HV_COLOR }
                          : { background: 'transparent', borderColor: 'var(--border)' }
                        }>
                        {u}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <>
              {/* Summary chip */}
              {selCat && (
                <div className="flex items-center gap-2 py-2.5 px-3 rounded-xl"
                  style={{ background: selCat.color + '12' }}>
                  <span className="text-lg">{selCat.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{title}</p>
                    <p className="text-xs font-bold" style={{ color: selCat.color }}>{price ? `${Number(price).toLocaleString('ru')} ${unit}` : 'Цена не указана'}</p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Описание *</p>
                <textarea
                  placeholder="Состояние, особенности, условия передачи, торг..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  maxLength={300}
                  rows={4}
                  className="w-full bg-input-background rounded-xl px-3 py-3 text-sm outline-none placeholder:text-muted-foreground border border-border resize-none"
                />
                <p className="text-[10px] text-muted-foreground mt-1 text-right">{description.length}/300</p>
              </div>

              {/* Photo upload hint */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Фото</p>
                <button className="w-full flex items-center gap-3 py-3.5 px-4 rounded-xl border border-dashed border-border bg-input-background/50 text-muted-foreground text-sm">
                  <ImagePlus className="w-5 h-5 shrink-0" />
                  <span>Добавить фото (до 5 шт.)</span>
                </button>
              </div>

              {/* Expiry */}
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Срок объявления</p>
                <div className="grid grid-cols-2 gap-2">
                  {EXPIRY_OPTIONS.map(opt => (
                    <button
                      key={opt.days}
                      onClick={() => setExpiry(opt.days)}
                      className="flex flex-col items-start px-3 py-2.5 rounded-xl border transition-all"
                      style={expiry === opt.days
                        ? { background: HV_COLOR + '12', borderColor: HV_COLOR }
                        : { background: 'transparent', borderColor: 'var(--border)' }
                      }
                    >
                      <span className="text-sm font-bold" style={{ color: expiry === opt.days ? HV_COLOR : undefined }}>{opt.label}</span>
                      <span className="text-[10px] text-muted-foreground mt-0.5">{opt.note}</span>
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  Объявление автоматически скроется через {expiry} дней — не нужно удалять вручную.
                </p>
              </div>

              {/* Trust note */}
              <div className="flex items-start gap-2 rounded-xl p-3" style={{ background: '#10b98112' }}>
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5 text-[#10b981]" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Объявление будет подписано твоим именем и статусом <span className="font-semibold text-foreground">«Житель Highvill»</span>. Это повышает доверие покупателей.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer buttons */}
        <div className="shrink-0 px-5 pt-4 pb-20 border-t border-border">
          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              disabled={!canNext}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity"
              style={{ background: HV_GRADIENT, opacity: canNext ? 1 : 0.4 }}
            >
              Далее →
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3.5 rounded-2xl text-sm font-semibold border border-border text-foreground"
              >
                ← Назад
              </button>
              <button
                onClick={() => setSubmitted(true)}
                disabled={!canSubmit}
                className="flex-1 py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity"
                style={{ background: HV_GRADIENT, opacity: canSubmit ? 1 : 0.4 }}
              >
                Разместить объявление
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export function HighvillMarketplace() {
  const [category, setCategory] = useState<Category>('all');
  const [search, setSearch]     = useState('');
  const [chatListing, setChatListing]     = useState<Listing | null>(null);
  const [trustListing, setTrustListing]   = useState<Listing | null>(null);
  const [sellerListing, setSellerListing] = useState<Listing | null>(null);
  const [showPost, setShowPost]           = useState(false);

  const filtered = LISTINGS.filter(l => {
    const matchCat = category === 'all' || l.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q) || l.tag.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <>
    <div className="min-h-screen bg-background pb-6">

      {/* ─── HEADER ─── */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 pt-4 pb-3">
          <div className="flex items-center gap-3 mb-3">
            <Link to="/user/community/highvill"
              className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <h1 className="font-bold text-base leading-tight">Highvill Маркет</h1>
              <p className="text-xs text-muted-foreground">
                {LISTINGS.length} объявлений · только от жителей
              </p>
            </div>
            <button
              onClick={() => setShowPost(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white shrink-0 active:scale-95 transition-transform"
              style={{ background: HV_GRADIENT }}
            >
              <Plus className="w-3.5 h-3.5" />
              Разместить
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск по объявлениям..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-9 py-2.5 bg-input-background rounded-xl border border-border focus:outline-none text-sm"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── CONTENT ─── */}
      <div className="max-w-md mx-auto px-4 py-4 space-y-3">

        {/* Category pills */}
        <div className="-mx-4 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 px-4 pb-1 w-max">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0"
                style={category === cat.key
                  ? { background: cat.color, color: '#fff' }
                  : { background: cat.color + '15', color: cat.color }
                }
              >
                <span>{cat.emoji}</span>
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trust banner */}
        {category === 'all' && !search && (
          <div className="rounded-2xl p-4 flex items-center gap-3"
            style={{ background: `${HV_COLOR}10`, border: `1px solid ${HV_COLOR}25` }}>
            <ShieldCheck className="w-8 h-8 shrink-0" style={{ color: HV_COLOR }} />
            <div>
              <p className="text-sm font-semibold" style={{ color: HV_COLOR }}>Только жители Highvill</p>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Все продавцы верифицированы. Встречайтесь в ЖК — никаких незнакомцев.
              </p>
            </div>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center text-2xl">🔍</div>
            <p className="text-sm text-muted-foreground text-center">Объявлений не найдено.<br />Попробуй другой запрос.</p>
          </div>
        ) : (
          filtered.map(listing => (
            <ListingCard
              key={listing.id}
              listing={listing}
              onChat={setChatListing}
              onTrust={setTrustListing}
              onSellerClick={setSellerListing}
            />
          ))
        )}
      </div>
    </div>

    {/* ─── Sheets ─── */}
    {sellerListing && <SellerCard listing={sellerListing} mutualCount={sellerListing.mutualCount} mutualNames={sellerListing.mutualNames} onClose={() => setSellerListing(null)} />}
    {chatListing   && <ChatSheet  listing={chatListing}  onClose={() => setChatListing(null)} />}
    {trustListing  && <TrustSheet listing={trustListing} onClose={() => setTrustListing(null)} />}
    {showPost      && <PostSheet  onClose={() => setShowPost(false)} />}
    </>
  );
}
