// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import "./home.css";

export default function HomePage() {
  return (
    <main className="landing-wrapper">
      {/* HERO */}
      <section className="hero">
        <Image
          src="/images/hero.jpg"
          alt="Freedom Worship Center"
          fill
          priority
          className="hero-bg"
        />

        <div className="hero-content">
          <h1 className="hero-title">Welcome to Freedom Worship Center</h1>
          <p className="hero-sub">
            Where faith comes alive, purpose is awakened, and lives are transformed.
          </p>

          <div className="hero-buttons">
            <Link href="/visit" className="btn-primary">
              Plan Your Visit
            </Link>

            <Link href="/live" className="btn-outline">
              Watch Live
            </Link>
          </div>
        </div>
      </section>

      {/* PATHWAYS – Featured CTA */}
      <section className="pathways-highlight">
        <div className="pathways-inner">
          <h2 className="section-title">Discover Pathways</h2>
          <p className="section-desc">
            A transformational discipleship journey into healing, identity, wholeness,
            and spiritual maturity—unique to Freedom Worship Center.
          </p>

          <Link href="/pathways" className="btn-green">
            Explore the Pathways Program
          </Link>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="content-section alt-dark">
        <h2 className="section-title">Who We Are</h2>
        <p className="section-desc max-w-3xl">
          Freedom Worship Center is a Christ-centered, Spirit-filled community committed
          to healing, restoration, and discipleship. Whether you're exploring faith or
          growing deeper, there's a place for you here.
        </p>

        <div className="card-grid-3">
          <Link href="/about" className="info-card">
            <h3>About FWC</h3>
            <p>Learn more about who we are and our mission.</p>
          </Link>

          <Link href="/leadership" className="info-card">
            <h3>Pastoral Leadership</h3>
            <p>Meet the leaders who serve our church.</p>
          </Link>

          <Link href="/beliefs" className="info-card">
            <h3>What We Believe</h3>
            <p>Explore our foundational beliefs and values.</p>
          </Link>
        </div>
      </section>

      {/* THIS WEEK */}
      <section className="content-section">
        <h2 className="section-title">This Week at Freedom</h2>

        <div className="card-grid-3">
          <Link href="/services" className="weekly-card">
            <h3>Sunday Worship</h3>
            <p>Sundays at 11 AM</p>
          </Link>

          <Link href="/pathways" className="weekly-card">
            <h3>Pathways Discipleship</h3>
            <p>Enroll Today</p>
          </Link>

          <Link href="/prayer" className="weekly-card">
            <h3>Prayer & Community</h3>
            <p>Join Weekly Prayer</p>
          </Link>
        </div>
      </section>

      {/* MINISTRIES */}
      <section className="content-section alt-dark">
        <h2 className="section-title">Featured Ministries</h2>

        <div className="card-grid-2">
          {[
            {
              title: "Pathways Discipleship",
              desc: "A journey into spiritual healing, identity, and growth.",
            },
            {
              title: "FWC Kids",
              desc: "Safe, fun, and Christ-centered experiences for children.",
            },
            {
              title: "FWC Worship",
              desc: "A worship team committed to excellence and spiritual depth.",
            },
            {
              title: "Community Outreach",
              desc: "Serving the hurting, feeding families, and restoring hope.",
            },
          ].map((m, i) => (
            <div key={i} className="ministry-card">
              <h3>{m.title}</h3>
              <p>{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WATCH */}
      <section className="content-section">
        <h2 className="section-title">Watch Live & On Demand</h2>
        <p className="section-desc max-w-xl">
          Experience Freedom from wherever you are.
        </p>

        <Link href="/sermons" className="btn-primary">
          Browse Sermons
        </Link>
      </section>

      {/* EVENTS */}
      <section className="content-section alt-dark">
        <h2 className="section-title">Upcoming Events</h2>

        <div className="card-grid-3">
          {[
            { title: "FWC Prayer Gathering", date: "Every Tuesday" },
            { title: "Pathways Orientation", date: "Monthly" },
            { title: "Worship Night", date: "Coming Soon" },
          ].map((e, i) => (
            <div key={i} className="event-card">
              <h3>{e.title}</h3>
              <p>{e.date}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PLAN YOUR VISIT */}
      <section className="visit-section">
        <h2 className="section-title">Plan Your Visit</h2>
        <p className="section-desc max-w-2xl">
          We can’t wait to meet you and welcome you into the Freedom family.
        </p>

        <Link href="/visit" className="btn-white">
          Get Started
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <h4 className="footer-title">Freedom Worship Center</h4>
            <p>Healing. Hope. Freedom.</p>
          </div>

          <div className="footer-links">
            <Link href="/privacy">Privacy</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/give">Give</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
