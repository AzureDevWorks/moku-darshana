import { Canvas } from "@react-three/fiber";
import DeityDepth from "./DeityDepth";
import SacredBackground from "../scenes/TempleScene";
import SacredAura from "../effects/Aura";

export default function DarshanaCanvas() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#090706",
      }}
    >
      <Canvas
        style={{
          width: "100%",
          height: "100%",
          display: "block",
        }}
        camera={{
          position: [0, 0, 6],
          fov: 45,
        }}
      >
        <SacredBackground />
        <SacredAura />
        <DeityDepth />
      </Canvas>
    </div>
  );
}
