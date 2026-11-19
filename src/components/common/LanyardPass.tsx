import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import { Move } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanyardPassProps {
  image: string;
  className?: string;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

/**
 * 3D 液态黑曜石通行证。
 * 真实指针拖拽 + 弹簧回位 + 待机轻摆，卡面由 canvas 程序化绘制。
 */
export function LanyardPass({ image, className }: LanyardPassProps) {
  const [dragging, setDragging] = useState(false);
  const [pose, setPose] = useState({ x: 0, y: 0, rx: 0, ry: 0, rz: 0 });
  const start = useRef({ x: 0, y: 0 });

  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    start.current = { x: event.clientX, y: event.clientY };
    setDragging(true);
  };

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    const dx = clamp(event.clientX - start.current.x, -170, 170);
    const dy = clamp(event.clientY - start.current.y, -90, 90);
    setPose({
      x: dx * 0.86,
      y: Math.max(-60, dy * 0.55),
      rx: -dy * 0.16,
      ry: dx * 0.14,
      rz: dx * 0.035,
    });
  };

  const release = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    setDragging(false);
    setPose({ x: 0, y: 0, rx: 0, ry: 0, rz: 0 });
  };

  return (
    <div className={cn('relative flex h-full w-full items-start justify-center', className)}>
      {/* 顶部固定夹 */}
      <div className="absolute left-1/2 top-0 z-10 h-7 w-16 -translate-x-1/2 rounded-b-[10px] border border-white/12 bg-[linear-gradient(180deg,#2a2e35,#0c0e12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_20px_-8px_rgba(0,0,0,0.8)]">
        <span className="absolute left-1/2 top-2 h-2 w-6 -translate-x-1/2 rounded-full bg-black/60 ring-1 ring-white/10" />
      </div>

      {/* 挂绳 */}
      <div
        className="absolute left-1/2 top-4 h-[190px] w-[22px] -translate-x-1/2 origin-top rounded-[3px]"
        style={{
          transform: `translateX(calc(-50% + ${pose.x * 0.12}px)) rotate(${pose.rz * 0.5}deg)`,
          transition: dragging ? 'none' : 'transform 900ms cubic-bezier(0.16,1,0.3,1)',
          background:
            'repeating-linear-gradient(180deg, rgba(255,255,255,0.16) 0 2px, transparent 2px 5px), linear-gradient(90deg,#0b0d11,#2f343c 45%,#12151a 60%,#0a0c10)',
          boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.18), inset -1px 0 0 rgba(0,0,0,0.6), 0 8px 18px -10px rgba(0,0,0,0.9)',
        }}
      >
        <span className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />
      </div>

      {/* 卡面 */}
      <div className="absolute top-[186px] z-20" style={{ perspective: '1200px' }}>
        <div
          className="animate-[sway_7s_ease-in-out_infinite]"
          style={{ transformOrigin: 'top center' }}
        >
          <div
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={release}
            onPointerCancel={release}
            className="relative w-[248px] touch-none select-none rounded-[26px] border border-white/18 bg-[#0a0d12] p-1.5 shadow-[0_50px_90px_-30px_rgba(0,0,0,0.95),inset_0_1px_0_rgba(255,255,255,0.25)] will-change-transform"
            style={{
              transform: `translate3d(${pose.x}px, ${pose.y}px, 0) rotateX(${pose.rx}deg) rotateY(${pose.ry}deg) rotateZ(${pose.rz}deg)`,
              transition: dragging ? 'none' : 'transform 950ms cubic-bezier(0.16,1,0.3,1)',
              transformStyle: 'preserve-3d',
              cursor: dragging ? 'grabbing' : 'grab',
            }}
          >
            <span className="absolute -top-2 left-1/2 z-10 h-4 w-9 -translate-x-1/2 rounded-[5px] border border-white/20 bg-[linear-gradient(180deg,#454b54,#15181d)] shadow-[inset_0_1px_0_rgba(255,255,255,0.4)]" />
            <div className="relative aspect-[9/12.8] w-full overflow-hidden rounded-[20px] bg-[#080a0e]">
              {image ? (
                <img src={image} alt="云迹 · 开源通行证" className="h-full w-full object-cover" draggable={false} />
              ) : (
                <div className="h-full w-full bg-[radial-gradient(80%_60%_at_70%_10%,rgba(56,189,248,0.18),transparent_65%)]" />
              )}

              {/* 冷银斜向高光 */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-screen"
                style={{
                  background: `linear-gradient(${110 + pose.ry * 1.6}deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.04) 16%, transparent 34%, transparent 72%, rgba(56,189,248,0.1) 100%)`,
                }}
              />
              <span className="pointer-events-none absolute inset-0 rounded-[20px] ring-1 ring-inset ring-white/10" />
            </div>

            <span className="pointer-events-none absolute -inset-[1px] rounded-[27px] ring-1 ring-white/[0.06]" />
          </div>
        </div>
      </div>

      {/* 地面投影 */}
      <div
        className="absolute bottom-[12%] left-1/2 h-6 w-[190px] -translate-x-1/2 rounded-[100%] bg-black/70 blur-xl"
        style={{
          transform: `translateX(calc(-50% + ${pose.x * 0.6}px)) scaleX(${1 - Math.abs(pose.x) / 900})`,
          opacity: 0.55 - Math.abs(pose.y) / 500,
        }}
      />

      <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
        <Move className="h-3 w-3" />
        drag the pass
      </div>
    </div>
  );
}
