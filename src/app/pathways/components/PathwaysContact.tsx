"use client";

import React, { useState, useRef, useEffect } from "react";
import styles from "./PathwaysContact.module.css";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function PathwaysContact() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const fieldsRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  /* -----------------------------------
     GSAP ANIMATIONS (Null-safe)
  ----------------------------------- */
  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const fields = fieldsRef.current;
    const button = buttonRef.current;

    if (!section || !card || !fields || !button) return;

    const fieldChildren = Array.from(fields.children);

    const ctx = gsap.context(() => {
      // Card fade-up
      gsap.from(card, {
        opacity: 0,
        y: 50,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Stagger inputs
      gsap.from(fieldChildren, {
        opacity: 0,
        y: 30,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
        },
      });

      // Button glow delay
      gsap.from(button, {
        opacity: 0,
        y: 15,
        duration: 1,
        delay: 0.3,
        ease: "power3.out",
      });

      gsap.to(button, {
        boxShadow: "0 0 18px rgba(164,191,59,0.55)",
        repeat: -1,
        yoyo: true,
        duration: 2.5,
        ease: "sine.inOut",
      });
    }, section);

    return () => ctx.revert();
  }, []);

  /* -----------------------------------
     SUBMIT HANDLER
  ----------------------------------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = e.currentTarget;

    const data = {
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      email: form.email.value,
      phone: form.phone.value,
      message: form.message.value,
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to send message.");

      setSent(true);
      form.reset();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.headerWrap}>
        <h2 className={styles.title}>Get in Touch</h2>
        <p className={styles.subtitle}>
          We’re here to answer questions and support your journey.
        </p>
      </div>

      <div ref={cardRef} className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div ref={fieldsRef} className={styles.fieldsContainer}>
            {/* FIRST + LAST NAME */}
            <div className={styles.row}>
              <div className={styles.field}>
                <input
                  name="firstName"
                  className={styles.input}
                  placeholder=" "
                  required
                />
                <label className={styles.label}>First Name *</label>
              </div>

              <div className={styles.field}>
                <input
                  name="lastName"
                  className={styles.input}
                  placeholder=" "
                  required
                />
                <label className={styles.label}>Last Name *</label>
              </div>
            </div>

            {/* EMAIL + PHONE */}
            <div className={styles.row}>
              <div className={styles.field}>
                <input
                  name="email"
                  type="email"
                  className={styles.input}
                  placeholder=" "
                  required
                />
                <label className={styles.label}>Email *</label>
              </div>

              <div className={styles.field}>
                <input
                  name="phone"
                  type="tel"
                  className={styles.input}
                  placeholder=" "
                  required
                />
                <label className={styles.label}>Phone *</label>
              </div>
            </div>

            {/* MESSAGE */}
            <div className={styles.field}>
              <textarea
                name="message"
                rows={5}
                className={`${styles.input} ${styles.textarea}`}
                placeholder=" "
                required
              />
              <label className={styles.label}>Message *</label>
            </div>

            {error && <p className={styles.error}>{error}</p>}
            {sent && <p className={styles.success}>Message sent successfully!</p>}
          </div>

          <button ref={buttonRef} className={styles.button} disabled={loading}>
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
