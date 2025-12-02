"use client";

import styles from "./PathwaysFooter.module.css";
import Image from "next/image";

export default function PathwaysFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* LEFT */}
        <div className={styles.left}>
          <Image
            src="/fwc-white.jpg"   // <-- update to your actual logo path
            alt="FWC Logo"
            width={42}
            height={42}
            className={styles.logo}
          />

          <div>
            <p className={styles.title}>THE COMMONS</p>
            <p className={styles.subtitle}>
              A Ministry of Freedom Worship Center
            </p>
          </div>
        </div>

        {/* LINKS */}
        <div className={styles.links}>
          <a href="/give">Give</a>
          <a href="/about">About</a>
          <a href="/terms">Terms & Conditions</a>
        </div>

        {/* COPYRIGHT */}
        <div className={styles.copy}>
          &copy; 2025 FWC. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
