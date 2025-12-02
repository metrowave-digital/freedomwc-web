"use client";

import React from "react";
import styles from "./CurriculumHero.module.css";

export default function CurriculumHero() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.bgGlow}></div>
      <div className={styles.overlay}></div>

      <div className={styles.inner}>
        <p className={styles.kicker}>Pathways Curriculum</p>

        <h1 className={styles.title}>
          Experience <span>Intentional 
          Growth</span> for Spiritual Renewal, Inner Healing, 
          and Personal Transformation.
        </h1>

        <p className={styles.scripture}>
          “He who began a good work in you will carry it on to completion.”  
          <span>— Philippians 1:6</span>
        </p>
      </div>
    </section>
  );
}
