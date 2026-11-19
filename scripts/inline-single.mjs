#!/usr/bin/env node
/**
 * 把 dist-single/ 打成单个 HTML 文件。
 *
 * - 读取 Vite 产物 index.html
 * - 内联 <script src> 与 <link rel=stylesheet>
 * - 把 JS/CSS 里出现的 screenshots/*.png、favicon 等静态资源替换为 data URI
 * - 输出 cloudtrace-site.html，可直接双击用 file:// 打开
 *
 * 用法：node scripts/inline-single.mjs
 */
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve('.');
const DIST = path.join(ROOT, 'dist-single');
const OUT = path.join(ROOT, 'cloudtrace-site.html');

const MIME = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.css': 'text/css',
  '.js': 'text/javascript',
};

const toDataUri = (buf, ext) =>
  `data:${MIME[ext] ?? 'application/octet-stream'};base64,${buf.toString('base64')}`;

/** 收集 dist-single 下所有可内联资源，建立 “相对路径 -> data URI” 表 */
async function collectAssets() {
  const map = new Map();
  const walk = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else {
        const ext = path.extname(entry.name).toLowerCase();
        if (!MIME[ext]) continue;
        const rel = path.relative(DIST, full).split(path.sep).join('/');
        map.set(rel, toDataUri(await readFile(full), ext));
      }
    }
  };
  await walk(DIST);
  return map;
}

/** 把代码/样式里引用到的资源替换为 data URI */
function inlineReferences(text, assets) {
  let out = text;

  // 1) 带引号的路径："/x.png"、"./x.png"、'screenshots/x.png'
  out = out.replace(
    /(["'`])((?:\.\/|\/)?(?:[A-Za-z0-9_@\-]+\/)*[A-Za-z0-9_@\-.]+\.(?:png|jpe?g|webp|svg|woff2?))\1/g,
    (match, quote, ref) => {
      const key = ref.replace(/^\.?\//, '');
      const data = assets.get(key);
      return data ? `${quote}${data}${quote}` : match;
    },
  );

  // 2) CSS 的 url(...) 引用
  out = out.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (match, quote, ref) => {
    if (ref.startsWith('data:')) return match;
    const key = ref.replace(/^\.?\//, '');
    const data = assets.get(key);
    return data ? `url("${data}")` : match;
  });

  return out;
}

/** 依次替换所有匹配项（String.replace 的异步回调不会等待） */
async function replaceAsync(input, regex, replacer) {
  const matches = [...input.matchAll(regex)];
  if (!matches.length) return input;
  const pieces = [];
  let last = 0;
  for (const match of matches) {
    pieces.push(input.slice(last, match.index));
    pieces.push(await replacer(...match));
    last = match.index + match[0].length;
  }
  pieces.push(input.slice(last));
  return pieces.join('');
}

const main = async () => {
  if (!existsSync(DIST)) {
    console.error('缺少 dist-single/，先运行：npx vite build --config vite.config.single.ts');
    process.exit(1);
  }

  const assets = await collectAssets();
  let html = await readFile(path.join(DIST, 'index.html'), 'utf8');

  // 内联样式表
  html = await replaceAsync(
    html,
    /<link[^>]+rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/g,
    async (match, href) => {
      const key = href.replace(/^\.?\//, '');
      const file = path.join(DIST, key);
      if (!existsSync(file)) return match;
      const css = inlineReferences(await readFile(file, 'utf8'), assets);
      return `<style>${css}</style>`;
    },
  );

  // 内联脚本（保持 module 语义）
  html = await replaceAsync(
    html,
    /<script([^>]*)\ssrc="([^"]+)"([^>]*)><\/script>/g,
    async (match, before, src, after) => {
      const key = src.replace(/^\.?\//, '');
      const file = path.join(DIST, key);
      if (!existsSync(file)) return match;
      const js = inlineReferences(await readFile(file, 'utf8'), assets);
      return `<script${before}${after}>${js}</script>`;
    },
  );

  // modulepreload 已无意义
  html = html.replace(/\s*<link[^>]+rel="modulepreload"[^>]*>/g, '');

  // 标记为单文件模式：页面脚本据此跳过同源清单与 GitHub API 请求
  html = html.replace('<html', '<html data-standalone="true"');

  // 图标内联
  html = inlineReferences(html, assets);

  await writeFile(OUT, html, 'utf8');
  const size = Buffer.byteLength(html);
  console.log(`已生成 ${path.basename(OUT)}（${(size / 1024 / 1024).toFixed(2)} MB）`);
};

await main();
