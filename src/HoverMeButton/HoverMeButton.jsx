import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"

import gsap from "gsap"

import "./HoverMeButton.css"

import {
  useAnimationContext,
} from "../Contexts/AnimationContext"

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

const HoverMeButton = ({
  // ==========================================
  // DESKTOP ORIGINAL POSITIONS
  // Above 1024px
  // ==========================================

  originalNextLeft = "75%",
  originalNextTop = "45%",

  originalPreviousLeft = "20%",
  originalPreviousTop = "45%",

  // ==========================================
  // SIDEPANEL BUTTON POSITIONS
  // ==========================================

  nextLeft = "16%",
  nextTop = "103%",

  previousLeft = "5%",
  previousTop = "103%",

  // ==========================================
  // DESKTOP ZOOM POSITIONS
  // ==========================================

  zoomNextLeft = "85%",
  zoomNextTop = "45%",

  zoomPreviousLeft = "13%",
  zoomPreviousTop = "45%",

  // ==========================================
  // TABLET ORIGINAL POSITIONS
  // 785px TO 1024px
  // ==========================================

  tabletNextLeft = "81%",
  tabletNextTop = "45%",

  tabletPreviousLeft = "15%",
  tabletPreviousTop = "45%",

  // ==========================================
  // TABLET ZOOM POSITIONS
  // ==========================================

  tabletZoomNextLeft = "93%",
  tabletZoomNextTop = "45%",

  tabletZoomPreviousLeft = "5%",
  tabletZoomPreviousTop = "45%",

  // ==========================================
  // SMALL TABLET ORIGINAL POSITIONS
  // 601px TO 784px
  // ==========================================

  smallTabletNextLeft = "88%",
  smallTabletNextTop = "45%",

  smallTabletPreviousLeft = "8%",
  smallTabletPreviousTop = "45%",

  // ==========================================
  // SMALL TABLET ZOOM POSITIONS
  // ==========================================

  smallTabletZoomNextLeft = "55%",
  smallTabletZoomNextTop = "85%",

  smallTabletZoomPreviousLeft = "45%",
  smallTabletZoomPreviousTop = "85%",

  // ==========================================
  // LARGE MOBILE ORIGINAL POSITIONS
  // Mobile portrait
  // ==========================================

  largeMobileNextLeft = "78%",
  largeMobileNextTop = "76%",

  largeMobilePreviousLeft = "16%",
  largeMobilePreviousTop = "76%",

  // ==========================================
  // LARGE MOBILE ZOOM POSITIONS
  // ==========================================

  largeMobileZoomNextLeft = "57%",
  largeMobileZoomNextTop = "85%",

  largeMobileZoomPreviousLeft = "42%",
  largeMobileZoomPreviousTop = "85%",

  // ==========================================
  // MOBILE LANDSCAPE ORIGINAL POSITIONS
  // Phone turned sideways
  // ==========================================

  mobileLandscapeNextLeft = "93%",
  mobileLandscapeNextTop = "40%",

  mobileLandscapePreviousLeft = "5%",
  mobileLandscapePreviousTop = "40%",

  // ==========================================
  // MOBILE LANDSCAPE ZOOM POSITIONS
  // ==========================================

  mobileLandscapeZoomNextLeft = "91%",
  mobileLandscapeZoomNextTop = "45%",

  mobileLandscapeZoomPreviousLeft = "8%",
  mobileLandscapeZoomPreviousTop = "45%",

  // ==========================================
  // ANIMATION CONTROLS
  // ==========================================

  moveDuration = 1.5,
  nextMoveDuration,
  previousMoveDuration,
}) => {
  const {
    activePage,
    setActivePage,

    isSidePanel,
    isZoomedIn,

    paper01AnimationRef,
    paper02AnimationRef,
    paper03AnimationRef,
    paper04AnimationRef,

    paper01ShapeRef,
    paper02ShapeRef,
    paper03ShapeRef,
    paper04ShapeRef,

    playPaperAnimation,
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

  const nextButtonRef = useRef(null)

  const previousButtonRef = useRef(null)

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

  const normalNextLeft =
    isMobileLandscape
      ? mobileLandscapeNextLeft
      : isLargeMobile
        ? largeMobileNextLeft
        : isSmallTablet
          ? smallTabletNextLeft
          : isTablet
            ? tabletNextLeft
            : originalNextLeft

  const normalNextTop =
    isMobileLandscape
      ? mobileLandscapeNextTop
      : isLargeMobile
        ? largeMobileNextTop
        : isSmallTablet
          ? smallTabletNextTop
          : isTablet
            ? tabletNextTop
            : originalNextTop

  const normalPreviousLeft =
    isMobileLandscape
      ? mobileLandscapePreviousLeft
      : isLargeMobile
        ? largeMobilePreviousLeft
        : isSmallTablet
          ? smallTabletPreviousLeft
          : isTablet
            ? tabletPreviousLeft
            : originalPreviousLeft

  const normalPreviousTop =
    isMobileLandscape
      ? mobileLandscapePreviousTop
      : isLargeMobile
        ? largeMobilePreviousTop
        : isSmallTablet
          ? smallTabletPreviousTop
          : isTablet
            ? tabletPreviousTop
            : originalPreviousTop

  useLayoutEffect(() => {
    const nextButton =
      nextButtonRef.current

    const previousButton =
      previousButtonRef.current

    if (!nextButton || !previousButton) {
      return
    }

    let nextTargetLeft =
      normalNextLeft

    let nextTargetTop =
      normalNextTop

    let previousTargetLeft =
      normalPreviousLeft

    let previousTargetTop =
      normalPreviousTop

    if (isZoomedIn) {
      nextTargetLeft =
        isMobileLandscape
          ? mobileLandscapeZoomNextLeft
          : isLargeMobile
            ? largeMobileZoomNextLeft
            : isSmallTablet
              ? smallTabletZoomNextLeft
              : isTablet
                ? tabletZoomNextLeft
                : zoomNextLeft

      nextTargetTop =
        isMobileLandscape
          ? mobileLandscapeZoomNextTop
          : isLargeMobile
            ? largeMobileZoomNextTop
            : isSmallTablet
              ? smallTabletZoomNextTop
              : isTablet
                ? tabletZoomNextTop
                : zoomNextTop

      previousTargetLeft =
        isMobileLandscape
          ? mobileLandscapeZoomPreviousLeft
          : isLargeMobile
            ? largeMobileZoomPreviousLeft
            : isSmallTablet
              ? smallTabletZoomPreviousLeft
              : isTablet
                ? tabletZoomPreviousLeft
                : zoomPreviousLeft

      previousTargetTop =
        isMobileLandscape
          ? mobileLandscapeZoomPreviousTop
          : isLargeMobile
            ? largeMobileZoomPreviousTop
            : isSmallTablet
              ? smallTabletZoomPreviousTop
              : isTablet
                ? tabletZoomPreviousTop
                : zoomPreviousTop
    }

    if (isSidePanel) {
      nextTargetLeft = nextLeft

      nextTargetTop = nextTop

      previousTargetLeft =
        previousLeft

      previousTargetTop =
        previousTop
    }

    const nextAnimation = gsap.to(
      nextButton,
      {
        left: nextTargetLeft,
        top: nextTargetTop,

        duration:
          nextMoveDuration ??
          moveDuration,

        ease: "power3.inOut",

        overwrite: true,
      }
    )

    const previousAnimation = gsap.to(
      previousButton,
      {
        left: previousTargetLeft,
        top: previousTargetTop,

        duration:
          previousMoveDuration ??
          moveDuration,

        ease: "power3.inOut",

        overwrite: true,
      }
    )

    return () => {
      nextAnimation.kill()

      previousAnimation.kill()
    }
  }, [
    isMobileLandscape,
    isLargeMobile,
    isSmallTablet,
    isTablet,

    isSidePanel,
    isZoomedIn,

    normalNextLeft,
    normalNextTop,

    normalPreviousLeft,
    normalPreviousTop,

    nextLeft,
    nextTop,

    previousLeft,
    previousTop,

    zoomNextLeft,
    zoomNextTop,

    zoomPreviousLeft,
    zoomPreviousTop,

    tabletZoomNextLeft,
    tabletZoomNextTop,

    tabletZoomPreviousLeft,
    tabletZoomPreviousTop,

    smallTabletZoomNextLeft,
    smallTabletZoomNextTop,

    smallTabletZoomPreviousLeft,
    smallTabletZoomPreviousTop,

    largeMobileZoomNextLeft,
    largeMobileZoomNextTop,

    largeMobileZoomPreviousLeft,
    largeMobileZoomPreviousTop,

    mobileLandscapeZoomNextLeft,
    mobileLandscapeZoomNextTop,

    mobileLandscapeZoomPreviousLeft,
    mobileLandscapeZoomPreviousTop,

    moveDuration,
    nextMoveDuration,
    previousMoveDuration,
  ])

  const nextPage = () => {
    if (activePage === 1) {
      playPaperAnimation(
        paper01AnimationRef,
        paper01ShapeRef
      )
    } else if (activePage === 2) {
      playPaperAnimation(
        paper02AnimationRef,
        paper02ShapeRef
      )
    } else if (activePage === 3) {
      playPaperAnimation(
        paper03AnimationRef,
        paper03ShapeRef
      )
    } else if (activePage === 4) {
      playPaperAnimation(
        paper04AnimationRef,
        paper04ShapeRef
      )
    }

    if (activePage <= 4) {
      setActivePage(activePage + 1)
    }
  }

  const previousPage = () => {
    if (activePage === 2) {
      playPaperAnimation(
        paper01AnimationRef,
        paper01ShapeRef,
        true
      )
    } else if (activePage === 3) {
      playPaperAnimation(
        paper02AnimationRef,
        paper02ShapeRef,
        true
      )
    } else if (activePage === 4) {
      playPaperAnimation(
        paper03AnimationRef,
        paper03ShapeRef,
        true
      )
    } else if (activePage === 5) {
      playPaperAnimation(
        paper04AnimationRef,
        paper04ShapeRef,
        true
      )
    }

    if (activePage > 1) {
      setActivePage(activePage - 1)
    }
  }

  return (
    <>
      <button
        ref={nextButtonRef}
        className="button-01"
        onClick={nextPage}
        disabled={activePage > 4}
        aria-label="Next Page"
        style={{
          left: normalNextLeft,
          top: normalNextTop,
        }}
      >
        &gt;
      </button>

      <button
        ref={previousButtonRef}
        className="button-01 button-02"
        onClick={previousPage}
        disabled={activePage <= 1}
        aria-label="Previous Page"
        style={{
          left: normalPreviousLeft,
          top: normalPreviousTop,
        }}
      >
        &lt;
      </button>
    </>
  )
}

export default HoverMeButton