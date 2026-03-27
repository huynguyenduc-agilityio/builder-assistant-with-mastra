// Utils
import { groupSpeakers } from '@/utils/speaker';

// Components
import { SpeakerCard } from './SpeakerCard';
import { SpeakerQueryResult } from './SpeakerQueryResult';

// Types
import {
  InfoHubResponseType,
  type SpeakerData,
  type SpeakerQueryResult as SpeakerQueryResultType,
} from '@/types';

interface SpeakerResultCardProps {
  data: SpeakerData[];
}

export const SpeakerResultCard = ({ data }: SpeakerResultCardProps) => {
  const speakers = groupSpeakers(data);

  if (!speakers.length) return null;

  return (
    <div className="w-full max-w-lg py-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <p className="text-[11px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30">
          Speakers found
        </p>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-500 dark:bg-white/[0.06] dark:text-white/40 border border-black/[0.06] dark:border-white/[0.08]">
          {speakers.length} result{speakers.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {speakers.map((speaker, index) => (
          <SpeakerCard
            key={`${speaker.name}__${speaker.company}`}
            speaker={speaker}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

interface SpeakerResultRendererProps {
  result: string | SpeakerQueryResultType | unknown;
}

export const SpeakerResultRenderer = ({
  result,
}: SpeakerResultRendererProps) => {
  let parsed: SpeakerQueryResultType | null = null;

  try {
    parsed =
      typeof result === 'string'
        ? JSON.parse(result)
        : (result as SpeakerQueryResultType);
  } catch {
    return null;
  }

  if (
    !parsed ||
    parsed.type !== InfoHubResponseType.SPEAKER ||
    !Array.isArray(parsed.data)
  ) {
    return null;
  }

  return (
    <SpeakerQueryResult data={parsed.data || []} purpose={parsed._purpose} />
  );
};
