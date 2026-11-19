import { ArrowUp, Images, Sparkles, Zap, BatteryCharging } from 'lucide-react';
import { GithubGlyph } from '@/components/common/icons';
import Dock from '@/components/reactbits/Dock';
import { usePerformance } from '@/components/common/PerformanceContext';
import { siteConfig } from '@/config/siteConfig';

export function FloatingDock() {
  const { isFlagship, toggle } = usePerformance();

  const scrollTo = (selector: string) => {
    document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[55] hidden h-0 justify-center md:flex">
      <div className="pointer-events-auto">
        <Dock
          position="bottom"
          theme="light"
          baseItemSize={42}
          magnification={60}
          panelHeight={54}
          distance={180}
          gap={6}
          roundness={0.85}
          showLabels
          accentColor="#0A0C10"
          items={[
            {
              label: '返回顶部',
              icon: <ArrowUp className="h-4 w-4" />,
              onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
            },
            {
              label: '核心特性',
              icon: <Sparkles className="h-4 w-4" />,
              onClick: () => scrollTo('#features'),
            },
            {
              label: '实机画廊',
              icon: <Images className="h-4 w-4" />,
              onClick: () => scrollTo('#gallery'),
            },
            {
              label: 'GitHub',
              icon: <GithubGlyph className="h-4 w-4" />,
              onClick: () =>
                window.open(
                  `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`,
                  '_blank',
                  'noopener,noreferrer',
                ),
            },
            {
              label: isFlagship ? '切换流畅模式' : '切换旗舰光学',
              active: !isFlagship,
              icon: isFlagship ? <Zap className="h-4 w-4" /> : <BatteryCharging className="h-4 w-4" />,
              onClick: toggle,
            },
          ]}
        />
      </div>
    </div>
  );
}
