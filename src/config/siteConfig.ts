/**
 * 全站唯一配置源。
 * 品牌名称、仓库地址、导航、页面文案、统计数字、截图路径全部集中在此，
 * 改一处即可完成改名 / 换仓 / 上线新版本，组件内不允许再硬编码。
 */

export const siteConfig = {
  brand: {
    nameZh: '云迹',
    nameEn: 'CloudTrace',
    wordmark: 'CLOUDTRACE',
    tagline: '将精密光学与液态玻璃，注入每一段轨迹。',
    description:
      '专为 Android 打造的旗舰级自动跑圈与自由漫游工具。以 120Hz 硬件级 AGSL 边缘折射、1m 游标卡尺操场套模与 visionOS 深空悬浮岛，重新定义工具软件的审美上限。',
    /** 浏览器标签与页脚版权年份 */
    copyrightYear: 2026,
  },

  /** 应用源码、Release 与问题反馈所在仓库（安装包直链由此拉取） */
  github: {
    owner: 'ZCShou',
    repo: 'GoGoGo',
    branch: 'master',
  },

  /** 官网自身仓库，仅用于页脚元信息，可留空 */
  websiteRepo: {
    owner: 'sonder123i',
    repo: 'new',
  },

  links: {
    releases: 'https://github.com/ZCShou/GoGoGo/releases',
    issues: 'https://github.com/ZCShou/GoGoGo/issues',
    license: 'https://github.com/ZCShou/GoGoGo/blob/master/LICENSE',
  },

  nav: [
    { label: '特性', href: '#features' },
    { label: '交互流', href: '#workflow' },
    { label: '实机画廊', href: '#gallery' },
    { label: '下载', href: '#download' },
  ],

  hero: {
    eyebrow: 'Android 13+ AGSL 光学引擎 · 纯本地零云端',
    titleLines: ['云迹 · CloudTrace', '将精密光学与液态玻璃，', '注入每一段轨迹。'],
    primaryCta: '下载最新版 APK',
    secondaryCta: '查看 GitHub 源码',
    hints: ['120Hz AGSL', '1m 游标卡尺', '零云端'],
    screen: 'home' as const,
  },

  marquee: {
    rowOne: ['CLOUDTRACE', 'LIQUID GLASS', '120HZ AGSL', 'VERNIER PRECISION'],
    rowTwo: ['LOCAL FIRST', 'ZERO TELEMETRY', 'VISIONOS ISLAND', 'OPEN SOURCE'],
  },

  stats: [
    { value: 120, suffix: 'Hz', label: '原生硬件加速', detail: '后台 0fps 零重绘隔离' },
    { value: 1, suffix: 'm', label: '游标卡尺套模', detail: '四向精准微调' },
    { value: 0, suffix: 'KB', label: '云端数据留存', detail: '轨迹纯本地加密保存' },
    { value: 360, suffix: '°', label: '自由视角漫游', detail: '徕卡光学目镜取景' },
  ],

  features: [
    {
      id: 'agsl',
      eyebrow: 'OPTICAL GLASS',
      title: '真 · AGSL 光学液态玻璃',
      body: '告别死白塑料感。基于 Android 13+ RuntimeShader 与圆角 SDF 算法，还原真实边缘折射、镜面高光与按压水滴形变。',
      span: 'wide' as const,
    },
    {
      id: 'island',
      eyebrow: 'DYNAMIC ISLAND',
      title: 'visionOS 深空黑曜石悬浮岛',
      body: '跨应用三态自动流转。无操作 3 秒淡化为边缘水滴半隐身，关键节点自动弹性展开横幅，国产 ROM 防穿透自适应兜底。',
      span: 'wide' as const,
    },
    {
      id: 'builder',
      eyebrow: 'TRACK BUILDER',
      title: '徕卡级光学操场建圈器',
      body: '一键套模 400m / 300m / 200m 跑道，配合游标卡尺刻度滑块与 1m 微调按键，3 秒精准锁定任意操场。',
      span: 'normal' as const,
    },
    {
      id: 'roam',
      eyebrow: 'FREE ROAM',
      title: '自由漫游与平滑移动',
      body: '支持任意点选空降、路线录制与短距离拟真步行过渡，内置去饱和银白 / 暗夜光学底片地图。',
      span: 'normal' as const,
    },
    {
      id: 'privacy',
      eyebrow: 'LOCAL ONLY',
      title: '纯本地零隐私焦虑',
      body: '不索取多余权限，所有路线与运动轨迹 100% 留存于本机。',
      span: 'small' as const,
    },
    {
      id: 'theme',
      eyebrow: 'DUAL THEME',
      title: '昼夜双生美学引擎',
      body: '户外强光防眩日光白与沉浸深空曜石黑一键切换，地图底图与玻璃材质全局联动。',
      span: 'small' as const,
    },
  ],

  islandMessages: [
    { tone: 'run' as const, text: '模拟运行中 · 5\'40" · 0.85/3.00km' },
    { tone: 'info' as const, text: '已切入第 2 跑道 · 模拟弯道自然外偏' },
    { tone: 'warn' as const, text: '检测到 Wi-Fi 已连接 · 建议关闭以防干扰' },
  ],

  workflow: {
    eyebrow: 'FLOW',
    title: '从选圈到收尾，四步无缝流转',
    description: '每一步都为「少一次点击」而设计。左侧为真实交互流，右侧卡片会随步骤自动洗牌。',
    steps: [
      {
        index: '01',
        title: '选圈与蓄力发车',
        body: '首页极简三段式卡片，长按蓄力扩散声呐光波，一键拉起运动生态。',
        screen: 'home' as const,
        tag: 'HOME',
      },
      {
        index: '02',
        title: '操场套模与游标校准',
        body: '锁定跑道瞬间平滑展开游标微调台，支持旋转、缩放与反转跑向。',
        screen: 'builder' as const,
        tag: 'BUILDER',
      },
      {
        index: '03',
        title: '自由漫游与实景接管',
        body: '银白光学地图叠加高透折射控制台，随时落点空降或录制专属路线。',
        screen: 'roam' as const,
        tag: 'ROAM',
      },
      {
        index: '04',
        title: '深空悬浮岛全程掌控',
        body: '在任意应用上方实时调配速、改距离、插点或优雅收尾。',
        screen: 'island' as const,
        tag: 'ISLAND',
      },
    ],
  },

  gallery: {
    eyebrow: 'GALLERY',
    title: '实机光学画廊',
    subtitle: '所见即所得 · 真实 Android 真机渲染截图（支持拖拽与滚轮浏览）',
    items: [
      { screen: 'run-dark' as const, title: '自动跑圈 · 暗夜', meta: '120Hz · AGSL 折射' },
      { screen: 'home' as const, title: '自动跑圈 · 日光', meta: '三段式首页' },
      { screen: 'roam' as const, title: '自由漫游', meta: '银白光学地图' },
      { screen: 'builder' as const, title: '操场建圈器', meta: '1m 游标校准' },
      { screen: 'island' as const, title: '深空悬浮岛', meta: '跨应用三态流转' },
      { screen: 'settings' as const, title: '体检与双生主题', meta: '昼夜一键切换' },
    ],
  },

  download: {
    eyebrow: 'RELEASE',
    title: '即刻体验云迹 · CloudTrace',
    description:
      '从 GitHub Releases 获取最新安装包。所有版本均附带更新日志与校验信息，历史版本可随时回退。',
    primaryCta: '直接下载 APK 安装包',
    secondaryCta: '前往 GitHub Releases',
    copyCta: '复制口令格式说明',
    copyHint: '路线分享口令格式：CLOUDTRACE://',
    requirements: 'Android 10+ · Android 13+ 解锁完整 AGSL 折射',
    fallbackRelease: {
      tag: 'v1.12.3',
      publishedAt: '2025-08-09',
      sizeKb: 22733,
      notes: [
        '新增「圆形摇杆」与「按钮摇杆」两种控制样式',
        '支持向 GPS / 网络 / 融合定位 Provider 同步提交模拟位置',
        '消息已读状态支持版本跟踪，公告更新后重新提示',
        '统一使用 WGS-84 坐标存储，改善地图与路线一致性',
      ],
    },
    lanyard: {
      front: ['CLOUDTRACE', 'OPEN SOURCE PASS', 'AGSL OPTICAL ENGINE', 'LOCAL ONLY · 120HZ'],
      serial: 'CT-2026-0001',
    },
  },

  footer: {
    disclaimer:
      '本项目仅用于运动轨迹可视化研究、定位开发调试与个人学习交流，请遵守当地法律法规与相关平台规范。',
    columns: [
      {
        title: '产品',
        links: [
          { label: '核心特性', href: '#features' },
          { label: '交互流', href: '#workflow' },
          { label: '实机画廊', href: '#gallery' },
          { label: '下载', href: '#download' },
        ],
      },
      {
        title: '资源',
        links: [
          { label: 'GitHub', href: 'https://github.com/ZCShou/GoGoGo' },
          { label: 'Releases', href: 'https://github.com/ZCShou/GoGoGo/releases' },
          { label: 'Issues', href: 'https://github.com/ZCShou/GoGoGo/issues' },
          { label: 'MIT License', href: 'https://github.com/ZCShou/GoGoGo/blob/master/LICENSE' },
        ],
      },
    ],
  },

  /** public/screenshots 下的真机图；文件缺失时自动回落到代码渲染界面 */
  screenshots: {
    'hero-home': 'screenshots/hero-home.png',
    'shot-home': 'screenshots/shot-home.png',
    'shot-roam': 'screenshots/shot-roam.png',
    'shot-builder': 'screenshots/shot-builder.png',
    'shot-island': 'screenshots/shot-island.png',
    'shot-settings': 'screenshots/shot-settings.png',
    'shot-run-dark': 'screenshots/shot-run-dark.png',
  } as Record<string, string>,
} as const;

export type SiteConfig = typeof siteConfig;
