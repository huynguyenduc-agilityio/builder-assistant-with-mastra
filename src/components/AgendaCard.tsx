interface AgendaItem {
  time: string;
  title: string;
  speaker?: string;
  room?: string;
  language?: string;
}

interface AgendaResultData {
  type: 'agenda';
  data: AgendaItem[];
}

// Categorize agenda items for icon + color
const getItemStyle = (title: string) => {
  const t = title.toLowerCase();
  if (t.includes('check-in') || t.includes('welcome')) {
    return {
      icon: '👋',
      accent:
        'bg-violet-100/80 dark:bg-violet-500/20 border-violet-300/60 dark:border-violet-400/30',
      dot: 'bg-violet-400',
    };
  }
  if (t.includes('opening')) {
    return {
      icon: '🎉',
      accent:
        'bg-amber-100/80 dark:bg-amber-500/20 border-amber-300/60 dark:border-amber-400/30',
      dot: 'bg-amber-400',
    };
  }
  if (t.includes('break') || t.includes('movement')) {
    return {
      icon: '☕',
      accent:
        'bg-gray-100/60 dark:bg-white/[0.06] border-gray-300/50 dark:border-white/[0.1]',
      dot: 'bg-gray-300 dark:bg-white/20',
    };
  }
  if (t.includes('panel')) {
    return {
      icon: '🎤',
      accent:
        'bg-blue-100/80 dark:bg-blue-500/20 border-blue-300/60 dark:border-blue-400/30',
      dot: 'bg-blue-400',
    };
  }
  if (t.includes('workshop')) {
    return {
      icon: '🛠️',
      accent:
        'bg-emerald-100/80 dark:bg-emerald-500/20 border-emerald-300/60 dark:border-emerald-400/30',
      dot: 'bg-emerald-400',
    };
  }
  if (t.includes('closing') || t.includes('wrap') || t.includes('lucky')) {
    return {
      icon: '🏁',
      accent:
        'bg-pink-100/80 dark:bg-pink-500/20 border-pink-300/60 dark:border-pink-400/30',
      dot: 'bg-pink-400',
    };
  }
  return {
    icon: '📌',
    accent:
      'bg-gray-100/60 dark:bg-white/[0.06] border-gray-300/50 dark:border-white/[0.1]',
    dot: 'bg-gray-400',
  };
};

interface AgendaCardProps {
  data: AgendaItem[];
}

export const AgendaCard = ({ data }: AgendaCardProps) => {
  return (
    <div className="relative overflow-hidden w-full max-w-sm rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div className="p-5">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-400/30 dark:border-violet-500/25">
            📅 Agenda
          </span>
          <span className="text-xs text-gray-500 dark:text-white/40">
            {data.length} sessions
          </span>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-violet-200 via-gray-200 to-transparent dark:from-violet-500/30 dark:via-white/10 dark:to-transparent" />

          <div className="space-y-1.5">
            {data.map((item, idx) => {
              const { icon, accent, dot } = getItemStyle(item.title);
              const isBreak =
                item.title.toLowerCase().includes('break') ||
                item.title.toLowerCase().includes('movement');

              return (
                <div key={idx} className="flex items-start gap-3 relative">
                  {/* Timeline dot */}
                  <div
                    className={`w-[23px] h-[23px] shrink-0 rounded-full flex items-center justify-center z-10 mt-0.5 ${isBreak ? 'bg-gray-100 dark:bg-white/[0.06]' : 'bg-white dark:bg-[#1a1035] border border-[rgba(100,80,200,0.2)] dark:border-white/[0.1]'}`}
                  >
                    <div className={`w-2 h-2 rounded-full ${dot}`} />
                  </div>

                  {/* Content */}
                  <div
                    className={`flex-1 min-w-0 rounded-xl px-3 py-2.5 border ${accent} ${isBreak ? 'opacity-60' : ''}`}
                  >
                    {/* Time */}
                    <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-500 dark:text-white/40 mb-0.5">
                      {item.time}
                    </p>

                    {/* Title */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] leading-none">{icon}</span>
                      <p
                        className={`text-sm sm:text-[15px] font-semibold leading-snug ${isBreak ? 'text-gray-400 dark:text-white/40' : 'text-[#1e1040] dark:text-white/90'}`}
                      >
                        {item.title}
                      </p>
                    </div>

                    {/* Optional: speaker / room */}
                    {(item.speaker || item.room) && (
                      <div className="flex items-center gap-2 mt-1">
                        {item.speaker && (
                          <span className="text-[11px] text-gray-400 dark:text-white/35">
                            🎤 {item.speaker}
                          </span>
                        )}
                        {item.room && (
                          <span className="text-[11px] text-gray-400 dark:text-white/35">
                            📍 {item.room}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AgendaResultCard = ({ result }: { result: unknown }) => {
  let parsed: AgendaResultData | null = null;
  try {
    parsed =
      typeof result === 'string'
        ? JSON.parse(result)
        : (result as AgendaResultData);
  } catch {
    return null;
  }

  if (
    !parsed ||
    parsed.type !== 'agenda' ||
    !Array.isArray(parsed.data) ||
    parsed.data.length === 0
  )
    return null;

  return <AgendaCard data={parsed.data} />;
};
