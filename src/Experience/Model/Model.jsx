import {
  useEffect,
  useState,
} from "react"

import {
  Float,
  useAnimations,
  useGLTF,
  useTexture,
} from "@react-three/drei"

import {
  useThree,
} from "@react-three/fiber"

import * as THREE from "three"

import {
  useAnimationContext,
} from "../../Contexts/AnimationContext"

import {
  useModelContext,
} from "../../Contexts/ModelContext"

// ==========================================
// PAPER TEXTURE FILES
// ==========================================

const paperTexturePaths = [
  "./post01.jpg",
  "./post02.webp",
  "./post03.webp",
  "./post04.webp",
  "./post05.png",
]

// ==========================================
// BLENDER PAPER MESH NAMES
// Must match the names in Book.glb
// ==========================================

const paperMeshNames = [
  "paper01",
  "paper02",
  "paper03",
  "paper04",
  "paper05",
]

// ==========================================
// RESPONSIVE SCREEN TYPE
// ==========================================

const getScreenType = () => {
  const width =
    window.innerWidth

  // Mobile: 483px and below
  if (width <= 483) {
    return "mobile"
  }

  // Large mobile: 484px to 600px
  if (width <= 600) {
    return "largeMobile"
  }

  // Small tablet: 601px to 784px
  if (width <= 784) {
    return "smallTablet"
  }

  // Tablet: 785px to 1024px
  if (width <= 1024) {
    return "tablet"
  }

  // Desktop: above 1024px
  return "desktop"
}

// ==========================================
// MODEL COMPONENT
// ==========================================

const Model = ({
  // ==========================================
  // FLOAT ANIMATION SETTINGS
  // ==========================================

  floatSpeed = 7,
  floatIntensity = 1,
  rotationIntensity = 0.1,
  floatingRange = [-0.1, 0.1],

  // ==========================================
  // DESKTOP TRANSFORMS
  // Above 1024px
  // ==========================================

  desktopPosition = [
    -0.39,
    0,
    -0.26,
  ],

  desktopRotation = [
    0.77,
    0.44,
    -0.39,
  ],

  desktopScale = 0.7,

  // ==========================================
  // TABLET TRANSFORMS
  // 785px to 1024px
  // ==========================================

  tabletPosition = [
    -0.39,
    0,
    -0.26,
  ],

  tabletRotation = [
    0.77,
    0.44,
    -0.39,
  ],

  tabletScale = 0.6,

  // ==========================================
  // SMALL TABLET TRANSFORMS
  // 601px to 784px
  // ==========================================

  smallTabletPosition = [
    -0.39,
    0,
    -0.26,
  ],

  smallTabletRotation = [
    0.77,
    0.44,
    -0.39,
  ],

  smallTabletScale = 0.6,

  // ==========================================
  // LARGE MOBILE TRANSFORMS
  // 484px to 600px
  // ==========================================

  largeMobilePosition = [
    -0.39,
    0,
    -0.26,
  ],

  largeMobileRotation = [
    0.77,
    0.44,
    -0.39,
  ],

  largeMobileScale = 0.6,

  // ==========================================
  // MOBILE TRANSFORMS
  // 483px and below
  // ==========================================

  mobilePosition = [
    -0.39,
    0,
    -0.26,
  ],

  mobileRotation = [
    0.77,
    0.44,
    -0.39,
  ],

  mobileScale = 0.45,
}) => {
  // ==========================================
  // MODEL REFERENCE FROM CONTEXT
  // Used by SidePanel and ZoomInButton
  // ==========================================

  const {
    modelRef,
  } = useModelContext()

  // ==========================================
  // WEBGL RENDERER
  // Used for texture quality settings
  // ==========================================

  const {
    gl,
  } = useThree()

  // ==========================================
  // ANIMATION REFERENCES FROM CONTEXT
  // Used by next/previous page buttons
  // ==========================================

  const {
    paper01AnimationRef,
    paper02AnimationRef,
    paper03AnimationRef,
    paper04AnimationRef,

    paper01ShapeRef,
    paper02ShapeRef,
    paper03ShapeRef,
    paper04ShapeRef,
  } = useAnimationContext()

  // ==========================================
  // CURRENT SCREEN TYPE
  // ==========================================

  const [
    screenType,
    setScreenType,
  ] = useState(() => {
    if (typeof window === "undefined") {
      return "desktop"
    }

    return getScreenType()
  })

  // ==========================================
  // UPDATE SCREEN TYPE ON WINDOW RESIZE
  // ==========================================

  useEffect(() => {
    const checkScreenSize = () => {
      setScreenType(
        getScreenType()
      )
    }

    checkScreenSize()

    window.addEventListener(
      "resize",
      checkScreenSize
    )

    return () => {
      window.removeEventListener(
        "resize",
        checkScreenSize
      )
    }
  }, [])

  // ==========================================
  // LOAD BOOK MODEL
  // ==========================================

  const modelPath =
    `${import.meta.env.BASE_URL}Book.glb`

  const {
    scene,
    animations,
  } = useGLTF(modelPath)

  // ==========================================
  // CREATE THREE.JS ANIMATION ACTIONS
  // ==========================================

  const {
    actions,
  } = useAnimations(
    animations,
    scene
  )

  // ==========================================
  // LOAD PAGE TEXTURES
  // ==========================================

  const paperTextures = useTexture(
    paperTexturePaths
  )

  // ==========================================
  // CONFIGURE TEXTURE QUALITY
  // ==========================================

  useEffect(() => {
    const maxAnisotropy =
      gl.capabilities.getMaxAnisotropy()

    paperTextures.forEach((texture) => {
      // GLB textures normally need flipY disabled
      texture.flipY = false

      // Correct image colours
      texture.colorSpace =
        THREE.SRGBColorSpace

      // Improve texture filtering
      texture.magFilter =
        THREE.LinearFilter

      texture.minFilter =
        THREE.LinearMipmapLinearFilter

      // Improve distant texture quality
      texture.generateMipmaps = true

      // Improve texture quality at angles
      texture.anisotropy =
        maxAnisotropy

      texture.needsUpdate = true
    })
  }, [
    paperTextures,
    gl,
  ])

  // ==========================================
  // APPLY TEXTURES TO BLENDER PAPER MESHES
  // ==========================================

  useEffect(() => {
    const originalMaterials = []

    const createdMaterials = []

    const textureMap = {}

    // Match each paper mesh to its image texture
    paperMeshNames.forEach(
      (name, index) => {
        textureMap[name] =
          paperTextures[index]
      }
    )

    // Search every object inside Book.glb
    scene.traverse((child) => {
      if (!child.isMesh) {
        return
      }

      const meshName =
        child.name.toLowerCase()

      const texture =
        textureMap[meshName]

      // Skip meshes that are not book pages
      if (!texture) {
        return
      }

      // Save Blender material for cleanup
      originalMaterials.push({
        mesh: child,
        material: child.material,
      })

      // Create a new material with the page image
      const applyTexture = (
        material
      ) => {
        const newMaterial =
          new THREE.MeshBasicMaterial({
            map: texture,

            color: "#ffffff",

            side: material.side,

            transparent:
              material.transparent,

            opacity:
              material.opacity,

            alphaTest:
              material.alphaTest,

            toneMapped: false,
          })

        createdMaterials.push(
          newMaterial
        )

        return newMaterial
      }

      // Supports meshes that have one or many materials
      if (
        Array.isArray(
          child.material
        )
      ) {
        child.material =
          child.material.map(
            applyTexture
          )
      } else {
        child.material =
          applyTexture(
            child.material
          )
      }
    })

    // Restore original materials on component unmount
    return () => {
      originalMaterials.forEach(
        ({
          mesh,
          material,
        }) => {
          mesh.material = material
        }
      )

      createdMaterials.forEach(
        (material) => {
          material.dispose()
        }
      )
    }
  }, [
    scene,
    paperTextures,
  ])

  // ==========================================
  // STORE PAGE ANIMATIONS IN CONTEXT REFS
  // ==========================================

  useEffect(() => {
    // Page turn animations
    paper01AnimationRef.current =
      actions["paper01-animation"]

    paper02AnimationRef.current =
      actions["paper02-animation"]

    paper03AnimationRef.current =
      actions["paper03-animation"]

    paper04AnimationRef.current =
      actions["paper04-animation"]

    // Shape key page animations
    paper01ShapeRef.current =
      actions["PlaneAction.004"]

    paper02ShapeRef.current =
      actions["PlaneAction.015"]

    paper03ShapeRef.current =
      actions["PlaneAction.017"]

    paper04ShapeRef.current =
      actions["PlaneAction.019"]

    const animationRefs = [
      paper01AnimationRef,
      paper02AnimationRef,
      paper03AnimationRef,
      paper04AnimationRef,

      paper01ShapeRef,
      paper02ShapeRef,
      paper03ShapeRef,
      paper04ShapeRef,
    ]

    // Configure every animation to play once
    animationRefs.forEach(
      (animationRef) => {
        const action =
          animationRef.current

        if (!action) {
          return
        }

        action.setLoop(
          THREE.LoopOnce,
          1
        )

        action.clampWhenFinished =
          true
      }
    )
  }, [
    actions,
    paper01AnimationRef,
    paper02AnimationRef,
    paper03AnimationRef,
    paper04AnimationRef,
    paper01ShapeRef,
    paper02ShapeRef,
    paper03ShapeRef,
    paper04ShapeRef,
  ])

  // ==========================================
  // SELECT POSITION FOR CURRENT SCREEN SIZE
  // ==========================================

  const responsivePosition =
    screenType === "mobile"
      ? mobilePosition
      : screenType === "largeMobile"
        ? largeMobilePosition
        : screenType === "smallTablet"
          ? smallTabletPosition
          : screenType === "tablet"
            ? tabletPosition
            : desktopPosition

  // ==========================================
  // SELECT ROTATION FOR CURRENT SCREEN SIZE
  // ==========================================

  const responsiveRotation =
    screenType === "mobile"
      ? mobileRotation
      : screenType === "largeMobile"
        ? largeMobileRotation
        : screenType === "smallTablet"
          ? smallTabletRotation
          : screenType === "tablet"
            ? tabletRotation
            : desktopRotation

  // ==========================================
  // SELECT SCALE FOR CURRENT SCREEN SIZE
  // ==========================================

  const responsiveScale =
    screenType === "mobile"
      ? mobileScale
      : screenType === "largeMobile"
        ? largeMobileScale
        : screenType === "smallTablet"
          ? smallTabletScale
          : screenType === "tablet"
            ? tabletScale
            : desktopScale

  // ==========================================
  // RENDER BOOK MODEL
  // ==========================================

  return (
    <Float
      speed={floatSpeed}
      floatIntensity={floatIntensity}
      rotationIntensity={
        rotationIntensity
      }
      floatingRange={floatingRange}
    >
      <group
        ref={modelRef}
        position={responsivePosition}
        rotation={responsiveRotation}
        scale={responsiveScale}
      >
        <primitive object={scene} />
      </group>
    </Float>
  )
}

// ==========================================
// OPTIONAL PRELOADING
// Keep commented if you want the loader
// to remain visible on first load.
// ==========================================

// useGLTF.preload(
//   `${import.meta.env.BASE_URL}Book.glb`
// )

// useTexture.preload(
//   paperTexturePaths
// )

export default Model