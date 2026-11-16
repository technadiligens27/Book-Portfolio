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

// ==========================================
// RESPONSIVE SCREEN TYPE DETECTION
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
// ZOOM IN BUTTON
// ==========================================

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
  // 785px to 1024px
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
  // 601px to 784px
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
  // 484px to 600px
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
  // MOBILE ZOOM VALUES
  // 483px and below
  // ==========================================

  mobileZoomPosition = [
    -5.5,
    -2.5,
    -3,
  ],

  mobileZoomRotation = [
    Math.PI / 3,
    Math.PI / 8,
    -Math.PI / 7,
  ],

  mobileZoomScale = 1.28,

  // ==========================================
  // GSAP ANIMATION DURATION
  // ==========================================

  zoomDuration = 1.5,
}) => {
  // ==========================================
  // BOOK MODEL REFERENCE
  // ==========================================

  const {
    modelRef,
  } = useModelContext()

  // ==========================================
  // ZOOM STATE
  // ==========================================

  const {
    isZoomedIn,
    setIsZoomedIn,
  } = useAnimationContext()

  // ==========================================
  // CURRENT RESPONSIVE SCREEN TYPE
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
  // ORIGINAL MODEL TRANSFORMS
  // Saved before zooming so Zoom Out can restore
  // the exact original position, rotation, and scale.
  // ==========================================

  const originalTransforms =
    useRef(null)

  // ==========================================
  // PREVENTS DOUBLE CLICKING DURING ANIMATION
  // ==========================================

  const isZoomAnimating =
    useRef(false)

  // ==========================================
  // GSAP TIMELINE REFERENCE
  // ==========================================

  const zoomTimeline =
    useRef(null)

  // ==========================================
  // SCREEN TYPE HELPERS
  // ==========================================

  const isMobile =
    screenType === "mobile"

  const isLargeMobile =
    screenType === "largeMobile"

  const isSmallTablet =
    screenType === "smallTablet"

  const isTablet =
    screenType === "tablet"

  // ==========================================
  // UPDATE SCREEN TYPE WHEN WINDOW RESIZES
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
  // CLEAN UP ACTIVE GSAP TIMELINE
  // ==========================================

  useEffect(() => {
    return () => {
      zoomTimeline.current?.kill()
    }
  }, [])

  // ==========================================
  // SELECT RESPONSIVE ZOOM POSITION
  // ==========================================

  const finalZoomPosition =
    isMobile
      ? mobileZoomPosition
      : isLargeMobile
        ? largeMobileZoomPosition
        : isSmallTablet
          ? smallTabletZoomPosition
          : isTablet
            ? tabletZoomPosition
            : zoomPosition

  // ==========================================
  // SELECT RESPONSIVE ZOOM ROTATION
  // ==========================================

  const finalZoomRotation =
    isMobile
      ? mobileZoomRotation
      : isLargeMobile
        ? largeMobileZoomRotation
        : isSmallTablet
          ? smallTabletZoomRotation
          : isTablet
            ? tabletZoomRotation
            : zoomRotation

  // ==========================================
  // SELECT RESPONSIVE ZOOM SCALE
  // ==========================================

  const finalZoomScale =
    isMobile
      ? mobileZoomScale
      : isLargeMobile
        ? largeMobileZoomScale
        : isSmallTablet
          ? smallTabletZoomScale
          : isTablet
            ? tabletZoomScale
            : zoomScale

  // ==========================================
  // ZOOM INTO THE BOOK
  // ==========================================

  const zoomIn = () => {
    const model =
      modelRef.current

    // Do nothing if model is unavailable
    // or a zoom animation is already running
    if (
      !model ||
      isZoomAnimating.current
    ) {
      return
    }

    // Store book's current transform once
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

    // Updates button icon and other UI elements
    setIsZoomedIn(true)

    // Create a new GSAP timeline
    zoomTimeline.current =
      gsap.timeline({
        onComplete: () => {
          isZoomAnimating.current =
            false
        },
      })

    // Animate book position
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

    // Animate book rotation
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

    // Animate book scale equally on every axis
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

  // ==========================================
  // RESTORE ORIGINAL BOOK TRANSFORM
  // ==========================================

  const zoomOut = () => {
    const model =
      modelRef.current

    const original =
      originalTransforms.current

    // Do nothing if original transforms are missing
    // or another zoom animation is already running
    if (
      !model ||
      !original ||
      isZoomAnimating.current
    ) {
      return
    }

    isZoomAnimating.current = true

    // Create a timeline for zooming out
    zoomTimeline.current =
      gsap.timeline({
        onComplete: () => {
          isZoomAnimating.current =
            false

          setIsZoomedIn(false)
        },
      })

    // Restore original position
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

    // Restore original rotation
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

    // Restore original scale
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

  // ==========================================
  // TOGGLE BETWEEN ZOOM IN AND ZOOM OUT
  // ==========================================

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

  // ==========================================
  // RENDER ZOOM BUTTON
  // ==========================================

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
          {/* Magnifying glass icon */}
          <path d="M9.145 18.29c-5.042 0-9.145-4.102-9.145-9.145s4.103-9.145 9.145-9.145 9.145 4.103 9.145 9.145-4.102 9.145-9.145 9.145zm0-15.167c-3.321 0-6.022 2.702-6.022 6.022s2.702 6.022 6.022 6.022 6.023-2.702 6.023-6.022-2.702-6.022-6.023-6.022zm9.263 12.443c-.817 1.176-1.852 2.188-3.046 2.981l5.452 5.453 3.014-3.013-5.42-5.421z" />

          {/* Plus icon while normal, minus icon while zoomed */}
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