interface ContactData {
  email?: string;
  hotline?: string;
  phone?: string;
  note?: string;
}

interface ContactResultData {
  type: 'contact_us';
  data: ContactData;
}

interface ContactCardProps {
  data: ContactData;
}

export const ContactCard = ({ data }: ContactCardProps) => {
  const { email, hotline, phone, note } = data;

  const contacts = [
    {
      key: 'email',
      label: 'Email',
      value: email,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-violet-500 dark:text-violet-400"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      iconBg: 'bg-violet-50 dark:bg-violet-500/10',
      href: email ? `mailto:${email}` : undefined,
      copyable: true,
    },
    {
      key: 'hotline',
      label: 'Hotline',
      value: hotline,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 dark:text-amber-400"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6.29 6.29l1.02-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      iconBg: 'bg-amber-50 dark:bg-amber-500/10',
      href: undefined,
      copyable: true,
    },
    {
      key: 'phone',
      label: 'Phone',
      value: phone,
      icon: (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-emerald-500 dark:text-emerald-400"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.59 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.76a16 16 0 0 0 6.29 6.29l1.02-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
      ),
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10',
      href: undefined,
      copyable: true,
    },
  ].filter((c) => c.value);

  return (
    <div className="relative overflow-hidden w-full max-w-sm rounded-tl rounded-tr-2xl rounded-br-2xl rounded-bl-2xl border border-[rgba(100,80,200,0.22)] dark:border-white/10 bg-white/80 dark:bg-white/[.08] backdrop-blur-md shadow-[0_2px_14px_rgba(100,80,200,0.1)] dark:shadow-[0_2px_12px_rgba(0,0,0,0.2)]">
      <div className="p-5">
        {/* Badge */}
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-widest uppercase border bg-violet-500/10 dark:bg-violet-500/15 text-violet-600 dark:text-violet-300 border-violet-400/30 dark:border-violet-500/25">
            💬 Contact Us
          </span>
        </div>

        {/* Contact rows */}
        <div className="space-y-3">
          {contacts.map(({ key, label, value, icon, iconBg, href }) => (
            <div key={key} className="flex items-start gap-3">
              {/* Icon */}
              <div
                className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center ${iconBg}`}
              >
                {icon}
              </div>

              {/* Content */}
              <div className="min-w-0 flex-1 pt-0.5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="text-xs sm:text-sm text-violet-600 dark:text-violet-300 hover:underline underline-offset-2 leading-relaxed break-all"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                    {value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Note */}
        {note && (
          <>
            <div className="h-px bg-black/[0.06] dark:bg-white/[0.06] my-4" />
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 shrink-0 rounded-lg flex items-center justify-center bg-blue-50 dark:bg-blue-500/10">
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-blue-500 dark:text-blue-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <div className="min-w-0 pt-0.5">
                <p className="text-[10px] font-semibold tracking-widest uppercase text-gray-400 dark:text-white/30 mb-0.5">
                  Note
                </p>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-white/60 leading-relaxed">
                  {note}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export const ContactResultCard = ({ result }: { result: unknown }) => {
  let parsed: ContactResultData | null = null;
  try {
    parsed =
      typeof result === 'string'
        ? JSON.parse(result)
        : (result as ContactResultData);
  } catch {
    return null;
  }

  if (!parsed || parsed.type !== 'contact_us' || !parsed.data) return null;

  return <ContactCard data={parsed.data} />;
};
