import { useEffect, useRef, useState } from 'react';
import { MoveHorizontal, ScanLine } from 'lucide-react';
import { MockupFrame } from '@/components/common/MockupFrame';
import { usePerformance } from '@/components/common/PerformanceContext';
import { Reveal, SectionHeader } from '@/components/common/SectionHeader';
import { ViewportLazyMount } from '@/components/common/ViewportLazyMount';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import CircularGallery, { type GalleryItem } from '@/components/reactbits/CircularGallery';
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
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    const query = window.matchMedia('(min-width: 1024px)');
    const update = () => setWide(query.matches);
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  const useWebglGallery = isFlagship && wide && !capability.isCoarsePointer;
  const activeItem = siteConfig.gallery.items[active] ?? siteConfig.gallery.items[0];

  const handleSelectFallback = (index: number) => {
    setActive(index);
    if (!useWebglGallery) {
      cardRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        inline: 'center',
        block: 'nearest',
      });
    }
  };

  return (
    <section id="gallery" className="relative overflow-hidden py-24 sm:py-32">
      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <SectionHeader
          index="05 / 06"
          eyebrow="OPTICAL GALLERY"
          align="center"
          title={
            <>
              实机光学展陈，
              <span className="font-editorial ml-1 font-normal text-[#0A0C10]/55">Specimen Frames</span>
            </>
          }
          description={siteConfig.gallery.subtitle}
        />

        {/* 瓷白光学展陈柜：柔化背景流动性，突出实机画面色彩与层次 */}
        <div className="glass-panel-soft relative mt-12 overflow-hidden rounded-[32px] p-4 sm:p-6">
          {/* 顶部建筑标尺栏 */}
          <div className="mb-3 flex items-center justify-between border-b border-[#0A0C10]/[0.07] pb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0C10]/45">
            <span className="flex items-center gap-2">
              <ScanLine className="h-3.5 w-3.5 text-[#0A0C10]/60" />
              FIG. 05 — {useWebglGallery ? 'WEBGL CURVED STAGE' : 'SNAP CAROUSEL'}
            </span>
            <span className="tabular">
              {String(active + 1).padStart(2, '0')} / {String(siteConfig.gallery.items.length).padStart(2, '0')}
            </span>
          </div>

          {/* 展陈主舞台 */}
          <div className="relative h-[500px] w-full sm:h-[550px]">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-[12%] top-1/2 -z-10 h-44 -translate-y-1/2 rounded-[100%] bg-white/80 blur-[64px]"
            />

            {useWebglGallery ? (
              <ViewportLazyMount className="h-full w-full" rootMargin="240px 0px">
                <CircularGallery
                  items={items}
                  bend={1.15}
                  textColor="#0A0C10"
                  borderRadius={0.072}
                  scrollSpeed={1.65}
                  scrollEase={0.08}
                  itemSize={1.24}
                  itemAspect={390 / 844}
                  gap={0.09}
                  wave={0.18}
                  fadeEdges={0.18}
                  shadow={0.22}
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
              <div className="no-scrollbar flex h-full snap-x snap-mandatory items-center gap-5 overflow-x-auto px-4 pb-4 pt-2">
                {siteConfig.gallery.items.map((item, index) => (
                  <div
                    key={item.title}
                    ref={(el) => {
                      cardRefs.current[index] = el;
                    }}
                    className="w-[68%] shrink-0 snap-center sm:w-[42%] lg:w-[30%]"
                    onPointerEnter={() => setActive(index)}
                  >
                    <div className="glass-panel rounded-[26px] p-2.5 transition-transform duration-300 hover:-translate-y-1">
                      <MockupFrame className="w-full">
                        <PhoneScreen variant={item.screen} />
                      </MockupFrame>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 底部标本铭牌栏 */}
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#0A0C10]/[0.07] pt-3.5">
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-[#0A0C10] px-2.5 py-0.5 font-mono text-[10px] text-white tabular">
                {String(active + 1).padStart(2, '0')}
              </span>
              <span className="text-[14px] font-semibold tracking-[-0.01em] text-[#0A0C10]">
                {activeItem.title}
              </span>
              <span className="hidden font-mono text-[11px] text-[#0A0C10]/50 sm:inline">{activeItem.meta}</span>
            </div>

            <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0A0C10]/45">
              <MoveHorizontal className="h-3.5 w-3.5" />
              {useWebglGallery ? '拖拽或滚轮旋转' : '左右滑动切换'}
            </span>
          </div>
        </div>

        {/* 底部全帧索引条 */}
        <Reveal className="mt-6">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto pb-1">
            {siteConfig.gallery.items.map((item, index) => {
              const isSelected = index === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => handleSelectFallback(index)}
                  className={cn(
                    'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 transition-all duration-300',
                    isSelected
                      ? 'border-[#0A0C10] bg-[#0A0C10] text-white shadow-[0_8px_20px_-10px_rgba(10,12,16,0.45)]'
                      : 'border-[#0A0C10]/10 bg-white/65 text-[#0A0C10]/60 hover:border-[#0A0C10]/25 hover:bg-white hover:text-[#0A0C10]',
                  )}
                >
                  <span className="font-mono text-[9.5px] tracking-[0.12em] tabular opacity-70">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[12px] font-medium">{item.title}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
