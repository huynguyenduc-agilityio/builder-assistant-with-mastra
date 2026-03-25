import type { RatingCardProps } from '@/types';

export const RatingCard = ({
  target,
  name,
  rating,
  reviewerName,
  status,
}: RatingCardProps) => {
  const isLoading = status !== 'complete';
  const isSpeaker = target === 'speaker';

  return (
    <div className="relative overflow-hidden w-full max-w-sm rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div className="p-5">
        {/* Header row */}
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

          {/* Submitting indicator */}
          {isLoading && (
            <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/40 italic">
              <svg
                className="w-3 h-3 animate-spin text-violet-400"
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
              Submitting…
            </span>
          )}
        </div>

        {/* Name */}
        <p className="text-sm font-semibold text-[#1e1040] dark:text-white/90 leading-snug mb-4">
          {name || 'Loading…'}
        </p>

        {/* Stars + score */}
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= rating;
            return (
              <svg
                key={star}
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={isActive ? 'currentColor' : 'none'}
                stroke="currentColor"
                strokeWidth={isActive ? 0 : 1.5}
                style={{
                  transform: isActive ? 'scale(1.1)' : 'scale(0.9)',
                  transition: 'all 0.2s',
                }}
                className={
                  isActive
                    ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(251,191,36,0.5)]'
                    : 'text-gray-300 dark:text-white/20'
                }
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            );
          })}
          <span className="ml-2 text-sm font-semibold text-amber-500 dark:text-amber-400">
            {rating}/5
          </span>
        </div>

        {/* Reviewer */}
        {reviewerName && (
          <p className="text-xs text-gray-400 dark:text-white/40 mb-4">
            Reviewed by{' '}
            <span className="font-semibold text-violet-500 dark:text-violet-300">
              {reviewerName}
            </span>
          </p>
        )}

        {/* Status footer */}
        <div className="flex items-center gap-2 pt-3 border-t border-black/[0.06] dark:border-white/[0.06]">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isLoading
                ? 'bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                : 'bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.6)]'
            }`}
          />
          <span className="text-xs text-gray-400 dark:text-white/40 font-medium">
            {isLoading ? 'Processing rating…' : 'Rating submitted ✓'}
          </span>
        </div>
      </div>
    </div>
  );
};
