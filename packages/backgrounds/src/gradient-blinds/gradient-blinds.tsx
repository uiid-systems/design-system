"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

import {
  MAX_COLORS,
  DEFAULT_GRADIENT_COLORS,
  DEFAULT_ANGLE,
  DEFAULT_NOISE,
  DEFAULT_BLIND_COUNT,
  DEFAULT_BLIND_MIN_WIDTH,
  DEFAULT_MOUSE_DAMPENING,
  DEFAULT_SPOTLIGHT_RADIUS,
  DEFAULT_SPOTLIGHT_SOFTNESS,
  DEFAULT_SPOTLIGHT_OPACITY,
  DEFAULT_DISTORT_AMOUNT,
  DEFAULT_SHINE_DIRECTION,
  DEFAULT_MIX_BLEND_MODE,
} from "./gradient-blinds.constants";
import { VERTEX_SHADER, FRAGMENT_SHADER } from "./gradient-blinds.shaders";
import type { BackgroundGradientBlindsProps } from "./gradient-blinds.types";

/**
 * Converts a hex color string to RGB values (0-1 range)
 */
const hexToRGB = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "").padEnd(6, "0");
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  return [r, g, b];
};

/**
 * Prepares color stops for the shader, ensuring proper count and format
 */
const prepareColorStops = (
  stops: string[] | undefined,
): { colors: [number, number, number][]; count: number } => {
  const base = (stops && stops.length ? stops : DEFAULT_GRADIENT_COLORS).slice(
    0,
    MAX_COLORS,
  );

  // Ensure at least 2 colors
  if (base.length === 1) base.push(base[0]);

  // Pad to MAX_COLORS by repeating the last color
  while (base.length < MAX_COLORS) base.push(base[base.length - 1]);

  const colors: [number, number, number][] = [];
  for (let i = 0; i < MAX_COLORS; i++) {
    colors.push(hexToRGB(base[i]));
  }

  const count = Math.max(2, Math.min(MAX_COLORS, stops?.length ?? 2));
  return { colors, count };
};

export const BackgroundGradientBlinds = ({
  className,
  dpr,
  paused = false,
  gradientColors,
  angle = DEFAULT_ANGLE,
  noise = DEFAULT_NOISE,
  blindCount = DEFAULT_BLIND_COUNT,
  blindMinWidth = DEFAULT_BLIND_MIN_WIDTH,
  mouseDampening = DEFAULT_MOUSE_DAMPENING,
  mirrorGradient = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  spotlightSoftness = DEFAULT_SPOTLIGHT_SOFTNESS,
  spotlightOpacity = DEFAULT_SPOTLIGHT_OPACITY,
  distortAmount = DEFAULT_DISTORT_AMOUNT,
  shineDirection = DEFAULT_SHINE_DIRECTION,
  mixBlendMode = DEFAULT_MIX_BLEND_MODE,
  style,
  ...props
}: BackgroundGradientBlindsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const programRef = useRef<Program | null>(null);
  const meshRef = useRef<Mesh | null>(null);
  const geometryRef = useRef<Triangle | null>(null);
  const rendererRef = useRef<Renderer | null>(null);
  const mouseTargetRef = useRef<[number, number]>([0, 0]);
  const lastTimeRef = useRef<number>(0);
  const firstResizeRef = useRef<boolean>(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderer = new Renderer({
      dpr:
        dpr ??
        (typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1),
      alpha: true,
      antialias: true,
    });
    rendererRef.current = renderer;
    const gl = renderer.gl;
    const canvas = gl.canvas as HTMLCanvasElement;

    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    container.appendChild(canvas);

    const { colors: colorArr, count: colorCount } =
      prepareColorStops(gradientColors);

    const uniforms = {
      iResolution: {
        value: [gl.drawingBufferWidth, gl.drawingBufferHeight, 1],
      },
      iMouse: { value: [0, 0] },
      iTime: { value: 0 },
      uAngle: { value: (angle * Math.PI) / 180 },
      uNoise: { value: noise },
      uBlindCount: { value: Math.max(1, blindCount) },
      uSpotlightRadius: { value: spotlightRadius },
      uSpotlightSoftness: { value: spotlightSoftness },
      uSpotlightOpacity: { value: spotlightOpacity },
      uMirror: { value: mirrorGradient ? 1 : 0 },
      uDistort: { value: distortAmount },
      uShineFlip: { value: shineDirection === "right" ? 1 : 0 },
      uColor0: { value: colorArr[0] },
      uColor1: { value: colorArr[1] },
      uColor2: { value: colorArr[2] },
      uColor3: { value: colorArr[3] },
      uColor4: { value: colorArr[4] },
      uColor5: { value: colorArr[5] },
      uColor6: { value: colorArr[6] },
      uColor7: { value: colorArr[7] },
      uColorCount: { value: colorCount },
    };

    const program = new Program(gl, {
      vertex: VERTEX_SHADER,
      fragment: FRAGMENT_SHADER,
      uniforms,
    });
    programRef.current = program;

    const geometry = new Triangle(gl);
    geometryRef.current = geometry;
    const mesh = new Mesh(gl, { geometry, program });
    meshRef.current = mesh;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height);
      uniforms.iResolution.value = [
        gl.drawingBufferWidth,
        gl.drawingBufferHeight,
        1,
      ];

      if (blindMinWidth && blindMinWidth > 0) {
        const maxByMinWidth = Math.max(
          1,
          Math.floor(rect.width / blindMinWidth),
        );
        const effective = blindCount
          ? Math.min(blindCount, maxByMinWidth)
          : maxByMinWidth;
        uniforms.uBlindCount.value = Math.max(1, effective);
      } else {
        uniforms.uBlindCount.value = Math.max(1, blindCount);
      }

      if (firstResizeRef.current) {
        firstResizeRef.current = false;
        const cx = gl.drawingBufferWidth / 2;
        const cy = gl.drawingBufferHeight / 2;
        uniforms.iMouse.value = [cx, cy];
        mouseTargetRef.current = [cx, cy];
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const onPointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const scale = renderer.dpr || 1;
      const x = (e.clientX - rect.left) * scale;
      const y = (rect.height - (e.clientY - rect.top)) * scale;
      mouseTargetRef.current = [x, y];
      if (mouseDampening <= 0) {
        uniforms.iMouse.value = [x, y];
      }
    };
    canvas.addEventListener("pointermove", onPointerMove);

    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      uniforms.iTime.value = t * 0.001;

      if (mouseDampening > 0) {
        if (!lastTimeRef.current) lastTimeRef.current = t;
        const dt = (t - lastTimeRef.current) / 1000;
        lastTimeRef.current = t;
        const tau = Math.max(1e-4, mouseDampening);
        let factor = 1 - Math.exp(-dt / tau);
        if (factor > 1) factor = 1;
        const target = mouseTargetRef.current;
        const cur = uniforms.iMouse.value;
        cur[0] += (target[0] - cur[0]) * factor;
        cur[1] += (target[1] - cur[1]) * factor;
      } else {
        lastTimeRef.current = t;
      }

      if (!paused && programRef.current && meshRef.current) {
        try {
          renderer.render({ scene: meshRef.current });
        } catch (e) {
          console.error(e);
        }
      }
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      canvas.removeEventListener("pointermove", onPointerMove);
      ro.disconnect();
      if (canvas.parentElement === container) {
        container.removeChild(canvas);
      }

      // Cleanup WebGL resources
      const callIfFn = (obj: unknown, key: string) => {
        if (
          obj &&
          typeof (obj as Record<string, unknown>)[key] === "function"
        ) {
          (obj as Record<string, () => void>)[key]();
        }
      };
      callIfFn(programRef.current, "remove");
      callIfFn(geometryRef.current, "remove");
      callIfFn(meshRef.current, "remove");
      callIfFn(rendererRef.current, "destroy");
      programRef.current = null;
      geometryRef.current = null;
      meshRef.current = null;
      rendererRef.current = null;
    };
  }, [
    dpr,
    paused,
    gradientColors,
    angle,
    noise,
    blindCount,
    blindMinWidth,
    mouseDampening,
    mirrorGradient,
    spotlightRadius,
    spotlightSoftness,
    spotlightOpacity,
    distortAmount,
    shineDirection,
  ]);

  return (
    <div
      ref={containerRef}
      data-slot="background-gradient-blinds"
      className={className}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        ...(mixBlendMode && { mixBlendMode }),
        ...style,
      }}
      {...props}
    />
  );
};

BackgroundGradientBlinds.displayName = "BackgroundGradientBlinds";
