import CountUp from '@/components/reactbits/CountUp';
import ScrollVelocity from '@/components/reactbits/ScrollVelocity';
import { usePerformance } from '@/components/common/PerformanceContext';
import { Reveal } from '@/components/common/SectionHeader';
import { siteConfig } from '@/config/siteConfig';

const ROW_ONE = siteConfig.marquee.rowOne.join('  ·  ');
const ROW_TWO = siteConfig.marquee.rowTwo.join('  ·  ');

export function TelemetryMarquee() {
  const { isFlagship } = usePerformance();

  return (
    <section className="relative overflow-hidden border-y border-[#0A0C10]/[0.08] py-16 sm:py-20">
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <div className="absolute inset-0 bg-[radial-gradient(60%_120%_at_50%_-20%,rgba(255,255,255,0.9),transparent_60%)]" />
      </div>

      <div className="relative select-none space-y-1 sm:space-y-2">
        {isFlagship ? (
          <>
            <ScrollVelocity
              texts={[ROW_ONE]}
              velocity={1.6}
              damping={60}
              stiffness={380}
              numCopies={4}
              outlineAlternate
              fontSize="clamp(44px, 7.4vw, 112px)"
              fontWeight={500}
              color="rgba(10,12,16,0.1)"
              className="mask-fade-x font-mono uppercase tracking-[-0.05em]"
              separator={<span className="mx-[0.35em] text-[#0A0C10]/20">/</span>}
            />
            <ScrollVelocity
              texts={[ROW_TWO]}
              velocity={-1.2}
              damping={60}
              stiffness={340}
              numCopies={4}
              outlineAlternate
              fontSize="clamp(44px, 7.4vw, 112px)"
              fontWeight={500}
              color="rgba(10,12,16,0.07)"
              className="mask-fade-x font-mono uppercase tracking-[-0.05em]"
              separator={<span className="mx-[0.35em] text-[#0A0C10]/16">/</span>}
            />
          </>
        ) : (
          <div className="mask-fade-x overflow-hidden whitespace-nowrap py-4 font-mono text-[clamp(44px,7.4vw,112px)] uppercase tracking-[-0.05em] text-[#0A0C10]/10">
            {ROW_ONE}
          </div>
        )}
      </div>

      <div className="relative mx-auto mt-14 w-full max-w-[1200px] px-6 sm:mt-20 sm:px-8">
        <Reveal>
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-[11px] tracking-[0.18em] text-[#0A0C10]/40 tabular">02</span>
                <span className="h-px w-8 bg-[#0A0C10]/20" />
                <span className="mono-label text-[#0A0C10]/65">TELEMETRY</span>
              </div>
              <h2 className="display mt-4 text-[clamp(24px,2.6vw,34px)] text-[#0A0C10]">
                把硬核指标，写进每一次巡航。
              </h2>
            </div>
            <p className="max-w-[330px] text-[12.5px] leading-[1.85] text-[#0A0C10]/55">
              数字不是装饰，而是引擎的真实输出。全部指标在设备本地实时计算，不上传、不采样、不联网。
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.07}>
              <article className="glass-panel group relative h-full overflow-hidden rounded-[22px] p-5 transition-shadow duration-500 hover:shadow-[0_26px_60px_-28px_rgba(15,23,42,0.24)]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#0A0C10]/35 tabular">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-[9.5px] uppercase tracking-[0.18em] text-[#0A0C10]/40">
                    {stat.label}
                  </span>
                </div>

                <div className="mt-7 flex items-baseline gap-1.5">
                  <CountUp
                    to={stat.value}
                    duration={2.1}
                    delay={0.15 + index * 0.06}
                    trigger="view"
                    className="font-mono text-[52px] font-light leading-none tracking-[-0.05em] text-[#0A0C10] tabular sm:text-[58px]"
                  />
                  <span className="font-mono text-[15px] font-light text-[#0A0C10]/55">{stat.suffix}</span>
                </div>

                <div className="mt-5 h-px w-full bg-[#0A0C10]/[0.08]" />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-[12px] text-[#0A0C10]/62">{stat.detail}</span>
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#0A0C10]/45" />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
