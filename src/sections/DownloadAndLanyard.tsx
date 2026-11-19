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
import { usePerformance } from '@/components/common/PerformanceContext';
import { Reveal } from '@/components/common/SectionHeader';
import Magnet from '@/components/reactbits/Magnet';
import StarBorder from '@/components/reactbits/StarBorder';
import { siteConfig } from '@/config/siteConfig';
import { formatSize, useLatestRelease } from '@/hooks/useLatestRelease';

/** 程序化绘制浅色瓷白与液态镀铬通行证卡面 */
function drawPorcelainChromePass(versionLabel: string): string {
  const width = 900;
  const height = 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // 1. 瓷白与液态镀铬金属基底
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#FFFFFF');
  bg.addColorStop(0.28, '#F2F5FA');
  bg.addColorStop(0.54, '#E4EAF3');
  bg.addColorStop(0.78, '#F6F8FC');
  bg.addColorStop(1, '#DCE3EE');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // 2. 斜向液态镀铬扫光带（模仿阳极氧化钛银高光）
  ctx.save();
  ctx.translate(width * 0.5, height * 0.5);
  ctx.rotate(-0.42);
  const sheen = ctx.createLinearGradient(-width, 0, width, 0);
  sheen.addColorStop(0, 'rgba(255,255,255,0)');
  sheen.addColorStop(0.36, 'rgba(255,255,255,0.68)');
  sheen.addColorStop(0.46, 'rgba(203,213,225,0.22)');
  sheen.addColorStop(0.58, 'rgba(255,255,255,0.75)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(-width, -height, width * 2, height * 2);
  ctx.restore();

  // 3. 极克制的贝母薄膜干涉微晕（右上角）
  const pearl = ctx.createRadialGradient(width * 0.78, 170, 20, width * 0.78, 170, 560);
  pearl.addColorStop(0, 'rgba(186,214,247,0.34)');
  pearl.addColorStop(0.45, 'rgba(221,214,254,0.18)');
  pearl.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = pearl;
  ctx.fillRect(0, 0, width, height);

  // 4. 瑞士建筑精密测绘网格
  ctx.strokeStyle = 'rgba(10,12,16,0.045)';
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

  // 5. 双层高定边框（内白倒角 + 外墨细线）
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth = 4;
  ctx.strokeRect(40, 40, width - 80, height - 80);

  ctx.strokeStyle = 'rgba(10,12,16,0.14)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(44, 44, width - 88, height - 88);

  // 四角对准十字标
  const drawCross = (cx: number, cy: number) => {
    ctx.strokeStyle = 'rgba(10,12,16,0.32)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(cx - 8, cy);
    ctx.lineTo(cx + 8, cy);
    ctx.moveTo(cx, cy - 8);
    ctx.lineTo(cx, cy + 8);
    ctx.stroke();
  };
  drawCross(72, 72);
  drawCross(width - 72, 72);
  drawCross(72, height - 72);
  drawCross(width - 72, height - 72);

  // 6. 顶部光学品牌双环 + 中英字标
  ctx.strokeStyle = '#0A0C10';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.ellipse(128, 160, 44, 28, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(10,12,16,0.42)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(128, 160, 29, 16, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#0A0C10';
  ctx.beginPath();
  ctx.arc(128, 160, 5.5, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#0A0C10';
  ctx.font = '600 46px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif';
  ctx.fillText('云迹', 204, 152);

  ctx.fillStyle = 'rgba(10,12,16,0.48)';
  ctx.font = '500 19px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText('C L O U D T R A C E', 204, 186);

  // 右上角版本徽章（曜石反差胶囊）
  const badgeText = versionLabel || 'VISION 4.0';
  ctx.fillStyle = '#0A0C10';
  ctx.beginPath();
  ctx.roundRect(width - 252, 134, 168, 46, 23);
  ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '500 19px ui-monospace, SFMono-Regular, monospace';
  ctx.textAlign = 'center';
  ctx.fillText(badgeText.toUpperCase(), width - 168, 164);
  ctx.textAlign = 'left';

  // 7. 主视觉巨型瑞士排版
  ctx.fillStyle = '#0A0C10';
  ctx.font = '700 78px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('OPEN SOURCE', 84, 424);

  ctx.fillStyle = 'rgba(10,12,16,0.34)';
  ctx.font = '700 78px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('OPTICAL PASS', 84, 514);

  // 分隔线
  ctx.strokeStyle = 'rgba(10,12,16,0.12)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(84, 584);
  ctx.lineTo(width - 84, 584);
  ctx.stroke();

  // 8. 规格数据行
  const rows: Array<[string, string]> = [
    ['ENGINE', 'AGSL OPTICAL · 120HZ'],
    ['MODE', 'AUTO LAP / FREE ROAM'],
    ['POLICY', 'LOCAL ONLY · ZERO CLOUD'],
  ];
  rows.forEach(([key, value], index) => {
    const y = 660 + index * 96;
    ctx.fillStyle = 'rgba(10,12,16,0.42)';
    ctx.font = '500 18px ui-monospace, SFMono-Regular, monospace';
    ctx.fillText(key, 84, y);

    ctx.fillStyle = '#0A0C10';
    ctx.font = '600 26px ui-monospace, SFMono-Regular, monospace';
    ctx.fillText(value, 84, y + 36);
  });

  // 9. 序列号磨砂铭牌区
  ctx.fillStyle = 'rgba(255,255,255,0.62)';
  ctx.beginPath();
  ctx.roundRect(84, 984, width - 168, 126, 22);
  ctx.fill();
  ctx.strokeStyle = 'rgba(10,12,16,0.11)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = 'rgba(10,12,16,0.42)';
  ctx.font = '500 16px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText('SPECIMEN SERIAL', 114, 1028);

  ctx.fillStyle = '#0A0C10';
  ctx.font = '600 40px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText(siteConfig.download.lanyard.serial, 114, 1080);

  // 右下角精密同心刻度环
  ctx.save();
  ctx.translate(width - 178, 1047);
  ctx.strokeStyle = 'rgba(10,12,16,0.22)';
  ctx.lineWidth = 1.4;
  for (let i = 0; i < 4; i += 1) {
    ctx.beginPath();
    ctx.arc(0, 0, 14 + i * 11, 0, Math.PI * 2);
    ctx.stroke();
  }
  ctx.fillStyle = '#0A0C10';
  ctx.beginPath();
  ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 10. 底部校准刻度条与许可标注
  ctx.fillStyle = 'rgba(10,12,16,0.42)';
  ctx.font = '500 16px ui-monospace, SFMono-Regular, monospace';
  ctx.fillText('GPL-3.0 · DAYLIGHT PORCELAIN EDITION', 84, height - 86);

  // 右下光学条码装饰
  ctx.fillStyle = 'rgba(10,12,16,0.28)';
  const barWidths = [3, 1, 5, 2, 1, 4, 2, 6, 1, 3, 2, 4, 1, 2];
  let bx = width - 210;
  for (const bw of barWidths) {
    ctx.fillRect(bx, height - 104, bw, 22);
    bx += bw + 5;
  }

  return canvas.toDataURL('image/png');
}

export function DownloadAndLanyard() {
  const release = useLatestRelease();
  const { capability } = usePerformance();
  const [front, setFront] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [copiedSha, setCopiedSha] = useState(false);
  const timerRef = useRef(0);
  const shaTimerRef = useRef(0);

  useEffect(() => {
    const versionText = release.loading ? 'VISION 4.0' : release.version;
    const id = window.setTimeout(() => setFront(drawPorcelainChromePass(versionText)), 80);
    return () => window.clearTimeout(id);
  }, [release.loading, release.version]);

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
    <section id="download" className="relative overflow-hidden border-t border-[#0A0C10]/[0.08] py-24 sm:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        {/* 瑞士坐标头 */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-[#0A0C10]/40 tabular">
            06 / 06
          </span>
          <span className="h-px w-8 bg-[#0A0C10]/20" />
          <span className="mono-label text-[#0A0C10]/65">GET CLOUDTRACE</span>
          <span className="ml-auto hidden font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0C10]/40 sm:block">
            release · physics pass
          </span>
        </div>

        <div className="mt-9 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.06fr_0.94fr] lg:gap-10">
          {/* ---------------- 左侧：高对比瓷白下载卡 ---------------- */}
          <Reveal>
            <div className="relative">
              <h2 className="display text-[clamp(30px,3.8vw,48px)] text-[#0A0C10]">
                {siteConfig.download.title}
              </h2>

              <p className="mt-4 max-w-[520px] text-[15px] leading-[1.8] text-[#0A0C10]/62">
                {siteConfig.download.description}
              </p>

              {/* 版本与实况签名胶囊 */}
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <span className="glass-panel-soft inline-flex items-center gap-2 rounded-full px-3.5 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#0A0C10] animate-pulse-dot" />
                  <span className="font-mono text-[11px] font-medium tracking-[0.06em] text-[#0A0C10] tabular">
                    {release.loading ? '正在同步 Release' : `LATEST ${release.version}`}
                  </span>
                </span>
                {release.live ? (
                  <span className="rounded-full border border-[#0A0C10]/10 bg-white/55 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0A0C10]/55">
                    {release.source === 'manifest' ? 'signed manifest · live' : 'github api · live'}
                  </span>
                ) : null}
              </div>

              {/* 三列规格瓷白面板 */}
              <div className="glass-panel mt-6 overflow-hidden rounded-[22px]">
                <div className="grid grid-cols-1 divide-y divide-[#0A0C10]/[0.07] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  {[
                    { icon: <CalendarDays className="h-3.5 w-3.5" />, label: '发布日期', value: release.publishedAt || '—' },
                    { icon: <HardDrive className="h-3.5 w-3.5" />, label: '安装包大小', value: formatSize(release.sizeKb) },
                    { icon: <MonitorSmartphone className="h-3.5 w-3.5" />, label: '系统要求', value: 'Android 8.0+' },
                  ].map((item) => (
                    <div key={item.label} className="px-4 py-4">
                      <div className="flex items-center gap-1.5 text-[#0A0C10]/45">
                        {item.icon}
                        <span className="font-mono text-[10px] uppercase tracking-[0.14em]">{item.label}</span>
                      </div>
                      <div className="mt-2 font-mono text-[13.5px] font-medium text-[#0A0C10] tabular">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 更新要点 */}
              <div className="mt-5 space-y-2">
                {release.notes.map((note) => (
                  <div key={note} className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0A0C10]/[0.07] text-[#0A0C10]">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="text-[13.5px] leading-[1.68] text-[#0A0C10]/68">{note}</span>
                  </div>
                ))}
              </div>

              {/* 主次下载动作区 */}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Magnet padding={30} magnetStrength={3.4} disabled={!capability.allowCursorFx}>
                  <StarBorder
                    as="a"
                    href={release.downloadUrl}
                    color="#94A3B8"
                    trailColor="#FFFFFF"
                    thickness={1.2}
                    radius={999}
                    duration={4.8}
                    glow={0.35}
                    sparkle={false}
                    className="flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#0A0C10] px-6 text-white shadow-[0_18px_38px_-14px_rgba(10,12,16,0.45)] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.985]"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    <span className="text-[14px] font-semibold">{siteConfig.download.primaryCta}</span>
                    <span className="rounded-full bg-white/15 px-2 py-0.5 font-mono text-[10.5px] text-white/80 tabular">
                      {release.version}
                    </span>
                  </StarBorder>
                </Magnet>

                <a
                  href={release.mirrorUrl}
                  className="glass-panel flex h-[52px] items-center justify-center gap-2 rounded-full px-5 text-[13.5px] font-medium text-[#0A0C10]/85 transition-colors hover:bg-white hover:text-[#0A0C10]"
                >
                  <ArrowUpRight className="h-3.5 w-3.5 opacity-55" />
                  {siteConfig.download.secondaryCta}
                </a>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={copy}
                  className="glass-panel-soft flex items-center gap-2 rounded-full px-3.5 py-2 text-[12px] font-medium text-[#0A0C10]/70 transition-colors hover:bg-white hover:text-[#0A0C10]"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[#0A0C10]" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? '口令说明已复制' : siteConfig.download.copyCta}
                </button>
                <span className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] text-[#0A0C10]/45">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {siteConfig.download.requirements}
                </span>
              </div>

              {/* 校验信息默认折叠：既专业可验证，又不破坏下载区留白 */}
              <details className="glass-panel-soft group mt-6 rounded-2xl px-4 py-3">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[12px] font-medium text-[#0A0C10]/68 transition-colors hover:text-[#0A0C10]">
                  <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[#0A0C10]/70" />
                    SHA-256 校验与签名验证命令
                  </span>
                  <ChevronDown className="h-4 w-4 text-[#0A0C10]/50 transition-transform duration-200 group-open:rotate-180" />
                </summary>
                <div className="mt-3 border-t border-[#0A0C10]/[0.08] pt-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#0A0C10]/45">
                      SHA-256 DIGEST
                    </span>
                    <button
                      type="button"
                      onClick={copySha}
                      className="rounded-full border border-[#0A0C10]/14 bg-white/80 px-2.5 py-0.5 font-mono text-[10px] text-[#0A0C10]/75 transition-colors hover:border-[#0A0C10]/30 hover:text-[#0A0C10]"
                    >
                      {copiedSha ? '已复制' : '复制校验码'}
                    </button>
                  </div>
                  <div className="mt-1.5 break-all font-mono text-[11px] leading-[1.65] text-[#0A0C10]/80">
                    {release.sha256 || '—'}
                  </div>
                  <div className="mt-2 break-all rounded-lg bg-[#0A0C10]/[0.04] px-2.5 py-2 font-mono text-[10.5px] leading-[1.6] text-[#0A0C10]/60">
                    apksigner verify --print-certs CloudTrace_{release.version.replace('v', '')}_arm64-v8a_release.apk
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                    <a
                      href={release.releaseUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="font-mono text-[11px] font-medium text-[#0A0C10] underline decoration-[#0A0C10]/25 underline-offset-4 hover:decoration-[#0A0C10]"
                    >
                      全部版本 / 更新日志
                    </a>
                    <span className="font-mono text-[10px] text-[#0A0C10]/45">
                      与 App 内更新共用同一份签名清单
                    </span>
                  </div>
                </div>
              </details>
            </div>
          </Reveal>

          {/* ---------------- 右侧：物理弹簧挂绳通行证 ---------------- */}
          <Reveal delay={0.08}>
            <div className="relative h-[540px] w-full sm:h-[600px]">
              {/* 柔和摄影棚白光背板，让卡片在流动镀铬背景上立体悬浮 */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-10 bottom-10 top-14 -z-10 rounded-[50%] bg-white/80 blur-[70px]"
              />
              <LanyardPass image={front} />
              <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center">
                <span className="glass-panel-soft rounded-full px-3.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0A0C10]/55">
                  按住拖拽或轻甩通行证
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
