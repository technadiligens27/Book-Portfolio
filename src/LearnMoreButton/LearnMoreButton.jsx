
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import { useAnimationContext } from "../Contexts/AnimationContext"

import "./LearnMoreButton.css"

const LearnMoreButton = ({
    fadeDuration = 1,
    fadeDelay = 0,
}) => {

    const buttonRef = useRef(null)

    const { setIsSidePanel } = useAnimationContext()

    // ==========================================
    // FADE IN ANIMATION
    // ==========================================

    useLayoutEffect(() => {

        const button = buttonRef.current

        if (!button) return

        gsap.set(button, {
            opacity: 0,
        })

        const animation = gsap.to(button, {
            opacity: 1,
            duration: fadeDuration,
            delay: fadeDelay,
            ease: "power2.out",
            overwrite: true,
        })

        return () => {
            animation.kill()
        }

    }, [fadeDuration, fadeDelay])

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <button
            ref={buttonRef}
            onClick={() => setIsSidePanel(true)}
            className="learn-more"
            style={{ opacity: 0 }}
        >
            <span className="circle" aria-hidden="true">
                <span className="icon arrow"></span>
            </span>

            <span className="button-text">
                Learn More
            </span>
        </button>
    )
}

export default LearnMoreButton
