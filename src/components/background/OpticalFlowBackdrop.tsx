import { useEffect, useRef } from 'react';

export type BackdropMaterial = 'chrome' | 'silk' | 'iridescence';

interface OpticalFlowBackdropProps {
  material: BackdropMaterial;
  eco?: boolean;
}

const VERTEX_SHADER = `
  attribute vec2 a_pos;
  varying vec2 v_uv;
  void main() {
    v_uv = a_pos * 0.5 + 0.5;
    gl_Position = vec4(a_pos, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  varying vec2 v_uv;
  uniform vec2 u_res;
  uniform float u_time;
  uniform vec2 u_mouse;
  uniform vec3 u_ripple;   // x, y (0..1), age in seconds
  uniform vec3 u_weights;  // x = chrome, y = silk, z = iridescence

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
  }

  // 液态镀铬（Liquid Chrome）域扭曲高度场
  float chromeField(vec2 p, float t) {
    vec2 q = p;
    for (int i = 1; i <= 5; i++) {
      float fi = float(i);
      q.x += 0.34 / fi * sin(fi * 2.15 * q.y + t * 0.55 + 0.6 * fi);
      q.y += 0.34 / fi * cos(fi * 2.05 * q.x - t * 0.48 + 0.4 * fi);
    }
    return sin(q.x * 2.1 + q.y * 1.7 + t * 0.25) * 0.5 + 0.5;
  }

  // 瓷白真丝（Porcelain Silk）各向异性柔折高度场
  float silkField(vec2 p, float t) {
    vec2 s = mat2(0.84, -0.54, 0.54, 0.84) * p;
    float w1 = sin(s.x * 2.6 + sin(s.y * 1.8 + t * 0.35) * 1.15 + t * 0.28);
    float w2 = cos(s.x * 4.4 - s.y * 1.4 - t * 0.22) * 0.45;
    float weave = sin(s.y * 42.0 + w1 * 2.0) * 0.025;
    return clamp((w1 + w2) * 0.34 + 0.52 + weave, 0.0, 1.0);
  }

  // 珠光薄膜干涉（Pearl Iridescence）柔和波场
  vec3 pearlColor(vec2 p, float t, float h) {
    vec2 q = p * 1.15;
    q.x += 0.42 * sin(q.y * 1.9 + t * 0.42);
    q.y += 0.42 * cos(q.x * 1.7 - t * 0.36);
    float phase = (q.x * 0.45 + q.y * 0.38) + h * 0.75 + t * 0.08;
    // 极克制的贝母薄膜干涉色相（瓷白基底 + 冰蓝 / 珠紫 / 香槟微光）
    vec3 spectrum = 0.5 + 0.5 * cos(6.28318 * (phase + vec3(0.0, 0.14, 0.29)));
    vec3 porcelain = vec3(0.952, 0.962, 0.976);
    vec3 tinted = mix(vec3(0.875, 0.918, 0.968), vec3(0.955, 0.922, 0.968), spectrum.r);
    tinted = mix(tinted, vec3(0.968, 0.958, 0.935), spectrum.g * 0.35);
    return mix(porcelain, tinted, 0.42) + vec3(0.035) * pow(h, 2.2);
  }

  void main() {
    vec2 uv = v_uv;
    float aspect = u_res.x / max(u_res.y, 1.0);
    vec2 p = (uv - 0.5) * vec2(aspect, 1.0) * 1.85;
    vec2 mp = (u_mouse - 0.5) * vec2(aspect, 1.0) * 1.85;

    // 指针流体排开与点击阻尼涟漪
    float md = length(p - mp);
    vec2 mousePull = (p - mp) * exp(-md * 2.4) * 0.18;
    p -= mousePull;

    if (u_ripple.z > 0.0 && u_ripple.z < 2.6) {
      vec2 rp = (u_ripple.xy - 0.5) * vec2(aspect, 1.0) * 1.85;
      float rd = length(p - rp);
      float wave = sin((rd - u_ripple.z * 0.95) * 16.0) * exp(-rd * 2.8) * exp(-u_ripple.z * 1.5);
      p += normalize(p - rp + 0.0001) * wave * 0.055;
    }

    float t = u_time;
    float eps = 0.012;

    // 1) Liquid Chrome（明澈银白镀铬 + 摄影棚柔光箱高光）
    float hC = chromeField(p, t);
    float hCx = chromeField(p + vec2(eps, 0.0), t);
    float hCy = chromeField(p + vec2(0.0, eps), t);
    vec3 nC = normalize(vec3((hC - hCx) * 3.4, (hC - hCy) * 3.4, 1.0));
    vec3 lightDir1 = normalize(vec3(-0.45, 0.65, 0.85));
    vec3 lightDir2 = normalize(vec3(0.55, -0.35, 0.75));
    float diff1 = clamp(dot(nC, lightDir1), 0.0, 1.0);
    float spec1 = pow(clamp(dot(reflect(-lightDir1, nC), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 18.0);
    float spec2 = pow(clamp(dot(reflect(-lightDir2, nC), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 10.0);

    vec3 chromeValley = vec3(0.845, 0.870, 0.906);
    vec3 chromeMid = vec3(0.942, 0.953, 0.969);
    vec3 chromePeak = vec3(0.996, 0.998, 1.000);
    vec3 colChrome = mix(chromeValley, chromeMid, smoothstep(0.18, 0.78, hC * 0.65 + diff1 * 0.35));
    colChrome = mix(colChrome, chromePeak, clamp(spec1 * 0.78 + spec2 * 0.25, 0.0, 1.0));

    // 2) Porcelain Silk（哑光瓷白真丝折光）
    float hS = silkField(p, t);
    float hSx = silkField(p + vec2(eps, 0.0), t);
    float hSy = silkField(p + vec2(0.0, eps), t);
    vec3 nS = normalize(vec3((hS - hSx) * 2.2, (hS - hSy) * 2.2, 1.0));
    float sheenS = pow(clamp(dot(nS, normalize(vec3(0.25, 0.72, 0.9))), 0.0, 1.0), 6.0);
    vec3 colSilk = mix(vec3(0.896, 0.914, 0.938), vec3(0.972, 0.978, 0.988), smoothstep(0.15, 0.88, hS));
    colSilk += vec3(0.025, 0.028, 0.035) * sheenS;

    // 3) Pearl Iridescence（贝母薄雾干涉）
    vec3 colPearl = pearlColor(p, t, hC);

    vec3 color = colChrome * u_weights.x + colSilk * u_weights.y + colPearl * u_weights.z;

    // 边缘极淡瓷白柔罩，保证正文区域与首屏文字极致清晰
    float centerLift = smoothstep(1.35, 0.15, length(uv - vec2(0.5, 0.42)));
    color = mix(color, vec3(0.962, 0.970, 0.982), centerLift * 0.24);

    // 极细防色带陶瓷微抖动
    float grain = (hash(gl_FragCoord.xy + fract(t) * 17.0) - 0.5) * 0.014;
    color = clamp(color + grain, 0.0, 1.0);

    gl_FragColor = vec4(color, 1.0);
  }
`;

function compileShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function OpticalFlowBackdrop({ material, eco = false }: OpticalFlowBackdropProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const materialRef = useRef<BackdropMaterial>(material);
  materialRef.current = material;
  /** 2D 回退模式下的手动重绘入口（ECO 静态画布切材质 / resize 时使用） */
  const redraw2DRef = useRef<(() => void) | null>(null);

  // ECO 静态模式下切换材质：WebGL 分支由渲染循环平滑插值，2D 分支需要手动重绘一次
  useEffect(() => {
    if (!eco) return;
    redraw2DRef.current?.();
  }, [material, eco]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const targetWeights = () => {
      const m = materialRef.current;
      return [m === 'chrome' ? 1 : 0, m === 'silk' ? 1 : 0, m === 'iridescence' ? 1 : 0] as const;
    };

    // 省电模式或无 WebGL 时的 2D 流体回退
    const start2DFallback = () => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return () => {};

      let raf = 0;
      const resize = () => {
        const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
        canvas.width = Math.max(1, Math.floor(window.innerWidth * dpr));
        canvas.height = Math.max(1, Math.floor(window.innerHeight * dpr));
      };
      resize();

      const draw = (now: number) => {
        const t = now * 0.00025;
        const w = canvas.width;
        const h = canvas.height;
        ctx.fillStyle = '#F3F5F8';
        ctx.fillRect(0, 0, w, h);

        const m = materialRef.current;
        const blobs =
          m === 'iridescence'
            ? [
                ['rgba(186,214,247,0.34)', 0.25 + Math.sin(t) * 0.12, 0.28 + Math.cos(t * 0.8) * 0.1],
                ['rgba(221,210,248,0.3)', 0.76 + Math.cos(t * 0.9) * 0.1, 0.65 + Math.sin(t * 0.7) * 0.1],
              ]
            : m === 'silk'
              ? [
                  ['rgba(218,226,238,0.42)', 0.3 + Math.sin(t * 0.8) * 0.1, 0.22],
                  ['rgba(255,255,255,0.75)', 0.72, 0.7 + Math.cos(t * 0.7) * 0.08],
                ]
              : [
                  ['rgba(198,208,224,0.44)', 0.24 + Math.sin(t) * 0.1, 0.25 + Math.cos(t) * 0.08],
                  ['rgba(255,255,255,0.85)', 0.74 + Math.cos(t * 0.8) * 0.1, 0.58 + Math.sin(t * 0.9) * 0.08],
                ];

        for (const [color, cx, cy] of blobs) {
          const rx = Number(cx) * w;
          const ry = Number(cy) * h;
          const r = Math.max(w, h) * 0.55;
          const grad = ctx.createRadialGradient(rx, ry, 0, rx, ry, r);
          grad.addColorStop(0, String(color));
          grad.addColorStop(1, 'rgba(243,245,248,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);
        }

        if (!eco && !document.hidden) {
          raf = requestAnimationFrame(draw);
        }
      };

      // 静态（ECO）模式下也保留一次手动重绘能力，供 resize / 材质切换使用
      const renderOnce = () => draw(performance.now());
      redraw2DRef.current = renderOnce;

      const onResize = () => {
        resize();
        renderOnce();
      };

      window.addEventListener('resize', onResize, { passive: true });
      raf = requestAnimationFrame(draw);

      return () => {
        cancelAnimationFrame(raf);
        redraw2DRef.current = null;
        window.removeEventListener('resize', onResize);
      };
    };

    if (eco || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return start2DFallback();
    }

    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      stencil: false,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: false,
    });

    if (!gl) return start2DFallback();

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return start2DFallback();
    }

    const program = gl.createProgram();
    if (!program) return start2DFallback();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return start2DFallback();
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const posLoc = gl.getAttribLocation(program, 'a_pos');
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, 'u_res');
    const uTime = gl.getUniformLocation(program, 'u_time');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');
    const uRipple = gl.getUniformLocation(program, 'u_ripple');
    const uWeights = gl.getUniformLocation(program, 'u_weights');

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.max(1, Math.floor(window.innerWidth * dpr));
      const h = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };
    resize();

    const mouseTarget = { x: 0.52, y: 0.45 };
    const mouseCurrent = { x: 0.52, y: 0.45 };
    const ripple = { x: 0.5, y: 0.5, start: -10 };
    const weights = [...targetWeights()];

    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.x = e.clientX / Math.max(window.innerWidth, 1);
      mouseTarget.y = 1 - e.clientY / Math.max(window.innerHeight, 1);
    };

    const onPointerDown = (e: PointerEvent) => {
      ripple.x = e.clientX / Math.max(window.innerWidth, 1);
      ripple.y = 1 - e.clientY / Math.max(window.innerHeight, 1);
      ripple.start = performance.now() * 0.001;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let raf = 0;
    const startTime = performance.now() * 0.001;

    const render = (nowMs: number) => {
      raf = requestAnimationFrame(render);
      if (document.hidden) return;

      const now = nowMs * 0.001;
      const elapsed = now - startTime;

      mouseCurrent.x += (mouseTarget.x - mouseCurrent.x) * 0.06;
      mouseCurrent.y += (mouseTarget.y - mouseCurrent.y) * 0.06;

      const target = targetWeights();
      weights[0] += (target[0] - weights[0]) * 0.07;
      weights[1] += (target[1] - weights[1]) * 0.07;
      weights[2] += (target[2] - weights[2]) * 0.07;

      const rippleAge = now - ripple.start;

      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, elapsed);
      gl.uniform2f(uMouse, mouseCurrent.x, mouseCurrent.y);
      gl.uniform3f(uRipple, ripple.x, ripple.y, rippleAge);
      gl.uniform3f(uWeights, weights[0], weights[1], weights[2]);

      gl.drawArrays(gl.TRIANGLES, 0, 6);
    };

    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [eco]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-20 overflow-hidden bg-[#F3F5F8]">
      {/* key 随 eco 变化：同一块 canvas 无法从 webgl 切到 2d 上下文，必须换元素 */}
      <canvas key={eco ? '2d' : 'webgl'} ref={canvasRef} className="block h-full w-full" />
      {/* 极细建筑测绘十字坐标点缀（静态零开销） */}
      <div className="fixed left-5 top-5 hidden font-mono text-[10px] text-[#0A0C10]/20 lg:block">+</div>
      <div className="fixed right-5 top-5 hidden font-mono text-[10px] text-[#0A0C10]/20 lg:block">+</div>
      <div className="fixed bottom-5 left-5 hidden font-mono text-[10px] text-[#0A0C10]/20 lg:block">+</div>
      <div className="fixed bottom-5 right-5 hidden font-mono text-[10px] text-[#0A0C10]/20 lg:block">+</div>
    </div>
  );
}
