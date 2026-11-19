import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';

export interface LatestRelease {
  version: string;
  publishedAt: string;
  sizeKb: number;
  downloadUrl: string;
  releaseUrl: string;
  notes: string[];
  /** 是否来自 GitHub API 的真实数据 */
  live: boolean;
  loading: boolean;
}

const apiUrl = `https://api.github.com/repos/${siteConfig.github.owner}/${siteConfig.github.repo}/releases/latest`;
const releasesUrl = `https://github.com/${siteConfig.github.owner}/${siteConfig.github.repo}/releases/latest`;

const fallback: LatestRelease = {
  version: siteConfig.download.fallbackRelease.tag,
  publishedAt: siteConfig.download.fallbackRelease.publishedAt,
  sizeKb: siteConfig.download.fallbackRelease.sizeKb,
  downloadUrl: releasesUrl,
  releaseUrl: releasesUrl,
  notes: [...siteConfig.download.fallbackRelease.notes],
  live: false,
  loading: true,
};

type GithubAsset = { name?: string; browser_download_url?: string; size?: number };
type GithubRelease = {
  tag_name?: string;
  published_at?: string;
  body?: string;
  html_url?: string;
  assets?: GithubAsset[];
};

const formatDate = (iso?: string) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const normalizeTag = (tag?: string) => {
  if (!tag) return fallback.version;
  const match = tag.match(/v?(\d+(?:\.\d+){1,3})/i);
  return match ? `v${match[1]}` : tag;
};

const pickNotes = (body?: string) => {
  if (!body) return [];
  return body
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line) && !/^[-*]\s+\[?full changelog/i.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').replace(/\*\*/g, '').replace(/`/g, ''))
    .slice(0, 4);
};

let cache: LatestRelease | null = null;

/**
 * 拉取 GitHub Releases 最新版本；超时 / 限流 / 无 Release 时静默回退到 siteConfig 配置。
 * 永远不抛出错误，保证下载按钮不会出现死链。
 */
export function useLatestRelease(): LatestRelease {
  const [release, setRelease] = useState<LatestRelease>(cache ?? fallback);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6500);
    let alive = true;

    fetch(apiUrl, {
      signal: controller.signal,
      headers: { Accept: 'application/vnd.github+json' },
    })
      .then((response) => {
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        return response.json() as Promise<GithubRelease>;
      })
      .then((data) => {
        const apk = data.assets?.find((asset) => asset.name?.toLowerCase().endsWith('.apk'));
        const next: LatestRelease = {
          version: normalizeTag(data.tag_name),
          publishedAt: formatDate(data.published_at) || fallback.publishedAt,
          sizeKb: apk?.size ? Math.round(apk.size / 1024) : 0,
          downloadUrl: apk?.browser_download_url || data.html_url || releasesUrl,
          releaseUrl: data.html_url || releasesUrl,
          notes: pickNotes(data.body).length ? pickNotes(data.body) : fallback.notes,
          live: true,
          loading: false,
        };
        cache = next;
        if (alive) setRelease(next);
      })
      .catch(() => {
        cache = { ...fallback, loading: false };
        if (alive) setRelease(cache);
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      alive = false;
      window.clearTimeout(timer);
      controller.abort();
    };
  }, []);

  return release;
}

export const formatSize = (sizeKb: number) => {
  if (!sizeKb) return '以 Release 为准';
  return sizeKb >= 1024 ? `${(sizeKb / 1024).toFixed(1)} MB` : `${sizeKb} KB`;
};
