import * as THREE from "three";

export const domePanelFadeVertexShader = /* glsl */ `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const domePanelFadeFragmentShader = /* glsl */ `
  precision highp float;

  uniform sampler2D map;
  uniform float opacity;
  uniform float edgeFade;

  varying vec2 vUv;

  void main() {
    vec4 tex = texture2D(map, vUv);

    // Rectangular rim fade only — full-bleed image, no circular mask.
    float distToEdge = min(min(vUv.x, 1.0 - vUv.x), min(vUv.y, 1.0 - vUv.y));
    float rim = smoothstep(0.0, edgeFade, distToEdge);

    gl_FragColor = vec4(tex.rgb * rim, rim * opacity);
  }
`;

export function createDomePanelFadeMaterial(map: THREE.Texture) {
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;

  return new THREE.ShaderMaterial({
    uniforms: {
      map: { value: map },
      opacity: { value: 1 },
      edgeFade: { value: 0.045 },
    },
    vertexShader: domePanelFadeVertexShader,
    fragmentShader: domePanelFadeFragmentShader,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.DoubleSide,
    toneMapped: false,
  });
}

export function applyTextureToDomePanelMaterial(
  material: THREE.ShaderMaterial,
  map: THREE.Texture,
) {
  map.wrapS = THREE.ClampToEdgeWrapping;
  map.wrapT = THREE.ClampToEdgeWrapping;
  material.uniforms.map.value = map;
}
