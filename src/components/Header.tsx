import { AnimatePresence, motion } from 'motion/react';
import { resolveIsDark, useTheme } from './theme-context';
import { Moon, Sun } from 'lucide-react';

// Components
import { OnlineDot } from './OnlineDot';
import { LogoMark } from './LogoMark';
import { UserMenu } from './user-menu';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = resolveIsDark(theme);

  return (
    <header className="shrink-0 h-[58px] px-6 flex items-center justify-between z-10 border-b backdrop-blur-[28px] bg-white/55 border-[rgba(100,80,200,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.15)] dark:bg-white/[.04] dark:border-white/[.08]">
      <div className="flex items-center gap-2.5">
        <div className="shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center bg-[linear-gradient(135deg,rgba(124,58,237,.7),rgba(6,182,212,.7))] border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,.25)] [animation:headerGlow_3s_ease-in-out_infinite]">
          <LogoMark />
        </div>
        <div>
          <p className="font-bold text-[17px] leading-tight tracking-tight font-syne text-[#1e1040] dark:text-white">
            DevDay Assistant
          </p>
          <div className="flex items-center gap-1.5 mt-0.5">
            <OnlineDot />
            <span className="text-[11px] text-[rgba(80,60,160,0.5)] dark:text-white/35">
              Online • AI-powered
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          className="flex items-center gap-1.5 px-3 py-[9px] rounded-[10px] text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 backdrop-blur-[10px] font-syne bg-white/60 border border-[rgba(100,80,200,0.22)] text-[#3b2a8a] hover:bg-white/80 dark:bg-white/[.07] dark:border-white/[.18] dark:text-white/[.82] dark:hover:bg-white/[.12]"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'sun' : 'moon'}
              initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center"
            >
              {isDark ? (
                <Sun className="w-[15px] h-[15px]" />
              ) : (
                <Moon className="w-[15px] h-[15px]" />
              )}
            </motion.span>
          </AnimatePresence>
          {/* <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span> */}
        </button>

        <UserMenu />
      </div>
    </header>
  );
};
