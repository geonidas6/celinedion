interface IconProps {
  size?: number;
  className?: string;
}

export function PlayIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M8 5.14v13.72c0 .78.85 1.26 1.52.86l10.5-6.86a1 1 0 0 0 0-1.72L9.52 4.28A1 1 0 0 0 8 5.14Z" fill="currentColor" />
    </svg>
  );
}

export function PauseIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <rect x="6" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
      <rect x="14" y="4" width="4" height="16" rx="1.2" fill="currentColor" />
    </svg>
  );
}

export function NextIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M5.5 5.3v13.4c0 .8.87 1.29 1.55.88l9.9-6.2a1 1 0 0 0 0-1.71L7.05 4.42A1 1 0 0 0 5.5 5.3Z" fill="currentColor" />
      <rect x="17.4" y="4.5" width="2.4" height="15" rx="1.1" fill="currentColor" />
    </svg>
  );
}

export function PrevIcon({ size = 20, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M18.5 5.3v13.4c0 .8-.87 1.29-1.55.88l-9.9-6.2a1 1 0 0 1 0-1.71l9.9-6.25a1 1 0 0 1 1.55.88Z" fill="currentColor" />
      <rect x="4.2" y="4.5" width="2.4" height="15" rx="1.1" fill="currentColor" />
    </svg>
  );
}

export function ShuffleIcon({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M16 4h4v4M20 4l-6.5 6.5M4 20l6.5-6.5M16 20h4v-4M14 14l6 6M4 4l4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function RepeatIcon({ size = 18, className, one = false }: IconProps & { one?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M6 7h11a3 3 0 0 1 3 3v2M18 17H7a3 3 0 0 1-3-3v-2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 4 6 7l3 3M15 20l3-3-3-3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {one && <text x="12" y="14.6" textAnchor="middle" fontSize="7" fontWeight="700" fill="currentColor">1</text>}
    </svg>
  );
}

export function VolumeIcon({ size = 18, className, muted = false }: IconProps & { muted?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M4 9.5h3.2L12 5.7v12.6l-4.8-3.8H4Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      {muted ? (
        <path d="m16 9 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <path d="M15.5 8.5a5 5 0 0 1 0 7M18.2 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      )}
    </svg>
  );
}

export function SearchIcon({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path d="m16 16 4.2 4.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function YouTubeIcon({ size = 18, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.3 9.2v5.6l5-2.8Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowIcon({ size = 16, className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden="true">
      <path d="M5 12h13m-5-5 5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function EqualizerIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" width={16} height={16} className={className} aria-hidden="true">
      <rect className="eq-bar eq-1" x="2" y="7" width="3" height="6" rx="1.5" fill="currentColor" />
      <rect className="eq-bar eq-2" x="8.5" y="4" width="3" height="12" rx="1.5" fill="currentColor" />
      <rect className="eq-bar eq-3" x="15" y="8" width="3" height="5" rx="1.5" fill="currentColor" />
    </svg>
  );
}
