// Utils
import { combineClasses } from '@/utils';

export const TypingDots = () => (
  <span className="flex items-center gap-1 py-0.5">
    {(
      [
        '[animation-delay:0s]',
        '[animation-delay:0.18s]',
        '[animation-delay:0.36s]',
      ] as const
    ).map((delay, i) => (
      <span
        key={i}
        className={combineClasses(
          'block w-1.5 h-1.5 rounded-full',
          'bg-[rgba(100,60,220,0.5)] dark:bg-[rgba(139,92,246,0.8)]',
          'animate-[tdot_1.2s_ease-in-out_infinite]',
          delay,
        )}
      />
    ))}
  </span>
);
