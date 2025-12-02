"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import styles from "./RegistrationModal.module.css";
import RegistrationWizard from "./RegistrationWizard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegistrationModal({ isOpen, onClose }: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={styles.overlay}
          onMouseDown={handleOverlayClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className={styles.bgOrbits} />

          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, y: 60, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.94 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            onMouseDown={(e) => e.stopPropagation()}
          >

            {/* ========== TOP-RIGHT EXIT CONTROLS ========== */}
            <div className={styles.topRightExit}>
              <p className={styles.exitText} onClick={onClose}>
                Exit application
              </p>

              <button
                type="button"
                className={styles.closeIconBtn}
                aria-label="Close application"
                onClick={onClose}
              >
                ✕
              </button>
            </div>

            {/* ========== HEADER BLOCK ========== */}
            <header className={styles.header}>
              <p className={styles.badge}>PATHWAYS APPLICATION</p>

              <h2 className={styles.title}>Begin Your Journey</h2>

              <p className={styles.subtitle}>
                This 6-step application helps us walk with you with care,
                clarity, and honor for your story.
              </p>

              <div className={styles.headerDivider} />
            </header>

            {/* ========== WIZARD BODY ========== */}
            <RegistrationWizard onSuccess={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
