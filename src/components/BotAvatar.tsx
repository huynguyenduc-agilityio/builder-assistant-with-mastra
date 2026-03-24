export const BotAvatar = () => (
  <div className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center mb-0.5 bg-[linear-gradient(135deg,#7c3aed,#06b6d4)] border border-white/[.18]">
    <svg viewBox="0 0 36 36" fill="none" className="w-4 h-4">
      <ellipse
        cx="18"
        cy="18"
        rx="14"
        ry="8"
        stroke="white"
        strokeWidth="2"
        fill="none"
      />
      <ellipse cx="18" cy="18" rx="3.5" ry="3.5" fill="white" />
      <path
        d="M4 18 Q11 8 18 18 Q25 28 32 18"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="1.5"
        fill="none"
      />
    </svg>
  </div>
);
