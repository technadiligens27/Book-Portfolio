import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import "./HomeButton.css"

import {
    useAnimationContext,
} from "../Contexts/AnimationContext"

// ==========================================
// HOME BUTTON
// Closes the side panel and returns to book
// ==========================================

const HomeButton = ({
    // ==========================================
    // FADE ANIMATION SETTINGS
    // ==========================================

    fadeDuration = 1.5,
    fadeDelay = 1,
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

        // Start invisible before fade animation
        gsap.set(button, {
            opacity: 0,
        })

        // Fade Home button into view
        const animation = gsap.to(button, {
            opacity: 1,
            duration: fadeDuration,
            delay: fadeDelay,
            ease: "power2.out",
            overwrite: true,
        })

        // Stop animation if component unmounts
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

            // Close side panel
            onClick={() => setIsSidePanel(false)}

            // Uses base button styles and Home styles
            className="button-01 home-button"

            // Initial hidden state before GSAP fade-in
            style={{ opacity: 0 }}
        >
            Home
        </button>
    )
}

export default HomeButton