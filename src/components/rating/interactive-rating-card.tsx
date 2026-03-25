import { useState } from 'react';

// Constants
import { MASTRA_BASE_URL, RATING_LABELS } from '@/constants';

// Types
import type { InteractiveRatingCardProps } from '@/types';

export const InteractiveRatingCard = ({
  target,
  name,
  reviewerName,
  userId,
  email,
  onSubmit,
  onCancel,
}: InteractiveRatingCardProps) => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const displayRating = hoveredRating || selectedRating;
  const isSpeaker = target === 'speaker';

  const handleSubmit = async () => {
    if (selectedRating === 0) {
      setError('Please select a rating before submitting.');
      return;
    }
    setError('');
    setIsSubmitting(true);

    const payload = {
      type: target,
      name,
      rating: selectedRating,
      userId,
      userName: reviewerName,
      email,
    };

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${MASTRA_BASE_URL}/rating/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!res.ok) {
        const errBody = await res.text();
        console.error('Rating submit failed:', res.status, errBody);
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      onSubmit(
        JSON.stringify({
          success: true,
          message: `${reviewerName} rated ${target} "${name}" ${selectedRating} star${selectedRating !== 1 ? 's' : ''}.`,
          rating: selectedRating,
          summary: data.summary,
        }),
      );
    } catch (err) {
      console.error('Rating submit error:', err);
      // Even if the API call fails, still submit the rating result
      // so the agent can continue the conversation
      onSubmit(
        JSON.stringify({
          success: true,
          message: `${reviewerName} rated ${target} "${name}" ${selectedRating} star${selectedRating !== 1 ? 's' : ''}.`,
          rating: selectedRating,
        }),
      );
    }
  };

  return (
    <div className="relative w-full max-w-sm overflow-hidden rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
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
          <span className="text-xs text-gray-400 dark:text-white/35 italic">
            by {reviewerName}
          </span>
        </div>

        {/* Name */}
        <p className="text-base font-semibold text-[#1e1040] dark:text-white/90 leading-snug mb-5">
          {name}
        </p>

        {/* Stars */}
        <div className="mb-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-3">
            Your Rating
          </p>

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((star) => {
              const isActive = star <= displayRating;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                  className="relative p-1 transition-all duration-150 focus:outline-none"
                  style={{
                    transform: isActive ? 'scale(1.2)' : 'scale(0.95)',
                  }}
                >
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill={isActive ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth={isActive ? 0 : 1.5}
                    className={`transition-all duration-150 ${
                      isActive
                        ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]'
                        : 'text-gray-300 dark:text-white/20'
                    }`}
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </button>
              );
            })}

            {/* Rating label */}
            {displayRating > 0 && (
              <span className="ml-2 text-xs font-medium text-amber-500 dark:text-amber-400/80 min-w-[60px]">
                {RATING_LABELS[displayRating]}
              </span>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="mb-3 text-xs text-red-500 dark:text-red-400/80 font-medium flex items-center gap-1.5">
            <span className="text-red-400">⚠</span>
            {error}
          </p>
        )}

        {/* Divider */}
        <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] mb-4" />

        {/* Buttons */}
        <div className="flex gap-2.5">
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || selectedRating === 0}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none ${
              isSubmitting || selectedRating === 0
                ? 'bg-black/[0.04] dark:bg-white/[0.05] text-gray-300 dark:text-white/25 border border-black/[0.06] dark:border-white/[0.06] cursor-not-allowed'
                : 'bg-violet-500/10 dark:bg-violet-500/20 text-violet-600 dark:text-violet-300 border border-violet-400/30 dark:border-violet-500/30 hover:bg-violet-500/20 dark:hover:bg-violet-500/30 hover:border-violet-400/50 cursor-pointer'
            }`}
          >
            {isSubmitting ? (
              <>
                <svg
                  className="w-3.5 h-3.5 animate-spin"
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
              </>
            ) : (
              <>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Submit Rating
              </>
            )}
          </button>

          <button
            onClick={() =>
              onCancel(
                JSON.stringify({
                  cancelled: true,
                  message: 'The user chose not to rate at this time.',
                }),
              )
            }
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 dark:text-white/40 border border-black/[0.08] dark:border-white/[0.07] bg-black/[0.03] dark:bg-white/[0.03] hover:bg-black/[0.06] dark:hover:bg-white/[0.07] hover:text-gray-600 dark:hover:text-white/60 transition-all duration-200 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
