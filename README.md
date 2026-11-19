# 云迹 · CloudTrace — 官方网站

> 色彩极度克制，动效极致奢华。

`Vite 6` + `React 19` + `TypeScript` + `Tailwind CSS v4` 构建的静态官网，集成 30+ 个
[React Bits](https://reactbits.dev) 交互与 WebGL 组件，部署于 GitHub Pages。

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc --noEmit
npm run build      # 产物输出到 dist/
npm run preview
```

## 站点结构

| 区块 | 组件 | 说明 |
| --- | --- | --- |
| 01 | `HeroSection` | LightRays 光束 + Particles 微尘 + SplitText 逐字入场 + TiltedCard 真机 |
| 02 | `TelemetryMarquee` | ScrollVelocity 视差字带 + CountUp 遥测卡 |
| 03 | `BentoFeatures` | 六张可玩光学卡（GlassSurface / AnimatedList / 雷达 / DecryptedText / TrueFocus / GlassIcons） |
| 04 | `WorkflowShowcase` | Threads 流体光丝 + CardSwap 真机卡片堆 |
| 05 | `OpticalGallery` | CircularGallery 3D 弧面画廊（窄屏自动降级为 scroll-snap 卡片） |
| 06 | `DownloadAndLanyard` | DarkVeil 深空幕布 + 3D 挂绳通行证 + GitHub Releases 实时版本 |
| 07 | `PressureFooter` | TextPressure 巨型压感字标 |

## 一处改全站

所有品牌名、仓库地址、导航、文案、统计数字、截图画廊与下载链接集中在 **`src/config/siteConfig.ts`**。
换品牌 / 换仓库 / 换版本只需改这一个文件。

## 真机截图

`public/screenshots/` 中的图片由代码渲染的界面导出（`/?lab=screens&screen=home` 可单独取图）。
若要替换为真实截图，保持以下文件名即可自动生效：

```text
shot-home.png      shot-roam.png     shot-builder.png
shot-island.png    shot-settings.png shot-run-dark.png
hero-home.png
```

图片缺失时，`MockupFrame` 会回落到 `PhoneScreen` 代码渲染界面，不会出现破图或 404。

## 性能防线

- `ViewportLazyMount`：WebGL 组件进入视口前 250px 挂载，离开后卸载，任意时刻活跃实例 ≤ 2。
- `useDeviceCapability`：触屏 / 低配 / `prefers-reduced-motion` 自动关闭跟随光标特效并降级画廊。
- `PerformanceContext`：底部 Dock 一键切换「旗舰光学 / 静谧流畅」，状态持久化到 localStorage。
- 所有重型组件包裹 `ErrorBoundary`，单个特效失败只降级自身模块。

## 部署

推送 `main` 分支即触发 `.github/workflows/deploy.yml`，构建并发布到
`https://<user>.github.io/<repo>/`。

仓库 **Settings → Pages → Build and deployment → Source** 选择 **GitHub Actions** 即可。

`vite.config.ts` 会读取 GitHub Actions 注入的 `GITHUB_REPOSITORY` 自动设置子路径 base；
绑定自定义域名时把 `base` 改为 `'/'`。
