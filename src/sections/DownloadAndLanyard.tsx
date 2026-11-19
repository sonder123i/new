import { useEffect, useRef, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight, CalendarDays, Check, Copy, HardDrive, MonitorSmartphone, ShieldCheck } from 'lucide-react';
import DarkVeil from '@/components/reactbits/DarkVeil';
import GradientText from '@/components/reactbits/GradientText';
import StarBorder from '@/components/reactbits/StarBorder';
import { usePerformance } from '@/components/common/PerformanceContext';
import { LanyardPass } from '@/components/common/LanyardPass';
import { Parallax } from '@/motion/Parallax';
import { Reveal } from '@/components/common/SectionHeader';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { formatSize, useLatestRelease } from '@/hooks/useLatestRelease';
import { siteConfig } from '@/config/siteConfig';

/** 程序化绘制通行证卡面：冷银排版 + 光学网格 + 序列号 */
function drawPass(): string {
  const width = 900;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#12151b');
  bg.addColorStop(0.42, '#08090d');
  bg.addColorStop(1, '#0d1016');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 光学网格
  ctx.strokeStyle = 'rgba(255,255,255,0.045)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= width; x += 60) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y <= height; y += 60) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 顶部冷光
  const glow = ctx.createRadialGradient(width * 0.72, 120, 10, width * 0.72, 120, 620);
  glow.addColorStop(0, 'rgba(56,189,248,0.24)');
  glow.addColorStop(0.55, 'rgba(129,140,248,0.08)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  // 外框
  ctx.strokeStyle = 'rgba(255,255,255,0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // 品牌环
  ctx.strokeStyle = 'rgba(226,232,240,0.85)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(120, 140, 44, 28, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(56,189,248,0.65)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(120, 140, 30, 17, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#EAFBFE';
  ctx.beginPath();
  ctx.arc(120, 140, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F5F5F7';
  ctx.font = '500 46px system-ui, sans-serif';
  ctx.fillText('云迹', 200, 132);
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.font = '400 20px ui-monospace, monospace';
  ctx.fillText('C L O U D T R A C E', 200, 166);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 76px system-ui, sans-serif';
  ctx.fillText('OPEN SOURCE', 84, 430);
  ctx.fillStyle = 'rgba(245,245,247,0.55)';
  ctx.font = '600 76px system-ui, sans-serif';
  ctx.fillText('PASS', 84, 522);

  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(84, 600);
  ctx.lineTo(width - 84, 600);
  ctx.stroke();

  const rows: Array<[string, string]> = [
    ['ENGINE', 'AGSL OPTICAL · 120HZ'],
    ['MODE', 'AUTO LAP / FREE ROAM'],
    ['POLICY', 'LOCAL ONLY · ZERO CLOUD'],
  ];
  rows.forEach(([key, value], index) => {
    const y = 680 + index * 96;
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '400 19px ui-monospace, monospace';
    ctx.fillText(key, 84, y);
    ctx.fillStyle = 'rgba(245,245,247,0.86)';
    ctx.font = '400 26px ui-monospace, monospace';
    ctx.fillText(value, 84, y + 38);
  });

  // 序列号区块
  ctx.fillStyle = 'rgba(255,255,255,0.03)';
  ctx.fillRect(84, 1000, width - 168, 118);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.strokeRect(84, 1000, width - 168, 118);
  ctx.fillStyle = 'rgba(255,255,255,0.28)';
  ctx.font = '400 17px ui-monospace, monospace';
  ctx.fillText('SERIAL', 112, 1042);
  ctx.fillStyle = 'rgba(245,245,247,0.9)';
  ctx.font = '400 40px ui-monospace, monospace';
  ctx.fillText(siteConfig.download.lanyard.serial, 112, 1090);

  // 右下角光学标记
  ctx.save();
  ctx.translate(width - 190, height - 210);
  ctx.strokeStyle = 'rgba(56,189,248,0.5)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 24 + i * 18, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#7DD3FC';
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.fillStyle = 'rgba(255,255,255,0.24)';
  ctx.font = '400 16px ui-monospace, monospace';
  ctx.fillText('GPL-3.0 · VISION 4.0', 84, height - 82);

  return canvas.toDataURL('image/png');
}

export function DownloadAndLanyard() {
  const release = useLatestRelease();
  const { isFlagship } = usePerformance();
  const [front, setFront] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);
  const timerRef = useRef(0);
  const shaTimerRef = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => setFront(drawPass()), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => () => {
    window.clearTimeout(timerRef.current);
    window.clearTimeout(shaTimerRef.current);
  }, []);

  const copy = async () => {
    const text = `${siteConfig.download.copyHint}<路线口令>\n在云迹 App 的「路线 → 分享」中整段复制，粘贴到导入框即可。`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* 无剪贴板权限时保持静默 */
    }
    setCopied(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setCopied(false), 2200);
  };

  const copySha = async () => {
    if (!release.sha256) return;
    try {
      await navigator.clipboard.writeText(release.sha256);
    } catch {
      /* 无剪贴板权限时保持静默 */
    }
    setCopiedSha(true);
    window.clearTimeout(shaTimerRef.current);
    shaTimerRef.current = window.setTimeout(() => setCopiedSha(false), 2200);
  };

  return (
    <section id="download" className="relative overflow-hidden border-t border-white/[0.055] bg-[#040507] py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        {isFlagship ? (
          <ViewportLazyMount className="h-full w-full" rootMargin="300px 0px">
            <DarkVeil
              color="#05070c"
              speed={0.32}
              scale={1.15}
              rotation={12}
              flow={0.45}
              warp={0.35}
              variation={0.4}
              brightness={0.5}
              sheen={0.4}
              glow={0.35}
              grain={0.2}
              mouseInteraction={false}
              opacity={0.55}
              dpr={1.25}
            />
          </ViewportLazyMount>
        ) : null}
      </div>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(56,189,248,0.06),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] tracking-[0.2em] text-white/22">06</span>
          <span className="h-px w-8 bg-gradient-to-r from-[#38BDF8]/70 to-transparent" />
          <span className="mono-label text-[#7DD3FC]/70">GET CLOUDTRACE</span>
          <span className="ml-auto hidden font-mono text-[9px] uppercase tracking-[0.2em] text-white/22 sm:block">
            release · lanyard
          </span>
        </div>

        <div className="mt-9 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.02fr_0.98fr] lg:gap-8">
          <Reveal>
            <div className="relative">
              <GradientText
                colors={['#FFFFFF', '#94A3B8', '#38BDF8']}
                animationSpeed={7}
                angle={100}
                direction="horizontal"
                className="display inline-block text-[clamp(28px,3.4vw,44px)] leading-[1.15]"
              >
                {siteConfig.download.title}
              </GradientText>

              <p className="mt-4 max-w-[500px] text-[13px] leading-[1.85] text-white/42">
                {siteConfig.download.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-2 rounded-full border border-[#38BDF8]/25 bg-[#38BDF8]/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#38BDF8] animate-pulse-dot" />
                  <span className="font-mono text-[10.5px] tracking-[0.1em] text-[#BAE6FD]">
                    {release.loading ? '正在同步 Release' : `LATEST ${release.version}`}
                  </span>
                </span>
                {release.live ? (
                  <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-white/35">
                    {release.source === 'manifest' ? 'signed manifest · live' : 'github api · live'}
                  </span>
                ) : null}
              </div>

              <div className="glass-panel mt-6 overflow-hidden rounded-[24px]">
                <div className="grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    { icon: <CalendarDays className="h-3.5 w-3.5" />, label: '发布日期', value: release.publishedAt || '—' },
                    { icon: <HardDrive className="h-3.5 w-3.5" />, label: '安装包大小', value: formatSize(release.sizeKb) },
                    { icon: <MonitorSmartphone className="h-3.5 w-3.5" />, label: '系统要求', value: 'Android 8.0+' },
                  ].map((item) => (
                    <div key={item.label} className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-white/30">
                        {item.icon}
                        <span className="font-mono text-[9px] uppercase tracking-[0.16em]">{item.label}</span>
                      </div>
                      <div className="mt-2 font-mono text-[12.5px] text-white/80 tabular">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {release.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2.5">
                    <Check className="mt-0.5 h-3 w-3 shrink-0 text-[#7DD3FC]/70" />
                    <span className="text-[12px] leading-[1.7] text-white/42">{note}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <StarBorder
                  as="a"
                  href={release.downloadUrl}
                  color="#7DD3FC"
                  trailColor="#E2E8F0"
                  thickness={1}
                  radius={999}
                  duration={4.6}
                  glow={0.75}
                  sparkle
                  className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-[#F5F5F7] px-6 text-[#08090C] shadow-[0_20px_50px_-18px_rgba(255,255,255,0.4)] transition-transform duration-500 hover:scale-[1.015]"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  <span className="text-[13px] font-semibold">{siteConfig.download.primaryCta}</span>
                  <span className="font-mono text-[10px] text-[#08090C]/45">{release.version}</span>
                </StarBorder>

                <a
                  href={release.mirrorUrl}
                  className="glass-panel flex h-[52px] items-center justify-center gap-2 rounded-full px-5 text-[12.5px] text-white/70 transition-colors hover:text-white"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-50" />
                  {siteConfig.download.secondaryCta}
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copy}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-3.5 py-2 text-[11px] text-white/45 transition-colors hover:border-white/20 hover:text-white/75"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#7DD3FC]" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? '口令说明已复制' : siteConfig.download.copyCta}
                </button>
                <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/22">
                  <ShieldCheck className="h-3 w-3" />
                  {siteConfig.download.requirements}
                </span>
              </div>

              <div className="mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.02] px-4 py-3.5">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/30">
                    <ShieldCheck className="h-3 w-3" />
                    SHA-256 · 校验安装包
                  </span>
                  <button
                    type="button"
                    onClick={copySha}
                    className="rounded-full border border-white/10 px-2.5 py-1 font-mono text-[9.5px] text-white/40 transition-colors hover:border-white/20 hover:text-white/70"
                  >
                    {copiedSha ? '已复制' : '复制'}
                  </button>
                </div>
                <div className="mt-2 break-all font-mono text-[10px] leading-[1.7] text-white/38">
                  {release.sha256 || '—'}
                </div>
                <div className="mt-1.5 break-all font-mono text-[10px] leading-[1.7] text-white/24">
                  apksigner verify --print-certs CloudTrace_{release.version.replace('v', '')}_arm64-v8a_release.apk
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <a
                    href={release.releaseUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[#7DD3FC]/70 transition-colors hover:text-[#7DD3FC]"
                  >
                    全部版本 / 更新日志
                  </a>
                  <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-white/20">
                    与 App 内更新使用同一份签名清单
                  </span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <Parallax strength={70} scale className="relative h-[560px] w-full sm:h-[610px]">
              <div className="pointer-events-none absolute inset-x-10 top-16 bottom-10 -z-10 rounded-[50%] bg-[#38BDF8]/[0.07] blur-[70px]" />
              <LanyardPass image={front} />

            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
