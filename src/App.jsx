
import './App.css'

import Experience from './Experience/Experience'
import HoverMeButton from './HoverMeButton/HoverMeButton'
import ZoomInButton from './ZoomInButton/ZoomInButton'
import SidePanel from './SidePanel/SidePanel'
import LearnMoreButton from './LearnMoreButton/LearnMoreButton'

import { useAnimationContext } from './Contexts/AnimationContext'
import HomeButton from './HomeButton/HomeButton'

function App() {

    const {isSidePanel,isZoomedIn} = useAnimationContext()

    return (
        <div className='app'>
            <div className='hero-section'>
                <Experience/>
                {/* PAGE NAVIGATION */}
                {!isSidePanel && (
                    <HoverMeButton />
                    )}


                {!isSidePanel && <ZoomInButton/>}

                {isSidePanel && (
                <SidePanel>
                    <HoverMeButton />
                    <HomeButton/>
                </SidePanel>
                )}

                {!isSidePanel && !isZoomedIn && <LearnMoreButton/>}
                {/* {isSidePanel && <HomeButton/>} */}

            </div>
        </div>
    )
}

export default App
