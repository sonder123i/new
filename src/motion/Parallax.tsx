import { useEffect, useRef, type ReactNode } from 'react';
import { gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * 轻微视差：元素随页面滚动做一次小幅纵向位移。
 *
 * 用 ScrollTrigger 的 scrub 绑定滚动进度，位移量很小（默认 60px），
 * 只改 transform，避免布局抖动；省电模式下完全不动。
 */
export function Parallax({
  children,
  className,
  strength = 60,
  scale = false,
}: {
  children: ReactNode;
  className?: string;
  /** 位移幅度（px），正值向下沉，负值向上浮 */
  strength?: number;
  /** 是否同时做极轻微的缩放，增强纵深 */
  scale?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!motionAllowed()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { y: strength * 0.5, scale: scale ? 1.04 : 1 },
        {
          y: -strength * 0.5,
          scale: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: node,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 0.8,
          },
        },
      );
    }, node);

    return () => ctx.revert();
  }, [scale, strength]);

  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
