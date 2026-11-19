import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/siteConfig';

export interface LatestRelease {
  version: string;
  publishedAt: string;
  sizeKb: number;
  sha256: string;
  /** Gitee 发行版直链（国内直连，点击即下载） */
  downloadUrl: string;
  /** GitHub 备用直链（同一个包） */
  mirrorUrl: string;
  /** GitHub Release 页面（更新说明 / 历史版本） */
  releaseUrl: string;
  notes: string[];
  live: boolean;
  source: 'manifest' | 'github' | 'fallback';
  loading: boolean;
}

const owner = siteConfig.github.owner;
const repo = siteConfig.github.repo;
const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
const releasesUrl = `https://github.com/${owner}/${repo}/releases/latest`;

/** 与应用内更新同源的签名清单；站点与应用部署在同一个 Pages 下，可直接读取。 */
const manifestUrl = './update/stable.json';

/** 单文件版（file:// 或打包产物）没有同源清单，直接走配置兜底，避免控制台报错。 */
const isStandalone =
  typeof window !== 'undefined' &&
  (window.location.protocol === 'file:' || document.documentElement.dataset.standalone === 'true');

const fallback: LatestRelease = {
  version: siteConfig.download.fallbackRelease.tag,
  publishedAt: siteConfig.download.fallbackRelease.publishedAt,
  sizeKb: siteConfig.download.fallbackRelease.sizeKb,
  sha256: siteConfig.download.fallbackRelease.sha256,
  downloadUrl: siteConfig.download.apk,
  mirrorUrl: siteConfig.download.apkMirror,
  releaseUrl: releasesUrl,
  notes: [...siteConfig.download.fallbackRelease.notes],
  live: false,
  source: 'fallback',
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

type ManifestMirror = { id?: string; url?: string; name?: string };
type ManifestPayload = {
  versionName?: string;
  versionCode?: number;
  size?: number;
  sha256?: string;
  publishedAt?: string;
  releaseNotes?: string;
  mirrors?: ManifestMirror[];
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

const decodePayload = (b64?: string): ManifestPayload | null => {
  if (!b64) return null;
  try {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes)) as ManifestPayload;
  } catch {
    return null;
  }
};

const isGitee = (mirror: ManifestMirror) =>
  (mirror.id || '').toLowerCase() === 'gitee' || (mirror.url || '').includes('gitee.com');
const isGithub = (mirror: ManifestMirror) =>
  (mirror.id || '').toLowerCase() === 'gh' || (mirror.url || '').includes('github.com');

const fromManifest = (payload: ManifestPayload): LatestRelease => {
  const mirrors = payload.mirrors || [];
  const gitee = mirrors.find(isGitee)?.url;
  const github = mirrors.find(isGithub)?.url;
  return {
    version: payload.versionName ? `v${payload.versionName}` : fallback.version,
    publishedAt: formatDate(payload.publishedAt) || fallback.publishedAt,
    sizeKb: payload.size ? Math.round(payload.size / 1024) : fallback.sizeKb,
    sha256: payload.sha256 || fallback.sha256,
    downloadUrl: gitee || fallback.downloadUrl,
    mirrorUrl: github || fallback.mirrorUrl,
    releaseUrl: releasesUrl,
    notes: pickNotes(payload.releaseNotes).length ? pickNotes(payload.releaseNotes) : fallback.notes,
    live: true,
    source: 'manifest',
    loading: false,
  };
};

const fromGithub = (data: GithubRelease): LatestRelease => {
  const apk = data.assets?.find((asset) => asset.name?.toLowerCase().endsWith('.apk'));
  return {
    version: normalizeTag(data.tag_name),
    publishedAt: formatDate(data.published_at) || fallback.publishedAt,
    sizeKb: apk?.size ? Math.round(apk.size / 1024) : 0,
    sha256: fallback.sha256,
    // 直链永远优先：没有 Gitee 镜像时才退回 GitHub 资产直链
    downloadUrl: fallback.downloadUrl,
    mirrorUrl: apk?.browser_download_url || fallback.mirrorUrl,
    releaseUrl: data.html_url || releasesUrl,
    notes: pickNotes(data.body).length ? pickNotes(data.body) : fallback.notes,
    live: true,
    source: 'github',
    loading: false,
  };
};

let cache: LatestRelease | null = null;

/**
 * 下载信息按优先级获取：
 *   1. 同源签名更新清单（最准，含 Gitee/GitHub 双直链与 SHA-256）
 *   2. GitHub Releases API（清单不可用时的兜底）
 *   3. siteConfig 中写死的当前版本（离线/限流时仍能直接下载）
 * 永远不抛错，保证下载按钮不是死链。
 */
export function useLatestRelease(): LatestRelease {
  const [release, setRelease] = useState<LatestRelease>(cache ?? fallback);

  useEffect(() => {
    if (cache) return;
    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), 6500);
    let alive = true;

    const settle = (next: LatestRelease) => {
      cache = next;
      if (alive) setRelease(next);
    };

    const load = async () => {
      // 单文件预览：不发起任何网络请求，直接用内置版本信息
      if (isStandalone) {
        settle({ ...fallback, loading: false });
        return;
      }

      // 1. 签名清单（同源，无跨域、无限流）
      try {
        const response = await fetch(manifestUrl, {
          signal: controller.signal,
          cache: 'no-store',
        });
        if (response.ok) {
          const envelope = (await response.json()) as { payload?: string };
          const payload = decodePayload(envelope.payload);
          if (payload) {
            settle(fromManifest(payload));
            return;
          }
        }
      } catch {
        /* 继续尝试 GitHub API */
      }

      // 2. GitHub API
      try {
        const response = await fetch(apiUrl, {
          signal: controller.signal,
          headers: { Accept: 'application/vnd.github+json' },
        });
        if (!response.ok) throw new Error(`GitHub API ${response.status}`);
        settle(fromGithub((await response.json()) as GithubRelease));
        return;
      } catch {
        /* 使用配置兜底 */
      }

      settle({ ...fallback, loading: false });
    };

    void load().finally(() => window.clearTimeout(timer));

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