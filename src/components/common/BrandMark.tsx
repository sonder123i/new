import { cn } from '@/lib/utils';

/** 云迹品牌标记：直接使用应用图标，保证站内与 App 头像一致 */
export function BrandMark({ size = 34, className }: { size?: number; className?: string }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}brand-icon-192.png`}
      width={size}
      height={size}
      alt=""
      aria-hidden="true"
      draggable={false}
      className={cn(
        'shrink-0 select-none rounded-[26%] object-contain',
        'shadow-[0_6px_18px_-8px_rgba(0,0,0,0.85)] ring-1 ring-white/12',
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
