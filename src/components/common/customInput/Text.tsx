import React, { useState, useRef, useEffect, ReactNode } from "react";

type DynamicPositionComponentProps = {
  referenceElement: React.RefObject<HTMLElement>;
  children: ReactNode;
};

const DynamicPositionComponent: React.FC<DynamicPositionComponentProps> = ({
  referenceElement,
  children,
}) => {
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePosition = () => {
      if (!referenceElement.current || !componentRef.current) return;

      const refRect = referenceElement.current.getBoundingClientRect();
      const compRect = componentRef.current.getBoundingClientRect();

      let top = refRect.bottom;
      let left = refRect.left;

      // Adjust position based on edges
      if (refRect.right + compRect.width > window.innerWidth) {
        left = refRect.left - compRect.width;
      } else if (refRect.left < 0) {
        left = refRect.right;
      }

      if (refRect.bottom + compRect.height > window.innerHeight) {
        top = refRect.top - compRect.height;
      } else if (refRect.top < 0) {
        top = refRect.bottom;
      }

      setPosition({ top, left });
    };

    handlePosition();

    window.addEventListener("resize", handlePosition);
    window.addEventListener("scroll", handlePosition);

    return () => {
      window.removeEventListener("resize", handlePosition);
      window.removeEventListener("scroll", handlePosition);
    };
  }, [referenceElement]);

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (referenceElement.current) {
      referenceElement.current.addEventListener("click", toggleVisibility);

      return () => {
        referenceElement.current?.removeEventListener("click", toggleVisibility);
      };
    }
  }, [referenceElement]);

  return isVisible ? (
    <div
      ref={componentRef}
      style={{
        position: "absolute",
        top: position.top,
        left: position.left,
        zIndex: 1000,
        transition: "opacity 0.3s ease",
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      {children}
    </div>
  ) : null;
};

export default DynamicPositionComponent;
