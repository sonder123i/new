import { ArrowDownToLine, ArrowUpRight, Layers, ShieldCheck, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { GithubGlyph } from '@/components/common/icons';
import { MockupFrame } from '@/components/common/MockupFrame';
import { usePerformance } from '@/components/common/PerformanceContext';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import Magnet from '@/components/reactbits/Magnet';
import ShinyText from '@/components/reactbits/ShinyText';
import StarBorder from '@/components/reactbits/StarBorder';
import TiltedCard from '@/components/reactbits/TiltedCard';
import { siteConfig } from '@/config/siteConfig';
import { useLatestRelease } from '@/hooks/useLatestRelease';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroSection({ started = true }: { started?: boolean }) {
  const { capability } = usePerformance();
  const release = useLatestRelease();

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pb-20 pt-28 sm:pb-28 lg:flex lg:min-h-[96vh] lg:items-center lg:py-28"
    >
      {/* 极轻测绘网格叠层：完全透明以透出全局 WebGL 流动液态镀铬/真丝背景 */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[44vh] grid-floor opacity-65" />

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 px-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        {/* ---------------- 左侧：瑞士编辑叙事 ---------------- */}
        <div className="relative z-10 max-w-[630px]">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.55, ease: EASE_OUT }}
            className="glass-panel-soft inline-flex items-center gap-2.5 rounded-full py-1.5 pl-3 pr-4"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#0A0C10] animate-pulse-dot" />
            <ShinyText
              text={siteConfig.hero.eyebrow}
              color="#475569"
              shineColor="#0A0C10"
              speed={4.5}
              angle={105}
              shineWidth={30}
              className="whitespace-nowrap text-[11.5px] font-medium tracking-[0.02em]"
            />
            <span className="h-3 w-px bg-[#0A0C10]/15" />
            <span className="font-mono text-[10.5px] tracking-[0.08em] text-[#0A0C10]/55 tabular">
              {release.loading ? 'v4' : release.version}
            </span>
          </motion.div>

          {/* 瑞士编辑双语标尺 */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.55, delay: 0.05, ease: EASE_OUT }}
            className="mt-7 flex items-center gap-3"
          >
            <span className="font-mono text-[11px] uppercase tracking-[0.26em] text-[#0A0C10]/45">
              {siteConfig.brand.nameEn}
            </span>
            <span className="h-px w-10 bg-[#0A0C10]/20" />
            <span className="font-editorial text-[16px] text-[#0A0C10]/65">Optical Motion Instrument</span>
          </motion.div>

          <h1 className="mt-4">
            <span className="sr-only">
              {siteConfig.brand.nameZh} · {siteConfig.brand.nameEn} —— {siteConfig.brand.tagline}
            </span>
            {[
              { text: '将精密光学', className: 'text-[#0A0C10]' },
              { text: '与液态玻璃，', className: 'text-chrome-gradient' },
              { text: '注入每一段轨迹。', className: 'text-[#0A0C10]/45' },
            ].map((line, index) => (
              <span key={line.text} className="block overflow-hidden">
                <motion.span
                  initial={{ opacity: 0, y: '34%' }}
                  animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: '34%' }}
                  transition={{ duration: 0.66, delay: 0.08 + index * 0.075, ease: EASE_OUT }}
                  className={`display block text-[clamp(38px,5vw,64px)] ${line.className}`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.6, delay: 0.28, ease: EASE_OUT }}
            className="mt-6 max-w-[530px] text-[15px] leading-[1.82] text-[#0A0C10]/65 sm:text-[16px]"
          >
            {siteConfig.brand.description}
          </motion.p>

          {/* 主次 CTA：曜石黑磁吸流光主按钮 + 液态瓷白玻璃副按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
            transition={{ duration: 0.6, delay: 0.36, ease: EASE_OUT }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnet padding={34} magnetStrength={3.4} disabled={!capability.allowCursorFx}>
              <StarBorder
                as="a"
                href={release.downloadUrl}
                color="#94A3B8"
                trailColor="#FFFFFF"
                thickness={1.2}
                radius={999}
                duration={5.2}
                glow={0.35}
                sparkle={false}
                className="group flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#0A0C10] px-6 text-white shadow-[0_18px_38px_-14px_rgba(10,12,16,0.45)] transition-transform duration-300 hover:scale-[1.015] active:scale-[0.985]"
                aria-label={siteConfig.hero.primaryCta}
              >
                <ArrowDownToLine className="h-4 w-4" />
                <span className="text-[14px] font-semibold tracking-[-0.01em]">{siteConfig.hero.primaryCta}</span>
                <span className="rounded-full bg-white/14 px-2 py-0.5 font-mono text-[10.5px] text-white/80 tabular">
                  {release.loading ? '···' : release.version}
                </span>
              </StarBorder>
            </Magnet>

            <a
              href={`https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-panel group flex h-[52px] items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium text-[#0A0C10]/85 transition-all duration-300 hover:bg-white/90 hover:text-[#0A0C10]"
            >
              <GithubGlyph className="h-4 w-4 opacity-80" />
              {siteConfig.hero.secondaryCta}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-45 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          {/* 精密规格底条 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mt-9 grid grid-cols-3 gap-3 border-t border-[#0A0C10]/10 pt-5"
          >
            {[
              { icon: Sparkles, label: '光学刷新率', value: '120Hz AGSL' },
              { icon: Layers, label: '操场套模精度', value: '±1.0 m' },
              { icon: ShieldCheck, label: '数据主权', value: '纯本地开源' },
            ].map((spec) => (
              <div key={spec.label} className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.12em] text-[#0A0C10]/45">
                  <spec.icon className="h-3 w-3 opacity-70" />
                  {spec.label}
                </span>
                <span className="font-mono text-[13px] font-medium text-[#0A0C10]/88 tabular">{spec.value}</span>
              </div>
            ))}
          </motion.div>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
            {siteConfig.hero.hints.map((hint) => (
              <span
                key={hint}
                className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.06em] text-[#0A0C10]/45"
              >
                <span className="h-1 w-1 rounded-full bg-[#0A0C10]/35" />
                {hint}
              </span>
            ))}
            <span className="font-mono text-[10.5px] tracking-[0.06em] text-[#0A0C10]/40">GPL-3.0 · OPEN SOURCE</span>
          </div>
        </div>

        {/* ---------------- 右侧：钛银 3D 真机与陶瓷悬浮标本卡 ---------------- */}
        <div className="relative z-10 flex justify-center lg:justify-end">
          {/* 摄影棚冷白柔和背光，衬托钛银中框立体感 */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[440px] w-[440px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 blur-[70px]"
            style={{
              background:
                'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(203,213,225,0.28) 65%, transparent 100%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={started ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.78, delay: 0.14, ease: EASE_OUT }}
            className="relative w-full max-w-[330px]"
          >
            {/* 建筑图注标号 */}
            <div className="mb-3 hidden items-center justify-between px-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0C10]/40 sm:flex">
              <span>FIG. 01 — DEVICE SPECIMEN</span>
              <span className="tabular">390 × 844</span>
            </div>

            <div className="relative aspect-[390/844] w-full">
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                rotateAmplitude={6}
                scaleOnHover={1.018}
                showTooltip={false}
                flipOnClick={false}
                className="h-full w-full"
                style={{ perspective: '1200px' }}
              >
                <MockupFrame className="aspect-auto h-full w-full" glare>
                  <PhoneScreen variant={siteConfig.hero.screen} />
                </MockupFrame>
              </TiltedCard>
            </div>

            {/* 左下角：高透瓷白光学遥测浮卡 */}
            <div className="glass-panel absolute -left-8 bottom-[13%] z-30 hidden flex-col gap-1 rounded-2xl px-4 py-3 sm:flex">
              <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[#0A0C10]/45">
                LIVE TELEMETRY
              </span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[20px] font-semibold leading-none text-[#0A0C10] tabular">0.85</span>
                <span className="font-mono text-[10.5px] text-[#0A0C10]/50">km</span>
                <span className="ml-1 rounded-full bg-[#0A0C10]/[0.06] px-2 py-0.5 font-mono text-[10px] text-[#0A0C10]/75 tabular">
                  5&apos;40&quot;
                </span>
              </div>
            </div>

            {/* 右上角：曜石黑反差胶囊（呼应 visionOS 悬浮岛） */}
            <div className="glass-obsidian absolute -right-7 top-[16%] z-30 hidden items-center gap-2.5 rounded-full px-3.5 py-2 sm:flex">
              <span className="h-2 w-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.85)]" />
              <span className="font-mono text-[10.5px] tracking-[0.08em] text-white/90 tabular">AGSL · 120Hz</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
