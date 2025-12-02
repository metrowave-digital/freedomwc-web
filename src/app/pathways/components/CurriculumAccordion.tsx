"use client";

import React, { useState } from "react";
import styles from "./CurriculumAccordion.module.css";

// BRAND COLOR
const BRAND_GREEN = "#a4bf3b";

// Phase accent colors
const phaseColors: Record<string, { accent: string; light: string }> = {
  Blue: { accent: "#3B82F6", light: "rgba(59,130,246,0.12)" },
  Purple: { accent: "#9333EA", light: "rgba(147,51,234,0.12)" },
  Green: { accent: "#059669", light: "rgba(5,150,105,0.12)" },
  Gold: { accent: "#D97706", light: "rgba(217,119,6,0.12)" },
};

// ICONS ---------------------------------------------------

const ChevronDown = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ChevronUp = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="m18 15-6-6-6 6" />
  </svg>
);

const BookOpen = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
  </svg>
);

// DATA -----------------------------------------------------
import { curriculum } from "./curriculum-data";

// ----------------------------------------------------------

export default function CurriculumAccordion() {
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);

  const toggle = (phase: number) => {
    setExpandedPhase(expandedPhase === phase ? null : phase);
  };

  return (
    <section className={styles.wrapper} id="curriculum">
      <div className={styles.header}>
        <h2>
          <span className={styles.green}>Your 28-Week Journey</span>  
          <span className={styles.fadeIntense}> — Transformation Starts Here</span>
        </h2>
        <p>Tap a phase below to explore the teachings, scriptures, and weekly lessons.</p>
      </div>

      <div className={styles.list}>
        {curriculum.map((phase) => {
          const isOpen = expandedPhase === phase.phase;
          const colors = phaseColors[phase.color] || phaseColors["Blue"];

          return (
            <div
              key={phase.phase}
              className={`${styles.phaseCard} ${isOpen ? styles.phaseOpen : ""}`}
              style={{ borderLeftColor: colors.accent }}
            >
              {/* PHASE HEADER */}
              <button className={styles.phaseHeader} onClick={() => toggle(phase.phase)}>
                <div className={styles.phaseHeaderLeft}>
                  <div
                    className={styles.phaseBadge}
                    style={{ backgroundColor: colors.accent }}
                  >
                    {phase.phase}
                  </div>

                  <div>
                    <h3>{phase.title}</h3>
                    <p>{phase.duration}</p>
                  </div>
                </div>

                <div className={styles.chevron} style={{ color: BRAND_GREEN }}>
                  {isOpen ? <ChevronUp /> : <ChevronDown />}
                </div>
              </button>

              {/* CONTENT */}
              {isOpen && (
                <div className={styles.phaseBody}>
                  <p
                    className={styles.description}
                    style={{
                      backgroundColor: colors.light,
                      borderLeftColor: colors.accent,
                    }}
                  >
                    {phase.description}
                  </p>

                  <div className={styles.weekGrid}>
                    {phase.weeks.map((w) => (
                      <div key={w.week} className={styles.weekItem}>
                        <div
                          className={styles.weekBadge}
                          style={{
                            backgroundColor: colors.light,
                            color: colors.accent,
                          }}
                        >
                          W{w.week}
                        </div>

                        <div className={styles.weekInfo}>
                          <h4>{w.title}</h4>

                          <span className={styles.scripture}>
                            <BookOpen className={styles.bookIcon} />
                            {w.scripture}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
