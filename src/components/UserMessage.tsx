import { useRef } from 'react';
import type { UserMessageProps } from '@copilotkit/react-ui';

// Hooks
import { useScrollToBottom } from '@/hooks';

// Components
// import { UserAvatar } from './UserAvatar';
import { useAuth } from './auth-context';

export const UserMessage = ({
  message: originalMessage,
  rawData,
}: UserMessageProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  useScrollToBottom(ref);

  if (!user) return null;

  const message =
    typeof originalMessage === 'string'
      ? (originalMessage as string).trim()
      : (originalMessage as unknown as { content: string })?.content?.trim();

  return (
    <div ref={ref} className="flex items-start gap-2.5 py-2 flex-row-reverse">
      {/* Avatar */}
      {user.photoURL && (
        <img
          src={user.photoURL}
          alt={user.displayName || 'User'}
          className="rounded-full ring-2 ring-indigo-500/30 object-cover w-6 h-6"
          referrerPolicy="no-referrer"
        />
      )}

      {/* Bubble */}
      <div
        className="
        py-[10px] px-[15px] max-w-[75%]
        text-md leading-relaxed break-words font-dm-sans
        text-white/[.87]
        rounded-[18px_4px_18px_18px]
        bg-[linear-gradient(135deg,rgba(124,58,237,.5),rgba(79,70,229,.5))]
        backdrop-blur-lg
        border border-[rgba(139,92,246,.35)]
        shadow-[0_4px_18px_rgba(99,60,220,0.18)]
      "
      >
        <p
          dangerouslySetInnerHTML={{
            __html: rawData?.image
              ? `<div class="flex flex-col gap-2">
                   <span class="leading-tight font-normal">${message}</span>
                   <img src="${rawData?.image}" alt="Preview asset" width="55" />
                 </div>`
              : (message ?? ''),
          }}
        />
      </div>
    </div>
  );
};
