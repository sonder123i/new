import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

export function StaggerIn({
  children,
  className,
  selector = ':scope > *',
  delay = 0,
  stagger = 0.06,
  distance = 20,
  duration = 0.6,
  start = 'top 90%',
}: {
  children: ReactNode;
  className?: string;
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
      gsap.set(targets, { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        targets,
        { autoAlpha: 0, y: Math.min(distance, 24) },
        {
          autoAlpha: 1,
          y: 0,
          duration: Math.min(duration, 0.68),
          delay: Math.min(delay, 0.15),
          stagger: Math.min(stagger, 0.07),
          ease: EASE.stagger,
          clearProps: 'transform',
          scrollTrigger: { trigger: root, start, once: true },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [delay, distance, duration, selector, stagger, start]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
