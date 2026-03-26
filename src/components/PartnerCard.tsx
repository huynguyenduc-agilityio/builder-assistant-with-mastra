interface PartnerCategoryData {
  category: string;
  names: string[];
}

interface PartnerResultData {
  type: 'partner';
  data: PartnerCategoryData[];
}

interface PartnerCardProps {
  data: PartnerCategoryData[];
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string; bgColor: string; borderColor: string }> = {
  Organizer: {
    emoji: '🏛️',
    color: 'text-violet-600 dark:text-violet-300',
    bgColor: 'bg-violet-500/10 dark:bg-violet-500/15',
    borderColor: 'border-violet-400/30 dark:border-violet-500/25',
  },
  'Supported by': {
    emoji: '🤝',
    color: 'text-blue-600 dark:text-blue-300',
    bgColor: 'bg-blue-500/10 dark:bg-blue-500/15',
    borderColor: 'border-blue-400/30 dark:border-blue-500/25',
  },
  'Platinum Sponsor': {
    emoji: '💎',
    color: 'text-slate-700 dark:text-slate-200',
    bgColor: 'bg-slate-500/10 dark:bg-slate-400/15',
    borderColor: 'border-slate-400/30 dark:border-slate-400/25',
  },
  'Gold Sponsor': {
    emoji: '🥇',
    color: 'text-amber-600 dark:text-amber-300',
    bgColor: 'bg-amber-500/10 dark:bg-amber-500/15',
    borderColor: 'border-amber-400/30 dark:border-amber-500/25',
  },
  'Silver Sponsor': {
    emoji: '🥈',
    color: 'text-gray-600 dark:text-gray-300',
    bgColor: 'bg-gray-500/10 dark:bg-gray-400/15',
    borderColor: 'border-gray-400/30 dark:border-gray-400/25',
  },
  Exhibitor: {
    emoji: '🎪',
    color: 'text-emerald-600 dark:text-emerald-300',
    bgColor: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    borderColor: 'border-emerald-400/30 dark:border-emerald-500/25',
  },
  Companion: {
    emoji: '🌟',
    color: 'text-rose-600 dark:text-rose-300',
    bgColor: 'bg-rose-500/10 dark:bg-rose-500/15',
    borderColor: 'border-rose-400/30 dark:border-rose-500/25',
  },
  'Media Partner': {
    emoji: '📢',
    color: 'text-cyan-600 dark:text-cyan-300',
    bgColor: 'bg-cyan-500/10 dark:bg-cyan-500/15',
    borderColor: 'border-cyan-400/30 dark:border-cyan-500/25',
  },
};

const DEFAULT_CONFIG = {
  emoji: '🏢',
  color: 'text-gray-600 dark:text-gray-300',
  bgColor: 'bg-gray-500/10 dark:bg-gray-400/15',
  borderColor: 'border-gray-400/30 dark:border-gray-400/25',
};

export const PartnerCard = ({ data }: PartnerCardProps) => {
  if (!data || data.length === 0) return null;

  return (
    <div className="relative overflow-hidden w-full max-w-md rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div className="p-5">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-400/30 dark:border-violet-500/25">
            🤝 Partners & Sponsors
          </span>
        </div>

        {/* Categories */}
        <div className="space-y-4">
          {data.map(({ category, names }) => {
            const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;

            return (
              <div key={category}>
                {/* Category label */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm">{config.emoji}</span>
                  <span
                    className={`text-[11px] font-semibold tracking-wider uppercase ${config.color}`}
                  >
                    {category}
                  </span>
                </div>

                {/* Partner names as chips */}
                <div className="flex flex-wrap gap-1.5">
                  {names.map((name) => (
                    <span
                      key={name}
                      className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const PartnerResultCard = ({ result }: { result: unknown }) => {
  let parsed: PartnerResultData | null = null;
  try {
    parsed =
      typeof result === 'string'
        ? JSON.parse(result)
        : (result as PartnerResultData);
  } catch {
    return null;
  }

  if (!parsed || parsed.type !== 'partner' || !parsed.data) return null;

  return <PartnerCard data={parsed.data} />;
};
