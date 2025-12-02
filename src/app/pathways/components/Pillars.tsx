"use client";

import React from "react";
import styles from "./Pillars.module.css";
import { Zap, Heart, Users, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

interface PillarItem {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  text: string;
}

const pillars: PillarItem[] = [
  {
    id: "01",
    title: "Self-Foundation",
    icon: Zap,
    color: "#4DA3FF",
    text: "Build a grounded spiritual identity rooted in Christ through wholeness, self-awareness, and truth.",
  },
  {
    id: "02",
    title: "Inner Transformation",
    icon: Heart,
    color: "#C084FC",
    text: "Experience healing and renewal through intentional practices that break cycles and restore the heart.",
  },
  {
    id: "03",
    title: "Community & Belonging",
    icon: Users,
    color: "#22C55E",
    text: "Form authentic relationships that provide accountability, support, and spiritual covering.",
  },
  {
    id: "04",
    title: "Courageous Service",
    icon: ShieldCheck,
    color: "#FACC15",
    text: "Live boldly in your calling with confidence, faith, and a heart to serve God and others.",
  },
];

export default function Pillars() {
  return (
    <section id="pillars" className={styles.wrapper}>
      <div className={styles.inner}>
        {/* Heading */}
        <motion.div
          className={styles.headingRow}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className={styles.kicker}>Pathways Pillars</p>
          <h2 className={styles.title}>Four Anchors of Transformation</h2>
          <p className={styles.subtitle}>
            Pathways is built on four essential pillars designed to form healthy,
            spiritually grounded disciples equipped for purpose, freedom, and impact.
          </p>
        </motion.div>

        {/* Grid */}
        <div className={styles.grid}>
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon;

            return (
              <motion.div
                key={pillar.id}
                className={styles.card}
                style={{ "--accent-color": pillar.color } as React.CSSProperties}
                initial={{ opacity: 0, y: 40, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.35 }}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: "easeOut" },
                }}
                animate={{
                  float: [0, -4, 0],
                }}
                transition={{
                  float: {
                    repeat: Infinity,
                    duration: 6 + index * 1.5,
                    ease: "easeInOut",
                  },
                  default: {
                    duration: 0.55,
                    ease: "easeOut",
                    delay: index * 0.1,
                  },
                }}
              >
                <div className={styles.iconWrap}>
                  <Icon className={styles.icon} />
                </div>

                <h3 className={styles.cardTitle}>{pillar.title}</h3>
                <p className={styles.cardText}>{pillar.text}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
