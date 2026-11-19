import type { SVGProps } from 'react';

/** GitHub 品牌标（lucide 新版已移除品牌图标，这里自绘保持一致线宽） */
export function GithubGlyph({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-5.9 0-1.3-.5-2.4-1.2-3.2.1-.3.5-1.5-.1-3.2 0 0-1.1-.3-3.5 1.3a12 12 0 0 0-6.4 0C6.3 3.1 5.2 3.4 5.2 3.4c-.6 1.7-.2 2.9-.1 3.2a4.6 4.6 0 0 0-1.2 3.2c0 4.5 2.7 5.6 5.5 5.9-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}
