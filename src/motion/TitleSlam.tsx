import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * 大标题进场：整行文字从下方大幅推入，同时做一次轻微的纵向压缩（scaleY）
 * 后归位，形成「被压住再弹开」的物理错觉。
 *
 * 只动 transform，不碰 layout；进入视口一次即停。
 */
export function TitleSlam({
  children,
  className,
  delay = 0,
  distance = 120,
  duration = 1.35,
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

    if (!motionAllowed()) {
      gsap.set(node, { autoAlpha: 1, y: 0, scaleY: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(node, {
        autoAlpha: 0,
        y: distance,
        scaleY: 0.82,
        transformOrigin: '50% 100%',
      });

      gsap
        .timeline({
          scrollTrigger: { trigger: node, start: 'top 90%', once: true },
          delay,
        })
        .to(node, {
          autoAlpha: 1,
          y: 0,
          scaleY: 1,
          duration,
          ease: EASE.reveal,
        });
    }, node);

    return () => ctx.revert();
  }, [delay, distance, duration]);

  return (
    // @ts-expect-error 动态标签与 ref 类型在此处安全
    <Tag ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </Tag>
  );
}
