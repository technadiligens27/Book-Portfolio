import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { Suspense, useContext, useRef } from "react";
import * as THREE from "three";

import Model from "./Model/Model";
import "./Experience.css";
import { useAnimationContext } from "../Contexts/AnimationContext";
import Loading from "../Loading/Loading";

// =====================================
// EXPERIENCE
// =====================================

const Experience = () => {
  // =====================================
  // BACKGROUND IMAGE
  // Uses BASE_URL so it works after deployment
  // =====================================

  const backgroundImage =
    `${import.meta.env.BASE_URL}bg02.webp`

  // =====================================
  // MODEL REFERENCE
  // Used for controlling book transforms
  // =====================================

  const modelRef = useRef(null);

  // =====================================
  // ANIMATION CONTEXT
  // Used to hide floor shadow during zoom
  // =====================================

  const {isZoomedIn} = useAnimationContext()

  // =====================================
  // ENVIRONMENT LIGHTING VALUES
  // =====================================

  const environmentRotation = [0.00, 2.30, 0.34];
  const environmentIntensity = 1.86;

  return (
    <div 
      // =====================================
      // BACKGROUND IMAGE STYLE
      // =====================================

      style={{
        backgroundImage:
          `url(${backgroundImage})`,
      }}

      // =====================================
      // MAIN THREE.JS EXPERIENCE CONTAINER
      // =====================================

      className="experience-container"
    >
      
      {/* =====================================
          R3F CANVAS
      ===================================== */}

      <Canvas
        // =====================================
        // CAMERA SETTINGS
        // =====================================

        camera={{
          position: [5, 4, 7],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}

        // =====================================
        // ENABLE SHADOWS
        // =====================================

        shadows

        // =====================================
        // PIXEL RATIO
        // Uses 1 on lower quality screens
        // Uses maximum 2 on high DPI screens
        // =====================================

        dpr={[1, 2]}

        // =====================================
        // WEBGL RENDERER SETTINGS
        // =====================================

        gl={{
          antialias: true,
          alpha: true,

          outputColorSpace:
            THREE.SRGBColorSpace,

          toneMapping:
            THREE.ACESFilmicToneMapping,

          toneMappingExposure: 1,
        }}
      >
        {/* =====================================
            HDRI ENVIRONMENT LIGHTING
        ===================================== */}

        <Environment
          preset="studio"
          environmentIntensity={environmentIntensity}
          environmentRotation={environmentRotation}
        />

        {/* =====================================
            GENERAL AMBIENT LIGHT
        ===================================== */}

        <ambientLight intensity={0.3} />

        {/* =====================================
            BOOK MODEL
        ===================================== */}

        <Model modelRef={modelRef} />

        {/* =====================================
            SOFT FLOOR SHADOW
            Hidden when user zooms into book
        ===================================== */}

        {!isZoomedIn && <ContactShadows
            position={[0, -2, 0]}
            opacity={0.7}
            scale={20}
            blur={4}
            far={10}
            resolution={512}
            color="#030303"
        />}

      </Canvas>
    </div>
  );
};

export default Experience;