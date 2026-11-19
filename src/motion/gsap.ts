import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/** 开场幕布时长（秒）。Hero 的入场时间轴以此为基准，改一处即可对齐。 */
export const OPENING = {
  /** 幕布面板退场 */
  curtain: 1.0,
  /** 幕布收起后，主标题开始前的留白 */
  hold: 0.12,
  get total() {
    return this.curtain + this.hold;
  },
};

/** 统一缓动：慢起慢收，避免廉价弹跳 */
export const EASE = {
  /** 遮罩/位移揭示 */
  reveal: 'power4.out',
  /** 幕布/大块位移 */
  curtain: 'power4.inOut',
  /** 卡片错峰 */
  stagger: 'power3.out',
  /** 轻微漂移 */
  drift: 'sine.inOut',
};

/**
 * 当前是否应降级动效。
 * - 系统开启「减少动态效果」
 * - 用户在站内切到省电模式
 */
export function motionAllowed(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return document.documentElement.dataset.perf !== 'smooth';
}

export { gsap, ScrollTrigger };
