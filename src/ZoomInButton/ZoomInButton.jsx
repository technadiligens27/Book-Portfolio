import {
  useEffect,
  useRef,
  useState,
} from "react"

import gsap from "gsap"

import {
  useModelContext,
} from "../Contexts/ModelContext"

import {
  useAnimationContext,
} from "../Contexts/AnimationContext"

import "./ZoomInButton.css"

const getScreenType = () => {
  const width =
    window.innerWidth

  const height =
    window.innerHeight

  const isLandscape =
    width > height

  const mobileDevice =
    Math.min(width, height) <= 484

  if (
    mobileDevice &&
    isLandscape
  ) {
    return "mobileLandscape"
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

const ZoomInButton = ({
  // ==========================================
  // DESKTOP ZOOM VALUES
  // Above 1024px
  // ==========================================

  zoomPosition = [
    -2.5,
    -1.5,
    -3,
  ],

  zoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  zoomScale = 1.3,

  // ==========================================
  // TABLET ZOOM VALUES
  // 785px TO 1024px
  // ==========================================

  tabletZoomPosition = [
    -2.5,
    -1.5,
    -3,
  ],

  tabletZoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  tabletZoomScale = 1.15,

  // ==========================================
  // SMALL TABLET ZOOM VALUES
  // 601px TO 784px
  // ==========================================

  smallTabletZoomPosition = [
    -3.5,
    -1.5,
    -3,
  ],

  smallTabletZoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  smallTabletZoomScale = 1.35,

  // ==========================================
  // LARGE MOBILE ZOOM VALUES
  // Mobile portrait
  // ==========================================

  largeMobileZoomPosition = [
    -4.5,
    -1.5,
    -3,
  ],

  largeMobileZoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  largeMobileZoomScale = 1.38,

  // ==========================================
  // MOBILE LANDSCAPE ZOOM VALUES
  // Phone is turned sideways
  // ==========================================

  mobileLandscapeZoomPosition = [
    -2.5,
    -2.5,
    -3,
  ],

  mobileLandscapeZoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  mobileLandscapeZoomScale = 1.8,

  // ==========================================
  // ANIMATION
  // ==========================================

  zoomDuration = 1.5,
}) => {
  const {
    modelRef,
  } = useModelContext()

  const {
    isZoomedIn,
    setIsZoomedIn,
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

  const originalTransforms =
    useRef(null)

  const isZoomAnimating =
    useRef(false)

  const zoomTimeline =
    useRef(null)

  const isMobileLandscape =
    screenType === "mobileLandscape"

  const isLargeMobile =
    screenType === "largeMobile"

  const isSmallTablet =
    screenType === "smallTablet"

  const isTablet =
    screenType === "tablet"

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

    window.addEventListener(
      "orientationchange",
      checkScreenSize
    )

    return () => {
      window.removeEventListener(
        "resize",
        checkScreenSize
      )

      window.removeEventListener(
        "orientationchange",
        checkScreenSize
      )
    }
  }, [])

  useEffect(() => {
    return () => {
      zoomTimeline.current?.kill()
    }
  }, [])

  const finalZoomPosition =
    isMobileLandscape
      ? mobileLandscapeZoomPosition
      : isLargeMobile
        ? largeMobileZoomPosition
        : isSmallTablet
          ? smallTabletZoomPosition
          : isTablet
            ? tabletZoomPosition
            : zoomPosition

  const finalZoomRotation =
    isMobileLandscape
      ? mobileLandscapeZoomRotation
      : isLargeMobile
        ? largeMobileZoomRotation
        : isSmallTablet
          ? smallTabletZoomRotation
          : isTablet
            ? tabletZoomRotation
            : zoomRotation

  const finalZoomScale =
    isMobileLandscape
      ? mobileLandscapeZoomScale
      : isLargeMobile
        ? largeMobileZoomScale
        : isSmallTablet
          ? smallTabletZoomScale
          : isTablet
            ? tabletZoomScale
            : zoomScale

  const zoomIn = () => {
    const model =
      modelRef.current

    if (
      !model ||
      isZoomAnimating.current
    ) {
      return
    }

    if (!originalTransforms.current) {
      originalTransforms.current = {
        position:
          model.position.clone(),

        rotation:
          model.rotation.clone(),

        scale:
          model.scale.clone(),
      }
    }

    isZoomAnimating.current = true

    setIsZoomedIn(true)

    zoomTimeline.current =
      gsap.timeline({
        onComplete: () => {
          isZoomAnimating.current =
            false
        },
      })

    zoomTimeline.current.to(
      model.position,
      {
        x: finalZoomPosition[0],
        y: finalZoomPosition[1],
        z: finalZoomPosition[2],

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )

    zoomTimeline.current.to(
      model.rotation,
      {
        x: finalZoomRotation[0],
        y: finalZoomRotation[1],
        z: finalZoomRotation[2],

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )

    zoomTimeline.current.to(
      model.scale,
      {
        x: finalZoomScale,
        y: finalZoomScale,
        z: finalZoomScale,

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )
  }

  const zoomOut = () => {
    const model =
      modelRef.current

    const original =
      originalTransforms.current

    if (
      !model ||
      !original ||
      isZoomAnimating.current
    ) {
      return
    }

    isZoomAnimating.current = true

    zoomTimeline.current =
      gsap.timeline({
        onComplete: () => {
          isZoomAnimating.current =
            false

          setIsZoomedIn(false)
        },
      })

    zoomTimeline.current.to(
      model.position,
      {
        x: original.position.x,
        y: original.position.y,
        z: original.position.z,

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )

    zoomTimeline.current.to(
      model.rotation,
      {
        x: original.rotation.x,
        y: original.rotation.y,
        z: original.rotation.z,

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )

    zoomTimeline.current.to(
      model.scale,
      {
        x: original.scale.x,
        y: original.scale.y,
        z: original.scale.z,

        duration: zoomDuration,

        ease: "power3.inOut",

        overwrite: true,
      },
      0
    )
  }

  const handleZoom = () => {
    if (isZoomAnimating.current) {
      return
    }

    if (isZoomedIn) {
      zoomOut()
    } else {
      zoomIn()
    }
  }

  return (
    <button
      className="zoom-button"
      onClick={handleZoom}
      aria-label={
        isZoomedIn
          ? "Zoom Out"
          : "Zoom In"
      }
      title={
        isZoomedIn
          ? "Zoom Out"
          : "Zoom In"
      }
    >
      <span>
        <svg
          viewBox="0 0 24 24"
          height="24"
          width="24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" />

          <path
            d={
              isZoomedIn
                ? "M5.5 9.15h7.3"
                : "M9.15 5.5v7.3M5.5 9.15h7.3"
            }
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </button>
  )
}

export default ZoomInButton