interface IconProps {
  className?: string;
}

/**
 * Inline SVG icons, sized in `em` so they scale with the surrounding text
 * without per-call-site tuning. Decorative only — callers' link text already
 * conveys the destination, so these are marked aria-hidden.
 */

export function MailIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1.5" y="3" width="13" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M2.2 4.2l5.8 4.6 5.8-4.6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <rect x="1.5" y="1.5" width="13" height="13" rx="3.5" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="3.1" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.65" cy="4.35" r="0.7" fill="currentColor" />
    </svg>
  );
}
