import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { GithubGlyph } from '@/components/common/icons';
import { BrandMark } from '@/components/common/BrandMark';
import { siteConfig } from '@/config/siteConfig';
import { cn } from '@/lib/utils';

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace('#', ''));

export function TopGlassNav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 24);
        const probe = window.scrollY + window.innerHeight * 0.32;
        let current = '';
        for (const id of SECTION_IDS) {
          const section = document.getElementById(id);
          if (section && section.offsetTop <= probe) current = id;
        }
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[60] flex justify-center px-3 pt-4 sm:pt-5">
      <nav
        className={cn(
          'pointer-events-auto flex items-center gap-1 rounded-full pl-2 pr-2 transition-all duration-500',
          'glass-panel',
          scrolled
            ? 'h-14 bg-[#08090c]/72 shadow-[0_20px_50px_-24px_rgba(0,0,0,0.9)]'
            : 'h-15 bg-[#08090c]/38',
        )}
        style={{ transitionTimingFunction: 'var(--ease-optical)' }}
        aria-label="主导航"
      >
        <a href="#top" className="flex items-center gap-2.5 rounded-full px-2 py-1.5" aria-label={`${siteConfig.brand.nameZh} ${siteConfig.brand.nameEn} 首页`}>
          <BrandMark size={30} />
          <span className="flex flex-col leading-none">
            <span className="text-[13px] font-medium tracking-[0.02em] text-white">{siteConfig.brand.nameZh}</span>
            <span className="mt-1 font-mono text-[8.5px] uppercase tracking-[0.24em] text-white/40">
              {siteConfig.brand.nameEn}
            </span>
          </span>
        </a>

        <span className="mx-1 hidden h-5 w-px bg-white/10 md:block" />

        <div className="hidden items-center md:flex">
          {siteConfig.nav.map((item) => {
            const id = item.href.replace('#', '');
            const isActive = active === id;
            return (
              <a
                key={item.href}
                href={item.href}
                className={cn(
                  'relative rounded-full px-3.5 py-2 text-[13px] transition-colors duration-300',
                  isActive ? 'text-white' : 'text-white/52 hover:text-white/85',
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/[0.07] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
                )}
                <span className="relative">{item.label}</span>
              </a>
            );
          })}
        </div>

        <span className="mx-1 hidden h-5 w-px bg-white/10 md:block" />

        <a
          href={`https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}`}
          target="_blank"
          rel="noreferrer noopener"
          className="hidden h-9 w-9 items-center justify-center rounded-full text-white/55 transition-colors hover:bg-white/[0.06] hover:text-white sm:flex"
          aria-label="GitHub 仓库"
        >
          <GithubGlyph className="h-4 w-4" />
        </a>

        <a
          href="#download"
          className="group relative ml-0.5 flex h-10 items-center gap-1.5 overflow-hidden rounded-full bg-[#F5F5F7] px-4 text-[12.5px] font-medium text-[#08090c] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.99]"
        >
          <span className="relative z-10">立即下载</span>
          <ArrowUpRight className="relative z-10 h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span className="absolute inset-0 -translate-x-full bg-[linear-gradient(100deg,transparent,rgba(56,189,248,0.5),transparent)] transition-transform duration-700 group-hover:translate-x-full" />
        </a>
      </nav>
    </header>
  );
}
