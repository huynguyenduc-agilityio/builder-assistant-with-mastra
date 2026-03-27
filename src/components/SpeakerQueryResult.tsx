// Utils
import { groupSpeakers } from '@/utils/speaker';

// Components
import { SpeakerResultCard } from './SpeakerResultRenderer';

// Types
import type { SpeakerData } from '@/types';

interface SpeakerQueryResultProps {
  data: SpeakerData[];
  purpose?: string;
}

/**
 * Handles all speaker-related rendering from queryInfoDataTool:
 * - Rating flow with 2+ speakers → SpeakerResultCard + picker prompt
 * - Rating flow with 1 speaker → hidden (RatingCard handles it)
 * - Info flow → SpeakerResultCard normally
 */
export const SpeakerQueryResult = ({
  data,
  purpose,
}: SpeakerQueryResultProps) => {
  const speakers = groupSpeakers(data);
  const isToolLookupFlow = purpose === 'rating' || purpose === 'stats';

  // For 2+ unique speakers during rating/stats flow, show confirmation prompt
  if (isToolLookupFlow && speakers.length >= 2) {
    return (
      <div className="flex flex-col gap-3">
        <SpeakerResultCard data={data} />
        <SpeakerPickerPrompt count={speakers.length} />
      </div>
    );
  }

  // For rating/stats flow with single speaker: don't show SpeakerResultCard
  // because the RatingCard / StatsCard already displays the relevant info
  if (isToolLookupFlow && speakers.length < 2) {
    return <></>;
  }

  // Default: show SpeakerResultCard normally (info queries)
  return <SpeakerResultCard data={data} />;
};

// --- Confirmation prompt bubble ---

const SpeakerPickerPrompt = ({ count }: { count: number }) => (
  <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-violet-400/20 dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_10px_rgba(100,80,200,0.08)] max-w-lg">
    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-500/15 shrink-0 mt-0.5">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="text-violet-500 dark:text-violet-300"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    </span>
    <p className="text-sm text-gray-600 dark:text-white/70 leading-relaxed">
      I found{' '}
      <span className="font-semibold text-violet-600 dark:text-violet-300">
        {count} speakers
      </span>{' '}
      matching your search. Which one would you like to rate? Please type the
      speaker&apos;s name to continue.
    </p>
  </div>
);
