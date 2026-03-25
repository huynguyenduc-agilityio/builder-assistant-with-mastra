interface VenueData {
  venueName: string;
  address: string;
  date: string;
  mapUrl?: string;
  note?: string;
}

interface VenueResultData {
  type: 'venue';
  data: VenueData;
}

interface VenueCardProps {
  data: VenueData;
}

export const VenueCard = ({ data }: VenueCardProps) => {
  const { venueName, address, date, mapUrl, note } = data;

  return (
    <div className="relative overflow-hidden w-full max-w-sm rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div className="p-5">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-400/30 dark:border-violet-500/25">
            📍 Venue
          </span>
        </div>

        {/* Venue name */}
        <p className="text-sm sm:text-base font-semibold text-[#1e1040] dark:text-white/90 leading-snug mb-4">
          {venueName}
        </p>

        {/* Info rows */}
        <div className="space-y-2.5">
          {/* Address */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-violet-50 dark:bg-violet-500/10">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-500 dark:text-violet-400"
              >
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                Address
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                {address}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-2.5">
            <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-500/10">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500 dark:text-amber-400"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                Date
              </p>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60">
                {date}
              </p>
            </div>
          </div>

          {/* Note only show if exists */}
          {note && (
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-emerald-50 dark:bg-emerald-500/10">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-emerald-500 dark:text-emerald-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                  Note
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                  {note}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Map link only show if mapUrl exists */}
        {mapUrl && (
          <>
            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-4" />
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-violet-600 dark:text-violet-300 bg-violet-500/10 dark:bg-violet-500/15 border border-violet-400/25 dark:border-violet-500/20 hover:bg-violet-500/20 dark:hover:bg-violet-500/25 transition-colors duration-150"
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              View on map
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export const VenueResultCard = ({ result }: { result: unknown }) => {
  let parsed: VenueResultData | null = null;
  try {
    parsed =
      typeof result === 'string'
        ? JSON.parse(result)
        : (result as VenueResultData);
  } catch {
    return null;
  }

  if (!parsed || parsed.type !== 'venue' || !parsed.data) return null;

  return <VenueCard data={parsed.data} />;
};
