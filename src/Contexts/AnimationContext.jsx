import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import * as THREE from "three";

// ==========================================
// CREATE CONTEXT
// Shared state for book animations, pages,
// zoom state, and side panel state.
// ==========================================

const AnimationContext = createContext(null);

// ==========================================
// CONTEXT PROVIDER
// Wrap your application with this provider
// so child components can access its values.
// ==========================================

export const AnimationProvider = ({ children }) => {

  // ==========================================
  // PAPER TURN ANIMATION REFS
  // These refs receive animation actions
  // from the Book model component.
  // ==========================================

  const paper01AnimationRef = useRef(null);
  const paper02AnimationRef = useRef(null);
  const paper03AnimationRef = useRef(null);
  const paper04AnimationRef = useRef(null);

  // ==========================================
  // PAPER SHAPE KEY ANIMATION REFS
  // Used together with page turn animations
  // to create the curved page effect.
  // ==========================================

  const paper01ShapeRef = useRef(null);
  const paper02ShapeRef = useRef(null);
  const paper03ShapeRef = useRef(null);
  const paper04ShapeRef = useRef(null);

  // ==========================================
  // UI STATE
  // ==========================================

  // Whether the 3D book is currently zoomed in
  const [isZoomedIn,setIsZoomedIn] = useState(false);

  // Whether the Learn More side panel is visible
  const [isSidePanel,setIsSidePanel] = useState(false);

  // Current visible book page
  const [activePage, setActivePage] = useState(1);

  // Mobile device state
  const [isMobile,setIsMobile] = useState(false)

  // ==========================================
  // PLAY PAPER ANIMATION FUNCTION
  // Plays both the normal page animation and
  // the shape key animation at the same time.
  // ==========================================

  const playPaperAnimation = (
        animationRef,
        shapeRef,
        reverse = false
    ) => {

        // Get Three.js animation actions from refs
        const action = animationRef?.current;
        const shapeAction = shapeRef?.current;

        // ==========================================
        // PREPARE AND PLAY ONE ACTION
        // ==========================================

        const playAction = (selectedAction) => {

            // Skip missing animation actions
            if (!selectedAction) return;

            // Reset animation to a clean state
            selectedAction.reset();
            selectedAction.enabled = true;
            selectedAction.paused = false;

            // Play once and keep final animation frame
            selectedAction.setLoop(THREE.LoopOnce, 1);
            selectedAction.clampWhenFinished = true;

            // Ensure animation has full influence
            selectedAction.setEffectiveWeight(1);

            // ==========================================
            // REVERSE OR FORWARD PLAYBACK
            // ==========================================

            if (reverse) {
                // Start at the end and run backwards
                selectedAction.time =
                    selectedAction.getClip().duration;

                selectedAction.setEffectiveTimeScale(-1);
            }
            else {
                // Start at the beginning and run forward
                selectedAction.time = 0;
                selectedAction.setEffectiveTimeScale(1);
            }

            // Start animation playback
            selectedAction.play();
        };

        // Play page turn animation
        playAction(action);

        // Play matching shape key animation
        playAction(shapeAction);
    };

  // ==========================================
  // CONTEXT VALUES
  // Values available to every component inside
  // AnimationProvider.
  // ==========================================

  return (
    <AnimationContext.Provider
      value={{
        paper01AnimationRef,
        paper02AnimationRef,
        paper03AnimationRef,
        paper04AnimationRef,

        paper01ShapeRef,
        paper02ShapeRef,
        paper03ShapeRef,
        paper04ShapeRef,

        playPaperAnimation,

        isZoomedIn,
        setIsZoomedIn,

        isSidePanel,
        setIsSidePanel,

        activePage,
        setActivePage,

        isMobile,
        setIsMobile
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// Use this hook to access AnimationContext.
// ==========================================

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);

  // Show an error if hook is used outside provider
  if (!context) {
    throw new Error(
      "useAnimationContext must be used inside AnimationProvider"
    );
  }

  return context;
};