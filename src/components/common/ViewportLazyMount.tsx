import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ViewportLazyMountProps {
  children: ReactNode;
  className?: string;
  /** 提前挂载距离，默认 250px */
  rootMargin?: string;
  /** 未挂载时的静态兜底（保持视觉不塌陷） */
  placeholder?: ReactNode;
  /** 离开视口后延迟卸载，避免临界抖动 */
  unmountDelay?: number;
  style?: React.CSSProperties;
}

/**
 * 重型 WebGL / Canvas 组件的视口懒挂载守护。
 * 进入视野前 250px 挂载，离开后卸载，确保任意时刻活跃实例不超过 2 个。
 * 外层容器始终占据布局空间，避免卸载造成页面跳动。
 */
export function ViewportLazyMount({
  children,
  className,
  rootMargin = '250px 0px',
  placeholder = null,
  unmountDelay = 900,
  style,
}: ViewportLazyMountProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = hostRef.current;
    if (!node) return undefined;

    let timer = 0;
    const observer = new IntersectionObserver(
      (entries) => {
        const near = entries.some((entry) => entry.isIntersecting);
        if (near) {
          window.clearTimeout(timer);
          setMounted(true);
          requestAnimationFrame(() => setShown(true));
        } else {
          setShown(false);
          timer = window.setTimeout(() => setMounted(false), unmountDelay);
        }
      },
      { rootMargin, threshold: 0 },
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, [rootMargin, unmountDelay]);

  return (
    <div ref={hostRef} className={cn('relative', className)} style={style}>
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-700 ease-out',
          mounted ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        style={{ opacity: shown ? 1 : 0 }}
        aria-hidden={!mounted}
      >
        {mounted ? children : null}
      </div>
      {!mounted && placeholder ? <div className="absolute inset-0">{placeholder}</div> : null}
    </div>
  );
}
