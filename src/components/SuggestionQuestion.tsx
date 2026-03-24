import { motion, AnimatePresence } from 'motion/react';

// Utils
import { combineClasses } from '@/utils';

export interface SuggestionQuestionProps {
  suggestions: string[];
  onSelect: (text: string) => void;
  visible: boolean;
}

export const SuggestionQuestion = ({
  suggestions,
  onSelect,
  visible,
}: SuggestionQuestionProps) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 8, transition: { duration: 0.18 } }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-wrap gap-2 mb-3"
      >
        {suggestions.map((text, i) => (
          <motion.button
            key={text}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.22,
              delay: i * 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelect(text)}
            className={combineClasses(
              'rounded-full text-[12.5px] whitespace-nowrap px-3.5 py-1.5 cursor-pointer border transition-all duration-200 backdrop-blur-[10px] font-dm-sans',
              'bg-white/60 border-[rgba(100,80,200,0.25)] text-[rgba(60,40,140,0.75)]',
              'hover:bg-[rgba(124,58,237,0.12)] hover:border-[rgba(124,58,237,0.5)] hover:text-[#3b2a8a] hover:shadow-[0_4px_14px_rgba(99,60,220,0.2)]',
              'dark:bg-white/[.07] dark:border-white/[.15] dark:text-white/[.65]',
              'dark:hover:bg-[rgba(124,58,237,0.25)] dark:hover:border-[rgba(139,92,246,0.55)] dark:hover:text-white/[.95]',
            )}
          >
            {text}
          </motion.button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);
