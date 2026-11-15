
import {
  createContext,
  useContext,
  useRef,
  useState,
} from "react";

import * as THREE from "three";
// ==========================================
// CREATE CONTEXT
// ==========================================

const AnimationContext = createContext(null);

// ==========================================
// CONTEXT PROVIDER
// ==========================================

export const AnimationProvider = ({ children }) => {

  // ==========================================
  // PAPER ANIMATION REFS
  // ==========================================

  const paper01AnimationRef = useRef(null);
  const paper02AnimationRef = useRef(null);
  const paper03AnimationRef = useRef(null);
  const paper04AnimationRef = useRef(null);


  const paper01ShapeRef = useRef(null);
  const paper02ShapeRef = useRef(null);
  const paper03ShapeRef = useRef(null);
  const paper04ShapeRef = useRef(null);

  const [isZoomedIn,setIsZoomedIn] = useState(false);
  const [isSidePanel,setIsSidePanel] = useState(false);

  const [activePage, setActivePage] = useState(1);
  const [isMobile,setIsMobile] = useState(false)



  // ==========================================
  // PLAY ANIMATION FUNCTION
  // ==========================================


  const playPaperAnimation = (
        animationRef,
        shapeRef,
        reverse = false
    ) => {

        const action = animationRef?.current;
        const shapeAction = shapeRef?.current;

        const playAction = (selectedAction) => {

            if (!selectedAction) return;

            selectedAction.reset();
            selectedAction.enabled = true;
            selectedAction.paused = false;

            selectedAction.setLoop(THREE.LoopOnce, 1);
            selectedAction.clampWhenFinished = true;

            selectedAction.setEffectiveWeight(1);

            if (reverse) {
                selectedAction.time =
                    selectedAction.getClip().duration;

                selectedAction.setEffectiveTimeScale(-1);
            }
            else {
                selectedAction.time = 0;
                selectedAction.setEffectiveTimeScale(1);
            }

            selectedAction.play();
        };

        playAction(action);
        playAction(shapeAction);
    };


  // ==========================================
  // CONTEXT VALUES
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
        isZoomedIn,setIsZoomedIn,
        isSidePanel,setIsSidePanel,
        activePage, setActivePage,
        isMobile,setIsMobile
      }}
    >
      {children}
    </AnimationContext.Provider>
  );
};

// ==========================================
// CUSTOM HOOK
// ==========================================

export const useAnimationContext = () => {
  const context = useContext(AnimationContext);

  if (!context) {
    throw new Error(
      "useAnimationContext must be used inside AnimationProvider"
    );
  }

  return context;
};
