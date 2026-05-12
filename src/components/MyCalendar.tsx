import { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Calendar, MapPin, ExternalLink, X, Users, Clock, Sparkles, Send, Search } from 'lucide-react';
import { ATTENDEE_PROFILES } from './CategoryOffers';
import { PERSON_SCHEDULE } from './NetworkPage';

interface CalEvent {
  id: number;
  title: string;
  date: string;
  dateISO: string;
  location: string;
  description: string;
  link: string;
  friendsGoing: { name: string; initials: string; color: string }[];
}

const DEMO_MY_EVENTS: CalEvent[] = [
  {
    id: 7, title: 'Startup Pitch Night', date: 'Thu, May 8 · 19:00', dateISO: '2026-05-08',
    location: 'Le Bistro Rooftop', description: 'An evening of live startup pitches from AIFC-based founders. 5 teams, 3 minutes each, open Q&A with investors.',
    link: 'https://vertexclub.kz/events/startup-pitch-night',
    friendsGoing: [{ name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' }, { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' }, { name: 'Arman K.', initials: 'AK', color: '#6aaff0' }],
  },
  {
    id: 12, title: 'VIP Breakfast: CEO Series', date: 'Tue, May 13 · 08:00', dateISO: '2026-05-13',
    location: 'Vertex Lounge, 24th Floor', description: 'Exclusive breakfast with C-level speakers from leading AIFC companies. Limited to 20 guests. Dress code: business.',
    link: 'https://vertexclub.kz/events/ceo-breakfast',
    friendsGoing: [{ name: 'Arman K.', initials: 'AK', color: '#6aaff0' }, { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' }],
  },
  {
    id: 14, title: 'AI & Future of Finance', date: 'Wed, May 20 · 15:00', dateISO: '2026-05-20',
    location: 'Vertex Academy, Main Hall', description: 'Masterclass on practical AI applications in banking, fintech and investment. Featuring live demos and panel discussion.',
    link: 'https://vertexclub.kz/events/ai-finance-masterclass',
    friendsGoing: [{ name: 'Arman K.', initials: 'AK', color: '#6aaff0' }, { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' }],
  },
  {
    id: 11, title: 'Summer Networking Gala', date: 'Thu, May 28 · 19:00', dateISO: '2026-05-28',
    location: 'Grand Ballroom, Sheraton', description: 'Annual members\' gala dinner. Formal evening with live music, awards ceremony, and open bar. Black tie optional.',
    link: 'https://vertexclub.kz/events/summer-gala-2026',
    friendsGoing: [{ name: 'Aizat B.', initials: 'AB', color: '#7c6af0' }, { name: 'Farida B.', initials: 'FB', color: '#f06a80' }, { name: 'Arman K.', initials: 'AK', color: '#6aaff0' }, { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' }],
  },
  {
    id: 19, title: "Members' Cocktail Evening", date: 'Fri, Jun 12 · 18:30', dateISO: '2026-06-12',
    location: 'Vertex Lounge, 24th Floor', description: 'Monthly members-only cocktail evening. Relaxed networking, signature drinks, and panoramic views of Astana.',
    link: 'https://vertexclub.kz/events/cocktail-june',
    friendsGoing: [{ name: 'Kamila D.', initials: 'KD', color: '#f06ac8' }, { name: 'Madina I.', initials: 'MI', color: '#c86af0' }],
  },
  {
    id: 21, title: 'Summer Rooftop Party', date: 'Fri, Jun 26 · 19:00', dateISO: '2026-06-26',
    location: 'Le Bistro Rooftop, Vertex', description: 'End-of-season celebration on the rooftop. DJ, cocktails, and stunning views. Members + 1 guest welcome.',
    link: 'https://vertexclub.kz/events/rooftop-party',
    friendsGoing: [{ name: 'Aizat B.', initials: 'AB', color: '#7c6af0' }, { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' }, { name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' }],
  },
];

const FRIENDS_EVENTS: CalEvent[] = [
  {
    id: 6, title: 'Legal Tech Workshop', date: 'Tue, May 6 · 10:00', dateISO: '2026-05-06',
    location: 'Vertex Academy, Room 5', description: 'Hands-on workshop on legal technology tools for compliance, contract review, and regulatory reporting.',
    link: 'https://vertexclub.kz/events/legal-tech-workshop',
    friendsGoing: [{ name: 'Farida B.', initials: 'FB', color: '#f06a80' }],
  },
  {
    id: 8, title: 'Yoga & Mindfulness Session', date: 'Sat, May 10 · 08:30', dateISO: '2026-05-10',
    location: 'Aura Beauty & Wellness', description: 'Morning yoga and breathwork session for Vertex Club members. All levels welcome. Mats provided.',
    link: 'https://vertexclub.kz/events/yoga-may',
    friendsGoing: [{ name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' }],
  },
  {
    id: 9, title: 'Real Estate Investment Forum', date: 'Fri, May 15 · 13:00', dateISO: '2026-05-15',
    location: 'Vertex Tower, Conference Hall', description: 'Expert panel on Astana real estate market trends, investment opportunities, and AIFC property regulations.',
    link: 'https://vertexclub.kz/events/real-estate-forum',
    friendsGoing: [{ name: 'Zarina S.', initials: 'ZS', color: '#f0c86a' }, { name: 'Madina I.', initials: 'MI', color: '#c86af0' }],
  },
  {
    id: 13, title: 'Wine & Cheese Evening', date: 'Sat, May 17 · 19:30', dateISO: '2026-05-17',
    location: 'Chez Georges, Vertex Tower', description: 'Curated wine and cheese tasting with a sommelier from France. 6 wines, 8 cheeses, and great conversation.',
    link: 'https://vertexclub.kz/events/wine-cheese',
    friendsGoing: [{ name: 'Aizat B.', initials: 'AB', color: '#7c6af0' }, { name: 'Farida B.', initials: 'FB', color: '#f06a80' }, { name: 'Kamila D.', initials: 'KD', color: '#f06ac8' }, { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' }],
  },
  {
    id: 10, title: 'FinTech Happy Hour', date: 'Fri, May 22 · 17:30', dateISO: '2026-05-22',
    location: 'Brew Society, Vertex Tower', description: 'Informal networking over drinks for fintech professionals. No agenda, just good people and good conversation.',
    link: 'https://vertexclub.kz/events/fintech-happy-hour',
    friendsGoing: [{ name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' }, { name: 'Madina I.', initials: 'MI', color: '#c86af0' }],
  },
  {
    id: 15, title: 'Vertex Golf Cup 2026', date: 'Sat, May 24 · 10:00', dateISO: '2026-05-24',
    location: 'Nomad Golf Studio', description: 'Annual members golf tournament at Nomad Golf Studio. 18-hole competition, prizes, and post-game lunch.',
    link: 'https://vertexclub.kz/events/golf-cup-2026',
    friendsGoing: [{ name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' }, { name: 'Arman K.', initials: 'AK', color: '#6aaff0' }, { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' }],
  },
  {
    id: 18, title: 'Private Equity Deal Sourcing', date: 'Fri, Jun 5 · 14:00', dateISO: '2026-06-05',
    location: 'Vertex Tower, Board Room', description: 'Closed-door session for PE professionals. Deal flow sharing, co-investment opportunities, and LP updates.',
    link: 'https://vertexclub.kz/events/pe-deal-sourcing',
    friendsGoing: [{ name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' }, { name: 'Ruslan A.', initials: 'RA', color: '#6af0e0' }, { name: 'Timur Z.', initials: 'TZ', color: '#f0c46a' }],
  },
  {
    id: 20, title: 'Annual General Meeting 2026', date: 'Fri, Jun 19 · 10:00', dateISO: '2026-06-19',
    location: 'Vertex Academy, Main Hall', description: 'Vertex Club AGM: review of 2025–2026, election of board members, and strategic plan presentation for next year.',
    link: 'https://vertexclub.kz/events/agm-2026',
    friendsGoing: [{ name: 'Aizat B.', initials: 'AB', color: '#7c6af0' }, { name: 'Arman K.', initials: 'AK', color: '#6aaff0' }, { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a' }],
  },
];

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1;
}

const ALL_FRIENDS = [
  { name: 'Aizat B.',   initials: 'AB', color: '#7c6af0', role: 'Product Manager' },
  { name: 'Farida B.',  initials: 'FB', color: '#f06a80', role: 'Legal Counsel' },
  { name: 'Kamila D.',  initials: 'KD', color: '#f06ac8', role: 'Marketing Director' },
  { name: 'Daniyar S.', initials: 'DS', color: '#f06a6a', role: 'Investment Analyst' },
  { name: 'Arman K.',   initials: 'AK', color: '#6aaff0', role: 'Software Engineer' },
  { name: 'Ruslan A.',  initials: 'RA', color: '#6af0e0', role: 'UX Designer' },
  { name: 'Zarina S.',  initials: 'ZS', color: '#f0c86a', role: 'Real Estate Advisor' },
  { name: 'Madina I.',  initials: 'MI', color: '#c86af0', role: 'HR Business Partner' },
  { name: 'Timur Z.',   initials: 'TZ', color: '#f0c46a', role: 'AI Product Lead' },
];

export function MyCalendar() {
  const [collapsed, setCollapsed] = useState(true);
  const [tab, setTab] = useState<'mine' | 'friends'>('mine');
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(4);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selected, setSelected] = useState<CalEvent | null>(null);
  const [personCard, setPersonCard] = useState<{ name: string; initials: string; color: string } | null>(null);
  const [connected, setConnected] = useState<Set<string>>(new Set());
  const [scheduleOpen, setScheduleOpen] = useState(true);
  const [showInvite, setShowInvite] = useState(false);
  const [inviteSent, setInviteSent] = useState<Set<string>>(new Set());
  const [inviteSearch, setInviteSearch] = useState('');

  const storageEvents: CalEvent[] = (() => {
    try { return JSON.parse(localStorage.getItem('sagi_calendar_events') || '[]'); } catch { return []; }
  })();

  const demoIds = new Set(DEMO_MY_EVENTS.map(e => e.id));
  const myEvents: CalEvent[] = [
    ...DEMO_MY_EVENTS,
    ...storageEvents
      .filter(e => !demoIds.has(e.id))
      .map(e => ({ ...e, description: '', link: 'https://vertexclub.kz/events' })),
  ].sort((a, b) => a.dateISO.localeCompare(b.dateISO));

  const events = tab === 'mine' ? myEvents : FRIENDS_EVENTS;

  const daysInMonth = getDaysInMonth(year, month);
  const firstDow = getFirstDayOfWeek(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const eventDays = new Set(
    events
      .filter(e => { const d = new Date(e.dateISO); return d.getFullYear() === year && d.getMonth() === month; })
      .map(e => new Date(e.dateISO).getDate())
  );

  const today = { year: 2026, month: 4, day: 4 };
  const isToday = (d: number) => year === today.year && month === today.month && d === today.day;

  const prevMonth = () => { setSelectedDay(null); if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { setSelectedDay(null); if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const visibleEvents = events.filter(e => {
    const d = new Date(e.dateISO);
    return d.getFullYear() === year && d.getMonth() === month && (selectedDay === null || d.getDate() === selectedDay);
  });
  const upcomingOtherMonths = events.filter(e => { const d = new Date(e.dateISO); return !(d.getFullYear() === year && d.getMonth() === month); });
  const totalMyThisMonth = myEvents.filter(e => { const d = new Date(e.dateISO); return d.getFullYear() === year && d.getMonth() === month; }).length;

  return (
    <>
    <div className="bg-card border border-border rounded-3xl overflow-hidden">
      {/* Header — tap to collapse */}
      <button onClick={() => setCollapsed(v => !v)} className="w-full flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-[#10b981]" />
          <h3 className="font-semibold text-sm">My Calendar</h3>
          {collapsed && totalMyThisMonth > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981' }}>
              {totalMyThisMonth} event{totalMyThisMonth > 1 ? 's' : ''}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {collapsed && <span className="text-xs text-muted-foreground">{MONTHS[month]} {year}</span>}
          {collapsed ? <ChevronDown className="w-4 h-4 text-muted-foreground" /> : <ChevronUp className="w-4 h-4 text-muted-foreground" />}
        </div>
      </button>

      {!collapsed && (<>
        {/* Month nav + grid */}
        <div className="px-4 pb-3 border-b border-border">
          <div className="flex items-center justify-center gap-1 mb-3">
            <button onClick={prevMonth} className="w-7 h-7 rounded-lg bg-input-background flex items-center justify-center">
              <ChevronLeft className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <span className="text-xs font-medium w-28 text-center">{MONTHS[month]} {year}</span>
            <button onClick={nextMonth} className="w-7 h-7 rounded-lg bg-input-background flex items-center justify-center">
              <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
          </div>

          <div className="grid grid-cols-7 mb-1">
            {DAYS.map(d => <div key={d} className="text-center text-[10px] text-muted-foreground font-medium py-1">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((day, i) => (
              <div key={i} className="flex flex-col items-center py-0.5">
                {day ? (
                  <button
                    onClick={() => setSelectedDay(selectedDay === day ? null : day)}
                    className="flex flex-col items-center"
                  >
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium ${
                      selectedDay === day ? 'bg-[#10b981] text-white ring-2 ring-[#10b981]/40' :
                      isToday(day) ? 'bg-[#10b981] text-white' :
                      eventDays.has(day) ? 'bg-[#10b981]/10 text-[#10b981] font-semibold' : 'text-foreground'
                    }`}>{day}</div>
                    {eventDays.has(day) && <div className="w-1 h-1 rounded-full bg-[#10b981] mt-0.5" />}
                  </button>
                ) : <div className="w-7 h-7" />}
              </div>
            ))}
          </div>
        </div>

        {selectedDay !== null && (<>
          {/* Tabs */}
          <div className="flex border-b border-border">
            {(['mine', 'friends'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`flex-1 py-2.5 text-xs font-semibold transition-colors ${tab === t ? 'text-[#10b981] border-b-2 border-[#10b981]' : 'text-muted-foreground'}`}>
                {t === 'mine'
                  ? `My Events (${myEvents.filter(e => { const d = new Date(e.dateISO); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay; }).length})`
                  : `Friends (${FRIENDS_EVENTS.filter(e => { const d = new Date(e.dateISO); return d.getFullYear() === year && d.getMonth() === month && d.getDate() === selectedDay; }).length})`}
              </button>
            ))}
          </div>

          {/* Event list */}
          <div className="divide-y divide-border">
            {visibleEvents.length === 0 && (
              <p className="text-center text-xs text-muted-foreground py-5">No events on this day</p>
            )}
            {visibleEvents.map(ev => {
              const dayNum = new Date(ev.dateISO).getDate();
              const dayName = new Date(ev.dateISO).toLocaleDateString('en', { weekday: 'short' });
              return (
                <button key={ev.id} onClick={() => setSelected(ev)} className="w-full flex gap-3 px-4 py-3 text-left hover:bg-input-background transition-colors active:opacity-70">
                  <div className="w-10 shrink-0 flex flex-col items-center justify-center rounded-xl py-1.5" style={{ background: 'rgba(16,185,129,0.08)' }}>
                    <span className="text-[10px] text-[#10b981] font-medium uppercase">{dayName}</span>
                    <span className="text-base font-bold text-[#10b981] leading-tight">{dayNum}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-tight mb-0.5">{ev.title}</p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1.5">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{ev.location}</span>
                    </div>
                    {ev.friendsGoing.length > 0 && (
                      <div className="flex items-center gap-1.5">
                        <div className="flex -space-x-1.5">
                          {ev.friendsGoing.slice(0, 4).map(f => (
                            <div key={f.initials} className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold border border-card" style={{ background: f.color + '30', color: f.color }}>{f.initials}</div>
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {tab === 'mine' ? 'going with you' : 'going'}{ev.friendsGoing.length > 4 && ` +${ev.friendsGoing.length - 4}`}
                        </span>
                      </div>
                    )}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0 self-center" />
                </button>
              );
            })}
          </div>
        </>)}

      </>)}
    </div>

    {/* Event detail bottom sheet */}
    {selected && (
      <div className="fixed inset-0 z-50 flex flex-col justify-end items-center" onClick={() => setSelected(null)}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative w-full max-w-md bg-card rounded-t-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-border" />
          </div>

          {/* Color banner */}
          <div className="h-2 w-full" style={{ background: 'linear-gradient(90deg, #10b981, #059669)' }} />

          <div className="px-5 py-5">
            {/* Close */}
            <button onClick={() => setSelected(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-input-background flex items-center justify-center">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* Title */}
            <h2 className="text-lg font-bold mb-1 pr-10">{selected.title}</h2>

            {/* Date + location */}
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4 text-[#10b981] shrink-0" />
                {selected.date}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-[#10b981] shrink-0" />
                {selected.location}
              </div>
            </div>

            {/* Description */}
            {selected.description && (
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{selected.description}</p>
            )}

            {/* Who's going */}
            {selected.friendsGoing.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-xs font-semibold text-[#10b981]">
                      {tab === 'mine' ? 'Going with you' : 'Friends going'}
                    </span>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); setShowInvite(true); }}
                    className="text-[11px] font-medium text-[#10b981] border border-[#10b981]/30 px-2.5 py-1 rounded-full hover:bg-[#10b981]/10 transition-colors"
                  >
                    + Invite
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selected.friendsGoing.map(f => (
                    <button
                      key={f.initials}
                      onClick={e => { e.stopPropagation(); setPersonCard(f); }}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl active:opacity-70 transition-opacity"
                      style={{ background: f.color + '15', border: `1px solid ${f.color}30` }}
                    >
                      <div className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold" style={{ background: f.color + '30', color: f.color }}>{f.initials}</div>
                      <span className="text-xs font-medium" style={{ color: f.color }}>{f.name.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Link */}
            <a
              href={selected.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-opacity active:opacity-80"
              style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}
              onClick={e => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Open Event Page
            </a>
          </div>
        </div>
      </div>
    )}
    {showInvite && selected && (
      <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center" onClick={() => { setShowInvite(false); setInviteSearch(''); }}>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        <div className="relative bg-card rounded-t-3xl w-full max-w-md pb-8" onClick={e => e.stopPropagation()}>
          <div className="w-10 h-1 bg-border rounded-full mx-auto mt-3 mb-4" />
          <div className="flex items-center justify-between px-5 mb-4">
            <div>
              <h2 className="font-bold text-base">Invite a Friend</h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[220px]">{selected.title}</p>
            </div>
            <button onClick={() => { setShowInvite(false); setInviteSearch(''); }} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Search */}
          <div className="mx-5 mb-4 flex items-center gap-2 bg-input-background rounded-xl px-3 py-2">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              value={inviteSearch}
              onChange={e => setInviteSearch(e.target.value)}
              placeholder="Search friends..."
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* Friends list */}
          <div className="divide-y divide-border max-h-72 overflow-y-auto">
            {ALL_FRIENDS
              .filter(f => f.name.toLowerCase().includes(inviteSearch.toLowerCase()))
              .map(f => {
                const alreadyGoing = selected.friendsGoing.some(g => g.initials === f.initials);
                const sent = inviteSent.has(f.initials);
                return (
                  <div key={f.initials} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
                      style={{ background: f.color + '20', color: f.color }}>
                      {f.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{f.name}</p>
                      <p className="text-xs text-muted-foreground">{f.role}</p>
                    </div>
                    {alreadyGoing ? (
                      <span className="text-[11px] text-[#10b981] font-medium">Going ✓</span>
                    ) : sent ? (
                      <span className="text-[11px] text-muted-foreground font-medium">Sent ✓</span>
                    ) : (
                      <button
                        onClick={() => setInviteSent(prev => { const s = new Set(prev); s.add(f.initials); return s; })}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                        style={{ background: f.color }}
                      >
                        <Send className="w-3 h-3" />
                        Invite
                      </button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    )}

    {personCard && (() => {
      const profile = ATTENDEE_PROFILES[personCard.initials];
      const isConnected = connected.has(personCard.initials);
      return (
        <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center" onClick={() => setPersonCard(null)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div
            className="relative bg-card rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto w-full max-w-md"
            onClick={e => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
            <button onClick={() => setPersonCard(null)} className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
                style={{ background: personCard.color + '20', border: `2px solid ${personCard.color}`, color: personCard.color }}>
                {personCard.initials}
              </div>
              <div>
                <div className="font-bold text-base">{personCard.name}</div>
                {profile && <div className="text-sm text-muted-foreground mt-0.5">{profile.role}</div>}
                {profile?.location && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                    <MapPin className="w-3 h-3 shrink-0" />{profile.location}
                  </div>
                )}
                {profile && <div className="text-xs text-muted-foreground mt-1"><span className="font-medium text-foreground">{profile.mutualCount}</span> mutual connections</div>}
              </div>
            </div>

            {profile && (
              <div className="flex flex-wrap gap-2 mb-5">
                {profile.tags.map(tag => (
                  <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{tag}</span>
                ))}
              </div>
            )}

            {profile && (
              <div className="mb-5">
                <div className="bg-muted/40 rounded-2xl p-3 text-center">
                  <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
                  <div className="text-base font-bold">{profile.connections}</div>
                  <div className="text-[10px] text-muted-foreground">Connections</div>
                </div>
              </div>
            )}

            {profile && (
              <div className="bg-muted/40 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-1.5 mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
                  <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
                </div>
                <ul className="space-y-2">
                  {profile.aiSummary.map((line, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: personCard.color }} />
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {profile && (
              <p className="text-xs text-muted-foreground mb-5">
                Reach via: <span className="text-foreground font-medium">{profile.mutualNames.join(', ')}</span>
              </p>
            )}

            {(() => {
              const schedule = PERSON_SCHEDULE[personCard.initials] ?? [];
              return (
                <div className="mb-5">
                  <button onClick={() => setScheduleOpen(v => !v)} className="flex items-center gap-1.5 mb-3 w-full">
                    <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
                    <span className="text-xs font-semibold text-[#10b981] flex-1 text-left">Upcoming Schedule</span>
                    {scheduleOpen ? <ChevronUp className="w-3.5 h-3.5 text-[#10b981]" /> : <ChevronDown className="w-3.5 h-3.5 text-[#10b981]" />}
                  </button>
                  {scheduleOpen && (schedule.length === 0
                    ? <p className="text-xs text-muted-foreground">No upcoming shared events</p>
                    : <div className="space-y-2">
                        {schedule.map((ev, i) => {
                          const d = new Date(ev.dateISO);
                          const dayNum = d.getDate();
                          const dayName = d.toLocaleDateString('en', { weekday: 'short' });
                          return (
                            <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-2xl px-3 py-2.5">
                              <div className="w-9 shrink-0 flex flex-col items-center rounded-xl py-1" style={{ background: personCard.color + '15' }}>
                                <span className="text-[9px] font-semibold uppercase" style={{ color: personCard.color }}>{dayName}</span>
                                <span className="text-sm font-bold leading-tight" style={{ color: personCard.color }}>{dayNum}</span>
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
                  )}
                </div>
              );
            })()}

            <button
              onClick={() => {
                setConnected(prev => { const s = new Set(prev); isConnected ? s.delete(personCard.initials) : s.add(personCard.initials); return s; });
                if (!isConnected) setPersonCard(null);
              }}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: personCard.color }}
            >
              {isConnected ? '⏳ Pending' : '+ Connect'}
            </button>
          </div>
        </div>
      );
    })()}
    </>
  );
}
