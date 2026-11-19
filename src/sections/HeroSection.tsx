import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { GithubGlyph } from '@/components/common/icons';
import { motion } from 'motion/react';
import LightRays from '@/components/reactbits/LightRays';
import TiltedCard from '@/components/reactbits/TiltedCard';
import { MockupFrame } from '@/components/common/MockupFrame';
import { usePerformance } from '@/components/common/PerformanceContext';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import { useLatestRelease } from '@/hooks/useLatestRelease';
import { siteConfig } from '@/config/siteConfig';

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export function HeroSection({ started = true }: { started?: boolean }) {
  const { isFlagship } = usePerformance();
  const release = useLatestRelease();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <section
      id="top"
      className="relative isolate overflow-hidden pb-20 pt-24 sm:pb-28 lg:flex lg:min-h-[92vh] lg:items-center lg:py-24"
    >
      {/* ---------------- 底层氛围：全屏唯一 WebGL 光学主光 ---------------- */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[#050507]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(58% 48% at 72% 18%, rgba(255,255,255,0.065), transparent 64%), radial-gradient(48% 42% at 18% 72%, rgba(226,232,240,0.03), transparent 68%)',
          }}
        />
        <div
          className="absolute inset-x-0 top-0 h-[72vh] opacity-45"
          style={{
            maskImage: 'radial-gradient(ellipse 80% 75% at 50% 0%, #000 35%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 75% at 50% 0%, #000 35%, transparent 100%)',
          }}
        >
          {mounted && isFlagship ? (
            <ViewportLazyMount className="h-full w-full" placeholder={null}>
              <LightRays
                raysOrigin="top-center"
                raysColor="#E4E4E7"
                raysSpeed={0.26}
                lightSpread={0.62}
                rayLength={1.35}
                rayDensity={0.85}
                raySharpness={0.45}
                glow={0.35}
                haze={0.32}
                atmosphere={0.35}
                intensity={0.7}
                saturation={0}
                followMouse={false}
                pulsating={false}
                noiseAmount={0.05}
                distortion={0.08}
                fadeDistance={1}
              />
            </ViewportLazyMount>
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  'conic-gradient(from 195deg at 50% -10%, transparent 0deg, rgba(255,255,255,0.1) 14deg, transparent 32deg)',
                filter: 'blur(24px)',
              }}
            />
          )}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#050507] to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-[1200px] items-center gap-14 px-6 sm:px-8 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
        {/* ---------------- 左侧叙事 ---------------- */}
        <div className="relative z-10 max-w-[620px]">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/[0.1] bg-white/[0.04] px-3.5 py-1.5 backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white/85" />
            <span className="text-[12px] tracking-[0.01em] text-white/75">{siteConfig.hero.eyebrow}</span>
            <span className="h-3 w-px bg-white/12" />
            <span className="font-mono text-[11px] tracking-[0.08em] text-white/45">
              {release.loading ? 'v4' : release.version}
            </span>
          </motion.div>

          <h1 className="mt-7">
            <span className="sr-only">
              {siteConfig.brand.nameZh} · {siteConfig.brand.nameEn} —— {siteConfig.brand.tagline}
            </span>
            {[
              { text: '将精密光学', tone: 'text-[#F5F5F7]' },
              { text: '与液态玻璃，', tone: 'text-[#F5F5F7]' },
              { text: '注入每一段轨迹。', tone: 'text-white/50' },
            ].map((line, index) => (
              <span key={line.text} className="block overflow-hidden">
                <motion.span
                  initial={{ opacity: 0, y: '28%' }}
                  animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: '28%' }}
                  transition={{ duration: 0.62, delay: 0.06 + index * 0.07, ease: EASE_OUT }}
                  className={`block text-[clamp(36px,4.8vw,60px)] font-semibold leading-[1.16] tracking-[-0.03em] ${line.tone}`}
                >
                  {line.text}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.58, delay: 0.24, ease: EASE_OUT }}
            className="mt-6 max-w-[520px] text-[15px] leading-[1.8] text-white/62 sm:text-[16px]"
          >
            {siteConfig.brand.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            transition={{ duration: 0.58, delay: 0.32, ease: EASE_OUT }}
            className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a
              href={release.downloadUrl}
              aria-label={siteConfig.hero.primaryCta}
              className="group flex h-[50px] items-center justify-center gap-2.5 rounded-full bg-[#F5F5F7] px-6 text-[#08090C] shadow-[0_14px_34px_-14px_rgba(255,255,255,0.45)] transition-all duration-300 hover:bg-white active:scale-[0.985]"
            >
              <ArrowDownToLine className="h-4 w-4" />
              <span className="text-[14px] font-semibold tracking-[-0.01em]">{siteConfig.hero.primaryCta}</span>
              <span className="rounded-full bg-black/[0.08] px-2 py-0.5 font-mono text-[10.5px] text-black/60">
                {release.loading ? '···' : release.version}
              </span>
            </a>

            <a
              href={`https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-panel group flex h-[50px] items-center justify-center gap-2 rounded-full px-6 text-[14px] font-medium text-white/82 transition-colors hover:border-white/20 hover:text-white"
            >
              <GithubGlyph className="h-4 w-4 opacity-80" />
              {siteConfig.hero.secondaryCta}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-50 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={started ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.42 }}
            className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/[0.07] pt-5"
          >
            {siteConfig.hero.hints.map((hint) => (
              <span key={hint} className="flex items-center gap-2 font-mono text-[11px] tracking-[0.06em] text-white/48">
                <span className="h-1 w-1 rounded-full bg-white/45" />
                {hint}
              </span>
            ))}
            <span className="font-mono text-[11px] tracking-[0.06em] text-white/42">GPL-3.0 · 纯本地开源</span>
          </motion.div>
        </div>

        {/* ---------------- 右侧真机：去冗余外圈与漂浮，突出设备质感 ---------------- */}
        <div className="relative z-10 flex justify-center lg:justify-end">
          <div
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-35 blur-[80px]"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.16), transparent 68%)',
            }}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={started ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 20, scale: 0.98 }}
            transition={{ duration: 0.72, delay: 0.14, ease: EASE_OUT }}
            className="relative w-full max-w-[320px]"
          >
            <div className="relative aspect-[390/844] w-full">
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                rotateAmplitude={5}
                scaleOnHover={1.015}
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

            {/* 精简为 1 个克制的实时遥测浮岛，避免左右包夹 */}
            <div className="glass-panel absolute -left-8 bottom-[14%] z-30 hidden items-center gap-3 rounded-2xl px-3.5 py-2.5 sm:flex">
              <div className="flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-white/45">AGSL · 120Hz</span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="font-mono text-[18px] font-medium leading-none text-white tabular">0.85</span>
                  <span className="font-mono text-[10.5px] text-white/50">km · 5&apos;40&quot;</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
