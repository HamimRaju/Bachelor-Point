type BrandLogoProps = {
  className?: string;
  showTagline?: boolean;
};

export default function BrandLogo({
  className = "",
  showTagline = false,
}: BrandLogoProps) {
  return (
    <span className={`brand-lockup ${className}`}>
      <span className="brand-logo-mark" aria-hidden="true">
        <svg fill="none" viewBox="0 0 48 48">
          <path
            d="m10 23 14-12 14 12M15 21.5V36h18V21.5M21 36v-9h6v9"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.6"
          />
          <circle cx="36" cy="13" r="5" fill="#133a38" />
          <circle cx="36" cy="13" r="1.7" fill="#8cf2d5" />
        </svg>
      </span>
      <span className="brand-wordmark">
        <span className="brand-wordmark-name">Bachelor Point</span>
        {showTagline && (
          <span className="brand-wordmark-tagline">SHARED LIVING, IN SYNC</span>
        )}
      </span>
    </span>
  );
}
