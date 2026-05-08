import { ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { BusinessLogo } from './BusinessLogo';
import { CommunityModal } from './CommunityModal';
import { useState } from 'react';
import sagiLogo from '../assets/sagi-logo.png';

const COMMUNITY_PHOTOS: Record<number, string> = {
  7:  'fc-ordabasy.jpg',
  8:  'kazatomprom.jpg',
  9:  'nurorda.jpg',
  10: 'alibekov.jpg',
  11: 'salauatty-astana.jpg',
  12: 'atameken-business.jpg',
  13: 'adilet-party.jpg',
  15: 'mangistaumunaigaz.jpg',
  16: 'tsho.jpg',
  17: 'olympic-committee.jpg',
  18: 'ypo.jpg',
  19: 'admin-president.jpg',
  20: 'sensata.png',
  21: 'svoy-dom.png',
  23: 'bazis.jpg',
  24: 'integra.jpg',
};

export function CommunityFeed() {
  const { t } = useLanguage();
  const [selectedCommunity, setSelectedCommunity] = useState<{
    name: string;
    type: 'restaurant' | 'cafe' | 'education' | 'spa' | 'retail' | 'office' | 'school' | 'district' | 'tech' | 'hotel' | 'fitness' | 'healthcare' | 'travel';
    description: string;
    instagram?: string;
    facebook?: string;
    telegram?: string;
    website?: string;
  } | null>(null);

  const featuredOffers = [
    {
      id: 11, title: t('offer15OffStay'), business: 'Grand Vega Hotel', type: 'hotel' as const,
      gradient: 'linear-gradient(135deg, #0f2d4a 0%, #1a5276 50%, #0a1f33 100%)',
      tag: 'Hotel', photo: '/grand-vega-hotel.jpeg',
    },
    {
      id: 2, title: t('offer10OffBev'), business: 'Brew Society', type: 'cafe' as const,
      gradient: 'linear-gradient(135deg, #2d1a06 0%, #7c4a1e 50%, #1a0d03 100%)',
      tag: 'Café', photo: '/brew-society.jpeg',
    },
    {
      id: 22, title: t('offer10OffServices'), business: 'Aura Beauty', type: 'spa' as const,
      gradient: 'linear-gradient(135deg, #2d0f2d 0%, #6b2fa0 50%, #1a0a1a 100%)',
      tag: 'Beauty', photo: '/rafe-beauty.jpeg',
    },
    {
      id: 36, title: t('offerCorporateDiscount'), business: 'SkyLink Airways', type: 'travel' as const,
      gradient: 'linear-gradient(135deg, #0a1f2d 0%, #0e5a8a 50%, #071420 100%)',
      tag: 'Travel', photo: '/tours.jpeg',
    },
  ];

  const communities = [
    { id: 'highvill', name: 'Highvill Isim', type: 'office' as const, members: 324, businesses: 4, description: 'Жилой комплекс Highvill Isim — офферы для жителей.' },
    { id: 'europecity', name: 'Europe City', type: 'district' as const, members: 287, businesses: 6, description: 'Европейский жилой квартал — офферы для резидентов.' },
    { id: 4, name: 'English Quarter', type: 'district' as const, members: 480, businesses: 21, description: 'Жилой район в английском стиле — офферы для резидентов.' },
    { id: 5, name: 'French Quarter', type: 'district' as const, members: 390, businesses: 17, description: 'Элегантный квартал с французской архитектурой.' },
    { id: 6, name: 'Italian Quarter', type: 'district' as const, members: 345, businesses: 14, description: 'Уютный квартал с итальянской атмосферой.' },
    { id: 1, name: 'Vertex Club', type: 'office' as const, members: 570, businesses: 42, description: 'Бизнес-клуб в сердце финансового квартала.', website: 'https://vertexclub.kz' },
    { id: 'hani', name: 'hani', type: 'retail' as const, members: 1840, businesses: 64, description: 'Бонусная экосистема hani — кэшбэк и офферы от партнёров.' },
    { id: 2, name: 'NexLab', type: 'tech' as const, members: 320, businesses: 18, description: 'Технологическое сообщество стартапов и инноваций.' },
    { id: 3, name: 'Vega Forum', type: 'district' as const, members: 210, businesses: 27, description: 'Деловое сообщество выставочного района.' },
    { id: 7, name: 'ФК Ордабасы', type: 'office' as const, members: 1240, businesses: 18, description: 'Профессиональный футбольный клуб «Ордабасы».' },
    { id: 8, name: 'Казатомпром', type: 'office' as const, members: 3850, businesses: 47, description: 'АО «НАК «Казатомпром» — национальная атомная компания.' },
    { id: 9, name: 'NurOrda', type: 'district' as const, members: 2170, businesses: 33, description: 'Сообщество района NurOrda.' },
    { id: 10, name: 'Alibekov', type: 'office' as const, members: 560, businesses: 12, description: 'Сообщество Alibekov.' },
    { id: 11, name: 'Салауатты Астана', type: 'healthcare' as const, members: 4320, businesses: 58, description: 'Программа здорового образа жизни «Салауатты Астана».' },
    { id: 12, name: 'Atameken Business', type: 'office' as const, members: 6740, businesses: 112, description: 'НПП «Атамекен» — деловое сообщество предпринимателей.' },
    { id: 13, name: 'Партия Әділет', type: 'office' as const, members: 8930, businesses: 24, description: 'Политическая партия «Әділет».' },
    { id: 15, name: 'Мангистаумунайгаз', type: 'office' as const, members: 2460, businesses: 31, description: 'Нефтегазодобывающая компания «Мангистаумунайгаз».' },
    { id: 16, name: 'ТШО', type: 'office' as const, members: 5120, businesses: 76, description: 'Тенгизшевройл — совместное нефтяное предприятие.' },
    { id: 17, name: 'Олимпийский комитет', type: 'fitness' as const, members: 1870, businesses: 29, description: 'Национальный олимпийский комитет Республики Казахстан.' },
    { id: 18, name: 'YPO', type: 'office' as const, members: 430, businesses: 85, description: 'Young Presidents\' Organization — международная организация руководителей.' },
    { id: 19, name: 'Администрация Президента', type: 'office' as const, members: 3290, businesses: 41, description: 'Администрация Президента Республики Казахстан.' },
    { id: 20, name: 'Sensata', type: 'tech' as const, members: 780, businesses: 16, description: 'Sensata Technologies — технологическая компания.' },
    { id: 21, name: 'Свой Дом', type: 'district' as const, members: 1650, businesses: 22, description: 'Жилой комплекс «Свой Дом».' },
    { id: 23, name: 'Bazis', type: 'office' as const, members: 2080, businesses: 38, description: 'Строительная компания Bazis.' },
    { id: 24, name: 'Integra', type: 'office' as const, members: 940, businesses: 14, description: 'Компания Integra.' },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-40 bg-card border-b border-border">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center gap-3">
          <img src={sagiLogo} alt="Sagi Logo" className="w-10 h-10 rounded-xl" />
          <h1 className="text-xl">Sagi</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-4 space-y-6">

        {/* New Offers */}
        <div>
          <h2 className="mb-3">{t('newOffers')}</h2>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {featuredOffers.map((offer) => (
              <Link
                key={offer.id}
                to="/user/offer/1"
                className="min-w-[260px] flex-shrink-0 rounded-2xl overflow-hidden relative text-white block"
                style={{ background: offer.gradient }}
              >
                {/* Decorative circle */}
                <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-white/5" />
                <div className="absolute -right-4 -bottom-6 w-24 h-24 rounded-full bg-white/5" />

                <div className="relative z-10 p-4">
                  {/* Tag */}
                  <span className="inline-block text-[10px] font-semibold tracking-widest uppercase px-2 py-0.5 rounded-full bg-white/15 mb-3">
                    {offer.tag}
                  </span>
                  {/* Business logo + name row */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={offer.photo} alt={offer.business} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-xs font-medium opacity-80 truncate">{offer.business}</p>
                  </div>
                  {/* Offer title */}
                  <h3 className="text-sm font-bold leading-snug mb-3">{offer.title}</h3>
                  {/* CTA */}
                  <span className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 bg-white/20 rounded-xl">
                    {t('redeemNow')} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* My Communities */}
        <div>
          <h2 className="mb-3">{t('myCommunities')}</h2>
          <div className="space-y-3">
            {communities.map((community) => (
              <div key={community.id} className="bg-card border border-border rounded-2xl p-4 hover:border-[#10b981] transition-colors">
                <div className="flex items-center gap-3">
                  {community.id === 1 ? (
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCommunity(community); }} className="w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0 p-1 shadow-sm border border-border overflow-hidden">
                      {/* Vertex Club — hexagon + V mark */}
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <polygon points="32,4 56,18 56,46 32,60 8,46 8,18" fill="none" stroke="#00695C" strokeWidth="3.5"/>
                        <polyline points="18,22 32,44 46,22" fill="none" stroke="#00695C" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  ) : community.id === 'hani' ? (
                    <Link to="/user/community/hani" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/hani.jpeg" alt="hani" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 'highvill' ? (
                    <Link to="/user/community/highvill" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/highvill-isim.jpeg" alt="Highvill Isim" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 'europecity' ? (
                    <Link to="/user/community/europecity" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/europe_city.jpg" alt="Europe City" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 4 ? (
                    <Link to="/user/community/4" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/english-quarter.jpeg" alt="Английский квартал" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 5 ? (
                    <Link to="/user/community/5" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/french-quarter.jpeg" alt="Французский квартал" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 6 ? (
                    <Link to="/user/community/6" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src="/italian-quarter.jpeg" alt="Итальянский квартал" className="w-full h-full object-cover" />
                    </Link>
                  ) : community.id === 2 ? (
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCommunity(community); }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden" style={{background:'#0F172A'}}>
                      {/* NexLab — hexagon grid + N lettermark */}
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <rect width="64" height="64" fill="#0F172A"/>
                        <polygon points="32,5 56,18.5 56,45.5 32,59 8,45.5 8,18.5" fill="none" stroke="#3B82F6" strokeWidth="2" opacity="0.5"/>
                        <line x1="20" y1="18" x2="20" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
                        <line x1="44" y1="18" x2="44" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
                        <line x1="20" y1="18" x2="44" y2="46" stroke="#3B82F6" strokeWidth="3.5" strokeLinecap="round"/>
                      </svg>
                    </button>
                  ) : community.id === 3 ? (
                    <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCommunity(community); }} className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm overflow-hidden" style={{background:'#0D1B2A'}}>
                      {/* Vega Forum — 4-pointed star */}
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <rect width="64" height="64" fill="#0D1B2A"/>
                        <polygon points="32,7 36.5,27.5 57,32 36.5,36.5 32,57 27.5,36.5 7,32 27.5,27.5" fill="white" opacity="0.92"/>
                        <circle cx="32" cy="32" r="5" fill="#60A5FA"/>
                      </svg>
                    </button>
                  ) : (typeof community.id === 'number' && community.id >= 7) ? (
                    <Link to={`/user/community/${community.id}`} onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border">
                      <img src={`/${COMMUNITY_PHOTOS[community.id]}`} alt={community.name} className="w-full h-full object-cover" />
                    </Link>
                  ) : (
                    <BusinessLogo name={community.name} type={community.type} size="md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCommunity(community); }} />
                  )}
                  <div className="flex-1 cursor-pointer" onClick={() => { if (typeof community.id === 'number' && (community.id === 4 || community.id === 5 || community.id === 6 || community.id >= 7)) return; setSelectedCommunity(community); }}>
                    {(typeof community.id === 'number' && (community.id === 4 || community.id === 5 || community.id === 6 || community.id >= 7)) ? (
                      <Link to={`/user/community/${community.id}`} className="block mb-0.5">
                        <h3>{community.name}</h3>
                      </Link>
                    ) : (
                      <h3 className="mb-0.5">{community.name}</h3>
                    )}
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Link
                        to="/user/network"
                        onClick={e => e.stopPropagation()}
                        className="hover:text-[#10b981] transition-colors"
                      >
                        {community.members} {t('members')}
                      </Link>
                      <span>·</span>
                      <Link
                        to={`/user/community/${community.id}`}
                        onClick={e => e.stopPropagation()}
                        className="hover:text-[#10b981] transition-colors"
                      >
                        {community.businesses} {t('businesses')}
                      </Link>
                    </p>
                  </div>
                  <Link to={`/user/community/${community.id}`}>
                    <ChevronRight className="w-5 h-5 text-muted-foreground hover:text-[#10b981] transition-colors" />
                  </Link>
                </div>
              </div>
            ))}

            {/* Show more → join/search page */}
            <Link
              to="/user/join-community"
              className="flex items-center justify-center gap-2 w-full py-3 bg-input-background rounded-2xl text-sm text-muted-foreground hover:text-foreground hover:border hover:border-[#10b981]/30 transition-colors border border-transparent"
            >
              <Search className="w-4 h-4" />
              {t('showMoreCommunities')}
            </Link>
          </div>
        </div>

      </div>

      {selectedCommunity && (
        <CommunityModal
          community={selectedCommunity}
          onClose={() => setSelectedCommunity(null)}
        />
      )}
    </div>
  );
}
