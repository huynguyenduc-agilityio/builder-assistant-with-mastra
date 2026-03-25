import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { createPortal } from 'react-dom';
import { resolveIsDark, useTheme } from './theme-context';
import { Moon, Sun, LogOut, RotateCcw } from 'lucide-react';
import { useCopilotChat } from '@copilotkit/react-core';
import { useAuth } from '@/components/auth-context';

// Components
import { OnlineDot } from './OnlineDot';
import { LogoMark } from './LogoMark';
import { UserMenu } from './user-menu';
import { UserAvatar } from './UserAvatar';

export const Header = () => {
  const { theme, setTheme } = useTheme();
  const isDark = resolveIsDark(theme);
  const { reset } = useCopilotChat();
  const { user, logOut } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReset = useCallback(() => {
    if (showConfirm) {
      reset();
      setShowConfirm(false);
      setTimeout(() => setDrawerOpen(false), 250);
    } else {
      setShowConfirm(true);
      confirmTimerRef.current = setTimeout(() => setShowConfirm(false), 3000);
    }
  }, [showConfirm, reset]);

  // Clear confirm timer when drawer closes
  useEffect(() => {
    if (!drawerOpen && confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
      confirmTimerRef.current = null;
    }
  }, [drawerOpen]);

  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [drawerOpen]);

  const themeLabel = isDark ? 'Light mode' : 'Dark mode';

  const avatar = user?.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.displayName || 'User'}
      className="w-full h-full rounded-full object-cover ring-2 ring-indigo-500/30"
      referrerPolicy="no-referrer"
    />
  ) : (
    <UserAvatar />
  );

  return (
    <>
      <header className="shrink-0 h-[58px] px-4 sm:px-6 flex items-center justify-between z-10 border-b backdrop-blur-[28px] bg-white/55 border-[rgba(100,80,200,0.12)] shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_32px_rgba(0,0,0,0.15)] dark:bg-white/[.04] dark:border-white/[.08]">
        {/* Branding */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="shrink-0 w-[34px] h-[34px] rounded-full flex items-center justify-center bg-[linear-gradient(135deg,rgba(124,58,237,.7),rgba(6,182,212,.7))] border border-white/20 shadow-[0_2px_12px_rgba(0,0,0,.25)]">
            <LogoMark />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-sm sm:text-[17px] leading-tight tracking-tight font-syne text-[#1e1040] dark:text-white truncate">
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

        {/* Desktop */}
        <div className="hidden sm:flex items-center gap-2">
          {/* Reset with 2-step confirm */}
          <AnimatePresence mode="wait" initial={false}>
            <motion.button
              key={showConfirm ? 'confirm' : 'idle'}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.15 }}
              onClick={handleReset}
              title={
                showConfirm ? 'Click again to confirm' : 'Reset conversation'
              }
              className={[
                'flex items-center gap-1.5 px-3 py-[9px] rounded-[10px] text-xs font-semibold tracking-wide cursor-pointer transition-colors duration-200 backdrop-blur-[10px] font-syne border',
                showConfirm
                  ? 'bg-orange-50/80 border-orange-300/40 text-orange-500 dark:bg-orange-400/10 dark:border-orange-400/20 dark:text-orange-300'
                  : 'bg-white/60 border-[rgba(100,80,200,0.22)] text-[rgba(100,80,200,0.45)] hover:text-[#3b2a8a] hover:bg-white/80 dark:bg-white/[.07] dark:border-white/[.18] dark:text-white/30 dark:hover:text-white/60 dark:hover:bg-white/[.12]',
              ].join(' ')}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={showConfirm ? 'warn' : 'reset'}
                  initial={{ opacity: 0, rotate: -15, scale: 0.7 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 15, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center"
                >
                  {showConfirm ? (
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                      <line x1="12" y1="9" x2="12" y2="13" />
                      <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                  ) : (
                    <RotateCcw className="w-4 h-4 text-[#3b2a8a] dark:text-white/70 shrink-0" />
                  )}
                </motion.span>
              </AnimatePresence>
              {showConfirm ? 'Confirm reset?' : ''}
            </motion.button>
          </AnimatePresence>

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={themeLabel}
            className="flex items-center gap-1.5 px-3 py-[9px] rounded-[10px] text-xs font-semibold tracking-wide cursor-pointer transition-all duration-200 backdrop-blur-[10px] font-syne bg-white/60 border border-[rgba(100,80,200,0.22)] text-[#3b2a8a] hover:bg-white/80 dark:bg-white/[.07] dark:border-white/[.18] dark:text-white/[.82] dark:hover:bg-white/[.12]"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -20, scale: 0.7 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 20, scale: 0.7 }}
                transition={{ duration: 0.22 }}
                className="flex items-center"
              >
                {isDark ? (
                  <Sun className="w-[15px] h-[15px]" />
                ) : (
                  <Moon className="w-[15px] h-[15px]" />
                )}
              </motion.span>
            </AnimatePresence>
          </button>

          <UserMenu />
        </div>

        {/* Mobile */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex sm:hidden w-9 h-9 flex-col items-center justify-center gap-[5px] rounded-[10px] border cursor-pointer transition-all duration-200 bg-white/60 border-[rgba(100,80,200,0.22)] dark:bg-white/[.07] dark:border-white/[.18]"
          aria-label="Open menu"
        >
          <span className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60" />
          <span className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60" />
          <span className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60" />
        </button>
      </header>

      {/* Drawer rendered via portal to document.body */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  key="drawer-backdrop"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setDrawerOpen(false)}
                  className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-[2px] sm:hidden"
                />

                {/* Drawer panel */}
                <motion.div
                  key="drawer-panel"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                  className="fixed top-0 right-0 bottom-0 z-[201] w-[280px] flex flex-col sm:hidden border-l backdrop-blur-[40px] bg-white/95 border-[rgba(100,80,200,0.12)] shadow-[-12px_0_40px_rgba(100,80,200,0.12)] dark:bg-[#16112e]/95 dark:border-white/[.07] dark:shadow-[-12px_0_40px_rgba(0,0,0,0.6)]"
                >
                  {/* Drawer header — close button only */}
                  <div className="flex items-center justify-end px-4 h-[58px] border-b border-[rgba(100,80,200,0.08)] dark:border-white/[.06] shrink-0">
                    <button
                      onClick={() => setDrawerOpen(false)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg cursor-pointer transition-colors text-[rgba(100,80,200,0.5)] hover:bg-[rgba(100,80,200,0.08)] hover:text-[#3b2a8a] dark:text-white/30 dark:hover:bg-white/[.08] dark:hover:text-white/60"
                      aria-label="Close menu"
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                      </svg>
                    </button>
                  </div>

                  {/* User info */}
                  {user && (
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-[rgba(100,80,200,0.08)] dark:border-white/[.06]">
                      <div className="w-10 h-10 shrink-0">{avatar}</div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-[#1e1040] dark:text-white font-syne">
                          {user.displayName || 'User'}
                        </p>
                        <p className="text-[11px] truncate text-[rgba(80,60,160,0.55)] dark:text-white/40 font-syne">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Menu items */}
                  <div className="flex-1 flex flex-col py-2">
                    {/* Theme toggle */}
                    <button
                      onClick={() => {
                        setTheme(isDark ? 'light' : 'dark');
                        setTimeout(() => setDrawerOpen(false), 650);
                      }}
                      className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium font-syne text-[#3b2a8a] dark:text-white/70 hover:bg-violet-50/80 dark:hover:bg-white/[.05] transition-colors duration-150 cursor-pointer"
                    >
                      {isDark ? (
                        <Sun className="w-[18px] h-[18px] shrink-0" />
                      ) : (
                        <Moon className="w-[18px] h-[18px] shrink-0" />
                      )}
                      {themeLabel}
                    </button>

                    {/* Reset conversation with 2-step confirm */}
                    <button
                      onClick={handleReset}
                      className={[
                        'flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium font-syne transition-colors duration-150 cursor-pointer',
                        showConfirm
                          ? 'text-orange-500 dark:text-orange-300 bg-orange-50/60 dark:bg-orange-400/10'
                          : 'text-[rgba(100,80,200,0.65)] dark:text-white/50 hover:bg-[rgba(100,80,200,0.05)] dark:hover:bg-white/[.05]',
                      ].join(' ')}
                    >
                      {showConfirm ? (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="shrink-0"
                          >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                          </svg>
                          Confirm reset?
                        </>
                      ) : (
                        <>
                          <RotateCcw className="w-[18px] h-[18px] shrink-0" />
                          Reset conversation
                        </>
                      )}
                    </button>

                    {/* Divider */}
                    <div className="mx-5 my-1 h-px bg-[rgba(100,80,200,0.08)] dark:bg-white/[.06]" />

                    {/* Sign out */}
                    <button
                      onClick={async () => {
                        setTimeout(() => setDrawerOpen(false), 250);
                        await logOut();
                      }}
                      className="flex items-center gap-3.5 px-5 py-3.5 text-sm font-medium font-syne text-[rgba(80,60,160,0.6)] dark:text-white/50 hover:bg-red-50/60 dark:hover:bg-red-400/10 hover:text-red-500 dark:hover:text-red-300 transition-colors duration-150 cursor-pointer"
                    >
                      <LogOut className="w-[18px] h-[18px] shrink-0" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
};
