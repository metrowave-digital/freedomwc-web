"use client";

import React from "react";
import FAQ from "../../components/global/information/FAQ";
import { pathwaysFAQ } from "./faq-data";
import styles from "./PathwaysFAQ.module.css";

export default function PathwaysFAQ() {
  return (
    <section id="pathways-faq" className={styles.section}>
      <div className={styles.inner}>
        <FAQ items={pathwaysFAQ} title="Pathways FAQ" />
      </div>
    </section>
  );
}
