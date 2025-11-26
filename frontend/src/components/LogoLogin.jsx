export default function LogoLogin({ className = "w-10 h-10" }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="g2" x1="0" x2="1">
          <stop offset="0" stopColor="#93C5FD" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#g2)" opacity="0.15" />
      <path d="M22 30h12" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" />
      <path d="M30 26l4 4-4 4" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="34" y="26" width="12" height="12" rx="3" fill="none" stroke="#3B82F6" strokeWidth="2" />
      <path d="M37 26v-2a3 3 0 016 0v2" fill="none" stroke="#3B82F6" strokeWidth="2" />
    </svg>
  );
}
