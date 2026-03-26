import { useCallback, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useCopilotChat } from '@copilotkit/react-core';
import { TextMessage, Role } from '@copilotkit/runtime-client-gql';

// Icons
import { SendIcon } from './icons';

// Utils
import { combineClasses } from '@/utils';

// Constants
import { KEYBOARD_EVENT, SUGGESTIONS, COPILOT_LABEL } from '@/constants';

// Set class SYNCHRONOUSLY before any render, prevents flash
if (typeof document !== 'undefined') {
  document.body.classList.add('welcome-active');
}

// const LogoMark = () => (
//   <svg viewBox="0 0 36 36" fill="none" className="w-10 h-10">
//     <ellipse
//       cx="18"
//       cy="18"
//       rx="14"
//       ry="8"
//       stroke="white"
//       strokeWidth="1.8"
//       fill="none"
//     />
//     <ellipse cx="18" cy="18" rx="3.5" ry="3.5" fill="white" />
//     <path
//       d="M4 18 Q11 8 18 18 Q25 28 32 18"
//       stroke="rgba(255,255,255,0.55)"
//       strokeWidth="1.4"
//       fill="none"
//     />
//   </svg>
// );

export const WelcomeScreen = ({
  title = COPILOT_LABEL.WELCOME_TITLE,
  subtitle = COPILOT_LABEL.WELCOME_SUBTITLE,
}: {
  title?: string;
  subtitle?: string;
}) => {
  const { appendMessage } = useCopilotChat();

  const [dismissed, setDismissed] = useState(false);
  const [inputValue, setInputValue] = useState('');

  useLayoutEffect(() => {
    document.body.classList.toggle('welcome-active', !dismissed);
    return () => document.body.classList.remove('welcome-active');
  }, [dismissed]);

  const handleSubmit = useCallback(
    (value: string) => {
      const text = value.trim();
      if (!text) return;
      setDismissed(true);
      setInputValue('');
      const message = new TextMessage({ content: text, role: Role.User });
      appendMessage(message);
    },
    [appendMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === KEYBOARD_EVENT.ENTER && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(inputValue);
    }
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="welcome-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.2 } }}
          transition={{ duration: 0.25 }}
          className="absolute inset-0 z-10 flex items-center justify-center px-4 pointer-events-none"
        >
          {/* Card */}
          <motion.div
            key="welcome-card"
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: -16,
              scale: 0.96,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto w-full max-w-[480px] rounded-[24px] p-8 flex flex-col items-center gap-6 backdrop-blur-[32px] border bg-white/60 border-[rgba(100,80,200,0.15)] shadow-[0_24px_64px_rgba(100,80,200,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] dark:bg-white/[.05] dark:border-white/10 dark:shadow-[0_24px_64px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]"
          >
            {/* Logo */}
            {/* <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -12 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{
                delay: 0.08,
                duration: 0.45,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-16 h-16 rounded-full flex items-center justify-center bg-[linear-gradient(135deg,rgba(124,58,237,.75),rgba(6,182,212,.75))] border border-white/20 shadow-[0_4px_20px_rgba(99,60,220,0.35)]"
            >
              <LogoMark />
            </motion.div> */}
            <div className="w-40 h-14 rounded-xl flex items-center justify-center px-4 bg-[#1a1035]/40 dark:bg-transparent">
              <img
                src="https://static.wixstatic.com/media/484b05_5308a7a859e54d94bf683cedf2a25f34~mv2.png/v1/fill/w_276,h_66,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/Asset%2010.png"
                alt="DevDay Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Title + subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.13,
                duration: 0.35,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="text-center"
            >
              <h2 className="text-2xl font-bold leading-tight mb-2 font-syne text-[#1e1040] dark:text-white">
                {title}
              </h2>
              <p className="text-sm leading-relaxed font-dm-sans text-[rgba(80,60,160,0.6)] dark:text-white/45">
                {subtitle}
              </p>
            </motion.div>

            {/* Suggestion chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.18,
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {SUGGESTIONS.map((s, i) => (
                <motion.button
                  key={s}
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: 0.2 + i * 0.05,
                    duration: 0.22,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => handleSubmit(s)}
                  className="rounded-full text-xs px-3.5 py-1.5 cursor-pointer border transition-all duration-200 backdrop-blur-[10px] font-dm-sans bg-white/60 border-[rgba(100,80,200,0.2)] text-[rgba(60,40,140,0.7)] hover:bg-[rgba(124,58,237,0.2)] hover:border-[rgba(139,92,246,0.5)] hover:text-[#3b2a8a] hover:shadow-[0_4px_12px_rgba(99,60,220,0.2)] dark:bg-white/[.06] dark:border-white/[.12] dark:text-white/60 dark:hover:text-white"
                >
                  {s}
                </motion.button>
              ))}
            </motion.div>

            {/* Input row */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.25,
                duration: 0.32,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="w-full"
            >
              <div className="flex items-center gap-2 px-4 py-3 rounded-2xl transition-all duration-200 backdrop-blur-md border focus-within:border-[rgba(139,92,246,0.55)] bg-white/75 border-[rgba(100,80,200,0.2)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6),0_2px_12px_rgba(100,80,200,0.06)] dark:bg-white/[.06] dark:border-white/[.12] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.07)]">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={COPILOT_LABEL.INPUT_PLACEHOLDER}
                  autoFocus
                  className="flex-1 bg-transparent border-none outline-none text-sm font-dm-sans text-[#1e1040] caret-[rgba(124,58,237,0.8)] placeholder:text-[rgba(80,60,160,0.38)] dark:text-white/[.88] dark:caret-[rgba(139,92,246,0.9)] dark:placeholder:text-white/30"
                />
                <button
                  onClick={() => handleSubmit(inputValue)}
                  disabled={!inputValue.trim()}
                  className={combineClasses(
                    'shrink-0 w-8 h-8 rounded-xl grid place-items-center text-white cursor-pointer',
                    'disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200',
                    'hover:scale-[1.08] hover:shadow-[0_4px_16px_rgba(99,60,220,0.4)]',
                    inputValue.trim()
                      ? 'bg-[linear-gradient(135deg,#7c3aed,#4f46e5,#06b6d4)] [background-size:200%_auto]'
                      : 'bg-[rgba(100,80,200,0.55)] dark:bg-white/[.37]',
                  )}
                >
                  <SendIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
