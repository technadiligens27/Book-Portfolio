
import { useState, useEffect, useRef } from "react";

import { Html } from "@react-three/drei";
import { createPortal } from "@react-three/fiber";
import { useControls } from "leva";

import "./BookPageButton.css";

const BookPageButton = ({
  pageMesh,
  label = "Explore More",
  controlName = "Book Page Button",
  onClick,
}) => {
  const [isDisappearing, setIsDisappearing] =
    useState(false);

  const timeoutRef = useRef(null);

  const {
    position,
    rotation,
    scale,
  } = useControls(controlName, {
    position: {
      value: {
        x: -2.5,
        y: 0,
        z: 0.01,
      },
      step: 0.01,
    },

    rotation: {
      value: {
        x: -Math.PI / 2,
        y: 0,
        z: 0,
      },
      step: 0.01,
    },

    scale: {
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.01,
    },
  });

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleButtonClick = (e) => {
    e.stopPropagation();

    if (isDisappearing) return;

    setIsDisappearing(true);

    // Wait until shrink animation finishes
    timeoutRef.current = setTimeout(() => {
      onClick?.();
    }, 350);
  };

  if (!pageMesh) return null;

  return createPortal(
    <Html
      position={[
        position.x,
        position.y,
        position.z,
      ]}
      rotation={[
        rotation.x,
        rotation.y,
        rotation.z,
      ]}
      scale={scale}
      transform
      distanceFactor={1}
    >
      <button
        className={`book-page-button ${
          isDisappearing
            ? "disappearing"
            : ""
        }`}
        onClick={handleButtonClick}
        disabled={isDisappearing}
      >
        {label}
      </button>
    </Html>,
    pageMesh
  );
};

export default BookPageButton;
