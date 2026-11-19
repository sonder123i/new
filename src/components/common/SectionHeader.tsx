import { useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { TitleSlam } from '@/motion/TitleSlam';
import { cn } from '@/lib/utils';

export function SectionHeader({
  index,
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  aside,
}: {
  index?: string;
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  align?: 'left' | 'center';
  className?: string;
  aside?: ReactNode;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        align === 'center' ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <div className={cn('max-w-[740px]', align === 'center' && 'flex flex-col items-center')}>
        <TitleSlam delay={0} distance={14} duration={0.55}>
          <div className={cn('inline-flex items-center gap-3', align === 'center' && 'justify-center')}>
            {index ? (
              <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#0A0C10]/40 tabular">
                {index}
              </span>
            ) : null}
            <span className="h-px w-8 bg-[#0A0C10]/20" />
            <span className="mono-label text-[#0A0C10]/65">{eyebrow}</span>
          </div>
        </TitleSlam>

        <TitleSlam delay={0.05} distance={20} duration={0.62}>
          <h2 className="display mt-4 text-[clamp(30px,3.8vw,50px)] text-[#0A0C10]">{title}</h2>
        </TitleSlam>

        {description ? (
          <TitleSlam delay={0.1} distance={16} duration={0.58}>
            <p className="mt-4 max-w-[560px] text-[15px] leading-[1.78] text-[#0A0C10]/62">{description}</p>
          </TitleSlam>
        ) : null}
      </div>

      {aside ? <div className="shrink-0 self-start md:self-auto">{aside}</div> : null}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 18,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.58, delay: Math.min(delay, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** 跟随指针的瓷白光学高光容器 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onPointerMove = (event: React.PointerEvent<T>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };
  return { ref, onPointerMove };
}
