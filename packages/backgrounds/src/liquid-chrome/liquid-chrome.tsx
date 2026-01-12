"use client";

import { useRef, useEffect } from "react";
import { Renderer, Program, Mesh, Triangle } from "ogl";

import { hexToNormalizedRgb } from "../backgrounds.utils";
import {
  DEFAULT_AMPLITUDE,
  DEFAULT_BASE_COLOR,
  DEFAULT_FREQUENCY_X,
  DEFAULT_FREQUENCY_Y,
  DEFAULT_INTERACTIVE,
  DEFAULT_MOUSE_INTENSITY,
  DEFAULT_SECONDARY_COLOR,
  DEFAULT_SPEED,
} from "./liquid-chrome.constants";
import { vertexShader, fragmentShader } from "./liquid-chrome.shaders";
import type { BackgroundLiquidChromeProps } from "./liquid-chrome.types";

export const BackgroundLiquidChrome = ({
  baseColor = DEFAULT_BASE_COLOR,
  secondaryColor = DEFAULT_SECONDARY_COLOR,
  speed = DEFAULT_SPEED,
  amplitude = DEFAULT_AMPLITUDE,
  frequencyX = DEFAULT_FREQUENCY_X,
  frequencyY = DEFAULT_FREQUENCY_Y,
  interactive = DEFAULT_INTERACTIVE,
  mouseIntensity = DEFAULT_MOUSE_INTENSITY,
  ...props
}: BackgroundLiquidChromeProps) => {
  // Convert hex to normalized RGB for WebGL
  const normalizedBaseColor = hexToNormalizedRgb(baseColor);
  const normalizedSecondaryColor = hexToNormalizedRgb(secondaryColor);

  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const renderer = new Renderer({ antialias: true });
    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);

    const geometry = new Triangle(gl);
    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uResolution: {
          value: new Float32Array([gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height])
        },
        uBaseColor: { value: new Float32Array(normalizedBaseColor) },
        uSecondaryColor: { value: new Float32Array(normalizedSecondaryColor) },
        uAmplitude: { value: amplitude },
        uFrequencyX: { value: frequencyX },
        uFrequencyY: { value: frequencyY },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseIntensity: { value: mouseIntensity }
      }
    });
    const mesh = new Mesh(gl, { geometry, program });

    function resize() {
      const scale = 1;
      renderer.setSize(container.offsetWidth * scale, container.offsetHeight * scale);
      const resUniform = program.uniforms.uResolution.value as Float32Array;
      resUniform[0] = gl.canvas.width;
      resUniform[1] = gl.canvas.height;
      resUniform[2] = gl.canvas.width / gl.canvas.height;
    }
    window.addEventListener('resize', resize);
    resize();

    function handleMouseMove(event: MouseEvent) {
      const rect = container.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = x;
      mouseUniform[1] = y;
    }

    function handleTouchMove(event: TouchEvent) {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        const rect = container.getBoundingClientRect();
        const x = (touch.clientX - rect.left) / rect.width;
        const y = 1 - (touch.clientY - rect.top) / rect.height;
        const mouseUniform = program.uniforms.uMouse.value as Float32Array;
        mouseUniform[0] = x;
        mouseUniform[1] = y;
      }
    }

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
      container.addEventListener('touchmove', handleTouchMove);
    }

    let animationId: number;
    function update(t: number) {
      animationId = requestAnimationFrame(update);
      program.uniforms.uTime.value = t * 0.001 * speed;
      renderer.render({ scene: mesh });
    }
    animationId = requestAnimationFrame(update);

    container.appendChild(gl.canvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
        container.removeEventListener('touchmove', handleTouchMove);
      }
      if (gl.canvas.parentElement) {
        gl.canvas.parentElement.removeChild(gl.canvas);
      }
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [baseColor, secondaryColor, speed, amplitude, frequencyX, frequencyY, interactive, mouseIntensity]);

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} {...props} />;
};

export default BackgroundLiquidChrome;
