"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./PathwaysHero.module.css";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play, ArrowRight, BookOpen, Calendar, Clock } from "lucide-react";

import YoutubeVideoModal from "../../components/global/popups/YoutubeVideoModal";
import RegistrationModal from "../components/RegistrationModal";

gsap.registerPlugin(ScrollTrigger);

const phases = [
  {
    number: "Phase 1 - Restore",
    title: "Identity & Awakening",
    desc: "Uncover your true, God-given identity, firmly establishing your spiritual foundations. This phase is about awakening to your divine purpose and recalibrating your entire life to walk confidently in it.",
  },
  {
    number: "Phase 2 - Root",
    title: "Formation & Discipline",
    desc: "Cultivate life-giving spiritual habits and embrace a powerful rhythm of prayer, devotion, and accountability. Here, you'll build the inner strength and daily obedience that empower sustained growth.",
  },
  {
    number: "Phase 3 - Rise",
    title: "Activation & Leadership",
    desc: "Step boldly into your unique ministry identity, learning to cultivate Christ-centered influence and emotional maturity. This phase equips you to lead with grace, wisdom, and unwavering faith.",
  },
  {
    number: "Phase 4 - Release",
    title: "Mission & Impact",
    desc: "Move outward with courage and conviction! This is where you serve boldly, walk in profound impact, and fully release your divine calling into tangible, real-world ministry.",
  },
];

export default function PathwaysHero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const [registrationOpen, setRegistrationOpen] = useState(false);

  const heroRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLDivElement | null>(null);

  const fogRef = useRef<HTMLDivElement | null>(null);
  const scriptureRef = useRef<HTMLParagraphElement | null>(null);
  const phasesRef = useRef<HTMLDivElement | null>(null);

  /* SCROLL INDICATOR REFS */
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const arrowRef = useRef<HTMLSpanElement | null>(null);

  /* Lock body scroll when any modal is open */
  useEffect(() => {
    if (videoOpen || registrationOpen) {
      const original = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = original;
      };
    }
  }, [videoOpen, registrationOpen]);

  /* ESC closes modals */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setVideoOpen(false);
        setRegistrationOpen(false);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* GSAP animations */
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Text intro
      gsap.from(textRef.current, {
        opacity: 0,
        y: 55,
        duration: 1.2,
        ease: "power3.out",
      });

      // Video card intro
      gsap.from(videoRef.current, {
        opacity: 0,
        y: 55,
        scale: 0.9,
        duration: 1.25,
        ease: "power3.out",
      });

      // Parallax hero
      gsap.to(heroRef.current, {
        y: 70,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=500",
          scrub: true,
        },
      });

      // Fog layer parallax
      gsap.to(fogRef.current, {
        y: 120,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "+=650",
          scrub: true,
        },
      });

      // Floating particles
      gsap.to(`.${styles.heroParticle}`, {
        y: -15,
        duration: 6,
        stagger: { each: 0.2, from: "random" },
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      // Scripture reveal
      gsap.fromTo(
        scriptureRef.current,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 1.2, delay: 1 }
      );

      // Phase cards on scroll
      gsap.from(".phaseCard", {
        opacity: 0,
        y: 55,
        duration: 1,
        stagger: 0.16,
        ease: "power3.out",
        scrollTrigger: {
          trigger: phasesRef.current,
          start: "top 80%",
        },
      });

      // Arrow bounce
      gsap.to(arrowRef.current, {
        y: 12,
        duration: 1.3,
        repeat: -1,
        yoyo: true,
        ease: "cubic-bezier(0.6,0.05,0.3,0.9)",
      });

      // Scroll hint fade out on scroll
      gsap.to(scrollHintRef.current, {
        opacity: 0,
        y: -35,
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "top+=300",
          scrub: true,
        },
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  /* Smooth scroll to CurriculumAccordion section */
  const handleScrollToCurriculum = () => {
    const el = document.getElementById("pathways-curriculum");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* GLOBAL MODALS */}
      <YoutubeVideoModal
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        videoUrl="https://youtu.be/NDnbzPvUOCc"
      />

      <RegistrationModal
        isOpen={registrationOpen}
        onClose={() => setRegistrationOpen(false)}
      />

      {/* HERO */}
      <section ref={heroRef} className={styles.hero}>
        {/* BG VIDEO */}
        <div className={styles.heroBg}>
          <video autoPlay loop muted playsInline className={styles.bgVideo}>
            <source src="/video/pathways-bg-loop.mp4" type="video/mp4" />
          </video>
          <div className={styles.bgOverlay} />
        </div>

        {/* FOG */}
        <div className={styles.fogLayer} ref={fogRef} />

        {/* PARTICLES */}
        <div className={styles.particles}>
          {Array.from({ length: 9 }).map((_, i) => (
            <span key={i} className={styles.heroParticle} />
          ))}
        </div>

        {/* INNER CONTENT */}
        <div className={styles.inner}>
          {/* LEFT TEXT */}
          <div ref={textRef} className={styles.leftPanel}>
            <p className={styles.badge}>28 Weeks to Spiritual Freedom</p>

            <h1 className={styles.title}>
              Unleash Purpose.
              <br />
              <span className={styles.green}>Serve Boldly.</span>
            </h1>

            <p className={styles.subtitle}>
              Embark on a profound spiritual development journey built for today’s believer.
            </p>

            <p ref={scriptureRef} className={styles.scripture}>
              “He restores my soul…” <span>Psalm 23:3</span>
            </p>

            <div className={styles.infoRow}>
              <div className={styles.infoItem}>
                <Calendar size={18} /> Starts January 2026
              </div>
              <div className={styles.infoItem}>
                <Clock size={20} /> 7 Months — 4 Phases
              </div>
            </div>

            <div className={styles.ctaRow}>
              <button
                type="button"
                className={styles.primaryBtn}
                onClick={() => setRegistrationOpen(true)}
              >
                Enroll Today <ArrowRight size={18} />
              </button>

              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={handleScrollToCurriculum}
              >
                <BookOpen size={18} /> View Curriculum
              </button>
            </div>
          </div>

          {/* RIGHT VIDEO CARD */}
          <div className={styles.videoPanel}>
            <div ref={videoRef} className={styles.videoCard}>
              <div className={styles.thumbWrapper}>
                <Image
                  src="/images/worship.jpeg"
                  alt="Overview"
                  fill
                  className={styles.thumb}
                />
              </div>

              <div className={styles.videoOverlay}>
                <button
                  type="button"
                  className={styles.playButton}
                  onClick={() => setVideoOpen(true)}
                >
                  <Play size={26} />
                </button>
                <p className={styles.videoTitle}>Discover the Journey</p>
                <p className={styles.videoSubtitle}>Explore Pathways</p>
              </div>
            </div>
          </div>
        </div>

        {/* TIER-3 SCROLL INDICATOR */}
        <div className={styles.scrollHint} ref={scrollHintRef}>
          <p className={styles.scrollText}>Scroll to explore</p>

          <div className={styles.scrollArrowWrapper}>
            <div className={styles.scrollArrowGlow}></div>
            <span className={styles.scrollArrow} ref={arrowRef}>
              ▼
            </span>
          </div>
        </div>

        <div className={styles.softSeparator} />
      </section>

      {/* PHASES */}
      <section id="phases-start" className={styles.phases} ref={phasesRef}>
        <div className={styles.phasesInner}>
          <p className={styles.phasesBadge}>Your Journey</p>
          <h2 className={styles.phasesTitle}>The Four Phases of Transformation</h2>

          <p className={styles.phasesSubtitle}>
            Each phase thoughtfully builds upon the last, empowering your journey from deep
            spiritual grounding to a life of bold, purpose-driven impact.
          </p>

          <div className={styles.grid}>
            {phases.map((phase, i) => (
              <div key={i} className={`${styles.phaseCard} phaseCard`}>
                <div className={styles.number}>{phase.number}</div>
                <h3 className={styles.cardTitle}>{phase.title}</h3>
                <p className={styles.desc}>{phase.desc}</p>
                <div className={styles.cardGlow} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
