"use client";

import { useEffect, useRef } from "react";
import { Renderer, Program, Mesh, Color, Triangle } from "ogl";

import {
  DEFAULT_AMPLITUDE,
  DEFAULT_BLEND,
  DEFAULT_COLOR_STOPS,
  DEFAULT_SPEED,
} from "./aurora.constants";
import { vertexShader, fragmentShader } from "./aurora.shaders";
import type { BackgroundAuroraProps } from "./aurora.types";

export const BackgroundAurora = ({
  colorStops = DEFAULT_COLOR_STOPS,
  amplitude = DEFAULT_AMPLITUDE,
  blend = DEFAULT_BLEND,
  speed = DEFAULT_SPEED,
  time,
  ...props
}: BackgroundAuroraProps) => {
  // Store current prop values in ref for animation loop access
  // This allows props to update without recreating WebGL context
  const propsRef = useRef({ colorStops, amplitude, blend, speed, time });
  propsRef.current = { colorStops, amplitude, blend, speed, time };

  const ctnDom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    const renderer = new Renderer({
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.canvas.style.backgroundColor = "transparent";

    // eslint-disable-next-line @typescript-eslint/prefer-const
    let program: Program | undefined;

    function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) {
        program.uniforms.uResolution.value = [width, height];
      }
    }
    window.addEventListener("resize", resize);

    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) {
      delete geometry.attributes.uv;
    }

    const colorStopsArray = colorStops.map((hex) => {
      const c = new Color(hex);
      return [c.r, c.g, c.b];
    });

    program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStopsArray },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });
    ctn.appendChild(gl.canvas);

    let animateId = 0;
    const update = (t: number) => {
      animateId = requestAnimationFrame(update);
      const current = propsRef.current;
      const animTime = current.time ?? t * 0.01;

      if (program) {
        program.uniforms.uTime.value = animTime * current.speed * 0.1;
        program.uniforms.uAmplitude.value = current.amplitude;
        program.uniforms.uBlend.value = current.blend;
        program.uniforms.uColorStops.value = current.colorStops.map((hex) => {
          const c = new Color(hex);
          return [c.r, c.g, c.b];
        });
        renderer.render({ scene: mesh });
      }
    };
    animateId = requestAnimationFrame(update);

    resize();

    return () => {
      cancelAnimationFrame(animateId);
      window.removeEventListener("resize", resize);
      if (ctn && gl.canvas.parentNode === ctn) {
        ctn.removeChild(gl.canvas);
      }
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [colorStops, amplitude, blend, speed]);

  return (
    <div ref={ctnDom} style={{ width: "100%", height: "100%" }} {...props} />
  );
};

BackgroundAurora.displayName = "BackgroundAurora";
