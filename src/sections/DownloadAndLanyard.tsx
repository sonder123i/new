import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  Copy,
  HardDrive,
  MonitorSmartphone,
  ShieldCheck,
} from 'lucide-react';
import { LanyardPass } from '@/components/common/LanyardPass';
import { Reveal } from '@/components/common/SectionHeader';
import { formatSize, useLatestRelease } from '@/hooks/useLatestRelease';
import { siteConfig } from '@/config/siteConfig';

/** 程序化绘制通行证卡面：纯冷银石墨排版，去除多余蓝紫光斑 */
function drawPass(): string {
  const width = 900;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#16181e');
  bg.addColorStop(0.5, '#0b0c10');
  bg.addColorStop(1, '#12141a');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 极淡光学网格
  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
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

  // 顶部中性银白柔和反光
  const glow = ctx.createRadialGradient(width * 0.7, 100, 10, width * 0.7, 100, 560);
  glow.addColorStop(0, 'rgba(255,255,255,0.14)');
  glow.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.lineWidth = 2;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  // 品牌环
  ctx.strokeStyle = 'rgba(245,245,247,0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(120, 140, 44, 28, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255,255,255,0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(120, 140, 30, 17, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(120, 140, 5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#F5F5F7';
  ctx.font = '600 46px system-ui, sans-serif';
  ctx.fillText('云迹', 200, 132);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.font = '400 20px ui-monospace, monospace';
  ctx.fillText('C L O U D T R A C E', 200, 166);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '600 76px system-ui, sans-serif';
  ctx.fillText('OPEN SOURCE', 84, 430);
  ctx.fillStyle = 'rgba(245,245,247,0.5)';
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
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '400 19px ui-monospace, monospace';
    ctx.fillText(key, 84, y);
    ctx.fillStyle = 'rgba(245,245,247,0.9)';
    ctx.font = '400 26px ui-monospace, monospace';
    ctx.fillText(value, 84, y + 38);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.04)';
  ctx.fillRect(84, 1000, width - 168, 118);
  ctx.strokeStyle = 'rgba(255,255,255,0.12)';
  ctx.strokeRect(84, 1000, width - 168, 118);
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.font = '400 17px ui-monospace, monospace';
  ctx.fillText('SERIAL', 112, 1042);
  ctx.fillStyle = 'rgba(245,245,247,0.92)';
  ctx.font = '400 40px ui-monospace, monospace';
  ctx.fillText(siteConfig.download.lanyard.serial, 112, 1090);

  ctx.fillStyle = 'rgba(255,255,255,0.35)';
  ctx.font = '400 16px ui-monospace, monospace';
  ctx.fillText('GPL-3.0 · VISION 4.0', 84, height - 82);

  return canvas.toDataURL('image/png');
}

export function DownloadAndLanyard() {
  const release = useLatestRelease();
  const [front, setFront] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);
  const timerRef = useRef(0);
  const shaTimerRef = useRef(0);

  useEffect(() => {
    const id = window.setTimeout(() => setFront(drawPass()), 100);
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
      /* 静默 */
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
      /* 静默 */
    }
    setCopiedSha(true);
    window.clearTimeout(shaTimerRef.current);
    shaTimerRef.current = window.setTimeout(() => setCopiedSha(false), 2200);
  };

  return (
    <section
      id="download"
      className="relative overflow-hidden border-t border-white/[0.07] bg-[#050507] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_50%_at_50%_0%,rgba(255,255,255,0.04),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-[11px] tracking-[0.16em] text-white/40">06</span>
          <span className="h-px w-6 bg-white/25" />
          <span className="mono-label text-white/70">GET CLOUDTRACE</span>
        </div>

        <div className="mt-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
          <Reveal>
            <div>
              <h2 className="display text-[clamp(30px,3.6vw,46px)] text-[#F5F5F7]">
                {siteConfig.download.title}
              </h2>

              <p className="mt-4 max-w-[520px] text-[15px] leading-[1.78] text-white/62">
                {siteConfig.download.description}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.06] px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-white/90" />
                  <span className="font-mono text-[11px] tracking-[0.06em] text-white/90">
                    {release.loading ? '正在同步 Release' : `LATEST ${release.version}`}
                  </span>
                </span>
                <span className="font-mono text-[11px] text-white/45">{siteConfig.download.requirements}</span>
              </div>

              <div className="glass-panel mt-6 overflow-hidden rounded-[20px]">
                <div className="grid grid-cols-1 divide-y divide-white/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    { icon: <CalendarDays className="h-3.5 w-3.5" />, label: '发布日期', value: release.publishedAt || '—' },
                    { icon: <HardDrive className="h-3.5 w-3.5" />, label: '安装包大小', value: formatSize(release.sizeKb) },
                    { icon: <MonitorSmartphone className="h-3.5 w-3.5" />, label: '系统要求', value: 'Android 8.0+' },
                  ].map((item) => (
                    <div key={item.label} className="px-4 py-3.5">
                      <div className="flex items-center gap-1.5 text-white/45">
                        {item.icon}
                        <span className="font-mono text-[10px] uppercase tracking-[0.12em]">{item.label}</span>
                      </div>
                      <div className="mt-1.5 font-mono text-[13.5px] text-white/90 tabular">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 space-y-2">
                {release.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2.5">
                    <Check className="mt-1 h-3.5 w-3.5 shrink-0 text-white/60" />
                    <span className="text-[13.5px] leading-[1.65] text-white/62">{note}</span>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <a
                  href={release.downloadUrl}
                  className="flex h-[50px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-[#F5F5F7] px-6 text-[#08090C] shadow-[0_16px_38px_-14px_rgba(255,255,255,0.4)] transition-all duration-300 hover:bg-white active:scale-[0.985]"
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  <span className="text-[14px] font-semibold">{siteConfig.download.primaryCta}</span>
                  <span className="font-mono text-[11px] text-black/55">{release.version}</span>
                </a>

                <a
                  href={release.mirrorUrl}
                  className="glass-panel flex h-[50px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full px-5 text-[13.5px] font-medium text-white/82 transition-colors hover:border-white/22 hover:text-white"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-60" />
                  {siteConfig.download.secondaryCta}
                </a>

                <button
                  type="button"
                  onClick={copy}
                  className="flex h-[50px] shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.03] px-4 text-[12.5px] text-white/65 transition-colors hover:border-white/20 hover:text-white"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-white" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? '口令说明已复制' : siteConfig.download.copyCta}
                </button>
              </div>

              {/* 校验信息默认折叠，保持下载主视图克制干练 */}
              <details className="group mt-6 rounded-2xl border border-white/[0.08] bg-white/[0.025] px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] text-white/60 transition-colors hover:text-white/85">
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em]">
                    <ShieldCheck className="h-3.5 w-3.5 text-white/65" />
                    SHA-256 校验与签名验证命令
                  </span>
                  <ChevronDown className="h-4 w-4 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="mt-3 border-t border-white/[0.07] pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">SHA-256</span>
                    <button
                      type="button"
                      onClick={copySha}
                      className="rounded-full border border-white/12 px-2.5 py-0.5 font-mono text-[10px] text-white/65 transition-colors hover:border-white/25 hover:text-white"
                    >
                      {copiedSha ? '已复制' : '复制校验码'}
                    </button>
                  </div>
                  <div className="mt-1.5 break-all font-mono text-[11px] leading-[1.6] text-white/70">
                    {release.sha256 || '—'}
                  </div>
                  <div className="mt-2 break-all font-mono text-[10.5px] leading-[1.6] text-white/42">
                    apksigner verify --print-certs CloudTrace_{release.version.replace('v', '')}_arm64-v8a_release.apk
                  </div>
                  <div className="mt-3 flex items-center gap-4">
                    <a
                      href={release.releaseUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-[11px] text-white/75 underline decoration-white/25 underline-offset-4 hover:text-white"
                    >
                      查看全部版本与更新日志
                    </a>
                  </div>
                </div>
              </details>
            </div>
          </Reveal>

          {/* 去掉外层 Parallax，让物理挂绳独立顺滑响应拖拽 */}
          <Reveal delay={0.08}>
            <div className="relative h-[540px] w-full sm:h-[580px]">
              <LanyardPass image={front} />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
