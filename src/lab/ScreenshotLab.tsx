import { useEffect } from 'react';
import { PhoneScreen, type ScreenVariant } from '@/components/mockup/PhoneScreen';

/**
 * 截图实验室：仅用于把 PhoneScreen 以 2x 尺寸导出为 public/screenshots 下的真机图。
 * 访问 /?lab=screens&screen=home 即可得到 780 × 1688 的无边框界面。
 */
export function ScreenshotLab({ screen }: { screen: ScreenVariant }) {
  useEffect(() => {
    document.documentElement.dataset.lab = 'true';
    document.body.style.margin = '0';
    document.body.style.overflow = 'hidden';
  }, []);

  return (
    <div style={{ width: 780, height: 1688, overflow: 'hidden', background: '#050507' }}>
      <PhoneScreen variant={screen} />
    </div>
  );
}
