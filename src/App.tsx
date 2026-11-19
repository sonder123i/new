import { useEffect, useRef, useState } from 'react';
import { MotionConfig } from 'motion/react';
import ClickSpark from '@/components/reactbits/ClickSpark';
import {
  OpticalFlowBackdrop,
  type BackdropMaterial,
} from '@/components/background/OpticalFlowBackdrop';
import { PerformanceProvider, usePerformance } from '@/components/common/PerformanceContext';
import { FloatingDock } from '@/components/layout/FloatingDock';
import { TopGlassNav } from '@/components/layout/TopGlassNav';
import { BentoFeatures } from '@/sections/BentoFeatures';
import { DownloadAndLanyard } from '@/sections/DownloadAndLanyard';
import { HeroSection } from '@/sections/HeroSection';
import { OpticalGallery } from '@/sections/OpticalGallery';
import { PressureFooter } from '@/sections/PressureFooter';
import { TelemetryMarquee } from '@/sections/TelemetryMarquee';
import { WorkflowShowcase } from '@/sections/WorkflowShowcase';

/** 顶部 1.5px 墨银进度线（直接写 DOM transform，滚动 0 次 React 重渲染） */
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
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[80] h-[1.5px] bg-[#0A0C10]/[0.05]">
      <div
        ref={barRef}
        className="h-full origin-left bg-gradient-to-r from-[#0A0C10]/30 via-[#0A0C10]/75 to-[#0A0C10] will-change-transform"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

/** 底部浅色瓷白融焦遮罩（GradualBlur 风格，让内容丝滑没入底部 Dock） */
function BottomPorcelainFade() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[45] h-20 bg-gradient-to-t from-[#F3F5F8]/90 via-[#F3F5F8]/45 to-transparent"
    />
  );
}

function Shell() {
  const { capability, isFlagship, toggle } = usePerformance();
  const [material, setMaterial] = useState<BackdropMaterial>('chrome');
  const isEco = !isFlagship;

  return (
    <ClickSpark
      sparkColor={['#0A0C10', '#475569', '#94A3B8']}
      sparkCount={9}
      sparkRadius={18}
      sparkSize={5.5}
      sparkWidth={1.35}
      duration={440}
      glow={0.18}
      disabled={isEco || !capability.allowCursorFx}
    >
      <OpticalFlowBackdrop material={material} eco={isEco} />
      <ScrollProgress />
      <TopGlassNav
        material={material}
        onMaterialChange={setMaterial}
        eco={isEco}
        onToggleEco={toggle}
      />

      <main className="relative z-10">
        {/* 首屏直接呈现，彻底移除阻塞式黑屏幕布 */}
        <HeroSection started />
        <TelemetryMarquee />
        <BentoFeatures />
        <WorkflowShowcase />
        <OpticalGallery />
        <DownloadAndLanyard />
      </main>

      <PressureFooter />
      <BottomPorcelainFade />
      <FloatingDock />

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
