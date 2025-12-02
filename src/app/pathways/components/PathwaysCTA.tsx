"use client";

import React, { useState } from "react";
import styles from "./PathwaysCTA.module.css";
import RegistrationModal from "./RegistrationModal"; 
// ⬆ adjust path based on your folder structure

export default function PathwaysCTA() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className={styles.wrapper}>
        <div className={styles.inner}>
          <div className={styles.textBlock}>
            <h3 className={styles.title}>Start Your Pathways Journey</h3>
            <p className={styles.subtitle}>Enrollment is now open.</p>
          </div>

          <button
            className={styles.button}
            onClick={() => setModalOpen(true)}
          >
            Enroll Now
          </button>
        </div>
      </section>

      {/* EXISTING POPUP MODULE */}
      <RegistrationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
