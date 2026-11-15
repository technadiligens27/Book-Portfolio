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

const SidePanel = ({
  children,

  // Desktop: above 1024px
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

  // Tablet: 785px to 1024px
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

  // Small tablet: 601px to 784px
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

  // Mobile portrait
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

  // Mobile landscape
  mobileLandscapeModelPosition = [
    2.4,
    1,
    -1,
  ],

  mobileLandscapeModelRotation = [
    0.77,
    0,
    0.19,
  ],

  mobileLandscapeModelScale = 0.75,

  animationDuration = 1.5,
  contentFadeInDuration = 0.8,
  contentFadeOutDuration = 0.4,
  contentSlideDistance = 40,
  contentDelay = 0.1,
}) => {
  const sidePanelRef = useRef(null)

  const contentRef = useRef(null)

  const originalTransforms = useRef(null)

  const {
    modelRef,
  } = useModelContext()

  const {
    activePage,
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

  const [
    displayedPage,
    setDisplayedPage,
  ] = useState(activePage)

  const heading =
    sidePanelData.headings[
      displayedPage
    ] || "About Us"

  const paragraphs =
    sidePanelData.paragraphs[
      displayedPage
    ] || []

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

  const finalModelPosition =
    isMobileLandscape
      ? mobileLandscapeModelPosition
      : isLargeMobile
        ? largeMobileModelPosition
        : isSmallTablet
          ? smallTabletModelPosition
          : isTablet
            ? tabletModelPosition
            : modelPosition

  const finalModelRotation =
    isMobileLandscape
      ? mobileLandscapeModelRotation
      : isLargeMobile
        ? largeMobileModelRotation
        : isSmallTablet
          ? smallTabletModelRotation
          : isTablet
            ? tabletModelRotation
            : modelRotation

  const finalModelScale =
    isMobileLandscape
      ? mobileLandscapeModelScale
      : isLargeMobile
        ? largeMobileModelScale
        : isSmallTablet
          ? smallTabletModelScale
          : isTablet
            ? tabletModelScale
            : modelScale

  useEffect(() => {
    const model =
      modelRef.current

    const panelWrapper =
      sidePanelRef.current

    if (!panelWrapper) {
      return
    }

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

    if (model) {
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

  useEffect(() => {
    return () => {
      const model =
        modelRef.current

      const original =
        originalTransforms.current

      if (!model || !original) {
        return
      }

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

  useEffect(() => {
    const content =
      contentRef.current

    if (!content) {
      return
    }

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

      {children}
    </div>
  )
}

export default SidePanel