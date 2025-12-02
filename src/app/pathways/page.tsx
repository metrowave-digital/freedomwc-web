"use client";
import styles from "./Pathways.module.css"

import PathwaysHeader from "./components/PathwaysHeader";
import PathwaysHero from "./hero/PathwaysHero";
import CurriculumHero from "./components/CurriculumHero";
import CurriculumAccordion from "./components/CurriculumAccordion";
import PathwaysCTA from "./components/PathwaysCTA";
import Pillars from "./components/Pillars";
import PathwaysFooter from "./components/PathwaysFooter";
import PathwaysFAQ from "./components/PathwaysFAQ";
import PathwaysLeaderAbout from "./components/PathwaysLeaderAbout";
import PathwaysContact from "./components/PathwaysContact";

import { ArrowUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function PathwaysLandingSplitFocus() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>

      {/* HEADER */}
      <PathwaysHeader />

      {/* HERO */}
      <section id="pathways-overview">
        <PathwaysHero />
      </section>

      {/* Leader */}
      <section id="pathways-leader">
        <PathwaysLeaderAbout />
      </section>

      {/* CURRICULUM */}
      <section id="pathways-curriculum">
        <CurriculumHero />
        <CurriculumAccordion />
      </section>

      {/* CTA */}
      <section id="pathways-cta">
        <PathwaysCTA />
      </section>

      {/* PILLARS */}
      <section id="pathways-pillars">
        <Pillars />
      </section>

      <section id="pathways-faq">
        <PathwaysFAQ />
      </section>

      <section id="pathways-contact">
        <PathwaysContact />
      </section>

      {/* FOOTER */}
      <PathwaysFooter />

      {/* SCROLL TO TOP BUTTON */}
      {showScrollTop && (
        <button className={styles.scrollTopBtn} onClick={scrollTop}>
          <ArrowUp size={20} />
        </button>
      )}
    </div>
  );
}
