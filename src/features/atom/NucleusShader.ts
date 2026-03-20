import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorDeep;
  uniform vec3 uColorShallow;
  uniform vec3 uColorSand;
  uniform vec3 uColorLush;
  uniform vec3 uColorLava;
  uniform float uFishEyeStrength;

  varying vec2 vUv;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Simplex-style noise (compact 3D)
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod289(i);
    vec4 p = permute(permute(permute(
      i.z + vec4(0.0, i1.z, i2.z, 1.0))
      + i.y + vec4(0.0, i1.y, i2.y, 1.0))
      + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Fractional Brownian Motion
  float fbm(vec3 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p * frequency);
      amplitude *= 0.5;
      frequency *= 2.0;
    }
    return value;
  }

  void main() {
    // Fish-eye UV distortion
    vec2 centeredUv = vUv * 2.0 - 1.0;
    float dist = length(centeredUv);
    float fishEye = 1.0 + uFishEyeStrength * dist * dist;
    vec2 distortedUv = centeredUv / fishEye;
    vec2 finalUv = distortedUv * 0.5 + 0.5;

    // Animate noise coordinates
    vec3 noiseCoord = vPosition * 2.0 + vec3(uTime * 0.05, uTime * 0.03, uTime * 0.04);
    float terrain = fbm(noiseCoord);

    // Layer the terrain into biomes
    float ocean = smoothstep(-0.2, 0.0, terrain);
    float beach = smoothstep(0.0, 0.1, terrain);
    float land = smoothstep(0.1, 0.3, terrain);
    float volcano = smoothstep(0.35, 0.45, terrain);

    // Mix biome colors
    vec3 color = mix(uColorDeep, uColorShallow, ocean);
    color = mix(color, uColorSand, beach);
    color = mix(color, uColorLush, land);
    color = mix(color, uColorLava, volcano);

    // Rim lighting for atmosphere glow
    float rimDot = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
    float rim = smoothstep(0.4, 1.0, rimDot);
    vec3 rimColor = mix(uColorShallow, vec3(0.0, 0.96, 0.83), 0.5);
    color += rim * rimColor * 0.6;

    // Subtle pulsing glow
    float pulse = sin(uTime * 0.5) * 0.5 + 0.5;
    color += rim * rimColor * pulse * 0.15;

    gl_FragColor = vec4(color, 1.0);
  }
`

const NucleusMaterial = shaderMaterial(
  {
    uTime: 0,
    uColorDeep: new THREE.Color(0x0a1628),       // ocean deep
    uColorShallow: new THREE.Color(0x00b4d8),     // ocean turquoise
    uColorSand: new THREE.Color(0xfefae0),        // sand white
    uColorLush: new THREE.Color(0x2d6a4f),        // tropical lush
    uColorLava: new THREE.Color(0xe63946),         // volcanic lava
    uFishEyeStrength: 0.4,
  },
  vertexShader,
  fragmentShader
)

extend({ NucleusMaterial })

// Augment R3F's ThreeElements so <nucleusMaterial> is valid JSX
declare module '@react-three/fiber' {
  interface ThreeElements {
    nucleusMaterial: ThreeElements['shaderMaterial']
  }
}

export { NucleusMaterial }
