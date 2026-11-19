import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Crosshair,
  Gauge,
  Moon,
  Radio,
  ShieldCheck,
  Sun,
  Waves,
  Zap,
} from 'lucide-react';
import AnimatedList, { type AnimatedListEntry } from '@/components/reactbits/AnimatedList';
import DecryptedText from '@/components/reactbits/DecryptedText';
import GlassSurface from '@/components/reactbits/GlassSurface';
import { usePerformance } from '@/components/common/PerformanceContext';
import { SectionHeader } from '@/components/common/SectionHeader';
import { StaggerIn } from '@/motion/StaggerIn';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

function BentoCard({
  children,
  className,
  eyebrow,
  title,
  body,
  visualClassName,
}: {
  children: React.ReactNode;
  className?: string;
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
        'spotlight-surface group relative flex min-h-[336px] flex-col justify-end overflow-hidden rounded-[24px]',
        'border border-white/[0.085] bg-[linear-gradient(180deg,#0d0e13,#090a0e)]',
        'transition-[border-color] duration-300 hover:border-white/[0.18]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      <div className={cn('relative z-0 min-h-0 flex-1', visualClassName)}>{children}</div>
      <div className="relative z-10 bg-gradient-to-t from-[#090a0e] via-[#090a0e]/95 to-transparent p-6 pt-12">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/50">{eyebrow}</span>
        <h3 className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-[#F5F5F7]">{title}</h3>
        <p className="mt-2 text-[13.5px] leading-[1.7] text-white/60">{body}</p>
      </div>
    </article>
  );
}

function AgslVisual() {
  const { isFlagship } = usePerformance();

  return (
    <div className="absolute inset-0 overflow-hidden">
      <svg
        viewBox="0 0 700 360"
        className="absolute inset-0 h-full w-full opacity-90"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        {Array.from({ length: 12 }).map((_, index) => (
          <ellipse
            key={index}
            cx={340 + Math.sin(index * 1.6) * 10}
            cy={162 + Math.cos(index * 1.2) * 8}
            rx={62 + index * 24}
            ry={32 + index * 15}
            transform={`rotate(${-10 + Math.sin(index) * 3} 340 162)`}
            stroke={index === 4 ? 'rgba(255,255,255,0.28)' : 'rgba(255,255,255,0.075)'}
            strokeWidth={index === 4 ? 1.2 : 1}
          />
        ))}
      </svg>

      <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2">
        {isFlagship ? (
          <ViewportLazyMount className="h-[88px] w-[252px]" rootMargin="200px 0px" unmountDelay={500}>
            <GlassSurface
              width={252}
              height={88}
              borderRadius={44}
              borderWidth={0.08}
              brightness={56}
              opacity={0.92}
              blur={10}
              displace={1.0}
              backgroundOpacity={0.04}
              saturation={1.35}
              distortionScale={-120}
              redOffset={4}
              greenOffset={10}
              blueOffset={16}
              refraction
              mixBlendMode="screen"
            >
              <div className="flex flex-col items-center gap-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/92">
                  AGSL · LIQUID GLASS
                </span>
                <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
                  RuntimeShader · 120Hz
                </span>
              </div>
            </GlassSurface>
          </ViewportLazyMount>
        ) : (
          <div className="glass-panel flex h-[88px] w-[252px] flex-col items-center justify-center gap-1 rounded-full">
            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-white/92">
              AGSL · LIQUID GLASS
            </span>
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/55">
              RuntimeShader · 120Hz
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

const islandEntries: AnimatedListEntry[] = siteConfig.islandMessages.map((message, index) => ({
  id: index,
  icon: (
    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.08] text-white/80">
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

function IslandVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [items, setItems] = useState<AnimatedListEntry[]>(islandEntries.slice(0, 3));
  const cursor = useRef(0);

  // 仅在卡片进入视口时运行轮播，离屏零 CPU 占用
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0.15,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const timer = window.setInterval(() => {
      cursor.current = (cursor.current + 1) % islandEntries.length;
      const next = islandEntries[cursor.current];
      setItems((prev) => [{ ...next, id: `${next.id}-${Date.now()}` }, ...prev].slice(0, 3));
    }, 3600);
    return () => window.clearInterval(timer);
  }, [inView]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden px-5 pt-5">
      <div className="relative flex items-center justify-between rounded-full border border-white/12 bg-white/[0.05] px-3.5 py-2 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
            <span className="h-2 w-2 rounded-full bg-white/85" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[11.5px] font-medium text-white/90">云迹 · 模拟运行中</span>
            <span className="mt-1 font-mono text-[9.5px] text-white/50 tabular">5&apos;40&quot; · 0.85 / 3.00 km</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07]">
            <Gauge className="h-3 w-3 text-white/75" />
          </span>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/[0.07]">
            <Crosshair className="h-3 w-3 text-white/60" />
          </span>
        </div>
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
                  <div className="truncate text-[11.5px] text-white/80">{item.title}</div>
                </div>
                <span className="font-mono text-[9.5px] text-white/40">{item.meta}</span>
              </div>
            );
          }}
          animation="slide"
          stagger={0.05}
          showGradients={false}
          displayScrollbar={false}
          frame={false}
          theme="dark"
          accentColor="#E4E4E7"
          gap={6}
          radius={12}
          maxHeight={185}
          className="island-list !bg-transparent"
        />
      </div>
    </div>
  );
}

function RadarVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="relative aspect-square w-[64%] max-w-[180px]">
        <div className="absolute inset-0 rounded-full border border-white/12" />
        <div className="absolute inset-[16%] rounded-full border border-white/[0.09]" />
        <div className="absolute inset-[34%] rounded-full border border-white/[0.08]" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-white/[0.07]" />
          <div className="absolute h-px w-full bg-white/[0.07]" />
        </div>
        {/* 极慢扫描，降低视觉干扰 */}
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-[-25%] animate-[spin_10s_linear_infinite] rounded-full"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(255,255,255,0.22), rgba(255,255,255,0.04) 44deg, transparent 86deg)',
              maskImage: 'radial-gradient(circle, #000 62%, transparent 72%)',
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[24px] font-medium leading-none tracking-[-0.03em] text-white tabular">
            400<span className="ml-0.5 text-[11px] text-white/50">m</span>
          </span>
          <span className="mt-1.5 font-mono text-[9.5px] tracking-[0.14em] text-white/60">±1m 合焦</span>
        </div>
      </div>
    </div>
  );
}

/** 零 React 重渲染：指针移动直接驱动 GPU translate3d */
function RoamVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const box = containerRef.current;
    const dot = dotRef.current;
    if (!box || !dot) return;
    const rect = box.getBoundingClientRect();
    const dx = ((event.clientX - rect.left) / rect.width - 0.5) * 28;
    const dy = ((event.clientY - rect.top) / rect.height - 0.5) * 22;
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
      className="absolute inset-0 overflow-hidden"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <svg
        viewBox="0 0 400 300"
        className="absolute inset-0 h-full w-full"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="rgba(255,255,255,0.05)" strokeWidth="1">
          {Array.from({ length: 8 }).map((_, index) => (
            <path key={`h${index}`} d={`M-20 ${24 + index * 36} L 420 ${10 + index * 36}`} />
          ))}
          {Array.from({ length: 10 }).map((_, index) => (
            <path key={`v${index}`} d={`M${-10 + index * 42} -20 L ${24 + index * 42} 320`} />
          ))}
        </g>
        <path
          d="M-20 206 C 80 176, 150 238, 240 202 S 350 162, 420 194"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M24 256 C 96 232, 146 258, 206 238"
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="1.2"
          strokeDasharray="3 5"
        />
      </svg>

      <div
        ref={dotRef}
        className="pointer-events-none absolute left-1/2 top-[44%] z-10 transition-transform duration-300 ease-out will-change-transform"
        style={{ transform: 'translate3d(-50%, -50%, 0)' }}
      >
        <span className="absolute inset-0 -m-5 rounded-full border border-white/15" />
        <span className="absolute inset-0 -m-2.5 rounded-full border border-white/30" />
        <span className="relative block h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_16px_3px_rgba(255,255,255,0.45)]" />
      </div>

      <div className="absolute inset-x-4 bottom-3">
        <div className="rounded-xl border border-white/10 bg-black/45 px-3 py-2 backdrop-blur-md">
          <DecryptedText
            text="39.90152° N, 116.40685° E"
            animateOn="hover"
            loop={false}
            speed={28}
            maxIterations={10}
            revealDirection="start"
            useOriginalCharsOnly
            characters="0123456789°NESW., "
            className="font-mono text-[10.5px] tracking-[0.04em] text-white/80"
            encryptedClassName="text-white/40"
          />
          <div className="mt-1 flex items-center justify-between font-mono text-[9.5px] text-white/45">
            <span>1.4 m/s 拟真步速</span>
            <span>300m 半径</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 去掉循环跳框的 TrueFocus，用安静、高可信度的架构徽章表达隐私承诺 */
function PrivacyVisual() {
  const pillars = ['无账号体系', '无遥测上报', '纯本地运行'];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-5">
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/14 bg-white/[0.06] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]">
        <ShieldCheck className="h-5 w-5 text-white/90" />
      </span>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {pillars.map((label) => (
          <span
            key={label}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[12px] font-medium text-white/80 transition-colors duration-300 group-hover:border-white/20 group-hover:text-white"
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 用真实可点击的「日光白 / 曜石黑」主题切换取代耗 GPU 的 WebGL GlassIcons */
function ThemeVisual() {
  const [mode, setMode] = useState<'night' | 'day'>('night');
  const isDay = mode === 'day';

  return (
    <div className="flex h-full flex-col justify-between gap-4 p-6 md:flex-row md:items-center">
      <div className="flex items-center gap-2 self-start rounded-full border border-white/12 bg-white/[0.04] p-1">
        <button
          type="button"
          onClick={() => setMode('day')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300',
            isDay ? 'bg-[#F5F5F7] text-[#090A0E] shadow-sm' : 'text-white/60 hover:text-white',
          )}
        >
          <Sun className="h-3.5 w-3.5" />
          日光白
        </button>
        <button
          type="button"
          onClick={() => setMode('night')}
          className={cn(
            'flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-all duration-300',
            !isDay ? 'bg-white/[0.14] text-white shadow-sm' : 'text-white/60 hover:text-white',
          )}
        >
          <Moon className="h-3.5 w-3.5" />
          曜石黑
        </button>
      </div>

      {/* 实时预览条 */}
      <div
        className={cn(
          'flex items-center gap-4 rounded-2xl border px-4 py-3 transition-all duration-500',
          isDay
            ? 'border-black/10 bg-[#F4F5F7] text-[#0B0C10] shadow-[0_16px_40px_-16px_rgba(255,255,255,0.35)]'
            : 'border-white/12 bg-white/[0.05] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]',
        )}
      >
        <div className="flex flex-col">
          <span className={cn('font-mono text-[10px] uppercase tracking-[0.14em]', isDay ? 'text-black/45' : 'text-white/45')}>
            {isDay ? 'DAYLIGHT GLASS' : 'OBSIDIAN GLASS'}
          </span>
          <span className="mt-0.5 text-[13px] font-medium">
            {isDay ? '高透冷白折射 · 户外强光可读' : '深空低眩光 · 夜间护眼高对比'}
          </span>
        </div>
        <span
          className={cn(
            'rounded-full px-2.5 py-1 font-mono text-[10.5px] tabular',
            isDay ? 'bg-black/[0.07] text-black/70' : 'bg-white/[0.1] text-white/80',
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
          index="03"
          eyebrow="CORE OPTICS"
          title={
            <>
              六项核心光学与轨迹能力，
              <br className="hidden sm:block" />
              <span className="text-white/50">每一处都为真实手感打磨。</span>
            </>
          }
          description="从 120Hz 边缘折射、跨应用悬浮岛到 1 米级游标套模，全部以纯本地原生渲染实现。"
        />

        <StaggerIn
          className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-12"
          stagger={0.06}
          distance={20}
          start="top 88%"
        >
          <div className="md:col-span-7">
            <BentoCard
              eyebrow={byId('agsl').eyebrow}
              title={byId('agsl').title}
              body={byId('agsl').body}
              className="min-h-[380px]"
              visualClassName="min-h-[220px]"
            >
              <AgslVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-5">
            <BentoCard
              eyebrow={byId('island').eyebrow}
              title={byId('island').title}
              body={byId('island').body}
              className="min-h-[380px]"
              visualClassName="min-h-[220px]"
            >
              <IslandVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              eyebrow={byId('builder').eyebrow}
              title={byId('builder').title}
              body={byId('builder').body}
              className="min-h-[350px]"
              visualClassName="min-h-[195px]"
            >
              <RadarVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              eyebrow={byId('roam').eyebrow}
              title={byId('roam').title}
              body={byId('roam').body}
              className="min-h-[350px]"
              visualClassName="min-h-[195px]"
            >
              <RoamVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-4">
            <BentoCard
              eyebrow={byId('privacy').eyebrow}
              title={byId('privacy').title}
              body={byId('privacy').body}
              className="min-h-[350px]"
              visualClassName="min-h-[195px]"
            >
              <PrivacyVisual />
            </BentoCard>
          </div>

          <div className="md:col-span-12">
            <BentoCard
              eyebrow={byId('theme').eyebrow}
              title={byId('theme').title}
              body={byId('theme').body}
              className="min-h-[230px]"
              visualClassName="min-h-[110px]"
            >
              <ThemeVisual />
            </BentoCard>
          </div>
        </StaggerIn>

        <div className="mt-10 flex justify-center">
          <a
            href="#workflow"
            className="group inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-5 py-2.5 text-[12.5px] font-medium text-white/75 transition-colors hover:border-white/25 hover:text-white"
          >
            查看完整工作流
            <ArrowUpRight className="h-3.5 w-3.5 opacity-70 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
