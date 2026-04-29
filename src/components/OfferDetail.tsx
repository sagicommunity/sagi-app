import { useState } from 'react';
import { ChevronLeft, X } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router';
import { BusinessLogo } from './BusinessLogo';

type BusinessType = 'restaurant' | 'cafe' | 'education' | 'spa' | 'retail' | 'office' | 'school' | 'district' | 'tech' | 'hotel' | 'fitness' | 'healthcare' | 'travel';

interface OfferState {
  business: string;
  businessType: BusinessType;
  category: string;
  discount: string;
  photo?: string;
  color: string;
  gradient: string;
}

export function OfferDetail() {
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const s = (location.state ?? {}) as Partial<OfferState>;

  const business   = s.business     ?? 'Local Bistro';
  const bizType    = s.businessType ?? 'restaurant';
  const category   = s.category     ?? 'Ресторан';
  const discount   = s.discount     ?? '15% скидка на всё меню';
  const photo      = s.photo;
  const color      = s.color        ?? '#10b981';
  const gradient   = s.gradient     ?? 'linear-gradient(135deg, #34d399 0%, #059669 100%)';

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative">
        {/* ─── Header ─── */}
        <div className="h-56 relative overflow-hidden" style={photo ? {} : { background: gradient }}>
          {photo && <img src={photo} alt={business} className="w-full h-full object-cover" />}
          {photo && <div className="absolute inset-0 bg-black/25" />}
          <div className="absolute top-0 left-0 right-0 z-10">
            <div className="max-w-md mx-auto px-4 py-4">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 -mt-8 relative z-10">
          {/* Business card */}
          <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
            <div className="flex items-start gap-4">
              <BusinessLogo name={business} type={bizType} size="lg" />
              <div className="flex-1">
                <h1 className="mb-0.5 py-2">{business}</h1>
                <p className="text-sm text-muted-foreground">{category}</p>
              </div>
            </div>
          </div>

          {/* Offer card */}
          <div className="mt-4 rounded-2xl p-6 text-white" style={{ background: gradient }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm opacity-90">Активная акция</span>
              <span className="text-xs px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full">Активен</span>
            </div>
            <h2 className="mb-2">{discount}</h2>
            <p className="text-sm opacity-90 mb-4">Действует при предъявлении карты участника</p>
            <div className="text-xs opacity-75">Действует до: 30 апреля 2026</div>
          </div>

          {/* How to redeem */}
          <div className="mt-4 p-4 bg-card border border-border rounded-2xl">
            <h3 className="mb-3">Как использовать</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span style={{ color }}>1.</span>
                <span>Откройте приложение Sagi и найдите этот оффер</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color }}>2.</span>
                <span>Нажмите «Использовать» и покажите QR-код кассиру</span>
              </li>
              <li className="flex gap-2">
                <span style={{ color }}>3.</span>
                <span>Получите скидку при оплате</span>
              </li>
            </ol>
          </div>

          <button
            onClick={() => setShowQR(true)}
            className="w-full mt-4 py-4 text-white rounded-2xl hover:shadow-lg transition-shadow font-semibold"
            style={{ background: gradient }}
          >
            Использовать
          </button>
        </div>
      </div>

      {showQR && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setShowQR(false)}>
          <div className="bg-card rounded-3xl p-6 w-full max-w-xs text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Показать кассиру</h3>
              <button onClick={() => setShowQR(false)} className="w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">Покажите QR-код сотруднику для получения скидки</p>
            <div className="relative inline-block mb-4 p-[3px]">
              <svg className="absolute inset-0 w-full h-full pointer-events-none rounded-2xl overflow-visible" viewBox="0 0 192 192" style={{ filter: `drop-shadow(0 0 8px ${color}) drop-shadow(0 0 16px ${color})` }}>
                <rect x="3" y="3" width="186" height="186" rx="13" ry="13"
                  fill="none" stroke={color} strokeWidth="5"
                  strokeDasharray="60 600"
                  strokeLinecap="round"
                  pathLength="600">
                  <animate attributeName="stroke-dashoffset" from="600" to="0" dur="2s" repeatCount="indefinite" />
                </rect>
              </svg>
              <div className="bg-white rounded-2xl p-4">
                <svg viewBox="0 0 80 80" className="w-44 h-44">
                  <rect width="80" height="80" fill="white"/>
                  <rect x="4" y="4" width="20" height="20" fill="#0a1a12"/>
                  <rect x="7" y="7" width="14" height="14" fill="white"/>
                  <rect x="10" y="10" width="8" height="8" fill="#0a1a12"/>
                  <rect x="56" y="4" width="20" height="20" fill="#0a1a12"/>
                  <rect x="59" y="7" width="14" height="14" fill="white"/>
                  <rect x="62" y="10" width="8" height="8" fill="#0a1a12"/>
                  <rect x="4" y="56" width="20" height="20" fill="#0a1a12"/>
                  <rect x="7" y="59" width="14" height="14" fill="white"/>
                  <rect x="10" y="62" width="8" height="8" fill="#0a1a12"/>
                  <rect x="28" y="4" width="4" height="4" fill="#0a1a12"/><rect x="36" y="4" width="4" height="4" fill="#0a1a12"/><rect x="44" y="4" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="12" width="4" height="4" fill="#0a1a12"/><rect x="44" y="12" width="4" height="4" fill="#0a1a12"/>
                  <rect x="36" y="20" width="4" height="4" fill="#0a1a12"/>
                  <rect x="4" y="28" width="4" height="4" fill="#0a1a12"/><rect x="12" y="28" width="4" height="4" fill="#0a1a12"/><rect x="20" y="28" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="28" width="4" height="4" fill="#0a1a12"/><rect x="36" y="28" width="4" height="4" fill="#0a1a12"/>
                  <rect x="52" y="28" width="4" height="4" fill="#0a1a12"/><rect x="60" y="28" width="4" height="4" fill="#0a1a12"/><rect x="68" y="28" width="4" height="4" fill="#0a1a12"/>
                  <rect x="4" y="36" width="4" height="4" fill="#0a1a12"/><rect x="20" y="36" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="36" width="4" height="4" fill="#0a1a12"/><rect x="44" y="36" width="4" height="4" fill="#0a1a12"/><rect x="52" y="36" width="4" height="4" fill="#0a1a12"/><rect x="68" y="36" width="4" height="4" fill="#0a1a12"/>
                  <rect x="4" y="44" width="4" height="4" fill="#0a1a12"/><rect x="12" y="44" width="4" height="4" fill="#0a1a12"/>
                  <rect x="36" y="44" width="4" height="4" fill="#0a1a12"/><rect x="52" y="44" width="4" height="4" fill="#0a1a12"/><rect x="60" y="44" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="52" width="4" height="4" fill="#0a1a12"/><rect x="36" y="52" width="4" height="4" fill="#0a1a12"/><rect x="44" y="52" width="4" height="4" fill="#0a1a12"/><rect x="68" y="52" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="60" width="4" height="4" fill="#0a1a12"/><rect x="52" y="60" width="4" height="4" fill="#0a1a12"/><rect x="60" y="60" width="4" height="4" fill="#0a1a12"/>
                  <rect x="28" y="68" width="4" height="4" fill="#0a1a12"/><rect x="36" y="68" width="4" height="4" fill="#0a1a12"/><rect x="44" y="68" width="4" height="4" fill="#0a1a12"/><rect x="52" y="68" width="4" height="4" fill="#0a1a12"/><rect x="68" y="68" width="4" height="4" fill="#0a1a12"/>
                </svg>
              </div>
            </div>
            <p className="text-xs font-mono text-muted-foreground">SAGI · 2026 · 0042</p>
            <p className="text-xs text-muted-foreground mt-1">Действителен в течение 15 минут</p>
          </div>
        </div>
      )}
    </div>
  );
}
