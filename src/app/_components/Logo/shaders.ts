// Full-screen triangle; every pass shares this vertex shader
export const vertex = /* glsl */ `#version 300 es
out vec2 vUv;
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  vUv = p;
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`

// Draws the logo in HDR.
// uCoverage: R = lines, G = solid shapes, B = dots
// uReveal:   R = time (x uRevealScale seconds) at which each line pixel is drawn
export const scene = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;

uniform sampler2D uCoverage;
uniform sampler2D uReveal;
uniform float uRevealScale;
uniform float uTime;
uniform vec2 uResolution;   // canvas size in px
uniform vec4 uLogoRect;     // logo box in canvas px: x, y, w, h (y down)
uniform vec2 uPointer;      // -1..1
uniform float uEncode;      // 1 for float targets, <1 to fit HDR into 8 bit

float hash(float n) { return fract(sin(n * 127.1) * 43758.5453); }
float hash2(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

// Sample unconditionally (keeps mip derivatives valid), then mask
vec3 sampleLogo(vec2 uv) {
  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));
  return texture(uCoverage, uv).rgb * inside.x * inside.y;
}

void main() {
  vec2 px = vec2(vUv.x, 1.0 - vUv.y) * uResolution;
  float t = uTime;

  // Float + pointer parallax
  vec2 offset = vec2(0.0, sin(t * 1.57) * 6.0) + uPointer * vec2(-8.0, -6.0);
  vec2 uv = (px - uLogoRect.xy - offset) / uLogoRect.zw;
  uv = (uv - 0.5) * (1.0 - 0.01 * sin(t * 1.57)) + 0.5;

  // Glitch bursts: a few per ~5s after the intro
  float period = 5.0;
  float idx = floor(t / period);
  float start = period * idx + 1.0 + hash(idx) * 3.0;
  float burst = t > 4.5 ? smoothstep(start, start + 0.02, t) * (1.0 - smoothstep(start + 0.12, start + 0.3, t)) : 0.0;
  // Short flicker during the fill-in too
  burst += smoothstep(2.6, 2.65, t) * (1.0 - smoothstep(2.8, 3.1, t)) * 0.6;

  float slice = floor(uv.y * 48.0);
  float sliceShift = (hash2(vec2(slice, floor(t * 24.0))) - 0.5) * step(0.55, hash2(vec2(slice * 0.37, idx)));
  uv.x += sliceShift * 0.08 * burst;

  // Chromatic split grows with bursts and pointer distance
  vec2 ca = (vec2(0.0025, 0.0) + uPointer * 0.002) * (1.0 + burst * 6.0);
  vec3 covR = sampleLogo(uv + ca);
  vec3 covG = sampleLogo(uv);
  vec3 covB = sampleLogo(uv - ca);

  // Lines draw in along their own direction with a hot head
  float revealAt = texture(uReveal, uv).r * uRevealScale;
  float drawn = step(revealAt, t) * step(0.001, revealAt);
  float head = drawn * exp(-(t - revealAt) * 9.0);
  float lineGain = drawn * (1.0 + head * 14.0);

  // Dots pop in, shapes flicker on
  float dots = smoothstep(2.5, 3.2, t);
  float flick = step(0.35, hash(floor(t * 30.0)));
  float fill = t < 2.7 ? 0.0 : (t < 3.4 ? flick * smoothstep(2.7, 3.4, t) : 1.0);

  // Diagonal light sweep every 7s
  float sweepPos = mod(t - 3.5, 7.0) / 1.6;
  float sweep = t > 3.5 ? exp(-pow((uv.x + uv.y * 0.7 - sweepPos * 2.4 + 0.4) * 9.0, 2.0)) : 0.0;

  float breathe = 1.0 + 0.12 * sin(t * 2.1);

  vec3 lines = vec3(covR.r, covG.r, covB.r) * lineGain;
  vec3 shapes = vec3(covR.g, covG.g, covB.g) * fill;
  vec3 dotsC = vec3(covR.b, covG.b, covB.b) * dots;

  vec3 color = (lines * 1.1 + shapes * 0.8 + dotsC) * breathe;
  color += (lines + shapes) * sweep * 3.5;
  color *= mix(vec3(1.0), vec3(1.25, 0.9, 1.3), burst * 0.6);

  outColor = vec4(color * uEncode, 1.0);
}`

// Soft-knee threshold + first downsample
export const bright = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSource;
uniform vec2 uTexel;
uniform float uThreshold;
uniform float uDecode;
void main() {
  vec3 c = texture(uSource, vUv).rgb * 4.0;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  c = c / 8.0 * uDecode;
  float l = max(c.r, max(c.g, c.b));
  float knee = uThreshold * 0.5;
  float soft = clamp(l - uThreshold + knee, 0.0, 2.0 * knee);
  soft = soft * soft / (4.0 * knee + 1e-4);
  float w = max(soft, l - uThreshold) / max(l, 1e-4);
  outColor = vec4(c * w / uDecode, 1.0);
}`

// Dual-filter (Kawase) down / up sampling
export const down = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSource;
uniform vec2 uTexel;
void main() {
  vec3 c = texture(uSource, vUv).rgb * 4.0;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(1.0, -1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(1.0, 1.0)).rgb;
  outColor = vec4(c / 8.0, 1.0);
}`

export const up = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uSource;
uniform vec2 uTexel;
void main() {
  vec3 c = vec3(0.0);
  c += texture(uSource, vUv + uTexel * vec2(-2.0, 0.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(2.0, 0.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(0.0, -2.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(0.0, 2.0)).rgb;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, -1.0)).rgb * 2.0;
  c += texture(uSource, vUv + uTexel * vec2(1.0, -1.0)).rgb * 2.0;
  c += texture(uSource, vUv + uTexel * vec2(-1.0, 1.0)).rgb * 2.0;
  c += texture(uSource, vUv + uTexel * vec2(1.0, 1.0)).rgb * 2.0;
  outColor = vec4(c / 12.0, 1.0);
}`

// Scene + bloom, tone mapped, a little grain.
// Output is premultiplied with alpha = brightness, so the glow lays over
// whatever is behind the canvas (close to a screen blend) and black is clear.
export const composite = /* glsl */ `#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uScene;
uniform sampler2D uBloom;
uniform float uBloomStrength;
uniform float uDecode;
uniform float uTime;
uniform float uFade;
void main() {
  vec3 c = (texture(uScene, vUv).rgb + texture(uBloom, vUv).rgb * uBloomStrength) * uDecode;
  c = 1.0 - exp(-c * 1.1);
  float grain = fract(sin(dot(gl_FragCoord.xy + uTime, vec2(12.9898, 78.233))) * 43758.5453);
  c = max(c + (grain - 0.5) * 0.025 * step(0.02, c.r + c.g + c.b), 0.0);
  c *= uFade;
  float alpha = max(c.r, max(c.g, c.b));
  outColor = vec4(c, alpha);
}`
