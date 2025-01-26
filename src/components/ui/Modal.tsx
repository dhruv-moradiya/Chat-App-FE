import React, { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  closeOnOutsideClick?: boolean;
  backgroundStyle?: "transparent" | "blur"; // Prop for background style
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  closeOnOutsideClick = true,
  backgroundStyle = "blur",
  children,
}) => {
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      } ${backgroundStyle === "blur" ? "backdrop-blur-md" : "bg-black/50"}`}
      onClick={handleBackdropClick}
    >
      <div
        className={`bg-[#252733] p-6 rounded-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
