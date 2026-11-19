import { ArrowUp, Heart } from 'lucide-react';
import { GithubGlyph } from '@/components/common/icons';
import { BrandMark } from '@/components/common/BrandMark';
import { MaskReveal } from '@/motion/MaskReveal';
import { siteConfig } from '@/config/siteConfig';

export function PressureFooter() {
  const year = siteConfig.brand.copyrightYear;

  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-[#050507]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_120%,rgba(56,189,248,0.09),transparent_65%)]" />

      <div className="relative mx-auto w-full max-w-[1240px] px-6 pt-16 sm:px-8 sm:pt-20">
        <div className="flex flex-wrap items-start justify-between gap-10">
          <div className="max-w-[340px]">
            <div className="flex items-center gap-3">
              <BrandMark size={36} />
              <div>
                <div className="text-[15px] font-medium text-white/90">
                  {siteConfig.brand.nameZh} · {siteConfig.brand.nameEn}
                </div>
                <div className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.26em] text-white/30">
                  LIQUID GLASS · VISION 4.0
                </div>
              </div>
            </div>
            <p className="mt-5 text-[12.5px] leading-[1.9] text-white/38">{siteConfig.brand.tagline}</p>
            <div className="mt-5 flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full border border-white/8 bg-white/[0.02] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-white/30">
                <span className="h-1 w-1 rounded-full bg-emerald-300/70" />
                all systems optical
              </span>
            </div>
          </div>

          <div className="flex gap-12 sm:gap-16">
            {siteConfig.footer.columns.map((column) => (
              <div key={column.title}>
                <div className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/25">{column.title}</div>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        target={link.href.startsWith('http') ? '_blank' : undefined}
                        rel={link.href.startsWith('http') ? 'noreferrer noopener' : undefined}
                        className="group inline-flex items-center gap-1.5 text-[12px] text-white/45 transition-colors hover:text-white/85"
                      >
                        {link.label}
                        <span className="h-px w-0 bg-[#38BDF8]/60 transition-all duration-300 group-hover:w-3" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-white/35 transition-colors hover:border-white/20 hover:text-white/70"
          >
            <ArrowUp className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5" />
            back to top
          </button>
        </div>
      </div>

      <MaskReveal
        className="relative mx-auto mt-10 w-full max-w-[1200px] overflow-hidden px-6 sm:mt-12 sm:px-8"
        duration={1.1}
        from="bottom"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none select-none text-center font-semibold leading-[0.86] tracking-[-0.05em] text-white/[0.075]"
          style={{ fontSize: 'clamp(56px, 12.5vw, 176px)' }}
        >
          CLOUDTRACE
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#050507] via-[#050507]/70 to-transparent" />
      </MaskReveal>

      <div className="relative border-t border-white/[0.06]">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col gap-4 px-6 pb-24 pt-6 sm:px-8 md:pb-28 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-white/28">
              © {year} {siteConfig.brand.nameZh} · {siteConfig.brand.nameEn}. Designed with Liquid Glass Aesthetics.
            </span>
            <span className="max-w-[720px] text-[10px] leading-[1.7] text-white/18">{siteConfig.footer.disclaimer}</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-1.5 text-[11px] text-white/32 transition-colors hover:text-white/70"
            >
              <GithubGlyph className="h-3.5 w-3.5" />
              GitHub
            </a>
            <span className="h-3 w-px bg-white/10" />
            <span className="flex items-center gap-1.5 font-mono text-[9.5px] uppercase tracking-[0.14em] text-white/22">
              <Heart className="h-3 w-3 text-[#38BDF8]/50" />
              GPL-3.0 License
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
