import { useEffect, useState } from 'react';
import { ArrowDownToLine, Sparkles, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import type { BackdropMaterial } from '@/components/background/OpticalFlowBackdrop';
import { siteConfig } from '@/config/siteConfig';
import { useLatestRelease } from '@/hooks/useLatestRelease';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { id: 'features', label: '光学特性', href: '#features' },
  { id: 'workflow', label: '工作流', href: '#workflow' },
  { id: 'gallery', label: '实机画廊', href: '#gallery' },
  { id: 'download', label: '获取', href: '#download' },
] as const;

const MATERIALS: Array<{ id: BackdropMaterial; label: string }> = [
  { id: 'chrome', label: '镀铬' },
  { id: 'silk', label: '真丝' },
  { id: 'iridescence', label: '珠光' },
];

export function TopGlassNav({
  material = 'chrome',
  onMaterialChange,
  eco = false,
  onToggleEco,
}: {
  material?: BackdropMaterial;
  onMaterialChange?: (next: BackdropMaterial) => void;
  eco?: boolean;
  onToggleEco?: () => void;
}) {
  const release = useLatestRelease();
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>('features');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_ITEMS.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((e) => e.isIntersecting);
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: '-35% 0px -55% 0px' },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-4 sm:px-6">
      <nav
        aria-label="主导航"
        className={cn(
          'pointer-events-auto glass-panel flex w-full max-w-[1160px] items-center justify-between gap-3 rounded-full px-3 py-2 transition-all duration-500 sm:px-4',
          scrolled && 'max-w-[1040px] shadow-[0_22px_48px_-22px_rgba(15,23,42,0.22)]',
        )}
      >
        {/* 左侧品牌标识 */}
        <a href="#top" className="group flex items-center gap-2.5 pl-1">
          <span className="relative flex h-7 w-7 items-center justify-center rounded-full border border-[#0A0C10]/12 bg-white/80 shadow-xs">
            <span className="h-3.5 w-3.5 rounded-full border border-[#0A0C10]/70 transition-transform duration-500 group-hover:scale-90" />
            <span className="absolute h-1.5 w-1.5 rounded-full bg-[#0A0C10]" />
          </span>
          <span className="text-[13.5px] font-semibold tracking-[-0.02em] text-[#0A0C10]">
            {siteConfig.brand.nameZh}
          </span>
          <span className="hidden rounded-full border border-[#0A0C10]/10 bg-[#0A0C10]/[0.04] px-2 py-0.5 font-mono text-[10px] tracking-[0.06em] text-[#0A0C10]/60 sm:inline-block">
            {release.loading ? 'v4' : release.version}
          </span>
        </a>

        {/* 中部锚点（滑动胶囊指示器） */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  'relative rounded-full px-3.5 py-1.5 text-[12.5px] font-medium transition-colors',
                  isActive ? 'text-[#0A0C10]' : 'text-[#0A0C10]/55 hover:text-[#0A0C10]',
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="top-nav-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-full bg-[#0A0C10]/[0.07]"
                  />
                ) : null}
                {item.label}
              </a>
            );
          })}
        </div>

        {/* 右侧：WebGL 流动材质切换 + 120Hz/ECO + 下载按钮 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onMaterialChange ? (
            <div
              role="group"
              aria-label="背景流动材质"
              className="hidden items-center rounded-full border border-[#0A0C10]/8 bg-[#0A0C10]/[0.035] p-0.5 lg:flex"
            >
              {MATERIALS.map((item) => {
                const selected = material === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onMaterialChange(item.id)}
                    className={cn(
                      'relative rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors',
                      selected ? 'text-[#0A0C10]' : 'text-[#0A0C10]/50 hover:text-[#0A0C10]/80',
                    )}
                  >
                    {selected ? (
                      <motion.span
                        layoutId="backdrop-material-pill"
                        transition={{ type: 'spring', stiffness: 460, damping: 36 }}
                        className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_1px_4px_rgba(15,23,42,0.12)]"
                      />
                    ) : null}
                    {item.label}
                  </button>
                );
              })}
            </div>
          ) : null}

          {onToggleEco ? (
            <button
              type="button"
              onClick={onToggleEco}
              title={eco ? '当前为省电流畅模式，点击恢复 120Hz 旗舰光效' : '当前为 120Hz 旗舰光效，点击切换省电模式'}
              className={cn(
                'flex h-8 items-center gap-1 rounded-full border px-2.5 font-mono text-[10.5px] tracking-[0.04em] transition-colors',
                eco
                  ? 'border-[#0A0C10]/15 bg-[#0A0C10]/8 text-[#0A0C10]'
                  : 'border-[#0A0C10]/10 bg-white/60 text-[#0A0C10]/65 hover:text-[#0A0C10]',
              )}
            >
              {eco ? <Zap className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
              <span>{eco ? 'ECO' : '120Hz'}</span>
            </button>
          ) : null}

          <a
            href={release.downloadUrl}
            className="flex h-8 items-center gap-1.5 rounded-full bg-[#0A0C10] px-3.5 text-[12px] font-medium text-white shadow-[0_6px_16px_-6px_rgba(10,12,16,0.45)] transition-transform duration-300 hover:bg-[#1B1F29] active:scale-[0.97]"
          >
            <ArrowDownToLine className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">下载 APK</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
