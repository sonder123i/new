import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Crosshair,
  Gauge,
  Moon,
  Pause,
  Radio,
  ShieldCheck,
  Sun,
  Waves,
  Zap,
} from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { usePerformance } from '@/components/common/PerformanceContext';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import AnimatedList, { type AnimatedListEntry } from '@/components/reactbits/AnimatedList';
import DecryptedText from '@/components/reactbits/DecryptedText';
import GlassSurface from '@/components/reactbits/GlassSurface';
import TrueFocus from '@/components/reactbits/TrueFocus';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';
import { StaggerIn } from '@/motion/StaggerIn';

function BentoCard({
  children,
  className,
  fig,
  eyebrow,
  title,
  body,
  visualClassName,
}: {
  children: React.ReactNode;
  className?: string;
  fig: string;
  eyebrow: string;
  title: string;
  body: string;
  visualClassName?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
    node.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
  };

  return (
    <article
      ref={ref}
      onPointerMove={onPointerMove}
      className={cn(
        'spotlight-surface glass-panel group relative flex min-h-[350px] flex-col justify-end overflow-hidden rounded-[26px]',
        'transition-shadow duration-500 hover:shadow-[0_28px_64px_-28px_rgba(15,23,42,0.22)]',
        className,
      )}
    >
      <div className={cn('relative z-0 min-h-0 flex-1', visualClassName)}>{children}</div>

      <div className="relative z-10 border-t border-[#0A0C10]/[0.06] bg-gradient-to-t from-white/90 via-white/75 to-white/40 p-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#0A0C10]/50">{eyebrow}</span>
          <span className="font-mono text-[10px] tracking-[0.14em] text-[#0A0C10]/32 tabular">{fig}</span>
        </div>
        <h3 className="mt-2.5 text-[18px] font-semibold tracking-[-0.02em] text-[#0A0C10]">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.72] text-[#0A0C10]/62">{body}</p>
      </div>
    </article>
  );
}

/** 01 · AGSL 液态玻璃折射实验台（指针驱动透镜视差 + 高光跟随） */
function AgslVisual() {
  const { isFlagship } = usePerformance();
  const stageRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const contourRef = useRef<SVGGElement>(null);

  /* 透镜交互：指针在卡片里移动时，底层等高线按视差反向位移，
     整颗玻璃随指针做极小的 3D 倾斜，镜面高光跟着走。
     全部直接写 DOM，不走 state；松手后弹簧式回到中位。 */
  useEffect(() => {
    if (!isFlagship) return undefined;
    const stage = stageRef.current;
    const pill = pillRef.current;
    const contour = contourRef.current;
    if (!stage || !pill || !contour) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let raf = 0;
    const current = { x: 0, y: 0 };
    const goal = { x: 0, y: 0 };

    const paint = () => {
      current.x += (goal.x - current.x) * 0.14;
      current.y += (goal.y - current.y) * 0.14;

      contour.setAttribute(
        'transform',
        `translate(${(-current.x * 26).toFixed(2)} ${(-current.y * 18).toFixed(2)})`,
      );
      pill.style.transform =
        `perspective(720px) rotateX(${(current.y * 7).toFixed(2)}deg) ` +
        `rotateY(${(-current.x * 9).toFixed(2)}deg) ` +
        `translate3d(${(current.x * 5).toFixed(2)}px, ${(current.y * 4).toFixed(2)}px, 0)`;
      pill.style.setProperty('--lens-x', `${(50 + current.x * 82).toFixed(1)}%`);
      pill.style.setProperty('--lens-y', `${(45 + current.y * 82).toFixed(1)}%`);

      if (Math.abs(goal.x - current.x) > 0.002 || Math.abs(goal.y - current.y) > 0.002) {
        raf = requestAnimationFrame(paint);
      } else {
        raf = 0;
      }
    };

    const wake = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      goal.x = (event.clientX - rect.left) / Math.max(rect.width, 1) - 0.5;
      goal.y = (event.clientY - rect.top) / Math.max(rect.height, 1) - 0.5;
      wake();
    };
    const onLeave = () => {
      goal.x = 0;
      goal.y = 0;
      wake();
    };

    stage.addEventListener('pointermove', onMove, { passive: true });
    stage.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      stage.removeEventListener('pointermove', onMove);
      stage.removeEventListener('pointerleave', onLeave);
    };
  }, [isFlagship]);

  return (
    <div
      ref={stageRef}
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#EAEFF6]/60 to-transparent"
    >
      <svg
        viewBox="0 0 700 360"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g ref={contourRef} style={{ willChange: 'transform' }}>
          {Array.from({ length: 13 }).map((_, index) => (
            <ellipse
              key={index}
              cx={340 + Math.sin(index * 1.6) * 12}
              cy={168 + Math.cos(index * 1.2) * 8}
              rx={56 + index * 24}
              ry={30 + index * 14}
              transform={`rotate(${-10 + Math.sin(index) * 3} 340 168)`}
              stroke={index === 4 ? 'rgba(10,12,16,0.34)' : 'rgba(10,12,16,0.09)'}
              strokeWidth={index === 4 ? 1.35 : 1}
            />
          ))}
        </g>
      </svg>

      <div className="absolute left-1/2 top-[48%] -translate-x-1/2 -translate-y-1/2">
        <div
          ref={pillRef}
          className="relative will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {isFlagship ? (
            <ViewportLazyMount className="h-[92px] w-[264px]" rootMargin="200px 0px" unmountDelay={500}>
              <GlassSurface
                width={264}
                height={92}
                borderRadius={46}
                borderWidth={0.08}
                brightness={88}
                opacity={0.94}
                blur={11}
                displace={1.1}
                backgroundOpacity={0.22}
                saturation={1.45}
                distortionScale={-125}
                redOffset={4}
                greenOffset={9}
                blueOffset={15}
                refraction
                mixBlendMode="normal"
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0C10]">
                    AGSL · LIQUID GLASS
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#0A0C10]/55">
                    RuntimeShader · SDF ROUND
                  </span>
                </div>
              </GlassSurface>
            </ViewportLazyMount>
          ) : (
            <div className="glass-panel flex h-[92px] w-[264px] flex-col items-center justify-center gap-1 rounded-full">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[#0A0C10]">
                AGSL · LIQUID GLASS
              </span>
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#0A0C10]/55">
                RuntimeShader · 120Hz
              </span>
            </div>
          )}

          {/* 镜面高光：随指针在镜面上滑动，增强「这是一块玻璃」的读数 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-full"
            style={{
              background:
                'radial-gradient(132px circle at var(--lens-x, 50%) var(--lens-y, 45%), rgba(255,255,255,0.92), rgba(255,255,255,0.26) 46%, transparent 72%)',
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-full ring-1 ring-white/70"
          />
        </div>
      </div>

      <span className="absolute left-5 top-4 font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#0A0C10]/40">
        contour / refract
      </span>
      <span className="glass-panel-soft absolute right-5 top-4 flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#0A0C10]/65">
        <span className="h-1.5 w-1.5 rounded-full bg-[#0A0C10]" /> live
      </span>
    </div>
  );
}

const islandEntries: AnimatedListEntry[] = siteConfig.islandMessages.map((message, index) => ({
  id: index,
  icon: (
    <span
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full',
        message.tone === 'run' && 'bg-[#0A0C10] text-white',
        message.tone === 'info' && 'bg-[#0A0C10]/[0.08] text-[#0A0C10]/75',
        message.tone === 'warn' && 'bg-[#0A0C10]/[0.12] text-[#0A0C10]',
      )}
    >
      {message.tone === 'run' ? (
        <Radio className="h-3 w-3" />
      ) : message.tone === 'info' ? (
        <Waves className="h-3 w-3" />
      ) : (
        <Zap className="h-3 w-3" />
      )}
    </span>
  ),
  title: message.text,
  description: message.tone === 'run' ? '正在进行' : message.tone === 'info' ? '状态流转' : '环境提示',
  meta: '刚刚',
}));

const ISLAND_MODES = [
  { id: 'run', label: '自动跑圈', metric: "5'40\" · 0.85 / 3.00 km" },
  { id: 'roam', label: '自由漫游', metric: '1.4 m/s · 300m 半径' },
  { id: 'hold', label: '校准待机', metric: '±1m 游标已锁定' },
] as const;

/** 02 · visionOS 曜石悬浮岛（支持三态点击切换 + 离屏自动暂停定时流） */
function IslandVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [modeIdx, setModeIdx] = useState(0);
  const [items, setItems] = useState<AnimatedListEntry[]>(islandEntries.slice(0, 3));
  const cursor = useRef(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      cursor.current = (cursor.current + 1) % islandEntries.length;
      const next = islandEntries[cursor.current];
      setItems((prev) => [{ ...next, id: `${next.id}-${Date.now()}` }, ...prev].slice(0, 3));
    }, 3400);
    return () => window.clearInterval(timer);
  }, [inView]);

  const currentMode = ISLAND_MODES[modeIdx];

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden px-5 pt-5">
      {/* 曜石黑悬浮岛主胶囊：点击右侧按钮可切换 3 种状态 */}
      <div className="glass-obsidian relative flex items-center justify-between rounded-full px-3.5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/12">
            <span className="h-2 w-2 rounded-full bg-white" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[11.5px] font-medium text-white">云迹 · {currentMode.label}</span>
            <span className="mt-1 font-mono text-[9.5px] text-white/60 tabular">{currentMode.metric}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setModeIdx((prev) => (prev + 1) % ISLAND_MODES.length)}
          title="切换悬浮岛状态"
          className="flex h-7 items-center gap-1 rounded-full bg-white/12 px-2.5 font-mono text-[9.5px] text-white/85 transition-colors hover:bg-white/20"
        >
          {modeIdx === 0 ? (
            <Gauge className="h-3 w-3" />
          ) : modeIdx === 1 ? (
            <Crosshair className="h-3 w-3" />
          ) : (
            <Pause className="h-3 w-3" />
          )}
          切换
        </button>
      </div>

      <div className="relative mt-3.5">
        <AnimatedList
          items={items}
          renderItem={(item) => {
            if (typeof item === 'string') return item;
            return (
              <div className="flex w-full items-center gap-2.5">
                {item.icon}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[11.5px] font-medium text-[#0A0C10]/82">{item.title}</div>
                </div>
                <span className="font-mono text-[9.5px] text-[#0A0C10]/40">{item.meta}</span>
              </div>
            );
          }}
          animation="slide"
          stagger={0.05}
          showGradients={false}
          displayScrollbar={false}
          frame={false}
          theme="light"
          accentColor="#0A0C10"
          gap={6}
          radius={14}
          maxHeight={185}
          className="island-list !bg-transparent"
        />
      </div>
    </div>
  );
}

/** 03 · 真实可调 1m 游标卡尺操场套模仪 */
function RadarVisual() {
  const [perimeter, setPerimeter] = useState<200 | 300 | 400>(400);
  const [angle, setAngle] = useState(0);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden px-5 py-4">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1 rounded-full border border-[#0A0C10]/10 bg-white/70 p-0.5">
          {([200, 300, 400] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setPerimeter(m)}
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-[10px] transition-colors tabular',
                perimeter === m ? 'bg-[#0A0C10] text-white' : 'text-[#0A0C10]/55 hover:text-[#0A0C10]',
              )}
            >
              {m}m
            </button>
          ))}
        </div>
        <span className="font-mono text-[10px] text-[#0A0C10]/50 tabular">
          {angle > 0 ? `+${angle}°` : `${angle}°`}
        </span>
      </div>

      {/* 旋转操场跑道与游标环 */}
      <div className="relative flex aspect-square w-[144px] items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-[#0A0C10]/12" />
        <div className="absolute inset-[14%] rounded-full border border-dashed border-[#0A0C10]/14" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-[#0A0C10]/[0.07]" />
          <div className="absolute h-px w-full bg-[#0A0C10]/[0.07]" />
        </div>

        {/* 可随滑块实时旋转的 400m 标准跑道线框 */}
        <div
          className="relative flex items-center justify-center rounded-full border-[1.8px] border-[#0A0C10] bg-white/60 shadow-[0_8px_20px_-10px_rgba(10,12,16,0.28)] transition-all duration-300"
          style={{
            width: perimeter === 400 ? 112 : perimeter === 300 ? 94 : 78,
            height: perimeter === 400 ? 64 : perimeter === 300 ? 54 : 46,
            transform: `rotate(${angle}deg)`,
          }}
        >
          <span className="font-mono text-[16px] font-semibold leading-none tracking-[-0.03em] text-[#0A0C10] tabular">
            {perimeter}
            <span className="ml-0.5 text-[9.5px] font-normal text-[#0A0C10]/50">m</span>
          </span>
        </div>
      </div>

      {/* 倾角微调游标 */}
      <div className="flex w-full items-center gap-2.5">
        <span className="font-mono text-[9.5px] uppercase tracking-[0.12em] text-[#0A0C10]/45">倾角</span>
        <input
          type="range"
          min={-45}
          max={45}
          step={1}
          value={angle}
          onChange={(e) => setAngle(Number(e.target.value))}
          aria-label="操场套模倾角"
          className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-[#0A0C10]/12 accent-[#0A0C10]"
        />
        <span className="font-mono text-[9.5px] text-[#0A0C10]/50">±1m</span>
      </div>
    </div>
  );
}

/** 04 · 自由漫游信标（Ref 直写 GPU transform，0 次 React 重渲染） */
function RoamVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = containerRef.current;
    const dot = dotRef.current;
    if (!box || !dot) return;
    const rect = box.getBoundingClientRect();
    const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 32;
    const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 24;
    dot.style.transform = `translate3d(calc(-50% + ${dx.toFixed(1)}px), calc(-50% + ${dy.toFixed(1)}px), 0)`;
  };

  const onPointerLeave = () => {
    if (dotRef.current) {
      dotRef.current.style.transform = 'translate3d(-50%, -50%, 0)';
    }
  };

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden bg-gradient-to-b from-[#EDF1F7]/70 to-transparent"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="rgba(10,12,16,0.065)" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`h${index}`} d={`M-20 ${22 + index * 36} L 420 ${8 + index * 36}`} />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <path key={`v${index}`} d={`M${-10 + index * 42} -20 L ${24 + index * 42} 320`} />
          ))}
        </g>
        <path
          d="M-20 206 C 80 176, 150 238, 240 202 S 350 162, 420 194"
          stroke="rgba(10,12,16,0.16)"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        <path
          d="M112 -20 C 130 74, 96 150, 134 226 S 154 286, 138 320"
          stroke="rgba(10,12,16,0.11)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M24 252 C 96 228, 146 254, 212 232"
          stroke="#0A0C10"
          strokeWidth="1.4"
          strokeDasharray="3 5"
          opacity="0.55"
        />
      </svg>

      <div
        ref={dotRef}
        className="pointer-events-none absolute left-1/2 top-[42%] z-10 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      >
        <span className="absolute inset-0 -m-5 rounded-full border border-[#0A0C10]/18" />
        <span className="absolute inset-0 -m-2.5 rounded-full border border-[#0A0C10]/35" />
        <span className="relative block h-2.5 w-2.5 rounded-full bg-[#0A0C10] shadow-[0_0_0_4px_rgba(255,255,255,0.9)]" />
      </div>

      <div className="absolute inset-x-4 bottom-3">
        <div className="glass-panel-soft rounded-xl px-3 py-2">
          <DecryptedText
            text="39.90152° N, 116.40685° E"
            animateOn="hover"
            loop={false}
            speed={28}
            maxIterations={10}
            revealDirection="start"
            useOriginalCharsOnly
            characters="0123456789°NESW., "
            className="font-mono text-[10.5px] font-medium tracking-[0.04em] text-[#0A0C10]"
            encryptedClassName="text-[#0A0C10]/45"
            scrambleColor="#0A0C10"
          />
          <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-[#0A0C10]/50">
            <span>walk 1.4 m/s</span>
            <span>smooth · 300m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 05 · 纯本地隐私零遥测（浅色墨黑对焦框 TrueFocus） */
function PrivacyVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-hidden px-4">
      <span className="glass-panel-soft flex h-12 w-12 items-center justify-center rounded-2xl">
        <ShieldCheck className="h-5 w-5 text-[#0A0C10]" />
      </span>
      <div className="text-[#0A0C10]">
        <TrueFocus
          sentence="无账号 无上传 纯本地"
          separator=" "
          manualMode={false}
          focusStyle="brackets"
          order="sequential"
          easing="smooth"
          blurAmount={2.5}
          focusScale={1.04}
          borderColor="#0A0C10"
          glowColor="rgba(10,12,16,0.16)"
          animationDuration={0.65}
          pauseBetweenAnimations={1.6}
          cornerSize={6}
          borderWidth={1.5}
          unfocusedOpacity={0.38}
        />
      </div>
      <span className="font-mono text-[9.5px] uppercase tracking-[0.2em] text-[#0A0C10]/42">
        local only · zero telemetry
      </span>
    </div>
  );
}

/** 06 · 日光瓷白 / 曜石深空双主题实时对比交互卡（零 WebGL 开销） */
function ThemeVisual() {
  const [mode, setMode] = useState<'day' | 'night'>('day');
  const isDay = mode === 'day';

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
      <div className="flex items-center gap-1.5 self-start rounded-full border border-[#0A0C10]/10 bg-white/75 p-1">
        <button
          type="button"
          onClick={() => setMode('day')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300',
            isDay ? 'bg-[#0A0C10] text-white shadow-xs' : 'text-[#0A0C10]/60 hover:text-[#0A0C10]',
          )}
        >
          <Sun className="h-3.5 w-3.5" />
          日光瓷白
        </button>
        <button
          type="button"
          onClick={() => setMode('night')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300',
            !isDay ? 'bg-[#0A0C10] text-white shadow-xs' : 'text-[#0A0C10]/60 hover:text-[#0A0C10]',
          )}
        >
          <Moon className="h-3.5 w-3.5" />
          曜石深空
        </button>
      </div>

      {/* 双态实时材质预览板 */}
      <div
        className={cn(
          'flex items-center justify-between gap-5 rounded-2xl border px-5 py-3.5 transition-all duration-500',
          isDay
            ? 'border-white bg-white/90 text-[#0A0C10] shadow-[0_14px_34px_-16px_rgba(15,23,42,0.16),0_0_0_1px_rgba(10,12,16,0.06)]'
            : 'border-white/14 bg-[#0D1016] text-white shadow-[0_18px_40px_-16px_rgba(10,12,16,0.45)]',
        )}
      >
        <div className="flex flex-col">
          <span
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.16em]',
              isDay ? 'text-[#0A0C10]/45' : 'text-white/45',
            )}
          >
            {isDay ? 'DAYLIGHT PORCELAIN' : 'OBSIDIAN SPACE'}
          </span>
          <span className="mt-0.5 text-[13.5px] font-medium">
            {isDay ? '高透冷白液态玻璃 · 户外强光清晰读数' : '深空低眩光曜石面 · 夜间高对比护眼'}
          </span>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-full px-2.5 py-1 font-mono text-[10.5px] tabular',
            isDay ? 'bg-[#0A0C10]/[0.07] text-[#0A0C10]/80' : 'bg-white/12 text-white/85',
          )}
        >
          120Hz
        </span>
      </div>
    </div>
  );
}

export function BentoFeatures() {
  const features = siteConfig.features;
  const byId = (id: string) => features.find((feature) => feature.id === id)!;

  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <SectionHeader
          index="03 / 06"
          eyebrow="OPTICAL LAB"
          title={
            <>
              六台可触摸的光学仪器，
              <br className="hidden sm:block" />
              <span className="text-[#0A0C10]/42">每一处都在响应真实手感。</span>
            </>
          }
          description="不是静态卖点墙，而是六个可直接交互的微缩实验台：折射透镜、三态悬浮岛、1 米游标套模与双主题材质帘。"
          aside={
            <div className="glass-panel-soft flex items-center gap-2 rounded-full px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#0A0C10] animate-pulse-dot" />
              <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-[#0A0C10]/65">
                interactive specimen
              </span>
            </div>
          }
        />

        <StaggerIn
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12"
          stagger={0.06}
          distance={20}
          start="top 88%"
        >
          <div className="md:col-span-7">
            <BentoCard
              fig="FIG. 01"
              eyebrow={byId('agsl').eyebrow}
              title={byId('agsl').title}
              body={byId('agsl').body}
              className="min-h-[390px]"
              visualClassName="min-h-[225px]"
            >
              <AgslVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-5">
            <BentoCard
              fig="FIG. 02"
              eyebrow={byId('island').eyebrow}
              title={byId('island').title}
              body={byId('island').body}
              className="min-h-[390px]"
              visualClassName="min-h-[225px]"
            >
              <IslandVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              fig="FIG. 03"
              eyebrow={byId('builder').eyebrow}
              title={byId('builder').title}
              body={byId('builder').body}
              className="min-h-[365px]"
              visualClassName="min-h-[215px]"
            >
              <RadarVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              fig="FIG. 04"
              eyebrow={byId('roam').eyebrow}
              title={byId('roam').title}
              body={byId('roam').body}
              className="min-h-[365px]"
              visualClassName="min-h-[215px]"
            >
              <RoamVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              fig="FIG. 05"
              eyebrow={byId('privacy').eyebrow}
              title={byId('privacy').title}
              body={byId('privacy').body}
              className="min-h-[365px]"
              visualClassName="min-h-[215px]"
            >
              <PrivacyVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-12">
            <BentoCard
              fig="FIG. 06"
              eyebrow={byId('theme').eyebrow}
              title={byId('theme').title}
              body={byId('theme').body}
              className="min-h-[235px]"
              visualClassName="min-h-[115px]"
            >
              <ThemeVisual />
            </BentoCard>
          </div>
        </StaggerIn>

        <div className="mt-10 flex justify-center">
          <a
            href="#workflow"
            className="glass-panel-soft group inline-flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0A0C10]/70 transition-colors hover:bg-white hover:text-[#0A0C10]"
          >
            see it in motion
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
