import { cn } from '@/lib/utils';

/** 云迹品牌标记：液态玻璃圆角方框 + 光纤跑道环 */
export function BrandMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <span
      className={cn(
        'relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[30%]',
        'bg-[linear-gradient(150deg,rgba(255,255,255,0.22),rgba(255,255,255,0.04)_46%,rgba(255,255,255,0.14))]',
        'ring-1 ring-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.5),0_6px_18px_-8px_rgba(0,0,0,0.9)]',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" className="h-[78%] w-[78%]" fill="none">
        <defs>
          <linearGradient id="brand-fiber" x1="6" y1="8" x2="34" y2="32" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FEFF" />
            <stop offset="0.5" stopColor="#7DD3FC" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        <rect x="7.5" y="12" width="25" height="16" rx="8" stroke="url(#brand-fiber)" strokeWidth="1.7" opacity="0.95" />
        <rect x="11" y="15.5" width="18" height="9" rx="4.5" stroke="#E2E8F0" strokeWidth="0.8" opacity="0.35" />
        <circle cx="20" cy="20" r="2.1" fill="#F8FEFF" />
        <circle cx="20" cy="20" r="4.4" stroke="#38BDF8" strokeWidth="0.9" opacity="0.55" />
      </svg>
    </span>
  );
}
