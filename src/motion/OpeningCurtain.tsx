import { useEffect, useRef, useState } from 'react';
import { EASE, OPENING, gsap, motionAllowed } from '@/motion/gsap';

/**
 * 首屏开场幕布。
 *
 * 三块面板从上、中、下合拢覆盖整屏，中央浮出品牌字标与进度细线；
 * 随后面板依次向上抽离，露出首屏内容。整个过程约 1.1s，
 * 结束后组件自行卸载，不留任何 DOM 或滚动监听。
 *
 * 尊重「减少动态效果」：开启时直接跳过，不阻塞首屏。
 */
export function OpeningCurtain({ onDone }: { onDone?: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!motionAllowed()) {
      setVisible(false);
      onDone?.();
      return;
    }

    const root = rootRef.current;
    if (!root) return;

    const panels = root.querySelectorAll<HTMLElement>('[data-curtain-panel]');
    const mark = root.querySelector<HTMLElement>('[data-curtain-mark]');
    const line = root.querySelector<HTMLElement>('[data-curtain-line]');

    // 锁定滚动，避免幕布期间用户已经滑走
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: EASE.curtain },
        onComplete: () => {
          document.body.style.overflow = previousOverflow;
          setVisible(false);
          onDone?.();
        },
      });

      gsap.set(panels, { yPercent: 0 });

      tl.fromTo(
        mark,
        { autoAlpha: 0, y: 26, letterSpacing: '0.5em' },
        { autoAlpha: 1, y: 0, letterSpacing: '0.22em', duration: 0.85, ease: EASE.reveal },
      )
        .fromTo(
          line,
          { scaleX: 0 },
          { scaleX: 1, duration: 0.8, ease: EASE.reveal },
          '<0.08',
        )
        .to(mark, { autoAlpha: 0, y: -18, duration: 0.4, ease: 'power2.in' }, '+=0.18')
        .to(line, { autoAlpha: 0, duration: 0.3 }, '<')
        .to(
          panels,
          {
            yPercent: -101,
            duration: OPENING.curtain,
            stagger: 0.07,
            ease: EASE.curtain,
          },
          '<0.05',
        );
    }, root);

    return () => {
      document.body.style.overflow = previousOverflow;
      ctx.revert();
    };
  }, [onDone]);

  if (!visible) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[200] flex items-center justify-center"
    >
      {/* 三块面板，靠 stagger 形成斜向抽离 */}
      <div className="absolute inset-0 grid grid-rows-3">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            data-curtain-panel
            className="relative bg-[#04050a]"
            style={{ willChange: 'transform' }}
          >
            <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,rgba(56,189,248,0.05),transparent_70%)]" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <span
          data-curtain-mark
          className="font-mono text-[clamp(15px,2.1vw,22px)] uppercase tracking-[0.22em] text-white/85"
        >
          CLOUDTRACE
        </span>
        <span
          data-curtain-line
          className="mt-5 h-px w-[clamp(96px,16vw,220px)] origin-left bg-gradient-to-r from-transparent via-[#7DD3FC]/70 to-transparent"
        />
      </div>
    </div>
  );
}
