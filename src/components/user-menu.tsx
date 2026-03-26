import { useAuth } from '@/components/auth-context';
import { LogOut } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

// Utils
import { combineClasses } from '@/utils';

// Components
import { UserAvatar } from './UserAvatar';

export const UserMenu = () => {
  const { user, logOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  if (!user) return null;

  const avatar = user.photoURL ? (
    <img
      src={user.photoURL}
      alt={user.displayName || 'User'}
      className="rounded-full ring-2 ring-indigo-500/30 object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <UserAvatar />
  );

  const rawName = user.displayName || user.email?.split('@')[0] || 'User';
  const displayLabel = rawName.replace(/\s*\(.*\)\s*$/, '').trim() || rawName;

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger button */}
      <button
        id="user-menu-button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-[10px] cursor-pointer transition-all duration-200 border border-[rgba(100,80,200,0.22)] bg-white/60 hover:bg-white/80 dark:bg-white/[.07] dark:border-white/[.18] dark:hover:bg-white/[.12]"
      >
        <div className="w-[22px] h-[22px] shrink-0">{avatar}</div>
        <span className="hidden sm:block text-xs font-semibold tracking-wide truncate max-w-[120px] font-syne text-[#3b2a8a] dark:text-white/[.82]">
          {displayLabel}
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className={combineClasses(
            'absolute right-0 top-full mt-4 w-64 z-50 overflow-hidden',
            'rounded-xl border backdrop-blur-[32px]',
            'bg-[#fafbfe] border-[rgba(100,80,200,0.15)] shadow-[0_24px_64px_rgba(100,80,200,0.12),inset_0_1px_0_rgba(255,255,255,0.8)]',
            'dark:bg-[#2e2a44] dark:border-white/10 dark:shadow-[0_24px_64px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.1)]',
          )}
        >
          {/* User info */}
          <div className="px-4 py-3 border-b border-[rgba(100,80,200,0.1)] dark:border-white/[.06]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0">{avatar}</div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate text-[#1e1040] dark:text-white font-syne">
                  {displayLabel}
                </p>
                <p className="text-xs truncate text-[rgba(80,60,160,0.6)] dark:text-white/40 font-syne">
                  {user.email}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-1.5">
            <button
              id="logout-button"
              onClick={async () => {
                await logOut();
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-200 text-[rgba(80,60,160,0.8)] hover:bg-[rgba(100,80,200,0.08)] hover:text-red-500 dark:text-white/60 dark:hover:bg-white/[.06] dark:hover:text-red-400"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="font-syne">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
