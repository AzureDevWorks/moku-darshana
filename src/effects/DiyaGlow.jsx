import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function DiyaGlow() {
  const flameRef = useRef();

  useFrame(() => {
    if (!flameRef.current) return;

    const time = performance.now() * 0.001;

    flameRef.current.rotation.z =
      Math.sin(time * 2.4) * 0.025;

    flameRef.current.scale.x =
      1 + Math.sin(time * 3.0) * 0.025;

    flameRef.current.scale.y =
      1 + Math.sin(time * 2.7) * 0.035;
  });

  return (
    <group position={[0, -2.15, 0.1]}>

      {/* Clay bowl */}
      <mesh
        position={[0, -0.10, 0]}
        scale={[0.42, 0.13, 1]}
      >
        <circleGeometry args={[1, 48]} />

        <meshBasicMaterial
          color="#8b4a28"
          toneMapped={false}
        />
      </mesh>

      {/* Oil */}
      <mesh
        position={[0, -0.055, 0.02]}
        scale={[0.29, 0.065, 1]}
      >
        <circleGeometry args={[1, 48]} />

        <meshBasicMaterial
          color="#2a1509"
          toneMapped={false}
        />
      </mesh>

      {/* Wick */}
      <mesh
        position={[0, 0.04, 0.04]}
        scale={[0.035, 0.11, 1]}
      >
        <circleGeometry args={[1, 24]} />

        <meshBasicMaterial
          color="#17100b"
          toneMapped={false}
        />
      </mesh>

      {/* Outer flame */}
      <mesh
        ref={flameRef}
        position={[0, 0.28, 0.06]}
        scale={[0.018, 0.055, 1]}
      >
        <circleGeometry args={[1, 32]} />

        <meshBasicMaterial
          color="#ff9f22"
          toneMapped={false}
        />
      </mesh>

    </group>
  );
}


