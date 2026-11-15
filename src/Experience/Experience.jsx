
import {
  ContactShadows,
  Environment,
  OrbitControls,
} from "@react-three/drei";

import { Canvas } from "@react-three/fiber";
import { useContext, useRef } from "react";
import * as THREE from "three";

import Model from "./Model/Model";
import "./Experience.css";
import { useAnimationContext } from "../Contexts/AnimationContext";

// =====================================
// DIRECTIONAL LIGHT
// =====================================
const MainLight = () => {
  const lightRef = useRef();

  return (
    <directionalLight
      ref={lightRef}
      position={[-242.7, -197.6, 42.4]}
      intensity={5}
      color="#ffffff"
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-bias={-0.0001}
    >
      <object3D
        attach="target"
        position={[1.5, 0.6, -4.0]}
      />
    </directionalLight>
  );
};

// =====================================
// EXPERIENCE
// =====================================

const Experience = () => {
const backgroundImage =
  `${import.meta.env.BASE_URL}bg02.png`
  const modelRef = useRef(null);

  const {isZoomedIn} = useAnimationContext()

  // =====================================
  // ENVIRONMENT VALUES
  // =====================================

  const environmentRotation = [0.00, 2.30, 0.34];
  const environmentIntensity = 1.86;

  return (
    <div 
      style={{
        backgroundImage:
          `url(${backgroundImage})`,
      }}
    className="experience-container">
      
      <Canvas
        camera={{
          position: [5, 4, 7],
          fov: 45,
          near: 0.1,
          far: 1000,
        }}
        shadows
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
        }}
      >
        {/* ENVIRONMENT LIGHTING */}
        <Environment
          preset="studio"
          environmentIntensity={environmentIntensity}
          environmentRotation={environmentRotation}
        />

        {/* GENERAL LIGHTING */}
        <ambientLight intensity={0.3} />

        {/* DIRECTIONAL LIGHT */}
        {/* <MainLight /> */}

        {/* MODEL */}
        <Model modelRef={modelRef} />

        {/* SOFT SHADOW */}
        {!isZoomedIn && <ContactShadows
            position={[0, -2, 0]}
            opacity={0.7}
            scale={20}
            blur={4}
            far={10}
            resolution={512}
            color="#030303"
        />}

        {/* CAMERA CONTROLS */}
        {/* <OrbitControls
          enableDamping
          dampingFactor={0.05}
          minDistance={2}
          maxDistance={30}
        /> */}
      </Canvas>
    </div>
  );
};

export default Experience;
