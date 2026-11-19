import { useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type MockupTone = 'titanium' | 'obsidian';

interface MockupFrameProps {
  children?: ReactNode;
  /** 真机截图路径（相对 BASE_URL）；未提供或加载失败时使用 children 渲染的界面 */
  src?: string;
  alt?: string;
  tone?: MockupTone;
  className?: string;
  style?: CSSProperties;
  /** 屏幕内高光强度 */
  glare?: boolean;
}

/**
 * 钛金属边框手机壳。
 * - 有图：使用 real screenshot；
 * - 无图 / 加载失败：用 PhoneScreen 渲染的高保真界面兜底，绝不出现破图。
 */
export function MockupFrame({
  children,
  src,
  alt = '云迹 · CloudTrace 真机界面',
  tone = 'titanium',
  className,
  style,
  glare = true,
}: MockupFrameProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn('relative aspect-[390/844] w-full select-none', className)}
      style={style}
    >
      {/* 环境光晕 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[18%] -z-10 rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(56,189,248,0.16), rgba(129,140,248,0.08) 45%, transparent 72%)',
        }}
      />

      <div
        className={cn(
          'relative h-full w-full p-[2.4%]',
          tone === 'titanium' ? 'mockup-titanium' : 'mockup-obsidian',
        )}
        style={{ borderRadius: '13.5% / 6.3%' }}
      >
        {/* 侧键 */}
        <span className="absolute -left-[0.55%] top-[19%] h-[6.5%] w-[1.1%] rounded-l-full bg-gradient-to-b from-[#7d838b] via-[#3a3f46] to-[#6b7078]" />
        <span className="absolute -left-[0.55%] top-[29%] h-[10%] w-[1.1%] rounded-l-full bg-gradient-to-b from-[#7d838b] via-[#3a3f46] to-[#6b7078]" />
        <span className="absolute -right-[0.55%] top-[24%] h-[14%] w-[1.1%] rounded-r-full bg-gradient-to-b from-[#7d838b] via-[#3a3f46] to-[#6b7078]" />

        <div
          className="relative h-full w-full overflow-hidden bg-[#05070a] ring-1 ring-black/80"
          style={{ borderRadius: '11.6% / 5.5%' }}
        >
          <div
            className="absolute inset-[1.2%] overflow-hidden bg-[#05070A]"
            style={{ borderRadius: '10.9% / 5.2%' }}
          >
            {showImage ? (
              <img
                src={src}
                alt={alt}
                loading="lazy"
                decoding="async"
                onError={() => setFailed(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              children
            )}

            {glare && (
              <>
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 z-50 mix-blend-screen"
                  style={{
                    background:
                      'linear-gradient(118deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.05) 18%, transparent 34%, transparent 72%, rgba(255,255,255,0.05) 100%)',
                  }}
                />
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-y-10 -left-1/3 z-50 w-1/3 rotate-[14deg] bg-gradient-to-r from-transparent via-white/12 to-transparent animate-sheen"
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
