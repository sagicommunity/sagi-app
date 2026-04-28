import { ChevronRight, Search } from 'lucide-react';
import { Link } from 'react-router';
import { useLanguage } from '../context/LanguageContext';
import { BusinessLogo } from './BusinessLogo';
import { CommunityModal } from './CommunityModal';
import { useState } from 'react';
import sagiLogo from '../assets/sagi-logo.png';

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
      tag: 'Hotel',
    },
    {
      id: 2, title: t('offer10OffBev'), business: 'Brew Society', type: 'cafe' as const,
      gradient: 'linear-gradient(135deg, #2d1a06 0%, #7c4a1e 50%, #1a0d03 100%)',
      tag: 'Café',
    },
    {
      id: 22, title: t('offer10OffServices'), business: 'Aura Beauty', type: 'spa' as const,
      gradient: 'linear-gradient(135deg, #2d0f2d 0%, #6b2fa0 50%, #1a0a1a 100%)',
      tag: 'Beauty',
    },
    {
      id: 36, title: t('offerCorporateDiscount'), business: 'SkyLink Airways', type: 'travel' as const,
      gradient: 'linear-gradient(135deg, #0a1f2d 0%, #0e5a8a 50%, #071420 100%)',
      tag: 'Travel',
    },
  ];

  const communities = [
    { id: 1, name: 'Vertex Club', type: 'office' as const, members: 570, businesses: 42, description: 'Бизнес-клуб в сердце финансового квартала.', website: 'https://vertexclub.kz' },
    { id: 'hani', name: 'hani', type: 'retail' as const, members: 1840, businesses: 64, description: 'Бонусная экосистема hani — кэшбэк и офферы от партнёров.' },
    { id: 'highvill', name: 'Highvill Isim', type: 'office' as const, members: 324, businesses: 4, description: 'Жилой комплекс Highvill Isim — офферы для жителей.' },
    { id: 2, name: 'NexLab', type: 'tech' as const, members: 320, businesses: 18, description: 'Технологическое сообщество стартапов и инноваций.' },
    { id: 3, name: 'Vega Forum', type: 'district' as const, members: 210, businesses: 27, description: 'Деловое сообщество выставочного района.' },
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
                    <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                      <BusinessLogo name={offer.business} type={offer.type} size="sm" className="opacity-80" />
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
                    <Link to="/user/community/highvill" onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border border-border bg-white flex items-center justify-center p-1">
                      <svg viewBox="0 0 64 64" className="w-full h-full">
                        <rect x="10" y="20" width="18" height="36" rx="2" fill="#1D4ED8"/>
                        <rect x="36" y="10" width="18" height="46" rx="2" fill="#2563EB"/>
                        <rect x="13" y="24" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="20" y="24" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="13" y="33" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="20" y="33" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="39" y="14" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="47" y="14" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="39" y="23" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="47" y="23" width="5" height="5" rx="1" fill="white" opacity="0.4"/>
                        <rect x="39" y="32" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                        <rect x="47" y="32" width="5" height="5" rx="1" fill="white" opacity="0.8"/>
                      </svg>
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
                  ) : (
                    <BusinessLogo name={community.name} type={community.type} size="md" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedCommunity(community); }} />
                  )}
                  <div className="flex-1 cursor-pointer" onClick={() => setSelectedCommunity(community)}>
                    <h3 className="mb-0.5">{community.name}</h3>
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
