import { useEffect } from 'react';
import { combineClasses } from '@/utils';
import { IMAGES } from '@/constants';

type ProcessingIndicatorProps = {
  className?: string;
};

const DOT_DELAYS = ['0ms', '150ms', '300ms'];
const SKELETON_WIDTHS = ['w-full', 'w-4/5', 'w-3/5'];

export const ProcessingIndicator = ({
  className = '',
}: ProcessingIndicatorProps) => {
  // Hide duplicate indicators, only keep the first one visible
  useEffect(() => {
    const indicators = document.querySelectorAll('.processing-indicator');
    let count = 0;
    indicators.forEach((indicator, index) => {
      count++;
      if (count > 1 && !indicator.classList.contains('hidden')) {
        indicators[index].classList.add('hidden');
      }
    });
  }, [className]);

  return (
    <div
      className={combineClasses(
        'processing-indicator',
        'w-[300px] px-4 py-3.5 backdrop-blur-md',
        'rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl',
        'bg-white/80 dark:bg-white/[.08]',
        'border border-[rgba(100,80,200,0.22)] dark:border-white/10',
        'shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]',
        className,
      )}
    >
      <div className="flex items-center gap-2 mb-2.5">
        <div className="w-10 h-10 shrink-0">
          <img
            src={IMAGES.CHATBOT_PROCESSING}
            alt="AI thinking"
            className="w-full h-full"
          />
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-md font-semibold text-[rgba(80,60,160,0.8)] dark:text-white/60 tracking-wide">
            DevDay Assistant
          </span>
        </div>
      </div>

      {/* Thinking text + bounce dots */}
      <div className="flex items-center gap-1 mb-3">
        <span className="text-sm font-medium text-[rgba(80,60,160,0.6)] dark:text-white/40 font-dm-sans">
          Thinking
        </span>
        <span className="flex gap-0.5 ml-0.5">
          {DOT_DELAYS.map((delay, i) => (
            <span
              key={i}
              className="w-1 h-1 rounded-full animate-bounce bg-[rgba(100,60,220,0.5)] dark:bg-white/40"
              style={{ animationDelay: delay }}
            />
          ))}
        </span>
      </div>

      {/* Skeleton lines */}
      <div className="flex flex-col gap-2">
        {SKELETON_WIDTHS.map((width, i) => (
          <div
            key={i}
            className={combineClasses(
              'h-2.5 rounded-full animate-pulse',
              'bg-[rgba(100,80,200,0.1)] dark:bg-white/[.08]',
              width,
            )}
          />
        ))}
      </div>
    </div>
  );
};
