import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useDeviceCapability, type DeviceCapability } from '@/hooks/useDeviceCapability';

export type PerfMode = 'flagship' | 'smooth';

interface PerformanceValue {
  mode: PerfMode;
  /** 综合系统偏好后的实际模式，组件应按它渲染 */
  effectiveMode: PerfMode;
  isFlagship: boolean;
  setMode: (mode: PerfMode) => void;
  toggle: () => void;
  capability: DeviceCapability;
}

const PerformanceContext = createContext<PerformanceValue | null>(null);
const STORAGE_KEY = 'cloudtrace:perf-mode';

const readStored = (): PerfMode | null => {
  if (typeof window === 'undefined') return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === 'flagship' || value === 'smooth' ? value : null;
};

export function PerformanceProvider({ children }: { children: ReactNode }) {
  const capability = useDeviceCapability();
  const [mode, setModeState] = useState<PerfMode>(() => {
    const stored = readStored();
    if (stored) return stored;
    return 'flagship';
  });

  // 首次访问且设备/系统明显吃力时，默认进入安静模式
  useEffect(() => {
    if (readStored()) return;
    if (capability.prefersReducedMotion || (capability.isLowPower && capability.isCoarsePointer)) {
      setModeState('smooth');
    }
  }, [capability.prefersReducedMotion, capability.isLowPower, capability.isCoarsePointer]);

  const setMode = useCallback((next: PerfMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* 无痕模式下忽略 */
    }
  }, []);

  const toggle = useCallback(() => {
    setMode(mode === 'flagship' ? 'smooth' : 'flagship');
  }, [mode, setMode]);

  const effectiveMode: PerfMode =
    capability.prefersReducedMotion && mode === 'flagship' ? 'smooth' : mode;

  // 写入生效模式（而非用户选择的模式），保证系统「减少动态效果」也能同步给 CSS 与 GSAP
  useEffect(() => {
    document.documentElement.dataset.perf = effectiveMode;
  }, [effectiveMode]);

  const value = useMemo<PerformanceValue>(
    () => ({
      mode,
      effectiveMode,
      isFlagship: effectiveMode === 'flagship',
      setMode,
      toggle,
      capability,
    }),
    [mode, effectiveMode, setMode, toggle, capability],
  );

  return <PerformanceContext.Provider value={value}>{children}</PerformanceContext.Provider>;
}

export function usePerformance() {
  const value = useContext(PerformanceContext);
  if (!value) throw new Error('usePerformance 必须在 PerformanceProvider 内使用');
  return value;
}
