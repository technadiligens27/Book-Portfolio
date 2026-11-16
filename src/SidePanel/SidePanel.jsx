import {
  useEffect,
  useLayoutEffect,
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

import "./SidePanel.css"

// ==========================================
// SIDEPANEL TEXT CONTENT
// Each active book page has a heading and text.
// ==========================================

const sidePanelData = {
  headings: {
    1: "About Us",
    2: "What We Do",
    3: "The Power of Interaction",
    4: "Our Work",
    5: "Mission & Vision",
  },

  paragraphs: {
    1: [
      "Hey there! We're TechnaDiligens, a creative web development company passionate about bringing unique ideas to life.",

      "We design and develop modern, eye-catching websites that go beyond ordinary browsing experiences.",

      "We specialize in creating playful, low-poly 3D models and interactive animations that add personality and excitement to websites.",

      "By combining creativity, technology, and 3D design, we turn simple websites into immersive digital experiences.",

      "Our mission? To make the web a place where people don't just scroll, but explore, interact, and remember!",
    ],

    2: [
      "We create interactive websites that go beyond ordinary designs, bringing your brand to life with creativity and technology.",

      "Our custom 3D components add personality to websites, featuring playful models, smooth animations, and engaging interactions.",

      "We design ready-to-use website templates that combine modern layouts, creative visuals, and interactive elements to help you stand out.",

      "From animated hero sections to fully interactive 3D experiences, we build digital spaces that capture attention and spark curiosity.",

      "Whether you need a unique website, a 3D component, or a creative template, we're here to make your ideas come alive!",
    ],

    3: [
      "Ever wondered why some websites grab your attention while others feel ordinary? That's where 3D and interactivity come in!",

      "3D elements bring depth, creativity, and personality to websites, making digital experiences more visually exciting and memorable.",

      "Interactive animations encourage visitors to explore, engage, and discover content instead of simply scrolling through static pages.",

      "By combining playful 3D models with smooth interactions, we create immersive experiences that make websites feel more alive.",
    ],

    4: [
      "We've been busy bringing creative ideas to life through unique 3D components, interactive websites, and eye-catching digital experiences!",

      "Our projects include low-poly 3D models and animated hero sections designed to make websites stand out from the crowd.",

      "We've also created website templates that combine modern designs, interactive elements, and smooth animations for engaging experiences.",

      "Using technologies like Three.js, React Three Fiber, and GSAP, we bring movement, personality, and creativity to every interaction.",
    ],

    5: [
      "We envision a future where websites go beyond ordinary designs, becoming creative, interactive experiences that inspire curiosity and imagination.",

      "Our vision is to make 3D web experiences more accessible to businesses, creators, and anyone looking to stand out online.",

      "We believe the future of the web lies in immersive designs, playful interactions, and digital experiences that feel truly alive.",

      "Our ultimate vision? A web where creativity has no limits, every interaction feels exciting, and every experience leaves a lasting impression!",
    ],
  },
}

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
// SIDEPANEL COMPONENT
// ==========================================

const SidePanel = ({
  // Buttons passed from App.jsx
  children,

  // ==========================================
  // DESKTOP MODEL TRANSFORMS
  // Above 1024px
  // ==========================================

  modelPosition = [
    2.7,
    0,
    -2,
  ],

  modelRotation = [
    0.77,
    0,
    0.19,
  ],

  modelScale = 0.8,

  // ==========================================
  // TABLET MODEL TRANSFORMS
  // 785px to 1024px
  // ==========================================

  tabletModelPosition = [
    1.5,
    0,
    -1,
  ],

  tabletModelRotation = [
    0.77,
    0,
    0.19,
  ],

  tabletModelScale = 0.7,

  // ==========================================
  // SMALL TABLET MODEL TRANSFORMS
  // 601px to 784px
  // ==========================================

  smallTabletModelPosition = [
    1.4,
    0.5,
    0,
  ],

  smallTabletModelRotation = [
    0.77,
    0,
    0.19,
  ],

  smallTabletModelScale = 0.55,

  // ==========================================
  // LARGE MOBILE MODEL TRANSFORMS
  // 484px to 600px
  // ==========================================

  largeMobileModelPosition = [
    -1.7,
    1.7,
    -2,
  ],

  largeMobileModelRotation = [
    0.77,
    Math.PI / 10,
    -0.29,
  ],

  largeMobileModelScale = 0.6,

  // ==========================================
  // MOBILE MODEL TRANSFORMS
  // 483px and below
  // ==========================================

  mobileModelPosition = [
    -2,
    1.7,
    -2,
  ],

  mobileModelRotation = [
    0.77,
    Math.PI / 10,
    -0.29,
  ],

  mobileModelScale = 0.55,

  // ==========================================
  // GSAP ANIMATION SETTINGS
  // ==========================================

  animationDuration = 1.5,
  contentFadeInDuration = 0.8,
  contentFadeOutDuration = 0.4,
  contentSlideDistance = 40,
  contentDelay = 0.1,
}) => {
  // ==========================================
  // DOM REFERENCES
  // ==========================================

  // Outer wrapper animated from the left
  const sidePanelRef = useRef(null)

  // Text content animated when page changes
  const contentRef = useRef(null)

  // Saves initial 3D book transform for restoration
  const originalTransforms = useRef(null)

  // ==========================================
  // 3D BOOK REFERENCE
  // ==========================================

  const {
    modelRef,
  } = useModelContext()

  // ==========================================
  // CURRENT BOOK PAGE
  // ==========================================

  const {
    activePage,
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
  // DISPLAYED PAGE
  // Changes after current content fades out
  // ==========================================

  const [
    displayedPage,
    setDisplayedPage,
  ] = useState(activePage)

  // ==========================================
  // GET CURRENT PAGE CONTENT
  // ==========================================

  const heading =
    sidePanelData.headings[
      displayedPage
    ] || "About Us"

  const paragraphs =
    sidePanelData.paragraphs[
      displayedPage
    ] || []

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
  // SELECT RESPONSIVE BOOK POSITION
  // ==========================================

  const finalModelPosition =
    isMobile
      ? mobileModelPosition
      : isLargeMobile
        ? largeMobileModelPosition
        : isSmallTablet
          ? smallTabletModelPosition
          : isTablet
            ? tabletModelPosition
            : modelPosition

  // ==========================================
  // SELECT RESPONSIVE BOOK ROTATION
  // ==========================================

  const finalModelRotation =
    isMobile
      ? mobileModelRotation
      : isLargeMobile
        ? largeMobileModelRotation
        : isSmallTablet
          ? smallTabletModelRotation
          : isTablet
            ? tabletModelRotation
            : modelRotation

  // ==========================================
  // SELECT RESPONSIVE BOOK SCALE
  // ==========================================

  const finalModelScale =
    isMobile
      ? mobileModelScale
      : isLargeMobile
        ? largeMobileModelScale
        : isSmallTablet
          ? smallTabletModelScale
          : isTablet
            ? tabletModelScale
            : modelScale

  // ==========================================
  // OPEN SIDEPANEL AND MOVE BOOK
  // ==========================================

  useEffect(() => {
    const model =
      modelRef.current

    const panelWrapper =
      sidePanelRef.current

    if (!panelWrapper) {
      return
    }

    // Store initial book transform once
    if (
      model &&
      !originalTransforms.current
    ) {
      originalTransforms.current = {
        position:
          model.position.clone(),

        rotation:
          model.rotation.clone(),

        scale:
          model.scale.clone(),
      }
    }

    const timeline = gsap.timeline()

    // Slide side panel from left to its final position
    timeline.fromTo(
      panelWrapper,
      {
        x: -600,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,

        duration: animationDuration,

        ease: "power3.out",
      },
      0
    )

    // Move book only when model is available
    if (model) {
      // Animate book position
      timeline.to(
        model.position,
        {
          x: finalModelPosition[0],
          y: finalModelPosition[1],
          z: finalModelPosition[2],

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        },
        0
      )

      // Animate book rotation
      timeline.to(
        model.rotation,
        {
          x: finalModelRotation[0],
          y: finalModelRotation[1],
          z: finalModelRotation[2],

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        },
        0
      )

      // Animate uniform book scale
      timeline.to(
        model.scale,
        {
          x: finalModelScale,
          y: finalModelScale,
          z: finalModelScale,

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        },
        0
      )
    }

    return () => {
      timeline.kill()
    }
  }, [
    modelRef,

    finalModelPosition[0],
    finalModelPosition[1],
    finalModelPosition[2],

    finalModelRotation[0],
    finalModelRotation[1],
    finalModelRotation[2],

    finalModelScale,

    animationDuration,
  ])

  // ==========================================
  // RESTORE BOOK TRANSFORM WHEN PANEL CLOSES
  // ==========================================

  useEffect(() => {
    return () => {
      const model =
        modelRef.current

      const original =
        originalTransforms.current

      if (!model || !original) {
        return
      }

      // Return book to original position
      gsap.to(
        model.position,
        {
          x: original.position.x,
          y: original.position.y,
          z: original.position.z,

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        }
      )

      // Return book to original rotation
      gsap.to(
        model.rotation,
        {
          x: original.rotation.x,
          y: original.rotation.y,
          z: original.rotation.z,

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        }
      )

      // Return book to original scale
      gsap.to(
        model.scale,
        {
          x: original.scale.x,
          y: original.scale.y,
          z: original.scale.z,

          duration: animationDuration,

          ease: "power3.inOut",

          overwrite: true,
        }
      )
    }
  }, [
    modelRef,
    animationDuration,
  ])

  // ==========================================
  // FADE OUT OLD CONTENT WHEN PAGE CHANGES
  // ==========================================

  useEffect(() => {
    const content =
      contentRef.current

    if (!content) {
      return
    }

    // Do nothing if content already matches page
    if (activePage === displayedPage) {
      return
    }

    const animation = gsap.to(
      content,
      {
        opacity: 0,
        y: -contentSlideDistance,

        duration: contentFadeOutDuration,

        ease: "power2.inOut",

        overwrite: true,

        // Change text after fade-out completes
        onComplete: () => {
          setDisplayedPage(activePage)
        },
      }
    )

    return () => {
      animation.kill()
    }
  }, [
    activePage,
    displayedPage,
    contentFadeOutDuration,
    contentSlideDistance,
  ])

  // ==========================================
  // FADE IN NEW CONTENT AFTER PAGE CHANGES
  // ==========================================

  useLayoutEffect(() => {
    const content =
      contentRef.current

    if (!content) {
      return
    }

    const animation = gsap.fromTo(
      content,
      {
        opacity: 0,
        y: contentSlideDistance,
      },
      {
        opacity: 1,
        y: 0,

        duration: contentFadeInDuration,
        delay: contentDelay,

        ease: "power3.out",

        overwrite: true,

        immediateRender: true,
      }
    )

    return () => {
      animation.kill()
    }
  }, [
    displayedPage,
    contentFadeInDuration,
    contentSlideDistance,
    contentDelay,
  ])

  // ==========================================
  // RENDER SIDEPANEL
  // ==========================================

  return (
    <div
      ref={sidePanelRef}
      className="side-panel-wrapper"
    >
      <div className="side-panel">
        <div
          ref={contentRef}
          className="side-panel-heading-container"
          style={{
            opacity: 0,
          }}
        >
          <h1>
            {heading}
          </h1>

          <div className="divider" />

          <div className="side-panel-content">
            {paragraphs.map(
              (paragraph, index) => (
                <p key={index}>
                  {paragraph}
                </p>
              )
            )}
          </div>
        </div>
      </div>

      {/* Navigation and Home button children */}
      {children}
    </div>
  )
}

export default SidePanel