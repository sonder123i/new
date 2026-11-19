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
      <div className={cn('max-w-[700px]', align === 'center' && 'flex flex-col items-center')}>
        <TitleSlam delay={0} distance={14} duration={0.55}>
          <div className={cn('flex items-center gap-2.5', align === 'center' && 'justify-center')}>
            {index ? <span className="font-mono text-[11px] tracking-[0.16em] text-white/40">{index}</span> : null}
            <span className="h-px w-6 bg-white/25" />
            <span className="mono-label text-white/70">{eyebrow}</span>
          </div>
        </TitleSlam>
        <TitleSlam delay={0.05} distance={20} duration={0.62}>
          <h2 className="display mt-4 text-[clamp(30px,3.8vw,48px)] text-[#F5F5F7]">{title}</h2>
        </TitleSlam>
        {description ? (
          <TitleSlam delay={0.1} distance={16} duration={0.58}>
            <p className="mt-4 max-w-[540px] text-[15px] leading-[1.75] text-white/65">{description}</p>
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
  y = 16,
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
      transition={{ duration: 0.55, delay: Math.min(delay, 0.2), ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

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
