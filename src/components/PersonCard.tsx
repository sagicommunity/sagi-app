import { useState } from 'react';
import { X, MapPin, Users, Sparkles, Calendar, ChevronUp, ChevronDown } from 'lucide-react';
import type { Person } from './NetworkPage';
import { PERSON_SCHEDULE } from './NetworkPage';

interface PersonCardProps {
  person: Person;
  isConnected: boolean;
  onToggleConnect: (id: number) => void;
  onClose: () => void;
  zIndex?: number;
}

export function PersonCard({ person, isConnected, onToggleConnect, onClose, zIndex = 50 }: PersonCardProps) {
  const [scheduleOpen, setScheduleOpen] = useState(true);
  const schedule = PERSON_SCHEDULE[person.initials] ?? [];

  return (
    <div
      className="fixed inset-0 flex flex-col justify-end items-center"
      style={{ zIndex }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-t-3xl p-6 pb-10 max-h-[80vh] overflow-y-auto w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5" />
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-5">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold shrink-0"
            style={{ background: person.color + '20', border: `2px solid ${person.color}`, color: person.color }}
          >
            {person.initials}
          </div>
          <div>
            <div className="font-bold text-base text-foreground">{person.name}</div>
            <div className="text-sm text-muted-foreground mt-0.5">{person.role}</div>
            {person.location && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <MapPin className="w-3 h-3 shrink-0" />
                <span>{person.location}</span>
              </div>
            )}
            <div className="text-xs text-muted-foreground mt-1">
              <span className="font-medium text-foreground">{person.mutualCount}</span> mutual connections
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {person.tags.map(tag => (
            <span key={tag} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">
              {tag}
            </span>
          ))}
        </div>

        {/* Connections stat */}
        <div className="mb-5">
          <div className="bg-muted/40 rounded-2xl p-3 text-center">
            <Users className="w-4 h-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-base font-bold text-foreground">{person.connections}</div>
            <div className="text-[10px] text-muted-foreground">Connections</div>
          </div>
        </div>

        {/* AI Summary */}
        <div className="bg-muted/40 rounded-2xl p-4 mb-5">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-xs font-semibold text-[#10b981]">AI Analysis</span>
          </div>
          <ul className="space-y-2">
            {person.aiSummary.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground leading-relaxed">
                <span className="mt-1 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: person.color }} />
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* Reach via */}
        <p className="text-xs text-muted-foreground mb-5">
          Reach via:{' '}
          <span className="text-foreground font-medium">{person.mutualNames.join(', ')}</span>
        </p>

        {/* Schedule */}
        <div className="mb-5">
          <button onClick={() => setScheduleOpen(v => !v)} className="flex items-center gap-1.5 mb-3 w-full">
            <Calendar className="w-3.5 h-3.5 text-[#10b981]" />
            <span className="text-xs font-semibold text-[#10b981] flex-1 text-left">Upcoming Schedule</span>
            {scheduleOpen
              ? <ChevronUp className="w-3.5 h-3.5 text-[#10b981]" />
              : <ChevronDown className="w-3.5 h-3.5 text-[#10b981]" />}
          </button>
          {scheduleOpen && (
            schedule.length === 0
              ? <p className="text-xs text-muted-foreground">No upcoming shared events</p>
              : (
                <div className="space-y-2">
                  {schedule.map((ev, i) => {
                    const d = new Date(ev.dateISO);
                    const dayNum = d.getDate();
                    const dayName = d.toLocaleDateString('en', { weekday: 'short' });
                    return (
                      <div key={i} className="flex gap-3 items-start bg-muted/30 rounded-2xl px-3 py-2.5">
                        <div className="w-9 shrink-0 flex flex-col items-center rounded-xl py-1" style={{ background: person.color + '15' }}>
                          <span className="text-[9px] font-semibold uppercase" style={{ color: person.color }}>{dayName}</span>
                          <span className="text-sm font-bold leading-tight" style={{ color: person.color }}>{dayNum}</span>
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

        <button
          onClick={() => { onToggleConnect(person.id); if (!isConnected) onClose(); }}
          className="w-full py-3.5 rounded-2xl text-sm font-semibold text-white transition-all active:scale-95"
          style={{ background: person.color }}
        >
          {isConnected ? '⏳ Pending' : '+ Connect'}
        </button>
      </div>
    </div>
  );
}
