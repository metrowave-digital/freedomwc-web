"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import styles from "./PathwaysHeader.module.css";
import RegistrationModal from "./RegistrationModal";

type SectionId =
  | "overview"
  | "phases"
  | "visionary"
  | "curriculum"
  | "faq"
  | "pillars"
  | "contact";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", targetId: "pathways-overview" },
  { id: "phases", label: "Phases", targetId: "phases-start" },

  // NEW
  { id: "visionary", label: "Our Visionary", targetId: "pathways-leader" },

  { id: "curriculum", label: "Curriculum", targetId: "pathways-curriculum" },

  { id: "pillars", label: "Pillars", targetId: "pathways-pillars" },

  { id: "faq", label: "FAQ", targetId: "pathways-faq" },
  
  { id: "contact", label: "Contact", targetId: "pathways-contact" },
] as const;


export default function PathwaysHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [shrink, setShrink] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [activeSection, setActiveSection] = useState<SectionId>("overview");

  const lastScroll = useRef(0);
  const navRef = useRef<HTMLDivElement>(null);
  const navRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const bannerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [underlinePos, setUnderlinePos] = useState({
    left: 0,
    width: 0,
    opacity: 0,
  });

  /* -----------------------------------------
     UPDATE UNDERLINE
  ----------------------------------------- */
  const updateUnderline = useCallback(() => {
    const navEl = navRef.current;
    const activeEl = navRefs.current[activeSection];

    if (!navEl || !activeEl) {
      setUnderlinePos((p) => ({ ...p, opacity: 0 }));
      return;
    }

    const navRect = navEl.getBoundingClientRect();
    const itemRect = activeEl.getBoundingClientRect();

    setUnderlinePos({
      left: itemRect.left - navRect.left,
      width: itemRect.width,
      opacity: 1,
    });
  }, [activeSection]);

  useEffect(() => {
    requestAnimationFrame(updateUnderline);
  }, [updateUnderline]);

  /* -----------------------------------------
     PROGRESS BAR
  ----------------------------------------- */
  useEffect(() => {
    const progressBar = document.getElementById("progressBar");

    const handleScrollProgress = () => {
      const y = window.scrollY;
      const max = document.body.scrollHeight - window.innerHeight;
      if (progressBar) progressBar.style.width = `${(y / max) * 100}%`;
    };

    window.addEventListener("scroll", handleScrollProgress);
    return () => window.removeEventListener("scroll", handleScrollProgress);
  }, []);

  /* -----------------------------------------
     BANNER ALWAYS VISIBLE + SHRINK HEADER
  ----------------------------------------- */
  useEffect(() => {
    const handleScroll = () => {
      const current = window.scrollY;

      setShrink(current > 40);

      // banner always stays visible
      setShowBanner(true);

      lastScroll.current = current;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* -----------------------------------------
     DYNAMIC HEADER OFFSET = BANNER HEIGHT
  ----------------------------------------- */
  useEffect(() => {
    const banner = bannerRef.current;
    const header = headerRef.current;

    if (!banner || !header) return;

    const updateHeaderOffset = () => {
      const height = banner.offsetHeight;
      header.style.top = `${height}px`;
    };

    updateHeaderOffset();
    window.addEventListener("resize", updateHeaderOffset);
    return () => window.removeEventListener("resize", updateHeaderOffset);
  }, []);

  /* -----------------------------------------
     CLICK OUTSIDE MENU CLOSE
  ----------------------------------------- */
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        !toggleRef.current?.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  /* -----------------------------------------
     SCROLL SPY
  ----------------------------------------- */
  useEffect(() => {
  const sectionMap: Record<SectionId, string> = {
    overview: "pathways-overview",
    phases: "phases-start",
    visionary: "pathways-leader",
    curriculum: "pathways-curriculum",
    faq: "pathways-faq",
    pillars: "pathways-pillars",
    contact: "pathways-contact",
  };

  const sections = Object.entries(sectionMap)
    .map(([key, id]) => {
      const el = document.getElementById(id);
      return el ? { key: key as SectionId, el } : null;
    })
    .filter(Boolean) as { key: SectionId; el: HTMLElement }[];

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const found = sections.find((s) => s.el === entry.target);
        if (found && entry.isIntersecting) {
          setActiveSection(found.key);
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach((s) => obs.observe(s.el));
  return () => obs.disconnect();
}, []);


  /* -----------------------------------------
     NAV CLICK
  ----------------------------------------- */
  const handleNavClick = (item: (typeof NAV_ITEMS)[number]) => {
    const el = document.getElementById(item.targetId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  /* -----------------------------------------
     RENDER
  ----------------------------------------- */
  return (
    <>
      {/* PROGRESS BAR */}
      <div id="progressBar" className={styles.progressBar} />

      {/* BANNER */}
      <div
        ref={bannerRef}
        className={`${styles.topBanner} ${
          showBanner ? styles.bannerVisible : styles.bannerHidden
        }`}
      >
        <Link href="https://freedomwc.org" className={styles.bannerLink}>
          <span className={styles.bannerArrow}>⟵</span>
          <span>Return to Freedom Worship Center</span>
        </Link>
      </div>

      {/* HEADER */}
      <div ref={headerRef} className={styles.stickyWrapper}>
        <header className={`${styles.header} ${shrink ? styles.shrunk : ""}`}>
          {/* LEFT */}
          <div className={styles.leftGroup}>
            <Image
              src="/fwc-logo.svg"
              alt="FWC Logo"
              width={54}
              height={54}
              className={`${styles.logo} ${shrink ? styles.logoShrunk : ""}`}
            />
            <div className={styles.titleBlock}>
              <h1 className={`${styles.title} ${shrink ? styles.titleShrunk : ""}`}>
                PATHWAYS
              </h1>
              <p className={`${styles.subtitle} ${shrink ? styles.subtitleShrunk : ""}`}>
                A Freedom Worship Center Initiative
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.rightGroup}>
            <nav ref={navRef} className={`${styles.nav} ${styles.desktopOnly}`}>
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  ref={(el) => {
                    navRefs.current[item.id] = el;
                  }}
                  className={`${styles.navItem} ${
                    activeSection === item.id ? styles.active : ""
                  }`}
                  onClick={() => handleNavClick(item)}
                >
                  {item.label}
                </button>
              ))}

              <div
                className={styles.navUnderline}
                style={{
                  transform: `translateX(${underlinePos.left}px)`,
                  width: underlinePos.width,
                  opacity: underlinePos.opacity,
                }}
              />
            </nav>

            <button
              className={`${styles.ctaButton} ${styles.desktopOnly}`}
              onClick={() => setModalOpen(true)}
            >
              Join Pathways
            </button>

            <button
              ref={toggleRef}
              className={styles.mobileToggle}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </header>
      </div>

      {/* MOBILE OVERLAY */}
      <div className={`${styles.mobileOverlay} ${menuOpen ? styles.overlayOpen : ""}`} />

      {/* MOBILE MENU */}
      <div ref={menuRef} className={`${styles.mobileMenu} ${menuOpen ? styles.open : ""}`}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            className={styles.mobileNavItem}
            onClick={() => handleNavClick(item)}
          >
            {item.label}
          </button>
        ))}

        <button
          className={styles.mobileCTA}
          onClick={() => {
            setMenuOpen(false);
            setModalOpen(true);
          }}
        >
          Join Pathways
        </button>
      </div>

      {/* MODAL */}
      <RegistrationModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
