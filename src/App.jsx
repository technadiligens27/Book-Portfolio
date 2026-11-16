import './App.css'

import Experience from './Experience/Experience'
import HoverMeButton from './HoverMeButton/HoverMeButton'
import ZoomInButton from './ZoomInButton/ZoomInButton'
import SidePanel from './SidePanel/SidePanel'
import LearnMoreButton from './LearnMoreButton/LearnMoreButton'

import { useAnimationContext } from './Contexts/AnimationContext'
import HomeButton from './HomeButton/HomeButton'
import { Suspense } from 'react'
import Loading from './Loading/Loading'

// =====================================
// MAIN APPLICATION
// =====================================

function App() {

    // =====================================
    // UI STATE FROM ANIMATION CONTEXT
    // =====================================

    const {isSidePanel,isZoomedIn} = useAnimationContext()

    return (
        <div className='app'>
            <div className='hero-section'>

                {/* =====================================
                    LOAD 3D EXPERIENCE
                    Shows Loading while async assets load
                ===================================== */}

                <Suspense fallback={<Loading/>}>
                    <Experience/>
                </Suspense>

                {/* =====================================
                    PAGE NAVIGATION BUTTONS
                    Only visible while side panel is closed
                ===================================== */}

                {!isSidePanel && (
                    <HoverMeButton />
                    )}

                {/* =====================================
                    ZOOM BUTTON
                    Hidden while side panel is open
                ===================================== */}

                {!isSidePanel && <ZoomInButton/>}

                {/* =====================================
                    SIDEPANEL
                    Navigation and Home button are placed
                    inside it so their positions are relative
                    to the side panel wrapper
                ===================================== */}

                {isSidePanel && (
                <SidePanel>
                    <HoverMeButton />
                    <HomeButton/>
                </SidePanel>
                )}

                {/* =====================================
                    LEARN MORE BUTTON
                    Hidden while zoomed or side panel open
                ===================================== */}

                {!isSidePanel && !isZoomedIn && <LearnMoreButton/>}

                {/* {isSidePanel && <HomeButton/>} */}

            </div>
        </div>
    )
}

export default App