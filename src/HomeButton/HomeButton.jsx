
import { useLayoutEffect, useRef } from "react"
import gsap from "gsap"

import "./HomeButton.css"
import { useAnimationContext } from "../Contexts/AnimationContext"

const HomeButton = ({
    fadeDuration = 1.5,
    fadeDelay = 1,
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
            onClick={() => setIsSidePanel(false)}
            className="button-01 home-button"
            style={{ opacity: 0 }}
        >
            Home
        </button>
    )
}

export default HomeButton
