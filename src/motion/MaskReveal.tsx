import { useEffect, useRef, type ReactNode } from 'react';
import { EASE, gsap, motionAllowed } from '@/motion/gsap';
import { cn } from '@/lib/utils';

/**
 * 遮罩揭示：内容被一块同色面板盖住，进入视口时面板沿自身方向滑出，
 * 同时内容从下方略微上浮——比单纯淡入更有「被揭开」的物理感。
 *
 * 面板与内容同色背景，避免出现灰色方块；只做 transform，不触发重排。
 */
export function MaskReveal({
  children,
  className,
  innerClassName,
  delay = 0,
  duration = 1.15,
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
  const maskRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const mask = maskRef.current;
    const content = contentRef.current;
    if (!root || !mask || !content) return;

    if (!motionAllowed()) {
      gsap.set(mask, { autoAlpha: 0 });
      gsap.set(content, { autoAlpha: 1, y: 0 });
      return;
    }

    const axis = from === 'left' ? 'xPercent' : 'yPercent';
    const dir = from === 'top' ? -101 : from === 'left' ? -101 : 101;

    const ctx = gsap.context(() => {
      gsap.set(content, { autoAlpha: 0, y: from === 'left' ? 0 : 34, x: from === 'left' ? -26 : 0 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: 'top 88%', once },
        delay,
      });
      tl.fromTo(
        mask,
        { [axis]: 0 },
        { [axis]: dir, duration, ease: EASE.reveal },
      )
        .to(
          content,
          { autoAlpha: 1, y: 0, x: 0, duration: duration * 0.9, ease: EASE.reveal },
          '<0.12',
        )
        .set(mask, { autoAlpha: 0 });
    }, root);

    return () => ctx.revert();
  }, [delay, duration, from, once]);

  return (
    <div ref={rootRef} className={cn('relative overflow-hidden', className)}>
      <div ref={contentRef} className={innerClassName}>
        {children}
      </div>
      <div
        ref={maskRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#050507]"
      />
    </div>
  );
}
