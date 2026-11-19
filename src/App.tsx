import { useEffect, useRef } from 'react';
import { MotionConfig } from 'motion/react';
import { PerformanceProvider } from '@/components/common/PerformanceContext';
import { TopGlassNav } from '@/components/layout/TopGlassNav';
import { BentoFeatures } from '@/sections/BentoFeatures';
import { DownloadAndLanyard } from '@/sections/DownloadAndLanyard';
import { HeroSection } from '@/sections/HeroSection';
import { OpticalGallery } from '@/sections/OpticalGallery';
import { PressureFooter } from '@/sections/PressureFooter';
import { TelemetryMarquee } from '@/sections/TelemetryMarquee';
import { WorkflowShowcase } from '@/sections/WorkflowShowcase';

/** 直接操作 DOM transform，滚动期间 0 次 React 重渲染 */
function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const bar = barRef.current;
      if (!bar) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[75] h-px bg-white/[0.04]">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-white/30 via-white/75 to-white will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

function Shell() {
  return (
    <>
      <ScrollProgress />
      <TopGlassNav />
      <main className="relative">
        {/* 首屏立即启动，零阻塞 */}
        <HeroSection started />
        <TelemetryMarquee />
        <BentoFeatures />
        <WorkflowShowcase />
        <OpticalGallery />
        <DownloadAndLanyard />
      </main>
      <PressureFooter />
      {/* 如果必须保留 FloatingDock，建议仅在移动端显示，或删掉 TopGlassNav 里的链接避免上下双导航夹击 */}
    </>
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
