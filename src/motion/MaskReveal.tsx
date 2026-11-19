import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

/** 用纯 GPU 合成的 clip-path 替代实色黑块，消除在渐变/光晕背景上的矩形补丁感 */
export function MaskReveal({
  children,
  className,
  innerClassName,
  delay = 0,
  duration = 0.65,
  from = 'bottom',
  once = true,
}: {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  delay?: number;
  duration?: number;
  from?: 'bottom' | 'top' | 'left';
  once?: boolean;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    if (!root || !content) return;

    if (!motionAllowed()) {
      gsap.set(content, { autoAlpha: 1, y: 0, x: 0, clipPath: 'inset(0% 0% 0% 0%)' });
      return;
    }

    const initialClip =
      from === 'top'
        ? 'inset(0% 0% 100% 0%)'
        : from === 'left'
          ? 'inset(0% 100% 0% 0%)'
          : 'inset(100% 0% 0% 0%)';

    const ctx = gsap.context(() => {
      gsap.fromTo(
        content,
        {
          autoAlpha: 0,
          y: from === 'left' ? 0 : 14,
          x: from === 'left' ? -14 : 0,
          clipPath: initialClip,
        },
        {
          autoAlpha: 1,
          y: 0,
          x: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          duration: Math.min(duration, 0.72),
          delay: Math.min(delay, 0.2),
          ease: EASE.reveal,
          clearProps: 'transform,clipPath',
          scrollTrigger: { trigger: root, start: 'top 90%', once },
        },
      );
    }, root);

    return () => ctx.revert();
  }, [delay, duration, from, once]);

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <div ref={contentRef} className={innerClassName}>
        {children}
      </div>
    </div>
  );
}
