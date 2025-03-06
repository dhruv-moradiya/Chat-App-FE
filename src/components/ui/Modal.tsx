import React, { ReactNode } from "react";
import { useAppDispatch } from "@/store/store";
import { closeModal } from "@/store/chatDetailSidebar/ChatDetailSlice";

interface ModalProps {
  isOpen: boolean;
  closeOnOutsideClick?: boolean;
  backgroundStyle?: "transparent" | "blur";
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  closeOnOutsideClick = true,
  backgroundStyle = "blur",
  children,
}) => {
  const dispatch = useAppDispatch();

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnOutsideClick && e.target === e.currentTarget) {
      dispatch(closeModal());
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
        className={`scrollbar bg-[#252733] p-4 md:p-6 max-h-[80%] max-w-[90%] md:max-w-[50%] overflow-y-auto rounded-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
