import { useState } from 'react';

// Types
import type { GroupedSpeaker } from '@/types';

// Utils
import { getInitials } from '@/utils/speaker';

interface SpeakerCardProps {
  speaker: GroupedSpeaker;
  index: number;
}

export const SpeakerCard = ({ speaker, index }: SpeakerCardProps) => {
  const [avatarError, setAvatarError] = useState(false);
  const initials = getInitials(speaker.name);

  return (
    <div
      className="
        group relative rounded-2xl border transition-all duration-200
        bg-white/80 border-black/[0.06] hover:border-black/[0.12] hover:shadow-sm
        dark:bg-white/[0.04] dark:border-white/[0.08] dark:hover:border-white/[0.15]
        backdrop-blur-sm overflow-hidden
        animate-in fade-in slide-in-from-bottom-2
      "
      style={{ animationDelay: `${index * 60}ms`, animationFillMode: 'both' }}
    >
      {/* Subtle top accent line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-violet-400/40 to-transparent dark:via-violet-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="p-4 bg-white/80 dark:bg-white/[.08]">
        {/* Header row */}
        <div className="flex items-center gap-3 mb-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            {speaker.avatar && !avatarError ? (
              <img
                src={speaker.avatar}
                alt={speaker.name}
                className="w-11 h-11 rounded-full object-cover ring-2 ring-black/[0.06] dark:ring-white/10"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 ring-2 ring-black/[0.06] dark:ring-white/10">
                {initials}
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="min-w-0 flex-1">
            <p className="text-md font-semibold text-gray-900 dark:text-white truncate">
              {speaker.name}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <span className="text-xs text-gray-500 dark:text-white/50">
                {speaker.role}
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-white/20 shrink-0" />
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200/60 dark:border-violet-400/20">
                {speaker.company}
              </span>
            </div>
          </div>
        </div>

        {/* Topics */}
        {speaker.topics.length > 0 && (
          <div className="border-t border-black/[0.05] dark:border-white/[0.06] pt-3 space-y-1.5">
            <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-2">
              Topics
            </p>
            {speaker.topics.map((topic, i) => (
              <div key={i} className="flex items-start gap-2 group/topic">
                <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-violet-400/60 dark:bg-violet-400/50 shrink-0" />
                <p className="text-xs text-gray-600 dark:text-white/60 leading-relaxed">
                  {topic}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
