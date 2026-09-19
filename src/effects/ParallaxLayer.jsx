import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export default function ParallaxLayer({
  children,
  movement = 0.05,
  depth = 0,
}) {
  const group = useRef();

  useFrame((state) => {
    if (!group.current) return;

    const targetX = state.pointer.x * movement;
    const targetY = state.pointer.y * movement;

    group.current.position.x +=
      (targetX - group.current.position.x) * 0.05;

    group.current.position.y +=
      (targetY - group.current.position.y) * 0.05;
  });

  return (
    <group
      ref={group}
      position={[0, 0, depth]}
    >
      {children}
    </group>
  );
}
