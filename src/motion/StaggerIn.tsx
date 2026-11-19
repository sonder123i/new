import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * 错峰进场容器：子元素在进入视口后按顺序依次推入。
 *
 * 用 ScrollTrigger 一次性触发，子元素只做 transform + opacity，
 * 通过 stagger 形成「卡片一张张落位」的节奏，而不是整块淡入。
 */
export function StaggerIn({
  children,
  className,
  selector = ':scope > *',
  delay = 0,
  stagger = 0.11,
  distance = 46,
  duration = 1.1,
  start = 'top 84%',
}: {
  children: ReactNode;
  className?: string;
  /** 参与错峰的子元素选择器 */
  selector?: string;
  delay?: number;
  stagger?: number;
  distance?: number;
  duration?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const targets = Array.from(root.querySelectorAll<HTMLElement>(selector));
    if (!targets.length) return;

    if (!motionAllowed()) {
      gsap.set(targets, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { autoAlpha: 0, y: distance, scale: 0.985 });

      gsap.to(targets, {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        stagger,
        ease: EASE.stagger,
        scrollTrigger: { trigger: root, start, once: true },
      });
    }, root);

    return () => ctx.revert();
  }, [delay, distance, duration, selector, stagger, start]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
