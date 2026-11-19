import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error) => void;
}

interface State {
  failed: boolean;
}

/**
 * 重型 WebGL 组件的最后一道防线：任一特效初始化失败，只降级该模块，不影响整页。
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { failed: false };

  static getDerivedStateFromError(): State {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error);
    if (import.meta.env.DEV) {
      console.warn('[cloudtrace] 特效降级：', error.message, info.componentStack);
    }
  }

  render() {
    if (this.state.failed) return this.props.fallback ?? null;
    return this.props.children;
  }
}
