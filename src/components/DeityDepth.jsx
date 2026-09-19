import * as THREE from "three";
import { useFrame, useLoader } from "@react-three/fiber";
import { useRef } from "react";

const DEITY_BASE_HEIGHT = 4.0;

const ROTATION_Y = 0.035;
const ROTATION_X = 0.025;
const MOVEMENT_X = 0.025;
const MOVEMENT_Y = 0.018;

const BREATH_AMOUNT = 0.006;
const BREATH_SPEED = 0.7;

// Reading panel occupies approximately the lower portion
// of the screen. Keep the deity completely above it.
const PANEL_RATIO = 0.30;

// Small visual breathing room between feet and panel.
const FOOT_GAP = 0.10;

export default function DeityDepth() {
  const group = useRef();

  const texture = useLoader(
    THREE.TextureLoader,
    `${import.meta.env.BASE_URL}assets/deities/durga/deity.png`
  );

  const target = useRef(new THREE.Vector2());

  useFrame((state) => {
    if (!group.current) return;

    target.current.x +=
      (state.pointer.x - target.current.x) * 0.035;

    target.current.y +=
      (state.pointer.y - target.current.y) * 0.035;

    /*
      ------------------------------------------------
      SCREEN-SPACE DEITY FIT
      ------------------------------------------------

      Work from the actual camera's visible world height.

      This gives us a reliable bottom boundary instead
      of guessing the CSS panel height in world units.
    */

    const camera = state.camera;

    const visibleHeight =
      2 *
      Math.tan(
        THREE.MathUtils.degToRad(camera.fov * 0.5)
      ) *
      Math.abs(camera.position.z);

    /*
      Reserve the lower part of the screen for the
      reading panel.
    */

    const usableHeight =
      visibleHeight * (1 - PANEL_RATIO);

    /*
      Never let Durgā become larger than the available
      vertical space.
    */

    const desiredHeight = Math.min(
      DEITY_BASE_HEIGHT,
      usableHeight - FOOT_GAP
    );

    const safeHeight = Math.max(
      2.4,
      desiredHeight
    );

    const scale =
      safeHeight / DEITY_BASE_HEIGHT;

    const breath =
      1 +
      Math.sin(
        state.clock.elapsedTime * BREATH_SPEED
      ) *
      BREATH_AMOUNT;

    group.current.scale.set(
      scale * breath,
      scale * breath,
      1
    );

    /*
      ------------------------------------------------
      BOTTOM ANCHOR
      ------------------------------------------------

      The deity's feet are positioned at the exact
      boundary between the visual area and the reading
      panel.
    */

    const panelTop =
      -visibleHeight / 2 +
      visibleHeight * PANEL_RATIO;

    group.current.position.y =
      panelTop +
      safeHeight / 2 +
      FOOT_GAP;

    group.current.position.x =
      target.current.x * MOVEMENT_X;

    group.current.position.z = 0;

    /*
      Very subtle viewer movement.
    */

    group.current.rotation.y =
      target.current.x * ROTATION_Y;

    group.current.rotation.x =
      -target.current.y * ROTATION_X;
  });

  const height = DEITY_BASE_HEIGHT;
  const width = height * (687 / 1024);

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[width, height]} />

        <meshBasicMaterial
          map={texture}
          transparent
          alphaTest={0.01}
          toneMapped={false}
        />
      </mesh>
    </group>
  );
}

