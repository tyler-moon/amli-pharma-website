"use client";

import React, { useEffect, useState, FormEvent } from "react";
import Logo from "./Logo";

const FORM_ENDPOINT = "https://formsubmit.co/ajax/pharma.contact@amli.group";

const pillars = ["Beauty", "Pharmacy", "Telemedicine"];

const platformIcons: Record<string, React.ReactElement> = {
  Beauty: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M10 3h4M9.5 3v3.2c0 .6-.2 1.1-.5 1.6l-1.4 2A4 4 0 0 0 7 12.2V19a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-6.8a4 4 0 0 0-.6-2.4l-1.4-2c-.3-.5-.5-1-.5-1.6V3" />
      <path d="M7.2 14.5h9.6" />
    </svg>
  ),
  Pharmacy: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
      <path d="M12 8v8M8 12h8" />
    </svg>
  ),
  Telemedicine: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.5" y="6" width="13" height="12" rx="2.5" />
      <path d="m15.5 10 5-3v10l-5-3" />
    </svg>
  )
};

const platform = [
  {
    zone: "Beauty",
    title: "Beauty to discover, in person.",
    text: "Browse beauty and personal-care ranges, explore the shelves and try products in our Tashkent store.",
    img: "/images/triecare-beauty-experience.webp",
    srcSet: "/images/triecare-beauty-experience-800.webp 800w, /images/triecare-beauty-experience.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "Visitors exploring beauty products at the TRIE CARE Tashkent opening."
  },
  {
    zone: "Pharmacy",
    title: "Care starts at the counter.",
    text: "Beauty and pharmacy come together in our Tashkent store, with a team available to guide visitors.",
    img: "/images/triecare-store-service.webp",
    srcSet: "/images/triecare-store-service-800.webp 800w, /images/triecare-store-service.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A TRIE CARE team member speaking with visitors at the store counter."
  },
  {
    zone: "Telemedicine",
    title: "Care that follows her home.",
    text: "Our telemedicine platform is in development, designed to connect app-based consultations and follow-up with the in-store experience.",
    img: "/images/platform-care.jpg",
    alt: "Skincare continuing at home"
  }
];

const trust = [
  {
    label: "Physicians decide",
    text: "Clinical decisions rest with licensed doctors. The assistant informs and guides — it never diagnoses and never prescribes — with clear disclaimers and an audit trail."
  },
  {
    label: "One membership, one record",
    text: "Store, pharmacy, app and consultations share one membership and one history — so care doesn't restart at every counter."
  },
  {
    label: "Privacy by default",
    text: "Beauty preferences, health information and consent live in one protected profile the customer controls."
  },
  {
    label: "Made for the region",
    text: "Halal-conscious ranges and service in local languages, from day one."
  }
];

export default function Page() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleEnquiry(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = e.currentTarget;
    const get = (n: string) =>
      ((f.elements.namedItem(n) as HTMLInputElement | HTMLTextAreaElement | null)?.value || "").trim();
    if (get("_honey")) { setStatus("sent"); f.reset(); return; }
    const name = get("name");
    const payload = {
      name,
      organisation: get("organisation"),
      email: get("email"),
      message: get("message"),
      _subject: `AMLI Pharma enquiry — ${name || "Website"}`,
      _template: "table",
      _captcha: "false"
    };
    setStatus("sending");
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("bad status");
      setStatus("sent");
      f.reset();
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => {
    document.documentElement.classList.add("reveal-ready");
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((item) => observer.observe(item));

    const header = document.querySelector(".site-header");
    const onScroll = () => {
      if (header) header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    // hero video cross-fade loop (family standard, framed variant)
    let raf = 0;
    const heroA = document.querySelector(".hero__video") as HTMLVideoElement | null;
    if (heroA && heroA.tagName === "VIDEO") {
      const heroB = heroA.cloneNode(true) as HTMLVideoElement;
      heroB.classList.add("hero__video--b");
      heroB.muted = true;
      heroB.loop = false;
      heroB.style.opacity = "0";
      heroA.loop = false;
      heroA.parentElement?.insertBefore(heroB, heroA.nextSibling);
      let front = heroA;
      let back = heroB;
      let swapping = false;
      const FADE = 0.9;
      void heroA.play().catch(() => undefined);
      const loop = () => {
        const d = front.duration;
        if (d && !swapping && front.currentTime >= d - FADE) {
          swapping = true;
          back.currentTime = 0;
          void back.play().catch(() => undefined);
          back.style.opacity = "1";
          front.style.opacity = "0";
          const tmp = front; front = back; back = tmp;
          window.setTimeout(() => { swapping = false; }, FADE * 1000);
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <header className="site-header">
        <nav className="nav" aria-label="Primary navigation">
          <a href="#home" className="nav__brand" aria-label="AMLI Pharma home">
            <Logo reversed />
          </a>
          <div className="nav__links">
            <a href="#about">About</a>
            <a href="#triecare">TRIE CARE</a>
            <a href="#platform">Platform</a>
            <a href="#app">The app</a>
          </div>
          <a className="nav__cta" href="#contact">
            Get in touch
          </a>
        </nav>
      </header>

      <main id="home">
        {/* HERO — full-bleed video + wine overlay (family standard, B형) */}
        <section className="hero">
          <video
            className="hero__video"
            autoPlay
            muted
            loop
            playsInline
            poster="/images/pharma-hero-poster.jpg"
            aria-hidden="true"
          >
            <source src="/videos/pharma-hero.mp4" type="video/mp4" />
          </video>
          <div className="hero__overlay" />
          <div className="hero__content">
            <div className="hero__copy hero__copy--animate">
              <p className="eyebrow eyebrow--hero">AMLI Pharma</p>
              <h1>
                We connect
                <br /> beauty and care.
              </h1>
              <p className="hero__subtitle">
                Beauty and care, brought together through TRIE CARE. Our first store
                opened in Tashkent, Uzbekistan, on 12 October 2026.
              </p>
              <div className="button-row">
                <a className="button button--secondary button--on-dark" href="#platform">
                  Our platform
                </a>
              </div>
              <ul className="hero__pillars" aria-label="What we bring together">
                {pillars.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section className="section section--intro" id="about" data-reveal>
          <div className="section__inner">
            <div className="section-heading section-heading--wide">
              <h2>Beauty and healthcare, under one roof.</h2>
              <p>
                AMLI Pharma is the health &amp; beauty company of AMLI Group. Today we run a
                distribution business in Malaysia, bringing beauty and personal-care products
                to retailers across the country. We have brought that experience to
                Central Asia through TRIE CARE, our retail and care brand, with our first
                store now open in Tashkent, Uzbekistan.
              </p>
              <p>
                AMLI Pharma is the company behind the brand — the name on the licences, the
                contracts and the partnerships.
              </p>
            </div>
          </div>
        </section>

        {/* TRIE CARE — the brand */}
        <section className="section section--brand" id="triecare" data-reveal>
          <div className="section__inner">
            <div className="section__inner--split">
              <div className="section-heading section-heading--flush">
                <h2>Meet TRIE CARE.</h2>
                <p>
                  One name for the store, the app and the bag. <strong>TRI is three</strong> —
                  beauty, pharmacy, telemedicine. Uzbek comes first in the brand&apos;s voice —
                  <em> Uchta parvarish, bitta sen</em> — with Russian and English alongside.
                </p>
                <p>
                  The symbol is the Bloom — three petals, a drop of serum, a drop of dew, a drop
                  of medicine, meeting at a single point. The point where they meet is the
                  customer.
                </p>
                <ul className="petal-legend" aria-label="What the three petals mean">
                  <li><span className="petal-dot petal-dot--plum" aria-hidden="true" />Pharmacy — trust and depth</li>
                  <li><span className="petal-dot petal-dot--coral" aria-hidden="true" />Beauty — energy and freshness</li>
                  <li><span className="petal-dot petal-dot--rose" aria-hidden="true" />Telemedicine — connection and warmth</li>
                </ul>
              </div>
              <div className="brand-panel brand-panel--store" data-reveal>
                <img
                  className="brand-panel__photo"
                  src="/images/triecare-tashkent-store.webp"
                  srcSet="/images/triecare-tashkent-store-800.webp 800w, /images/triecare-tashkent-store.webp 1600w"
                  sizes="(max-width: 1000px) 100vw, 650px"
                  width="1600"
                  height="1067"
                  alt="The TRIE CARE Tashkent store, with its wall sign and beauty and personal-care shelves."
                  loading="lazy"
                />
                <p className="brand-panel__slogan">Uchta parvarish.<br />Bitta sen.</p>
                <p className="brand-panel__slogan-alt">
                  Three cares. One you. <span aria-hidden="true">&middot;</span> Три заботы — одна ты.
                </p>
              </div>
            </div>
            <article className="feature-row store-opening" id="opening" aria-labelledby="opening-heading" data-reveal>
              <figure className="store-opening__media">
                <img
                  src="/images/triecare-grand-opening.webp"
                  srcSet="/images/triecare-grand-opening-800.webp 800w, /images/triecare-grand-opening.webp 1600w"
                  sizes="(max-width: 900px) 100vw, 600px"
                  width="1600"
                  height="1067"
                  alt="Ribbon cutting at the TRIE CARE grand opening in Tashkent on 12 October 2026."
                  loading="lazy"
                />
                <figcaption>Grand opening · Tashkent, Uzbekistan</figcaption>
              </figure>
              <div className="feature-row__body">
                <p className="store-opening__date"><time dateTime="2026-10-12">12 October 2026</time></p>
                <h3 id="opening-heading">Our doors are open in Tashkent.</h3>
                <p>
                  TRIE CARE marked its official launch with a ribbon-cutting ceremony,
                  bringing our beauty and pharmacy brand to Uzbekistan.
                </p>
              </div>
            </article>
          </div>
        </section>

        {/* PLATFORM */}
        <section className="section" id="platform" data-reveal>
          <div className="section__inner">
            <div className="section-heading section-heading--wide">
              <h2>Inside our Tashkent store.</h2>
              <p className="store-status"><time dateTime="2026-10-12">Opened 12 October 2026</time> · Tashkent</p>
              <p>
                Explore the store&apos;s beauty and pharmacy offering. The app and
                telemedicine platform remain in development.
              </p>
            </div>
            <div className="feature-rows">
              {platform.map((p, i) => (
                <article className={`feature-row${i % 2 ? " feature-row--flip" : ""}${i === 0 ? " feature-row--lead" : ""}`} key={p.zone} data-reveal>
                  <figure className="media-frame feature-row__media">
                    <img
                      src={p.img}
                      srcSet={p.srcSet}
                      sizes={i === 0 ? "(max-width: 900px) 100vw, 800px" : "(max-width: 900px) 100vw, 650px"}
                      width={p.width}
                      height={p.height}
                      alt={p.alt}
                      loading="lazy"
                    />
                  </figure>
                  <div className="feature-row__body">
                    {platformIcons[p.zone]}
                    <span className="zone-tag">{p.zone}</span>
                    <h3>{p.title}</h3>
                    <p>{p.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* THE APP + SAFETY — dark band with app visual (R2 — Halodoc pattern) */}
        <section className="section section--dark" id="app" data-reveal>
          <div className="section__inner">
            <div>
              <div>
                <div className="section-heading section-heading--wide section-heading--on-dark">
                  <h2>Care stays in physicians&apos; hands.</h2>
                  <p>
                    With the Tashkent store now open, the TRIE CARE app remains in development.
                    One assistant will help find the right product, give skincare advice, book a doctor when one is
                    needed, and remember the refill afterwards. Four rules govern how it will
                    work:
                  </p>
                </div>
                <ol className="practice-list practice-list--dark" aria-label="Operating principles">
                  {trust.map((t, i) => (
                    <li className="practice-row" key={t.label} data-reveal style={{ transitionDelay: `${i * 60}ms` }}>
                      <span className="practice-row__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                      <div className="practice-row__body">
                        <h3>{t.label}</h3>
                        <p>{t.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section className="section" id="contact" data-reveal>
          <div className="section__inner section__inner--contact">
            <div className="contact-details">
              <h2>Partner or connect with us.</h2>
              <p>
                For partnership, supply or general enquiries about AMLI Pharma, get in touch.
              </p>
            </div>
            <div className="callout callout--gold">
              <h2>Write to us.</h2>
              {status === "sent" ? (
                <div className="contact-form__success" role="status">
                  <p className="contact-form__success-title">Thank you — your message is on its way.</p>
                  <p>Our team will be in touch shortly.</p>
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleEnquiry}>
                  <div className="contact-form__row">
                    <input className="contact-form__input" type="text" name="name" placeholder="Name" autoComplete="name" required />
                    <input className="contact-form__input" type="text" name="organisation" placeholder="Organisation" autoComplete="organization" />
                  </div>
                  <input className="contact-form__input" type="email" name="email" placeholder="Email" autoComplete="email" required />
                  <textarea className="contact-form__input contact-form__textarea" name="message" placeholder="How can we help?" rows={4} required />
                  <input type="text" name="_honey" tabIndex={-1} autoComplete="off" aria-hidden="true" className="contact-form__honey" />
                  <button className="button button--primary" type="submit" disabled={status === "sending"}>
                    {status === "sending" ? "Sending…" : "Send enquiry"}
                  </button>
                  {status === "error" ? (
                    <p className="contact-form__note contact-form__note--error">
                      Something went wrong. Please email{" "}
                      <a className="text-link" href="mailto:pharma.contact@amli.group">pharma.contact@amli.group</a>.
                    </p>
                  ) : (
                    <p className="contact-form__note">Sent straight to our team &mdash; we typically reply within one working day.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer__inner">
          <div>
            <Logo reversed />
            <p>Anchored &middot; Merit &middot; Legacy &middot; Intent</p>
          </div>
          <div className="footer__columns">
            <div>
              <h3>AMLI Companies</h3>
              <a href="https://amli.group">AMLI Group</a>
              <a href="https://mountains.amli.group">AMLI Mountains</a>
              <a href="https://property.amli.group">AMLI Property</a>
              <a href="https://kredit.amli.group">AMLI Kredit</a>
              <a href="https://capital.amli.group">AMLI Asia Capital</a>
              <a href="https://greens.amli.group">AMLI Greens</a>
            </div>
            <div>
              <h3>Company</h3>
              <a href="#about">About</a>
              <a href="#triecare">TRIE CARE</a>
              <a href="#platform">Platform</a>
              <a href="#app">The app</a>
            </div>
            <div>
              <h3>Contact</h3>
              <a href="mailto:pharma.contact@amli.group">pharma.contact@amli.group</a>
              <a href="tel:+60362636464">+60 3-6263 6464</a>
            </div>
          </div>
        </div>
        <div className="footer__legal">
          <p>&copy; 2026 AMLI Pharma. An AMLI Group company.</p>
          <p>Kuala Lumpur, Malaysia</p>
        </div>
      </footer>
    </>
  );
}
