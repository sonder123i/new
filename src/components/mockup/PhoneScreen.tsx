import type { CSSProperties, ReactNode } from 'react';
import {
  Activity,
  BatteryFull,
  ChevronRight,
  CircleDot,
  Crosshair,
  Footprints,
  Gauge,
  Layers,
  Moon,
  Navigation,
  Pause,
  Play,
  Plus,
  Radio,
  RotateCcw,
  Settings2,
  Shield,
  Signal,
  Square,
  Sun,
  Wifi,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type ScreenVariant = 'home' | 'run-dark' | 'roam' | 'builder' | 'island' | 'settings';

const ICE = '#38BDF8';
const INDIGO = '#818CF8';
const BRAND_ICON = `${import.meta.env.BASE_URL}brand-icon-192.png`;

const iconStyle = (size: number): CSSProperties => ({ width: `${size}cqw`, height: `${size}cqw`, strokeWidth: 1.6 });

/* ------------------------------------------------------------------ */
/* 通用外壳                                                             */
/* ------------------------------------------------------------------ */

function StatusBar({ dark = false, time = '09:41' }: { dark?: boolean; time?: string }) {
  const color = dark ? 'rgba(10,14,20,0.82)' : 'rgba(245,245,247,0.9)';
  return (
    <div className="relative z-30 flex items-center justify-between px-[7cqw] pt-[3.1cqw]" style={{ color }}>
      <span className="font-mono text-[3.4cqw] font-medium tracking-[0.04em] tabular">{time}</span>
      <div className="flex items-center gap-[1.4cqw]">
        <Signal style={iconStyle(3.6)} />
        <Wifi style={iconStyle(3.8)} />
        <BatteryFull style={iconStyle(4.4)} />
      </div>
    </div>
  );
}

function DynamicIsland() {
  return (
    <div className="absolute left-1/2 top-[2.2cqw] z-40 flex h-[7cqw] w-[27cqw] -translate-x-1/2 items-center justify-end rounded-full bg-black pr-[2cqw] shadow-[0_2px_10px_rgba(0,0,0,0.45)]">
      <span className="h-[2.1cqw] w-[2.1cqw] rounded-full bg-[#0f1a24] ring-[0.5cqw] ring-[#101317]">
        <span className="block h-full w-full rounded-full bg-[radial-gradient(circle_at_35%_30%,#1e3a4f,#05070a)]" />
      </span>
    </div>
  );
}

function HomeIndicator({ dark = false }: { dark?: boolean }) {
  return (
    <div className="absolute bottom-[1.5cqw] left-1/2 z-40 h-[1.1cqw] w-[34%] -translate-x-1/2 rounded-full" style={{ background: dark ? 'rgba(10,14,20,0.35)' : 'rgba(255,255,255,0.5)' }} />
  );
}

function ScreenShell({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn('relative isolate h-full w-full overflow-hidden', className)}
      style={{ containerType: 'inline-size', fontFamily: 'var(--font-sans)', ...style }}
    >
      <DynamicIsland />
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 地图与操场图形                                                        */
/* ------------------------------------------------------------------ */

const ROADS = [
  'M-10 118 C 60 96, 118 132, 178 104 S 292 76, 400 108',
  'M-10 206 C 70 186, 130 214, 210 190 S 320 168, 400 196',
  'M-10 306 C 80 284, 150 322, 226 296 S 330 272, 400 300',
  'M62 -10 C 78 70, 52 148, 84 226 S 104 330, 70 420',
  'M168 -10 C 182 80, 156 156, 190 240 S 204 344, 176 420',
  'M282 -10 C 262 82, 300 160, 268 244 S 250 350, 286 420',
];

function MapBase({ dark = false }: { dark?: boolean }) {
  const land = dark ? '#0A0E13' : '#EDEFF3';
  const water = dark ? '#07131C' : '#DCE7F1';
  const road = dark ? '#20262E' : '#FFFFFF';
  const roadEdge = dark ? '#151A21' : '#D8DEE6';
  return (
    <div className="absolute inset-0" style={{ background: land }}>
      <div
        className="absolute inset-0"
        style={{
          background: dark
            ? `radial-gradient(120% 60% at 70% 18%, rgba(56,189,248,0.12), transparent 60%), radial-gradient(80% 50% at 20% 85%, rgba(129,140,248,0.08), transparent 65%)`
            : `radial-gradient(120% 60% at 72% 16%, rgba(255,255,255,0.9), transparent 62%), radial-gradient(90% 60% at 18% 88%, rgba(206,220,234,0.65), transparent 70%)`,
        }}
      />
      <svg viewBox="0 0 390 844" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="water" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={water} />
            <stop offset="100%" stopColor={dark ? '#0A1A26' : '#D2E2EF'} />
          </linearGradient>
        </defs>
        <path d="M262 0 C 300 66, 246 120, 292 178 C 340 238, 300 292, 390 330 L 390 0 Z" fill="url(#water)" opacity={dark ? 0.9 : 0.85} />
        <path d="M-20 560 C 70 520, 120 596, 206 566 C 280 540, 330 590, 410 570 L 410 844 L -20 844 Z" fill={dark ? '#0B141C' : '#E3EAF1'} opacity="0.85" />
        {ROADS.map((d, index) => (
          <g key={d}>
            <path d={d} fill="none" stroke={roadEdge} strokeWidth={index < 3 ? 11 : 8} strokeLinecap="round" opacity="0.9" />
            <path d={d} fill="none" stroke={road} strokeWidth={index < 3 ? 7 : 4.5} strokeLinecap="round" />
          </g>
        ))}
        <g opacity={dark ? 0.5 : 0.55} stroke={dark ? '#2C3540' : '#C9D3DE'} strokeWidth="1" fill="none">
          {Array.from({ length: 10 }).map((_, row) => (
            <path key={row} d={`M-20 ${470 + row * 34} L 410 ${440 + row * 34}`} strokeDasharray="2 8" />
          ))}
        </g>
      </svg>
    </div>
  );
}

function Track({ dark = false, glow = false }: { dark?: boolean; glow?: boolean }) {
  const line = dark ? 'rgba(255,255,255,0.3)' : 'rgba(19,26,34,0.28)';
  const fill = dark ? 'rgba(56,189,248,0.06)' : 'rgba(56,189,248,0.07)';
  return (
    <svg viewBox="0 0 320 230" className="absolute left-1/2 top-1/2 w-[86%] -translate-x-1/2 -translate-y-1/2" fill="none">
      <defs>
        <filter id="trackGlow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <rect x="42" y="48" width="236" height="134" rx="67" fill={fill} stroke={line} strokeWidth="1.2" />
      {[0, 1, 2, 3, 4, 5].map((lane) => (
        <rect
          key={lane}
          x={42 + lane * 5.6}
          y={48 + lane * 5.6}
          width={236 - lane * 11.2}
          height={134 - lane * 11.2}
          rx={67 - lane * 5.6}
          stroke={lane === 1 && glow ? ICE : line}
          strokeWidth={lane === 1 && glow ? 2 : 1}
          opacity={lane === 1 && glow ? 0.95 : 0.7}
        />
      ))}
      {glow && (
        <>
          <rect x="47.6" y="53.6" width="224.8" height="122.8" rx="61.4" stroke={ICE} strokeWidth="4" opacity="0.35" filter="url(#trackGlow)" />
          <rect x="47.6" y="53.6" width="224.8" height="122.8" rx="61.4" stroke="#EAFBFE" strokeWidth="2" opacity="0.95" />
        </>
      )}
      <line x1="160" y1="48" x2="160" y2="182" stroke={line} strokeWidth="1" strokeDasharray="4 5" />
    </svg>
  );
}

function TrailLoop() {
  return (
    <svg viewBox="0 0 390 844" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id="trail" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#EAFBFE" />
          <stop offset="48%" stopColor={ICE} />
          <stop offset="100%" stopColor={INDIGO} />
        </linearGradient>
        <filter id="trailGlow">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      <path
        d="M126 604 C 84 556, 88 470, 138 436 C 190 400, 258 418, 276 470 C 296 528, 250 578, 202 578 C 158 578, 134 546, 146 512"
        fill="none"
        stroke={ICE}
        strokeWidth="11"
        opacity="0.28"
        strokeLinecap="round"
        filter="url(#trailGlow)"
      />
      <path
        d="M126 604 C 84 556, 88 470, 138 436 C 190 400, 258 418, 276 470 C 296 528, 250 578, 202 578 C 158 578, 134 546, 146 512"
        fill="none"
        stroke="url(#trail)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      <circle cx="146" cy="512" r="15" fill={ICE} opacity="0.18" />
      <circle cx="146" cy="512" r="7" fill="#EAFBFE" />
      <circle cx="146" cy="512" r="3.4" fill={ICE} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 六个界面                                                             */
/* ------------------------------------------------------------------ */

function HomeScreen() {
  return (
    <ScreenShell style={{ background: 'linear-gradient(180deg,#F7F9FC 0%,#EEF2F7 46%,#E5EBF2 100%)' }}>
      <div className="absolute inset-0 opacity-70" style={{ background: 'radial-gradient(120% 70% at 84% 4%, #FFFFFF, transparent 55%)' }} />
      <div className="absolute inset-x-0 top-0 h-[46%] opacity-[0.5] grid-floor" />
      <StatusBar dark />

      <div className="relative z-20 px-[7cqw] pt-[6cqw]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[2.2cqw]">
            <div className="relative h-[11cqw] w-[11cqw] overflow-hidden rounded-[3.4cqw] shadow-[0_6px_18px_rgba(11,15,20,0.22)]">
              <img src={BRAND_ICON} alt="" className="h-full w-full object-contain" draggable={false} />
            </div>
            <div>
              <div className="text-[4.6cqw] font-semibold leading-none tracking-[-0.02em] text-[#0B0F14]">云迹</div>
              <div className="mt-[1cqw] font-mono text-[2.6cqw] uppercase tracking-[0.18em] text-[#0B0F14]/45">CLOUDTRACE</div>
            </div>
          </div>
          <div className="flex items-center gap-[2.4cqw]">
            <span className="rounded-full bg-white/80 px-[2.6cqw] py-[1.3cqw] font-mono text-[2.6cqw] text-[#0B0F14]/60 shadow-[0_2px_10px_rgba(11,15,20,0.06)]">22° 晴</span>
            <Settings2 style={iconStyle(5.2)} className="text-[#0B0F14]/55" />
          </div>
        </div>

        <div className="mt-[7cqw] flex items-end justify-between">
          <div>
            <div className="text-[9.4cqw] font-semibold leading-[1.02] tracking-[-0.045em] text-[#0B0F14]">
              自动跑圈
            </div>
            <div className="mt-[1.8cqw] text-[3.5cqw] text-[#0B0F14]/52">选择操场，长按发车</div>
          </div>
          <div className="flex flex-col items-end font-mono text-[2.5cqw] leading-[1.6] text-[#0B0F14]/38">
            <span>AGSL · ON</span>
            <span>120 HZ</span>
          </div>
        </div>
      </div>

      <div className="relative z-20 mx-[5.6cqw] mt-[5.4cqw] rounded-[7cqw] border border-white/85 bg-white/62 p-[2.4cqw] shadow-[0_20px_50px_-20px_rgba(16,24,40,0.28)] backdrop-blur-xl">
        <div className="relative aspect-[320/230] overflow-hidden rounded-[5.2cqw] bg-[#F1F5F9]">
          <div className="absolute inset-0 opacity-40" style={{ background: 'linear-gradient(140deg,#FFFFFF,#DCE6F0)' }} />
          <Track />
          <div className="absolute left-[3.4cqw] top-[3.2cqw] rounded-full bg-[#0B0F14] px-[2.6cqw] py-[1.2cqw] font-mono text-[2.4cqw] tracking-[0.06em] text-white">
            400M
          </div>
          <div className="absolute bottom-[3cqw] right-[3.2cqw] flex items-center gap-[1.2cqw] rounded-full bg-white/85 px-[2.4cqw] py-[1.1cqw] font-mono text-[2.3cqw] text-[#0B0F14]/70 backdrop-blur">
            <CheckDot /> 1m 游标已校准
          </div>
        </div>
        <div className="flex items-center justify-between px-[1.6cqw] pb-[1.2cqw] pt-[3.2cqw]">
          <div>
            <div className="text-[4.2cqw] font-medium tracking-[-0.02em] text-[#0B0F14]">400m 标准田径场</div>
            <div className="mt-[0.9cqw] font-mono text-[2.7cqw] text-[#0B0F14]/42">第 1 跑道 · 顺时针 · 5'40"/km</div>
          </div>
          <ChevronRight style={iconStyle(5)} className="text-[#0B0F14]/30" />
        </div>
      </div>

      <div className="relative z-20 mt-[5cqw] flex flex-col items-center">
        <div className="relative flex h-[34cqw] w-[34cqw] items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-[#38BDF8]/25 animate-sonar" />
          <span className="absolute inset-0 rounded-full border border-[#38BDF8]/20 animate-sonar [animation-delay:1.1s]" />
          <span className="absolute inset-[3cqw] rounded-full border border-[#38BDF8]/25 animate-sonar [animation-delay:2.2s]" />
          <div className="relative flex h-[26cqw] w-[26cqw] flex-col items-center justify-center rounded-full bg-[#0B0F14] shadow-[0_16px_40px_-8px_rgba(11,15,20,0.55)]">
            <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_210deg,rgba(56,189,248,0.55),transparent_28%,transparent_72%,rgba(129,140,248,0.45))] opacity-70" />
            <div className="absolute inset-[1cqw] rounded-full bg-[#0B0F14]" />
            <Play style={{ width: '7.6cqw', height: '7.6cqw' }} className="relative fill-white text-white" />
            <span className="relative mt-[0.8cqw] font-mono text-[2.3cqw] tracking-[0.16em] text-white/50">发车</span>
          </div>
        </div>
        <div className="mt-[2.4cqw] font-mono text-[2.6cqw] tracking-[0.14em] text-[#0B0F14]/38">长按蓄力 · 声呐预热</div>
      </div>

      <div className="absolute inset-x-[5.6cqw] bottom-[6.4cqw] z-20">
        <div className="flex items-center justify-between rounded-[5cqw] border border-white/80 bg-white/72 px-[3.4cqw] py-[2.8cqw] shadow-[0_14px_40px_-18px_rgba(16,24,40,0.24)] backdrop-blur-2xl">
          {[
            { icon: <Navigation style={iconStyle(5)} />, label: '首页', active: true },
            { icon: <Layers style={iconStyle(5)} />, label: '路线' },
            { icon: <Activity style={iconStyle(5)} />, label: '记录' },
            { icon: <Settings2 style={iconStyle(5)} />, label: '设置' },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-[1cqw]" style={{ color: item.active ? '#0B0F14' : 'rgba(11,15,20,0.36)' }}>
              {item.icon}
              <span className="text-[2.4cqw]">{item.label}</span>
              <span className="h-[0.7cqw] w-[0.7cqw] rounded-full" style={{ background: item.active ? ICE : 'transparent' }} />
            </div>
          ))}
        </div>
      </div>
      <HomeIndicator dark />
    </ScreenShell>
  );
}

function CheckDot() {
  return (
    <span className="flex h-[2.4cqw] w-[2.4cqw] items-center justify-center rounded-full bg-[#0B0F14]">
      <svg viewBox="0 0 10 10" className="h-[1.6cqw] w-[1.6cqw]" fill="none" stroke="#7DD3FC" strokeWidth="1.8">
        <path d="M2 5.3 L4.1 7.2 L8 2.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function RunDarkScreen() {
  return (
    <ScreenShell style={{ background: '#06080B' }}>
      <MapBase dark />
      <TrailLoop />
      <StatusBar />

      <div className="absolute inset-x-[5.4cqw] top-[11cqw] z-30">
        <div className="flex items-center justify-between rounded-[5.6cqw] border border-white/10 bg-[#0A0D12]/72 px-[2.2cqw] py-[1.8cqw] backdrop-blur-2xl">
          <div className="flex items-center gap-[2.2cqw]">
            <div className="flex h-[7.4cqw] w-[7.4cqw] items-center justify-center rounded-full bg-[#38BDF8]/14">
              <Radio style={iconStyle(3.8)} className="text-[#7DD3FC]" />
            </div>
            <div>
              <div className="text-[3.5cqw] font-medium text-white/92">跑圈模拟中</div>
              <div className="font-mono text-[2.6cqw] text-white/40">第 2 圈 · 弯道外偏补偿</div>
            </div>
          </div>
          <div className="flex items-center gap-[1.6cqw]">
            <span className="flex h-[6.4cqw] w-[6.4cqw] items-center justify-center rounded-full border border-white/12 bg-white/6">
              <Pause style={iconStyle(3)} className="text-white/80" />
            </span>
            <span className="flex h-[6.4cqw] w-[6.4cqw] items-center justify-center rounded-full border border-white/12 bg-white/6">
              <Square style={iconStyle(2.6)} className="text-white/60" />
            </span>
          </div>
        </div>
      </div>

      <div className="absolute left-[5.4cqw] top-[26cqw] z-20 flex items-center gap-[1.4cqw] rounded-full border border-white/8 bg-black/35 px-[2.4cqw] py-[1.1cqw] font-mono text-[2.4cqw] text-white/45 backdrop-blur">
        <Navigation style={iconStyle(2.8)} className="text-[#38BDF8]" />
        39.90152° N · 116.40685° E
      </div>

      <div className="absolute inset-x-[4.6cqw] bottom-[6.2cqw] z-30">
        <div className="rounded-[6.4cqw] border border-white/12 bg-[#0A0D12]/74 p-[4.4cqw] shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-mono text-[2.6cqw] tracking-[0.18em] text-white/35">DISTANCE</div>
              <div className="mt-[1cqw] flex items-baseline gap-[1cqw]">
                <span className="font-mono text-[11.6cqw] font-light leading-none tracking-[-0.04em] text-white tabular">0.85</span>
                <span className="font-mono text-[3.4cqw] text-white/40">km</span>
              </div>
            </div>
            <div className="flex h-[13cqw] w-[13cqw] items-center justify-center">
              <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
                <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle cx="24" cy="24" r="20" fill="none" stroke={ICE} strokeWidth="2" strokeDasharray="125.6" strokeDashoffset="38" strokeLinecap="round" />
              </svg>
              <span className="absolute font-mono text-[2.6cqw] text-white/60">2/7</span>
            </div>
          </div>

          <div className="mt-[3.6cqw] grid grid-cols-3 gap-[2cqw] border-t border-white/8 pt-[3.2cqw]">
            {[
              ['配速', `5'40"`],
              ['用时', '04:52'],
              ['心率', '128'],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="font-mono text-[2.3cqw] tracking-[0.12em] text-white/30">{label}</div>
                <div className="mt-[0.8cqw] font-mono text-[4.4cqw] text-white/88 tabular">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

function RoamScreen() {
  return (
    <ScreenShell style={{ background: '#E9EDF2' }}>
      <MapBase />
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_38%,transparent_35%,rgba(11,15,20,0.1))]" />
      <StatusBar dark />

      <div className="absolute left-1/2 top-[46%] z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="relative flex h-[24cqw] w-[24cqw] items-center justify-center">
          <span className="absolute inset-0 rounded-full border border-[#0B0F14]/12" />
          <span className="absolute inset-[4cqw] rounded-full border border-[#0B0F14]/16" />
          <span className="absolute h-full w-px bg-[#0B0F14]/18" />
          <span className="absolute h-px w-full bg-[#0B0F14]/18" />
          <span className="relative h-[2.2cqw] w-[2.2cqw] rounded-full bg-[#0B0F14] shadow-[0_0_0_1.4cqw_rgba(255,255,255,0.65)]" />
        </div>
        <div className="mt-[2.4cqw] whitespace-nowrap rounded-full bg-[#0B0F14] px-[3cqw] py-[1.4cqw] text-center font-mono text-[2.5cqw] tracking-[0.02em] text-white/85 shadow-lg">
          39.90152° N, 116.40685° E
        </div>
      </div>

      <div className="absolute right-[4.6cqw] top-[30%] z-20 flex flex-col gap-[1.6cqw] rounded-[4.4cqw] border border-white/70 bg-white/62 p-[1.6cqw] shadow-[0_18px_40px_-16px_rgba(16,24,40,0.3)] backdrop-blur-xl">
        {[Plus, Crosshair, Layers].map((Icon, index) => (
          <span
            key={index}
            className="flex h-[8cqw] w-[8cqw] items-center justify-center rounded-[2.8cqw] bg-white/80"
            style={{ color: index === 1 ? '#0B0F14' : 'rgba(11,15,20,0.5)' }}
          >
            <Icon style={iconStyle(3.6)} />
          </span>
        ))}
      </div>

      <div className="absolute inset-x-[4.6cqw] bottom-[6.4cqw] z-30">
        <div className="rounded-[6cqw] border border-white/75 bg-white/72 p-[3.6cqw] shadow-[0_24px_60px_-24px_rgba(16,24,40,0.35)] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2cqw]">
              <span className="flex h-[8.6cqw] w-[8.6cqw] items-center justify-center rounded-full bg-[#0B0F14]">
                <Footprints style={iconStyle(4)} className="text-white" />
              </span>
              <div>
                <div className="text-[3.8cqw] font-medium text-[#0B0F14]">平滑走过去</div>
                <div className="font-mono text-[2.5cqw] text-[#0B0F14]/42">300m 内 · 拟真步行 · 1.4 m/s</div>
              </div>
            </div>
            <div className="rounded-full bg-[#0B0F14] px-[3.2cqw] py-[1.6cqw] text-[2.8cqw] font-medium text-white">空降</div>
          </div>
          <div className="mt-[3cqw] flex items-center gap-[2cqw]">
            <span className="font-mono text-[2.3cqw] text-[#0B0F14]/38">0</span>
            <div className="relative h-[1.1cqw] flex-1 rounded-full bg-[#0B0F14]/10">
              <div className="absolute inset-y-0 left-0 w-[62%] rounded-full bg-[#0B0F14]" />
              <span className="absolute left-[62%] top-1/2 h-[3.6cqw] w-[3.6cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.6cqw] border-white bg-[#0B0F14] shadow" />
            </div>
            <span className="font-mono text-[2.3cqw] text-[#0B0F14]/38">300m</span>
          </div>
        </div>
        <div className="mt-[2cqw] flex justify-center gap-[2cqw]">
          {['录制路线', '收藏落点', '视角'].map((label) => (
            <span key={label} className="rounded-full border border-white/70 bg-white/55 px-[3cqw] py-[1.4cqw] text-[2.6cqw] text-[#0B0F14]/62 backdrop-blur">
              {label}
            </span>
          ))}
        </div>
      </div>
      <HomeIndicator dark />
    </ScreenShell>
  );
}

function BuilderScreen() {
  return (
    <ScreenShell style={{ background: '#070A0E' }}>
      <MapBase dark />
      <div className="absolute inset-0 bg-[#04070a]/35" />
      <StatusBar />

      <div className="absolute inset-x-[5cqw] top-[11.6cqw] z-30 flex items-center justify-between rounded-[4.6cqw] border border-white/10 bg-[#0A0D12]/72 px-[3cqw] py-[2.2cqw] backdrop-blur-2xl">
        <div>
          <div className="text-[3.8cqw] font-medium text-white/90">400m 标准田径场</div>
          <div className="mt-[0.6cqw] font-mono text-[2.4cqw] text-[#7DD3FC]/70">0° 合焦 · 已套模</div>
        </div>
        <span className="rounded-full border border-[#38BDF8]/30 bg-[#38BDF8]/12 px-[2.6cqw] py-[1.2cqw] font-mono text-[2.4cqw] text-[#7DD3FC]">LOCKED</span>
      </div>

      <div className="absolute inset-0 z-20">
        <Track dark glow />
        <div className="absolute left-1/2 top-1/2 h-[46%] w-[70%] -translate-x-1/2 -translate-y-1/2">
          {[
            'left-0 top-0',
            'right-0 top-0',
            'left-0 bottom-0',
            'right-0 bottom-0',
          ].map((pos) => (
            <span key={pos} className={cn('absolute h-[3cqw] w-[3cqw] rounded-full border border-white/70 bg-[#38BDF8]/40', pos)} />
          ))}
        </div>
        <div className="absolute left-[9cqw] top-1/2 flex -translate-y-1/2 flex-col items-center gap-[0.6cqw]">
          {Array.from({ length: 11 }).map((_, index) => (
            <span
              key={index}
              className="bg-white/40"
              style={{ height: '0.32cqw', width: index % 5 === 0 ? '5cqw' : '2.8cqw', opacity: index % 5 === 0 ? 0.8 : 0.35 }}
            />
          ))}
        </div>
        <div className="absolute left-[6.2cqw] top-[calc(50%+7cqw)] font-mono text-[2.3cqw] tracking-[0.12em] text-white/35">VERNIER 1m</div>
      </div>

      <div className="absolute inset-x-[4.4cqw] bottom-[6cqw] z-30">
        <div className="rounded-[6cqw] border border-white/12 bg-[#0A0D12]/78 p-[3.8cqw] backdrop-blur-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[2cqw]">
              <span className="flex h-[8cqw] w-[8cqw] items-center justify-center rounded-full bg-white/7">
                <RotateCcw style={iconStyle(3.6)} className="text-white/75" />
              </span>
              <div>
                <div className="text-[3.6cqw] text-white/88">半径 36.5 m</div>
                <div className="font-mono text-[2.4cqw] text-white/35">缩放 1.00x · 跑向 顺时针</div>
              </div>
            </div>
            <div className="flex items-center gap-[1.2cqw]">
              <span className="flex h-[7cqw] w-[7cqw] items-center justify-center rounded-full border border-white/10 font-mono text-[3cqw] text-white/70">−</span>
              <span className="flex h-[7cqw] w-[7cqw] items-center justify-center rounded-full border border-white/10 font-mono text-[3cqw] text-white/70">+</span>
            </div>
          </div>

          <div className="mt-[3.4cqw] rounded-[3.4cqw] border border-white/8 bg-black/30 p-[2.6cqw]">
            <div className="flex items-center justify-between font-mono text-[2.3cqw] text-white/35">
              <span>0 m</span>
              <span className="text-[#7DD3FC]">+1 m 微调</span>
              <span>400 m</span>
            </div>
            <div className="relative mt-[1.8cqw] h-[1.2cqw] rounded-full bg-white/10">
              <div className="absolute inset-y-0 left-0 w-[68%] rounded-full bg-gradient-to-r from-white/60 to-[#38BDF8]" />
              <span className="absolute left-[68%] top-1/2 h-[3.8cqw] w-[3.8cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.6cqw] border-[#0A0D12] bg-white shadow" />
            </div>
            <div className="mt-[1.8cqw] flex justify-between">
              {Array.from({ length: 17 }).map((_, index) => (
                <span key={index} className="bg-white/20" style={{ width: '0.3cqw', height: index % 4 === 0 ? '1.6cqw' : '0.9cqw' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

function IslandScreen() {
  return (
    <ScreenShell style={{ background: '#05070A' }}>
      <div className="absolute inset-0" style={{ background: 'radial-gradient(90% 60% at 50% 18%, #12202B 0%, #080A0F 55%, #04060A 100%)' }} />
      <div className="absolute inset-0 grid grid-cols-4 gap-[5cqw] px-[8cqw] pt-[26cqw] opacity-30 blur-[0.4cqw]">
        {Array.from({ length: 20 }).map((_, index) => (
          <span key={index} className="aspect-square rounded-[5cqw] bg-white/12" />
        ))}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#04060A]/20 via-[#04060A]/50 to-[#04060A]/85" />

      <div className="absolute inset-x-[4.4cqw] top-[12.4cqw] z-30">
        <div className="rounded-[6.6cqw] border border-white/16 bg-[#0A0E14]/82 p-[3.6cqw] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.95)] backdrop-blur-2xl" style={{ boxShadow: '0 30px 90px -20px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.22)' }}>
          <div className="flex items-center gap-[2.4cqw]">
            <span className="flex h-[9cqw] w-[9cqw] items-center justify-center overflow-hidden rounded-[3.2cqw] ring-1 ring-white/15">
              <img src={BRAND_ICON} alt="" className="h-full w-full object-contain" draggable={false} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-[1.4cqw]">
                <span className="h-[1.2cqw] w-[1.2cqw] rounded-full bg-[#38BDF8] animate-pulse-dot" />
                <span className="text-[3.5cqw] font-medium text-white/92">云迹 · 模拟运行中</span>
              </div>
              <div className="mt-[0.8cqw] font-mono text-[2.6cqw] text-white/45">5'40" · 0.85 / 3.00 km</div>
            </div>
            <span className="flex h-[7.4cqw] w-[7.4cqw] items-center justify-center rounded-full border border-white/12 bg-white/6">
              <Pause style={iconStyle(3.2)} className="text-white/80" />
            </span>
            <span className="flex h-[7.4cqw] w-[7.4cqw] items-center justify-center rounded-full border border-white/12 bg-white/6">
              <Square style={iconStyle(2.8)} className="text-white/55" />
            </span>
          </div>
          <div className="mt-[2.6cqw] h-[0.9cqw] overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[28%] rounded-full bg-gradient-to-r from-[#EAFBFE] via-[#7DD3FC] to-[#38BDF8]" />
          </div>
          <div className="mt-[1.8cqw] flex justify-between font-mono text-[2.2cqw] text-white/30">
            <span>第 2 跑道</span>
            <span>剩余 2.15 km</span>
          </div>
        </div>

        <div className="mt-[2.4cqw] flex items-center justify-between rounded-full border border-white/10 bg-[#0A0E14]/70 px-[3.2cqw] py-[1.8cqw] backdrop-blur-xl">
          <div className="flex items-center gap-[1.8cqw]">
            <span className="h-[1cqw] w-[1cqw] rounded-full bg-white/50" />
            <span className="text-[2.8cqw] text-white/55">已切换至第 2 跑道 · 弯道外偏</span>
          </div>
          <span className="font-mono text-[2.2cqw] text-white/28">刚刚</span>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-[9cqw] z-20 px-[6cqw] text-center">
        <div className="text-[3.4cqw] text-white/55">下拉展开 · 上滑收起</div>
        <div className="mt-[1.4cqw] font-mono text-[2.3cqw] tracking-[0.16em] text-white/25">CROSS-APP ISLAND</div>
      </div>
      <HomeIndicator />
    </ScreenShell>
  );
}

function SettingsScreen() {
  return (
    <ScreenShell style={{ background: 'linear-gradient(180deg,#F6F8FB,#EDF1F6)' }}>
      <StatusBar dark />
      <div className="relative z-20 px-[6.4cqw] pt-[5.4cqw]">
        <div className="font-mono text-[2.5cqw] tracking-[0.2em] text-[#0B0F14]/35">SETTINGS</div>
        <div className="mt-[1.4cqw] text-[8cqw] font-semibold tracking-[-0.04em] text-[#0B0F14]">体检与外观</div>
      </div>

      <div className="relative z-20 mt-[4.6cqw] px-[5.2cqw]">
        <div className="rounded-[5.6cqw] border border-white/80 bg-white/70 p-[2.4cqw] shadow-[0_18px_44px_-20px_rgba(16,24,40,0.25)] backdrop-blur-xl">
          <div className="flex items-center justify-between px-[1.4cqw] pb-[2.2cqw] pt-[1cqw]">
            <span className="text-[3.3cqw] font-medium text-[#0B0F14]">外观</span>
            <span className="font-mono text-[2.3cqw] text-[#0B0F14]/35">DAY / NIGHT</span>
          </div>
          <div className="grid grid-cols-2 gap-[2cqw]">
            <div className="relative overflow-hidden rounded-[3.8cqw] border-[0.5cqw] border-[#0B0F14] bg-[#FAFBFD] p-[2.4cqw]">
              <Sun style={iconStyle(4)} className="text-[#0B0F14]/70" />
              <div className="mt-[1.6cqw] text-[3cqw] text-[#0B0F14]">日光白</div>
              <div className="mt-[0.6cqw] font-mono text-[2.1cqw] text-[#0B0F14]/38">防眩 · 高对比</div>
              <span className="absolute right-[2cqw] top-[2cqw] flex h-[3.4cqw] w-[3.4cqw] items-center justify-center rounded-full bg-[#0B0F14] text-white">✓</span>
            </div>
            <div className="relative overflow-hidden rounded-[3.8cqw] border border-[#0B0F14]/10 bg-[#0B0F14] p-[2.4cqw]">
              <Moon style={iconStyle(4)} className="text-white/65" />
              <div className="mt-[1.6cqw] text-[3cqw] text-white/90">曜石黑</div>
              <div className="mt-[0.6cqw] font-mono text-[2.1cqw] text-white/35">深空 · 120Hz</div>
            </div>
          </div>
        </div>

        <div className="mt-[3.4cqw] rounded-[5.6cqw] border border-white/80 bg-white/70 p-[1.2cqw] shadow-[0_18px_44px_-20px_rgba(16,24,40,0.22)] backdrop-blur-xl">
          {[
            { icon: <Zap style={iconStyle(3.6)} />, label: 'AGSL 光学折射', value: '已启用' },
            { icon: <Gauge style={iconStyle(3.6)} />, label: '120Hz 渲染', value: '自适应' },
            { icon: <Radio style={iconStyle(3.6)} />, label: '悬浮岛权限', value: '已授权' },
            { icon: <Shield style={iconStyle(3.6)} />, label: '电池白名单', value: '已加入' },
          ].map((row, index, list) => (
            <div
              key={row.label}
              className={cn('flex items-center gap-[2.4cqw] px-[2.4cqw] py-[2.6cqw]', index < list.length - 1 && 'border-b border-[#0B0F14]/6')}
            >
              <span className="flex h-[7.2cqw] w-[7.2cqw] items-center justify-center rounded-[2.4cqw] bg-[#0B0F14]/5 text-[#0B0F14]/55">
                {row.icon}
              </span>
              <span className="flex-1 text-[3.2cqw] text-[#0B0F14]/82">{row.label}</span>
              <span className="font-mono text-[2.6cqw] text-[#0B0F14]/40">{row.value}</span>
              <ChevronRight style={iconStyle(3)} className="text-[#0B0F14]/20" />
            </div>
          ))}
        </div>
      </div>

      <div className="absolute inset-x-[5.2cqw] bottom-[6.4cqw] z-20">
        <div className="flex items-center gap-[3cqw] rounded-[5.6cqw] border border-white/80 bg-white/72 p-[3.4cqw] shadow-[0_20px_50px_-22px_rgba(16,24,40,0.28)] backdrop-blur-xl">
          <div className="relative flex h-[14cqw] w-[14cqw] items-center justify-center">
            <svg viewBox="0 0 48 48" className="h-full w-full -rotate-90">
              <circle cx="24" cy="24" r="20" fill="none" stroke="rgba(11,15,20,0.08)" strokeWidth="2.4" />
              <circle cx="24" cy="24" r="20" fill="none" stroke={ICE} strokeWidth="2.4" strokeDasharray="125.6" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <span className="absolute font-mono text-[2.4cqw] text-[#0B0F14]/70">100</span>
          </div>
          <div className="flex-1">
            <div className="text-[3.4cqw] font-medium text-[#0B0F14]">环境体检全部通过</div>
            <div className="mt-[0.6cqw] font-mono text-[2.3cqw] text-[#0B0F14]/38">API 34 · AGSL · 电池 · 悬浮窗</div>
          </div>
          <CircleDot style={iconStyle(4)} className="text-[#38BDF8]" />
        </div>
      </div>
      <HomeIndicator dark />
    </ScreenShell>
  );
}

const SCREENS: Record<ScreenVariant, () => ReactNode> = {
  home: HomeScreen,
  'run-dark': RunDarkScreen,
  roam: RoamScreen,
  builder: BuilderScreen,
  island: IslandScreen,
  settings: SettingsScreen,
};

export function PhoneScreen({ variant, className }: { variant: ScreenVariant; className?: string }) {
  const Component = SCREENS[variant] ?? HomeScreen;
  return (
    <div className={cn('h-full w-full overflow-hidden', className)}>
      <Component />
    </div>
  );
}
