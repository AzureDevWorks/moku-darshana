import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

function createAuraTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;

  const context = canvas.getContext("2d");

  const gradient = context.createRadialGradient(
    256,
    256,
    20,
    256,
    256,
    256
  );

  gradient.addColorStop(0, "rgba(255, 218, 130, 0.40)");
  gradient.addColorStop(0.25, "rgba(235, 180, 75, 0.18)");
  gradient.addColorStop(0.55, "rgba(210, 150, 50, 0.06)");
  gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  return texture;
}

export default function SacredAura() {
  const auraRef = useRef();
  const textureRef = useRef();

  if (!textureRef.current) {
    textureRef.current = createAuraTexture();
  }

  useFrame((state) => {
    if (!auraRef.current) return;

    const time = state.clock.elapsedTime;

    // Very slow sacred light pulse
    const pulse = 1 + Math.sin(time * 0.7) * 0.012;

    auraRef.current.scale.set(
      4.5 * pulse,
      4.5 * pulse,
      1
    );

    // Tiny response to the viewer
    auraRef.current.position.x =
      THREE.MathUtils.lerp(
        auraRef.current.position.x,
        state.pointer.x * 0.012,
        0.025
      );

    auraRef.current.position.y =
      THREE.MathUtils.lerp(
        auraRef.current.position.y,
        state.pointer.y * 0.008,
        0.025
      );
  });

  return (
    <mesh
      ref={auraRef}
      position={[0, 0, -0.35]}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        map={textureRef.current}
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
