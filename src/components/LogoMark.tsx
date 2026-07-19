export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="-30 -34 64 64" aria-hidden="true">
      <circle cx="0" cy="-4" r="20" fill="none" stroke="var(--dm-ink)" strokeWidth="5" />
      <line x1="14" y1="10" x2="26" y2="22" stroke="var(--dm-ink)" strokeWidth="6" strokeLinecap="round" />
      <rect x="-11" y="2" width="5" height="8" rx="1" fill="var(--dm-teal)" />
      <rect x="-3" y="-4" width="5" height="14" rx="1" fill="var(--dm-teal)" />
      <rect x="5" y="-10" width="5" height="20" rx="1" fill="var(--dm-teal)" />
      <path
        d="M14 -26 L16 -21 L21 -19 L16 -17 L14 -12 L12 -17 L7 -19 L12 -21 Z"
        fill="var(--dm-coral)"
      />
    </svg>
  );
}
