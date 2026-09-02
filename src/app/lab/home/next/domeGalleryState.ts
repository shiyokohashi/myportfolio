import * as THREE from "three";

import { HORSE_YAW } from "@/components/horseSceneConstants";

/** Immersion scale — camera sits well inside this radius. */
export const DOME_RADIUS = 58;
/** Projection surface inset on the inner wall. */
export const DOME_WALL_RADIUS = DOME_RADIUS - 1.2;
/** Viewport fill for the curved screen (angular overscan on the sphere). */
export const PANEL_VIEW_FILL = 1.06;
/** Horizontal turn (radians) while dragging before the next random project. */
export const REVEAL_TURN_THRESHOLD = 0.26;

/** Side-on framing — camera and horse both inside the dome volume. */
export const DOME_SCENE_FRAMING = {
  horsePos: [0, 4.2, 0] as [number, number, number],
  lookAt: [0, 4.0, 0] as [number, number, number],
  cameraPos: [-20, 4.0, 0] as [number, number, number],
  fov: 40,
};

export type DomeProject = {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  href: string;
};

export type DomeScreenPatch = {
  phi: number;
  theta: number;
  phiSpan: number;
  thetaSpan: number;
};

export function wrapAngle(angle: number): number {
  let wrapped = angle;
  while (wrapped > Math.PI) wrapped -= Math.PI * 2;
  while (wrapped < -Math.PI) wrapped += Math.PI * 2;
  return wrapped;
}

export function pickRandomProjectIndex(length: number, exclude: number): number {
  if (length <= 1) return 0;
  let next = exclude;
  while (next === exclude) {
    next = Math.floor(Math.random() * length);
  }
  return next;
}

/** Y-up spherical coords matching Three.js SphereGeometry. */
export function sphericalFromDirection(dir: THREE.Vector3): {
  phi: number;
  theta: number;
} {
  const unit = dir.clone().normalize();
  return {
    phi: Math.atan2(unit.x, unit.z),
    theta: Math.acos(THREE.MathUtils.clamp(unit.y, -1, 1)),
  };
}

export function directionFromSpherical(phi: number, theta: number, target = new THREE.Vector3()) {
  const sinTheta = Math.sin(theta);
  return target.set(sinTheta * Math.sin(phi), Math.cos(theta), sinTheta * Math.cos(phi));
}

/** Nearest inner-wall hit along a world-space view ray (viewer is inside the dome). */
export function hitInnerDomeWall(
  cameraWorld: THREE.Vector3,
  lookDir: THREE.Vector3,
  target: THREE.Vector3,
  radius = DOME_WALL_RADIUS,
): number {
  const b = 2 * cameraWorld.dot(lookDir);
  const c = cameraWorld.lengthSq() - radius * radius;
  const discriminant = b * b - 4 * c;

  let rayDistance = radius;
  if (discriminant >= 0) {
    const sqrtDisc = Math.sqrt(discriminant);
    const t1 = (-b - sqrtDisc) / 2;
    const t2 = (-b + sqrtDisc) / 2;
    const hits = [t1, t2].filter((t) => t > 0.01);
    rayDistance = hits.length > 0 ? Math.min(...hits) : Math.max(t1, t2, 0.01);
  }

  target.copy(lookDir).multiplyScalar(rayDistance).add(cameraWorld);
  target.setLength(radius);
  return cameraWorld.distanceTo(target);
}

export function viewportAngularExtents(
  camera: THREE.PerspectiveCamera,
  fill = PANEL_VIEW_FILL,
) {
  const vHalf = THREE.MathUtils.degToRad(camera.fov * 0.5) * fill;
  const aspect = camera.aspect > 0 ? camera.aspect : 16 / 9;
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  return { vHalf, hHalf };
}

/** Curved screen patch welded to the inner dome wall at `wallNormal`. */
export function domeScreenPatchFromWallNormal(
  wallNormal: THREE.Vector3,
  camera: THREE.PerspectiveCamera,
  fill = PANEL_VIEW_FILL,
): DomeScreenPatch {
  const { phi, theta } = sphericalFromDirection(wallNormal);
  const { vHalf, hHalf } = viewportAngularExtents(camera, fill);
  return {
    phi,
    theta,
    phiSpan: hHalf * 2,
    thetaSpan: vHalf * 2,
  };
}

export function createCurvedDomeScreenGeometry(
  radius: number,
  patch: DomeScreenPatch,
): THREE.SphereGeometry {
  const widthSegments = Math.max(20, Math.ceil(patch.phiSpan * 48));
  const heightSegments = Math.max(16, Math.ceil(patch.thetaSpan * 36));

  return new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    patch.phi - patch.phiSpan / 2,
    patch.phiSpan,
    patch.theta - patch.thetaSpan / 2,
    patch.thetaSpan,
  );
}

/** Default screen anchor — inner wall point behind the horse at load framing. */
export function computeDefaultDomeScreenPatch(
  aspect = 16 / 9,
  fill = PANEL_VIEW_FILL,
): DomeScreenPatch {
  const { cameraPos, lookAt, fov } = DOME_SCENE_FRAMING;

  const yaw = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), HORSE_YAW);
  const cameraWorld = new THREE.Vector3(...cameraPos).applyQuaternion(yaw);
  const targetWorld = new THREE.Vector3(...lookAt).applyQuaternion(yaw);
  const lookDir = targetWorld.sub(cameraWorld).normalize();
  const wallPoint = new THREE.Vector3();
  hitInnerDomeWall(cameraWorld, lookDir, wallPoint);

  const camera = new THREE.PerspectiveCamera(fov, aspect, 0.05, 220);
  return domeScreenPatchFromWallNormal(wallPoint, camera, fill);
}

export function labelPointOnDome(
  patch: DomeScreenPatch,
  radius: number,
  below = 0.38,
  target = new THREE.Vector3(),
) {
  const theta = patch.theta + patch.thetaSpan * below;
  return directionFromSpherical(patch.phi, theta, target).multiplyScalar(radius);
}
