"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./PathwaysLeaderAbout.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PathwaysLeaderAbout() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const verticalTitleRef = useRef<HTMLHeadingElement | null>(null);
  const verticalLineRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const textBlockRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = verticalTitleRef.current;
    const line = verticalLineRef.current;
    const photo = photoRef.current;
    const text = textBlockRef.current;

    if (!section || !title || !line || !photo || !text) return;

    const ctx = gsap.context(() => {
      // Vertical title
      gsap.from(title, {
        opacity: 0,
        y: 80,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      // Line growth
      gsap.from(line, {
        scaleY: 0,
        transformOrigin: "top",
        duration: 1.1,
        delay: 0.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      // Photo entrance
      gsap.from(photo, {
        opacity: 0,
        x: 60,
        duration: 1.3,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });

      // Photo parallax drift
      gsap.to(photo, {
        y: -14,
        duration: 3,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Text stagger
      gsap.from(text.children, {
        opacity: 0,
        y: 36,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>
        
        {/* LEFT — Vertical Title */}
        <div className={styles.verticalTitleWrapper}>
          <h2 ref={verticalTitleRef} className={styles.verticalTitle}>
            Meet the Visionary
          </h2>
          <div ref={verticalLineRef} className={styles.verticalLine}></div>
        </div>

        {/* RIGHT — Photo + Text */}
        <div className={styles.contentWrapper}>

          <div ref={photoRef} className={styles.photoWrapper}>
            <Image
              src="/images/karesse.jpeg"
              width={520}
              height={520}
              alt="Karesse Clemons"
              className={styles.photo}
            />
            <div className={styles.glow}></div>
          </div>

          <div ref={textBlockRef} className={styles.textBlock}>
            <h3 className={styles.name}>Karesse Clemons</h3>
            <p className={styles.role}>
              Lead Pastor-Elect &bull; Freedom Worship Center
            </p>

            <p className={styles.bio}>
              Karesse Clemons is a multifaceted leader, author, and 
              entrepreneur dedicated to guiding people toward spiritual 
              clarity and personal transformation. He blends media 
              expertise with deep theological training to help others 
              grow with intention and purpose.
            </p>

            <p className={styles.bio}>
              With a Bachelor&rsquo;s in Mass Communications and currently 
              completing a Master of Divinity degree at Interdenominational Theological Center, Karesse brings 
              a unique combination of creativity, academic insight, 
              and pastoral care.
            </p>

            <p className={styles.bio}>
              As a producer, educator, and ministerial leader, he 
              champions diverse voices and creates meaningful 
              experiences that inspire growth. His life is anchored 
              by the belief that &lsquo;if you keep moving forward, 
              all things are possible.&rsquo;
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
