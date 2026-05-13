import { useState } from 'react';
import { X, Search, Check, Send, Copy } from 'lucide-react';

interface Person {
  name: string;
  initials: string;
  color: string;
}

interface Props {
  eventTitle: string;
  going: Person[];
  onClose: () => void;
  onSelectContact: (contact: Person) => void;
}

const ALL_CONTACTS: (Person & { role: string })[] = [
  { name: 'Aizat B.',    initials: 'AB', color: '#7c6af0', role: 'Product Manager'      },
  { name: 'Farida B.',   initials: 'FB', color: '#f06a80', role: 'Legal Counsel'         },
  { name: 'Kamila D.',   initials: 'KD', color: '#f06ac8', role: 'Marketing Director'    },
  { name: 'Daniyar S.',  initials: 'DS', color: '#f06a6a', role: 'Investment Analyst'    },
  { name: 'Arman K.',    initials: 'AK', color: '#6aaff0', role: 'Business Developer'    },
  { name: 'Ruslan A.',   initials: 'RA', color: '#6af0e0', role: 'Venture Partner'       },
  { name: 'Madina I.',   initials: 'MI', color: '#c86af0', role: 'HR Director'           },
  { name: 'Zarina S.',   initials: 'ZS', color: '#f0c86a', role: 'Financial Advisor'     },
  { name: 'Timur N.',    initials: 'TZ', color: '#6af09e', role: 'Tech Lead'             },
  { name: 'Aliya M.',    initials: 'AM', color: '#f09e6a', role: 'Strategy Consultant'   },
];

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

export function InviteModal({ eventTitle, going, onClose, onSelectContact }: Props) {
  const [search, setSearch] = useState('');
  const [invited, setInvited] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const goingInitials = new Set(going.map(p => p.initials));

  const filtered = ALL_CONTACTS.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleInvite = (initials: string) => {
    setInvited(prev => { const s = new Set(prev); s.add(initials); return s; });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://sagibonus.com/event/invite`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end items-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div
        className="relative bg-card rounded-t-3xl w-full max-w-md flex flex-col"
        style={{ maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 shrink-0">
          <div className="w-10 h-1 rounded-full bg-border" />
        </div>

        {/* Header */}
        <div className="px-5 pt-4 pb-3 shrink-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h2 className="font-bold text-base">Пригласить друга</h2>
              <p className="text-xs text-muted-foreground">{eventTitle}</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground shrink-0">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-input-background mt-3">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder="Поиск контактов..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Contact list */}
        <div className="overflow-y-auto flex-1 px-5 pb-3">
          <div className="divide-y divide-border">
            {filtered.map(contact => {
              const isGoing = goingInitials.has(contact.initials);
              const isInvited = invited.has(contact.initials);
              return (
                <div key={contact.initials} className="flex items-center gap-3 py-3">
                  {/* Avatar + info — tappable */}
                  <button
                    className="flex items-center gap-3 flex-1 min-w-0 text-left active:opacity-70 transition-opacity"
                    onClick={() => onSelectContact(contact)}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ background: contact.color + '25', color: contact.color }}
                    >
                      {contact.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate">{contact.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{contact.role}</p>
                    </div>
                  </button>

                  {/* Action */}
                  {isGoing ? (
                    <span className="text-xs font-semibold text-[#10b981] flex items-center gap-1 shrink-0">
                      Going <Check className="w-3.5 h-3.5" />
                    </span>
                  ) : isInvited ? (
                    <span className="text-xs font-semibold text-muted-foreground shrink-0">Sent</span>
                  ) : (
                    <button
                      onClick={() => handleInvite(contact.initials)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white shrink-0"
                      style={{ background: contact.color }}
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

        {/* Share section — for people not in the app */}
        <div className="px-5 pb-8 pt-3 shrink-0 border-t border-border">
          <p className="text-xs text-muted-foreground mb-3">Нет в приложении? Поделитесь ссылкой</p>
          <div className="flex gap-2">
            {/* Copy link */}
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl border border-border text-sm font-medium transition-colors"
              style={copied ? { background: '#10b981', color: '#fff', borderColor: '#10b981' } : undefined}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Скопировано' : 'Копировать'}
            </button>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/?text=Приходи%20на%20${encodeURIComponent(eventTitle)}!%20https://sagibonus.com/event/invite`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#25D366', color: '#fff' }}
            >
              <WhatsAppIcon />
            </a>

            {/* Telegram */}
            <a
              href={`https://t.me/share/url?url=https://sagibonus.com/event/invite&text=Приходи%20на%20${encodeURIComponent(eventTitle)}!`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: '#229ED9', color: '#fff' }}
            >
              <TelegramIcon />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
