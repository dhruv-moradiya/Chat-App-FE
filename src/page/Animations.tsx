import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";

const Animations = () => {
  const [open, setOpen] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative flex h-screen w-screen items-center justify-center bg-neutral-900 text-white">
      <motion.button
        className="rounded-lg border border-white px-4 py-1"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => setOpen(true)}
      >
        Open Modal
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Background blur layer */}
            <motion.div
              className="fixed inset-0 z-10 bg-neutral-800/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            />

            {/* Modal */}
            <motion.div
              ref={modalRef}
              className="fixed left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white bg-white/90 px-6 py-4 text-black shadow-xl backdrop-blur-md"
              initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
              transition={{ duration: 0.2 }}
            >
              <div className="h-52 w-40 text-center">
                <p className="font-medium">Kem chho?</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Animations;
