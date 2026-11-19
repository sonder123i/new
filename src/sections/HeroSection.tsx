import { useEffect, useState } from 'react';
import { ArrowDownToLine, ArrowUpRight } from 'lucide-react';
import { GithubGlyph } from '@/components/common/icons';
import { motion } from 'motion/react';
import LightRays from '@/components/reactbits/LightRays';
import Magnet from '@/components/reactbits/Magnet';
import Particles from '@/components/reactbits/Particles';
import ShinyText from '@/components/reactbits/ShinyText';
import SplitText from '@/components/reactbits/SplitText';
import StarBorder from '@/components/reactbits/StarBorder';
import TiltedCard from '@/components/reactbits/TiltedCard';
import { MockupFrame } from '@/components/common/MockupFrame';
import { usePerformance } from '@/components/common/PerformanceContext';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import { useLatestRelease } from '@/hooks/useLatestRelease';
import { siteConfig } from '@/config/siteConfig';

export function HeroSection() {
  const { capability, isFlagship } = usePerformance();
  const release = useLatestRelease();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const particleCount = capability.isCoarsePointer ? 46 : 96;

  return (
    <section id="top" className="relative isolate overflow-hidden pb-24 pt-28 sm:pb-32 lg:min-h-screen lg:pt-0">
      {/* ---------------- 底层氛围 ---------------- */}
      <div className="absolute inset-0 -z-10 bg-[#050507]">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 42% at 68% 8%, rgba(56,189,248,0.1), transparent 62%), radial-gradient(52% 44% at 16% 76%, rgba(129,140,248,0.07), transparent 66%), radial-gradient(90% 70% at 50% 120%, rgba(255,255,255,0.04), transparent 70%)',
          }}
        />
        <div className="absolute inset-x-0 top-0 h-[78vh] opacity-70">
          {mounted && isFlagship ? (
            <ViewportLazyMount className="h-full w-full" placeholder={null}>
                <div className="absolute inset-0 opacity-[0.8]">
                <LightRays
                    raysOrigin="top-center"
                    raysColor="#E2E8F0"
                    raysSpeed={0.55}
                    lightSpread={0.7}
                    rayLength={1.55}
                    rayDensity={1.05}
                    raySharpness={0.5}
                    glow={0.55}
                    haze={0.42}
                    atmosphere={0.5}
                    intensity={0.95}
                    saturation={0.15}
                    followMouse
                    mouseInfluence={0.12}
                    pulsating={false}
                    noiseAmount={0.12}
                    distortion={0.15}
                    fadeDistance={1}
                />
              </div>
            </ViewportLazyMount>
          ) : (
            <div
              className="h-full w-full"
              style={{
                background:
                  'conic-gradient(from 190deg at 50% -10%, transparent 0deg, rgba(226,232,240,0.14) 16deg, transparent 34deg, transparent 356deg)',
                filter: 'blur(18px)',
              }}
            />
          )}
        </div>

        <div className="absolute inset-0 opacity-[0.55]">
          {mounted && isFlagship ? (
            <ViewportLazyMount className="h-full w-full">
              <Particles
                particleCount={particleCount}
                particleSpread={12}
                speed={0.16}
                particleColors={['#E2E8F0', '#7DD3FC', '#A5B4FC']}
                moveParticlesOnHover={capability.allowCursorFx}
                particleHoverFactor={0.6}
                alphaParticles
                particleBaseSize={56}
                sizeRandomness={1.6}
                cameraDistance={26}
                disableRotation={false}
                pixelRatio={1}
                glow={0.65}
                twinkle={0.8}
                depthOfField={0.7}
                connections={false}
                drift="up"
              />
            </ViewportLazyMount>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-[46vh] grid-floor opacity-60" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#050507] to-transparent" />
      </div>

      <div className="mx-auto grid w-full max-w-[1240px] items-center gap-16 px-6 pb-10 pt-24 sm:px-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-10 lg:pb-0 lg:pt-32">
        {/* ---------------- 左侧叙事 ---------------- */}
        <div className="relative z-10 max-w-[660px]">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] py-1.5 pl-2.5 pr-4 backdrop-blur-md"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#38BDF8] opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#7DD3FC]" />
            </span>
            <ShinyText
              text={siteConfig.hero.eyebrow}
              color="#9aa0a8"
              shineColor="#F5F5F7"
              speed={5}
              angle={105}
              shineWidth={28}
              className="whitespace-nowrap text-[10.5px] tracking-[0.02em] sm:text-[12px]"
            />
          </motion.div>

          <div className="mt-7 flex items-center gap-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/32">
              {siteConfig.brand.nameEn}
            </span>
            <span className="h-px w-12 bg-white/15" />
            <span className="font-mono text-[11px] tracking-[0.14em] text-[#7DD3FC]/70">VISION · 4.0</span>
          </div>

          <h1 className="mt-4">
            <span className="sr-only">
              {siteConfig.brand.nameZh} · {siteConfig.brand.nameEn} —— {siteConfig.brand.tagline}
            </span>
            <SplitText
              text="将精密光学"
              tag="span"
              className="block text-[clamp(38px,5.1vw,62px)] font-[560] leading-[1.08] tracking-[-0.045em] text-[#F5F5F7]"
              splitType="chars"
              delay={34}
              duration={1.1}
              ease="power4.out"
              from={{ opacity: 0, y: 46, rotateX: -55, filter: 'blur(8px)' }}
              to={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              threshold={0}
              trigger="load"
              textAlign="left"
            />
            <SplitText
              text="与液态玻璃，"
              tag="span"
              className="block text-[clamp(38px,5.1vw,62px)] font-[560] leading-[1.08] tracking-[-0.045em] text-[#F5F5F7]"
              splitType="chars"
              delay={30}
              duration={1.1}
              ease="power4.out"
              from={{ opacity: 0, y: 46, rotateX: -55, filter: 'blur(8px)' }}
              to={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              threshold={0}
              trigger="load"
              textAlign="left"
            />
            <SplitText
              text="注入每一段轨迹。"
              tag="span"
              className="block text-[clamp(38px,5.1vw,62px)] font-[560] leading-[1.12] tracking-[-0.045em] text-[#9CA3AF]"
              splitType="chars"
              delay={30}
              duration={1.15}
              ease="power4.out"
              from={{ opacity: 0, y: 46, rotateX: -55, filter: 'blur(8px)' }}
              to={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
              threshold={0}
              trigger="load"
              textAlign="left"
            />
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-[560px] text-[14.5px] leading-[1.9] text-white/48 sm:text-[15.5px]"
          >
            {siteConfig.brand.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnet padding={40} magnetStrength={3.2} disabled={!capability.allowCursorFx}>
              <StarBorder
                as="a"
                href="#download"
                color="#7DD3FC"
                trailColor="#E2E8F0"
                thickness={1}
                radius={999}
                duration={5}
                glow={0.7}
                sparkle
                className="group flex h-[54px] items-center gap-2.5 rounded-full bg-[#F5F5F7] px-6 text-[#08090C] shadow-[0_18px_40px_-16px_rgba(255,255,255,0.35)] transition-transform duration-500 hover:scale-[1.015] active:scale-[0.99]"
                aria-label={siteConfig.hero.primaryCta}
              >
                <ArrowDownToLine className="h-4 w-4" />
                <span className="text-[13.5px] font-semibold tracking-[-0.01em]">{siteConfig.hero.primaryCta}</span>
                <span className="rounded-full bg-[#08090C]/8 px-2 py-0.5 font-mono text-[10px] tracking-[0.02em] text-[#08090C]/55">
                  {release.loading ? '···' : release.version}
                </span>
              </StarBorder>
            </Magnet>

            <a
              href={`https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="glass-panel group flex h-[54px] items-center justify-center gap-2 rounded-full px-6 text-[13.5px] font-medium text-white/78 transition-colors hover:text-white"
            >
              <GithubGlyph className="h-4 w-4 opacity-70" />
              {siteConfig.hero.secondaryCta}
              <ArrowUpRight className="h-3.5 w-3.5 opacity-40 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </motion.div>

          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2">
            {siteConfig.hero.hints.map((hint) => (
              <span key={hint} className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/28">
                <span className="h-1 w-1 rounded-full bg-[#38BDF8]/70" />
                {hint}
              </span>
            ))}
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/28">GPL-3.0 · OPEN SOURCE</span>
          </div>
        </div>

        {/* ---------------- 右侧真机 ---------------- */}
        <div className="relative z-10 lg:pl-6">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 opacity-40 blur-[70px]">
            <div className="h-full w-full rounded-full bg-[conic-gradient(from_160deg,rgba(56,189,248,0.35),rgba(129,140,248,0.22)_35%,transparent_60%,rgba(56,189,248,0.3))]" />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 38, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.3, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative mx-auto w-full max-w-[336px]"
          >
            <div className="absolute -inset-x-6 -top-6 bottom-0 -z-10 rounded-[60px] border border-white/[0.06]" />
            <div className="absolute -inset-x-12 -top-12 bottom-8 -z-10 rounded-[80px] border border-white/[0.035]" />

            <div className="relative aspect-[390/844] w-full animate-float [animation-duration:9s]">
              <TiltedCard
                containerWidth="100%"
                containerHeight="100%"
                imageWidth="100%"
                imageHeight="100%"
                rotateAmplitude={8}
                scaleOnHover={1.025}
                showTooltip={false}
                flipOnClick={false}
                className="h-full w-full"
                style={{ perspective: '1100px' }}
              >
                <MockupFrame className="h-full w-full aspect-auto" glare>
                  <PhoneScreen variant={siteConfig.hero.screen} />
                </MockupFrame>
              </TiltedCard>
            </div>

            <div className="glass-panel absolute -right-4 top-[14%] z-30 hidden items-center gap-2 rounded-2xl px-3 py-2 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] sm:flex sm:-right-8">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#38BDF8]/12">
                <span className="h-1.5 w-1.5 rounded-full bg-[#7DD3FC] animate-pulse-dot" />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/32">REFRACTION</span>
                <span className="mt-1 font-mono text-[11px] text-white/80 tabular">AGSL · 120 Hz</span>
              </span>
            </div>

            <div className="glass-panel absolute -left-3 bottom-[18%] z-30 hidden flex-col gap-1 rounded-2xl px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(0,0,0,0.9)] sm:flex sm:-left-8">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">LIVE TELEMETRY</span>
              <div className="flex items-baseline gap-1.5">
                <span className="font-mono text-[19px] font-light leading-none text-white tabular">0.85</span>
                <span className="font-mono text-[10px] text-white/40">km</span>
                <span className="ml-1.5 font-mono text-[10px] text-[#7DD3FC]/80">5'40"</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-7 hidden justify-center lg:flex">
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-white/22">scroll</span>
          <span className="relative h-10 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-4 animate-scan bg-gradient-to-b from-transparent via-[#7DD3FC]/80 to-transparent" />
          </span>
        </div>
      </div>
    </section>
  );
}
