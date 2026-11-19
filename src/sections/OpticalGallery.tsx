import { useEffect, useRef, useState } from 'react';
import { MoveHorizontal, ScanLine } from 'lucide-react';
import CircularGallery, { type GalleryItem } from '@/components/reactbits/CircularGallery';
import Crosshair from '@/components/reactbits/Crosshair';
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
  const containerRef = useRef<HTMLDivElement>(null);
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

  return (
    <section id="gallery" className="relative overflow-hidden py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_50%_at_50%_0%,rgba(56,189,248,0.05),transparent_60%)]" />
      <div className="relative mx-auto w-full max-w-[1240px] px-6 sm:px-8">
        <SectionHeader
          index="05"
          eyebrow="OPTICAL GALLERY"
          align="center"
          title={
            <>
              实机光学画廊
              <span className="ml-3 align-middle font-mono text-[11px] font-normal tracking-[0.18em] text-white/25">
                06 FRAMES
              </span>
            </>
          }
          description={siteConfig.gallery.subtitle}
        />

        <div
          ref={containerRef}
          className="relative mt-10 h-[620px] w-full sm:h-[600px] lg:h-[600px]"
        >
          <div className="pointer-events-none absolute inset-x-[10%] top-1/2 -z-10 h-40 -translate-y-1/2 rounded-[100%] bg-[#38BDF8]/[0.06] blur-[70px]" />

          {useWebglGallery ? (
            <ViewportLazyMount className="h-full w-full" rootMargin="320px 0px">
              <Crosshair
                containerRef={containerRef}
                color="#38BDF8"
                thickness={1}
                opacity={0.35}
                gap={7}
                fade={0.12}
                smoothing={0.18}
                blendMode="normal"
              />
              <CircularGallery
                items={items}
                bend={2.4}
                textColor="#F5F5F7"
                borderRadius={0.065}
                scrollSpeed={1.9}
                scrollEase={0.075}
                itemSize={1.28}
                itemAspect={390 / 844}
                gap={0.085}
                wave={0.55}
                fadeEdges={0.16}
                shadow={0.35}
                grayscale={false}
                showTitles={false}
                snap
                autoScroll={0}
                intro
                onActiveChange={setActive}
                dpr={Math.min(1.75, typeof window !== 'undefined' ? window.devicePixelRatio : 1)}
                className="h-full w-full"
              />
            </ViewportLazyMount>
          ) : (
            <div className="no-scrollbar flex h-full snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-8 pt-2">
              {siteConfig.gallery.items.map((item, index) => (
                <div
                  key={item.title}
                  className="w-[64%] shrink-0 snap-center sm:w-[42%] lg:w-[31%]"
                  onPointerEnter={() => setActive(index)}
                >
                  <div className="glass-panel rounded-[26px] p-2.5">
                    <MockupFrame className="w-full">
                      <PhoneScreen variant={item.screen} />
                    </MockupFrame>
                  </div>
                  <div className="mt-3 flex flex-col gap-0.5 px-2 sm:flex-row sm:items-center sm:justify-between">
                    <span className="text-[12px] text-white/65">{item.title}</span>
                    <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-white/25">{item.meta}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between px-1">
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/25">
              <ScanLine className="h-3 w-3 text-[#38BDF8]/60" />
              {capability.isCoarsePointer || !isFlagship ? 'swipe · snap gallery' : 'drag · wheel · crosshair'}
            </span>
            <span className="font-mono text-[10px] tabular text-white/30">
              {String(active + 1).padStart(2, '0')}
              <span className="mx-1 text-white/15">/</span>
              {String(siteConfig.gallery.items.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        <Reveal className="mt-8">
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {siteConfig.gallery.items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActive(index)}
                className={cn(
                  'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 transition-colors duration-300',
                  index === active
                    ? 'border-[#38BDF8]/35 bg-[#38BDF8]/10 text-white/85'
                    : 'border-white/8 bg-white/[0.02] text-white/35 hover:text-white/60',
                )}
              >
                <span className="font-mono text-[9px] tracking-[0.14em]">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-[11.5px]">{item.title}</span>
              </button>
            ))}
            <span className="ml-auto hidden shrink-0 items-center gap-1.5 self-center font-mono text-[9px] uppercase tracking-[0.18em] text-white/20 sm:flex">
              <MoveHorizontal className="h-3 w-3" /> drag to explore
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
