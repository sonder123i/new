import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'motion/react';
import ClickSpark from '@/components/reactbits/ClickSpark';
import { PerformanceProvider, usePerformance } from '@/components/common/PerformanceContext';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { TopGlassNav } from '@/components/layout/TopGlassNav';
import { OpeningCurtain } from '@/motion/OpeningCurtain';
import { BentoFeatures } from '@/sections/BentoFeatures';
import { DownloadAndLanyard } from '@/sections/DownloadAndLanyard';
import { HeroSection } from '@/sections/HeroSection';
import { OpticalGallery } from '@/sections/OpticalGallery';
import { PressureFooter } from '@/sections/PressureFooter';
import { TelemetryMarquee } from '@/sections/TelemetryMarquee';
import { WorkflowShowcase } from '@/sections/WorkflowShowcase';

function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-[2px] bg-transparent">
      <div
        className="h-full origin-left bg-gradient-to-r from-[#38BDF8] via-[#7DD3FC] to-[#818CF8] shadow-[0_0_12px_rgba(56,189,248,0.6)] transition-transform duration-150 ease-out"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
}

function Shell() {
  const { capability } = usePerformance();
  const [opened, setOpened] = useState(false);
  const handleOpened = useCallback(() => setOpened(true), []);

  return (
    <ClickSpark
      sparkColor={['#38BDF8', '#E2E8F0']}
      sparkCount={10}
      sparkRadius={18}
      sparkSize={6}
      sparkWidth={1.4}
      duration={480}
      glow={0.35}
      disabled={!capability.allowCursorFx}
    >
      <OpeningCurtain onDone={handleOpened} />
      <ScrollProgress />
      <TopGlassNav />
      <main className="relative">
        <HeroSection started={opened} />
        <TelemetryMarquee />
        <BentoFeatures />
        <WorkflowShowcase />
        <OpticalGallery />
        <DownloadAndLanyard />
      </main>
      <PressureFooter />
      <FloatingDock />

      {/* 移动端底部安全区，避免 Dock 收起的区域遮挡内容 */}
      <div className="h-[env(safe-area-inset-bottom)]" />
    </ClickSpark>
  );
}

export default function App() {
  return (
    <PerformanceProvider>
      <MotionConfig reducedMotion="user">
        <Shell />
      </MotionConfig>
    </PerformanceProvider>
  );
}
