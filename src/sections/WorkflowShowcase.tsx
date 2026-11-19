import { useEffect, useRef, useState } from 'react';
import { ChevronRight, MousePointer2 } from 'lucide-react';
import CardSwap, { Card } from '@/components/reactbits/CardSwap';
import GlareHover from '@/components/reactbits/GlareHover';
import { usePerformance } from '@/components/common/PerformanceContext';
import { MockupFrame } from '@/components/common/MockupFrame';
import { Parallax } from '@/motion/Parallax';
import { Reveal, SectionHeader } from '@/components/common/SectionHeader';
import { PhoneScreen } from '@/components/mockup/PhoneScreen';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

const steps = siteConfig.workflow.steps;

export function WorkflowShowcase() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const swapRef = useRef<{ next: () => void; prev: () => void }>(null);

  useEffect(() => {
    if (paused) return undefined;
    const timer = window.setInterval(() => swapRef.current?.next(), 5600);
    return () => window.clearInterval(timer);
  }, [paused]);

  const goTo = (index: number) => {
    const diff = index - active;
    for (let step = 0; step < Math.abs(diff); step += 1) {
      window.setTimeout(() => {
        if (diff > 0) swapRef.current?.next();
        else swapRef.current?.prev();
      }, step * 190);
    }
  };

  return (
    <section
      id="workflow"
      className="relative overflow-hidden border-y border-[#0A0C10]/[0.08] py-24 sm:py-32"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(255,255,255,0.85),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1200px] px-6 sm:px-8">
        <SectionHeader
          index="04 / 06"
          eyebrow="WORKFLOW"
          title={
            <>
              从选圈到收尾，
              <br className="hidden sm:block" />
              <span className="text-[#0A0C10]/42">四步无缝流转。</span>
            </>
          }
          description={siteConfig.workflow.description}
          aside={
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#0A0C10]/45">
              <MousePointer2 className="h-3.5 w-3.5" />
              点击步骤 / 拖拽卡片
            </div>
          }
        />

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* 左侧步骤导航 */}
          <Reveal>
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute bottom-4 left-[7px] top-4 w-px bg-[#0A0C10]/[0.1]">
                <div
                  className="w-px bg-gradient-to-b from-[#0A0C10]/45 via-[#0A0C10]/70 to-[#0A0C10] transition-[height] duration-700"
                  style={{ height: `${((active + 1) / steps.length) * 100}%` }}
                />
              </div>

              <div className="flex flex-col">
                {steps.map((step, index) => {
                  const isActive = index === active;
                  return (
                    <button
                      key={step.index}
                      type="button"
                      onClick={() => goTo(index)}
                      className={cn(
                        'group relative flex gap-5 rounded-2xl px-4 py-5 text-left transition-colors duration-500',
                        isActive ? 'bg-[#0A0C10]/[0.045]' : 'hover:bg-[#0A0C10]/[0.025]',
                      )}
                      aria-current={isActive ? 'step' : undefined}
                    >
                      <span
                        className={cn(
                          'mt-1.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border transition-all duration-500',
                          isActive
                            ? 'border-[#0A0C10] bg-[#0A0C10] shadow-[0_0_0_4px_rgba(10,12,16,0.08)]'
                            : 'border-[#0A0C10]/25 bg-white group-hover:border-[#0A0C10]/50',
                        )}
                      >
                        <span className={cn('h-1 w-1 rounded-full', isActive ? 'bg-white' : 'bg-[#0A0C10]/30')} />
                      </span>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-4">
                          <div className="flex items-baseline gap-3">
                            <span
                              className={cn(
                                'font-mono text-[10.5px] tracking-[0.2em] transition-colors tabular',
                                isActive ? 'text-[#0A0C10]' : 'text-[#0A0C10]/35',
                              )}
                            >
                              {step.index}
                            </span>
                            <span
                              className={cn(
                                'text-[16px] font-medium tracking-[-0.02em] transition-colors duration-500',
                                isActive ? 'text-[#0A0C10]' : 'text-[#0A0C10]/55 group-hover:text-[#0A0C10]/80',
                              )}
                            >
                              {step.title}
                            </span>
                          </div>
                          <span
                            className={cn(
                              'hidden font-mono text-[8.5px] uppercase tracking-[0.18em] transition-opacity sm:inline',
                              isActive ? 'text-[#0A0C10]/55' : 'text-[#0A0C10]/22',
                            )}
                          >
                            {step.tag}
                          </span>
                        </div>

                        <div
                          className="grid transition-[grid-template-rows,opacity] duration-500 ease-out"
                          style={{ gridTemplateRows: isActive ? '1fr' : '0fr', opacity: isActive ? 1 : 0 }}
                        >
                          <div className="overflow-hidden">
                            <p className="mt-2.5 max-w-[360px] text-[12.5px] leading-[1.8] text-[#0A0C10]/60">
                              {step.body}
                            </p>
                          </div>
                        </div>
                      </div>

                      <ChevronRight
                        className={cn(
                          'mt-1 h-3.5 w-3.5 shrink-0 transition-all duration-500',
                          isActive ? 'translate-x-0 text-[#0A0C10]/70' : '-translate-x-1 text-[#0A0C10]/20',
                        )}
                      />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-[#0A0C10]/[0.08] px-4 pt-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#0A0C10]/35 tabular">
                  step {String(active + 1).padStart(2, '0')} / 04
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-[#0A0C10]/35">
                  auto play {paused ? 'paused' : 'on'}
                </span>
              </div>
            </div>
          </Reveal>

          {/* 右侧卡片堆 */}
          <Reveal delay={0.1}>
            <Parallax strength={48} className="relative mx-auto w-full max-w-[560px]">
              <div className="relative mx-auto w-full max-w-[560px]">
                <div className="pointer-events-none absolute inset-x-8 top-10 bottom-10 -z-10 rounded-[60px] bg-white/75 blur-[60px]" />
                <CardSwap
                  ref={swapRef}
                  width={238}
                  height={490}
                  cardDistance={34}
                  verticalDistance={26}
                  depth={70}
                  skewAmount={5}
                  visibleCards={3}
                  autoplay={false}
                  pauseOnHover
                  draggable
                  speed={1.1}
                  bounce={1.2}
                  parallax={0.5}
                  hoverSpread={0.4}
                  dim={0.32}
                  cardRadius={58}
                  intro
                  theme="light"
                  onChange={(index) => setActive(index)}
                  className="h-[525px] w-full sm:h-[545px]"
                >
                  {steps.map((step) => (
                    <Card key={step.screen} className="!bg-transparent">
                      <GlareHover
                        width="100%"
                        height="100%"
                        background="transparent"
                        borderRadius="58px"
                        borderColor="transparent"
                        glareColor="#FFFFFF"
                        glareOpacity={0.4}
                        glareAngle={22}
                        glareSize={320}
                        transitionDuration={900}
                        className="h-full w-full"
                      >
                        <div className="relative h-full w-full p-1.5">
                          <MockupFrame className="h-full w-full" style={{ aspectRatio: 'auto' }}>
                            <PhoneScreen variant={step.screen} />
                          </MockupFrame>
                          <span className="absolute left-3 top-3 z-50 flex items-center gap-1.5 rounded-full border border-[#0A0C10]/12 bg-white/85 px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.18em] text-[#0A0C10]/70 backdrop-blur">
                            <span className="h-1 w-1 rounded-full bg-[#0A0C10]" />
                            {step.tag}
                          </span>
                        </div>
                      </GlareHover>
                    </Card>
                  ))}
                </CardSwap>
              </div>
            </Parallax>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
