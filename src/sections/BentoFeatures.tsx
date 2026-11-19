import { useEffect, useRef, useState } from 'react';
import {
  ArrowUpRight,
  Code2,
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
import GlassIcons from '@/components/reactbits/GlassIcons';
import GlassSurface from '@/components/reactbits/GlassSurface';
import TrueFocus from '@/components/reactbits/TrueFocus';
import { usePerformance } from '@/components/common/PerformanceContext';
import { Reveal, SectionHeader } from '@/components/common/SectionHeader';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/* 卡片基础壳                                                           */
/* ------------------------------------------------------------------ */

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
        'spotlight-surface group relative flex min-h-[330px] flex-col justify-end overflow-hidden rounded-[26px]',
        'border border-white/[0.075] bg-[linear-gradient(180deg,#0b0c11,#08090d)]',
        'transition-[border-color,transform] duration-500 hover:border-white/[0.16]',
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className={cn('relative z-0 min-h-0 flex-1', visualClassName)}>{children}</div>
      <div className="relative z-10 bg-gradient-to-t from-[#08090d] via-[#08090d]/92 to-transparent p-5 pt-12">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[9.5px] uppercase tracking-[0.22em] text-[#7DD3FC]/60">{eyebrow}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-white/12 to-transparent" />
        </div>
        <h3 className="mt-3 text-[17px] font-medium tracking-[-0.02em] text-white/92">{title}</h3>
        <p className="mt-2 text-[12.5px] leading-[1.8] text-white/42">{body}</p>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------ */
/* 1 · AGSL 液态玻璃                                                    */
/* ------------------------------------------------------------------ */

function AgslVisual() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(80%_100%_at_50%_0%,rgba(56,189,248,0.09),transparent_60%)]" />
      <svg viewBox="0 0 700 360" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
        {Array.from({ length: 15 }).map((_, index) => (
          <ellipse
            key={index}
            cx={330 + Math.sin(index * 1.7) * 14}
            cy={168 + Math.cos(index * 1.3) * 10}
            rx={54 + index * 21}
            ry={30 + index * 14}
            transform={`rotate(${-12 + Math.sin(index) * 4} 330 168)`}
            stroke={index === 4 ? 'rgba(125,211,252,0.35)' : 'rgba(255,255,255,0.085)'}
            strokeWidth={index === 4 ? 1.3 : 1}
          />
        ))}
        <path d="M0 300 C 140 250, 220 330, 340 292 S 560 240, 700 288" stroke="rgba(255,255,255,0.06)" />
        <path d="M0 320 C 150 282, 250 350, 360 316 S 570 268, 700 310" stroke="rgba(255,255,255,0.045)" />
      </svg>

      <div className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2">
        <GlassSurface
          width={250}
          height={92}
          borderRadius={46}
          borderWidth={0.09}
          brightness={54}
          opacity={0.9}
          blur={9}
          displace={1.2}
          backgroundOpacity={0.03}
          saturation={1.6}
          distortionScale={-140}
          redOffset={6}
          greenOffset={14}
          blueOffset={24}
          refraction
          mixBlendMode="screen"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-white/85">AGSL · LIQUID GLASS</span>
            <span className="font-mono text-[8.5px] uppercase tracking-[0.24em] text-white/45">RuntimeShader · SDF ROUND</span>
          </div>
        </GlassSurface>
      </div>

      <div className="absolute left-1/2 top-[34%] h-[180px] w-[360px] -translate-x-1/2 -translate-y-1/2 -z-10 rounded-full bg-[#38BDF8]/10 blur-[50px]" />

      <span className="absolute left-4 top-4 font-mono text-[9px] uppercase tracking-[0.24em] text-white/25">
        contour / refract
      </span>
      <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#7DD3FC]/70">
        <span className="h-1 w-1 rounded-full bg-[#38BDF8]" /> live
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2 · 悬浮岛                                                           */
/* ------------------------------------------------------------------ */

const islandEntries: AnimatedListEntry[] = siteConfig.islandMessages.map((message, index) => ({
  id: index,
  icon: (
    <span
      className={cn(
        'flex h-6 w-6 items-center justify-center rounded-full',
        message.tone === 'run' && 'bg-[#38BDF8]/14 text-[#7DD3FC]',
        message.tone === 'info' && 'bg-[#818CF8]/14 text-[#A5B4FC]',
        message.tone === 'warn' && 'bg-amber-300/10 text-amber-200/80',
      )}
    >
      {message.tone === 'run' ? <Radio className="h-3 w-3" /> : message.tone === 'info' ? <Waves className="h-3 w-3" /> : <Zap className="h-3 w-3" />}
    </span>
  ),
  title: message.text,
  description: message.tone === 'run' ? '正在进行' : message.tone === 'info' ? '状态流转' : '环境提示',
  meta: '刚刚',
}));

function IslandVisual() {
  const [items, setItems] = useState<AnimatedListEntry[]>(islandEntries);
  const cursor = useRef(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      cursor.current = (cursor.current + 1) % islandEntries.length;
      const next = islandEntries[cursor.current];
      setItems((prev) => [{ ...next, id: `${next.id}-${Date.now()}` }, ...prev].slice(0, 3));
    }, 2600);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden px-4 pt-4">
      <div className="absolute inset-0 bg-[radial-gradient(90%_80%_at_50%_0%,rgba(129,140,248,0.1),transparent_65%)]" />
      <div className="relative flex items-center justify-between rounded-full border border-white/12 bg-[#0d1016]/85 px-3 py-2 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/6">
            <span className="h-2.5 w-2.5 rounded-full border border-white/70" />
          </span>
          <div className="flex flex-col leading-none">
            <span className="text-[10.5px] text-white/88">云迹 · 模拟运行中</span>
            <span className="mt-0.5 font-mono text-[8px] text-white/38">5'40" · 0.85 / 3.00 km</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6">
            <Gauge className="h-2.5 w-2.5 text-white/65" />
          </span>
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6">
            <Crosshair className="h-2.5 w-2.5 text-white/45" />
          </span>
        </div>
      </div>

      <div className="relative mt-3">
        <AnimatedList
          items={items}
          renderItem={(item) => {
            if (typeof item === 'string') return item;
            return (
              <div className="flex w-full items-center gap-2.5">
                {item.icon}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[10.5px] text-white/72">{item.title}</div>
                </div>
                <span className="font-mono text-[8px] text-white/25">{item.meta}</span>
              </div>
            );
          }}
          animation="slide"
          stagger={0.06}
          showGradients={false}
          displayScrollbar={false}
          frame={false}
          theme="dark"
          accentColor="#38BDF8"
          gap={6}
          radius={12}
          maxHeight={190}
          className="island-list !bg-transparent"
        />
      </div>

      <span className="absolute bottom-3 right-4 font-mono text-[8.5px] uppercase tracking-[0.2em] text-white/22">
        cross-app · 3 states
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3 · 建圈器                                                           */
/* ------------------------------------------------------------------ */

function RadarVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_40%,rgba(56,189,248,0.08),transparent_65%)]" />
      <div className="relative aspect-square w-[68%] max-w-[190px]">
        <div className="absolute inset-0 rounded-full border border-white/10" />
        <div className="absolute inset-[14%] rounded-full border border-white/[0.08]" />
        <div className="absolute inset-[30%] rounded-full border border-white/[0.07]" />
        <div className="absolute inset-[46%] rounded-full border border-[#38BDF8]/25" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-full w-px bg-white/[0.07]" />
          <div className="absolute h-px w-full bg-white/[0.07]" />
        </div>
        <div className="absolute inset-0 overflow-hidden rounded-full">
          <div
            className="absolute inset-[-25%] animate-[spin_7s_linear_infinite] rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, rgba(56,189,248,0.32), rgba(56,189,248,0.06) 46deg, transparent 92deg)',
              maskImage: 'radial-gradient(circle, #000 62%, transparent 72%)',
            }}
          />
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono text-[24px] font-light leading-none tracking-[-0.03em] text-white/90 tabular">400<span className="ml-0.5 text-[10px] text-white/40">m</span></span>
          <span className="mt-1.5 font-mono text-[8.5px] uppercase tracking-[0.2em] text-[#7DD3FC]/70">0° 合焦</span>
        </div>
        <div className="absolute right-[6%] top-[12%] rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[8px] text-white/50">
          R400
        </div>
        <div className="absolute bottom-[9%] left-[2%] rounded-full border border-white/10 bg-black/40 px-2 py-0.5 font-mono text-[8px] text-white/50">
          ±1m
        </div>
      </div>
      <div className="absolute inset-x-5 bottom-5 flex items-end justify-between font-mono text-[8px] uppercase tracking-[0.18em] text-white/22">
        <span>vernier</span>
        <span>clockwise</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4 · 自由漫游                                                         */
/* ------------------------------------------------------------------ */

function RoamVisual() {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 48, y: 52 });

  return (
    <div
      ref={ref}
      className="absolute inset-0 overflow-hidden"
      onPointerMove={(event) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        setPos({
          x: 46 + ((event.clientX - rect.left) / rect.width - 0.5) * 10,
          y: 50 + ((event.clientY - rect.top) / rect.height - 0.5) * 10,
        });
      }}
    >
      <div className="absolute inset-0 bg-[#0a0c11]" />
      <svg viewBox="0 0 400 300" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice">
        <g stroke="rgba(255,255,255,0.055)" strokeWidth="1">
          {Array.from({ length: 9 }).map((_, index) => (
            <path key={`h${index}`} d={`M-20 ${20 + index * 34} L 420 ${6 + index * 34}`} />
          ))}
          {Array.from({ length: 11 }).map((_, index) => (
            <path key={`v${index}`} d={`M${-10 + index * 38} -20 L ${26 + index * 38} 320`} />
          ))}
        </g>
        <path d="M-20 210 C 80 176, 150 244, 240 206 S 350 162, 420 196" stroke="rgba(255,255,255,0.16)" strokeWidth="5" strokeLinecap="round" />
        <path d="M-20 210 C 80 176, 150 244, 240 206 S 350 162, 420 196" stroke="rgba(255,255,255,0.28)" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M110 -20 C 128 74, 96 150, 132 226 S 156 286, 138 320" stroke="rgba(255,255,255,0.12)" strokeWidth="3.5" strokeLinecap="round" />
        <path d="M300 -20 C 282 60, 322 130, 296 206 S 268 280, 292 320" stroke="rgba(255,255,255,0.1)" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M24 262 C 92 240, 140 268, 196 246" stroke="rgba(56,189,248,0.45)" strokeWidth="1.2" strokeDasharray="3 5" />
      </svg>

      <div
        className="absolute z-10 -translate-x-1/2 -translate-y-1/2 transition-transform duration-500 ease-out"
        style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      >
        <span className="absolute inset-0 -m-5 rounded-full border border-[#38BDF8]/25" />
        <span className="absolute inset-0 -m-2.5 rounded-full border border-[#38BDF8]/35" />
        <span className="relative block h-2 w-2 rounded-full bg-[#EAFBFE] shadow-[0_0_14px_4px_rgba(56,189,248,0.55)]" />
      </div>

      <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[0.18em] text-white/45 backdrop-blur">
        free roam · 300m
      </div>

      <div className="absolute inset-x-4 bottom-3">
        <div className="rounded-xl border border-white/8 bg-black/35 px-2.5 py-2 backdrop-blur-md">
          <DecryptedText
            text="39.90152° N, 116.40685° E"
            animateOn="view"
            loop
            loopDelay={2600}
            speed={34}
            maxIterations={14}
            revealDirection="start"
            useOriginalCharsOnly
            characters="0123456789°NESW., "
            className="font-mono text-[9px] tracking-[0.04em] text-[#A1A1AA]"
            encryptedClassName="text-[#38BDF8]/60"
            scrambleColor="#7DD3FC"
          />
          <div className="mt-1 flex items-center justify-between font-mono text-[8px] uppercase tracking-[0.16em] text-white/25">
            <span>walk 1.4 m/s</span>
            <span>smooth · 300m</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5 · 隐私                                                             */
/* ------------------------------------------------------------------ */

function PrivacyVisual() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-hidden px-4">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_45%,rgba(56,189,248,0.07),transparent_70%)]" />
      <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
        <ShieldCheck className="h-5 w-5 text-[#7DD3FC]/80" />
      </span>
      <TrueFocus
        sentence="无账号 无上传 纯本地"
        separator=" "
        manualMode={false}
        focusStyle="brackets"
        order="sequential"
        easing="smooth"
        blurAmount={4}
        focusScale={1.08}
        borderColor="#38BDF8"
        glowColor="rgba(56,189,248,0.35)"
        animationDuration={0.8}
        pauseBetweenAnimations={1.1}
        cornerSize={7}
        borderWidth={1.4}
        unfocusedOpacity={0.32}
      />
      <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-white/22">local only · zero telemetry</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6 · 双生主题                                                         */
/* ------------------------------------------------------------------ */

function ThemeVisual() {
  const { isFlagship } = usePerformance();
  const icons = [
    { icon: <Sun className="h-5 w-5" />, label: '日光白', color: '#E2E8F0' },
    { icon: <Moon className="h-5 w-5" />, label: '曜石黑', color: '#818CF8' },
    { icon: <Gauge className="h-5 w-5" />, label: '120Hz', color: '#38BDF8' },
    { icon: <Code2 className="h-5 w-5" />, label: '开源', color: '#A5B4FC' },
  ];

  if (!isFlagship) {
    return (
      <div className="flex h-full items-center justify-end gap-3 pr-6">
        {icons.map((item) => (
          <span
            key={item.label}
            className="flex h-14 w-14 items-center justify-center rounded-[18px] border border-white/12 bg-white/[0.05] text-white/70"
          >
            {item.icon}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full items-center justify-end pr-2 sm:pr-5">
      <ViewportLazyMount className="h-[190px] w-[300px]" unmountDelay={600}>
        <GlassIcons
          items={icons}
          size={58}
          gap={18}
          columns={4}
          roundness={0.42}
          refraction={0.55}
          bevel={0.4}
          dispersion={0.3}
          frost={0.16}
          shine={0.65}
          tint="#9AA6B8"
          tintOpacity={0.22}
          iconColor="rgba(245,245,247,0.85)"
          plate="tilt"
          tilt={14}
          spread={0.5}
          hover="float"
          parallax={0.4}
          labels="hover"
          intro
          theme="dark"
        />
      </ViewportLazyMount>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function BentoFeatures() {
  const features = siteConfig.features;
  const byId = (id: string) => features.find((feature) => feature.id === id)!;

  return (
    <section id="features" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(129,140,248,0.045),transparent_65%)]" />
      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <SectionHeader
          index="03"
          eyebrow="CORE OPTICS"
          title={
            <>
              六块可玩的光学卡片，
              <br className="hidden sm:block" />
              <span className="text-white/42">每一块都能伸手进去。</span>
            </>
          }
          description="不是功能清单，而是六个可以触摸的物理材质。悬停、拖拽、解码、合焦——所有交互都在为「真实感」服务。"
          aside={
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse-dot" />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">interactive</span>
            </div>
          }
        />

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-12 md:gap-4">
          <Reveal className="md:col-span-7" y={30}>
            <BentoCard
              eyebrow={byId('agsl').eyebrow}
              title={byId('agsl').title}
              body={byId('agsl').body}
              className="min-h-[380px]"
              visualClassName="min-h-[240px]"
            >
              <AgslVisual />
            </BentoCard>
          </Reveal>

          <Reveal className="md:col-span-5" delay={0.08} y={30}>
            <BentoCard
              eyebrow={byId('island').eyebrow}
              title={byId('island').title}
              body={byId('island').body}
              className="min-h-[380px]"
              visualClassName="min-h-[240px]"
            >
              <IslandVisual />
            </BentoCard>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.04}>
            <BentoCard
              eyebrow={byId('builder').eyebrow}
              title={byId('builder').title}
              body={byId('builder').body}
              className="min-h-[350px]"
              visualClassName="min-h-[210px]"
            >
              <RadarVisual />
            </BentoCard>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.1}>
            <BentoCard
              eyebrow={byId('roam').eyebrow}
              title={byId('roam').title}
              body={byId('roam').body}
              className="min-h-[350px]"
              visualClassName="min-h-[210px]"
            >
              <RoamVisual />
            </BentoCard>
          </Reveal>

          <Reveal className="md:col-span-4" delay={0.16}>
            <BentoCard
              eyebrow={byId('privacy').eyebrow}
              title={byId('privacy').title}
              body={byId('privacy').body}
              className="min-h-[350px]"
              visualClassName="min-h-[210px]"
            >
              <PrivacyVisual />
            </BentoCard>
          </Reveal>

          <Reveal className="md:col-span-12" delay={0.05}>
            <BentoCard
              eyebrow={byId('theme').eyebrow}
              title={byId('theme').title}
              body={byId('theme').body}
              className="min-h-[240px] md:min-h-[230px]"
              visualClassName="min-h-[120px]"
            >
              <div className="grid h-full grid-cols-1 items-center md:grid-cols-[1fr_auto]">
                <div className="hidden h-full items-center justify-start pl-6 md:flex">
                  <div className="flex items-center gap-6">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-[#F5F5F7] text-[#0B0F14] shadow-[0_16px_40px_-18px_rgba(255,255,255,0.35)]">
                      <Sun className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">day</span>
                    <span className="h-8 w-px bg-white/10" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/25">night</span>
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/12 bg-[#0B0F14] text-white/80 shadow-[0_16px_40px_-18px_rgba(0,0,0,0.9)]">
                      <Moon className="h-5 w-5" />
                    </span>
                  </div>
                </div>
                <ThemeVisual />
              </div>
            </BentoCard>
          </Reveal>
        </div>

        <div className="mt-8 flex items-center justify-center">
          <a
            href="#workflow"
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-5 py-2.5 font-mono text-[10.5px] uppercase tracking-[0.18em] text-white/45 transition-colors hover:border-white/20 hover:text-white/75"
          >
            see it in motion
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </section>
  );
}
