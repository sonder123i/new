import { useEffect, useState } from 'react';
import { MoveHorizontal } from 'lucide-react';
import CircularGallery, { type GalleryItem } from '@/components/reactbits/CircularGallery';
import { usePerformance } from '@/components/common/PerformanceContext';
import { MockupFrame } from '@/components/common/MockupFrame';
import { Reveal, SectionHeader } from '@/components/common/SectionHeader';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

const base = import.meta.env.BASE_URL;

const items: GalleryItem[] = siteConfig.gallery.items.map((item) => ({
  image: `${base}${siteConfig.screenshots[`shot-${item.screen}`] ?? siteConfig.screenshots['shot-home']}`,
  text: item.title,
  description: item.meta,
  alt: `${siteConfig.brand.nameZh} ${item.title}`,
}));

export function OpticalGallery() {
  const { isFlagship, capability } = usePerformance();
  const [active, setActive] = useState(0);
  const [wide, setWide] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches,
  );

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const useWebglGallery = isFlagship && wide && !capability.isCoarsePointer;
  const activeItem = siteConfig.gallery.items[active] ?? siteConfig.gallery.items[0];

  return (
    <section id="gallery" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <SectionHeader
          index="05"
          eyebrow="OPTICAL GALLERY"
          align="center"
          title="实机界面画廊"
          description={siteConfig.gallery.subtitle}
        />

        <div className="relative mt-12 h-[540px] w-full sm:h-[580px]">
          {useWebglGallery ? (
            <ViewportLazyMount className="h-full w-full" rootMargin="240px 0px">
              <CircularGallery
                items={items}
                bend={1.0}
                textColor="#F5F5F7"
                borderRadius={0.07}
                scrollSpeed={1.6}
                scrollEase={0.08}
                itemSize={1.24}
                itemAspect={390 / 844}
                gap={0.09}
                wave={0.16}
                fadeEdges={0.18}
                shadow={0.28}
                grayscale={false}
                showTitles={false}
                snap
                autoScroll={0}
                intro={false}
                onActiveChange={setActive}
                dpr={Math.min(1.5, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
                className="h-full w-full"
              />
            </ViewportLazyMount>
          ) : (
            <div className="no-scrollbar flex h-full snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 pt-2">
              {siteConfig.gallery.items.map((item, index) => (
                <div
                  key={item.title}
                  className="w-[66%] shrink-0 snap-center sm:w-[42%] lg:w-[30%]"
                  onPointerEnter={() => setActive(index)}
                >
                  <div className="glass-panel rounded-[26px] p-2.5">
                    <MockupFrame className="w-full">
                      <PhoneScreen variant={item.screen} />
                    </MockupFrame>
                  </div>
                  <div className="mt-3 flex items-center justify-between px-1">
                    <span className="text-[13px] font-medium text-white/85">{item.title}</span>
                    <span className="font-mono text-[10.5px] text-white/45">{item.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 底部状态与索引：清晰展示当前帧信息，避免假按钮 */}
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5">
            <div className="flex items-center gap-3">
              <span className="font-mono text-[11px] tabular text-white/45">
                {String(active + 1).padStart(2, '0')} / {String(siteConfig.gallery.items.length).padStart(2, '0')}
              </span>
              <span className="h-3.5 w-px bg-white/12" />
              <span className="text-[14px] font-medium text-white/90">{activeItem?.title}</span>
              <span className="hidden text-[13px] text-white/50 sm:inline">{activeItem?.meta}</span>
            </div>

            <div className="flex items-center gap-2">
              {siteConfig.gallery.items.map((item, index) => (
                <span
                  key={item.title}
                  className={cn(
                    'h-1.5 rounded-full transition-all duration-300',
                    index === active ? 'w-6 bg-white/85' : 'w-1.5 bg-white/20',
                  )}
                />
              ))}
              <span className="ml-3 hidden items-center gap-1.5 font-mono text-[10.5px] text-white/45 sm:inline-flex">
                <MoveHorizontal className="h-3.5 w-3.5" /> 拖拽或滚轮浏览
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
