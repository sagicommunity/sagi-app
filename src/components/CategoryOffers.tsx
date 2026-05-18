import React, { useState, useRef } from 'react';
import { ChevronLeft, Search, UtensilsCrossed, GraduationCap, Sparkles, ShoppingBag, Building2, Dumbbell, HeartPulse, Plane, Calendar, Trophy, Zap, Briefcase, Newspaper, Camera, X, MapPin, Bell, BellOff, Share2, MessageCircle, ChevronDown, ChevronUp, Users, Activity, ChevronRight } from 'lucide-react';
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
type Tab = 'offers' | 'events' | 'tasks' | 'vacancies' | 'news' | 'steps';
type StepsPeriod = 'today' | 'yesterday' | 'week' | 'month';

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

interface CommunityEvent {
  id: number; title: string; date: string; dateISO: string;
  location: string; type: BizType;
  description?: string;
  friendsGoing: { name: string; initials: string; color: string }[];
  slots?: { filled: number; total: number };
  price?: number;
  waitlistCount?: number;
}

type ChallengeType = 'sport' | 'networking' | 'charity' | 'daily' | 'streak' | 'goal';

const CHALLENGE_TYPE: Record<ChallengeType, { label: string; color: string; bg: string }> = {
  sport:      { label: 'Sport',          color: '#f97316', bg: '#f9731618' },
  networking: { label: 'Networking',     color: '#3b82f6', bg: '#3b82f618' },
  charity:    { label: 'Charity',        color: '#ec4899', bg: '#ec489918' },
  daily:      { label: 'Daily',          color: '#10b981', bg: '#10b98118' },
  streak:     { label: 'Streak',         color: '#8b5cf6', bg: '#8b5cf618' },
  goal:       { label: 'Community Goal', color: '#eab308', bg: '#eab30818' },
};

interface Challenge {
  id: number; type: ChallengeType; icon: string; title: string; description: string;
  points: number; slots?: { filled: number; total: number };
  verify: 'auto';
  isRecurring?: boolean; deadline?: string;
  startISO?: string;
}

const CHALLENGES: Challenge[] = [
  { id: 1, type: 'sport', icon: '⚽', title: 'Saturday Football', description: 'Weekly 5v5 match on Vertex pitch. Open to all levels. RSVP to reserve your spot.', points: 50, slots: { filled: 12, total: 18 }, verify: 'auto', deadline: 'Сб, 24 мая · 10:00', startISO: '2026-05-24T10:00:00' },
  { id: 2, type: 'networking', icon: '🤝', title: 'Q2 Networking Breakfast', description: 'Meet 3 new members over breakfast. Structured speed-networking format. RSVP to join.', points: 80, slots: { filled: 34, total: 50 }, verify: 'auto', deadline: 'Чт, 22 мая · 9:00', startISO: '2026-05-22T09:00:00' },
  { id: 3, type: 'charity', icon: '📖', title: 'Books for Schools Drive', description: 'Drop off books at the Vertex lobby. Any donation counts — join to participate.', points: 100, slots: { filled: 67, total: 100 }, verify: 'auto', deadline: '31 мая' },
  { id: 5, type: 'streak', icon: '🎫', title: 'Attend 2 Vertex Events', description: 'RSVP and attend any 2 official Vertex Club events this quarter to earn the streak badge.', points: 60, verify: 'auto' },
  { id: 6, type: 'goal', icon: '🏨', title: 'Skyline Hotel Collective', description: 'Community goal: 100 members visit Skyline this month — unlocks a 15% collective discount for all.', points: 40, slots: { filled: 43, total: 100 }, verify: 'auto' },
];

type WeekStatus = 'done' | 'missed' | 'empty';

interface GroupChallenge {
  id: number;
  icon: string;
  title: string;
  tasks: string[];
  color: string;
  type: ChallengeType;
  description?: string;
  pointsPerDay: number;
  participants: { name: string; color: string; week: WeekStatus[] }[];
}

const DAYS_RU = ['пн', 'вт', 'ср', 'чт', 'пт', 'сб', 'вс'];

const GROUP_CHALLENGES: GroupChallenge[] = [
  {
    id: 201, icon: '💪', title: 'Утренняя тренировка', color: '#f97316', type: 'sport' as ChallengeType, pointsPerDay: 10,
    tasks: ['50 отжиманий', '50 приседаний', '50 трицепс'],
    participants: [
      { name: 'Арм.',  color: '#6aaff0', week: ['done','done','done','done','done','done','done'] },
      { name: 'Кам.',  color: '#f06ac8', week: ['done','done','done','done','done','done','done'] },
      { name: 'Дан.',  color: '#f06a6a', week: ['done','done','missed','done','done','done','done'] },
      { name: 'Фар.',  color: '#f06a80', week: ['done','done','done','done','missed','done','done'] },
      { name: 'Аиз.',  color: '#7c6af0', week: ['done','done','done','missed','done','done','done'] },
      { name: 'Мад.',  color: '#c86af0', week: ['done','done','done','done','done','done','done'] },
      { name: 'Зар.',  color: '#f0c86a', week: ['empty','empty','empty','done','empty','empty','empty'] },
      { name: 'Рус.',  color: '#6af0e0', week: ['done','done','done','done','done','done','empty'] },
      { name: 'Нар.',  color: '#a0b0c0', week: ['empty','empty','empty','empty','done','empty','empty'] },
    ],
  },
  {
    id: 203, icon: '📚', title: 'Книжный клуб', color: '#8b5cf6', type: 'daily' as ChallengeType, pointsPerDay: 5,
    description: 'Читай минимум 20 страниц в день и отмечай прогресс. Строй стрик вместе с командой — пропуск одного дня сбрасывает серию.',
    tasks: ['20 страниц в день'],
    participants: [
      { name: 'Кам.',  color: '#f06ac8', week: ['done','done','done','done','done','empty','empty'] },
      { name: 'Тим.',  color: '#f0c46a', week: ['done','done','done','done','done','empty','empty'] },
      { name: 'Мад.',  color: '#c86af0', week: ['done','missed','done','done','done','empty','empty'] },
      { name: 'Алм.',  color: '#f07a6a', week: ['done','done','done','done','done','empty','empty'] },
    ],
  },
  {
    id: 202, icon: '🏃', title: 'Vertex Run Club', color: '#3b82f6', type: 'sport' as ChallengeType, pointsPerDay: 15,
    tasks: ['5 км бег'],
    participants: [
      { name: 'Тим.',  color: '#f0c46a', week: ['done','empty','done','empty','done','done','empty'] },
      { name: 'Олж.',  color: '#80f0c8', week: ['done','done','done','missed','done','done','done'] },
      { name: 'Алм.',  color: '#f07a6a', week: ['done','done','done','done','done','done','done'] },
      { name: 'Кен.',  color: '#6a80f0', week: ['done','empty','done','done','done','empty','done'] },
      { name: 'Ера.',  color: '#f0c8a0', week: ['done','done','missed','done','done','done','done'] },
      { name: 'Арст.', color: '#6af080', week: ['done','done','empty','done','empty','done','done'] },
    ],
  },
];

interface LeaderboardEntry { name: string; initials: string; color: string; points: number; isYou?: boolean; }

const LEADERBOARD_MEMBERS: LeaderboardEntry[] = [
  { name: 'Kamila D.', initials: 'KD', color: '#f06ac8', points: 280 },
  { name: 'Arman K.',  initials: 'AK', color: '#6aaff0', points: 240 },
  { name: 'Daniyar S.',initials: 'DS', color: '#f06a6a', points: 210 },
  { name: 'Farida B.', initials: 'FB', color: '#f06a80', points: 160 },
  { name: 'Aizat B.',  initials: 'AB', color: '#7c6af0', points: 140 },
  { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a', points:  80 },
  { name: 'Madina I.', initials: 'MI', color: '#c86af0', points:  30 },
  { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0', points:   0 },
];

interface StepEntry {
  name: string; initials: string; color: string;
  steps: Partial<Record<StepsPeriod, number | null>>;
}

const COMMUNITY_STEPS: StepEntry[] = [
  { name: 'Arman K.',  initials: 'AK', color: '#6aaff0', steps: { today: 8432, yesterday: 11203, week: 52840, month: 198430 } },
  { name: 'Kamila D.', initials: 'KD', color: '#f06ac8', steps: { today: 6120, yesterday: 7890,  week: 41200, month: 156000 } },
  { name: 'Daniyar S.',initials: 'DS', color: '#f06a6a', steps: { today: 5670, yesterday: null,   week: 38900, month: 145200 } },
  { name: 'Farida B.', initials: 'FB', color: '#f06a80', steps: { today: null, yesterday: 6540,  week: 33200, month: 128400 } },
  { name: 'Aizat B.',  initials: 'AB', color: '#7c6af0', steps: { today: 4230, yesterday: 8120,  week: 29800, month: 112000 } },
  { name: 'Madina I.', initials: 'MI', color: '#c86af0', steps: { today: null, yesterday: null,   week: 22100, month:  89300 } },
  { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0', steps: { today: 2890, yesterday: 5430,  week: 19600, month:  74200 } },
  { name: 'Timur Z.',  initials: 'TZ', color: '#f0c46a', steps: { today: null, yesterday: null,   week: null,  month:  41200 } },
  { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a', steps: { today: null, yesterday: 3240,  week: 14500, month:  58900 } },
];

const MY_STEPS: Record<StepsPeriod, number> = { today: 3927, yesterday: 9145, week: 38210, month: 142800 };

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
  const [joined, setJoined] = useState<Set<number>>(new Set());
  const [verified, setVerified] = useState<Set<number>>(new Set());
  const [eventSearch, setEventSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [reminders, setReminders] = useState<Set<number>>(new Set());
  const [expandedDescs, setExpandedDescs] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const [shareEvent, setShareEvent] = useState<typeof events[0] | null>(null);
  const [showPast, setShowPast] = useState(false);
  const [attendeeCard, setAttendeeCard] = useState<{ name: string; initials: string; color: string } | null>(null);
  const [inviteEvent, setInviteEvent] = useState<{ title: string; going: { name: string; initials: string; color: string }[] } | null>(null);
  const [attendeeScheduleOpen, setAttendeeScheduleOpen] = useState(true);
  const [eventConnected, setEventConnected] = useState<Set<string>>(new Set());
  const [waitlisted, setWaitlisted] = useState<Set<number>>(new Set());
  const [eventChat, setEventChat] = useState<number | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(true);
  const [showMoreLeaderboard, setShowMoreLeaderboard] = useState(false);
  const [collapsedGroups, setCollapsedGroups] = useState<Set<number>>(new Set());
  const [markedGroupDays, setMarkedGroupDays] = useState<Record<number, Set<number>>>({});
  const [joinedGroups, setJoinedGroups] = useState<Set<number>>(new Set());
  const [stepsPeriod, setStepsPeriod] = useState<StepsPeriod>('today');
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

  const events: CommunityEvent[] = [
    // ── Past: March 2026 ──────────────────────────────────────────────────
    {
      id: 101, title: 'Vertex Club Launch Party', date: 'Thu, Mar 12 · 19:00', dateISO: '2026-03-12', location: 'Grand Hall, Vertex Tower', type: 'restaurant' as BizType,
      description: 'Официальное открытие Vertex Club. Коктейли, нетворкинг и знакомство с первыми участниками клуба в формате cocktail party.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
      ],
    },
    {
      id: 102, title: 'Investment Strategy Breakfast', date: 'Thu, Mar 19 · 08:30', dateISO: '2026-03-19', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      description: 'Закрытый завтрак для инвесторов: обсуждение рыночных стратегий Q2, трендов и возможностей для co-investment в регионе.',
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 103, title: 'Women in Business Panel', date: 'Wed, Mar 25 · 17:00', dateISO: '2026-03-25', location: 'Vertex Academy, Main Hall', type: 'education' as BizType,
      description: 'Дискуссия с лидерами бизнеса о карьере, балансе и лидерстве. Спикеры — 4 женщины-руководителя из разных отраслей AIFC.',
      friendsGoing: [
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Past: April 2026 ──────────────────────────────────────────────────
    {
      id: 104, title: 'Spring Wellness Retreat', date: 'Fri, Apr 3 · 09:00', dateISO: '2026-04-03', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      description: 'Однодневный велнес-ретрит: йога, медитация, питательный бранч и индивидуальные спа-процедуры для участников клуба.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 105, title: 'Tech Investors Roundtable', date: 'Fri, Apr 10 · 14:00', dateISO: '2026-04-10', location: 'Vertex Tower, Board Room', type: 'education' as BizType,
      description: 'Закрытый круглый стол для инвесторов в tech: разбор сделок, оценка стартапов, взгляд на казахстанский венчурный рынок.',
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 1, title: 'Vertex Morning Coffee', date: 'Thu, Apr 17 · 09:00', dateISO: '2026-04-17', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType, slots: { filled: 8, total: 15 },
      description: 'Камерный утренний кофе для участников клуба. Неформальное общение, обмен идеями и знакомство с новыми членами.',
      friendsGoing: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 2, title: 'FinTech Seminar 2026', date: 'Fri, Apr 18 · 14:00', dateISO: '2026-04-18', location: 'Vertex Academy, Room 3', type: 'education' as BizType,
      description: 'Семинар по ключевым трендам финтех-индустрии: open banking, CBDC, регуляторика AIFC. Практические кейсы от действующих игроков рынка.',
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 3, title: 'Networking Business Lunch', date: 'Sat, Apr 19 · 12:30', dateISO: '2026-04-19', location: 'Le Bistro, Vertex Tower', type: 'restaurant' as BizType, slots: { filled: 18, total: 20 }, price: 15000,
      description: 'Бизнес-ланч в формате speed networking: 5 минут на каждого участника. Обед включён. Идеально для быстрых и качественных знакомств.',
      friendsGoing: [
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Almas D.', initials: 'AD', color: '#f0a06a' },
      ],
    },
    {
      id: 4, title: 'Wellness Morning', date: 'Sun, Apr 20 · 08:00', dateISO: '2026-04-20', location: 'Aura Beauty & Wellness', type: 'spa' as BizType,
      description: 'Воскресное велнес-утро: растяжка, дыхательные практики и здоровый завтрак. Начни неделю в ресурсном состоянии.',
      friendsGoing: [],
    },
    {
      id: 106, title: 'Private Members\' Wine Evening', date: 'Fri, Apr 25 · 19:30', dateISO: '2026-04-25', location: 'Chez Georges, Vertex Tower', type: 'restaurant' as BizType,
      description: 'Закрытая дегустация вин для членов клуба. Сомелье проведёт через 6 позиций из коллекции Chez Georges. Количество мест строго ограничено.',
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Upcoming: May 2026 ────────────────────────────────────────────────
    {
      id: 13, title: 'Wine & Cheese Members\' Evening', date: 'Sat, May 17 · 19:30', dateISO: '2026-05-17', location: 'Chez Georges, Vertex Tower', type: 'restaurant' as BizType, slots: { filled: 28, total: 30 }, price: 20000,
      description: 'Вечер дегустации вин и сырных закусок для членов клуба. Живая музыка, камерная атмосфера, небольшой состав участников.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
      ],
    },
    {
      id: 14, title: 'AI & Future of Finance Masterclass', date: 'Wed, May 20 · 15:00', dateISO: '2026-05-20', location: 'Vertex Academy, Main Hall', type: 'education' as BizType, slots: { filled: 51, total: 60 }, price: 8000,
      description: 'Разбираем, как ИИ трансформирует финансовый сектор. Спикеры — практики из ведущих fintech-компаний. Q&A сессия после.',
      friendsGoing: [
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
    {
      id: 10, title: 'FinTech Happy Hour', date: 'Fri, May 22 · 17:30', dateISO: '2026-05-22', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType, slots: { filled: 29, total: 40 },
      description: 'Неформальные встречи после работы для тех, кто в финансах и технологиях. Напитки за свой счёт, знакомства — бесплатно.',
      friendsGoing: [
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
      ],
    },
    {
      id: 15, title: 'Vertex Golf Cup 2026', date: 'Sat, May 24 · 10:00', dateISO: '2026-05-24', location: 'Nomad Golf Studio', type: 'fitness' as BizType, slots: { filled: 20, total: 24 }, price: 50000,
      description: 'Ежегодный турнир по гольфу для членов клуба. Все уровни игры приветствуются. Включает завтрак, кэдди и нетворкинг-ужин.',
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 16, title: 'Expat & Investor Community Dinner', date: 'Wed, May 27 · 19:00', dateISO: '2026-05-27', location: 'Sheraton Astana, Grand Dining', type: 'restaurant' as BizType, slots: { filled: 38, total: 60 }, price: 25000,
      description: 'Ужин для экспатов и инвесторов из разных стран: обмен опытом, знакомство с новыми участниками и бизнес-диалог за общим столом.',
      friendsGoing: [
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
      ],
    },
    {
      id: 11, title: 'Summer Networking Gala', date: 'Thu, May 28 · 19:00', dateISO: '2026-05-28', location: 'Grand Ballroom, Sheraton', type: 'restaurant' as BizType, slots: { filled: 87, total: 120 }, price: 35000,
      description: 'Главное светское мероприятие лета Vertex Club. Дресс-код: smart casual. Живая музыка, фуршет и церемония награждения лучших участников.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
      ],
    },
    // ── Upcoming: June 2026 ───────────────────────────────────────────────
    {
      id: 17, title: 'Mindfulness & Productivity Workshop', date: 'Wed, Jun 3 · 09:00', dateISO: '2026-06-03', location: 'Aura Beauty & Wellness', type: 'spa' as BizType, slots: { filled: 10, total: 15 },
      description: 'Практический воркшоп по mindfulness и управлению вниманием. Медитация, дыхательные техники и инструменты для роста продуктивности.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 18, title: 'Private Equity Deal Sourcing', date: 'Fri, Jun 5 · 14:00', dateISO: '2026-06-05', location: 'Vertex Tower, Board Room', type: 'education' as BizType, slots: { filled: 14, total: 20 }, price: 15000,
      description: 'Закрытая сессия по поиску и оценке PE-сделок в Центральной Азии. Разбор реальных кейсов и методология due diligence.',
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
    {
      id: 19, title: 'Members\' Cocktail Evening', date: 'Fri, Jun 12 · 18:30', dateISO: '2026-06-12', location: 'Vertex Lounge, 24th Floor', type: 'cafe' as BizType, slots: { filled: 33, total: 50 },
      description: 'Коктейльный вечер на 24-м этаже с панорамным видом на Астану. Авторские напитки, лёгкие закуски и непринуждённое общение.',
      friendsGoing: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 20, title: 'Annual General Meeting 2026', date: 'Fri, Jun 19 · 10:00', dateISO: '2026-06-19', location: 'Vertex Academy, Main Hall', type: 'education' as BizType, slots: { filled: 95, total: 150 },
      description: 'Ежегодное общее собрание участников Vertex Club: итоги года, выборы в совет, планы на 2027. Обязательно для активных членов.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
      ],
    },
    {
      id: 21, title: 'Summer Rooftop Party', date: 'Fri, Jun 26 · 19:00', dateISO: '2026-06-26', location: 'Le Bistro Rooftop, Vertex Tower', type: 'restaurant' as BizType, slots: { filled: 42, total: 80 }, price: 45000,
      description: 'Грандиозная вечеринка на крыше Vertex Tower под открытым небом. DJ, фуршет, дресс-код white. Главное летнее событие клуба.',
      friendsGoing: [
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' },
      ],
    },
  ];

  const TODAY = new Date().toISOString().split('T')[0];
  const WEEK_END = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
  const MONTH = TODAY.slice(0, 7);
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

  const EV_META: Record<string, { label: string; color: string; emoji: string }> = {
    restaurant: { label: 'Dining',   color: '#f97316', emoji: '🍽️' },
    cafe:       { label: 'Café',     color: '#6366f1', emoji: '☕' },
    education:  { label: 'Learning', color: '#3b82f6', emoji: '📚' },
    spa:        { label: 'Wellness', color: '#ec4899', emoji: '🧘' },
    fitness:    { label: 'Sport',    color: '#10b981', emoji: '⚽' },
    hotel:      { label: 'VIP',      color: '#eab308', emoji: '🏆' },
    retail:     { label: 'Shopping', color: '#8b5cf6', emoji: '🛍️' },
    healthcare: { label: 'Health',   color: '#06b6d4', emoji: '💊' },
    travel:     { label: 'Travel',   color: '#06b6d4', emoji: '✈️' },
  };

  const buildCalendarUrl = (ev: CommunityEvent) => {
    const title = encodeURIComponent(ev.title);
    const loc = encodeURIComponent(ev.location + ', Astana');
    return `https://calendar.google.com/calendar/r/eventedit?text=${title}&location=${loc}&dates=${ev.dateISO.replace(/-/g,'')}/${ev.dateISO.replace(/-/g,'')}`;
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const handleShareEvent = (ev: typeof events[0]) => setShareEvent(ev);

  const handleToggleReminder = (ev: typeof events[0]) => {
    setReminders(prev => {
      const s = new Set(prev);
      if (s.has(ev.id)) { s.delete(ev.id); showToast('Напоминание убрано'); }
      else { s.add(ev.id); showToast('🔔 Напоминание добавлено'); }
      return s;
    });
  };

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

  const myPoints = CHALLENGES.filter(c => verified.has(c.id)).reduce((sum, c) => sum + c.points, 0);
  const handleChallengeJoin = (id: number) => {
    const ch = CHALLENGES.find(c => c.id === id);
    if (!ch) return;
    setJoined(prev => new Set(prev).add(id));
    if (ch.verify === 'auto') setVerified(prev => new Set(prev).add(id));
  };
  const handleChallengeUnjoin = (id: number) => {
    setJoined(prev => { const s = new Set(prev); s.delete(id); return s; });
    setVerified(prev => { const s = new Set(prev); s.delete(id); return s; });
  };
  const leaderboardEntries: LeaderboardEntry[] = [
    ...LEADERBOARD_MEMBERS,
    { name: 'You', initials: 'Zh', color: '#10b981', points: myPoints, isYou: true },
  ].sort((a, b) => b.points - a.points);
  const filteredChallenges = CHALLENGES.filter(c => filterValue === 'all' || c.type === filterValue);
  const todayDayIdx = (new Date().getDay() + 6) % 7; // Mon=0 … Sun=6

  const tabs: { key: Tab; label: string; icon: typeof Calendar }[] = [
    { key: 'offers', label: t('offers'), icon: ShoppingBag },
    { key: 'events', label: 'Events', icon: Calendar },
    { key: 'tasks', label: 'Challenges', icon: Trophy },
    { key: 'steps', label: 'Steps', icon: Activity },
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

        {/* CHALLENGES filter */}
        {tab === 'tasks' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {[
              { id: 'all',        label: 'All' },
              { id: 'sport',      label: '⚽ Sport' },
              { id: 'networking', label: '🤝 Networking' },
              { id: 'charity',    label: '🤲 Charity' },
              { id: 'daily',      label: '☀️ Daily' },
              { id: 'streak',     label: '🔥 Streak' },
              { id: 'goal',       label: '🎯 Goal' },
            ].map(chip => (
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
              const onWaitlist = waitlisted.has(ev.id);
              const slotsFilled = (ev.slots?.filled ?? 0) + (gone && ev.slots ? 1 : 0);
              const slotsTotal = ev.slots?.total ?? 1;
              const isFull = ev.slots ? slotsFilled >= slotsTotal : false;
              const slotPct = ev.slots ? (slotsFilled / slotsTotal) * 100 : 0;
              const spotsLeft = ev.slots ? slotsTotal - slotsFilled : null;
              const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(ev.location + ', Astana')}`;
              const meta = EV_META[ev.type] ?? { label: 'Event', color: '#10b981', emoji: '📅' };
              const barColor = slotPct >= 90 ? '#ef4444' : slotPct >= 70 ? '#f97316' : '#10b981';
              const today0 = new Date(); today0.setHours(0, 0, 0, 0);
              const evDay = new Date(ev.dateISO + 'T00:00:00');
              const diffDays = Math.round((evDay.getTime() - today0.getTime()) / 86400000);
              const countdown = diffDays === 0 ? 'Сегодня 🔥' : diffDays === 1 ? 'Завтра' : diffDays > 1 ? `через ${diffDays} дн.` : null;
              const descExpanded = expandedDescs.has(ev.id);
              return (
                <div key={ev.id} className="bg-card border border-border rounded-2xl overflow-hidden"
                  style={{ borderLeft: `3px solid ${meta.color}` }}>
                  <div className="p-4">

                    {/* Top row: badge + price/free + actions */}
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: meta.color + '18', color: meta.color }}>
                          {meta.emoji} {meta.label}
                        </span>
                        {ev.price
                          ? <span className="text-xs font-bold text-foreground">{ev.price.toLocaleString('ru')} ₸</span>
                          : <span className="text-xs font-semibold text-[#10b981]">Free</span>}
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggleReminder(ev)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
                          style={reminded ? { background: meta.color + '18', color: meta.color } : { background: 'var(--input-background)', color: 'var(--muted-foreground)' }}>
                          {reminded ? <Bell className="w-3.5 h-3.5" /> : <BellOff className="w-3.5 h-3.5" />}
                        </button>
                        <button onClick={() => handleShareEvent(ev)}
                          className="w-7 h-7 rounded-lg bg-input-background flex items-center justify-center text-muted-foreground">
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <p className="font-semibold text-[15px] leading-snug mb-1.5">{ev.title}</p>

                    {/* Date + countdown + location */}
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span className="text-xs text-muted-foreground">{ev.date}</span>
                      {countdown && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1"
                          style={{ background: diffDays === 0 ? '#ef444420' : diffDays === 1 ? '#f9731620' : meta.color + '18', color: diffDays === 0 ? '#ef4444' : diffDays === 1 ? '#f97316' : meta.color }}>
                          {countdown}
                        </span>
                      )}
                    </div>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mb-3"
                      onClick={e => e.stopPropagation()}>
                      <MapPin className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                      <span className="text-xs text-[#10b981] underline underline-offset-2 truncate">{ev.location}</span>
                    </a>

                    {/* Description */}
                    {ev.description && (
                      <div className="mb-3">
                        <p className={`text-xs text-muted-foreground leading-relaxed ${descExpanded ? '' : 'line-clamp-2'}`}>
                          {ev.description}
                        </p>
                        {ev.description.length > 80 && (
                          <button
                            onClick={() => setExpandedDescs(prev => { const s = new Set(prev); descExpanded ? s.delete(ev.id) : s.add(ev.id); return s; })}
                            className="text-[11px] font-medium mt-0.5"
                            style={{ color: meta.color }}>
                            {descExpanded ? 'Свернуть' : 'Читать далее'}
                          </button>
                        )}
                      </div>
                    )}

                    {/* Slot bar */}
                    {ev.slots && (
                      <div className="mb-3">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-medium" style={{ color: barColor }}>
                            {isFull
                              ? `Full · ${ev.waitlistCount ?? 0} on waitlist`
                              : spotsLeft === 1 ? '1 spot left!' : `${spotsLeft} spots left`}
                          </span>
                          <span className="text-[11px] text-muted-foreground">{slotsFilled}/{slotsTotal}</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${slotPct}%`, background: barColor }} />
                        </div>
                      </div>
                    )}

                    {/* Friends going */}
                    {ev.friendsGoing.length > 0 && (
                      <button
                        onClick={() => setInviteEvent({ title: ev.title, going: ev.friendsGoing })}
                        className="flex items-center gap-2 mb-3 w-full text-left active:opacity-70 transition-opacity"
                      >
                        <div className="flex -space-x-2">
                          {ev.friendsGoing.slice(0, 4).map((f) => (
                            <div key={f.initials + f.name}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold border-2"
                              style={{ background: f.color + '28', color: f.color, borderColor: 'var(--card)' }}>
                              {f.initials}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          <span className="text-foreground font-medium">
                            {ev.friendsGoing.slice(0, 2).map(f => f.name.split(' ')[0]).join(', ')}
                          </span>
                          {ev.friendsGoing.length > 2 && ` +${ev.friendsGoing.length - 2}`}
                          {' '}going
                        </p>
                      </button>
                    )}

                    {/* CTA */}
                    {gone ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <div className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-sm font-semibold"
                            style={{ background: meta.color }}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            You're going
                          </div>
                          {ev.friendsGoing.length > 0 && (
                            <button onClick={() => setEventChat(ev.id)}
                              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                              style={{ background: meta.color + '18', color: meta.color }}>
                              <MessageCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => setRsvped(prev => { const s = new Set(prev); s.delete(ev.id); const saved = JSON.parse(localStorage.getItem('sagi_calendar_events') || '[]'); localStorage.setItem('sagi_calendar_events', JSON.stringify(saved.filter((e: any) => e.id !== ev.id))); return s; })}
                            className="px-3 py-2 rounded-xl text-xs text-muted-foreground bg-input-background">
                            Cancel
                          </button>
                        </div>
                        <a href={buildCalendarUrl(ev)} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-medium text-muted-foreground bg-input-background hover:text-foreground transition-colors w-full">
                          <Calendar className="w-3.5 h-3.5" />
                          Add to Calendar
                        </a>
                      </div>
                    ) : isFull ? (
                      <button
                        onClick={() => setWaitlisted(prev => { const s = new Set(prev); onWaitlist ? s.delete(ev.id) : s.add(ev.id); return s; })}
                        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors border ${onWaitlist ? 'bg-amber-500/10 text-amber-500 border-amber-500/30' : 'bg-input-background text-muted-foreground border-border'}`}
                      >
                        {onWaitlist ? '⏳ On Waitlist' : 'Join Waitlist →'}
                      </button>
                    ) : (
                      <button
                        onClick={() => setRsvped(prev => { const s = new Set(prev); s.add(ev.id); const saved = JSON.parse(localStorage.getItem('sagi_calendar_events') || '[]'); if (!saved.find((e: any) => e.id === ev.id)) { localStorage.setItem('sagi_calendar_events', JSON.stringify([...saved, { id: ev.id, title: ev.title, date: ev.date, dateISO: ev.dateISO, location: ev.location, friendsGoing: ev.friendsGoing }])); } return s; })}
                        className="w-full py-2.5 rounded-xl text-sm font-semibold transition-colors"
                        style={{ background: meta.color + '18', color: meta.color }}>
                        I'm Going →
                      </button>
                    )}
                  </div>
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

        {/* CHALLENGES TAB */}
        {tab === 'tasks' && (
          <div>

            {/* ── Leaderboard ── */}
            <div className="mb-5">
              <button
                onClick={() => setShowLeaderboard(v => !v)}
                className="flex items-center gap-2 mb-3 w-full text-left"
              >
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-semibold flex-1">Leaderboard</span>
                <span className="text-xs text-muted-foreground">{leaderboardEntries.length} members</span>
                {showLeaderboard
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
              </button>
              {showLeaderboard && (
                <div className="bg-card border border-border rounded-2xl overflow-hidden">
                  {(showMoreLeaderboard ? leaderboardEntries : leaderboardEntries.slice(0, 5)).map((member, idx) => {
                    const rank = idx + 1;
                    const isMe = !!member.isYou;
                    const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];
                    return (
                      <button
                        key={member.name}
                        onClick={() => { if (!isMe) setAttendeeCard({ name: member.name, initials: member.initials, color: member.color }); }}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0 text-left transition-colors ${!isMe ? 'active:bg-muted/40' : ''}`}
                        style={isMe ? { background: 'rgba(16,185,129,0.07)' } : undefined}
                      >
                        <div className="w-7 flex items-center justify-center flex-shrink-0">
                          {rank <= 3 ? (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                              style={{ background: medalColors[rank - 1] }}>
                              {rank}
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground tabular-nums">{rank}</span>
                          )}
                        </div>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: member.color + '28', color: member.color }}>
                          {member.initials}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${isMe ? 'text-[#10b981]' : ''}`}>{member.name}</p>
                        </div>
                        <div className={`flex items-center gap-1 text-sm font-bold tabular-nums ${isMe ? 'text-[#10b981]' : 'text-foreground'}`}>
                          <Zap className="w-3 h-3" />
                          {member.points}
                        </div>
                      </button>
                    );
                  })}
                  {leaderboardEntries.length > 5 && (
                    <button onClick={() => setShowMoreLeaderboard(v => !v)}
                      className="w-full py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors border-t border-border">
                      {showMoreLeaderboard ? 'Show less' : `Show ${leaderboardEntries.length - 5} more`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* ── Group Weekly Challenges ── */}
            <div className="space-y-3 mb-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Групповые · Эта неделя</p>
              {GROUP_CHALLENGES.filter(gc => filterValue === 'all' || gc.type === filterValue).map(gc => {
                const isCollapsed = collapsedGroups.has(gc.id);
                const myMarked = markedGroupDays[gc.id] ?? new Set<number>();
                const todayDone = myMarked.has(todayDayIdx);
                const isGroupJoined = !gc.description || joinedGroups.has(gc.id);
                const myGroupPoints = myMarked.size * gc.pointsPerDay;

                const toggleCollapse = () => setCollapsedGroups(prev => {
                  const s = new Set(prev);
                  isCollapsed ? s.delete(gc.id) : s.add(gc.id);
                  return s;
                });

                const markToday = () => setMarkedGroupDays(prev => {
                  const days = new Set(prev[gc.id] ?? []);
                  days.add(todayDayIdx);
                  return { ...prev, [gc.id]: days };
                });

                const myRow: WeekStatus[] = DAYS_RU.map((_, i) => myMarked.has(i) ? 'done' : 'empty');
                const allRows = [
                  ...gc.participants,
                  { name: 'Вы', color: '#10b981', week: myRow },
                ];

                return (
                  <div key={gc.id} className="bg-card border border-border rounded-2xl overflow-hidden"
                    style={{ borderLeft: `3px solid ${gc.color}` }}>

                    {/* Header — always visible, tap to collapse */}
                    <button onClick={toggleCollapse} className="flex items-center gap-3 w-full px-4 pt-4 pb-3 text-left active:opacity-70 transition-opacity">
                      <span className="text-xl shrink-0">{gc.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-[15px] leading-tight">{gc.title}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {isGroupJoined
                            ? `${gc.participants.length + 1} участников · ${gc.tasks.join(', ')}`
                            : gc.tasks.join(', ')}
                        </p>
                      </div>
                      {isGroupJoined && (
                        <span className="flex items-center gap-0.5 text-xs font-bold shrink-0 mr-1" style={{ color: gc.color }}>
                          <Zap className="w-3 h-3" />{myGroupPoints} pts
                        </span>
                      )}
                      {isCollapsed
                        ? <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                        : <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </button>

                    {!isCollapsed && (
                      <>
                        {/* PRE-JOIN: description + join button */}
                        {!isGroupJoined ? (
                          <div className="px-4 pb-4">
                            <p className="text-xs text-muted-foreground leading-relaxed mb-4">{gc.description}</p>
                            <button
                              onClick={() => setJoinedGroups(prev => new Set(prev).add(gc.id))}
                              className="w-full py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all text-white"
                              style={{ background: gc.color }}>
                              Присоединиться →
                            </button>
                          </div>
                        ) : (
                          <>
                            {/* Task list */}
                            <div className="px-4 pb-3 space-y-0.5">
                              {gc.tasks.map((t, i) => (
                                <p key={i} className="text-xs text-muted-foreground">· {t}</p>
                              ))}
                            </div>

                            {/* Grid */}
                            <div className="overflow-x-auto px-4 pb-3">
                              <div style={{ minWidth: 240 }}>
                                {/* Day headers */}
                                <div className="flex mb-1.5">
                                  <div className="shrink-0" style={{ width: 42 }} />
                                  {DAYS_RU.map((d, di) => (
                                    <div key={d} className="flex-1 text-center text-[10px] font-bold uppercase rounded"
                                      style={{ color: di === todayDayIdx ? gc.color : 'var(--muted-foreground)', background: di === todayDayIdx ? gc.color + '15' : 'transparent' }}>
                                      {d}
                                    </div>
                                  ))}
                                </div>
                                {/* Rows */}
                                {allRows.map((p, pi) => {
                                  const isMe = pi === allRows.length - 1;
                                  return (
                                    <div key={pi} className="flex items-center rounded-lg transition-colors"
                                      style={{ minHeight: 28, background: isMe ? '#10b98110' : 'transparent' }}>
                                      <div className="shrink-0 text-[12px] font-semibold truncate px-0.5" style={{ width: 42, color: p.color }}>
                                        {p.name}
                                      </div>
                                      {p.week.map((status, di) => (
                                        <div key={di} className="flex-1 flex justify-center items-center rounded"
                                          style={{ height: 28, background: di === todayDayIdx ? gc.color + '10' : 'transparent' }}>
                                          {status === 'done'   && <span className="text-[14px] leading-none">✅</span>}
                                          {status === 'missed' && <span className="text-[14px] leading-none">❌</span>}
                                          {status === 'empty'  && <span className="text-[12px] text-muted-foreground/20 leading-none">·</span>}
                                        </div>
                                      ))}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Mark today button */}
                            <div className="px-4 pb-4">
                              {todayDone ? (
                                <div className="w-full py-2.5 rounded-xl text-sm font-semibold text-center"
                                  style={{ background: '#10b98118', color: '#10b981' }}>
                                  ✓ Отмечено — {DAYS_RU[todayDayIdx].toUpperCase()}
                                </div>
                              ) : (
                                <button onClick={markToday}
                                  className="w-full py-2.5 rounded-xl text-sm font-semibold active:scale-[0.98] transition-all"
                                  style={{ background: gc.color + '18', color: gc.color }}>
                                  ✓ Отметить сегодня — {DAYS_RU[todayDayIdx].toUpperCase()}
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {/* ── Challenge cards ── */}
            <div className="space-y-3">
              {filteredChallenges.map(challenge => {
                const meta = CHALLENGE_TYPE[challenge.type];
                const isJoined = joined.has(challenge.id);
                const displayFilled = (challenge.slots?.filled ?? 0) + (isJoined && challenge.slots ? 1 : 0);
                const isFull = challenge.slots ? displayFilled >= challenge.slots.total : false;
                const slotPct = challenge.slots ? (displayFilled / challenge.slots.total) * 100 : null;
                const isLocked = challenge.startISO
                  ? new Date(challenge.startISO).getTime() - Date.now() < 60 * 60 * 1000
                  : false;
                return (
                  <div key={challenge.id} className={`bg-card border rounded-2xl p-4 transition-all ${isJoined ? 'border-[#10b981]/40' : 'border-border'}`}>
                    {/* Type badge + deadline */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg leading-none">{challenge.icon}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: meta.bg, color: meta.color }}>
                          {meta.label}
                        </span>
                        {challenge.isRecurring && <span className="text-[10px] text-muted-foreground">🔁</span>}
                      </div>
                      {challenge.deadline && (
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap">{challenge.deadline}</span>
                      )}
                    </div>
                    {/* Title */}
                    <h3 className="text-sm font-bold mb-1">{challenge.title}</h3>
                    {/* Description */}
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{challenge.description}</p>
                    {/* Slot progress */}
                    {challenge.slots && (
                      <div className="mb-3">
                        <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                          <span>{displayFilled} / {challenge.slots.total} joined</span>
                          {isFull && <span className="text-red-500 font-medium">Full</span>}
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${slotPct}%`, background: slotPct! >= 90 ? '#ef4444' : slotPct! >= 60 ? '#f97316' : '#10b981' }} />
                        </div>
                      </div>
                    )}
                    {/* Footer */}
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-[#10b981]">
                        <Zap className="w-3 h-3" />+{challenge.points} pts
                      </span>
                      <div className="flex-1" />
                      {isJoined ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#10b981]/10 text-[#10b981] border border-[#10b981]/30">
                            ✓ Joined
                          </div>
                          {!isLocked && (
                            <button
                              onClick={() => handleChallengeUnjoin(challenge.id)}
                              className="px-3 py-1.5 rounded-xl text-xs text-muted-foreground bg-input-background hover:text-red-400 transition-colors">
                              Unjoin
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          onClick={() => { if (!isFull) handleChallengeJoin(challenge.id); }}
                          className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-95 whitespace-nowrap ${
                            isFull ? 'bg-muted text-muted-foreground cursor-not-allowed' : 'bg-[#10b981] text-white'
                          }`}
                        >
                          {isFull ? 'Full' : 'Join →'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

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

        {/* STEPS TAB */}
        {tab === 'steps' && (() => {
          const myVal = MY_STEPS[stepsPeriod];
          const cal = Math.round(myVal * 0.04);
          const km = (myVal * 0.00065).toFixed(1);
          const floors = Math.max(1, Math.round(myVal / 950));
          const periodLabel: Record<StepsPeriod, string> = { today: 'сегодня', yesterday: 'вчера', week: 'за неделю', month: 'за месяц' };
          const periodBtn: Record<StepsPeriod, string> = { today: 'Сегодня', yesterday: 'Вчера', week: 'Неделя', month: 'Месяц' };

          const meEntry = { name: 'Вы', initials: 'Zh', color: '#10b981', steps: MY_STEPS as Partial<Record<StepsPeriod, number | null>>, isYou: true };
          const ranked = [...COMMUNITY_STEPS.map(m => ({ ...m, isYou: false })), meEntry]
            .map(m => ({ ...m, val: m.steps[stepsPeriod] ?? null }))
            .sort((a, b) => {
              if (a.val === null && b.val === null) return 0;
              if (a.val === null) return 1;
              if (b.val === null) return -1;
              return b.val - a.val;
            });

          const medals = ['🥇', '🥈', '🥉'];

          return (
            <div className="space-y-3">
              {/* My step counter */}
              <div className="bg-card border border-border rounded-2xl p-5">
                <p className="text-xs text-muted-foreground text-center mb-3">шагов {periodLabel[stepsPeriod]}</p>
                <div className="flex items-center justify-center gap-3 mb-3">
                  <svg className="w-6 h-6 text-[#10b981] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <span className="text-5xl font-bold tracking-tight tabular-nums">{myVal.toLocaleString('ru')}</span>
                  <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center justify-center gap-3 text-sm text-muted-foreground">
                  <span>{cal} 🔥</span>
                  <span className="text-border">·</span>
                  <span>{km} км</span>
                  <span className="text-border">·</span>
                  <span>{floors} ⬆</span>
                </div>
              </div>

              {/* Period filter */}
              <div className="flex gap-1.5">
                {(Object.keys(periodBtn) as StepsPeriod[]).map(p => (
                  <button key={p} onClick={() => setStepsPeriod(p)}
                    className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-colors ${stepsPeriod === p ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                    {periodBtn[p]}
                  </button>
                ))}
              </div>

              {/* Community leaderboard */}
              <div className="bg-card border border-border rounded-2xl overflow-hidden">
                {ranked.map((entry, idx) => {
                  const hasData = entry.val !== null;
                  const rank = hasData ? idx + 1 : null;
                  return (
                    <div key={entry.name}
                      className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-b-0"
                      style={entry.isYou ? { background: 'rgba(16,185,129,0.06)' } : undefined}>
                      {/* Rank / medal */}
                      <div className="w-7 text-center shrink-0">
                        {rank && rank <= 3
                          ? <span className="text-base leading-none">{medals[rank - 1]}</span>
                          : rank
                            ? <span className="text-xs font-bold text-muted-foreground">{rank}</span>
                            : <span className="text-sm text-muted-foreground">—</span>}
                      </div>
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ background: entry.color + '25', color: entry.color }}>
                        {entry.initials}
                      </div>
                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${entry.isYou ? 'text-[#10b981]' : ''}`}>{entry.name}</p>
                      </div>
                      {/* Steps */}
                      <div className="text-right shrink-0">
                        {hasData
                          ? <span className="text-sm font-bold tabular-nums">{(entry.val as number).toLocaleString('ru')}</span>
                          : <span className="text-xs text-muted-foreground">нет данных</span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })()}

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

      {/* Event chat sheet */}
      {eventChat !== null && (() => {
        const ev = events.find(e => e.id === eventChat);
        if (!ev) return null;
        return (
          <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={() => setEventChat(null)}>
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-card rounded-t-3xl w-full max-w-md max-h-[72vh] flex flex-col" onClick={e => e.stopPropagation()}>
              <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-1 shrink-0" />
              <div className="flex items-center justify-between px-5 py-3 border-b border-border shrink-0">
                <div>
                  <p className="font-bold text-sm">{ev.title}</p>
                  <p className="text-xs text-muted-foreground">{ev.date}</p>
                </div>
                <button onClick={() => setEventChat(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="overflow-y-auto flex-1 px-5 py-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  {ev.friendsGoing.length + 1} participants
                </p>
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: 'rgba(16,185,129,0.2)', color: '#10b981' }}>Zh</div>
                    <p className="text-sm font-medium text-[#10b981] flex-1">You</p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981' }}>Going</span>
                  </div>
                  {ev.friendsGoing.map(f => (
                    <button key={f.name}
                      onClick={() => { setEventChat(null); setAttendeeCard(f); }}
                      className="flex items-center gap-3 w-full text-left active:opacity-70 transition-opacity">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: f.color + '25', color: f.color }}>{f.initials}</div>
                      <p className="text-sm flex-1">{f.name}</p>
                      <span className="text-muted-foreground text-base">›</span>
                    </button>
                  ))}
                </div>
                <a href={`https://wa.me/?text=${encodeURIComponent(ev.title + ' – ' + ev.date)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-sm font-semibold mb-10"
                  style={{ background: '#25D366' }}>
                  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                  Open WhatsApp Group
                </a>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Attendee profile card — Network style */}
      {attendeeCard && (() => {
        const profile = ATTENDEE_PROFILES[attendeeCard.initials];
        const isConnected = eventConnected.has(attendeeCard.initials);
        return (
          <div className="fixed inset-0 z-[70] flex flex-col justify-end items-center" onClick={() => setAttendeeCard(null)}>
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

      {/* Share sheet */}
      {shareEvent && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end items-center" onClick={() => setShareEvent(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative bg-card rounded-t-3xl w-full max-w-md p-5 pb-10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-4" />
            <p className="font-bold text-sm mb-1 line-clamp-1">{shareEvent.title}</p>
            <p className="text-xs text-muted-foreground mb-5">{shareEvent.date}</p>
            <div className="grid grid-cols-3 gap-3 mb-5">
              {/* WhatsApp */}
              <a href={`https://wa.me/?text=${encodeURIComponent(shareEvent.title + ' — ' + shareEvent.date + '\n' + shareEvent.location)}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => { setShareEvent(null); showToast('Открываем WhatsApp…'); }}
                className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#25D36620' }}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                </div>
                <span className="text-[11px] text-muted-foreground">WhatsApp</span>
              </a>
              {/* Telegram */}
              <a href={`https://t.me/share/url?url=${encodeURIComponent('https://sagi.app/events/' + shareEvent.id)}&text=${encodeURIComponent(shareEvent.title + ' — ' + shareEvent.date)}`}
                target="_blank" rel="noopener noreferrer"
                onClick={() => { setShareEvent(null); showToast('Открываем Telegram…'); }}
                className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#229ED920' }}>
                  <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#229ED9"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
                </div>
                <span className="text-[11px] text-muted-foreground">Telegram</span>
              </a>
              {/* Copy link */}
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(`${shareEvent.title} — ${shareEvent.date} · ${shareEvent.location}`);
                  setShareEvent(null);
                  showToast('✓ Скопировано');
                }}
                className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-muted">
                  <Share2 className="w-6 h-6 text-foreground" />
                </div>
                <span className="text-[11px] text-muted-foreground">Копировать</span>
              </button>
            </div>
            <button onClick={() => setShareEvent(null)}
              className="w-full py-3 rounded-2xl bg-muted text-sm font-semibold text-muted-foreground">
              Отмена
            </button>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[90] pointer-events-none">
          <div className="bg-foreground text-background text-sm font-medium px-4 py-2.5 rounded-2xl shadow-lg whitespace-nowrap animate-fade-in">
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
