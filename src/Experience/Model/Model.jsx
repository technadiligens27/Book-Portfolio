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

const paperTexturePaths = [
  "./TechnaDiligencs-Logo.jpg",
  "./post05.jpg",
  "./post06.png",
  "./post07.png",
  "./post08.png",
]

const paperMeshNames = [
  "paper01",
  "paper02",
  "paper03",
  "paper04",
  "paper05",
]

const getScreenType = () => {
  const width =
    window.innerWidth

  if (width <= 483) {
    return "mobile"
  }

  if (width <= 600) {
    return "largeMobile"
  }

  if (width <= 784) {
    return "smallTablet"
  }

  if (width <= 1024) {
    return "tablet"
  }

  return "desktop"
}

const Model = ({
  floatSpeed = 7,
  floatIntensity = 1,
  rotationIntensity = 0.1,
  floatingRange = [-0.1, 0.1],

  // Above 1024px
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

  // 785px to 1024px
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

  // 601px to 784px
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

  // 484px to 600px
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

  // 483px and below
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
  const {
    modelRef,
  } = useModelContext()

  const {
    gl,
  } = useThree()

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

  const [
    screenType,
    setScreenType,
  ] = useState(() => {
    if (typeof window === "undefined") {
      return "desktop"
    }

    return getScreenType()
  })

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

  const modelPath =
    `${import.meta.env.BASE_URL}Book.glb`

  const {
    scene,
    animations,
  } = useGLTF(modelPath)

  const {
    actions,
  } = useAnimations(
    animations,
    scene
  )

  const paperTextures = useTexture(
    paperTexturePaths
  )

  useEffect(() => {
    const maxAnisotropy =
      gl.capabilities.getMaxAnisotropy()

    paperTextures.forEach((texture) => {
      texture.flipY = false

      texture.colorSpace =
        THREE.SRGBColorSpace

      texture.magFilter =
        THREE.LinearFilter

      texture.minFilter =
        THREE.LinearMipmapLinearFilter

      texture.generateMipmaps = true

      texture.anisotropy =
        maxAnisotropy

      texture.needsUpdate = true
    })
  }, [
    paperTextures,
    gl,
  ])

  useEffect(() => {
    const originalMaterials = []

    const createdMaterials = []

    const textureMap = {}

    paperMeshNames.forEach(
      (name, index) => {
        textureMap[name] =
          paperTextures[index]
      }
    )

    scene.traverse((child) => {
      if (!child.isMesh) {
        return
      }

      const meshName =
        child.name.toLowerCase()

      const texture =
        textureMap[meshName]

      if (!texture) {
        return
      }

      originalMaterials.push({
        mesh: child,
        material: child.material,
      })

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

  useEffect(() => {
    paper01AnimationRef.current =
      actions["paper01-animation"]

    paper02AnimationRef.current =
      actions["paper02-animation"]

    paper03AnimationRef.current =
      actions["paper03-animation"]

    paper04AnimationRef.current =
      actions["paper04-animation"]

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

useGLTF.preload(
  `${import.meta.env.BASE_URL}Book.glb`
)

useTexture.preload(
  paperTexturePaths
)

export default Model