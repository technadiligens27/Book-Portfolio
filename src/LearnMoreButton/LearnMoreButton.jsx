import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import { useAnimationContext } from "../Contexts/AnimationContext"

import "./LearnMoreButton.css"

// ==========================================
// LEARN MORE BUTTON
// ==========================================

const LearnMoreButton = ({
    // ==========================================
    // FADE ANIMATION SETTINGS
    // ==========================================

    fadeDuration = 1,
    fadeDelay = 0,
}) => {

    // ==========================================
    // BUTTON DOM REFERENCE
    // Used by GSAP fade animation
    // ==========================================

    const buttonRef = useRef(null)

    // ==========================================
    // SIDEPANEL STATE
    // ==========================================

    const { setIsSidePanel } = useAnimationContext()

    // ==========================================
    // FADE IN ANIMATION
    // ==========================================

    useLayoutEffect(() => {

        const button = buttonRef.current

        if (!button) return

        // Start button invisible
        gsap.set(button, {
            opacity: 0,
        })

        // Fade button into view
        const animation = gsap.to(button, {
            opacity: 1,
            duration: fadeDuration,
            delay: fadeDelay,
            ease: "power2.out",
            overwrite: true,
        })

        // Remove GSAP animation on unmount
        return () => {
            animation.kill()
        }

    }, [fadeDuration, fadeDelay])

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <button
            // DOM element used by GSAP
            ref={buttonRef}

            // Opens the Learn More side panel
            onClick={() => setIsSidePanel(true)}

            // Main button styles
            className="learn-more"

            // Initial hidden state before GSAP fade-in
            style={{ opacity: 0 }}
        >
            {/* =====================================
                EXPANDING CIRCLE AND ARROW ICON
            ===================================== */}

            <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
            </span>

            {/* =====================================
                BUTTON LABEL
            ===================================== */}

            <span className="button-text">
                Learn More
            </span>
        </button>
    )
}

export default LearnMoreButton