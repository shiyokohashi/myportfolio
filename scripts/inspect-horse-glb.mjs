import * as THREE from "three";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const buffer = readFileSync(join(__dirname, "../public/models/Horse.glb"));

const loader = new GLTFLoader();
loader.parse(
  buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength,
  ),
  "",
  (gltf) => {
    console.log("=== ANIMATIONS ===");
    for (const clip of gltf.animations) {
      console.log({
        name: clip.name,
        duration: clip.duration,
        tracks: clip.tracks.map((t) => ({
          name: t.name,
          type: t.constructor.name,
          times: t.times.length,
          values: t.values.length,
        })),
      });
    }

    let meshCount = 0;
    let totalVerts = 0;
    let morphTargetCount = 0;

    gltf.scene.traverse((obj) => {
      if (obj.isMesh) {
        meshCount++;
        const mesh = obj;
        const geo = mesh.geometry;
        const pos = geo.getAttribute("position");
        totalVerts += pos?.count ?? 0;
        if (mesh.morphTargetDictionary) {
          morphTargetCount = Object.keys(mesh.morphTargetDictionary).length;
          console.log("=== MORPH TARGETS ===");
          console.log("dictionary:", mesh.morphTargetDictionary);
          console.log("influences:", mesh.morphTargetInfluences?.length);
          if (geo.morphAttributes.position) {
            console.log(
              "morph position attrs:",
              geo.morphAttributes.position.length,
            );
          }
        }
        console.log("=== MESH ===", {
          name: mesh.name,
          vertices: pos?.count,
          hasSkeleton: !!mesh.skeleton,
          bones: mesh.skeleton?.bones.length ?? 0,
        });
      }
    });

    console.log("=== SUMMARY ===", {
      meshCount,
      totalVerts,
      morphTargetCount,
      animationCount: gltf.animations.length,
    });
  },
  (err) => console.error(err),
);
