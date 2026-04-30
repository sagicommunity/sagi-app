import React, { useState, useRef } from 'react';
import { ChevronLeft, Search, UtensilsCrossed, GraduationCap, Sparkles, ShoppingBag, Building2, Dumbbell, HeartPulse, Plane, Calendar, CheckSquare, Briefcase, Newspaper, Camera, X, MapPin } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { BusinessLogo } from './BusinessLogo';

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
    {
      id: 1, title: 'Vertex Morning Coffee', date: 'Thu, Apr 17 · 09:00', location: 'Brew Society, Vertex Tower', type: 'cafe' as BizType,
      friendsGoing: [
        { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' },
        { name: 'Arman K.', initials: 'AK', color: '#6aaff0' },
        { name: 'Aizat B.', initials: 'AB', color: '#7c6af0' },
      ],
    },
    {
      id: 2, title: 'FinTech Seminar 2026', date: 'Fri, Apr 18 · 14:00', location: 'Vertex Academy, Room 3', type: 'education' as BizType,
      friendsGoing: [
        { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' },
        { name: 'Farida B.', initials: 'FB', color: '#f06a80' },
      ],
    },
    {
      id: 3, title: 'Networking Business Lunch', date: 'Sat, Apr 19 · 12:30', location: 'Le Bistro', type: 'restaurant' as BizType,
      friendsGoing: [
        { name: 'Madina I.', initials: 'MI', color: '#c86af0' },
        { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' },
        { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' },
        { name: 'Almas D.', initials: 'AD', color: '#f0a06a' },
      ],
    },
    {
      id: 4, title: 'Wellness Morning', date: 'Sun, Apr 20 · 08:00', location: 'Aura Beauty', type: 'spa' as BizType,
      friendsGoing: [],
    },
  ];

  const tasks = [
    { id: 1, title: 'Attend 2 Vertex Club Events', reward: '+50 pts', done: false },
    { id: 2, title: 'Visit 3 Exclusive Partners', reward: '+30 pts', done: false },
    { id: 3, title: 'Complete your profile', reward: '+20 pts', done: true },
    { id: 4, title: 'Use an offer at Skyline Hotel', reward: '+40 pts', done: false },
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
                  onClick={() => { setTab(tb.key); setSearchQuery(''); setSelectedCategory('all'); setFilterValue('all'); }}
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

        {/* EVENTS filter */}
        {tab === 'events' && (
          <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
            {['All','Café','Education','Restaurant','Wellness'].map((label) => {
              const id = label === 'All' ? 'all' : label === 'Café' ? 'cafe' : label === 'Education' ? 'education' : label === 'Restaurant' ? 'restaurant' : 'spa';
              return (
                <button key={id} onClick={() => setFilterValue(id)}
                  className={`px-3 py-1.5 rounded-xl text-sm whitespace-nowrap flex-shrink-0 transition-colors ${filterValue === id ? 'bg-[#10b981] text-white' : 'bg-input-background text-muted-foreground'}`}>
                  {label}
                </button>
              );
            })}
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
            {events.filter(ev => filterValue === 'all' || ev.type === filterValue).map((ev) => {
              const gone = rsvped.has(ev.id);
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
                  </div>

                  {/* Friends going */}
                  {ev.friendsGoing.length > 0 && (
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex -space-x-2">
                        {ev.friendsGoing.slice(0, 4).map((f) => (
                          <div
                            key={f.initials + f.name}
                            title={f.name}
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
                    </div>
                  )}

                  <button
                    onClick={() => setRsvped(prev => { const s = new Set(prev); gone ? s.delete(ev.id) : s.add(ev.id); return s; })}
                    className={`mt-3 w-full py-2 rounded-xl text-sm font-medium transition-colors ${gone ? 'bg-[#10b981] text-white' : 'bg-[#10b981]/10 text-[#10b981]'}`}
                  >
                    {gone ? t('rsvped') : t('rsvp')}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* TASKS TAB */}
        {tab === 'tasks' && (
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
                  <span className="text-xs px-2 py-0.5 bg-[#10b981]/10 text-[#10b981] rounded-full whitespace-nowrap">{task.reward}</span>
                </div>
              );
            })}
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
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
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
                    </div>
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
    </div>
  );
}
