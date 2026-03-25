import {
  useRef,
  useEffect,
  useCallback,
  useState,
  type KeyboardEvent,
  type ChangeEvent,
} from 'react';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';
import type { InputProps } from '@copilotkit/react-ui';

// Icons
import { SendIcon } from './icons';

// Utils
import { combineClasses } from '@/utils';

// Constants
import { CHAT_SUGGESTIONS, COPILOT_LABEL, KEYBOARD_EVENT } from '@/constants';

const MAX_HEIGHT = 150;

export const CustomInput = ({ inProgress }: InputProps) => {
  const { appendMessage } = useCopilotChat();
  const [inputValue, setInputValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const isSend = !!inputValue.trim();

  const handleSubmit = useCallback(
    async (value: string) => {
      const text = value.trim();
      if (!text) return;

      appendMessage(
        new TextMessage({
          content: text,
          role: Role.User,
        }) as unknown as Parameters<typeof appendMessage>[0],
      );
      setInputValue('');
    },
    [appendMessage],
  );

  const handleOnKeydownInput = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === KEYBOARD_EVENT.ENTER && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  const resizeTextarea = useCallback(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = `${Math.min(ta.scrollHeight, MAX_HEIGHT)}px`;
  }, []);

  const handleOnChangeInput = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      requestAnimationFrame(resizeTextarea);
    },
    [resizeTextarea],
  );

  useEffect(() => {
    resizeTextarea();
  }, [inputValue, resizeTextarea]);

  useEffect(() => {
    if (!inProgress && textareaRef.current) textareaRef.current.focus();
  }, [inProgress]);

  // Sync scroll container padding with actual bar height
  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const syncPadding = () => {
      const container = document.querySelector<HTMLElement>(
        '.copilotKitScrollContainer',
      );
      if (container)
        container.style.paddingBottom = `${bar.getBoundingClientRect().height + 16}px`;
    };

    syncPadding();

    const ro = new ResizeObserver(syncPadding);
    ro.observe(bar);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={barRef}
      className="copilot-input-bar fixed bottom-0 left-0 right-0 z-20 py-4 px-4 transition-all duration-300 border-t shadow-[0_-1px_0_rgba(255,255,255,0.04),0_-8px_32px_rgba(0,0,0,0.15)] bg-white/55 border-[rgba(100,80,200,0.2)] backdrop-blur-[28px] dark:bg-white/[.04] dark:border-white/[.08]"
    >
      <div className="w-full max-w-[768px] mx-auto flex flex-col gap-2">
        {/* Suggestion chips */}
        <div className="flex flex-wrap gap-2">
          {CHAT_SUGGESTIONS.map(({ title, message }) => (
            <button
              key={title}
              onClick={() => handleSubmit(message)}
              disabled={inProgress}
              className="text-xs px-3 py-1.5 rounded-[12px] border cursor-pointer transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed font-dm-sans whitespace-nowrap border-[rgba(100,80,200,0.25)] text-[rgba(60,40,140,0.75)] bg-white/60 hover:bg-[rgba(124,58,237,0.12)] hover:border-[rgba(139,92,246,0.5)] hover:text-[#3b2a8a] dark:bg-white/[.06] dark:border-white/[.15] dark:text-white/60 dark:hover:bg-[rgba(124,58,237,0.2)] dark:hover:border-[rgba(139,92,246,0.5)] dark:hover:text-white/90"
            >
              {title}
            </button>
          ))}
        </div>

        {/* Input card */}
        <div className="flex w-full items-center gap-3 px-[18px] py-[11px] rounded-[18px] transition-all duration-200 backdrop-blur-xl border focus-within:border-[rgba(139,92,246,0.55)] bg-white/75 border-[rgba(100,80,200,0.2)] shadow-[0_4px_24px_rgba(100,80,200,0.08),inset_0_1px_0_rgba(255,255,255,0.6)] dark:bg-white/[.06] dark:border-white/[.11] dark:shadow-[0_4px_24px_rgba(0,0,0,0.2),inset_0_1px_0_rgba(255,255,255,0.07)]">
          <textarea
            id="chat-input"
            rows={1}
            ref={textareaRef}
            disabled={inProgress}
            value={inputValue}
            onChange={handleOnChangeInput}
            placeholder={COPILOT_LABEL.INPUT_PLACEHOLDER}
            onKeyDown={handleOnKeydownInput}
            aria-label="Chat message input"
            className={combineClasses(
              'flex-1 resize-none max-h-[150px] overflow-y-auto',
              'text-sm sm:text-md leading-[1.55] font-normal bg-transparent focus:outline-none border-none',
              'disabled:opacity-50',
              'text-[#1e1040] caret-[rgba(124,58,237,0.8)] placeholder:text-[rgba(80,60,160,0.4)]',
              'dark:text-white/[.88] dark:caret-[rgba(139,92,246,0.9)] dark:placeholder:text-white/[.28]',
              'font-dm-sans',
            )}
          />

          <button
            aria-label="Send chat button"
            disabled={!isSend || inProgress}
            onClick={() => handleSubmit(inputValue)}
            className={combineClasses(
              'self-end shrink-0 w-[38px] h-[38px] rounded-[12px] grid place-items-center cursor-pointer',
              'disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200',
              'hover:scale-[1.07] hover:shadow-[0_6px_20px_rgba(99,60,220,0.4)]',
              isSend
                ? 'bg-[linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)] [background-size:200%_auto] text-white'
                : 'bg-[rgba(100,80,200,0.12)] border border-[rgba(100,80,200,0.2)] text-[rgba(100,80,200,0.5)] dark:bg-white/[.37] dark:border-0 dark:text-white/80',
            )}
          >
            <SendIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Disclaimer */}
        <p className="text-center text-[11px] mt-2 transition-colors duration-300 font-dm-sans text-[rgba(80,60,160,0.35)] dark:text-white/[.18]">
          {COPILOT_LABEL.DISCLAIMER}
        </p>
      </div>
    </div>
  );
};
