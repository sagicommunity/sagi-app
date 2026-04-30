# Sagi — Полный контекст проекта

## Что такое Sagi

Sagi Community — мобильное приложение (iOS + Android) и веб-платформа для управления сообществами. Первый клиент — клуб лояльности МФЦА (Международный финансовый центр Астаны).

---

## Стек

| Слой | Библиотека | Версия |
|---|---|---|
| UI | React | 19.2.4 |
| Роутинг | React Router | 7.14.0 |
| Сборка | Vite | 8.0.4 |
| Типизация | TypeScript | 6.0.2 |
| Стили | Tailwind CSS | 4.2.2 |
| Иконки | Lucide React | 1.7.0 |
| Визуализация | D3.js + TopoJSON | 7.9.0 / 3.1.0 |
| CSS утилиты | clsx + tailwind-merge | 2.1.1 / 3.5.0 |
| Анимации | tw-animate-css | 1.4.0 |

Нет бэкенда, нет API. Всё клиентское, персистентность через `localStorage`.

---

## Цветовая схема

```
GREEN       = '#10b981'  // основной mint (в приложении)
GREEN       = '#2ABB6F'  // основной зелёный (на лендинге)
GREEN_DARK  = '#1E9E5A'  // тёмный зелёный (hover)
GREEN_LIGHT = '#EDFAF3'  // светлый фон бейджей/иконок
BORDER      = '#B6EDD2'  // зелёная граница

Business role   = '#3b82f6'   // синий
Admin role      = '#8b5cf6'   // фиолетовый
Destructive     = '#d4183d'   // красный
Hani brand      = linear-gradient(135deg, #F5C400, #CC8F00)  // золотой

Фон страниц:  #FFFFFF / #FAFAFA (секции alt)
Текст:        #111827 (заголовки), #374151 (основной), #6B7280 (вторичный), #9CA3AF (muted)
```

Градиент кнопок лендинга: `linear-gradient(135deg, #2ABB6F, #1E9E5A)`  
Hero фон: `linear-gradient(160deg, #F2FDF7 0%, #FFFFFF 55%)`

---

## Логотип и ассеты

- Логотип: `src/assets/sagi-logo.png`
- Скриншоты: `public/screen1.png` (admin), `public/screen2.png` (участник), `public/screen3.png` (бизнес)

---

## Три роли в приложении

### 1. Администратор (сообщество)
- Верификация участников
- Аналитика в реальном времени
- Контроль сроков членства
- Управление партнёрской сетью
- Бейдж: `bg-[#EDFAF3] text-[#1E9E5A]`

### 2. Участник (резидент)
- Apple Wallet карта (цифровое членство)
- Карта лояльности с QR ID
- Каталог скидок и офферов
- Лента событий и новостей
- Verified Networking
- Бейдж: `bg-[#EEF2FF] text-[#4338CA]`

### 3. Бизнес (партнёр)
- Сканирование QR-карт участников
- Управление офферами
- Статистика визитов
- Персональный менеджер Sagi
- Бейдж: `bg-[#FFF7ED] text-[#C2410C]`

---

## Коммерческая модель

- **Setup Fee**: $2 500 (единоразово)
- **Ежемесячно**: $20 за участника
- **Ежегодно**: $170 за участника (скидка 30%)
- **Киллер-аргумент**: система автоматически блокирует доступ просроченных карт

---

## Структура директорий

```
src/
├── assets/                    # sagi-logo.png, hero.png
├── components/
│   ├── admin/                 # 11 компонентов
│   ├── auth/                  # 4 компонента
│   ├── business/              # 8 компонентов
│   └── *.tsx                  # ~27 общих/пользовательских компонентов
├── context/
│   ├── AuthContext.tsx
│   ├── RoleContext.tsx
│   ├── ThemeContext.tsx
│   └── LanguageContext.tsx
├── App.tsx                    # Корень: вложение провайдеров
├── main.tsx                   # React DOM entry
├── routes.tsx                 # Конфигурация роутов
└── index.css                  # Глобальные стили + токены Tailwind

public/
├── favicon.svg
├── icons.svg
└── *.jpeg                     # 39 фото бизнесов/людей/сообществ
```

---

## Роуты

### Публичные / Auth
| Путь | Компонент |
|---|---|
| `/` | `RoleLanding` |
| `/landing` | `SagiLanding` |
| `/app` | `AppStoreLanding` |
| `/auth` | `AuthLanding` |
| `/auth/login` | `Login` |
| `/auth/register` | `Register` |

### Участник (`/user/*`)
| Путь | Компонент |
|---|---|
| `/user/` | `CommunityFeed` |
| `/user/community/hani` | `HaniCommunity` |
| `/user/community/highvill` | `HighvillCommunity` |
| `/user/community/:id` | `CategoryOffers` |
| `/user/offer/:id` | `OfferDetail` |
| `/user/profile` | `Profile` |
| `/user/profile/edit` | `EditProfile` |
| `/user/profile/appearance` | `AppearanceSettings` |
| `/user/profile/language` | `LanguageSettings` |
| `/user/profile/notifications` | `NotificationSettings` |
| `/user/profile/support` | `SupportSettings` |
| `/user/join-community` | `JoinCommunity` |
| `/user/network` | `NetworkPage` |

### Бизнес (`/business/*`)
| Путь | Компонент |
|---|---|
| `/business/` | `BusinessDashboard` |
| `/business/offers` | `BusinessOffers` |
| `/business/offers/new` | `CreateOffer` |
| `/business/analytics` | `BusinessAnalytics` |
| `/business/scan` | `ScanMember` |
| `/business/profile` | `BusinessProfile` |
| `/business/community/:id` | `BusinessCommunityPage` |

### Администратор (`/admin/*`)
| Путь | Компонент |
|---|---|
| `/admin/` | `AdminDashboard` |
| `/admin/communities` | `AdminCommunities` |
| `/admin/businesses` | `AdminBusinesses` |
| `/admin/users` | `AdminUsers` |
| `/admin/profile` | `AdminProfile` |
| `/admin/language` | `LanguageSettings` |
| `/admin/support` | `SupportSettings` |
| `/admin/notifications` | `NotificationSettings` |
| `/admin/analytics` | `AdminAnalytics` |
| `/admin/analytics/business/:id` | `AdminBusinessAnalyticsDetail` |
| `/admin/analytics/offer/:id` | `AdminOfferAnalyticsDetail` |
| `/admin/community/:id` | `AdminCommunityBuilder` |

Catch-all `*` → редирект на `/user`.

---

## Компоненты

### Layout / Root
| Файл | Роль |
|---|---|
| `App.tsx` | Оборачивает в 4 провайдера (Auth, Role, Theme, Language) |
| `UserRoot.tsx` | Оболочка портала участника + нижняя навигация |
| `BusinessRoot.tsx` | Оболочка бизнес-портала + нижняя навигация |
| `AdminRoot.tsx` | Оболочка admin-портала + нижняя навигация |

### Auth (`auth/`)
| Файл | Роль |
|---|---|
| `AuthLanding.tsx` | Точка входа в авторизацию |
| `Login.tsx` | Вход по email / телефону / OTP-коду |
| `Register.tsx` | Форма регистрации |
| `OtpInput.tsx` | Переиспользуемый 6-значный OTP-input |

### Участник
| Файл | Роль |
|---|---|
| `RoleLanding.tsx` | Выбор роли (участник / бизнес / admin) |
| `CommunityFeed.tsx` | Главная — featured офферы + список сообществ |
| `CategoryOffers.tsx` | Грид офферов по сообществу; вкладки: Offers, Events, Tasks, Vacancies, News |
| `OfferDetail.tsx` | Детальный оффер с QR для погашения |
| `HaniCommunity.tsx` | Страница сообщества бренда Hani |
| `HighvillCommunity.tsx` | Страница сообщества Highvill |
| `Profile.tsx` | Профиль + вход в настройки |
| `EditProfile.tsx` | Редактирование имени, bio, тегов, соцсетей |
| `AppearanceSettings.tsx` | Переключатель темы |
| `LanguageSettings.tsx` | Выбор языка (en / ru / kk) |
| `NotificationSettings.tsx` | Настройки push-уведомлений |
| `SupportSettings.tsx` | FAQ + WhatsApp / Telegram / звонок |
| `JoinCommunity.tsx` | Вступление по коду или QR |
| `NetworkPage.tsx` | D3-визуализация сети контактов |
| `SagiLanding.tsx` | B2B маркетинговый лендинг |
| `AppStoreLanding.tsx` | Страница для App Store |

### Бизнес (`business/`)
| Файл | Роль |
|---|---|
| `BusinessDashboard.tsx` | KPI + последние погашения |
| `BusinessOffers.tsx` | Список и управление офферами |
| `CreateOffer.tsx` | Форма создания оффера |
| `BusinessProfile.tsx` | Профиль бизнеса |
| `BusinessAnalytics.tsx` | Графики и статистика использования |
| `ScanMember.tsx` | Сканер QR / кода участника |
| `BusinessCommunityPage.tsx` | Вид сообщества для владельца бизнеса (вкладки: Offers, Events, Vacancies, News, Bonuses, Cross-bonuses) |

### Admin (`admin/`)
| Файл | Роль |
|---|---|
| `AdminDashboard.tsx` | Платформенные KPI + лента активности |
| `AdminCommunities.tsx` | CRUD сообществ |
| `AdminBusinesses.tsx` | Одобрение / блокировка бизнесов |
| `AdminUsers.tsx` | Поиск / фильтр / управление пользователями |
| `AdminProfile.tsx` | Профиль администратора |
| `AdminAnalytics.tsx` | Общая аналитика платформы |
| `AdminBusinessAnalyticsDetail.tsx` | Детальная аналитика по бизнесу |
| `AdminOfferAnalyticsDetail.tsx` | Детальная аналитика по офферу |
| `AdminCommunityBuilder.tsx` | Конструктор сообщества |

### Модальные окна
| Файл | Роль |
|---|---|
| `CommunityModal.tsx` | Детали сообщества |
| `RoleSwitcherModal.tsx` | Смена активной роли |
| `ContactsModal.tsx` | Управление контактами |
| `ConnectionsModal.tsx` | Список связей в сети |
| `FriendsModal.tsx` | Отображение друзей |

### Утилиты
| Файл | Роль |
|---|---|
| `BusinessLogo.tsx` | Аватар бизнеса с градиентом по типу |
| `UserBottomNavigation.tsx` | Home / Offers / Profile |
| `BusinessBottomNavigation.tsx` | Dashboard / Offers / Scan / Analytics / Profile |
| `AdminBottomNavigation.tsx` | Dashboard / Communities / Businesses / Users / Profile |

---

## Контекст-провайдеры

### `AuthContext`
```ts
isAuthenticated: boolean
user: { name: string; email?: string; phone?: string }
login(user) / logout() / register(user)
// localStorage: 'sagi-auth', 'sagi-user'
```

### `RoleContext`
```ts
role: 'user' | 'business' | 'admin' | null
setRole(r)
// localStorage: 'sagi-role'
```

### `ThemeContext`
```ts
theme: 'light' | 'dark'
toggleTheme() / setTheme(t)
// добавляет/убирает .dark на <html>; localStorage: 'sagi-theme'
```

### `LanguageContext`
```ts
language: 'en' | 'ru' | 'kk'
setLanguage(lang)
t(key: string): string   // lookup в объекте переводов
// localStorage: 'sagi-language'
```
1000+ ключей перевода, без внешней i18n-библиотеки.

---

## Данные и моки

Все моковые данные — **inline внутри компонентов**, нет отдельного слоя данных.

Ключевые типы:

```ts
type BizType = 'restaurant' | 'cafe' | 'education' | 'spa' | 'retail'
             | 'hotel' | 'fitness' | 'healthcare' | 'travel' | 'office'
             | 'school' | 'district' | 'tech'

interface Offer {
  id: number
  business: string
  offer: string          // текст скидки
  category: string
  type: BizType
  exclusive: boolean
  photo?: string         // локальный путь ('/brew-society.jpeg') или Unsplash URL
}

// state, передаваемый в OfferDetail через Link:
interface OfferState {
  business: string
  businessType: BizType
  category: string
  discount: string
  photo?: string
  color: string
  gradient: string
}
```

**Где живут данные:**
- `CategoryOffers.tsx` — 42 оффера по 8 категориям
- `CommunityFeed.tsx` — featured офферы + карточки сообществ
- `BusinessCommunityPage.tsx` — массив `CROSS_BONUSES` (партнёры)

---

## Дизайн-система

### Конвенции вёрстки
- `max-w-md mx-auto` на всём контенте — mobile-first, по центру
- `pb-20` — отступ под фиксированную нижнюю навигацию
- `rounded-2xl` / `rounded-xl` — карточки
- `bg-card`, `bg-input-background`, `border-border` — семантические токены

### Tailwind + CSS-переменные
- Tailwind v4, плагин `@tailwindcss/vite`
- Токены описаны в `index.css` (`:root` — светлая, `.dark` — тёмная тема)
- Dark mode: класс `.dark` на `<html>`

---

## Публичные ассеты (`/public`)

| Файл | Используется для |
|---|---|
| `brew-society.jpeg` | Brew Society café |
| `le-bistro.jpeg` | Le Bistro |
| `daily-grind.jpeg` | Daily Grind café |
| `sakura-kitchen.jpeg` | Sakura Kitchen |
| `the-loft.jpeg` | The Loft |
| `noma-grill.jpeg` | Noma Grill |
| `chez-georges.jpeg` | Chez Georges / Atlas Bar |
| `master-coffee.jpeg` | Master Coffee / Rooftop Café |
| `hani-tasting.jpeg` | Olivia Bistro |
| `hani-masterclass.jpeg` | La Piazza |
| `grand-vega-hotel.jpeg` | Grand Vega Hotel (Unsplash stock) |
| `rafe-beauty.jpeg` | Rafe Beauty / Aura Beauty |
| `bronx-fitness.jpeg` | Bronx Fitness / Iron Grid Gym |
| `aifc-academy.jpeg` | AIFC Academy / Vertex Academy |
| `tours.jpeg` | SkyLink Airways |
| `burabay.jpeg` | WanderKZ travel |
| `ana-flowers.jpeg` | Ana Flowers / Flora Bloom |
| `hani.jpeg` | Аватар бренда Hani |
| `hani-giveaway.jpeg` | Лента сообщества Hani |
| `conn-*.jpeg` | Аватары контактов (5 человек) |
| `vacancy-*.jpeg` | Обложки вакансий (4 шт.) |
| `delish.jpeg`, `drinkit.jpeg`, `happy-cake.jpeg`, `tap-tatti.jpeg` | Лента / сообщества |
| `screen1-3.png` | Скриншоты для App Store |

---

## Страницы лендинга

### SagiLanding (`/landing`) — B2B

**Секции по порядку:**
1. **NAV** — логотип + бейдж "Community · МФЦА" + ссылки
2. **HERO** — заголовок + кнопка "Посмотреть тарифы" + статы + анимированный телефон с картой AIFC MEMBER
3. **APP PREVIEW** — 3 iPhone-фрейма с ролями
4. **12 ФУНКЦИЙ** — сетка 3 колонки
5. **ИНСТРУМЕНТЫ** — 2 колонки: Панель управления + Кабинет бизнеса
6. **ТАРИФЫ** — 2 карточки ($20 / $170) + блок с фичами
7. **ROI** — 3 причины
8. **FOOTER CTA** — тёмная карточка

### AppStoreLanding (`/app`) — для App Store

Обязательные элементы (требования Apple):
- Privacy Policy с якорем `#privacy`
- Support URL: `mailto:support@sagi.kz`
- Privacy contact: `privacy@sagi.kz`

В App Store Connect:
- Marketing URL → `https://домен/app`
- Support URL → `https://домен/app`
- Privacy Policy URL → `https://домен/app#privacy`

---

## iPhone-фрейм (переиспользуемый паттерн)

```tsx
<div className="relative" style={{ width: 220 }}>
  <div className="relative rounded-[3rem] overflow-hidden"
    style={{
      background: '#1A1A1A',
      padding: '10px',
      boxShadow: '0 0 0 1px #3a3a3a, 0 32px 64px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
    <div className="relative rounded-[2.3rem] overflow-hidden bg-black" style={{ aspectRatio: '9/19.5' }}>
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 w-[72px] h-[22px] bg-black rounded-full" />
      <img src={src} alt={label} className="w-full h-full object-cover object-top" />
    </div>
  </div>
  {/* Кнопки сбоку */}
  <div className="absolute left-[-3px] top-[88px] w-[3px] h-[34px] rounded-l-sm" style={{ background: '#2a2a2a' }} />
  <div className="absolute left-[-3px] top-[132px] w-[3px] h-[34px] rounded-l-sm" style={{ background: '#2a2a2a' }} />
  <div className="absolute left-[-3px] top-[176px] w-[3px] h-[34px] rounded-l-sm" style={{ background: '#2a2a2a' }} />
  <div className="absolute right-[-3px] top-[120px] w-[3px] h-[56px] rounded-r-sm" style={{ background: '#2a2a2a' }} />
</div>
```

---

## Контакты

- `info@sagi.kz` — общий
- `support@sagi.kz` — поддержка
- `privacy@sagi.kz` — конфиденциальность

---

## Предпочтения по коду

- Без комментариев, если смысл очевиден
- Без framer-motion (не установлен) — анимации через CSS
- Иконки только из `lucide-react`
- Tailwind inline-стили только когда класс не покрывает нужное значение
- Длинные тире (—) заменять на обычные (-)

---

## Запуск

```bash
npm run dev      # Vite dev server (обычно http://localhost:5173)
npm run build    # tsc + vite build
npm run preview  # Превью prod-сборки
npm run lint     # ESLint
```
