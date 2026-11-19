import { useRef, type ReactNode } from 'react';
import { motion } from 'motion/react';
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
      <div className={cn('max-w-[720px]', align === 'center' && 'flex flex-col items-center')}>
        <div className={cn('flex items-center gap-3', align === 'center' && 'justify-center')}>
          {index ? <span className="font-mono text-[11px] tracking-[0.2em] text-white/25">{index}</span> : null}
          <span className="h-px w-8 bg-gradient-to-r from-[#38BDF8]/70 to-transparent" />
          <span className="mono-label text-[#7DD3FC]/70">{eyebrow}</span>
        </div>
        <h2 className="display mt-5 text-[clamp(30px,3.6vw,48px)] text-white">{title}</h2>
        {description ? (
          <p className="mt-4 max-w-[560px] text-[14.5px] leading-[1.85] text-white/45">{description}</p>
        ) : null}
      </div>
      {aside ? <div className="shrink-0 self-start md:self-auto">{aside}</div> : null}
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 26,
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
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** 跟随指针的玻璃光斑容器 */
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
