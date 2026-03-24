import { useEffect } from 'react';

// Constants
import { CHATBOT_MESSAGES } from '@/constants';

/**
 * Interrupted Message when user cancels action
 */
type InterruptedMessageProps = {
  message?: string;
  className?: string;
};

export const InterruptedMessage = ({
  message = CHATBOT_MESSAGES.INTERRUPTED,
  className = '',
}: InterruptedMessageProps) => {
  useEffect(() => {
    const interruptedMsgs = document?.querySelectorAll('.interrupted-msg');
    let count = 0;
    interruptedMsgs.forEach((msg, index) => {
      if (msg.innerHTML.trim() === CHATBOT_MESSAGES.FURTHER_ACTION) {
        count++;
        if (count > 1 && !msg.classList.contains('hidden')) {
          interruptedMsgs[index]?.classList.add('hidden');
          msg.parentElement?.classList.add('hidden');
        }
      }
    });
  }, [message]);

  return (
    <>
      {message && (
        <div
          className={`relative py-2.5 px-[15px] rounded-lg w-fit max-w-cb-message-box text-3xs leading-5 border shadow-sm border-primary-700 text-primary-700 dark:text-background dark:bg-secondary-900 dark:border-secondary-900 ${className}`}
        >
          {message}
        </div>
      )}
    </>
  );
};
