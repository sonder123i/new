import { useEffect, useState } from 'react';

export interface DeviceCapability {
  /** 触屏 / 平板等粗指针设备 */
  isCoarsePointer: boolean;
  /** 系统开启了「减少动态效果」 */
  prefersReducedMotion: boolean;
  /** 低性能设备：核心数少、内存小或省电模式 */
  isLowPower: boolean;
  /** 是否允许运行跟随光标的装饰特效 */
  allowCursorFx: boolean;
  /** 是否允许挂载 WebGL 场景 */
  allowWebgl: boolean;
}

const read = (): DeviceCapability => {
  if (typeof window === 'undefined') {
    return {
      isCoarsePointer: false,
      prefersReducedMotion: false,
      isLowPower: false,
      allowCursorFx: true,
      allowWebgl: true,
    };
  }

  const isCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cores = navigator.hardwareConcurrency ?? 8;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const isLowPower = cores <= 4 || memory <= 4;

  return {
    isCoarsePointer,
    prefersReducedMotion,
    isLowPower,
    allowCursorFx: !isCoarsePointer && !prefersReducedMotion,
    allowWebgl: !prefersReducedMotion,
  };
};

/**
 * 检测移动端 / 低配设备 / 系统动效偏好，并监听变化。
 * 单一来源，避免每个组件各自 matchMedia 造成监听器泄漏。
 */
export function useDeviceCapability(): DeviceCapability {
  const [capability, setCapability] = useState<DeviceCapability>(read);

  useEffect(() => {
    const queries = [
      window.matchMedia('(pointer: coarse)'),
      window.matchMedia('(prefers-reduced-motion: reduce)'),
    ];
    const update = () => setCapability(read());
    queries.forEach((query) => query.addEventListener('change', update));
    return () => queries.forEach((query) => query.removeEventListener('change', update));
  }, []);

  return capability;
}
