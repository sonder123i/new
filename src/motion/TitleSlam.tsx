import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

export function TitleSlam({
  children,
  className,
  delay = 0,
  distance = 20,
  duration = 0.65,
  as: Tag = 'div',
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
  as?: 'div' | 'h2' | 'h3';
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // 限制外部传入的夸张参数上限，确保全站克制统一
    const safeDistance = Math.min(distance, 26);
    const safeDuration = Math.min(duration, 0.72);

    if (!motionAllowed()) {
      gsap.set(node, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        node,
        { autoAlpha: 0, y: safeDistance },
        {
          autoAlpha: 1,
          y: 0,
          duration: safeDuration,
          delay: Math.min(delay, 0.2),
          ease: EASE.reveal,
          clearProps: 'transform',
          scrollTrigger: { trigger: node, start: 'top 92%', once: true },
        },
      );
    }, node);

    return () => ctx.revert();
  }, [delay, distance, duration]);

  return (
    // @ts-expect-error 动态标签与 ref 类型在此处安全
    <Tag ref={ref} className={cn(className)}>
      {children}
    </Tag>
  );
}
