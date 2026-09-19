import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

export default function SacredBackground() {
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/temple/temple-interior.jpg"
  );

  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh
      position={[0, 0, -1]}
      scale={[12, 6.75, 1]}
    >
      <planeGeometry args={[1, 1]} />

      <meshBasicMaterial
        map={texture}
        depthWrite={false}
        toneMapped={false}
      />
    </mesh>
  );
}
