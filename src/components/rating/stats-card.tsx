import type { StatsCardProps } from '@/types';

interface ReviewItem {
  userName: string;
  rating: number;
}

interface Section {
  type: string;
  name: string;
  totalReviewers: number;
  averageRating: number;
  distribution?: Record<string, number>;
  recentReviews?: ReviewItem[];
}

export const StatsCard = ({ status, result }: StatsCardProps) => {
  const isLoading = status !== 'complete';

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-400 dark:text-white/40">
        <svg
          className="w-4 h-4 animate-spin shrink-0 text-violet-400"
          viewBox="0 0 24 24"
          fill="none"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
        Loading rating statistics…
      </div>
    );
  }

  let parsed: {
    success?: boolean;
    speaker?: Section;
    topic?: Section;
    type?: string;
  } & Partial<Section> = {};
  try {
    parsed = JSON.parse(result || '{}');
  } catch {
    return null;
  }

  if (!parsed?.success) return null;

  const sections: Section[] = [];
  if (parsed.speaker) sections.push(parsed.speaker);
  if (parsed.topic) sections.push(parsed.topic);
  if (!parsed.speaker && !parsed.topic && parsed.type)
    sections.push(parsed as Section);

  return (
    <div className="flex flex-col gap-3 w-full">
      {sections.map((section, idx) => {
        const isSpeaker = section.type === 'speaker';
        const avg = section.averageRating;
        const total = section.totalReviewers;

        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]"
          >
            <div className="p-5">
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border ${
                    isSpeaker
                      ? 'bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-400/30 dark:border-violet-500/25'
                      : 'bg-amber-500/10 dark:bg-amber-500/15 text-amber-600 dark:text-amber-300 border-amber-400/30 dark:border-amber-500/25'
                  }`}
                >
                  {isSpeaker ? '🎤 ' : '📋 '}
                  {isSpeaker ? 'Speaker' : 'Topic'}
                </span>

                {/* Star display */}
                {avg > 0 && (
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <svg
                        key={s}
                        width="13"
                        height="13"
                        viewBox="0 0 24 24"
                        fill={s <= Math.round(avg) ? 'currentColor' : 'none'}
                        stroke="currentColor"
                        strokeWidth={s <= Math.round(avg) ? 0 : 1.5}
                        className={
                          s <= Math.round(avg)
                            ? 'text-amber-400'
                            : 'text-gray-300 dark:text-white/20'
                        }
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    ))}
                  </div>
                )}
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-[#1e1040] dark:text-white/90 leading-snug mb-4">
                {section.name}
              </p>

              {/* Stats row */}
              <div className="flex items-end gap-6 mb-4">
                <div>
                  <p className="text-3xl font-bold text-amber-500 dark:text-amber-400 leading-none">
                    {avg > 0 ? avg.toFixed(1) : '—'}
                  </p>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mt-1">
                    Avg Rating
                  </p>
                </div>
                <div className="h-8 w-px bg-black/[0.06] dark:bg-white/[0.08]" />
                <div>
                  <p className="text-3xl font-bold text-violet-500 dark:text-violet-400 leading-none">
                    {total}
                  </p>
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mt-1">
                    Reviewers
                  </p>
                </div>
              </div>

              {/* Distribution bars */}
              {section.distribution && total > 0 && (
                <div className="space-y-1.5 mb-4">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = section.distribution?.[String(star)] ?? 0;
                    const pct = total > 0 ? (count / total) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-2">
                        <span className="text-[11px] text-gray-400 dark:text-white/40 w-2.5 text-right shrink-0">
                          {star}
                        </span>
                        <svg
                          width="11"
                          height="11"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="text-amber-400 shrink-0"
                        >
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                        <div className="flex-1 h-1.5 rounded-full bg-black/[0.06] dark:bg-white/[0.07] overflow-hidden">
                          <div
                            className="h-full rounded-full bg-amber-400 dark:bg-amber-400 transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[11px] text-gray-400 dark:text-white/35 w-4 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Recent reviews */}
              {section.recentReviews && section.recentReviews.length > 0 && (
                <>
                  <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-3" />
                  <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-2.5">
                    Recent Reviews
                  </p>
                  <div className="space-y-1.5">
                    {section.recentReviews.map((review, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-black/[0.03] dark:bg-white/[0.04] border border-black/[0.05] dark:border-white/[0.05]"
                      >
                        <span className="text-xs font-medium text-[#1e1040] dark:text-white/70 truncate max-w-[60%]">
                          {review.userName}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <svg
                              key={s}
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill={
                                s <= review.rating ? 'currentColor' : 'none'
                              }
                              stroke="currentColor"
                              strokeWidth={s <= review.rating ? 0 : 1.5}
                              className={
                                s <= review.rating
                                  ? 'text-amber-400'
                                  : 'text-gray-200 dark:text-white/15'
                              }
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Empty state */}
              {total === 0 && (
                <p className="text-xs text-gray-400 dark:text-white/35 italic">
                  No reviews yet — be the first to rate!
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
