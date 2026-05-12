import React, { useState, useRef } from 'react';
import { ChevronLeft, Search, UtensilsCrossed, GraduationCap, Sparkles, ShoppingBag, Building2, Dumbbell, HeartPulse, Plane, Calendar, CheckSquare, Briefcase, Newspaper, Camera, X, MapPin, Bell, BellOff, Share2, ChevronDown, ChevronUp, Users } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { BusinessLogo } from './BusinessLogo';
import { PERSON_SCHEDULE } from './NetworkPage';
import { InviteModal } from './InviteModal';

interface NewsPost {
  id: number;
  author: string;
  time: string;
  text: string;
  image: string;
  attendees: { name: string; initials: string; color: string }[];
}

type BizType = 'restaurant' | 'cafe' | 'education' | 'spa' | 'retail' | 'hotel' | 'fitness' | 'healthcare' | 'travel';
type Tab = 'offers' | 'events' | 'tasks' | 'vacancies' | 'news';

type JoinStatus = 'none' | 'pending' | 'accepted' | 'member';

interface Offer {
  id: number;
  business: string;
  offer: string;
  category: string;
  type: BizType;
  exclusive: boolean;
  photo?: string;
  communityIds?: string[];
  joinStatus?: JoinStatus;
}

const COMMUNITY_CONFIG: Record<string, {
  name: string; members: number; businesses: number; description: string; descriptionKey?: string; website?: string; addressKey?: string;
  logo: React.ReactNode;
}> = {
  '1': {
    name: 'Vertex Club', members: 570, businesses: 42,
    description: 'Vertex Club — бизнес-клуб в сердце финансового квартала. Открыт для резидентов, инвесторов и экспертов.',
    website: 'vertexclub.kz',
    logo: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="#00695C" strokeWidth="3.5"/>
        <polyline points="18,22 32,44 46,22" fill="none" stroke="#00695C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  '4': {
    name: 'English Quarter', members: 480, businesses: 21,
    description: '', descriptionKey: 'descEnglishQuarter',
    addressKey: 'addressEnglishQuarter',
    logo: <img src="/english-quarter.jpeg" alt="English Quarter" className="w-full h-full object-cover" />,
  },
  '5': {
    name: 'French Quarter', members: 390, businesses: 17,
    description: '', descriptionKey: 'descFrenchQuarter',
    addressKey: 'addressFrenchQuarter',
    logo: <img src="/french-quarter.jpeg" alt="French Quarter" className="w-full h-full object-cover" />,
  },
  '6': {
    name: 'Italian Quarter', members: 345, businesses: 14,
    description: '', descriptionKey: 'descItalianQuarter',
    addressKey: 'addressItalianQuarter',
    logo: <img src="/italian-quarter.jpeg" alt="Italian Quarter" className="w-full h-full object-cover" />,
  },
  '2': {
    name: 'NexLab', members: 320, businesses: 18,
    description: 'Технологическое сообщество стартапов и инноваций.',
    logo: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect width="64" height="64" fill="#0F172A"/>
        <polygon points="32,5 56,18.5 56,45.5 32,59 8,45.5 8,18.5" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5"/>
        <line x1="20" y1="18" x2="20" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="44" y1="18" x2="44" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
        <line x1="20" y1="18" x2="44" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  '3': {
    name: 'Vega Forum', members: 210, businesses: 27,
    description: 'Деловое сообщество выставочного района.',
    logo: (
      <svg viewBox="0 0 64 64" className="w-full h-full">
        <rect width="64" height="64" fill="#0D1B2A"/>
        <polygon points="32,7 36.5,27.5 57,32 36.5,36.5 32,57 27.5,36.5 7,32 27.5,27.5" fill="white" opacity="0.92"/>
        <circle cx="32" cy="32" r="5" fill="#60A5FA"/>
      </svg>
    ),
  },
  '7': {
    name: 'ФК Ордабасы', members: 1240, businesses: 18,
    description: 'Профессиональный футбольный клуб «Ордабасы».',
    logo: <img src="/fc-ordabasy.jpg" alt="ФК Ордабасы" className="w-full h-full object-cover" />,
  },
  '8': {
    name: 'Казатомпром', members: 3850, businesses: 47,
    description: 'АО «НАК «Казатомпром» — национальная атомная компания.',
    logo: <img src="/kazatomprom.jpg" alt="Казатомпром" className="w-full h-full object-cover" />,
  },
  '9': {
    name: 'NurOrda', members: 2170, businesses: 33,
    description: 'Сообщество района NurOrda.',
    logo: <img src="/nurorda.jpg" alt="NurOrda" className="w-full h-full object-cover" />,
  },
  '10': {
    name: 'Alibekov', members: 560, businesses: 12,
    description: 'Сообщество Alibekov.',
    logo: <img src="/alibekov.jpg" alt="Alibekov" className="w-full h-full object-cover" />,
  },
  '11': {
    name: 'Салауатты Астана', members: 4320, businesses: 58,
    description: 'Программа здорового образа жизни «Салауатты Астана».',
    logo: <img src="/salauatty-astana.jpg" alt="Салауатты Астана" className="w-full h-full object-cover" />,
  },
  '12': {
    name: 'Atameken Business', members: 6740, businesses: 112,
    description: 'НПП «Атамекен» — деловое сообщество предпринимателей.',
    logo: <img src="/atameken-business.jpg" alt="Atameken Business" className="w-full h-full object-cover" />,
  },
  '13': {
    name: 'Партия Әділет', members: 8930, businesses: 24,
    description: 'Политическая партия «Әділет».',
    logo: <img src="/adilet-party.jpg" alt="Партия Әділет" className="w-full h-full object-cover" />,
  },
  '15': {
    name: 'Мангистаумунайгаз', members: 2460, businesses: 31,
    description: 'Нефтегазодобывающая компания «Мангистаумунайгаз».',
    logo: <img src="/mangistaumunaigaz.jpg" alt="Мангистаумунайгаз" className="w-full h-full object-cover" />,
  },
  '16': {
    name: 'ТШО', members: 5120, businesses: 76,
    description: 'Тенгизшевройл — совместное нефтяное предприятие.',
    logo: <img src="/tsho.jpg" alt="ТШО" className="w-full h-full object-cover" />,
  },
  '17': {
    name: 'Олимпийский комитет', members: 1870, businesses: 29,
    description: 'Национальный олимпийский комитет Республики Казахстан.',
    logo: <img src="/olympic-committee.jpg" alt="Олимпийский комитет" className="w-full h-full object-cover" />,
  },
  '18': {
    name: 'YPO', members: 430, businesses: 85,
    description: 'Young Presidents\' Organization — международная организация руководителей.',
    logo: <img src="/ypo.jpg" alt="YPO" className="w-full h-full object-cover" />,
  },
  '19': {
    name: 'Администрация Президента', members: 3290, businesses: 41,
    description: 'Администрация Президента Республики Казахстан.',
    logo: <img src="/admin-president.jpg" alt="Администрация Президента" className="w-full h-full object-cover" />,
  },
  '20': {
    name: 'Sensata', members: 780, businesses: 16,
    description: 'Sensata Technologies — технологическая компания.',
    logo: <img src="/sensata.png" alt="Sensata" className="w-full h-full object-cover" />,
  },
  '21': {
    name: 'Свой Дом', members: 1650, businesses: 22,
    description: 'Жилой комплекс «Свой Дом».',
    logo: <img src="/svoy-dom.png" alt="Свой Дом" className="w-full h-full object-cover" />,
  },
  '23': {
    name: 'Bazis', members: 2080, businesses: 38,
    description: 'Строительная компания Bazis.',
    logo: <img src="/bazis.jpg" alt="Bazis" className="w-full h-full object-cover" />,
  },
  '24': {
    name: 'Integra', members: 940, businesses: 14,
    description: 'Компания Integra.',
    logo: <img src="/integra.jpg" alt="Integra" className="w-full h-full object-cover" />,
  },
};

export const ATTENDEE_PROFILES: Record<string, {
  role: string; location: string; tags: string[];
  aiSummary: [string, string, string];
  connections: number; mutualCount: number; mutualNames: string[];
}> = {
  AB: { role: 'Product Manager', location: 'Astana', tags: ['Product', 'Fintech', 'Strategy'], aiSummary: ['Experienced PM at AIFC with focus on digital products', 'Strong connector in the fintech ecosystem', 'Involved in 3 community initiatives'], connections: 84, mutualCount: 2, mutualNames: ['Arman K.', 'Daniyar S.'] },
  KD: { role: 'Marketing Director', location: 'Astana', tags: ['Marketing', 'Branding', 'Growth'], aiSummary: ['Leads marketing for a top regional bank', 'Known for community building and events', 'Active in women-in-business circles'], connections: 112, mutualCount: 2, mutualNames: ['Aizat B.', 'Farida B.'] },
  AK: { role: 'Software Engineer', location: 'Astana', tags: ['Engineering', 'Fintech', 'AI'], aiSummary: ['Full-stack engineer at a leading fintech startup', 'Contributor to open-source finance tools', 'Mentors junior devs in the community'], connections: 67, mutualCount: 2, mutualNames: ['Daniyar S.', 'Ruslan A.'] },
  DS: { role: 'Investment Analyst', location: 'Astana', tags: ['Investment', 'Finance', 'VC'], aiSummary: ['Analyst at a regional VC fund covering fintech and real estate', 'Regular speaker at investor events in AIFC', 'Tracks early-stage deals across Central Asia'], connections: 95, mutualCount: 2, mutualNames: ['Aizat B.', 'Arman K.'] },
  FB: { role: 'Legal Counsel', location: 'Astana', tags: ['Legal', 'Compliance', 'Fintech'], aiSummary: ['Specializes in financial regulation and AIFC compliance', 'Advises startups on legal structuring', 'Frequent panelist at legal tech events'], connections: 78, mutualCount: 2, mutualNames: ['Kamila D.', 'Madina I.'] },
  MI: { role: 'HR Business Partner', location: 'Astana', tags: ['HR', 'Talent', 'Culture'], aiSummary: ['HR leader focused on expat onboarding and culture', 'Organizes wellness and team-building initiatives', 'Deep network across AIFC employers'], connections: 89, mutualCount: 2, mutualNames: ['Zarina S.', 'Farida B.'] },
  RA: { role: 'UX Designer', location: 'Almaty', tags: ['Design', 'UX', 'Product'], aiSummary: ['Designer specializing in mobile-first financial apps', 'Runs design thinking workshops for product teams', 'Contributed to 3 AIFC digital products'], connections: 54, mutualCount: 2, mutualNames: ['Arman K.', 'Aizat B.'] },
  ZS: { role: 'Real Estate Advisor', location: 'Astana', tags: ['Real Estate', 'Investment', 'Relocation'], aiSummary: ['Helps expats and investors navigate Astana property market', 'Deep network in AIFC real estate ecosystem', 'Regularly attends investor and expat forums'], connections: 73, mutualCount: 2, mutualNames: ['Madina I.', 'Daniyar S.'] },
  AD: { role: 'Business Development', location: 'Astana', tags: ['BD', 'Partnerships', 'Sales'], aiSummary: ['Drives partnerships across the AIFC ecosystem', 'Focused on B2B relationships and enterprise deals', 'Active in startup and corporate networking events'], connections: 101, mutualCount: 2, mutualNames: ['Kamila D.', 'Ruslan A.'] },
  TZ: { role: 'AI Product Lead', location: 'Astana', tags: ['AI', 'Product', 'Fintech'], aiSummary: ['Building AI-powered financial tools at a fintech scale-up', 'Deep expertise in LLMs and data product strategy', 'Mentor at Astana Hub programs'], connections: 62, mutualCount: 2, mutualNames: ['Aizat B.', 'Arman K.'] },
};

export function CategoryOffers() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const community = COMMUNITY_CONFIG[id ?? '1'] ?? COMMUNITY_CONFIG['1'];
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const [tab, setTab] = useState<Tab>('offers');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [rsvped, setRsvped] = useState<Set<number>>(new Set());
  const [taskDone, setTaskDone] = useState<Set<number>>(new Set());
  const [eventSearch, setEventSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const [showPast, setShowPast] = useState(false);
  const [attendeeCard, setAttendeeCard] = useState<{ name: string; initials: string; color: string } | null>(null);
  const [inviteEvent, setInviteEvent] = useState<{ title: string; going: { name: string; initials: string; color: string }[] } | null>(null);
  const [attendeeScheduleOpen, setAttendeeScheduleOpen] = useState(true);
  const [eventConnected, setEventConnected] = useState<Set<string>>(new Set());
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showMoreLeaderboard, setShowMoreLeaderboard] = useState(false);
  const [showBusinesses, setShowBusinesses] = useState(false);
  const [bizSearch, setBizSearch] = useState('');
  const [bizCategory, setBizCategory] = useState('all');
  const [selectedBusiness, setSelectedBusiness] = useState('all');
  const fileInputRefs = useRef<Record<number, HTMLInputElement | null>>({});

  const categories = [
    { id: 'food', name: t('food'), icon: UtensilsCrossed },
    { id: 'hotel', name: t('hotel'), icon: Building2 },
    { id: 'beauty', name: t('beauty'), icon: Sparkles },
    { id: 'fitness', name: t('fitness'), icon: Dumbbell },
    { id: 'healthcare', name: t('healthcare'), icon: HeartPulse },
    { id: 'education', name: t('education'), icon: GraduationCap },
    { id: 'travel', name: t('travel'), icon: Plane },
    { id: 'retail', name: t('retail'), icon: ShoppingBag },
  ];

  const offers: Offer[] = [
    { id: 1, business: 'Brew Society', offer: t('offer10OffBevFull'), category: 'food', type: 'cafe', exclusive: false, photo: '/brew-society.jpeg', joinStatus: 'member' },
    { id: 2, business: 'Le Bistro', offer: t('offer10OffFood'), category: 'food', type: 'restaurant', exclusive: true, photo: '/le-bistro.jpeg', joinStatus: 'accepted' },
    { id: 3, business: 'Daily Grind', offer: t('offer20OffBar'), category: 'food', type: 'cafe', exclusive: false, photo: '/daily-grind.jpeg', joinStatus: 'member' },
    { id: 4, business: 'Sakura Kitchen', offer: t('offerGiftVouchers'), category: 'food', type: 'restaurant', exclusive: true, photo: '/sakura-kitchen.jpeg', joinStatus: 'pending' },
    { id: 5, business: 'The Loft', offer: t('offer10OffFoodBar'), category: 'food', type: 'restaurant', exclusive: false, photo: '/the-loft.jpeg', joinStatus: 'none' },
    { id: 6, business: 'Noma Grill', offer: t('offer10OffFoodBar'), category: 'food', type: 'restaurant', exclusive: false, photo: '/noma-grill.jpeg', joinStatus: 'none' },
    { id: 7, business: 'Atlas Bar', offer: t('offer10OffFoodDrinks'), category: 'food', type: 'restaurant', exclusive: false, photo: '/chez-georges.jpeg', joinStatus: 'accepted' },
    { id: 8, business: 'Rooftop Café', offer: t('offer10OffFoodDrinks'), category: 'food', type: 'cafe', exclusive: false, photo: '/master-coffee.jpeg', joinStatus: 'pending' },
    { id: 9, business: 'Olivia Bistro', offer: t('offer10OffFoodDrinks'), category: 'food', type: 'restaurant', exclusive: false, photo: '/hani-tasting.jpeg', joinStatus: 'none' },
    { id: 10, business: 'La Piazza', offer: t('offer10OffFoodDrinks'), category: 'food', type: 'restaurant', exclusive: false, photo: '/hani-masterclass.jpeg', joinStatus: 'none' },
    { id: 11, business: 'Grand Vega Hotel', offer: t('offer15OffBestRate'), category: 'hotel', type: 'hotel', exclusive: true, photo: '/grand-vega-hotel.jpeg', joinStatus: 'member' },
    { id: 12, business: 'Serene Lake Resort', offer: t('offer10OffBestRate'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'none' },
    { id: 13, business: 'Meridian Hotel', offer: t('offer15OffBestRate'), category: 'hotel', type: 'hotel', exclusive: true, joinStatus: 'pending' },
    { id: 14, business: 'Pinnacle Suites', offer: t('offerCorporateRate'), category: 'hotel', type: 'hotel', exclusive: true, joinStatus: 'none' },
    { id: 15, business: 'Crystal Bay Resort', offer: t('offerCorporateDiscount'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'accepted' },
    { id: 16, business: 'Heritage House', offer: t('offerCorporateDiscount'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'none' },
    { id: 17, business: 'Pagoda Palace', offer: t('offerCorporateDiscount'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'none' },
    { id: 18, business: 'Birchwood Inn', offer: t('offer15OffStay'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'pending' },
    { id: 19, business: 'Skyline Hotel', offer: t('offer10OffSpaRate'), category: 'hotel', type: 'hotel', exclusive: true, joinStatus: 'none' },
    { id: 20, business: 'Atlas Moscow', offer: t('offerCorporateDiscount'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'none' },
    { id: 21, business: 'Birch Wellness Resort', offer: t('offer10OffStay'), category: 'hotel', type: 'hotel', exclusive: false, joinStatus: 'none' },
    { id: 22, business: 'Aura Beauty', offer: t('offer10OffServices'), category: 'beauty', type: 'spa', exclusive: false, photo: '/rafe-beauty.jpeg', joinStatus: 'accepted' },
    { id: 23, business: 'SmileCare Clinic', offer: t('offer10to15OffDental'), category: 'beauty', type: 'healthcare', exclusive: false, joinStatus: 'none' },
    { id: 24, business: 'Lotus Medical', offer: t('offerCorporateDiscount'), category: 'beauty', type: 'healthcare', exclusive: false, joinStatus: 'pending' },
    { id: 25, business: 'Iron Grid Gym', offer: t('offerCorporateDiscount'), category: 'fitness', type: 'fitness', exclusive: false, photo: '/bronx-fitness.jpeg', joinStatus: 'member' },
    { id: 26, business: 'Eagle Golf Studio', offer: t('offer20to30Off'), category: 'fitness', type: 'fitness', exclusive: false, joinStatus: 'none' },
    { id: 27, business: 'Kinetic Club', offer: t('offerCorporateDiscount'), category: 'fitness', type: 'fitness', exclusive: false, joinStatus: 'accepted' },
    { id: 28, business: 'EduShield', offer: t('offerInsurancePackages'), category: 'healthcare', type: 'healthcare', exclusive: false, joinStatus: 'none' },
    { id: 29, business: 'MedGlobal', offer: t('offerCorporateDiscount'), category: 'healthcare', type: 'healthcare', exclusive: false, joinStatus: 'pending' },
    { id: 30, business: 'Vertex Academy', offer: t('offer10OffTraining'), category: 'education', type: 'education', exclusive: true, photo: '/aifc-academy.jpeg', joinStatus: 'member' },
    { id: 31, business: 'Nova University', offer: t('offerCorporateDiscount'), category: 'education', type: 'education', exclusive: false, joinStatus: 'none' },
    { id: 32, business: 'Crest School', offer: t('offerCorporateDiscount'), category: 'education', type: 'education', exclusive: false, joinStatus: 'accepted' },
    { id: 33, business: 'Apex Business School', offer: t('offerCorporateDiscount'), category: 'education', type: 'education', exclusive: false, joinStatus: 'none' },
    { id: 34, business: 'International Academy', offer: t('offer10OffTuition'), category: 'education', type: 'education', exclusive: false, joinStatus: 'pending' },
    { id: 35, business: 'Little Stars', offer: t('offerDiscountEntrance'), category: 'education', type: 'education', exclusive: false, joinStatus: 'none' },
    { id: 36, business: 'SkyLink Airways', offer: t('offerCorporateDiscount'), category: 'travel', type: 'travel', exclusive: true, photo: '/tours.jpeg', joinStatus: 'member' },
    { id: 37, business: 'WanderKZ', offer: t('offerCorporateDiscount'), category: 'travel', type: 'travel', exclusive: false, photo: '/burabay.jpeg', joinStatus: 'accepted' },
    { id: 38, business: 'Horizon Travel', offer: t('offerCorporateDiscount'), category: 'travel', type: 'travel', exclusive: false, joinStatus: 'none' },
    { id: 39, business: 'MoveEasy Relocation', offer: t('offer10OffRelocation'), category: 'travel', type: 'travel', exclusive: false, joinStatus: 'pending' },
    { id: 40, business: 'Flora Bloom', offer: t('offer10Off'), category: 'retail', type: 'retail', exclusive: false, photo: '/ana-flowers.jpeg', joinStatus: 'member' },
    { id: 41, business: 'LinkMobile', offer: t('offerSpecialMobilePackage'), category: 'retail', type: 'retail', exclusive: false, joinStatus: 'none' },
    { id: 42, business: 'TalentBridge', offer: t('offerCorporateDiscount'), category: 'retail', type: 'retail', exclusive: false, joinStatus: 'accepted' },
    { id: 43, business: 'TapTatti', offer: t('offerTapTatti'), category: 'food', type: 'cafe', exclusive: false, photo: '/tap-tatti.jpeg', communityIds: ['4','5','6'], joinStatus: 'member' },
    { id: 44, business: 'Master Coffee', offer: t('offerMasterCoffeeQuarter'), category: 'food', type: 'cafe', exclusive: false, photo: '/master-coffee.jpeg', communityIds: ['4','5','6'], joinStatus: 'member' },
    { id: 45, business: 'Delish', offer: t('offerDelish'), category: 'food', type: 'restaurant', exclusive: false, photo: '/delish.jpeg', communityIds: ['4','5','6'], joinStatus: 'member' },
    { id: 46, business: 'Aq Anyz', offer: t('offerAqAnyz'), category: 'food', type: 'restaurant', exclusive: false, photo: '/aq-anyz.jpeg', communityIds: ['4','5','6'], joinStatus: 'accepted' },
    { id: 47, business: 'hani', offer: t('offerHaniBonus'), category: 'retail', type: 'retail', exclusive: false, photo: '/hani.jpeg', communityIds: ['4','5','6'], joinStatus: 'member' },
    { id: 48, business: 'Tary', offer: t('offerTary'), category: 'food', type: 'restaurant', exclusive: false, photo: '/tary.jpeg', communityIds: ['4','5','6'], joinStatus: 'pending' },
  ];

  const events = [
    // ── Past: March 2026 ──────────────────────────────────────────────────
    {
      id: 101, title: 'Vertex Club Launch Party', date: 'Thu, Mar 12 · 19:00', dateISO: '2026-03-12', location: 'Grand Hall, Vertex Tower', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
      ],
    },
    {
      id: 102, title: 'Investment Strategy Breakfast', date: 'Thu, Mar 19 · 08:30', dateISO: '2026-03-19', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 103, title: 'Women in Business Panel', date: 'Wed, Mar 25 · 17:00', dateISO: '2026-03-25', location: 'Vertex Academy, Main Hall', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Past: April 2026 ──────────────────────────────────────────────────
    {
      id: 104, title: 'Spring Wellness Retreat', date: 'Fri, Apr 3 · 09:00', dateISO: '2026-04-03', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 105, title: 'Tech Investors Roundtable', date: 'Fri, Apr 10 · 14:00', dateISO: '2026-04-10', location: 'Vertex Tower, Board Room', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 1, title: 'Vertex Morning Coffee', date: 'Thu, Apr 17 · 09:00', dateISO: '2026-04-17', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 2, title: 'FinTech Seminar 2026', date: 'Fri, Apr 18 · 14:00', dateISO: '2026-04-18', location: 'Vertex Academy, Room 3', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 3, title: 'Networking Business Lunch', date: 'Sat, Apr 19 · 12:30', dateISO: '2026-04-19', location: 'Le Bistro, Vertex Tower', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Almas D.', initials: 'AD', color: '#f0a06a' },
      ],
    },
    {
      id: 4, title: 'Wellness Morning', date: 'Sun, Apr 20 · 08:00', dateISO: '2026-04-20', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      friendsGoing: [],
    },
    {
      id: 106, title: 'Private Members\' Wine Evening', date: 'Fri, Apr 25 · 19:30', dateISO: '2026-04-25', location: 'Chez Georges, Vertex Tower', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Upcoming: May 2026 ────────────────────────────────────────────────
    {
      id: 5, title: 'Digital Nomad Meetup', date: 'Sun, May 4 · 18:00', dateISO: '2026-05-04', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
    {
      id: 6, title: 'Legal Tech Workshop', date: 'Tue, May 6 · 10:00', dateISO: '2026-05-06', location: 'Vertex Academy, Room 5', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 7, title: 'Startup Pitch Night', date: 'Thu, May 8 · 19:00', dateISO: '2026-05-08', location: 'Le Bistro Rooftop', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
      ],
    },
    {
      id: 8, title: 'Yoga & Mindfulness Session', date: 'Sat, May 10 · 08:30', dateISO: '2026-05-10', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      friendsGoing: [
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
      ],
    },
    {
      id: 12, title: 'VIP Breakfast: CEO Speakers Series', date: 'Tue, May 13 · 08:00', dateISO: '2026-05-13', location: 'Vertex Lounge, 24th Floor', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 9, title: 'Real Estate Investment Forum', date: 'Fri, May 15 · 13:00', dateISO: '2026-05-15', location: 'Vertex Tower, Conference Hall', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
      ],
    },
    {
      id: 13, title: 'Wine & Cheese Members\' Evening', date: 'Sat, May 17 · 19:30', dateISO: '2026-05-17', location: 'Chez Georges, Vertex Tower', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
      ],
    },
    {
      id: 14, title: 'AI & Future of Finance Masterclass', date: 'Wed, May 20 · 15:00', dateISO: '2026-05-20', location: 'Vertex Academy, Main Hall', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
    {
      id: 10, title: 'FinTech Happy Hour', date: 'Fri, May 22 · 17:30', dateISO: '2026-05-22', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
      ],
    },
    {
      id: 15, title: 'Vertex Golf Cup 2026', date: 'Sat, May 24 · 10:00', dateISO: '2026-05-24', location: 'Nomad Golf Studio', type: 'fitness' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 16, title: 'Expat & Investor Community Dinner', date: 'Wed, May 27 · 19:00', dateISO: '2026-05-27', location: 'Sheraton Astana, Grand Dining', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
      ],
    },
    {
      id: 11, title: 'Summer Networking Gala', date: 'Thu, May 28 · 19:00', dateISO: '2026-05-28', location: 'Grand Ballroom, Sheraton', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Upcoming: June 2026 ───────────────────────────────────────────────
    {
      id: 17, title: 'Mindfulness & Productivity Workshop', date: 'Wed, Jun 3 · 09:00', dateISO: '2026-06-03', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 18, title: 'Private Equity Deal Sourcing', date: 'Fri, Jun 5 · 14:00', dateISO: '2026-06-05', location: 'Vertex Tower, Board Room', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
    {
      id: 19, title: 'Members\' Cocktail Evening', date: 'Fri, Jun 12 · 18:30', dateISO: '2026-06-12', location: 'Vertex Lounge, 24th Floor', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 20, title: 'Annual General Meeting 2026', date: 'Fri, Jun 19 · 10:00', dateISO: '2026-06-19', location: 'Vertex Academy, Main Hall', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 21, title: 'Summer Rooftop Party', date: 'Fri, Jun 26 · 19:00', dateISO: '2026-06-26', location: 'Le Bistro Rooftop, Vertex Tower', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
  ];

  const TODAY = '2026-05-04';
  const WEEK_END = '2026-05-10';
  const MONTH = '2026-05';
  const upcomingEvents = events.filter(ev => ev.dateISO >= TODAY);
  const pastEvents = events.filter(ev => ev.dateISO < TODAY);

  const filteredEvents = upcomingEvents.filter(ev => {
    const matchType = filterValue === 'all' || ev.type === filterValue;
    const matchSearch = eventSearch === '' || ev.title.toLowerCase().includes(eventSearch.toLowerCase()) || ev.location.toLowerCase().includes(eventSearch.toLowerCase());
    const matchDate = dateFilter === 'all' ? true
      : dateFilter === 'today' ? ev.dateISO === TODAY
      : dateFilter === 'week' ? ev.dateISO >= TODAY && ev.dateISO <= WEEK_END
      : dateFilter === 'month' ? ev.dateISO.startsWith(MONTH)
      : dateFilter === 'mine' ? rsvped.has(ev.id)
      : true;
    return matchType && matchSearch && matchDate;
  });

  const handleShareEvent = (ev: typeof events[0]) => {
    const text = `${ev.title} — ${ev.date} at ${ev.location}`;
    if (navigator.share) {
      navigator.share({ title: ev.title, text });
    } else {
      navigator.clipboard?.writeText(text);
    }
  };

  const tasks = [
    { id: 1, title: 'Attend 2 Vertex Club Events', done: false },
    { id: 2, title: 'Visit 3 Exclusive Partners', done: false },
    { id: 3, title: 'Complete your profile', done: true },
    { id: 4, title: 'Use an offer at Skyline Hotel', done: false },
  ];

  const vacancies = [
    { id: 1, title: 'Financial Analyst', company: 'Vertex Authority', type: 'Full-time' },
    { id: 2, title: 'Legal Counsel', company: 'Vertex Legal', type: 'Full-time' },
    { id: 3, title: 'Marketing Manager', company: 'NexLab', type: 'Contract' },
    { id: 4, title: 'UX Designer', company: 'Fintech startup', type: 'Part-time' },
  ];

  const [newsPosts, setNewsPosts] = useState<NewsPost[]>([
    {
      id: 1, author: 'Vertex HR', time: '2h ago',
      text: 'New parking passes are available at reception. Please collect before Friday.',
      image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80',
      attendees: [],
    },
    {
      id: 2, author: 'Vertex Events', time: '5h ago',
      text: 'The Q2 Networking Breakfast is confirmed for April 17th. RSVP via the Events tab.',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&q=80',
      attendees: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
      ],
    },
    {
      id: 3, author: 'Vertex Security', time: '1d ago',
      text: 'Reminder: tail-gating is prohibited. All guests must be registered at Gate A.',
      image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&q=80',
      attendees: [],
    },
  ]);

  const handlePhotoChange = (postId: number, file: File) => {
    const url = URL.createObjectURL(file);
    setNewsPosts(prev => prev.map(p => p.id === postId ? { ...p, image: url } : p));
  };

  const isQuarterCommunity = id === '4' || id === '5' || id === '6';
  const communityOffers = isQuarterCommunity
    ? offers.filter(o => o.communityIds?.includes(id ?? ''))
    : offers.filter(o => !o.communityIds);

  const filteredOffers = communityOffers.filter((o) => {
    const matchCat = selectedCategory === 'all' || o.category === selectedCategory;
    const matchSearch = o.business.toLowerCase().includes(searchQuery.toLowerCase()) || o.offer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchBiz = selectedBusiness === 'all' || o.business === selectedBusiness;
    return matchCat && matchSearch && matchBiz;
  });

  const tabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
    { key: 'offers', label: t('offers'), icon: ShoppingBag },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'tasks', label: 'Tasks', icon: CheckSquare },
    { key: 'vacancies', label: 'Vacancies', icon: Briefcase },
    { key: 'news', label: 'News', icon: Newspaper },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">

      {/* Header */}
      <div className="bg-gradient-to-b from-[#071c12] to-[#0d3d26] px-4 pt-4 pb-5">
        <div className="max-w-md mx-auto">
          {/* Back button */}
          <Link to="/user" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white mb-4">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          {/* Centered icon + name */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 rounded-2xl overflow-hidden flex items-center justify-center mb-2 shadow-lg">
              {community.logo}
            </div>
            <h1 className="text-white font-bold text-lg leading-tight">{community.name}</h1>
            <p className="text-white/60 text-xs mt-0.5 flex items-center justify-center gap-1">
              <Link to="/user/network" className="hover:text-white transition-colors underline-offset-2 hover:underline">{community.members} {t('members')}</Link>
              <span>·</span>
              <button onClick={() => setShowBusinesses(true)} className="hover:text-white transition-colors underline-offset-2 hover:underline">{community.businesses} {t('businesses')}</button>
            </p>
            {community.addressKey && (
              <div className="flex items-center gap-1 mt-1.5 text-white/40 text-xs">
                <MapPin className="w-3 h-3" />
                <span>{t(community.addressKey as Parameters<typeof t>[0])}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="max-w-md mx-auto px-4 py-3">
        <p className="text-xs text-muted-foreground leading-relaxed">
                  {community.descriptionKey ? t(community.descriptionKey as Parameters<typeof t>[0]) : community.description}
                </p>
        {community.website && (
          <a href={`https://${community.website}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#10b981] mt-1 block hover:underline">{community.website}</a>
        )}
      </div>

      {/* Tab switcher — 2-column grid */}
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 pt-3 pb-2">
          <div className="grid grid-cols-2 gap-2">
            {tabs.map((tb, idx) => {
              const isLastOdd = tabs.length % 2 !== 0 && idx === tabs.length - 1;
              return (
                <button
                  key={tb.key}
                  onClick={() => { setTab(tb.key); setSearchQuery(''); setSelectedCategory('all'); setFilterValue('all'); setDateFilter('all'); setEventSearch(''); }}
                  className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${isLastOdd ? 'col-span-2' : ''} ${
                    tab === tb.key
                      ? 'bg-[#10b981] text-white'
                      : 'bg-input-background text-muted-foreground hover:text-foreground'
                  }`}
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

        {/* EVENTS filters */}
        {tab === 'events' && (
          <div className="space-y-2.5 mb-1">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search events…"
                value={eventSearch}
                onChange={e => setEventSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input-background rounded-xl border border-border focus:border-[#10b981] focus:outline-none transition-colors text-sm"
              />
              {eventSearch && (
                <button onClick={() => setEventSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"><X className="w-3.5 h-3.5" /></button>
              )}
            </div>
            {/* Date filter */}
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide pb-0.5">
              {[{id:'all',label:'All'},{id:'today',label:'Today'},{id:'week',label:'This Week'},{id:'month',label:'This Month'},{id:'mine',label:'My Events'}].map(chip => (
                <button key={chip.id} onClick={() => setDateFilter(chip.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${dateFilter === chip.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                  {chip.label}
                </button>
              ))}
            </div>
            {/* Type filter */}
            <div className="flex gap-2 overflow-x-auto -mx-4 px-4 scrollbar-hide pb-1">
              {[{id:'all',label:'All types'},{id:'cafe',label:'Café'},{id:'education',label:'Education'},{id:'restaurant',label:'Restaurant'},{id:'spa',label:'Wellness'},{id:'fitness',label:'Sport'}].map(chip => (
                <button key={chip.id} onClick={() => setFilterValue(chip.id)}
                  className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${filterValue === chip.id ? 'bg-foreground text-background' : 'bg-input-background text-muted-foreground'}`}>
                  {chip.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TASKS filter */}
        {tab === 'tasks' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {[{id:'all',label:'All'},{id:'pending',label:'Pending'},{id:'completed',label:'Completed'}].map(chip => (
              <button key={chip.id} onClick={() => setFilterValue(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${filterValue === chip.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* VACANCIES filter */}
        {tab === 'vacancies' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {[{id:'all',label:'All'},{id:'Full-time',label:'Full-time'},{id:'Contract',label:'Contract'},{id:'Part-time',label:'Part-time'}].map(chip => (
              <button key={chip.id} onClick={() => setFilterValue(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${filterValue === chip.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* NEWS filter */}
        {tab === 'news' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {[{id:'all',label:'All'},{id:'HR',label:'HR'},{id:'Events',label:'Events'},{id:'Security',label:'Security'}].map(chip => (
              <button key={chip.id} onClick={() => setFilterValue(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${filterValue === chip.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                {chip.label}
              </button>
            ))}
          </div>
        )}

        {/* OFFERS TAB */}
        {tab === 'offers' && (
          <>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('searchOffers')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-input-background rounded-xl border border-border focus:border-[#10b981] focus:outline-none transition-colors text-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide mb-2">
              <button onClick={() => { setSelectedCategory('all'); setSelectedBusiness('all'); }} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === 'all' ? 'bg-[#10b981] text-white' : 'bg-input-background text-foreground'}`}>{t('all')}</button>
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <button key={cat.id} onClick={() => { setSelectedCategory(cat.id); setSelectedBusiness('all'); }} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${selectedCategory === cat.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-foreground'}`}>
                    <Icon className="w-3.5 h-3.5" />{cat.name}
                  </button>
                );
              })}
            </div>
            {/* Business filter */}
            {(() => {
              const bizList = Array.from(new Map(
                offers.filter(o => selectedCategory === 'all' || o.category === selectedCategory).map(o => [o.business, o])
              ).values());
              return (
                <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide mb-3">
                  <button onClick={() => setSelectedBusiness('all')} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${selectedBusiness === 'all' ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' : 'bg-input-background text-muted-foreground'}`}>
                    All businesses
                  </button>
                  {bizList.map(o => (
                    <button key={o.business} onClick={() => setSelectedBusiness(o.business)}
                      className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap transition-colors flex-shrink-0 ${selectedBusiness === o.business ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30' : 'bg-input-background text-muted-foreground'}`}>
                      {o.business}
                    </button>
                  ))}
                </div>
              );
            })()}
            <div className="grid grid-cols-2 gap-3">
              {filteredOffers.map((offer) => (
                <Link key={offer.id} to={`/user/offer/${offer.id}`}
                  state={{ business: offer.business, businessType: offer.type, category: offer.type === 'cafe' ? 'Кафе' : offer.type === 'restaurant' ? 'Ресторан' : offer.type === 'hotel' ? 'Отель' : offer.type === 'spa' ? 'Спа и красота' : offer.type === 'fitness' ? 'Фитнес' : offer.type === 'education' ? 'Образование' : offer.type === 'healthcare' ? 'Медицина' : offer.type === 'travel' ? 'Путешествия' : 'Ретейл', discount: offer.offer, photo: offer.photo, color: '#10b981', gradient: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', joinStatus: (id === '4' || id === '5' || id === '6') ? 'member' : 'none' }}
                  className="flex flex-col bg-card border border-border rounded-2xl overflow-hidden hover:border-[#10b981] transition-colors">
                  {offer.photo ? (
                    <img src={offer.photo} alt={offer.business} className="w-full h-24 object-cover" />
                  ) : (
                    <div className="w-full h-24 flex items-center justify-center" style={{ background: { restaurant: 'linear-gradient(135deg,#1a0800,#3d1500)', cafe: 'linear-gradient(135deg,#1a1000,#3d2800)', hotel: 'linear-gradient(135deg,#00101a,#001f3d)', spa: 'linear-gradient(135deg,#1a0020,#2d0040)', fitness: 'linear-gradient(135deg,#001a08,#003d18)', education: 'linear-gradient(135deg,#00101f,#001a3d)', healthcare: 'linear-gradient(135deg,#001a1a,#003030)', travel: 'linear-gradient(135deg,#000d1a,#001630)', retail: 'linear-gradient(135deg,#1a0010,#35001f)' }[offer.type] ?? 'linear-gradient(135deg,#111,#222)' }}>
                      <BusinessLogo name={offer.business} type={offer.type} size="md" />
                    </div>
                  )}
                  <div className="p-3 pt-2 flex flex-col flex-1">
                    <h3 className="text-xs font-semibold leading-tight mb-1 line-clamp-1">{offer.business}</h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2 flex-1">{offer.offer}</p>
                    <span className="inline-flex items-center text-[10px] px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded-full self-start">{t('active')}</span>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* EVENTS TAB */}
        {tab === 'events' && (
          <div className="space-y-3">
            {filteredEvents.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-10">No events found</p>
            )}

            {filteredEvents.map((ev) => {
              const gone = rsvped.has(ev.id);
              const reminded = reminders.has(ev.id);
              return (
                <div key={ev.id} className="bg-card border border-border rounded-2xl p-4">
                  <div className="flex gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm mb-0.5">{ev.title}</p>
                      <p className="text-xs text-muted-foreground mb-0.5">{ev.date}</p>
                      <p className="text-xs text-muted-foreground">{ev.location}</p>
                    </div>
                    {/* Reminder + Share */}
                    <div className="flex items-start gap-1.5 shrink-0">
                      <button
                        onClick={() => setReminders(prev => { const s = new Set(prev); reminded ? s.delete(ev.id) : s.add(ev.id); return s; })}
                        title={reminded ? 'Remove reminder' : 'Set reminder'}
                        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                        style={reminded ? { background: 'rgba(16,185,129,0.15)', color: '#10b981' } : { background: 'var(--input-background)', color: 'var(--muted-foreground)' }}
                      >
                        {reminded ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleShareEvent(ev)}
                        className="w-8 h-8 rounded-xl bg-input-background flex items-center justify-center text-muted-foreground"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Friends going */}
                  {ev.friendsGoing.length > 0 && (
                    <button
                      onClick={() => setInviteEvent({ title: ev.title, going: ev.friendsGoing })}
                      className="flex items-center gap-2 mt-3 w-full text-left active:opacity-70 transition-opacity"
                    >
                      <div className="flex -space-x-2">
                        {ev.friendsGoing.slice(0, 4).map((f) => (
                          <div
                            key={f.initials + f.name}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card"
                            style={{ background: f.color + '30', color: f.color, borderColor: 'var(--card)' }}
                          >
                            {f.initials}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground font-medium">
                          {ev.friendsGoing.slice(0, 2).map(f => f.name.split(' ')[0]).join(', ')}
                        </span>
                        {ev.friendsGoing.length > 2 && ` +${ev.friendsGoing.length - 2} more`}
                        {' '}going
                      </p>
                    </button>
                  )}

                  {gone ? (
                    <div className="mt-3 flex gap-2">
                      <div className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-[#10b981] text-white text-sm font-medium">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        You're going
                      </div>
                      <button
                        onClick={() => setRsvped(prev => { const s = new Set(prev); s.delete(ev.id); const saved = JSON.parse(localStorage.getItem('sagi_calendar_events') || '[]'); localStorage.setItem('sagi_calendar_events', JSON.stringify(saved.filter((e: any) => e.id !== ev.id))); return s; })}
                        className="px-4 py-2 rounded-xl text-sm text-muted-foreground bg-input-background hover:text-red-400 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setRsvped(prev => { const s = new Set(prev); s.add(ev.id); const saved = JSON.parse(localStorage.getItem('sagi_calendar_events') || '[]'); if (!saved.find((e: any) => e.id === ev.id)) { localStorage.setItem('sagi_calendar_events', JSON.stringify([...saved, { id: ev.id, title: ev.title, date: ev.date, dateISO: ev.dateISO, location: ev.location, friendsGoing: ev.friendsGoing }])); } return s; })}
                      className="mt-3 w-full py-2 rounded-xl text-sm font-medium bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 transition-colors"
                    >
                      I'm Going
                    </button>
                  )}
                </div>
              );
            })}

            {/* Past events */}
            {pastEvents.length > 0 && dateFilter === 'all' && (
              <div className="pt-2">
                <button
                  onClick={() => setShowPast(v => !v)}
                  className="flex items-center gap-2 text-sm text-muted-foreground mb-3 hover:text-foreground transition-colors"
                >
                  {showPast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  Past events ({pastEvents.length})
                </button>
                {showPast && (
                  <div className="space-y-3">
                    {pastEvents.map(ev => (
                      <div key={ev.id} className="bg-card border border-border rounded-2xl p-4 opacity-60">
                        <div className="flex gap-3">
                          <div className="w-11 h-11 rounded-xl bg-input-background flex items-center justify-center flex-shrink-0">
                            <Calendar className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm mb-0.5 line-through text-muted-foreground">{ev.title}</p>
                            <p className="text-xs text-muted-foreground">{ev.date}</p>
                            <p className="text-xs text-muted-foreground">{ev.location}</p>
                          </div>
                          <button onClick={() => handleShareEvent(ev)} className="w-8 h-8 rounded-xl bg-input-background flex items-center justify-center text-muted-foreground shrink-0">
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                        {ev.friendsGoing.length > 0 && (
                          <div className="flex items-center gap-2 mt-3">
                            <div className="flex -space-x-2">
                              {ev.friendsGoing.slice(0, 4).map(f => (
                                <div key={f.initials} className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2 border-card" style={{ background: f.color + '20', color: f.color, borderColor: 'var(--card)' }}>{f.initials}</div>
                              ))}
                            </div>
                            <p className="text-xs text-muted-foreground">{ev.friendsGoing.slice(0, 2).map(f => f.name.split(' ')[0]).join(', ')}{ev.friendsGoing.length > 2 && ` +${ev.friendsGoing.length - 2} more`} attended</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TASKS TAB */}
        {tab === 'tasks' && (
          <div>
            <div className="space-y-3">
              {tasks.filter(task => {
                const done = taskDone.has(task.id) || task.done;
                if (filterValue === 'pending') return !done;
                if (filterValue === 'completed') return done;
                return true;
              }).map((task) => {
                const done = taskDone.has(task.id) || task.done;
                return (
                  <div key={task.id} className={`bg-card border rounded-2xl p-4 flex items-center gap-3 ${done ? 'border-[#10b981]/30 opacity-70' : 'border-border'}`}>
                    <button
                      onClick={() => !task.done && setTaskDone(prev => { const s = new Set(prev); done ? s.delete(task.id) : s.add(task.id); return s; })}
                      className={`w-6 h-6 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${done ? 'bg-[#10b981] border-[#10b981]' : 'border-muted-foreground'}`}
                    >
                      {done && <span className="text-white text-xs">✓</span>}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>{task.title}</p>
                    </div>
                    <span className={`text-xs font-medium ${done ? 'text-[#10b981]' : 'text-muted-foreground'}`}>
                      {done ? 'Done' : 'Pending'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Leaderboard */}
            {(() => {
              const totalTasks = tasks.length;
              const myCompleted = tasks.filter(t => taskDone.has(t.id) || t.done).length;

              const staticMembers: { name: string; initials: string; color: string; completed: number; isYou?: boolean }[] = [
                { name: 'Kamila D.', initials: 'KD', color: '#f06ac8', completed: 4 },
                { name: 'Arman K.', initials: 'AK', color: '#6aaff0', completed: 3 },
                { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a', completed: 3 },
                { name: 'Farida B.', initials: 'FB', color: '#f06a80', completed: 2 },
                { name: 'Aizat B.', initials: 'AB', color: '#7c6af0', completed: 2 },
                { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a', completed: 1 },
                { name: 'Madina I.', initials: 'MI', color: '#c86af0', completed: 0 },
                { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0', completed: 0 },
              ];

              const allEntries = [
                ...staticMembers,
                { name: 'You', initials: 'Zh', color: '#10b981', completed: myCompleted, isYou: true },
              ].sort((a, b) => b.completed - a.completed);

              const medalColors = ['#FFD700', '#A8A8A8', '#CD7F32'];

              return (
                <div className="mt-6">
                  <button
                    onClick={() => setShowLeaderboard(v => !v)}
                    className="flex items-center gap-2 mb-3 w-full text-left"
                  >
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm font-semibold flex-1">Leaderboard</p>
                    {showLeaderboard
                      ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                  </button>
                  {showLeaderboard && (
                    <div className="bg-card border border-border rounded-2xl overflow-hidden">
                      {(showMoreLeaderboard ? allEntries : allEntries.slice(0, 3)).map((member, idx) => {
                        const rank = idx + 1;
                        const isMe = !!member.isYou;
                        return (
                          <button
                            key={member.name}
                            onClick={() => {
                              if (!isMe) {
                                setAttendeeCard({ name: member.name, initials: member.initials, color: member.color });
                                setAttendeeScheduleOpen(true);
                              }
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 text-left transition-colors ${isMe ? '' : 'active:bg-muted/40'}`}
                            style={isMe ? { background: 'rgba(16,185,129,0.07)' } : undefined}
                          >
                            {/* Medal / Rank */}
                            <div className="w-7 flex items-center justify-center flex-shrink-0">
                              {rank <= 3 ? (
                                <div
                                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                                  style={{ background: medalColors[rank - 1] }}
                                >
                                  {rank}
                                </div>
                              ) : (
                                <span className="text-sm text-muted-foreground">—</span>
                              )}
                            </div>

                            {/* Avatar */}
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: member.color + '28', color: member.color }}
                            >
                              {member.initials}
                            </div>

                            {/* Name */}
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm font-medium truncate ${isMe ? 'text-[#10b981]' : ''}`}>{member.name}</p>
                            </div>

                            {/* Score */}
                            <div className="text-right flex-shrink-0">
                              <p className={`text-sm font-semibold tabular-nums ${isMe ? 'text-[#10b981]' : ''}`}>
                                {member.completed} / {totalTasks}
                              </p>
                            </div>
                          </button>
                        );
                      })}

                      {allEntries.length > 3 && (
                        <button
                          onClick={() => setShowMoreLeaderboard(v => !v)}
                          className="w-full py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border"
                        >
                          {showMoreLeaderboard ? 'Show less' : `Show ${allEntries.length - 3} more`}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })()}
          </div>
        )}

        {/* VACANCIES TAB */}
        {tab === 'vacancies' && (
          <div className="space-y-3">
            {vacancies.filter(v => filterValue === 'all' || v.type === filterValue).map((v) => (
              <div key={v.id} className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5 text-[#3b82f6]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{v.title}</p>
                  <p className="text-xs text-muted-foreground">{v.company}</p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-input-background text-muted-foreground rounded-full whitespace-nowrap">{v.type}</span>
              </div>
            ))}
          </div>
        )}

        {/* NEWS TAB */}
        {tab === 'news' && (
          <div className="space-y-3">
            {newsPosts.filter(post => filterValue === 'all' || post.author.includes(filterValue)).map((post) => (
              <div key={post.id} className="bg-card border border-border rounded-2xl overflow-hidden">
                {/* Photo with admin edit overlay */}
                <div className="relative">
                  {post.image && (
                    <img src={post.image} alt="" className="w-full h-44 object-cover" />
                  )}
                  {isAdmin && (
                    <>
                      <input
                        ref={el => { fileInputRefs.current[post.id] = el; }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) handlePhotoChange(post.id, file);
                          e.target.value = '';
                        }}
                      />
                      <button
                        onClick={() => fileInputRefs.current[post.id]?.click()}
                        className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white transition-all hover:opacity-90"
                        style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)', border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Change photo
                      </button>
                    </>
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#10b981]/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-[#10b981]">{post.author.slice(0, 2)}</span>
                      </div>
                      <p className="text-xs font-semibold">{post.author}</p>
                    </div>
                    <p className="text-[10px] text-muted-foreground">{post.time}</p>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.text}</p>

                  {/* Who's coming */}
                  {post.attendees.length > 0 && (
                    <button
                      onClick={() => setInviteEvent({ title: post.author, going: post.attendees })}
                      className="flex items-center gap-2 mt-3 pt-3 border-t border-border w-full text-left active:opacity-70 transition-opacity"
                    >
                      <div className="flex -space-x-2">
                        {post.attendees.slice(0, 5).map((a) => (
                          <div
                            key={a.name}
                            title={a.name}
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2"
                            style={{ background: a.color + '30', color: a.color, borderColor: 'var(--card)' }}
                          >
                            {a.initials}
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        <span className="text-foreground font-medium">
                          {post.attendees.slice(0, 2).map(a => a.name.split(' ')[0]).join(', ')}
                        </span>
                        {post.attendees.length > 2 && ` +${post.attendees.length - 2} more`}
                        {' '}going
                      </p>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Businesses modal */}
      {showBusinesses && (() => {
        const unique = Array.from(new Map(communityOffers.map(o => [o.business, o])).values());
        const filtered = unique.filter(o =>
          (bizCategory === 'all' || o.category === bizCategory) &&
          o.business.toLowerCase().includes(bizSearch.toLowerCase())
        );
        return (
          <div
            className="fixed inset-0 z-50 flex flex-col justify-end items-center"
            style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            onClick={() => { setShowBusinesses(false); setBizSearch(''); setBizCategory('all'); }}
          >
            <div
              className="w-full max-w-md bg-card rounded-t-3xl flex flex-col"
              style={{ maxHeight: '88vh' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-center pt-3 pb-1 shrink-0">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <div>
                  <h2 className="text-lg font-semibold">Businesses</h2>
                  <p className="text-xs text-muted-foreground">{unique.length} companies</p>
                </div>
                <button onClick={() => { setShowBusinesses(false); setBizSearch(''); setBizCategory('all'); }} className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="px-4 pt-3 pb-2 shrink-0">
                <div className="flex items-center gap-2 rounded-2xl px-3 py-2.5 bg-input-background mb-3">
                  <Search className="w-4 h-4 text-muted-foreground shrink-0" />
                  <input
                    type="text"
                    placeholder="Search businesses..."
                    value={bizSearch}
                    onChange={e => setBizSearch(e.target.value)}
                    className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
                  />
                  {bizSearch && <button onClick={() => setBizSearch('')} className="text-muted-foreground"><X className="w-3.5 h-3.5" /></button>}
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
                  <button onClick={() => setBizCategory('all')} className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${bizCategory === 'all' ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>All</button>
                  {categories.map(cat => {
                    const Icon = cat.icon;
                    return (
                      <button key={cat.id} onClick={() => setBizCategory(cat.id)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${bizCategory === cat.id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                        <Icon className="w-3.5 h-3.5" />{cat.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="overflow-y-auto flex-1 px-4 pb-8 pt-2 space-y-2">
                {filtered.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-10">No results</p>
                )}
                {filtered.map(o => (
                  <div key={o.business} className="flex items-center gap-3 bg-input-background rounded-2xl px-3 py-3">
                    <BusinessLogo name={o.business} type={o.type} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{o.business}</p>
                      <p className="text-xs text-muted-foreground capitalize">{o.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Invite modal */}
      {inviteEvent && (
        <InviteModal
          eventTitle={inviteEvent.title}
          going={inviteEvent.going}
          onClose={() => setInviteEvent(null)}
          onSelectContact={contact => { setAttendeeCard(contact); setAttendeeScheduleOpen(true); }}
        />
      )}

      {/* Attendee profile card — Network style */}
      {attendeeCard && (() => {
        const profile = ATTENDEE_PROFILES[attendeeCard.initials];
        const isConnected = eventConnected.has(attendeeCard.initials);
        return (
          <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={() => setAttendeeCard(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div
              className="relative bg-card rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto w-full max-w-md"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
              <button
                onClick={() => setAttendeeCard(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Avatar + name row */}
              <div className="flex items-center gap-4 mb-5">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                  style={{ background: attendeeCard.color + '20', border: `2px solid ${attendeeCard.color}`, color: attendeeCard.color }}
                >
                  {attendeeCard.initials}
                </div>
                <div>
                  <div className="font-bold text-base">{attendeeCard.name}</div>
                  {profile && <div className="text-sm text-muted-foreground mt-0.5">{profile.role}</div>}
                  {profile?.location && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                      <MapPin className="w-3 h-3 shrink-0" />{profile.location}
                    </div>
                  )}
                  {profile && (
                    <div className="text-xs text-muted-foreground mt-1">
                      <span className="font-medium text-foreground">{profile.mutualCount}</span> mutual connections
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {profile && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {profile.tags.map(tag => (
                    <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{tag}</span>
                  ))}
                </div>
              )}

              {/* Connections stat */}
              {profile && (
                <div className="mb-5">
                  <div className="bg-muted/40 rounded-2xl p-3 text-center">
                    <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                    <div className="text-base font-bold">{profile.connections}</div>
                    <div className="text-[10px] text-muted-foreground">Connections</div>
                  </div>
                </div>
              )}

              {/* AI Analysis */}
              {profile && (
                <div className="bg-muted/40 rounded-2xl p-4 mb-5">
                  <div className="flex items-center gap-1.5 mb-3">
                    <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
                  </div>
                  <ul className="space-y-2">
                    {profile.aiSummary.map((line, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: attendeeCard.color }} />
                        {line}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Reach via */}
              {profile && (
                <p className="text-xs text-muted-foreground mb-5">
                  Reach via: <span className="text-foreground font-medium">{profile.mutualNames.join(', ')}</span>
                </p>
              )}

              {/* Upcoming Schedule */}
              {(() => {
                const schedule = PERSON_SCHEDULE[attendeeCard.initials] ?? [];
                return (
                  <div className="mb-5">
                    <button
                      onClick={() => setAttendeeScheduleOpen(v => !v)}
                      className="flex items-center gap-1.5 mb-3 w-full"
                    >
                      <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                      <span className="text-xs font-semibold text-[#10b981] flex-1 text-left">Upcoming Schedule</span>
                      {attendeeScheduleOpen
                        ? <ChevronUp className="w-3.5 h-3.5 text-[#10b981]" />
                        : <ChevronDown className="w-3.5 h-3.5 text-[#10b981]" />}
                    </button>
                    {attendeeScheduleOpen && (
                      schedule.length === 0 ? (
                        <p className="text-xs text-muted-foreground">No upcoming shared events</p>
                      ) : (
                        <div className="space-y-2">
                          {schedule.map((ev, i) => {
                            const d = new Date(ev.dateISO);
                            const dayNum = d.getDate();
                            const dayName = d.toLocaleDateString('en', { weekday: 'short' });
                            return (
                              <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-2xl px-3 py-2.5">
                                <div className="w-9 shrink-0 flex flex-col items-center rounded-xl py-1" style={{ background: attendeeCard.color + '15' }}>
                                  <span className="text-[9px] font-semibold uppercase" style={{ color: attendeeCard.color }}>{dayName}</span>
                                  <span className="text-sm font-bold leading-tight" style={{ color: attendeeCard.color }}>{dayNum}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-semibold leading-tight mb-0.5">{ev.title}</p>
                                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                    <MapPin className="w-2.5 h-2.5 shrink-0" />
                                    <span className="truncate">{ev.location}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )
                    )}
                  </div>
                );
              })()}

              <button
                onClick={() => {
                  setEventConnected(prev => { const s = new Set(prev); isConnected ? s.delete(attendeeCard.initials) : s.add(attendeeCard.initials); return s; });
                  if (!isConnected) setAttendeeCard(null);
                }}
                className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
                style={{ background: attendeeCard.color }}
              >
                {isConnected ? '⏳ Pending' : '+ Connect'}
              </button>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
