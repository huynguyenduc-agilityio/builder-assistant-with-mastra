import { useState, useCallback, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { resolveIsDark, useTheme } from './theme-context';
import { Moon, Sun, LogOut } from 'lucide-react';
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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const confirmTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleReset = useCallback(() => {
    if (showConfirm) {
      reset();
      setShowConfirm(false);
      setMenuOpen(false);
    } else {
      setShowConfirm(true);
      confirmTimerRef.current = setTimeout(() => setShowConfirm(false), 3000);
    }
  }, [showConfirm, reset]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        setShowConfirm(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => {
      document.removeEventListener('mousedown', handler);
      if (confirmTimerRef.current) clearTimeout(confirmTimerRef.current);
    };
  }, []);

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
              showConfirm ? 'Click again to confirm' : 'Clear conversation'
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
                key={showConfirm ? 'warn' : 'trash'}
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
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                )}
              </motion.span>
            </AnimatePresence>
            {showConfirm ? 'Confirm clear?' : ''}
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
      <div className="flex sm:hidden items-center" ref={menuRef}>
        <button
          onClick={() => {
            setMenuOpen((v) => !v);
            setShowConfirm(false);
          }}
          className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-[10px] border cursor-pointer transition-all duration-200 bg-white/60 border-[rgba(100,80,200,0.22)] dark:bg-white/[.07] dark:border-white/[.18]"
          aria-label="Menu"
        >
          <motion.span
            animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
            transition={{ duration: 0.2 }}
            className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60"
          />
          <motion.span
            animate={{ opacity: menuOpen ? 0 : 1, scaleX: menuOpen ? 0 : 1 }}
            transition={{ duration: 0.15 }}
            className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60"
          />
          <motion.span
            animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
            transition={{ duration: 0.2 }}
            className="block w-4 h-[1.5px] rounded-full bg-[rgba(100,80,200,0.6)] dark:bg-white/60"
          />
        </button>

        {/* Dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-[62px] right-4 z-50 w-[220px] rounded-2xl border backdrop-blur-xl overflow-hidden bg-white border-[rgba(100,80,200,0.2)] shadow-[0_8px_32px_rgba(100,80,200,0.12)] dark:bg-[#2e2a44] dark:border-white/[.1] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
            >
              {/* User info */}
              {user && (
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[rgba(100,80,200,0.08)] dark:border-white/[.06]">
                  <div className="w-9 h-9 shrink-0">{avatar}</div>
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

              {/* Theme toggle */}
              <button
                onClick={() => {
                  setTheme(isDark ? 'light' : 'dark');
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium font-syne text-[#3b2a8a] dark:text-white/70 hover:bg-violet-50/80 dark:hover:bg-white/[.06] transition-colors duration-150 cursor-pointer border-b border-[rgba(100,80,200,0.08)] dark:border-white/[.06]"
              >
                {isDark ? (
                  <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="w-4 h-4 text-violet-500 shrink-0" />
                )}
                {themeLabel}
              </button>

              {/* Clear conversation with 2-step confirm */}
              <button
                onClick={handleReset}
                className={[
                  'w-full flex items-center gap-3 px-4 py-3 text-sm font-medium font-syne transition-colors duration-150 cursor-pointer border-b border-[rgba(100,80,200,0.08)] dark:border-white/[.06]',
                  showConfirm
                    ? 'text-orange-500 dark:text-orange-300 bg-orange-50/60 dark:bg-orange-400/10'
                    : 'text-[rgba(100,80,200,0.6)] dark:text-white/50 hover:bg-red-50/60 dark:hover:bg-red-400/10 hover:text-red-500 dark:hover:text-red-300',
                ].join(' ')}
              >
                {showConfirm ? (
                  <>
                    <svg
                      width="15"
                      height="15"
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
                    Confirm clear?
                  </>
                ) : (
                  <>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0"
                    >
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6M14 11v6M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                    Clear conversation
                  </>
                )}
              </button>

              {/* Sign out */}
              <button
                onClick={async () => {
                  await logOut();
                  setMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium font-syne text-[rgba(80,60,160,0.6)] dark:text-white/50 hover:bg-red-50/60 dark:hover:bg-red-400/10 hover:text-red-500 dark:hover:text-red-300 transition-colors duration-150 cursor-pointer"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
