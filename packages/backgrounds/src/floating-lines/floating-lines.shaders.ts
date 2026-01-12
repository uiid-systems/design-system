export const vertexShader = `
  precision highp float;

  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  precision highp float;

  uniform float iTime;
  uniform vec3  iResolution;
  uniform float animationSpeed;

  uniform bool enableTop;
  uniform bool enableMiddle;
  uniform bool enableBottom;

  uniform int topLineCount;
  uniform int middleLineCount;
  uniform int bottomLineCount;

  uniform float topLineDistance;
  uniform float middleLineDistance;
  uniform float bottomLineDistance;

  uniform vec3 topWavePosition;
  uniform vec3 middleWavePosition;
  uniform vec3 bottomWavePosition;

  uniform vec2 iMouse;
  uniform bool interactive;
  uniform float bendRadius;
  uniform float bendStrength;
  uniform float bendInfluence;

  uniform bool parallax;
  uniform float parallaxStrength;
  uniform vec2 parallaxOffset;

  uniform vec3 lineGradient[8];
  uniform int lineGradientCount;

  const vec3 BLACK = vec3(0.0);
  const vec3 PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
  const vec3 BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

  mat2 rotate(float r) {
    return mat2(cos(r), sin(r), -sin(r), cos(r));
  }

  vec3 background_color(vec2 uv) {
    vec3 col = vec3(0.0);

    float y = sin(uv.x - 0.2) * 0.3 - 0.1;
    float m = uv.y - y;

    col += mix(BLUE, BLACK, smoothstep(0.0, 1.0, abs(m)));
    col += mix(PINK, BLACK, smoothstep(0.0, 1.0, abs(m - 0.8)));
    return col * 0.5;
  }

  vec3 getLineColor(float t, vec3 baseColor) {
    if (lineGradientCount <= 0) {
      return baseColor;
    }

    vec3 gradientColor;
    
    if (lineGradientCount == 1) {
      gradientColor = lineGradient[0];
    } else {
      float clampedT = clamp(t, 0.0, 0.9999);
      float scaled = clampedT * float(lineGradientCount - 1);
      int idx = int(floor(scaled));
      float f = fract(scaled);
      int idx2 = min(idx + 1, lineGradientCount - 1);

      vec3 c1 = lineGradient[idx];
      vec3 c2 = lineGradient[idx2];
      
      gradientColor = mix(c1, c2, f);
    }
    
    return gradientColor * 0.5;
  }

    float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
    float time = iTime * animationSpeed;

    float x_offset   = offset;
    float x_movement = time * 0.1;
    float amp        = sin(offset + time * 0.2) * 0.3;
    float y          = sin(uv.x + x_offset + x_movement) * amp;

    if (shouldBend) {
      vec2 d = screenUv - mouseUv;
      float influence = exp(-dot(d, d) * bendRadius); // radial falloff around cursor
      float bendOffset = (mouseUv.y - screenUv.y) * influence * bendStrength * bendInfluence;
      y += bendOffset;
    }

    float m = uv.y - y;
    return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
    baseUv.y *= -1.0;
    
    if (parallax) {
      baseUv += parallaxOffset;
    }

    vec3 col = vec3(0.0);

    vec3 b = lineGradientCount > 0 ? vec3(0.0) : background_color(baseUv);

    vec2 mouseUv = vec2(0.0);
    if (interactive) {
      mouseUv = (2.0 * iMouse - iResolution.xy) / iResolution.y;
      mouseUv.y *= -1.0;
    }
    
    if (enableBottom) {
      for (int i = 0; i < bottomLineCount; ++i) {
        float fi = float(i);
        float t = fi / max(float(bottomLineCount - 1), 1.0);
        vec3 lineCol = getLineColor(t, b);
        
        float angle = bottomWavePosition.z * log(length(baseUv) + 1.0);
        vec2 ruv = baseUv * rotate(angle);
        col += lineCol * wave(
          ruv + vec2(bottomLineDistance * fi + bottomWavePosition.x, bottomWavePosition.y),
          1.5 + 0.2 * fi,
          baseUv,
          mouseUv,
          interactive
        ) * 0.2;
      }
    }

    if (enableMiddle) {
      for (int i = 0; i < middleLineCount; ++i) {
        float fi = float(i);
        float t = fi / max(float(middleLineCount - 1), 1.0);
        vec3 lineCol = getLineColor(t, b);
        
        float angle = middleWavePosition.z * log(length(baseUv) + 1.0);
        vec2 ruv = baseUv * rotate(angle);
        col += lineCol * wave(
          ruv + vec2(middleLineDistance * fi + middleWavePosition.x, middleWavePosition.y),
          2.0 + 0.15 * fi,
          baseUv,
          mouseUv,
          interactive
        );
      }
    }

    if (enableTop) {
      for (int i = 0; i < topLineCount; ++i) {
        float fi = float(i);
        float t = fi / max(float(topLineCount - 1), 1.0);
        vec3 lineCol = getLineColor(t, b);
        
        float angle = topWavePosition.z * log(length(baseUv) + 1.0);
        vec2 ruv = baseUv * rotate(angle);
        ruv.x *= -1.0;
        col += lineCol * wave(
          ruv + vec2(topLineDistance * fi + topWavePosition.x, topWavePosition.y),
          1.0 + 0.2 * fi,
          baseUv,
          mouseUv,
          interactive
        ) * 0.1;
      }
    }

    fragColor = vec4(col, 1.0);
  }

  void main() {
    vec4 color = vec4(0.0);
    mainImage(color, gl_FragCoord.xy);
    gl_FragColor = color;
  }
`;
